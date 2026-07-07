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
        }

    if asset.type in {"producer_well", "water_injector_well", "gas_injector_well"}:
        return asset.technical_data

    if asset.type == "production_manifold":
        return {
            "recommended_quantity": 2,
            "cluster_strategy": "agrupamento de produtores para reduzir jumpers e organizar a coleta",
        }

    if asset.type == "water_injection_manifold":
        return {
            "service": "distribuição de água tratada",
            "connected_injectors": ["I-01", "I-03"],
        }

    if asset.type == "gas_plet":
        return {
            "service": "reinjeção de gás tratado",
            "connected_injector": "I-02",
        }

    if asset.type == "sdu":
        return {
            "service": "distribuição submarina de energia, sinal, hidráulica e químicos",
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
            "water_depth_m": 2300,
            "seabed_y": -2300,
            "sea_surface_y": 0,
            "vertical_scale_note": "escala vertical conceitual, não proporcional",
            "digital_twin_type": "conceitual/sintético",
            "horizontal_coordinate_unit": "km",
            "vertical_coordinate_unit": "m",
        },
        "assets": assets,
        "connections": connections,
    }
