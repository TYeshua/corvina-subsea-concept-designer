import type { LayoutAsset, LayoutConnection, LayoutData } from "../../types/layout";
import { getAssetX, getAssetY, normalizeAssetType, normalizeConnectionType } from "../../utils/layoutScale";
import { formatDecimal, formatNumber } from "../../utils/format";

interface LayoutInfoPanelProps {
  layout: LayoutData;
  selectedAsset?: LayoutAsset | null;
  selectedConnection?: LayoutConnection | null;
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (typeof value === "number") {
    return Math.abs(value) >= 1000 ? formatNumber(value) : formatDecimal(value);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

export function LayoutInfoPanel({
  layout,
  selectedAsset,
  selectedConnection,
}: LayoutInfoPanelProps) {
  if (selectedAsset) {
    const associatedConnections = layout.connections.filter(
      (connection) =>
        connection.from === selectedAsset.id || connection.to === selectedAsset.id,
    );
    const technicalData = Object.entries(selectedAsset.technical_data ?? {});

    return (
      <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
        <p className="text-xs font-semibold uppercase text-cyan-300">
          Ativo selecionado
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">{selectedAsset.id}</h2>
        <p className="mt-1 text-sm text-slate-300">{selectedAsset.name}</p>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">Tipo</dt>
            <dd className="mt-1 text-slate-200">
              {normalizeAssetType(selectedAsset.type)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Coordenadas</dt>
            <dd className="mt-1 text-slate-200">
              {getAssetX(selectedAsset).toFixed(1)} km E,{" "}
              {getAssetY(selectedAsset).toFixed(1)} km N
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Descrição</dt>
            <dd className="mt-1 leading-6 text-slate-200">
              {selectedAsset.description ?? selectedAsset.function}
            </dd>
          </div>
        </dl>

        {technicalData.length > 0 ? (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-white">Dados técnicos</h3>
            <dl className="mt-3 space-y-2 text-xs">
              {technicalData.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2"
                >
                  <dt className="text-slate-500">{humanizeKey(key)}</dt>
                  <dd className="text-right text-slate-200">{formatValue(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Conexões associadas</h3>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {associatedConnections.map((connection) => (
              <div
                key={`${connection.from}-${connection.to}-${connection.type}`}
                className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
              >
                {connection.from} → {connection.to}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (selectedConnection) {
    return (
      <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
        <p className="text-xs font-semibold uppercase text-cyan-300">
          Conexão selecionada
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          {selectedConnection.from} → {selectedConnection.to}
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">Tipo</dt>
            <dd className="mt-1 text-slate-200">
              {normalizeConnectionType(selectedConnection.type)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Fluido ou serviço</dt>
            <dd className="mt-1 text-slate-200">
              {selectedConnection.fluid_or_service}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Sentido de fluxo</dt>
            <dd className="mt-1 text-slate-200">
              {selectedConnection.flow_direction}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Descrição</dt>
            <dd className="mt-1 leading-6 text-slate-200">
              {selectedConnection.description}
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      <p className="text-xs font-semibold uppercase text-cyan-300">
        Resumo do layout
      </p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Área do campo</dt>
          <dd className="text-slate-200">
            {formatNumber(
              layout.metadata.field_width_km * layout.metadata.field_height_km,
            )}{" "}
            km²
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Ativos</dt>
          <dd className="text-slate-200">{layout.assets.length}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Conexões</dt>
          <dd className="text-slate-200">{layout.connections.length}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Índice de adequação</dt>
          <dd className="text-slate-200">{layout.metadata.layout_score}/100</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Corrente</dt>
          <dd className="text-slate-200">{layout.metadata.current_direction}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Velocidade de projeto</dt>
          <dd className="text-slate-200">
            {formatDecimal(layout.metadata.current_design_velocity_m_s)} m/s
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-slate-400">
        Clique em um ativo ou conexão para inspecionar seus dados técnicos.
      </p>
    </section>
  );
}
