import { useEffect, useState } from "react";
import { Activity, Gauge, Map, Network, Waves } from "lucide-react";
import { getLayout } from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { MetricCard } from "../components/MetricCard";
import { SectionCard } from "../components/SectionCard";
import { SubseaLayoutMap } from "../components/layout2d/SubseaLayoutMap";
import { layoutJustification } from "../content/technicalTexts";
import type { LayoutData } from "../types/layout";
import { formatDecimal, formatNumber } from "../utils/format";

export function Layout2D() {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLayout() {
      try {
        const data = await getLayout();

        if (active) {
          setLayout(data);
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

    loadLayout();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !layout) {
    return <ErrorState message={error ?? undefined} />;
  }

  const areaKm2 =
    layout.metadata.field_width_km * layout.metadata.field_height_km;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">
          Layout 2D em planta
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Arranjo submarino conceitual do Campo Corvina
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
          O layout em planta organiza os cinco poços produtores em dois clusters
          de produção, conecta os dois injetores de água a um manifold dedicado
          e direciona o gás excedente para reinjeção por meio de um PLET ou
          manifold dedicado. A FPSO é posicionada ao norte do campo, permitindo
          um corredor organizado de risers e umbilicais.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Área do campo"
          value={formatNumber(areaKm2)}
          unit="km²"
          description="Área conceitual de referência para o layout."
          icon={<Map className="h-5 w-5" />}
          accent="cyan"
        />
        <MetricCard
          title="Ativos submarinos"
          value={layout.assets.length}
          description="FPSO, poços, manifolds, PLET e SDUs."
          icon={<Network className="h-5 w-5" />}
          accent="blue"
        />
        <MetricCard
          title="Conexões"
          value={layout.connections.length}
          description="Flowlines, jumpers, risers, umbilicais e links."
          icon={<Activity className="h-5 w-5" />}
          accent="emerald"
        />
        <MetricCard
          title="Índice de adequação"
          value={`${layout.metadata.layout_score}/100`}
          description="Pontuação conceitual de organização do layout."
          icon={<Gauge className="h-5 w-5" />}
          accent="amber"
        />
        <MetricCard
          title="Corrente de projeto"
          value={formatDecimal(layout.metadata.current_design_velocity_m_s)}
          unit="m/s"
          description={`Direção predominante: ${layout.metadata.current_direction}.`}
          icon={<Waves className="h-5 w-5" />}
          accent="cyan"
        />
      </section>

      <SubseaLayoutMap layout={layout} />

      <SectionCard title="Justificativa técnica do layout">
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-300">
            {layoutJustification}
          </p>
          <CopyButton
            text={layoutJustification}
            label="Copiar justificativa do layout"
            successLabel="Justificativa copiada"
          />
        </div>
      </SectionCard>
    </div>
  );
}
