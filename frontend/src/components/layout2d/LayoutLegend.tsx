export function LayoutLegend() {
  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      <h2 className="text-sm font-semibold text-white">Legenda</h2>
      <div className="mt-4 grid gap-3 text-xs text-slate-300">
        {[
          ["Poço produtor", "circle", "#059669", "#6ee7b7"],
          ["Poço injetor de água", "circle", "#2563eb", "#93c5fd"],
          ["Poço injetor de gás", "circle", "#7c3aed", "#c4b5fd"],
          ["Manifold de produção", "square", "#0891b2", "#67e8f9"],
          ["Manifold de água", "square", "#1d4ed8", "#93c5fd"],
          ["PLET/manifold de gás", "diamond", "#c2410c", "#fdba74"],
          ["SDU", "hex", "#ca8a04", "#fde68a"],
        ].map(([label, shape, fill, stroke]) => (
          <div key={label} className="flex items-center gap-3">
            <svg className="h-5 w-8 flex-none" viewBox="0 0 32 20">
              {shape === "circle" ? (
                <circle cx={16} cy={10} r={6} fill={fill} stroke={stroke} strokeWidth={2} />
              ) : shape === "square" ? (
                <rect x={10} y={4} width={12} height={12} rx={3} fill={fill} stroke={stroke} strokeWidth={2} />
              ) : shape === "diamond" ? (
                <rect x={11} y={5} width={10} height={10} transform="rotate(45 16 10)" fill={fill} stroke={stroke} strokeWidth={2} />
              ) : (
                <polygon points="16,3 23,7 23,13 16,17 9,13 9,7" fill={fill} stroke={stroke} strokeWidth={2} />
              )}
            </svg>
            <span>{label}</span>
          </div>
        ))}

        <div className="mt-2 h-px bg-cyan-500/20" />

        {[
          ["Flowline de produção", "#34d399", ""],
          ["Flowline de injeção de água", "#60a5fa", ""],
          ["Flowline de injeção de gás", "#a78bfa", ""],
          ["Riser", "#22d3ee", "8 5"],
          ["Umbilical", "#facc15", "8 5"],
          ["Controle submarino", "#fde68a", "2 5"],
        ].map(([label, color, dash]) => (
          <div key={label} className="flex items-center gap-3">
            <svg className="h-5 w-8 flex-none" viewBox="0 0 32 20">
              <line
                x1={4}
                y1={10}
                x2={28}
                y2={10}
                stroke={color}
                strokeWidth={3}
                strokeDasharray={dash}
              />
            </svg>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

