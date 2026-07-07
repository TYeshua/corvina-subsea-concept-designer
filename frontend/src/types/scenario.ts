export interface FieldInfo {
  name: string;
  block: string;
  basin: string;
  contract_regime: string;
  water_depth_m: number;
  reservoir_depth_m: number;
  reservoir_type: string;
  total_wells: number;
  producer_wells: number;
  injector_wells: number;
  expected_life_years: number;
  area_km2: number;
  west_limit_km: number;
  east_limit_km: number;
  south_limit_km: number;
  north_limit_km: number;
}

export interface FPSO {
  type: string;
  storage_capacity_stb: number;
  production_lines_available: number;
  injection_lines: number;
  max_oil_processing_stb_d: number;
  max_gas_processing_mmscf_d: number;
  max_water_treatment_injection_stb_d: number;
  gas_consumption_mmscf_d: number;
}

export interface ProducerWell {
  id: string;
  full_name: string;
  oil_rate_stb_d: number;
  water_rate_stb_d: number;
  gas_rate_mmscf_d: number;
  bsw_percent: number;
}

export interface InjectorWell {
  id: string;
  full_name: string;
  fluid: string;
  rate: number;
  unit: string;
}

export interface FluidProperties {
  oil_type: string;
  oil_api: number;
  oil_density_kg_m3: number;
  oil_viscosity_cp: number;
  gas_specific_gravity: number;
  water_salinity_mg_l: number;
  water_density_kg_m3: number;
}

export interface MeteoOceanData {
  predominant_current_direction: string;
  average_current_velocity_m_s: number;
  design_current_velocity_m_s: number;
  significant_wave_height_m: number;
  max_wave_height_m: number;
  wave_peak_period_s: number;
}

export interface Scenario {
  field: FieldInfo;
  fpso: FPSO;
  producer_wells: ProducerWell[];
  injector_wells: InjectorWell[];
  fluids: FluidProperties;
  meteo_ocean: MeteoOceanData;
}

