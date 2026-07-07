from __future__ import annotations

from .data import SCENARIO
from .models import CalculationResults


def _percent(value: float, capacity: float) -> float:
    if capacity == 0:
        return 0
    return round((value / capacity) * 100, 2)


def calculate_field_indicators() -> CalculationResults:
    """Calculate the main conceptual production indicators for Campo Corvina."""
    producers = SCENARIO.producer_wells
    fpso = SCENARIO.fpso
    producer_count = len(producers)

    total_oil = sum(well.oil_rate_stb_d for well in producers)
    total_water = sum(well.water_rate_stb_d for well in producers)
    total_gas = round(sum(well.gas_rate_mmscf_d for well in producers), 2)
    total_water_injection = sum(
        well.rate
        for well in SCENARIO.injector_wells
        if well.unit == "BWPD" and "água" in well.fluid
    )

    average_oil = total_oil / producer_count
    average_water = total_water / producer_count
    average_gas = total_gas / producer_count
    simple_average_bsw = sum(well.bsw_percent for well in producers) / producer_count

    gas_available_for_reinjection = total_gas - fpso.gas_consumption_mmscf_d

    oil_occupancy = _percent(total_oil, fpso.max_oil_processing_stb_d)
    gas_occupancy = _percent(total_gas, fpso.max_gas_processing_mmscf_d)
    produced_water_occupancy = _percent(
        total_water,
        fpso.max_water_treatment_injection_stb_d,
    )
    water_injection_occupancy = _percent(
        total_water_injection,
        fpso.max_water_treatment_injection_stb_d,
    )

    remaining_oil_capacity = fpso.max_oil_processing_stb_d - total_oil
    remaining_gas_capacity = fpso.max_gas_processing_mmscf_d - total_gas
    remaining_water_capacity = (
        fpso.max_water_treatment_injection_stb_d - total_water_injection
    )

    interpretation = [
        "A FPSO opera com alta ocupação da capacidade de processamento de óleo, porém ainda dentro do limite operacional.",
        "Como não há infraestrutura de exportação de gás, o excedente após o consumo da FPSO deve ser destinado preferencialmente à reinjeção.",
        "A capacidade de tratamento e injeção de água apresenta margem operacional significativa.",
    ]

    if simple_average_bsw <= 15:
        interpretation.append(
            "O BSW médio simples é moderado para a fase conceitual e não indica sobrecarga relevante na capacidade de tratamento de água produzida."
        )

    return CalculationResults(
        total_oil_rate_stb_d=round(total_oil, 2),
        total_water_rate_stb_d=round(total_water, 2),
        total_gas_rate_mmscf_d=round(total_gas, 2),
        average_oil_rate_per_well_stb_d=round(average_oil, 2),
        average_water_rate_per_well_stb_d=round(average_water, 2),
        average_gas_rate_per_well_mmscf_d=round(average_gas, 2),
        simple_average_bsw_percent=round(simple_average_bsw, 2),
        fpso_oil_occupancy_percent=oil_occupancy,
        fpso_gas_occupancy_percent=gas_occupancy,
        fpso_produced_water_occupancy_percent=produced_water_occupancy,
        total_water_injection_rate_bwpd=round(total_water_injection, 2),
        water_treatment_injection_occupancy_percent=water_injection_occupancy,
        gas_available_for_reinjection_mmscf_d=round(gas_available_for_reinjection, 2),
        remaining_oil_capacity_stb_d=round(remaining_oil_capacity, 2),
        remaining_gas_capacity_mmscf_d=round(remaining_gas_capacity, 2),
        remaining_water_treatment_injection_capacity_stb_d=round(
            remaining_water_capacity,
            2,
        ),
        interpretation=interpretation,
    )

