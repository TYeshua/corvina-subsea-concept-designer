export type DigitalTwinViewMode =
  | "overview"
  | "production"
  | "waterInjection"
  | "gasInjection"
  | "risers"
  | "umbilicals"
  | "wellbores"
  | "reservoir"
  | "top"
  | "verticalSection";

interface DigitalTwinCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

const cameraConfigs: Record<DigitalTwinViewMode, DigitalTwinCameraConfig> = {
  overview: {
    position: [7.2, 5.6, 11.2],
    target: [0, -3.2, 2.2],
    fov: 46,
  },
  production: {
    position: [-5.8, 1.2, 5.5],
    target: [-2.8, -6.3, 0.8],
    fov: 43,
  },
  waterInjection: {
    position: [3.2, 1.0, 5.8],
    target: [1.0, -6.4, -1.6],
    fov: 42,
  },
  gasInjection: {
    position: [3.2, 1.6, 8.6],
    target: [0.2, -5.6, 1.8],
    fov: 42,
  },
  risers: {
    position: [1.6, 4.6, 8.8],
    target: [0.4, -2.8, 2.9],
    fov: 40,
  },
  umbilicals: {
    position: [-6.2, 2.6, 8.2],
    target: [-1.2, -5.4, 1.0],
    fov: 44,
  },
  wellbores: {
    position: [7.4, -3.2, 7.4],
    target: [0, -10.8, 0.4],
    fov: 48,
  },
  reservoir: {
    position: [5.2, -11.8, 6.8],
    target: [0, -16.45, 0.2],
    fov: 56,
  },
  top: {
    position: [0.1, 11.4, 0.1],
    target: [0, -6.6, 0],
    fov: 54,
  },
  verticalSection: {
    position: [12.5, -2.8, 0.6],
    target: [0, -8.6, 0.6],
    fov: 50,
  },
};

export function getDigitalTwinCameraConfig(
  mode: DigitalTwinViewMode,
  compactViewport = false,
): DigitalTwinCameraConfig {
  const config = cameraConfigs[mode];

  if (!compactViewport) {
    return config;
  }

  const scale = mode === "top" ? 1.04 : 1.16;

  return {
    ...config,
    position: [
      config.position[0] * scale,
      config.position[1] * scale,
      config.position[2] * scale,
    ],
    fov: Math.min(config.fov + 5, 60),
  };
}
