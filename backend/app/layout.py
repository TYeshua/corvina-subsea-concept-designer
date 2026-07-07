from __future__ import annotations

from typing import Any

from .data import SCENARIO
from .models import LayoutAsset, LayoutConnection


def _asset(
    asset_id: str,
    name: str,
    asset_type: str,
    x_km: float,
    y_km: float,
    function: str,
    technical_data: dict[str, Any] | None = None,
) -> LayoutAsset:
    return LayoutAsset(
        id=asset_id,
        name=name,
        type=asset_type,
        x_km=x_km,
        y_km=y_km,
        function=function,
        technical_data=technical_data or {},
    )


def _connection(
    from_asset: str,
    to_asset: str,
    connection_type: str,
    fluid_or_service: str,
    flow_direction: str,
    description: str,
) -> LayoutConnection:
    return LayoutConnection(
        from_asset=from_asset,
        to_asset=to_asset,
        type=connection_type,
        fluid_or_service=fluid_or_service,
        flow_direction=flow_direction,
        description=description,
    )


def get_layout_data() -> dict[str, Any]:
    """Return structured conceptual data for a future 2D field layout."""
    producers = {well.id: well for well in SCENARIO.producer_wells}
    injectors = {well.id: well for well in SCENARIO.injector_wells}

    assets = [
        _asset(
            "FPSO",
            "FPSO Corvina",
            "fpso",
            5.0,
            9.8,
            "Processamento, armazenamento e transferência da produção.",
            {
                "storage_capacity_stb": SCENARIO.fpso.storage_capacity_stb,
                "max_oil_processing_stb_d": SCENARIO.fpso.max_oil_processing_stb_d,
                "max_gas_processing_mmscf_d": SCENARIO.fpso.max_gas_processing_mmscf_d,
                "max_water_treatment_injection_stb_d": SCENARIO.fpso.max_water_treatment_injection_stb_d,
            },
        ),
        _asset("P-01", "P-01 / 7-CRV-1-APS", "producer_well", 2.0, 5.8, "Produção de óleo, água e gás.", producers["P-01"].model_dump()),
        _asset("P-02", "P-02 / 7-CRV-2-APS", "producer_well", 2.8, 4.9, "Produção de óleo, água e gás.", producers["P-02"].model_dump()),
        _asset("P-03", "P-03 / 7-CRV-4-APS", "producer_well", 3.4, 5.7, "Produção de óleo, água e gás.", producers["P-03"].model_dump()),
        _asset("P-04", "P-04 / 7-CRV-5-APS", "producer_well", 6.5, 4.6, "Produção de óleo, água e gás.", producers["P-04"].model_dump()),
        _asset("P-05", "P-05 / 7-CRV-8-APS", "producer_well", 7.4, 5.5, "Produção de óleo, água e gás.", producers["P-05"].model_dump()),
        _asset("I-01", "I-01 / 8-CRV-3-APS", "water_injector_well", 1.4, 3.2, "Injeção de água tratada.", injectors["I-01"].model_dump()),
        _asset("I-02", "I-02 / 8-CRV-6-APS", "gas_injector_well", 5.0, 6.6, "Reinjeção de gás tratado.", injectors["I-02"].model_dump()),
        _asset("I-03", "I-03 / 8-CRV-7-APS", "water_injector_well", 8.6, 3.2, "Injeção de água tratada.", injectors["I-03"].model_dump()),
        _asset("MP-01", "Manifold de Produção 01", "production_manifold", 2.8, 5.4, "Coleta do cluster oeste de poços produtores."),
        _asset("MP-02", "Manifold de Produção 02", "production_manifold", 6.9, 5.0, "Coleta do cluster leste de poços produtores."),
        _asset("MI-WATER", "Manifold de Injeção de Água", "water_injection_manifold", 5.0, 3.0, "Distribuição de água tratada para injeção."),
        _asset("PLET-GAS", "PLET de Injeção de Gás", "gas_plet", 5.0, 6.1, "Distribuição conceitual de gás tratado para reinjeção."),
        _asset("SDU-01", "SDU 01", "sdu", 3.1, 5.0, "Distribuição de energia, sinal, hidráulica e químicos para MP-01."),
        _asset("SDU-02", "SDU 02", "sdu", 6.6, 4.7, "Distribuição de energia, sinal, hidráulica e químicos para MP-02."),
        _asset("SDU-03", "SDU 03", "sdu", 5.2, 3.3, "Distribuição de energia, sinal, hidráulica e químicos para injeção."),
    ]

    connections = [
        _connection("P-01", "MP-01", "jumper", "produção multifásica", "P-01 para MP-01", "Jumper de produção conectando P-01 ao manifold MP-01."),
        _connection("P-02", "MP-01", "jumper", "produção multifásica", "P-02 para MP-01", "Jumper de produção conectando P-02 ao manifold MP-01."),
        _connection("P-03", "MP-01", "jumper", "produção multifásica", "P-03 para MP-01", "Jumper de produção conectando P-03 ao manifold MP-01."),
        _connection("P-04", "MP-02", "jumper", "produção multifásica", "P-04 para MP-02", "Jumper de produção conectando P-04 ao manifold MP-02."),
        _connection("P-05", "MP-02", "jumper", "produção multifásica", "P-05 para MP-02", "Jumper de produção conectando P-05 ao manifold MP-02."),
        _connection("I-01", "MI-WATER", "water_injection_flowline", "água tratada", "MI-WATER para I-01", "Interligação de injeção de água entre o manifold e o poço I-01."),
        _connection("I-03", "MI-WATER", "water_injection_flowline", "água tratada", "MI-WATER para I-03", "Interligação de injeção de água entre o manifold e o poço I-03."),
        _connection("FPSO", "MI-WATER", "water_injection_flowline", "água tratada", "FPSO para MI-WATER", "Linha principal de injeção de água tratada a partir da FPSO."),
        _connection("FPSO", "PLET-GAS", "gas_injection_flowline", "gás tratado", "FPSO para PLET-GAS", "Linha principal de reinjeção de gás tratado a partir da FPSO."),
        _connection("PLET-GAS", "I-02", "gas_injection_flowline", "gás tratado", "PLET-GAS para I-02", "Interligação de gás tratado entre o PLET e o poço injetor de gás."),
        _connection("MP-01", "FPSO", "riser", "produção multifásica", "MP-01 para FPSO", "Riser de produção do manifold MP-01 até a FPSO."),
        _connection("MP-02", "FPSO", "riser", "produção multifásica", "MP-02 para FPSO", "Riser de produção do manifold MP-02 até a FPSO."),
        _connection("FPSO", "SDU-01", "umbilical", "controle, energia e químicos", "FPSO para SDU-01", "Umbilical eletro-hidráulico multiplexado para o cluster oeste."),
        _connection("FPSO", "SDU-02", "umbilical", "controle, energia e químicos", "FPSO para SDU-02", "Umbilical eletro-hidráulico multiplexado para o cluster leste."),
        _connection("FPSO", "SDU-03", "umbilical", "controle, energia e químicos", "FPSO para SDU-03", "Umbilical eletro-hidráulico multiplexado para o sistema de injeção."),
        _connection("SDU-01", "MP-01", "control_link", "controle submarino", "SDU-01 para MP-01", "Ligação de controle entre SDU-01 e MP-01."),
        _connection("SDU-02", "MP-02", "control_link", "controle submarino", "SDU-02 para MP-02", "Ligação de controle entre SDU-02 e MP-02."),
        _connection("SDU-03", "MI-WATER", "control_link", "controle submarino", "SDU-03 para MI-WATER", "Ligação de controle entre SDU-03 e o manifold de água."),
        _connection("SDU-03", "PLET-GAS", "control_link", "controle submarino", "SDU-03 para PLET-GAS", "Ligação de controle entre SDU-03 e o PLET de gás."),
    ]

    return {
        "metadata": {
            "field_width_km": 10,
            "field_height_km": 9,
            "north_direction": "up",
            "current_direction": "NE to SW",
            "current_design_velocity_m_s": 2.3,
            "layout_score": 87,
        },
        "assets": assets,
        "connections": connections,
    }
