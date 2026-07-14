import { useEffect, useState } from "react";
import { getCalculations, getScenario } from "../api/client";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import type { CalculationResponse } from "../types/calculations";
import type { Scenario } from "../types/scenario";
import { formatNumber, formatPercent } from "../utils/format";

function resultText(result: number | string, unit: string): string {
  if (typeof result === "number") {
    return `${formatNumber(result)} ${unit}`;
  }

  return `${result} ${unit}`;
}

export function Calculations() {
  const [calculationResponse, setCalculationResponse] =
    useState<CalculationResponse | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCalculations() {
      try {
        const [calculationData, scenarioData] = await Promise.all([
          getCalculations(),
          getScenario(),
        ]);

        if (active) {
          setCalculationResponse(calculationData);
          setScenario(scenarioData);
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

    loadCalculations();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !calculationResponse || !scenario) {
    return <ErrorState message={error ?? undefined} />;
  }

  const { summary, detailed_steps } = calculationResponse;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">Cálculos</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Memória de cálculo e interpretação técnica
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Desenvolvimento dos indicadores do Campo Corvina com fórmulas,
          substituição de valores, resultados, unidades e interpretação. A
          análise separa lâmina d'água de 2.300 m e reservatório a 5.600 m.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Produção líquida</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatNumber(summary.total_liquid_rate_stb_d)}
          </p>
          <p className="text-xs text-slate-400">STB/d</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">BSW ponderado</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatPercent(summary.weighted_bsw_percent)}%
          </p>
          <p className="text-xs text-slate-400">
            BSW simples: {formatPercent(summary.simple_average_bsw_percent)}%
          </p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Injeção água / líquidos</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatPercent(summary.water_injection_liquid_replacement_ratio_percent)}%
          </p>
          <p className="text-xs text-slate-400">Estimativa conceitual</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Gás para reinjeção</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatNumber(summary.gas_available_for_reinjection_mmscf_d)}
          </p>
          <p className="text-xs text-slate-400">MMSCF/d</p>
        </article>
      </section>

      <SectionCard title="Interpretação técnica principal">
        <div className="grid gap-3 md:grid-cols-2">
          {summary.interpretation.map((item) => (
            <p
              key={item}
              className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300"
            >
              {item}
            </p>
          ))}
        </div>
      </SectionCard>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Tabela de memória de cálculo
        </h2>
        <div className="overflow-x-auto rounded-lg border border-cyan-500/20">
          <table className="min-w-[1100px] divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Indicador</th>
                <th className="px-4 py-3">Fórmula</th>
                <th className="px-4 py-3">Valores de entrada</th>
                <th className="px-4 py-3">Etapas</th>
                <th className="px-4 py-3">Resultado</th>
                <th className="px-4 py-3">Interpretação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/50 text-slate-300">
              {detailed_steps.map((step) => (
                <tr key={step.indicator} className="align-top">
                  <td className="px-4 py-3 font-semibold text-cyan-100">
                    {step.indicator}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-50">
                    {step.formula}
                  </td>
                  <td className="px-4 py-3 text-xs leading-5">
                    {step.input_values}
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-1 text-xs leading-5">
                      {step.calculation_steps.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {resultText(step.result, step.unit)}
                  </td>
                  <td className="px-4 py-3 text-xs leading-5">
                    {step.interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SectionCard title="Profundidade e coerência do modelo">
        <div className="grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-3">
          <p className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            Superfície do mar: <strong>0 m</strong>.
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            Leito marinho e equipamentos submarinos:{" "}
            <strong>{formatNumber(scenario.field.water_depth_m)} m</strong>.
          </p>
          <p className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            Reservatório:{" "}
            <strong>{formatNumber(scenario.field.reservoir_depth_m)} m</strong>.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
