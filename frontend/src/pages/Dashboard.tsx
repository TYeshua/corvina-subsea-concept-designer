import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Droplets,
  Flame,
  Gauge,
  RefreshCw,
  TrendingUp,
  Waves,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCalculations, getScenario } from "../api/client";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { MetricCard } from "../components/MetricCard";
import { SectionCard } from "../components/SectionCard";
import { executiveSummary } from "../content/technicalTexts";
import type { CalculationResults } from "../types/calculations";
import type { Scenario } from "../types/scenario";
import { formatNumber, formatPercent } from "../utils/format";

const pieColors = ["#22d3ee", "#60a5fa", "#34d399", "#f59e0b", "#a78bfa"];

export function Dashboard() {
  const [calculations, setCalculations] = useState<CalculationResults | null>(
    null,
  );
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      try {
        const [calculationData, scenarioData] = await Promise.all([
          getCalculations(),
          getScenario(),
        ]);

        if (!active) {
          return;
        }

        setCalculations(calculationData);
        setScenario(scenarioData);
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

    loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const productionData = useMemo(() => {
    if (!calculations) {
      return [];
    }

    return [
      { name: "Óleo", value: calculations.total_oil_rate_stb_d },
      { name: "Água", value: calculations.total_water_rate_stb_d },
      { name: "Gás", value: calculations.total_gas_rate_mmscf_d },
    ];
  }, [calculations]);

  const occupancyData = useMemo(() => {
    if (!calculations) {
      return [];
    }

    return [
      { name: "Óleo", value: calculations.fpso_oil_occupancy_percent },
      { name: "Gás", value: calculations.fpso_gas_occupancy_percent },
      {
        name: "Água produzida",
        value: calculations.fpso_produced_water_occupancy_percent,
      },
      {
        name: "Injeção/tratamento",
        value: calculations.water_treatment_injection_occupancy_percent,
      },
    ];
  }, [calculations]);

  const oilByWellData = useMemo(() => {
    return (
      scenario?.producer_wells.map((well) => ({
        name: well.id,
        value: well.oil_rate_stb_d,
      })) ?? []
    );
  }, [scenario]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !calculations || !scenario) {
    return <ErrorState message={error ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Leitura executiva do Campo Corvina
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Visão integrada dos resultados de produção, capacidade da FPSO e
          estratégia conceitual de reinjeção.
        </p>
      </div>

      <SectionCard title="Resumo executivo">
        <p className="text-sm leading-7 text-slate-300">{executiveSummary}</p>
      </SectionCard>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">5.1 Produção</h2>
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Óleo total"
            value={formatNumber(calculations.total_oil_rate_stb_d)}
            unit="STB/d"
            description="Produção total estimada dos cinco poços produtores."
            icon={<Flame className="h-5 w-5" />}
            accent="amber"
          />
          <MetricCard
            title="Água total"
            value={formatNumber(calculations.total_water_rate_stb_d)}
            unit="STB/d"
            description="Vazão de água produzida associada ao cenário base."
            icon={<Droplets className="h-5 w-5" />}
            accent="blue"
          />
          <MetricCard
            title="Gás total"
            value={formatNumber(calculations.total_gas_rate_mmscf_d)}
            unit="MMSCF/d"
            description="Produção total de gás antes do consumo operacional."
            icon={<Activity className="h-5 w-5" />}
            accent="cyan"
          />
        </section>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">5.2 Capacidade da FPSO</h2>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Ocupação em óleo"
            value={formatPercent(calculations.fpso_oil_occupancy_percent)}
            unit="%"
            description="Uso da capacidade de processamento de óleo."
            icon={<Gauge className="h-5 w-5" />}
            accent="amber"
          />
          <MetricCard
            title="Ocupação em gás"
            value={formatPercent(calculations.fpso_gas_occupancy_percent)}
            unit="%"
            description="Uso da capacidade de processamento de gás."
            icon={<Gauge className="h-5 w-5" />}
            accent="cyan"
          />
          <MetricCard
            title="Água produzida"
            value={formatPercent(calculations.fpso_produced_water_occupancy_percent)}
            unit="%"
            description="Ocupação da capacidade associada à água produzida."
            icon={<Waves className="h-5 w-5" />}
            accent="blue"
          />
          <MetricCard
            title="Tratamento/injeção"
            value={formatPercent(
              calculations.water_treatment_injection_occupancy_percent,
            )}
            unit="%"
            description="Uso da capacidade de tratamento e injeção de água."
            icon={<RefreshCw className="h-5 w-5" />}
            accent="emerald"
          />
        </section>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">5.3 Estratégia de injeção</h2>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Injeção total de água"
            value={formatNumber(calculations.total_water_injection_rate_bwpd)}
            unit="BWPD"
            description="Vazão total enviada aos poços injetores de água."
            icon={<RefreshCw className="h-5 w-5" />}
            accent="emerald"
          />
          <MetricCard
            title="Gás para reinjeção"
            value={formatNumber(calculations.gas_available_for_reinjection_mmscf_d)}
            unit="MMSCF/d"
            description="Gás disponível após o consumo operacional da FPSO."
            icon={<BarChart3 className="h-5 w-5" />}
            accent="cyan"
          />
          <MetricCard
            title="Margem de óleo"
            value={formatNumber(calculations.remaining_oil_capacity_stb_d)}
            unit="STB/d"
            description="Capacidade ainda disponível para produção incremental."
            icon={<TrendingUp className="h-5 w-5" />}
            accent="amber"
          />
          <MetricCard
            title="Margem de gás"
            value={formatNumber(calculations.remaining_gas_capacity_mmscf_d)}
            unit="MMSCF/d"
            description="Capacidade de processamento de gás ainda disponível."
            icon={<TrendingUp className="h-5 w-5" />}
            accent="blue"
          />
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Produção total por fluido"
          description="Visualização comparativa conceitual; as unidades dos fluidos são diferentes."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(6, 182, 212, 0.25)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
                <Bar dataKey="value" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Ocupação das capacidades da FPSO">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" interval={0} />
                <YAxis stroke="#94a3b8" unit="%" />
                <Tooltip
                  cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
                  formatter={(value) => [
                    `${formatPercent(Number(value))}%`,
                    "Ocupação",
                  ]}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(6, 182, 212, 0.25)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
                <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Distribuição da produção de óleo por poço">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={oilByWellData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {oilByWellData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  formatter={(value) => [
                    `${formatNumber(Number(value))} STB/d`,
                    "Óleo",
                  ]}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(6, 182, 212, 0.25)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Leitura técnica dos resultados">
        <div className="grid gap-3 md:grid-cols-3">
          {calculations.interpretation.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-cyan-500/15 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
