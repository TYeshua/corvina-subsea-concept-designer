import type { ReactNode } from "react";

type Accent = "cyan" | "blue" | "emerald" | "amber" | "red";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: ReactNode;
  accent?: Accent;
}

const accentStyles: Record<Accent, string> = {
  cyan: "border-cyan-500/25 text-cyan-300 bg-cyan-500/10",
  blue: "border-blue-500/25 text-blue-300 bg-blue-500/10",
  emerald: "border-emerald-500/25 text-emerald-300 bg-emerald-500/10",
  amber: "border-amber-500/25 text-amber-300 bg-amber-500/10",
  red: "border-red-500/25 text-red-300 bg-red-500/10",
};

export function MetricCard({
  title,
  value,
  unit,
  description,
  icon,
  accent = "cyan",
}: MetricCardProps) {
  return (
    <article className="min-h-44 min-w-0 rounded-lg border border-cyan-500/20 bg-slate-900/80 p-5 shadow-panel">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="min-w-0 break-words text-3xl font-semibold text-white">
              {value}
            </span>
            {unit ? <span className="text-sm text-slate-400">{unit}</span> : null}
          </div>
        </div>
        {icon ? (
          <div className={`shrink-0 rounded-lg border p-2.5 ${accentStyles[accent]}`}>
            {icon}
          </div>
        ) : null}
      </div>
      {description ? (
        <p className="mt-4 text-sm leading-6 text-slate-400">{description}</p>
      ) : null}
    </article>
  );
}
