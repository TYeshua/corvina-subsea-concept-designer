from __future__ import annotations

from .models import (
    FPSO,
    FieldInfo,
    FluidProperties,
    InjectorWell,
    MeteoOceanData,
    ProducerWell,
    Scenario,
)


FIELD_INFO = FieldInfo(
    name="Corvina",
    block="FZM-59",
    basin="Foz do Amazonas",
    contract_regime="Concessão",
    water_depth_m=2300,
    reservoir_depth_m=5600,
    reservoir_type="arenitos turbidíticos",
    total_wells=8,
    producer_wells=5,
    injector_wells=3,
    expected_life_years=25,
    area_km2=90,
    west_limit_km=0,
    east_limit_km=10,
    south_limit_km=0,
    north_limit_km=9,
)


FPSO_DATA = FPSO(
    type="FPSO",
    storage_capacity_stb=1_800_000,
    production_lines_available=8,
    injection_lines=3,
    max_oil_processing_stb_d=180_000,
    max_gas_processing_mmscf_d=300,
    max_water_treatment_injection_stb_d=200_000,
    gas_consumption_mmscf_d=20,
)


PRODUCER_WELLS = [
    ProducerWell(
        id="P-01",
        full_name="7-CRV-1-APS",
        oil_rate_stb_d=32_000,
        water_rate_stb_d=2_800,
        gas_rate_mmscf_d=44.8,
        bsw_percent=8.0,
    ),
    ProducerWell(
        id="P-02",
        full_name="7-CRV-2-APS",
        oil_rate_stb_d=29_000,
        water_rate_stb_d=3_600,
        gas_rate_mmscf_d=40.6,
        bsw_percent=11.0,
    ),
    ProducerWell(
        id="P-03",
        full_name="7-CRV-4-APS",
        oil_rate_stb_d=31_000,
        water_rate_stb_d=3_000,
        gas_rate_mmscf_d=43.4,
        bsw_percent=8.8,
    ),
    ProducerWell(
        id="P-04",
        full_name="7-CRV-5-APS",
        oil_rate_stb_d=28_000,
        water_rate_stb_d=4_200,
        gas_rate_mmscf_d=39.2,
        bsw_percent=13.0,
    ),
    ProducerWell(
        id="P-05",
        full_name="7-CRV-8-APS",
        oil_rate_stb_d=30_000,
        water_rate_stb_d=3_400,
        gas_rate_mmscf_d=42.0,
        bsw_percent=10.2,
    ),
]


TOTAL_GAS_PRODUCTION_MMSCF_D = sum(
    well.gas_rate_mmscf_d for well in PRODUCER_WELLS
)
GAS_AVAILABLE_FOR_REINJECTION_MMSCF_D = (
    TOTAL_GAS_PRODUCTION_MMSCF_D - FPSO_DATA.gas_consumption_mmscf_d
)


INJECTOR_WELLS = [
    InjectorWell(
        id="I-01",
        full_name="8-CRV-3-APS",
        fluid="água tratada",
        rate=55_000,
        unit="BWPD",
    ),
    InjectorWell(
        id="I-02",
        full_name="8-CRV-6-APS",
        fluid="gás tratado",
        rate=GAS_AVAILABLE_FOR_REINJECTION_MMSCF_D,
        unit="MMSCF/d",
    ),
    InjectorWell(
        id="I-03",
        full_name="8-CRV-7-APS",
        fluid="água tratada",
        rate=56_000,
        unit="BWPD",
    ),
]


FLUID_PROPERTIES = FluidProperties(
    oil_type="parafínico",
    oil_api=30,
    oil_density_kg_m3=876,
    oil_viscosity_cp=12,
    gas_specific_gravity=0.75,
    water_salinity_mg_l=100_000,
    water_density_kg_m3=1030,
)


METEO_OCEAN_DATA = MeteoOceanData(
    predominant_current_direction="Nordeste para Sudoeste",
    average_current_velocity_m_s=1.2,
    design_current_velocity_m_s=2.3,
    significant_wave_height_m=3.5,
    max_wave_height_m=8.0,
    wave_peak_period_s=12,
)


SCENARIO = Scenario(
    field=FIELD_INFO,
    fpso=FPSO_DATA,
    producer_wells=PRODUCER_WELLS,
    injector_wells=INJECTOR_WELLS,
    fluids=FLUID_PROPERTIES,
    meteo_ocean=METEO_OCEAN_DATA,
)

