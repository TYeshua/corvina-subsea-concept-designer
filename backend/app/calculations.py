from __future__ import annotations

from .data import SCENARIO
from .models import CalculationResponse, CalculationStep, CalculationSummary


def _percent(value: float, capacity: float) -> float:
    if capacity == 0:
        return 0
    return round((value / capacity) * 100, 2)


def _format_br(value: float, decimals: int = 0) -> str:
    formatted = f"{value:,.{decimals}f}"
    return formatted.replace(",", "X").replace(".", ",").replace("X", ".")


def _sum_expression(values: list[float], decimals: int = 0) -> str:
    return " + ".join(_format_br(value, decimals) for value in values)


def calculate_field_indicators() -> CalculationResponse:
    """Calculate conceptual production indicators and detailed calculation memory."""
    producers = SCENARIO.producer_wells
    fpso = SCENARIO.fpso
    producer_count = len(producers)

    oil_rates = [well.oil_rate_stb_d for well in producers]
    water_rates = [well.water_rate_stb_d for well in producers]
    gas_rates = [well.gas_rate_mmscf_d for well in producers]
    bsw_values = [well.bsw_percent for well in producers]
    water_injection_rates = [
        well.rate
        for well in SCENARIO.injector_wells
        if well.unit == "BWPD" and "agua" in well.fluid.lower().replace("á", "a")
    ]

    total_oil = sum(oil_rates)
    total_water = sum(water_rates)
    total_gas = round(sum(gas_rates), 2)
    total_liquid = total_oil + total_water
    total_water_injection = sum(water_injection_rates)

    average_oil = total_oil / producer_count
    average_water = total_water / producer_count
    average_gas = total_gas / producer_count
    simple_average_bsw = sum(bsw_values) / producer_count
    weighted_bsw = _percent(total_water, total_liquid)

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
    replacement_ratio = _percent(total_water_injection, total_liquid)

    remaining_oil_capacity = fpso.max_oil_processing_stb_d - total_oil
    remaining_gas_capacity = fpso.max_gas_processing_mmscf_d - total_gas
    remaining_water_capacity = (
        fpso.max_water_treatment_injection_stb_d - total_water_injection
    )

    interpretation = [
        "A FPSO opera com ocupação elevada em óleo, exigindo atenção a expansões de produção.",
        "O BSW ponderado é mais representativo do campo porque considera as vazões totais de óleo e água.",
        "A injeção de água, isoladamente, não repõe integralmente a produção total de líquidos; a estratégia conceitual depende também da reinjeção de gás.",
        "Como não há infraestrutura prevista para exportação de gás, o gás disponível após o consumo da FPSO deve ser destinado preferencialmente à reinjeção.",
    ]

    summary = CalculationSummary(
        total_oil_rate_stb_d=round(total_oil, 2),
        total_water_rate_stb_d=round(total_water, 2),
        total_gas_rate_mmscf_d=round(total_gas, 2),
        total_liquid_rate_stb_d=round(total_liquid, 2),
        average_oil_rate_per_well_stb_d=round(average_oil, 2),
        average_water_rate_per_well_stb_d=round(average_water, 2),
        average_gas_rate_per_well_mmscf_d=round(average_gas, 2),
        weighted_bsw_percent=round(weighted_bsw, 2),
        simple_average_bsw_percent=round(simple_average_bsw, 2),
        fpso_oil_occupancy_percent=oil_occupancy,
        fpso_gas_occupancy_percent=gas_occupancy,
        fpso_produced_water_occupancy_percent=produced_water_occupancy,
        total_water_injection_rate_bwpd=round(total_water_injection, 2),
        water_treatment_injection_occupancy_percent=water_injection_occupancy,
        gas_available_for_reinjection_mmscf_d=round(gas_available_for_reinjection, 2),
        water_injection_liquid_replacement_ratio_percent=replacement_ratio,
        remaining_oil_capacity_stb_d=round(remaining_oil_capacity, 2),
        remaining_gas_capacity_mmscf_d=round(remaining_gas_capacity, 2),
        remaining_water_treatment_injection_capacity_stb_d=round(
            remaining_water_capacity,
            2,
        ),
        interpretation=interpretation,
    )

    detailed_steps = [
        CalculationStep(
            indicator="Produção total de óleo",
            formula="Qóleo,total = P-01 + P-02 + P-03 + P-04 + P-05",
            input_values=", ".join(
                f"{well.id}: {_format_br(well.oil_rate_stb_d)} STB/d"
                for well in producers
            ),
            calculation_steps=[
                f"Qóleo,total = {_sum_expression(oil_rates)}",
                f"Qóleo,total = {_format_br(total_oil)} STB/d",
            ],
            result=round(total_oil, 2),
            unit="STB/d",
            interpretation="Vazão total de óleo dos cinco poços produtores do cenário base.",
        ),
        CalculationStep(
            indicator="Produção total de água",
            formula="Qágua,total = Σ Qágua,produtor",
            input_values=", ".join(
                f"{well.id}: {_format_br(well.water_rate_stb_d)} STB/d"
                for well in producers
            ),
            calculation_steps=[
                f"Qágua,total = {_sum_expression(water_rates)}",
                f"Qágua,total = {_format_br(total_water)} STB/d",
            ],
            result=round(total_water, 2),
            unit="STB/d",
            interpretation="Água produzida associada à produção multifásica dos produtores.",
        ),
        CalculationStep(
            indicator="Produção total de gás",
            formula="Qgás,total = Σ Qgás,produtor",
            input_values=", ".join(
                f"{well.id}: {_format_br(well.gas_rate_mmscf_d, 1)} MMSCF/d"
                for well in producers
            ),
            calculation_steps=[
                f"Qgás,total = {_sum_expression(gas_rates, 1)}",
                f"Qgás,total = {_format_br(total_gas, 0)} MMSCF/d",
            ],
            result=round(total_gas, 2),
            unit="MMSCF/d",
            interpretation="Produção bruta de gás antes do consumo operacional da FPSO.",
        ),
        CalculationStep(
            indicator="Produção total de líquidos",
            formula="Qlíquidos,total = Qóleo,total + Qágua,total",
            input_values=(
                f"Qóleo,total: {_format_br(total_oil)} STB/d; "
                f"Qágua,total: {_format_br(total_water)} STB/d"
            ),
            calculation_steps=[
                f"Qlíquidos,total = {_format_br(total_oil)} + {_format_br(total_water)}",
                f"Qlíquidos,total = {_format_br(total_liquid)} STB/d",
            ],
            result=round(total_liquid, 2),
            unit="STB/d",
            interpretation="Produção líquida usada para avaliar reposição conceitual por injeção de água.",
        ),
        CalculationStep(
            indicator="Ocupação da FPSO em óleo",
            formula="Ocupação óleo = (Qóleo,total / Capacidade óleo FPSO) × 100",
            input_values=(
                f"Qóleo,total: {_format_br(total_oil)} STB/d; "
                f"Capacidade: {_format_br(fpso.max_oil_processing_stb_d)} STB/d"
            ),
            calculation_steps=[
                f"Ocupação óleo = ({_format_br(total_oil)} / {_format_br(fpso.max_oil_processing_stb_d)}) × 100",
                f"Ocupação óleo = {_format_br(oil_occupancy, 2)}%",
            ],
            result=oil_occupancy,
            unit="%",
            interpretation="Uso elevado da capacidade de processamento de óleo, ainda dentro do cenário conceitual.",
        ),
        CalculationStep(
            indicator="Ocupação da FPSO em gás",
            formula="Ocupação gás = (Qgás,total / Capacidade gás FPSO) × 100",
            input_values=(
                f"Qgás,total: {_format_br(total_gas)} MMSCF/d; "
                f"Capacidade: {_format_br(fpso.max_gas_processing_mmscf_d)} MMSCF/d"
            ),
            calculation_steps=[
                f"Ocupação gás = ({_format_br(total_gas)} / {_format_br(fpso.max_gas_processing_mmscf_d)}) × 100",
                f"Ocupação gás = {_format_br(gas_occupancy, 2)}%",
            ],
            result=gas_occupancy,
            unit="%",
            interpretation="A capacidade de processamento de gás possui margem no cenário base.",
        ),
        CalculationStep(
            indicator="Ocupação da FPSO em água produzida",
            formula="Ocupação água produzida = (Qágua,total / Capacidade tratamento água FPSO) × 100",
            input_values=(
                f"Qágua,total: {_format_br(total_water)} STB/d; "
                f"Capacidade: {_format_br(fpso.max_water_treatment_injection_stb_d)} STB/d"
            ),
            calculation_steps=[
                f"Ocupação água produzida = ({_format_br(total_water)} / {_format_br(fpso.max_water_treatment_injection_stb_d)}) × 100",
                f"Ocupação água produzida = {_format_br(produced_water_occupancy, 2)}%",
            ],
            result=produced_water_occupancy,
            unit="%",
            interpretation="Baixa ocupação relativa da capacidade de tratamento para a água produzida.",
        ),
        CalculationStep(
            indicator="Ocupação da capacidade de injeção/tratamento de água",
            formula="Ocupação injeção água = (Qinjeção,água / Capacidade água FPSO) × 100",
            input_values=(
                f"I-01: {_format_br(water_injection_rates[0])} BWPD; "
                f"I-03: {_format_br(water_injection_rates[1])} BWPD; "
                f"Capacidade: {_format_br(fpso.max_water_treatment_injection_stb_d)} STB/d"
            ),
            calculation_steps=[
                f"Qinjeção,água = {_sum_expression(water_injection_rates)}",
                f"Qinjeção,água = {_format_br(total_water_injection)} BWPD",
                f"Ocupação injeção água = ({_format_br(total_water_injection)} / {_format_br(fpso.max_water_treatment_injection_stb_d)}) × 100",
                f"Ocupação injeção água = {_format_br(water_injection_occupancy, 2)}%",
            ],
            result=water_injection_occupancy,
            unit="%",
            interpretation="A capacidade de tratamento/injeção de água preserva margem operacional conceitual.",
        ),
        CalculationStep(
            indicator="Produção média por poço produtor",
            formula="Média = Produção total / Nprodutores",
            input_values=f"Nprodutores: {producer_count}",
            calculation_steps=[
                f"Média óleo = {_format_br(total_oil)} / {producer_count} = {_format_br(average_oil)} STB/d",
                f"Média água = {_format_br(total_water)} / {producer_count} = {_format_br(average_water)} STB/d",
                f"Média gás = {_format_br(total_gas)} / {producer_count} = {_format_br(average_gas)} MMSCF/d",
            ],
            result=(
                f"Óleo: {_format_br(average_oil)} STB/d; "
                f"Água: {_format_br(average_water)} STB/d; "
                f"Gás: {_format_br(average_gas)} MMSCF/d"
            ),
            unit="médias por poço",
            interpretation="Médias simples úteis para leitura executiva do cenário base.",
        ),
        CalculationStep(
            indicator="BSW ponderado e BSW médio simples",
            formula="BSW campo = Qágua,total / (Qóleo,total + Qágua,total) × 100",
            input_values=(
                f"Qágua,total: {_format_br(total_water)} STB/d; "
                f"Qlíquidos,total: {_format_br(total_liquid)} STB/d; "
                f"BSWs: {_sum_expression(bsw_values, 1)}"
            ),
            calculation_steps=[
                f"BSW campo = {_format_br(total_water)} / {_format_br(total_liquid)} × 100",
                f"BSW campo ≈ {_format_br(weighted_bsw, 2)}%",
                f"BSW médio simples = ({_sum_expression(bsw_values, 1)}) / {producer_count}",
                f"BSW médio simples = {_format_br(simple_average_bsw, 1)}%",
            ],
            result=f"Ponderado: {_format_br(weighted_bsw, 2)}%; simples: {_format_br(simple_average_bsw, 1)}%",
            unit="%",
            interpretation="O BSW ponderado é mais representativo do campo porque considera as vazões totais de óleo e água.",
        ),
        CalculationStep(
            indicator="Gás disponível para reinjeção",
            formula="Gás disponível para reinjeção = Gás produzido total - Consumo de gás da FPSO",
            input_values=(
                f"Gás produzido: {_format_br(total_gas)} MMSCF/d; "
                f"Consumo FPSO: {_format_br(fpso.gas_consumption_mmscf_d)} MMSCF/d"
            ),
            calculation_steps=[
                f"Gás disponível para reinjeção = {_format_br(total_gas)} - {_format_br(fpso.gas_consumption_mmscf_d)}",
                f"Gás disponível para reinjeção = {_format_br(gas_available_for_reinjection)} MMSCF/d",
            ],
            result=round(gas_available_for_reinjection, 2),
            unit="MMSCF/d",
            interpretation="Como não há exportação de gás prevista, o excedente deve ser destinado à reinjeção.",
        ),
        CalculationStep(
            indicator="Compatibilidade simplificada da injeção de água com produção líquida",
            formula="Razão injeção água / produção de líquidos = Qinjeção,água / Qlíquidos,total × 100",
            input_values=(
                f"Qinjeção,água: {_format_br(total_water_injection)} BWPD; "
                f"Qlíquidos,total: {_format_br(total_liquid)} STB/d"
            ),
            calculation_steps=[
                f"Razão = {_format_br(total_water_injection)} / {_format_br(total_liquid)} × 100",
                f"Razão ≈ {_format_br(replacement_ratio, 2)}%",
            ],
            result=replacement_ratio,
            unit="%",
            interpretation=(
                "A vazão de injeção de água representa aproximadamente 66,5% da produção total de líquidos. "
                "Portanto, isoladamente, a injeção de água não repõe integralmente o volume líquido produzido. "
                "A reinjeção de gás complementa a estratégia conceitual de manutenção de pressão."
            ),
        ),
    ]

    return CalculationResponse(summary=summary, detailed_steps=detailed_steps)
