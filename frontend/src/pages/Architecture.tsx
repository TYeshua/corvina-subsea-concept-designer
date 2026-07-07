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

const groupOrder = [
  "Poços e árvores",
  "Manifolds",
  "Flowlines e jumpers",
  "Risers",
  "Umbilicais e controle",
  "Garantia de escoamento",
  "Expansão futura",
];

function resolveGroup(item: EquipmentRecommendation): string {
  if (item.equipment.includes("Árvore")) {
    return "Poços e árvores";
  }

  if (item.equipment.includes("Manifold") || item.equipment.includes("PLET")) {
    return "Manifolds";
  }

  if (
    item.equipment.includes("Flowlines") ||
    item.equipment.includes("Jumpers")
  ) {
    return "Flowlines e jumpers";
  }

  if (item.equipment.includes("Risers")) {
    return "Risers";
  }

  return "Umbilicais e controle";
}

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
    const groups = equipment.reduce<Record<string, EquipmentRecommendation[]>>(
      (currentGroups, item) => {
        const group = resolveGroup(item);
        currentGroups[group] = [...(currentGroups[group] ?? []), item];
        return currentGroups;
      },
      {},
    );

    groups["Garantia de escoamento"] = [
      ...(groups["Garantia de escoamento"] ?? []),
      {
        category: "Garantia de escoamento",
        equipment: "Controle térmico e químico",
        recommendation: "Flowlines isoladas e injeção química via umbilicais",
        technical_justification:
          "O óleo parafínico e a lâmina d'água ultraprofundas exigem mitigação conceitual de perda térmica, hidratos e deposição de parafina.",
      },
    ];

    groups["Expansão futura"] = [
      {
        category: "Flexibilidade de desenvolvimento",
        equipment: "Reserva de slots e corredores",
        recommendation: "Manter espaço no layout para novos poços e linhas",
        technical_justification:
          "A configuração por clusters e a FPSO ao norte preservam corredores de risers, umbilicais e áreas livres para fases posteriores do desenvolvimento.",
      },
    ];

    return groups;
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
            Recomendações conceituais de equipamentos
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Seleção técnica preliminar para organizar produção, injeção,
            controle, escoamento e expansão do Campo Corvina.
          </p>
        </div>

        <CopyButton
          text={architectureJustification}
          label="Copiar justificativa da arquitetura"
          successLabel="Justificativa copiada"
        />
      </div>

      <SectionCard title="Lógica da arquitetura proposta">
        <p className="text-sm leading-7 text-slate-300">
          {architectureJustification}
        </p>
      </SectionCard>

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
        {groupOrder.map((group) => {
          const items = groupedEquipment[group] ?? [];

          if (items.length === 0) {
            return null;
          }

          return (
            <section key={group} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{group}</h2>
                <div className="mt-2 h-px bg-cyan-500/20" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article
                    key={`${item.category}-${item.equipment}`}
                    className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-5 shadow-panel transition hover:border-cyan-400/35"
                  >
                    <p className="text-xs uppercase text-slate-500">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">
                      {item.equipment}
                    </h3>
                    <p className="mt-3 text-sm font-medium text-cyan-200">
                      {item.recommendation}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.technical_justification}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
