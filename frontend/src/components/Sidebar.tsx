import {
  BarChart3,
  Boxes,
  Calculator,
  Database,
  FileText,
  Home,
  Map,
  MonitorPlay,
  Network,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  { label: "Início", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Dados do Campo", path: "/field-data", icon: Database },
  { label: "Cálculos", path: "/calculations", icon: Calculator },
  { label: "Arquitetura Submarina", path: "/architecture", icon: Network },
  { label: "Layout 2D", path: "/layout-2d", icon: Map },
  { label: "Gêmeo Digital 3D", path: "/digital-twin-3d", icon: Boxes },
  { label: "Relatório", path: "/report", icon: FileText },
  { label: "Demonstração", path: "/demo", icon: MonitorPlay },
];

function NavigationLink({ item, compact = false }: { item: NavigationItem; compact?: boolean }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg border transition",
          compact
            ? "min-w-24 flex-col justify-center gap-1 px-3 py-2 text-[11px]"
            : "min-h-11 px-3 py-2 text-sm",
          isActive
            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
            : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-white",
        ].join(" ")
      }
    >
      <Icon className={compact ? "h-4 w-4 flex-none" : "h-4 w-4 flex-none"} />
      <span className={compact ? "max-w-24 truncate" : ""}>{item.label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-cyan-500/20 bg-slate-950/95 px-4 py-5 lg:flex lg:flex-col">
        <div className="mb-8 rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
          <p className="text-xs font-semibold uppercase text-cyan-300">
            Corvina Subsea
          </p>
          <div className="mt-2 text-lg font-semibold leading-6 text-white">
            Concept Designer
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Painel técnico para projeto conceitual offshore.
          </p>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavigationLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-sm font-medium text-emerald-200">Backend FastAPI</p>
          <p className="mt-1 break-all text-xs text-emerald-100/70">
            http://127.0.0.1:8000
          </p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-cyan-500/20 bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navigationItems.map((item) => (
            <NavigationLink key={item.path} item={item} compact />
          ))}
        </div>
      </nav>
    </>
  );
}
