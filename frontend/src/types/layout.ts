export interface LayoutAsset {
  id: string;
  name: string;
  type: string;
  x_km?: number;
  y_km?: number;
  x?: number;
  y?: number;
  function: string;
  description?: string;
  technical_data?: Record<string, unknown>;
}

export interface LayoutConnection {
  from: string;
  to: string;
  type: string;
  fluid_or_service: string;
  flow_direction: string;
  description: string;
}

export interface LayoutMetadata {
  field_width_km: number;
  field_height_km: number;
  north_direction: string;
  current_direction: string;
  current_design_velocity_m_s: number;
  layout_score: number;
}

export interface LayoutData {
  metadata: LayoutMetadata;
  assets: LayoutAsset[];
  connections: LayoutConnection[];
}

export interface DigitalTwinAsset {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  function: string;
  technical_data: Record<string, unknown>;
  connections: string[];
}

export interface DigitalTwinConnection {
  from: string;
  to: string;
  type: string;
  fluid_or_service: string;
  flow_direction: string;
  visual_style: Record<string, unknown>;
}

export interface DigitalTwinData {
  metadata: Record<string, unknown>;
  assets: DigitalTwinAsset[];
  connections: DigitalTwinConnection[];
}
