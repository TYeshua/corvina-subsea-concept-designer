import type {
  DigitalTwinAsset,
  DigitalTwinData,
  DigitalTwinSelectedItem,
} from "../../types/digitalTwin";
import {
  normalizeAssetType,
  normalizeConnectionType,
} from "../../utils/digitalTwinScale";
import { formatDecimal, formatNumber } from "../../utils/format";

interface DigitalTwinInfoPanelProps {
  twin: DigitalTwinData;
  selectedItem: DigitalTwinSelectedItem;
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "number") {
    return Math.abs(value) >= 1000 ? formatNumber(value) : formatDecimal(value);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

function AssetDetails({ asset }: { asset: DigitalTwinAsset }) {
  const data = Object.entries(asset.technical_data ?? {});

  return (
    <>
      <p className="text-xs font-semibold uppercase text-cyan-300">
        Ativo selecionado
      </p>
      <h2 className="mt-2 text-lg font-semibold text-white">{asset.id}</h2>
      <p className="mt-1 text-sm text-slate-300">{asset.name}</p>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-slate-500">Tipo</dt>
          <dd className="mt-1 text-slate-200">{normalizeAssetType(asset.type)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Função</dt>
          <dd className="mt-1 leading-6 text-slate-200">{asset.function}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Posição original</dt>
          <dd className="mt-1 text-slate-200">
            [{asset.position.map((value) => formatDecimal(value)).join(", ")}]
          </dd>
        </div>
      </dl>

      {data.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Dados técnicos</h3>
          <dl className="mt-3 space-y-2 text-xs">
            {data.map(([key, value]) => (
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

      {asset.connections && asset.connections.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Conexões associadas</h3>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {asset.connections.map((connection) => (
              <div
                key={connection}
                className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
              >
                {connection.replace("->", " → ")}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function DigitalTwinInfoPanel({
  twin,
  selectedItem,
}: DigitalTwinInfoPanelProps) {
  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      {!selectedItem ? (
        <>
          <p className="text-xs font-semibold uppercase text-cyan-300">
            Resumo do gêmeo digital
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Tipo</dt>
              <dd className="text-right text-slate-200">
                {twin.metadata.digital_twin_type}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Lâmina d'água</dt>
              <dd className="text-slate-200">
                {formatNumber(twin.metadata.water_depth_m)} m
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Ativos</dt>
              <dd className="text-slate-200">{twin.assets.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Conexões</dt>
              <dd className="text-slate-200">{twin.connections.length}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Use o mouse para rotacionar, aproximar e deslocar a cena. Clique em
            ativos ou conexões para ver detalhes técnicos.
          </p>
          <p className="mt-3 text-xs leading-5 text-amber-100/80">
            Escala vertical conceitual e comprimida para visualização. O modelo
            não representa proporções físicas reais.
          </p>
        </>
      ) : selectedItem.kind === "asset" ? (
        <AssetDetails asset={selectedItem.asset} />
      ) : (
        <>
          <p className="text-xs font-semibold uppercase text-cyan-300">
            Conexão selecionada
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {selectedItem.connection.from} → {selectedItem.connection.to}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Tipo</dt>
              <dd className="mt-1 text-slate-200">
                {normalizeConnectionType(selectedItem.connection.type)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Fluido ou serviço</dt>
              <dd className="mt-1 text-slate-200">
                {selectedItem.connection.fluid_or_service}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Sentido de fluxo</dt>
              <dd className="mt-1 text-slate-200">
                {selectedItem.connection.flow_direction}
              </dd>
            </div>
            {normalizeConnectionType(selectedItem.connection.type) === "riser" ? (
              <div>
                <dt className="text-slate-500">Observação</dt>
                <dd className="mt-1 leading-6 text-slate-200">
                  Riser conceitual com geometria simplificada. A análise
                  estrutural e de fadiga não é realizada neste protótipo.
                </dd>
              </div>
            ) : null}
          </dl>
        </>
      )}
    </section>
  );
}

