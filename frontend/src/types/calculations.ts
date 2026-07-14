export interface CalculationSummary {
  total_oil_rate_stb_d: number;
  total_water_rate_stb_d: number;
  total_gas_rate_mmscf_d: number;
  total_liquid_rate_stb_d: number;
  average_oil_rate_per_well_stb_d: number;
  average_water_rate_per_well_stb_d: number;
  average_gas_rate_per_well_mmscf_d: number;
  weighted_bsw_percent: number;
  simple_average_bsw_percent: number;
  fpso_oil_occupancy_percent: number;
  fpso_gas_occupancy_percent: number;
  fpso_produced_water_occupancy_percent: number;
  total_water_injection_rate_bwpd: number;
  water_treatment_injection_occupancy_percent: number;
  gas_available_for_reinjection_mmscf_d: number;
  water_injection_liquid_replacement_ratio_percent: number;
  remaining_oil_capacity_stb_d: number;
  remaining_gas_capacity_mmscf_d: number;
  remaining_water_treatment_injection_capacity_stb_d: number;
  interpretation: string[];
}

export interface CalculationStep {
  indicator: string;
  formula: string;
  input_values: string;
  calculation_steps: string[];
  result: number | string;
  unit: string;
  interpretation: string;
}

export interface CalculationResponse {
  summary: CalculationSummary;
  detailed_steps: CalculationStep[];
}

