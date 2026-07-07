import { Download, RotateCcw } from "lucide-react";

export interface LayerState {
  production: boolean;
  waterInjection: boolean;
  gasInjection: boolean;
  risers: boolean;
  umbilicals: boolean;
  sdus: boolean;
  grid: boolean;
  labels: boolean;
}

interface LayoutControlsProps {
  layers: LayerState;
  onToggle: (key: keyof LayerState) => void;
  onReset: () => void;
  onExport: () => void;
}

const controls: Array<{ key: keyof LayerState; label: string }> = [
  { key: "production", label: "Produção" },
  { key: "waterInjection", label: "Injeção de água" },
  { key: "gasInjection", label: "Injeção de gás" },
  { key: "risers", label: "Risers" },
  { key: "umbilicals", label: "Umbilicais" },
  { key: "sdus", label: "SDUs" },
  { key: "grid", label: "Grid" },
  { key: "labels", label: "Labels" },
];

export function LayoutControls({
  layers,
  onToggle,
  onReset,
  onExport,
}: LayoutControlsProps) {
  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Camadas</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
          title="Restaurar camadas"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {controls.map((control) => (
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
        onClick={onExport}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        <Download className="h-4 w-4" />
        Exportar layout como SVG
      </button>
    </section>
  );
}

