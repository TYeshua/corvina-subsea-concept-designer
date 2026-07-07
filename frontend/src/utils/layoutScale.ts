import type { LayoutAsset } from "../types/layout";

export type NormalizedAssetType =
  | "fpso"
  | "producer_well"
  | "water_injector_well"
  | "gas_injector_well"
  | "production_manifold"
  | "water_injection_manifold"
  | "gas_plet"
  | "sdu"
  | "unknown";

export type NormalizedConnectionType =
  | "production_flowline"
  | "water_injection_flowline"
  | "gas_injection_flowline"
  | "riser"
  | "umbilical"
  | "control_link"
  | "jumper"
  | "unknown";

export function scaleX(
  xKm: number,
  widthPx: number,
  fieldWidthKm: number,
): number {
  return (xKm / fieldWidthKm) * widthPx;
}

export function scaleY(
  yKm: number,
  heightPx: number,
  fieldHeightKm: number,
): number {
  return heightPx - (yKm / fieldHeightKm) * heightPx;
}

export function getAssetX(asset: LayoutAsset): number {
  return asset.x_km ?? asset.x ?? 0;
}

export function getAssetY(asset: LayoutAsset): number {
  return asset.y_km ?? asset.y ?? 0;
}

export function normalizeAssetType(type: string): NormalizedAssetType {
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

export function normalizeConnectionType(type: string): NormalizedConnectionType {
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
