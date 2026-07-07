import { useEffect, useState } from "react";
import { getScenario } from "../api/client";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import { fieldDataInterpretation } from "../content/technicalTexts";
import type { Scenario } from "../types/scenario";
import { formatDecimal, formatNumber } from "../utils/format";

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="border-b border-slate-800 pb-3">
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-white">{value}</dd>
    </div>
  );
}

export function FieldData() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadScenario() {
      try {
        const data = await getScenario();

        if (active) {
          setScenario(data);
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

    loadScenario();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !scenario) {
    return <ErrorState message={error ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">
          Dados do Campo
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Cenário base do Campo Corvina
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Premissas fixas usadas pelo backend para cálculos, recomendações e
          geração das bases de layout.
        </p>
      </div>

      <SectionCard title="Dados gerais do campo">
        <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem label="Campo" value={scenario.field.name} />
          <InfoItem label="Bloco" value={scenario.field.block} />
          <InfoItem label="Bacia" value={scenario.field.basin} />
          <InfoItem
            label="Regime contratual"
            value={scenario.field.contract_regime}
          />
          <InfoItem
            label="Lâmina d'água"
            value={`${formatNumber(scenario.field.water_depth_m)} m`}
          />
          <InfoItem
            label="Profundidade do reservatório"
            value={`${formatNumber(scenario.field.reservoir_depth_m)} m`}
          />
          <InfoItem
            label="Tipo de reservatório"
            value={scenario.field.reservoir_type}
          />
          <InfoItem
            label="Vida útil prevista"
            value={`${scenario.field.expected_life_years} anos`}
          />
          <InfoItem
            label="Área aproximada"
            value={`${formatNumber(scenario.field.area_km2)} km²`}
          />
          <InfoItem
            label="Poços totais"
            value={formatNumber(scenario.field.total_wells)}
          />
          <InfoItem
            label="Produtores"
            value={formatNumber(scenario.field.producer_wells)}
          />
          <InfoItem
            label="Injetores"
            value={formatNumber(scenario.field.injector_wells)}
          />
        </dl>
      </SectionCard>

      <SectionCard title="Dados da FPSO">
        <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem
            label="Capacidade de óleo"
            value={`${formatNumber(scenario.fpso.max_oil_processing_stb_d)} STB/d`}
          />
          <InfoItem
            label="Capacidade de gás"
            value={`${formatNumber(scenario.fpso.max_gas_processing_mmscf_d)} MMSCF/d`}
          />
          <InfoItem
            label="Capacidade de água"
            value={`${formatNumber(
              scenario.fpso.max_water_treatment_injection_stb_d,
            )} STB/d`}
          />
          <InfoItem
            label="Armazenamento"
            value={`${formatNumber(scenario.fpso.storage_capacity_stb)} STB`}
          />
          <InfoItem
            label="Consumo de gás"
            value={`${formatNumber(scenario.fpso.gas_consumption_mmscf_d)} MMSCF/d`}
          />
          <InfoItem
            label="Linhas de produção"
            value={formatNumber(scenario.fpso.production_lines_available)}
          />
          <InfoItem
            label="Linhas de injeção"
            value={formatNumber(scenario.fpso.injection_lines)}
          />
          <InfoItem label="Tipo" value={scenario.fpso.type} />
        </dl>
      </SectionCard>

      <SectionCard title="Tabela dos poços produtores">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="border-b border-slate-800 px-4 py-3 font-medium">ID</th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Nome completo
                </th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Óleo
                </th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Água
                </th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Gás
                </th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  BSW
                </th>
              </tr>
            </thead>
            <tbody>
              {scenario.producer_wells.map((well) => (
                <tr key={well.id} className="text-slate-200">
                  <td className="border-b border-slate-800 px-4 py-3 font-medium text-cyan-200">
                    {well.id}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {well.full_name}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {formatNumber(well.oil_rate_stb_d)} STB/d
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {formatNumber(well.water_rate_stb_d)} STB/d
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {formatDecimal(well.gas_rate_mmscf_d)} MMSCF/d
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {formatDecimal(well.bsw_percent)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Tabela dos poços injetores">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="border-b border-slate-800 px-4 py-3 font-medium">ID</th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Nome completo
                </th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Fluido
                </th>
                <th className="border-b border-slate-800 px-4 py-3 font-medium">
                  Vazão
                </th>
              </tr>
            </thead>
            <tbody>
              {scenario.injector_wells.map((well) => (
                <tr key={well.id} className="text-slate-200">
                  <td className="border-b border-slate-800 px-4 py-3 font-medium text-cyan-200">
                    {well.id}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {well.full_name}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {well.fluid}
                  </td>
                  <td className="border-b border-slate-800 px-4 py-3">
                    {formatNumber(well.rate)} {well.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Propriedades dos fluidos">
          <dl className="grid gap-3 md:grid-cols-2">
            <InfoItem label="Óleo" value={scenario.fluids.oil_type} />
            <InfoItem label="API" value={`${scenario.fluids.oil_api}°`} />
            <InfoItem
              label="Densidade do óleo"
              value={`${formatNumber(scenario.fluids.oil_density_kg_m3)} kg/m³`}
            />
            <InfoItem
              label="Viscosidade"
              value={`${formatNumber(scenario.fluids.oil_viscosity_cp)} cP`}
            />
            <InfoItem
              label="Gravidade específica do gás"
              value={formatDecimal(scenario.fluids.gas_specific_gravity)}
            />
            <InfoItem
              label="Salinidade da água"
              value={`${formatNumber(scenario.fluids.water_salinity_mg_l)} mg/L`}
            />
            <InfoItem
              label="Densidade da água"
              value={`${formatNumber(scenario.fluids.water_density_kg_m3)} kg/m³`}
            />
          </dl>
        </SectionCard>

        <SectionCard title="Condições meteo-oceanográficas">
          <dl className="grid gap-3 md:grid-cols-2">
            <InfoItem
              label="Direção da corrente"
              value={scenario.meteo_ocean.predominant_current_direction}
            />
            <InfoItem
              label="Velocidade média"
              value={`${formatDecimal(
                scenario.meteo_ocean.average_current_velocity_m_s,
              )} m/s`}
            />
            <InfoItem
              label="Velocidade máxima de projeto"
              value={`${formatDecimal(
                scenario.meteo_ocean.design_current_velocity_m_s,
              )} m/s`}
            />
            <InfoItem
              label="Altura significativa das ondas"
              value={`${formatDecimal(
                scenario.meteo_ocean.significant_wave_height_m,
              )} m`}
            />
            <InfoItem
              label="Altura máxima das ondas"
              value={`${formatDecimal(scenario.meteo_ocean.max_wave_height_m)} m`}
            />
            <InfoItem
              label="Período de pico"
              value={`${formatNumber(scenario.meteo_ocean.wave_peak_period_s)} s`}
            />
          </dl>
        </SectionCard>
      </section>

      <SectionCard title="Interpretação técnica dos dados do campo">
        <p className="text-sm leading-7 text-slate-300">
          {fieldDataInterpretation}
        </p>
      </SectionCard>
    </div>
  );
}
