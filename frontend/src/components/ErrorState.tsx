import { AlertTriangle } from "lucide-react";
import { API_BASE_URL } from "../api/client";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  function handleRetry() {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  }

  return (
    <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-5 text-red-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-red-300" />
        <div>
          <h2 className="font-semibold">Não foi possível conectar à API.</h2>
          <p className="mt-2 text-sm leading-6 text-red-100/80">
            Verifique se o backend FastAPI está rodando em {API_BASE_URL}.
          </p>
          {message ? (
            <p className="mt-3 text-xs text-red-100/70">{message}</p>
          ) : null}
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-red-200 px-4 py-2 text-sm font-semibold text-red-950 transition hover:bg-white"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
