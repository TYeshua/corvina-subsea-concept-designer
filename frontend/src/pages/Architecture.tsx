import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "../components/CopyButton";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import { getEquipment } from "../api/client";
import {
  architectureDecisions,
  architectureJustification,
} from "../content/technicalTexts";
import type { EquipmentRecommendation } from "../types/equipment";

export function Architecture() {
  const [equipment, setEquipment] = useState<EquipmentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEquipment() {
      try {
        const data = await getEquipment();

        if (active) {
          setEquipment(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro desconhecido.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEquipment();

    return () => {
      active = false;
    };
  }, []);

  const groupedEquipment = useMemo(() => {
    return equipment.reduce<Record<string, EquipmentRecommendation[]>>(
      (currentGroups, item) => {
        currentGroups[item.category] = [
          ...(currentGroups[item.category] ?? []),
          item,
        ];
        return currentGroups;
      },
      {},
    );
  }, [equipment]);

  const inventoryText = useMemo(() => {
    return equipment
      .map(
        (item) =>
          `${item.name} | Quantidade: ${item.quantity} | Tipo: ${item.type} | ` +
          `Função: ${item.function} | Posição: ${item.position_reference} | ` +
          `Conectado a: ${item.connected_to.join(", ")} | Justificativa: ${item.technical_justification}`,
      )
      .join("\n");
  }, [equipment]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-cyan-300">
            Arquitetura Submarina
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Recomendações conceituais e inventário de equipamentos
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Detalhamento de quantidade, função, posição de instalação,
            conexões, justificativa técnica e notas operacionais para o Campo
            Corvina.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={architectureJustification}
            label="Copiar justificativa da arquitetura"
            successLabel="Justificativa copiada"
          />
          <CopyButton
            text={inventoryText}
            label="Copiar inventário"
            successLabel="Inventário copiado"
          />
        </div>
      </div>

      <SectionCard title="Lógica da arquitetura proposta">
        <p className="text-sm leading-7 text-slate-300">
          {architectureJustification}
        </p>
      </SectionCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Poços</p>
          <p className="mt-2 text-2xl font-semibold text-white">8</p>
          <p className="text-xs text-slate-400">5 produtores, 2 injetores de água, 1 injetor de gás</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Manifolds / PLET</p>
          <p className="mt-2 text-2xl font-semibold text-white">4</p>
          <p className="text-xs text-slate-400">2 produção, 1 água, 1 gás</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Risers principais</p>
          <p className="mt-2 text-2xl font-semibold text-white">4</p>
          <p className="text-xs text-slate-400">Produção, água e gás</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Controle</p>
          <p className="mt-2 text-2xl font-semibold text-white">3 SDUs</p>
          <p className="text-xs text-slate-400">3 umbilicais principais</p>
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">
          Principais decisões técnicas
        </h2>
        <ul className="grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-2">
          {architectureDecisions.map((decision) => (
            <li
              key={decision}
              className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3"
            >
              {decision}
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-8">
        {Object.entries(groupedEquipment).map(([group, items]) => (
          <section key={group} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-white">{group}</h2>
              <div className="mt-2 h-px bg-cyan-500/20" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-5 shadow-panel transition hover:border-cyan-400/35"
                >
                  <p className="text-xs uppercase text-slate-500">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-cyan-200">
                    {item.quantity} × {item.type}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.function}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {item.position_reference}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">
          Inventário de Equipamentos
        </h2>
        <div className="overflow-x-auto rounded-lg border border-cyan-500/20">
          <table className="min-w-[1300px] divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Equipamento</th>
                <th className="px-4 py-3">Quantidade</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Função</th>
                <th className="px-4 py-3">Posição de instalação</th>
                <th className="px-4 py-3">Conectado a</th>
                <th className="px-4 py-3">Justificativa técnica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/50 text-slate-300">
              {equipment.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3 font-semibold text-cyan-100">
                    {item.name}
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.function}</td>
                  <td className="px-4 py-3">
                    {item.installation_location}
                    <br />
                    <span className="text-xs text-slate-500">
                      {item.position_reference}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.connected_to.join(", ")}</td>
                  <td className="px-4 py-3">
                    {item.technical_justification}
                    <p className="mt-2 text-xs text-slate-500">
                      {item.operational_notes}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
