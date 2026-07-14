from __future__ import annotations

from typing import Any

from .data import SCENARIO
from .layout import get_layout_data
from .models import DigitalTwinAsset, DigitalTwinConnection, LayoutAsset


def _visual_style(connection_type: str) -> dict[str, Any]:
    styles = {
        "production_flowline": {"color": "#d97706", "line_width": 3, "dashed": False},
        "water_injection_flowline": {"color": "#2563eb", "line_width": 3, "dashed": False},
        "gas_injection_flowline": {"color": "#7c3aed", "line_width": 3, "dashed": False},
        "riser": {"color": "#dc2626", "line_width": 4, "dashed": False},
        "umbilical": {"color": "#16a34a", "line_width": 2, "dashed": True},
        "control_link": {"color": "#0891b2", "line_width": 2, "dashed": True},
        "jumper": {"color": "#f97316", "line_width": 2, "dashed": False},
    }
    return styles.get(connection_type, {"color": "#64748b", "line_width": 2, "dashed": False})


def _connection_ids(asset_id: str, connections: list[dict[str, Any]]) -> list[str]:
    return [
        f"{connection['from']}->{connection['to']}"
        for connection in connections
        if connection["from"] == asset_id or connection["to"] == asset_id
    ]


def _technical_data_for_asset(asset: LayoutAsset) -> dict[str, Any]:
    if asset.type == "fpso":
        return {
            **asset.technical_data,
            "gas_consumption_mmscf_d": SCENARIO.fpso.gas_consumption_mmscf_d,
            "available_production_lines": SCENARIO.fpso.production_lines_available,
            "injection_lines": SCENARIO.fpso.injection_lines,
            "installation_depth_m": 0,
        }

    if asset.type in {"producer_well", "water_injector_well", "gas_injector_well"}:
        return {
            **asset.technical_data,
            "wellhead_depth_m": SCENARIO.field.water_depth_m,
            "reservoir_depth_m": SCENARIO.field.reservoir_depth_m,
            "depth_note": (
                "A arvore submarina fica no leito marinho, a cerca de 2.300 m. "
                "A trajetoria do poco segue conceitualmente ate o reservatorio a 5.600 m."
            ),
        }

    if asset.type == "production_manifold":
        return {
            "recommended_quantity": 2,
            "installation_depth_m": SCENARIO.field.water_depth_m,
            "cluster_strategy": "agrupamento de produtores para reduzir jumpers e organizar a coleta",
        }

    if asset.type == "water_injection_manifold":
        return {
            "service": "distribuicao de agua tratada",
            "installation_depth_m": SCENARIO.field.water_depth_m,
            "connected_injectors": ["I-01", "I-03"],
        }

    if asset.type == "gas_plet":
        return {
            "service": "reinjeccao de gas tratado",
            "installation_depth_m": SCENARIO.field.water_depth_m,
            "connected_injector": "I-02",
        }

    if asset.type == "sdu":
        return {
            "installation_depth_m": SCENARIO.field.water_depth_m,
            "service": "distribuicao submarina de energia, sinal, hidraulica e quimicos",
        }

    return asset.technical_data


def get_digital_twin_data() -> dict[str, Any]:
    """Convert the conceptual 2D layout into simplified 3D twin data."""
    layout_data = get_layout_data()
    layout_connections = [
        connection.model_dump(by_alias=True) for connection in layout_data["connections"]
    ]

    assets = []
    for asset in layout_data["assets"]:
        vertical_position = 0 if asset.id == "FPSO" else -SCENARIO.field.water_depth_m
        assets.append(
            DigitalTwinAsset(
                id=asset.id,
                name=asset.name,
                type=asset.type,
                position=[asset.x_km, vertical_position, asset.y_km],
                function=asset.function,
                technical_data=_technical_data_for_asset(asset),
                connections=_connection_ids(asset.id, layout_connections),
            )
        )

    wellbores = [
        {
            "id": f"WB-{asset.id}",
            "well_id": asset.id,
            "type": asset.type,
            "from_position": [asset.x_km, -SCENARIO.field.water_depth_m, asset.y_km],
            "to_position": [asset.x_km, -SCENARIO.field.reservoir_depth_m, asset.y_km],
            "description": (
                "Trajetoria conceitual entre a arvore submarina no leito marinho "
                "e o reservatorio a aproximadamente 5.600 m de profundidade."
            ),
        }
        for asset in layout_data["assets"]
        if asset.type in {"producer_well", "water_injector_well", "gas_injector_well"}
    ]

    connections = [
        DigitalTwinConnection(
            **{
                "from": connection["from"],
                "to": connection["to"],
                "type": connection["type"],
                "fluid_or_service": connection["fluid_or_service"],
                "flow_direction": connection["flow_direction"],
                "visual_style": _visual_style(connection["type"]),
            }
        )
        for connection in layout_connections
    ]

    return {
        "metadata": {
            "water_depth_m": SCENARIO.field.water_depth_m,
            "reservoir_depth_m": SCENARIO.field.reservoir_depth_m,
            "sea_surface_y": 0,
            "seabed_y": -SCENARIO.field.water_depth_m,
            "reservoir_y": -SCENARIO.field.reservoir_depth_m,
            "water_depth_note": (
                "A lamina d'agua e de 2.300 m. O reservatorio encontra-se a "
                "aproximadamente 5.600 m de profundidade. A escala vertical foi "
                "comprimida para visualizacao."
            ),
            "reservoir_label": "Reservatorio turbiditico - profundidade aproximada: 5.600 m",
            "vertical_scale_note": "escala vertical conceitual, comprimida e nao proporcional",
            "digital_twin_type": "gemeo digital conceitual/sintetico",
            "horizontal_coordinate_unit": "km",
            "vertical_coordinate_unit": "m",
            "subsea_equipment_depth_m": SCENARIO.field.water_depth_m,
            "reservoir_to_seabed_difference_m": (
                SCENARIO.field.reservoir_depth_m - SCENARIO.field.water_depth_m
            ),
            "architecture_summary": {
                "producer_wells": 5,
                "water_injectors": 2,
                "gas_injectors": 1,
                "production_manifolds": 2,
                "water_manifolds": 1,
                "gas_plets": 1,
                "sdus": 3,
                "main_risers": 4,
                "main_umbilicals": 3,
                "well_jumpers": 8,
            },
            "conceptual_risks": [
                "Oleo parafinico: risco de deposicao de parafina.",
                "Lamina d'agua elevada: maior complexidade de risers e instalacao.",
                "Correntes intensas: impacto em risers, umbilicais e campanhas offshore.",
                "Sem exportacao de gas: necessidade de reinjecao.",
                "Alta ocupacao da FPSO em oleo: baixa margem para expansao de producao.",
            ],
        },
        "assets": assets,
        "connections": connections,
        "wellbores": wellbores,
    }
