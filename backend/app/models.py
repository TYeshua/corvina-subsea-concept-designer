from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class FieldInfo(BaseModel):
    name: str
    block: str
    basin: str
    contract_regime: str
    water_depth_m: float
    reservoir_depth_m: float
    reservoir_type: str
    total_wells: int
    producer_wells: int
    injector_wells: int
    expected_life_years: int
    area_km2: float
    west_limit_km: float
    east_limit_km: float
    south_limit_km: float
    north_limit_km: float


class FPSO(BaseModel):
    type: str
    storage_capacity_stb: float
    production_lines_available: int
    injection_lines: int
    max_oil_processing_stb_d: float
    max_gas_processing_mmscf_d: float
    max_water_treatment_injection_stb_d: float
    gas_consumption_mmscf_d: float


class ProducerWell(BaseModel):
    id: str
    full_name: str
    oil_rate_stb_d: float
    water_rate_stb_d: float
    gas_rate_mmscf_d: float
    bsw_percent: float


class InjectorWell(BaseModel):
    id: str
    full_name: str
    fluid: str
    rate: float
    unit: str


class FluidProperties(BaseModel):
    oil_type: str
    oil_api: float
    oil_density_kg_m3: float
    oil_viscosity_cp: float
    gas_specific_gravity: float
    water_salinity_mg_l: float
    water_density_kg_m3: float


class MeteoOceanData(BaseModel):
    predominant_current_direction: str
    average_current_velocity_m_s: float
    design_current_velocity_m_s: float
    significant_wave_height_m: float
    max_wave_height_m: float
    wave_peak_period_s: float


class Scenario(BaseModel):
    field: FieldInfo
    fpso: FPSO
    producer_wells: list[ProducerWell]
    injector_wells: list[InjectorWell]
    fluids: FluidProperties
    meteo_ocean: MeteoOceanData


class CalculationSummary(BaseModel):
    total_oil_rate_stb_d: float
    total_water_rate_stb_d: float
    total_gas_rate_mmscf_d: float
    total_liquid_rate_stb_d: float
    average_oil_rate_per_well_stb_d: float
    average_water_rate_per_well_stb_d: float
    average_gas_rate_per_well_mmscf_d: float
    weighted_bsw_percent: float
    simple_average_bsw_percent: float
    fpso_oil_occupancy_percent: float
    fpso_gas_occupancy_percent: float
    fpso_produced_water_occupancy_percent: float
    total_water_injection_rate_bwpd: float
    water_treatment_injection_occupancy_percent: float
    gas_available_for_reinjection_mmscf_d: float
    water_injection_liquid_replacement_ratio_percent: float
    remaining_oil_capacity_stb_d: float
    remaining_gas_capacity_mmscf_d: float
    remaining_water_treatment_injection_capacity_stb_d: float
    interpretation: list[str]


class CalculationStep(BaseModel):
    indicator: str
    formula: str
    input_values: str
    calculation_steps: list[str]
    result: float | str
    unit: str
    interpretation: str


class CalculationResponse(BaseModel):
    summary: CalculationSummary
    detailed_steps: list[CalculationStep]


class EquipmentRecommendation(BaseModel):
    id: str
    category: str
    name: str
    quantity: int
    type: str
    installation_location: str
    position_reference: str
    function: str
    connected_to: list[str]
    technical_justification: str
    operational_notes: str


class LayoutAsset(BaseModel):
    id: str
    name: str
    type: str
    x_km: float
    y_km: float
    function: str
    technical_data: dict[str, Any] = Field(default_factory=dict)


class LayoutConnection(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_asset: str = Field(alias="from")
    to_asset: str = Field(alias="to")
    type: str
    fluid_or_service: str
    flow_direction: str
    description: str


class DigitalTwinAsset(BaseModel):
    id: str
    name: str
    type: str
    position: list[float]
    function: str
    technical_data: dict[str, Any] = Field(default_factory=dict)
    connections: list[str] = Field(default_factory=list)


class DigitalTwinConnection(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_asset: str = Field(alias="from")
    to_asset: str = Field(alias="to")
    type: str
    fluid_or_service: str
    flow_direction: str
    visual_style: dict[str, Any]
