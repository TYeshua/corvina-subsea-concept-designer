export interface CalculationResults {
  total_oil_rate_stb_d: number;
  total_water_rate_stb_d: number;
  total_gas_rate_mmscf_d: number;
  average_oil_rate_per_well_stb_d: number;
  average_water_rate_per_well_stb_d: number;
  average_gas_rate_per_well_mmscf_d: number;
  simple_average_bsw_percent: number;
  fpso_oil_occupancy_percent: number;
  fpso_gas_occupancy_percent: number;
  fpso_produced_water_occupancy_percent: number;
  total_water_injection_rate_bwpd: number;
  water_treatment_injection_occupancy_percent: number;
  gas_available_for_reinjection_mmscf_d: number;
  remaining_oil_capacity_stb_d: number;
  remaining_gas_capacity_mmscf_d: number;
  remaining_water_treatment_injection_capacity_stb_d: number;
  interpretation: string[];
}

