import type { DigitalTwinData } from "../../types/digitalTwin";
import { formatNumber } from "../../utils/format";

interface DigitalTwinTechnicalPanelProps {
  twin: DigitalTwinData;
}

function humanizeSummaryKey(key: string): string {
  const labels: Record<string, string> = {
    producer_wells: "Poços produtores",
    water_injectors: "Injetores de água",
    gas_injectors: "Injetores de gás",
    production_manifolds: "Manifolds de produção",
    water_manifolds: "Manifold de água",
    gas_plets: "PLET/manifold de gás",
    sdus: "SDUs",
    main_risers: "Risers principais",
    main_umbilicals: "Umbilicais principais",
    well_jumpers: "Jumpers de poços",
  };

  return labels[key] ?? key.replace(/_/g, " ");
}

export function DigitalTwinTechnicalPanel({ twin }: DigitalTwinTechnicalPanelProps) {
  const reservoirDifference =
    twin.metadata.reservoir_to_seabed_difference_m ??
    twin.metadata.reservoir_depth_m - twin.metadata.water_depth_m;
  const architecture = Object.entries(twin.metadata.architecture_summary ?? {});

  return (
    <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-4 shadow-panel">
      <h2 className="text-sm font-semibold text-white">Profundidades e riscos</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Superfície do mar</dt>
          <dd className="font-semibold text-cyan-100">0 m</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Lâmina d'água</dt>
          <dd className="font-semibold text-cyan-100">
            {formatNumber(twin.metadata.water_depth_m)} m
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Equipamentos submarinos</dt>
          <dd className="font-semibold text-cyan-100">
            {formatNumber(twin.metadata.subsea_equipment_depth_m ?? twin.metadata.water_depth_m)} m
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Reservatório</dt>
          <dd className="font-semibold text-amber-100">
            {formatNumber(twin.metadata.reservoir_depth_m)} m
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-400">Reservatório abaixo do leito</dt>
          <dd className="font-semibold text-amber-100">
            {formatNumber(reservoirDifference)} m
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        {twin.metadata.water_depth_note}
      </p>
      <p className="mt-2 text-xs leading-5 text-amber-100/85">
        {twin.metadata.vertical_scale_note}
      </p>

      {architecture.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase text-slate-500">
            Inventário sintético
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {architecture.map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
              >
                <dt className="text-slate-500">{humanizeSummaryKey(key)}</dt>
                <dd className="mt-1 font-semibold text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {twin.metadata.conceptual_risks?.length ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase text-slate-500">
            Riscos conceituais
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-300">
            {twin.metadata.conceptual_risks.map((risk) => (
              <li key={risk} className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
