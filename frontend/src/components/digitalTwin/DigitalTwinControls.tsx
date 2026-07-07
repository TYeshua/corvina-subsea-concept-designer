import { Camera, Maximize2, Minimize2, RotateCcw } from "lucide-react";

export interface DigitalTwinLayerState {
  production: boolean;
  waterInjection: boolean;
  gasInjection: boolean;
  risers: boolean;
  umbilicals: boolean;
  sdus: boolean;
  labels: boolean;
  seaSurface: boolean;
  seabed: boolean;
  current: boolean;
}

interface DigitalTwinControlsProps {
  layers: DigitalTwinLayerState;
  onToggle: (key: keyof DigitalTwinLayerState) => void;
  onReset: () => void;
  onCapture: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  captureStatus?: string;
}

const layerControls: Array<{ key: keyof DigitalTwinLayerState; label: string }> = [
  { key: "production", label: "Produção" },
  { key: "waterInjection", label: "Injeção de água" },
  { key: "gasInjection", label: "Injeção de gás" },
  { key: "risers", label: "Risers" },
  { key: "umbilicals", label: "Umbilicais" },
  { key: "sdus", label: "SDUs" },
  { key: "labels", label: "Labels" },
  { key: "seaSurface", label: "Superfície" },
  { key: "seabed", label: "Leito marinho" },
  { key: "current", label: "Corrente" },
];

export function DigitalTwinControls({
  layers,
  onToggle,
  onReset,
  onCapture,
  onToggleFullscreen,
  isFullscreen,
  captureStatus,
}: DigitalTwinControlsProps) {
  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Camadas 3D</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
          title="Restaurar camadas"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleFullscreen}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400 hover:text-slate-950"
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
        {isFullscreen ? "Sair da tela cheia" : "Visualizar em tela cheia"}
      </button>

      <div className="mt-4 grid gap-2">
        {layerControls.map((control) => (
          <label
            key={control.key}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-500/25"
          >
            <span>{control.label}</span>
            <input
              type="checkbox"
              checked={layers[control.key]}
              onChange={() => onToggle(control.key)}
              className="h-4 w-4 accent-cyan-400"
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={onCapture}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        <Camera className="h-4 w-4" />
        Capturar imagem da cena 3D
      </button>

      {captureStatus ? (
        <p className="mt-3 text-xs leading-5 text-emerald-200">{captureStatus}</p>
      ) : null}
    </section>
  );
}
