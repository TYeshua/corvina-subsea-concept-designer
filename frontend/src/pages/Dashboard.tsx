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
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
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
import type { CalculationSummary } from "../types/calculations";
import type { Scenario } from "../types/scenario";
import { formatNumber, formatPercent } from "../utils/format";

interface ProductionDatum {
  name: string;
  oleo: number;
  agua: number;
  gas: number;
  bsw: number;
  liquidos: number;
  oilSharePercent: number;
}

interface OccupancyDatum {
  name: string;
  fullName: string;
  value: number;
  color: string;
}

interface OilTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ProductionDatum }>;
}

interface OccupancyTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: OccupancyDatum }>;
}

const tooltipStyle = {
  background: "#020617",
  border: "1px solid rgba(6, 182, 212, 0.25)",
  borderRadius: "8px",
  color: "#e2e8f0",
};

const wellColorById: Record<string, string> = {
  "P-01": "#22d3ee",
  "P-02": "#60a5fa",
  "P-03": "#34d399",
  "P-04": "#f59e0b",
  "P-05": "#a78bfa",
};

function getWellColor(wellId: string): string {
  return wellColorById[wellId] ?? "#94a3b8";
}

function compactThousands(value: number): string {
  return `${formatNumber(value / 1000)} mil`;
}

function OilDistributionTooltip({ active, payload }: OilTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-cyan-500/25 bg-slate-950 px-4 py-3 text-xs shadow-panel">
      <p className="text-sm font-semibold text-cyan-100">{data.name}</p>
      <dl className="mt-2 grid gap-1 text-slate-300">
        <div className="flex justify-between gap-4">
          <dt>Óleo</dt>
          <dd className="font-semibold text-white">
            {formatNumber(data.oleo)} STB/d
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Participação</dt>
          <dd className="font-semibold text-white">
            {formatPercent(data.oilSharePercent)}%
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Líquidos</dt>
          <dd>{formatNumber(data.liquidos)} STB/d</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Água</dt>
          <dd>{formatNumber(data.agua)} STB/d</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Gás</dt>
          <dd>{formatNumber(data.gas)} MMSCF/d</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>BSW</dt>
          <dd>{formatPercent(data.bsw)}%</dd>
        </div>
      </dl>
    </div>
  );
}

function OccupancyTooltip({ active, payload }: OccupancyTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-cyan-500/25 bg-slate-950 px-4 py-3 text-xs shadow-panel">
      <p className="text-sm font-semibold text-cyan-100">{data.fullName}</p>
      <p className="mt-1 text-slate-300">
        Ocupação:{" "}
        <span className="font-semibold text-white">
          {formatPercent(data.value)}%
        </span>
      </p>
    </div>
  );
}

function OilProductionLegend({ data }: { data: ProductionDatum[] }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
      <h3 className="text-sm font-semibold text-white">
        Legenda de cores e vazões
      </h3>
      <div className="mt-3 grid gap-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-[auto_3.5rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getWellColor(item.name) }}
            />
            <span className="text-sm font-semibold text-cyan-50">
              {item.name}
            </span>
            <span className="text-right text-sm font-semibold text-white">
              {formatNumber(item.oleo)} STB/d
            </span>
            <span className="col-span-3 text-xs leading-5 text-slate-400">
              {formatPercent(item.oilSharePercent)}% do óleo total; BSW{" "}
              {formatPercent(item.bsw)}%.
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OccupancyLegend({ data }: { data: OccupancyDatum[] }) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-300">{item.fullName}</span>
          </div>
          <span className="font-semibold text-white">
            {formatPercent(item.value)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const [calculations, setCalculations] = useState<CalculationSummary | null>(
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

        setCalculations(calculationData.summary);
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

  const productionByWellData = useMemo<ProductionDatum[]>(() => {
    if (!scenario || !calculations) {
      return [];
    }

    return scenario.producer_wells.map((well) => ({
      name: well.id,
      oleo: well.oil_rate_stb_d,
      agua: well.water_rate_stb_d,
      gas: well.gas_rate_mmscf_d,
      bsw: well.bsw_percent,
      liquidos: well.oil_rate_stb_d + well.water_rate_stb_d,
      oilSharePercent:
        (well.oil_rate_stb_d / calculations.total_oil_rate_stb_d) * 100,
    }));
  }, [calculations, scenario]);

  const oilDistributionData = useMemo(
    () => [...productionByWellData].sort((a, b) => b.oleo - a.oleo),
    [productionByWellData],
  );

  const oilSummary = useMemo(() => {
    const highest = oilDistributionData[0];
    const lowest = oilDistributionData[oilDistributionData.length - 1];

    return {
      highest,
      lowest,
      spread: highest && lowest ? highest.oleo - lowest.oleo : 0,
    };
  }, [oilDistributionData]);

  const occupancyData = useMemo<OccupancyDatum[]>(() => {
    if (!calculations) {
      return [];
    }

    return [
      {
        name: "Óleo",
        fullName: "Óleo processado",
        value: calculations.fpso_oil_occupancy_percent,
        color: "#34d399",
      },
      {
        name: "Gás",
        fullName: "Gás processado",
        value: calculations.fpso_gas_occupancy_percent,
        color: "#38bdf8",
      },
      {
        name: "Água prod.",
        fullName: "Água produzida",
        value: calculations.fpso_produced_water_occupancy_percent,
        color: "#60a5fa",
      },
      {
        name: "Trat./inj.",
        fullName: "Tratamento e injeção de água",
        value: calculations.water_treatment_injection_occupancy_percent,
        color: "#a78bfa",
      },
    ];
  }, [calculations]);

  const gasBalanceData = useMemo(() => {
    if (!calculations || !scenario) {
      return [];
    }

    return [
      { name: "Produzido", value: calculations.total_gas_rate_mmscf_d },
      { name: "Consumo FPSO", value: scenario.fpso.gas_consumption_mmscf_d },
      {
        name: "Reinjeção",
        value: calculations.gas_available_for_reinjection_mmscf_d,
      },
      {
        name: "Folga FPSO",
        value: calculations.remaining_gas_capacity_mmscf_d,
      },
    ];
  }, [calculations, scenario]);

  const liquidInjectionData = useMemo(() => {
    if (!calculations) {
      return [];
    }

    return [
      { name: "Produção de líquidos", value: calculations.total_liquid_rate_stb_d },
      { name: "Injeção de água", value: calculations.total_water_injection_rate_bwpd },
      {
        name: "Diferença a compensar",
        value:
          calculations.total_liquid_rate_stb_d -
          calculations.total_water_injection_rate_bwpd,
      },
    ];
  }, [calculations]);

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
          Visão integrada de produção, ocupação da FPSO, BSW, balanço de gás e
          compatibilidade conceitual entre produção líquida e injeção de água.
        </p>
      </div>

      <SectionCard title="Resumo executivo">
        <p className="text-sm leading-7 text-slate-300">{executiveSummary}</p>
      </SectionCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Óleo total"
          value={formatNumber(calculations.total_oil_rate_stb_d)}
          unit="STB/d"
          description="Produção total estimada dos cinco produtores."
          icon={<Flame className="h-5 w-5" />}
          accent="amber"
        />
        <MetricCard
          title="Líquidos totais"
          value={formatNumber(calculations.total_liquid_rate_stb_d)}
          unit="STB/d"
          description="Óleo + água produzida."
          icon={<Waves className="h-5 w-5" />}
          accent="blue"
        />
        <MetricCard
          title="BSW ponderado"
          value={formatPercent(calculations.weighted_bsw_percent)}
          unit="%"
          description="Mais representativo por considerar as vazões totais."
          icon={<Droplets className="h-5 w-5" />}
          accent="cyan"
        />
        <MetricCard
          title="Reposição por água"
          value={formatPercent(
            calculations.water_injection_liquid_replacement_ratio_percent,
          )}
          unit="%"
          description="Razão simplificada entre injeção de água e produção líquida."
          icon={<RefreshCw className="h-5 w-5" />}
          accent="emerald"
        />
      </section>

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
          icon={<Activity className="h-5 w-5" />}
          accent="cyan"
        />
        <MetricCard
          title="Gás para reinjeção"
          value={formatNumber(calculations.gas_available_for_reinjection_mmscf_d)}
          unit="MMSCF/d"
          description="Gás disponível após consumo operacional da FPSO."
          icon={<BarChart3 className="h-5 w-5" />}
          accent="blue"
        />
        <MetricCard
          title="Margem de óleo"
          value={formatNumber(calculations.remaining_oil_capacity_stb_d)}
          unit="STB/d"
          description="Folga conceitual de processamento de óleo."
          icon={<TrendingUp className="h-5 w-5" />}
          accent="emerald"
        />
      </section>

      <section className="space-y-5">
        <SectionCard
          title="Distribuição da produção de óleo por poço"
          description="Barras horizontais em STB/d, linha de média por poço e legenda com cor, poço e valor exato."
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="h-[420px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={oilDistributionData}
                  layout="vertical"
                  margin={{ top: 12, right: 92, bottom: 32, left: 8 }}
                >
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    tickFormatter={(value) => compactThousands(Number(value))}
                    label={{
                      value: "Óleo produzido (STB/d)",
                      position: "insideBottom",
                      offset: -18,
                      fill: "#94a3b8",
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={64}
                    stroke="#94a3b8"
                  />
                  <Tooltip content={<OilDistributionTooltip />} />
                  <ReferenceLine
                    x={calculations.average_oil_rate_per_well_stb_d}
                    stroke="#67e8f9"
                    strokeDasharray="5 5"
                    label={{
                      value: `Média ${formatNumber(
                        calculations.average_oil_rate_per_well_stb_d,
                      )}`,
                      fill: "#bae6fd",
                      position: "top",
                    }}
                  />
                  <Bar dataKey="oleo" name="Óleo produzido" radius={[0, 6, 6, 0]}>
                    {oilDistributionData.map((entry) => (
                      <Cell key={entry.name} fill={getWellColor(entry.name)} />
                    ))}
                    <LabelList
                      dataKey="oleo"
                      position="right"
                      fill="#e2e8f0"
                      formatter={(value: number) => formatNumber(value)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-3 text-sm">
              <OilProductionLegend data={oilDistributionData} />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Maior produtor
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {oilSummary.highest?.name} ·{" "}
                    {formatNumber(oilSummary.highest?.oleo ?? 0)} STB/d
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase text-slate-500">
                    Menor produtor
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {oilSummary.lowest?.name} ·{" "}
                    {formatNumber(oilSummary.lowest?.oleo ?? 0)} STB/d
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Composição de líquidos e BSW por poço"
          description="Óleo e água em barras empilhadas; linha roxa mostra o BSW de cada produtor."
        >
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={productionByWellData}
                margin={{ top: 16, right: 36, bottom: 24, left: 8 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  tickFormatter={(value) => compactThousands(Number(value))}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#c4b5fd"
                  unit="%"
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    if (name === "BSW") {
                      return [`${formatPercent(Number(value))}%`, name];
                    }

                    return [`${formatNumber(Number(value))} STB/d`, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="oleo"
                  name="Óleo"
                  stackId="liquidos"
                  fill="#f59e0b"
                />
                <Bar
                  yAxisId="left"
                  dataKey="agua"
                  name="Água produzida"
                  stackId="liquidos"
                  fill="#60a5fa"
                  radius={[5, 5, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bsw"
                  name="BSW"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Gás associado por poço"
          description="Produção de gás em MMSCF/d com referência para a média simples dos cinco produtores."
        >
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productionByWellData}
                margin={{ top: 16, right: 36, bottom: 24, left: 8 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${formatNumber(Number(value))} MMSCF/d`, "Gás"]}
                />
                <ReferenceLine
                  y={calculations.average_gas_rate_per_well_mmscf_d}
                  stroke="#67e8f9"
                  strokeDasharray="5 5"
                  label="Média"
                />
                <Bar dataKey="gas" name="Gás" fill="#22d3ee" radius={[5, 5, 0, 0]}>
                  <LabelList
                    dataKey="gas"
                    position="top"
                    fill="#e2e8f0"
                    formatter={(value: number) => formatNumber(value)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Ocupação das capacidades da FPSO"
          description="Barras horizontais eliminam a sobreposição de rótulos e mostram as referências de 70% e 90%."
        >
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occupancyData}
                layout="vertical"
                margin={{ top: 16, right: 84, bottom: 18, left: 12 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={94}
                  stroke="#94a3b8"
                  interval={0}
                />
                <Tooltip content={<OccupancyTooltip />} />
                <ReferenceLine x={70} stroke="#f59e0b" strokeDasharray="4 4" />
                <ReferenceLine x={90} stroke="#ef4444" strokeDasharray="4 4" />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {occupancyData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill="#e2e8f0"
                    formatter={(value: number) => `${formatPercent(value)}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <OccupancyLegend data={occupancyData} />
        </SectionCard>

        <SectionCard
          title="Balanço de gás"
          description="Compara gás produzido, consumo da FPSO, volume para reinjeção e folga de processamento."
        >
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gasBalanceData}
                margin={{ top: 16, right: 36, bottom: 24, left: 8 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" interval={0} />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${formatNumber(Number(value))} MMSCF/d`, "Gás"]}
                />
                <Bar dataKey="value" fill="#38bdf8" radius={[5, 5, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#e2e8f0"
                    formatter={(value: number) => formatNumber(value)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Produção líquida vs injeção de água"
          description="A injeção de água sozinha não repõe integralmente os líquidos produzidos; a reinjeção de gás complementa a estratégia conceitual."
        >
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={liquidInjectionData}
                margin={{ top: 16, right: 36, bottom: 24, left: 8 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" interval={0} />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => compactThousands(Number(value))}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${formatNumber(Number(value))} STB/d`, "Vazão"]}
                />
                <Bar dataKey="value" fill="#2dd4bf" radius={[5, 5, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#e2e8f0"
                    formatter={(value: number) => formatNumber(value)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Leitura técnica dos resultados">
          <div className="grid gap-3 md:grid-cols-2">
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
      </section>
    </div>
  );
}
