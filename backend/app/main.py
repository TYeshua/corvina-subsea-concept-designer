from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .calculations import calculate_field_indicators
from .data import SCENARIO
from .digital_twin import get_digital_twin_data
from .equipment import get_equipment_recommendations
from .layout import get_layout_data
from .models import CalculationResponse, EquipmentRecommendation, Scenario
from .report import generate_report_text


class PdfImagePayload(BaseModel):
    layout2d_image_base64: str | None = None
    digital_twin_image_base64: str | None = None


app = FastAPI(
    title="Corvina Subsea Concept Designer API",
    description=(
        "API para apoio ao projeto conceitual do sistema submarino de producao "
        "do Campo Corvina, incluindo dados do cenario, calculos, recomendacoes "
        "de equipamentos, layout conceitual, gemeo digital conceitual 3D e PDF."
    ),
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {
        "message": "API do Corvina Subsea Concept Designer esta ativa.",
    }


@app.get("/api/scenario/corvina", response_model=Scenario)
def read_corvina_scenario() -> Scenario:
    return SCENARIO


@app.get("/api/calculate", response_model=CalculationResponse)
def read_calculations() -> CalculationResponse:
    return calculate_field_indicators()


@app.get("/api/equipment", response_model=list[EquipmentRecommendation])
def read_equipment_recommendations() -> list[EquipmentRecommendation]:
    return get_equipment_recommendations()


@app.get("/api/layout")
def read_layout() -> dict[str, Any]:
    return get_layout_data()


@app.get("/api/digital-twin")
def read_digital_twin() -> dict[str, Any]:
    return get_digital_twin_data()


@app.get("/api/report")
def read_report() -> dict[str, object]:
    try:
        return generate_report_text()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Erro ao gerar texto-base para relatorio.",
        ) from exc


@app.get("/api/report/pdf")
def read_report_pdf() -> StreamingResponse:
    from .pdf_report import generate_pdf_report

    pdf = generate_pdf_report()
    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="relatorio-campo-corvina.pdf"'
        },
    )


@app.post("/api/report/pdf-with-images")
def read_report_pdf_with_images(payload: PdfImagePayload) -> StreamingResponse:
    from .pdf_report import generate_pdf_report

    pdf = generate_pdf_report(
        layout2d_image_base64=payload.layout2d_image_base64,
        digital_twin_image_base64=payload.digital_twin_image_base64,
    )
    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="relatorio-campo-corvina.pdf"'
        },
    )
