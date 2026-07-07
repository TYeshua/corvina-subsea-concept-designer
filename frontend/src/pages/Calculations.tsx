import { useEffect, useState } from "react";
import { getCalculations, getScenario } from "../api/client";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import type { CalculationResults } from "../types/calculations";
import type { Scenario } from "../types/scenario";
import { formatDecimal, formatNumber, formatPercent } from "../utils/format";

type Status = "OK" | "Atenção" | "Crítico";

interface CalculationItem {
  indicator: string;
  value: string;
  unit: string;
  formula: string;
  equation: string;
  interpretation: string;
  status?: Status;
}

interface CalculationGroup {
  title: string;
  items: CalculationItem[];
}

function occupancyStatus(
  value: number,
  warningThreshold: number,
  criticalThreshold: number,
): Status {
  if (value > criticalThreshold) {
    return "Crítico";
  }

  if (value >= warningThreshold) {
    return "Atenção";
  }

  return "OK";
}

function statusClasses(status: Status): string {
  const styles: Record<Status, string> = {
    OK: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    Atenção: "border-amber-500/25 bg-amber-500/10 text-amber-100",
    Crítico: "border-red-500/25 bg-red-500/10 text-red-100",
  };

  return styles[status];
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold ${statusClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}

function joinValues(values: number[], formatter = formatNumber): string {
  return values.map((value) => formatter(value)).join(" + ");
}

function buildGroups(
  calculations: CalculationResults,
  scenario: Scenario,
): CalculationGroup[] {
  const producers = scenario.producer_wells;
  const waterInjectors = scenario.injector_wells.filter((well) =>
    well.fluid
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes("agua"),
  );
  const oilRates = producers.map((well) => well.oil_rate_stb_d);
  const waterRates = producers.map((well) => well.water_rate_stb_d);
  const gasRates = producers.map((well) => well.gas_rate_mmscf_d);
  const bswValues = producers.map((well) => well.bsw_percent);
  const waterInjectionRates = waterInjectors.map((well) => well.rate);
  const producerCount = producers.length;

  const oilStatus = occupancyStatus(calculations.fpso_oil_occupancy_percent, 70, 90);
  const gasStatus = occupancyStatus(calculations.fpso_gas_occupancy_percent, 80, 95);
  const waterStatus = occupancyStatus(
    calculations.fpso_produced_water_occupancy_percent,
    70,
    90,
  );
  const treatmentStatus = occupancyStatus(
    calculations.water_treatment_injection_occupancy_percent,
    70,
    90,
  );

  return [
    {
      title: "1. Produção total",
      items: [
        {
          indicator: "Produção total de óleo",
          value: formatNumber(calculations.total_oil_rate_stb_d),
          unit: "STB/d",
          formula: "Qóleo,total = Σ Qóleo,produtor",
          equation: `${joinValues(oilRates)} = ${formatNumber(
            calculations.total_oil_rate_stb_d,
          )} STB/d`,
          interpretation: "Vazão total dos cinco poços produtores.",
        },
        {
          indicator: "Produção total de água",
          value: formatNumber(calculations.total_water_rate_stb_d),
          unit: "STB/d",
          formula: "Qágua,total = Σ Qágua,produtor",
          equation: `${joinValues(waterRates)} = ${formatNumber(
            calculations.total_water_rate_stb_d,
          )} STB/d`,
          interpretation: "Água produzida associada ao cenário base.",
        },
        {
          indicator: "Produção total de gás",
          value: formatNumber(calculations.total_gas_rate_mmscf_d),
          unit: "MMSCF/d",
          formula: "Qgás,total = Σ Qgás,produtor",
          equation: `${joinValues(gasRates, (value) =>
            formatDecimal(value, 1),
          )} = ${formatNumber(calculations.total_gas_rate_mmscf_d)} MMSCF/d`,
          interpretation: "Volume total de gás antes do consumo operacional.",
        },
      ],
    },
    {
      title: "2. Produção média por poço",
      items: [
        {
          indicator: "Óleo médio por produtor",
          value: formatNumber(calculations.average_oil_rate_per_well_stb_d),
          unit: "STB/d",
          formula: "Qóleo,médio = Qóleo,total / Nprodutores",
          equation: `${formatNumber(
            calculations.total_oil_rate_stb_d,
          )} / ${producerCount} = ${formatNumber(
            calculations.average_oil_rate_per_well_stb_d,
          )} STB/d`,
          interpretation: "Média simples entre os poços produtores.",
        },
        {
          indicator: "Água média por produtor",
          value: formatNumber(calculations.average_water_rate_per_well_stb_d),
          unit: "STB/d",
          formula: "Qágua,média = Qágua,total / Nprodutores",
          equation: `${formatNumber(
            calculations.total_water_rate_stb_d,
          )} / ${producerCount} = ${formatNumber(
            calculations.average_water_rate_per_well_stb_d,
          )} STB/d`,
          interpretation: "Média simples de água produzida por produtor.",
        },
        {
          indicator: "Gás médio por produtor",
          value: formatDecimal(calculations.average_gas_rate_per_well_mmscf_d),
          unit: "MMSCF/d",
          formula: "Qgás,médio = Qgás,total / Nprodutores",
          equation: `${formatNumber(
            calculations.total_gas_rate_mmscf_d,
          )} / ${producerCount} = ${formatDecimal(
            calculations.average_gas_rate_per_well_mmscf_d,
          )} MMSCF/d`,
          interpretation: "Média simples de gás produzido por produtor.",
        },
        {
          indicator: "BSW médio simples",
          value: formatDecimal(calculations.simple_average_bsw_percent),
          unit: "%",
          formula: "BSWmédio = Σ BSWprodutor / Nprodutores",
          equation: `(${joinValues(bswValues, (value) =>
            formatDecimal(value, 1),
          )}) / ${producerCount} = ${formatDecimal(
            calculations.simple_average_bsw_percent,
          )}%`,
          interpretation: "Valor moderado para avaliação conceitual inicial.",
        },
      ],
    },
    {
      title: "3. Ocupação da FPSO",
      items: [
        {
          indicator: "Ocupação em óleo",
          value: formatPercent(calculations.fpso_oil_occupancy_percent),
          unit: "%",
          formula: "Ocupaçãoóleo = Qóleo,total / Capacidadeóleo,FPSO × 100",
          equation: `${formatNumber(
            calculations.total_oil_rate_stb_d,
          )} / ${formatNumber(
            scenario.fpso.max_oil_processing_stb_d,
          )} × 100 = ${formatPercent(
            calculations.fpso_oil_occupancy_percent,
          )}%`,
          interpretation:
            "Alta ocupação, ainda dentro do limite operacional conceitual.",
          status: oilStatus,
        },
        {
          indicator: "Ocupação em gás",
          value: formatPercent(calculations.fpso_gas_occupancy_percent),
          unit: "%",
          formula: "Ocupaçãogás = Qgás,total / Capacidadegás,FPSO × 100",
          equation: `${formatNumber(
            calculations.total_gas_rate_mmscf_d,
          )} / ${formatNumber(
            scenario.fpso.max_gas_processing_mmscf_d,
          )} × 100 = ${formatPercent(
            calculations.fpso_gas_occupancy_percent,
          )}%`,
          interpretation: "Uso relevante da capacidade de processamento de gás.",
          status: gasStatus,
        },
        {
          indicator: "Ocupação em água produzida",
          value: formatPercent(calculations.fpso_produced_water_occupancy_percent),
          unit: "%",
          formula: "Ocupaçãoágua = Qágua,total / Capacidadeágua,FPSO × 100",
          equation: `${formatNumber(
            calculations.total_water_rate_stb_d,
          )} / ${formatNumber(
            scenario.fpso.max_water_treatment_injection_stb_d,
          )} × 100 = ${formatPercent(
            calculations.fpso_produced_water_occupancy_percent,
          )}%`,
          interpretation: "Baixa ocupação para o cenário de água produzida.",
          status: waterStatus,
        },
      ],
    },
    {
      title: "4. Injeção",
      items: [
        {
          indicator: "Vazão total de injeção de água",
          value: formatNumber(calculations.total_water_injection_rate_bwpd),
          unit: "BWPD",
          formula: "Qinj,água,total = Σ Qinj,água",
          equation: `${joinValues(waterInjectionRates)} = ${formatNumber(
            calculations.total_water_injection_rate_bwpd,
          )} BWPD`,
          interpretation: "Soma dos dois poços injetores de água.",
        },
        {
          indicator: "Ocupação da capacidade de água",
          value: formatPercent(
            calculations.water_treatment_injection_occupancy_percent,
          ),
          unit: "%",
          formula: "Ocupaçãoinj = Qinj,água,total / Capacidadeágua,FPSO × 100",
          equation: `${formatNumber(
            calculations.total_water_injection_rate_bwpd,
          )} / ${formatNumber(
            scenario.fpso.max_water_treatment_injection_stb_d,
          )} × 100 = ${formatPercent(
            calculations.water_treatment_injection_occupancy_percent,
          )}%`,
          interpretation: "Há margem operacional significativa.",
          status: treatmentStatus,
        },
        {
          indicator: "Gás disponível para reinjeção",
          value: formatNumber(calculations.gas_available_for_reinjection_mmscf_d),
          unit: "MMSCF/d",
          formula: "Qgás,reinj = Qgás,total - ConsumoFPSO",
          equation: `${formatNumber(
            calculations.total_gas_rate_mmscf_d,
          )} - ${formatNumber(
            scenario.fpso.gas_consumption_mmscf_d,
          )} = ${formatNumber(
            calculations.gas_available_for_reinjection_mmscf_d,
          )} MMSCF/d`,
          interpretation: "Excedente após o consumo operacional da FPSO.",
        },
      ],
    },
    {
      title: "5. Margens operacionais",
      items: [
        {
          indicator: "Margem restante de óleo",
          value: formatNumber(calculations.remaining_oil_capacity_stb_d),
          unit: "STB/d",
          formula: "Margemóleo = Capacidadeóleo,FPSO - Qóleo,total",
          equation: `${formatNumber(
            scenario.fpso.max_oil_processing_stb_d,
          )} - ${formatNumber(
            calculations.total_oil_rate_stb_d,
          )} = ${formatNumber(calculations.remaining_oil_capacity_stb_d)} STB/d`,
          interpretation: "Capacidade disponível para produção incremental.",
        },
        {
          indicator: "Margem restante de gás",
          value: formatNumber(calculations.remaining_gas_capacity_mmscf_d),
          unit: "MMSCF/d",
          formula: "Margemgás = Capacidadegás,FPSO - Qgás,total",
          equation: `${formatNumber(
            scenario.fpso.max_gas_processing_mmscf_d,
          )} - ${formatNumber(
            calculations.total_gas_rate_mmscf_d,
          )} = ${formatNumber(
            calculations.remaining_gas_capacity_mmscf_d,
          )} MMSCF/d`,
          interpretation: "Capacidade de processamento ainda disponível.",
        },
        {
          indicator: "Margem restante de água/injeção",
          value: formatNumber(
            calculations.remaining_water_treatment_injection_capacity_stb_d,
          ),
          unit: "STB/d",
          formula: "Margemágua = Capacidadeágua,FPSO - Qinj,água,total",
          equation: `${formatNumber(
            scenario.fpso.max_water_treatment_injection_stb_d,
          )} - ${formatNumber(
            calculations.total_water_injection_rate_bwpd,
          )} = ${formatNumber(
            calculations.remaining_water_treatment_injection_capacity_stb_d,
          )} STB/d`,
          interpretation:
            "Folga para tratamento ou injeção no cenário conceitual.",
        },
      ],
    },
  ];
}

export function Calculations() {
  const [calculations, setCalculations] = useState<CalculationResults | null>(
    null,
  );
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
          setCalculations(calculationData);
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

  if (error || !calculations || !scenario) {
    return <ErrorState message={error ?? undefined} />;
  }

  const groups = buildGroups(calculations, scenario);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">Cálculos</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Resultados de engenharia
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Consolidação dos indicadores retornados pelo backend FastAPI para o
          cenário base do Campo Corvina, agora com equações e substituição
          numérica de cada cálculo realizado.
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-white">{group.title}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => (
                <article
                  key={item.indicator}
                  className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold text-cyan-100">
                      {item.indicator}
                    </h2>
                    {item.status ? <StatusBadge status={item.status} /> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span className="break-words text-2xl font-semibold text-white">
                      {item.value}
                    </span>
                    <span className="text-xs text-slate-500">{item.unit}</span>
                  </div>
                  <div className="mt-4 space-y-2 rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3 text-xs leading-5">
                    <p className="font-semibold text-cyan-100">Equação</p>
                    <p className="font-mono text-cyan-50">{item.formula}</p>
                    <p className="font-mono text-slate-300">{item.equation}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.interpretation}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <SectionCard title="6. Interpretação técnica">
        <div className="space-y-3 text-sm leading-7 text-slate-300">
          <p>
            A FPSO apresenta ocupação de óleo de{" "}
            {formatPercent(calculations.fpso_oil_occupancy_percent)}%, portanto
            o indicador é classificado como <strong>Atenção</strong>. A unidade
            ainda possui margem operacional, mas o cenário merece acompanhamento
            por estar acima de 70% da capacidade de processamento.
          </p>
          <p>
            Como não há infraestrutura de exportação de gás, o volume disponível
            após o consumo operacional deve ser destinado prioritariamente à
            reinjeção.
          </p>
          <p>
            A capacidade de tratamento e injeção de água mantém folga relevante,
            favorecendo a estratégia de suporte de pressão e preservando espaço
            para futuras expansões do arranjo submarino.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
