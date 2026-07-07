import type {
  DigitalTwinAsset,
  DigitalTwinAssetType,
  DigitalTwinConnection,
  DigitalTwinConnectionType,
} from "../types/digitalTwin";

export const HORIZONTAL_SCALE = 1.35;
export const VERTICAL_SCALE = 0.003;
export const FIELD_CENTER_X_KM = 5;
export const FIELD_CENTER_Z_KM = 4.5;
export const FIELD_WIDTH_KM = 10;
export const FIELD_HEIGHT_KM = 9;

export function scaleDigitalTwinPosition(
  position: [number, number, number],
): [number, number, number] {
  const [x, y, z] = position;

  return [
    (x - FIELD_CENTER_X_KM) * HORIZONTAL_SCALE,
    y * VERTICAL_SCALE,
    (z - FIELD_CENTER_Z_KM) * HORIZONTAL_SCALE,
  ];
}

export function scaleSeabedY(seabedY: number): number {
  return seabedY * VERTICAL_SCALE;
}

export function normalizeAssetType(type: string): DigitalTwinAssetType {
  const normalized = type.trim().toLowerCase().replace(/-/g, "_");

  if (normalized.includes("fpso")) {
    return "fpso";
  }

  if (normalized.includes("producer")) {
    return "producer_well";
  }

  if (normalized.includes("water") && normalized.includes("injector")) {
    return "water_injector_well";
  }

  if (normalized.includes("gas") && normalized.includes("injector")) {
    return "gas_injector_well";
  }

  if (normalized.includes("production") && normalized.includes("manifold")) {
    return "production_manifold";
  }

  if (normalized.includes("water") && normalized.includes("manifold")) {
    return "water_injection_manifold";
  }

  if (normalized.includes("gas") || normalized.includes("plet")) {
    return "gas_plet";
  }

  if (normalized.includes("sdu")) {
    return "sdu";
  }

  return "unknown";
}

export function normalizeConnectionType(
  type: string,
): DigitalTwinConnectionType {
  const normalized = type.trim().toLowerCase().replace(/-/g, "_");

  if (normalized.includes("production")) {
    return "production_flowline";
  }

  if (normalized.includes("water")) {
    return "water_injection_flowline";
  }

  if (normalized.includes("gas")) {
    return "gas_injection_flowline";
  }

  if (normalized.includes("riser")) {
    return "riser";
  }

  if (normalized.includes("umbilical")) {
    return "umbilical";
  }

  if (normalized.includes("control")) {
    return "control_link";
  }

  if (normalized.includes("jumper")) {
    return "jumper";
  }

  return "unknown";
}

export function getAssetColor(type: DigitalTwinAssetType): string {
  const colors: Record<DigitalTwinAssetType, string> = {
    fpso: "#38bdf8",
    producer_well: "#34d399",
    water_injector_well: "#60a5fa",
    gas_injector_well: "#a78bfa",
    production_manifold: "#22d3ee",
    water_injection_manifold: "#2563eb",
    gas_plet: "#f97316",
    sdu: "#facc15",
    unknown: "#94a3b8",
  };

  return colors[type];
}

export function getConnectionColor(type: DigitalTwinConnectionType): string {
  const colors: Record<DigitalTwinConnectionType, string> = {
    production_flowline: "#34d399",
    water_injection_flowline: "#60a5fa",
    gas_injection_flowline: "#a78bfa",
    riser: "#22d3ee",
    umbilical: "#facc15",
    control_link: "#fde68a",
    jumper: "#e2e8f0",
    unknown: "#94a3b8",
  };

  return colors[type];
}

export function getConnectionId(
  connection: DigitalTwinConnection,
  index: number,
): string {
  return `${connection.from}->${connection.to}:${connection.type}:${index}`;
}

export function getAssetMap(
  assets: DigitalTwinAsset[],
): Record<string, DigitalTwinAsset> {
  return assets.reduce<Record<string, DigitalTwinAsset>>((map, asset) => {
    map[asset.id] = asset;
    return map;
  }, {});
}

export function resolveFlowAssetIds(connection: DigitalTwinConnection): {
  from: string;
  to: string;
} {
  const reverseDirection = `${connection.to} para ${connection.from}`;

  if (connection.flow_direction.includes(reverseDirection)) {
    return { from: connection.to, to: connection.from };
  }

  return { from: connection.from, to: connection.to };
}

