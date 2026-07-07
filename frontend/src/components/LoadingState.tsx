import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-lg border border-cyan-500/20 bg-slate-900/80">
      <div className="flex items-center gap-3 text-slate-300">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
        <span>Carregando dados...</span>
      </div>
    </div>
  );
}

