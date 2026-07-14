export type DigitalTwinAssetType =
  | "fpso"
  | "producer_well"
  | "water_injector_well"
  | "gas_injector_well"
  | "production_manifold"
  | "water_injection_manifold"
  | "gas_plet"
  | "sdu"
  | "unknown";

export type DigitalTwinConnectionType =
  | "production_flowline"
  | "water_injection_flowline"
  | "gas_injection_flowline"
  | "riser"
  | "umbilical"
  | "control_link"
  | "jumper"
  | "unknown";

export interface DigitalTwinAsset {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  function?: string;
  technical_data?: Record<string, unknown>;
  connections?: string[];
}

export interface DigitalTwinConnection {
  from: string;
  to: string;
  type: string;
  fluid_or_service: string;
  flow_direction: string;
  visual_style?: Record<string, unknown> | string;
}

export interface DigitalTwinMetadata {
  water_depth_m: number;
  reservoir_depth_m: number;
  seabed_y: number;
  reservoir_y: number;
  sea_surface_y: number;
  water_depth_note?: string;
  reservoir_label?: string;
  vertical_scale_note: string;
  digital_twin_type: string;
  horizontal_coordinate_unit?: string;
  vertical_coordinate_unit?: string;
  subsea_equipment_depth_m?: number;
  reservoir_to_seabed_difference_m?: number;
  architecture_summary?: Record<string, number>;
  conceptual_risks?: string[];
}

export interface DigitalTwinWellbore {
  id: string;
  well_id: string;
  type: string;
  from_position: [number, number, number];
  to_position: [number, number, number];
  description: string;
}

export interface DigitalTwinData {
  metadata: DigitalTwinMetadata;
  assets: DigitalTwinAsset[];
  connections: DigitalTwinConnection[];
  wellbores?: DigitalTwinWellbore[];
}

export type DigitalTwinSelectedItem =
  | { kind: "asset"; asset: DigitalTwinAsset }
  | { kind: "connection"; connection: DigitalTwinConnection; id: string }
  | null;
