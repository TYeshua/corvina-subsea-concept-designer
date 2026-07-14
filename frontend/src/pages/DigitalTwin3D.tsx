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
          Gêmeo digital conceitual 3D
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Sistema submarino do Campo Corvina em 3D
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
          A cena representa FPSO, árvores de natal molhadas, manifolds,
          flowlines, risers, umbilicais, SDUs, plano do reservatório e trajetórias
          conceituais dos poços. Use os modos de câmera para alternar entre visão
          geral, injeção, produção, seção vertical e inspeção do reservatório.
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
          description="Profundidade do mar até o leito e os equipamentos submarinos."
          icon={<Waves className="h-5 w-5" />}
          accent="blue"
        />
        <MetricCard
          title="Reservatório"
          value={formatNumber(twin.metadata.reservoir_depth_m)}
          unit="m"
          description="Profundidade aproximada do intervalo turbidítico produtor."
          icon={<Ruler className="h-5 w-5" />}
          accent="amber"
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
          accent="cyan"
        />
      </section>

      <DigitalTwinScene twin={twin} />

      <SectionCard title="Justificativa técnica do gêmeo digital conceitual">
        <div className="space-y-4 text-sm leading-7 text-slate-300">
          <p>{digitalTwinJustification}</p>
          <p className="text-amber-100/90">
            A lâmina d'água de 2.300 m indica a profundidade do leito marinho e
            dos equipamentos submarinos. O reservatório está representado como
            camada conceitual a aproximadamente 5.600 m; por isso a escala
            vertical foi comprimida e não é proporcional.
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
