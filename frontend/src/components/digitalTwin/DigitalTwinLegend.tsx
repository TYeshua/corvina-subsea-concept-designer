const assetLegend = [
  ["FPSO", "#38bdf8"],
  ["Poço produtor", "#34d399"],
  ["Poço injetor de água", "#60a5fa"],
  ["Poço injetor de gás", "#a78bfa"],
  ["Manifold de produção", "#22d3ee"],
  ["Manifold de injeção de água", "#2563eb"],
  ["PLET de gás", "#f97316"],
  ["SDU", "#facc15"],
];

const connectionLegend = [
  ["Flowline de produção", "#34d399"],
  ["Flowline de injeção de água", "#60a5fa"],
  ["Flowline de injeção de gás", "#a78bfa"],
  ["Riser", "#22d3ee"],
  ["Umbilical", "#facc15"],
  ["Corrente", "#38bdf8"],
];

export function DigitalTwinLegend() {
  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      <h2 className="text-sm font-semibold text-white">Legenda 3D</h2>
      <div className="mt-4 grid gap-3 text-xs text-slate-300">
        {assetLegend.map(([label, color]) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full border border-white/35"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        ))}

        <div className="mt-2 h-px bg-cyan-500/20" />

        {connectionLegend.map(([label, color]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="h-0.5 w-7 rounded-full" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

