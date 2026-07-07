import { useEffect, useState } from "react";
import { Boxes, Layers, Network, Ruler, Waves } from "lucide-react";
import { getDigitalTwin } from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { MetricCard } from "../components/MetricCard";
import { SectionCard } from "../components/SectionCard";
import { DigitalTwinScene } from "../components/digitalTwin/DigitalTwinScene";
import { digitalTwinJustification } from "../content/technicalTexts";
import type { DigitalTwinData } from "../types/digitalTwin";
import { formatNumber } from "../utils/format";

export function DigitalTwin3D() {
  const [twin, setTwin] = useState<DigitalTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDigitalTwin() {
      try {
        const data = await getDigitalTwin();

        if (active) {
          setTwin(data);
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

    loadDigitalTwin();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !twin) {
    return <ErrorState message={error ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">
          Gêmeo Digital Conceitual 3D
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Sistema submarino do Campo Corvina em 3D
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
          O gêmeo digital conceitual representa a arquitetura submarina do Campo
          Corvina em ambiente 3D interativo. A cena integra FPSO, poços,
          manifolds, flowlines, risers, umbilicais e SDUs, permitindo inspecionar
          os componentes e compreender a organização espacial do sistema
          submarino.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Tipo"
          value={twin.metadata.digital_twin_type}
          description="Modelo visual e informacional, sem sensores reais."
          icon={<Boxes className="h-5 w-5" />}
          accent="cyan"
        />
        <MetricCard
          title="Lâmina d'água"
          value={formatNumber(twin.metadata.water_depth_m)}
          unit="m"
          description="Profundidade real representada em escala comprimida."
          icon={<Waves className="h-5 w-5" />}
          accent="blue"
        />
        <MetricCard
          title="Ativos"
          value={twin.assets.length}
          description="FPSO, poços, manifolds, PLET e SDUs."
          icon={<Network className="h-5 w-5" />}
          accent="emerald"
        />
        <MetricCard
          title="Conexões"
          value={twin.connections.length}
          description="Flowlines, jumpers, risers e umbilicais."
          icon={<Layers className="h-5 w-5" />}
          accent="amber"
        />
        <MetricCard
          title="Escala"
          value="Vertical comprimida"
          description="Visualização conceitual, não proporcional."
          icon={<Ruler className="h-5 w-5" />}
          accent="cyan"
        />
      </section>

      <DigitalTwinScene twin={twin} />

      <SectionCard title="Justificativa técnica do gêmeo digital conceitual">
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>{digitalTwinJustification}</p>
          <p className="text-amber-100/90">
            A escala vertical foi comprimida para permitir visualização adequada
            da lâmina d'água de 2.300 m. Portanto, o modelo é conceitual e não
            representa proporções físicas reais.
          </p>
          <CopyButton
            text={digitalTwinJustification}
            label="Copiar justificativa do gêmeo digital"
            successLabel="Justificativa copiada"
          />
        </div>
      </SectionCard>
    </div>
  );
}
