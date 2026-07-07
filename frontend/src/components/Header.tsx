import { Activity, BadgeCheck, Waves } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-cyan-500/20 bg-slate-950/85 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-cyan-300">
            <Waves className="h-4 w-4" />
            Corvina Subsea Concept Designer
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200">
              <BadgeCheck className="h-3 w-3" />
              MVP acadêmico
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Sistema de apoio ao projeto conceitual submarino
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-900 px-3 py-2 text-xs text-slate-300">
            <Activity className="h-4 w-4 text-emerald-300" />
            Campo Corvina · FZM-59
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-100">
            React + FastAPI
          </div>
        </div>
      </div>
    </header>
  );
}
