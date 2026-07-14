from __future__ import annotations

import base64
from io import BytesIO
from typing import Any

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from .calculations import calculate_field_indicators
from .data import SCENARIO
from .equipment import get_equipment_recommendations
from .layout import get_layout_data
from .report import generate_report_text


def _br(value: float, decimals: int = 0) -> str:
    formatted = f"{value:,.{decimals}f}"
    return formatted.replace(",", "X").replace(".", ",").replace("X", ".")


def _chart_image(title: str, labels: list[str], values: list[float], ylabel: str) -> BytesIO:
    buffer = BytesIO()
    fig, ax = plt.subplots(figsize=(7.2, 3.5), dpi=140)
    ax.bar(labels, values, color=["#22d3ee", "#34d399", "#60a5fa", "#facc15", "#a78bfa"][: len(labels)])
    ax.set_title(title)
    ax.set_ylabel(ylabel)
    ax.grid(axis="y", alpha=0.25)
    fig.tight_layout()
    fig.savefig(buffer, format="png", transparent=False)
    plt.close(fig)
    buffer.seek(0)
    return buffer


def _pie_like_chart(title: str, labels: list[str], values: list[float], ylabel: str) -> BytesIO:
    buffer = BytesIO()
    fig, ax = plt.subplots(figsize=(7.2, 3.5), dpi=140)
    ax.barh(labels, values, color="#38bdf8")
    ax.set_title(title)
    ax.set_xlabel(ylabel)
    ax.grid(axis="x", alpha=0.25)
    fig.tight_layout()
    fig.savefig(buffer, format="png", transparent=False)
    plt.close(fig)
    buffer.seek(0)
    return buffer


def _decode_image(data_url_or_base64: str | None) -> BytesIO | None:
    if not data_url_or_base64:
        return None

    payload = data_url_or_base64.split(",", 1)[-1]
    try:
        decoded = base64.b64decode(payload)
    except Exception:
        return None

    return BytesIO(decoded)


def _table(data: list[list[Any]], widths: list[float] | None = None) -> Table:
    table = Table(data, colWidths=widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#94a3b8")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ]
        )
    )
    return table


def generate_pdf_report(
    layout2d_image_base64: str | None = None,
    digital_twin_image_base64: str | None = None,
) -> BytesIO:
    """Generate a detailed technical PDF report."""
    report = generate_report_text()
    calculation_response = calculate_field_indicators()
    summary = calculation_response.summary
    steps = calculation_response.detailed_steps
    equipment = get_equipment_recommendations()
    layout = get_layout_data()
    producers = SCENARIO.producer_wells
    water_injectors = [
        well for well in SCENARIO.injector_wells if well.unit == "BWPD"
    ]

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.4 * cm,
        leftMargin=1.4 * cm,
        topMargin=1.2 * cm,
        bottomMargin=1.2 * cm,
        title="Relatorio Campo Corvina",
    )
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontSize=8,
            leading=10,
        )
    )
    story: list[Any] = []

    story.append(Paragraph("Corvina Subsea Concept Designer", styles["Title"]))
    story.append(Paragraph("Relatorio tecnico conceitual do sistema submarino de producao", styles["Heading2"]))
    story.append(Spacer(1, 0.4 * cm))
    story.append(
        Paragraph(
            "Ferramenta academica para apoio ao projeto conceitual do sistema submarino do Campo Corvina.",
            styles["BodyText"],
        )
    )
    story.append(Spacer(1, 0.5 * cm))
    story.append(
        _table(
            [
                ["Parametro", "Valor"],
                ["Campo", SCENARIO.field.name],
                ["Bloco / Bacia", f"{SCENARIO.field.block} / {SCENARIO.field.basin}"],
                ["Lamina d'agua", f"{_br(SCENARIO.field.water_depth_m)} m"],
                ["Profundidade do reservatorio", f"{_br(SCENARIO.field.reservoir_depth_m)} m"],
                ["Tipo de reservatorio", SCENARIO.field.reservoir_type],
            ],
            [6 * cm, 10 * cm],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("Sumario", styles["Heading1"]))
    for section in report["sections"]:
        story.append(Paragraph(str(section["title"]), styles["BodyText"]))
    story.append(PageBreak())

    for section in report["sections"]:
        story.append(Paragraph(str(section["title"]), styles["Heading1"]))
        story.append(Paragraph(str(section["text"]).replace("\n", "<br/>"), styles["Small"]))
        story.append(Spacer(1, 0.25 * cm))

    story.append(PageBreak())
    story.append(Paragraph("Tabelas de resultados", styles["Heading1"]))
    story.append(
        _table(
            [
                ["Indicador", "Valor", "Unidade"],
                ["Producao total de oleo", _br(summary.total_oil_rate_stb_d), "STB/d"],
                ["Producao total de agua", _br(summary.total_water_rate_stb_d), "STB/d"],
                ["Producao total de gas", _br(summary.total_gas_rate_mmscf_d), "MMSCF/d"],
                ["Producao total de liquidos", _br(summary.total_liquid_rate_stb_d), "STB/d"],
                ["BSW ponderado", _br(summary.weighted_bsw_percent, 2), "%"],
                ["BSW medio simples", _br(summary.simple_average_bsw_percent, 1), "%"],
                ["Gas disponivel para reinjecao", _br(summary.gas_available_for_reinjection_mmscf_d), "MMSCF/d"],
                ["Razao injecao agua / liquidos", _br(summary.water_injection_liquid_replacement_ratio_percent, 2), "%"],
            ],
            [8 * cm, 4 * cm, 4 * cm],
        )
    )
    story.append(Spacer(1, 0.4 * cm))

    producer_df = pd.DataFrame(
        [
            [
                well.id,
                _br(well.oil_rate_stb_d),
                _br(well.water_rate_stb_d),
                _br(well.gas_rate_mmscf_d, 1),
                _br(well.bsw_percent, 1),
            ]
            for well in producers
        ],
        columns=["Poco", "Oleo STB/d", "Agua STB/d", "Gas MMSCF/d", "BSW %"],
    )
    story.append(_table([producer_df.columns.tolist(), *producer_df.values.tolist()]))

    story.append(PageBreak())
    story.append(Paragraph("Graficos", styles["Heading1"]))
    charts = [
        _chart_image("Producao de oleo por poco", [well.id for well in producers], [well.oil_rate_stb_d for well in producers], "STB/d"),
        _chart_image("Producao de agua por poco", [well.id for well in producers], [well.water_rate_stb_d for well in producers], "STB/d"),
        _chart_image("Producao de gas por poco", [well.id for well in producers], [well.gas_rate_mmscf_d for well in producers], "MMSCF/d"),
        _pie_like_chart(
            "Ocupacao da FPSO",
            ["Oleo", "Gas", "Agua prod.", "Inj./trat. agua"],
            [
                summary.fpso_oil_occupancy_percent,
                summary.fpso_gas_occupancy_percent,
                summary.fpso_produced_water_occupancy_percent,
                summary.water_treatment_injection_occupancy_percent,
            ],
            "%",
        ),
        _chart_image(
            "Balanco de gas",
            ["Produzido", "Consumo FPSO", "Reinjecao"],
            [
                summary.total_gas_rate_mmscf_d,
                SCENARIO.fpso.gas_consumption_mmscf_d,
                summary.gas_available_for_reinjection_mmscf_d,
            ],
            "MMSCF/d",
        ),
        _chart_image(
            "Producao liquida vs injecao de agua",
            ["Liquidos", "Injecao agua"],
            [summary.total_liquid_rate_stb_d, summary.total_water_injection_rate_bwpd],
            "STB/d ou BWPD",
        ),
        _chart_image("BSW por poco", [well.id for well in producers], [well.bsw_percent for well in producers], "%"),
        _chart_image(
            "Quantidade de equipamentos por categoria",
            [item.name[:14] for item in equipment[:8]],
            [item.quantity for item in equipment[:8]],
            "Quantidade",
        ),
    ]
    for chart in charts:
        story.append(Image(chart, width=16 * cm, height=7.8 * cm))
        story.append(Spacer(1, 0.3 * cm))

    story.append(PageBreak())
    story.append(Paragraph("Inventario de equipamentos", styles["Heading1"]))
    equipment_rows = [["Equipamento", "Qtd.", "Tipo", "Conectado a", "Justificativa"]]
    for item in equipment:
        equipment_rows.append(
            [
                item.name,
                str(item.quantity),
                item.type,
                ", ".join(item.connected_to),
                item.technical_justification,
            ]
        )
    story.append(_table(equipment_rows, [3.3 * cm, 1.1 * cm, 3.4 * cm, 3.6 * cm, 5.5 * cm]))

    story.append(PageBreak())
    story.append(Paragraph("Layout em planta e gemeo digital conceitual", styles["Heading1"]))
    story.append(
        Paragraph(
            f"O layout contem {len(layout['assets'])} ativos e {len(layout['connections'])} conexoes. "
            "A representacao e conceitual e usa coordenadas em quilometros para apoiar a comunicacao do arranjo.",
            styles["BodyText"],
        )
    )
    for title, image_data in [
        ("Layout 2D capturado pela interface", _decode_image(layout2d_image_base64)),
        ("Gemeo digital conceitual 3D capturado pela interface", _decode_image(digital_twin_image_base64)),
    ]:
        story.append(Spacer(1, 0.25 * cm))
        story.append(Paragraph(title, styles["Heading2"]))
        if image_data:
            story.append(Image(image_data, width=16 * cm, height=9 * cm))
        else:
            story.append(
                Paragraph(
                    "Imagem nao enviada pela interface. O relatorio inclui a descricao tecnica e os dados estruturados.",
                    styles["BodyText"],
                )
            )

    story.append(PageBreak())
    story.append(Paragraph("Memoria de calculo estruturada", styles["Heading1"]))
    for step in steps:
        story.append(Paragraph(step.indicator, styles["Heading2"]))
        story.append(Paragraph(f"Formula: {step.formula}", styles["Small"]))
        story.append(Paragraph(f"Valores: {step.input_values}", styles["Small"]))
        story.append(Paragraph(" | ".join(step.calculation_steps), styles["Small"]))
        story.append(Paragraph(f"Resultado: {step.result} {step.unit}", styles["Small"]))
        story.append(Paragraph(step.interpretation, styles["Small"]))
        story.append(Spacer(1, 0.2 * cm))

    doc.build(story)
    buffer.seek(0)
    return buffer
