import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  getCalculations,
  getDigitalTwin,
  getReport,
  type ReportResponse,
} from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import {
  architectureJustification,
  digitalTwinJustification,
  fallbackReportSections,
  reportConclusion,
} from "../content/technicalTexts";
import type { CalculationResults } from "../types/calculations";
import type { DigitalTwinData } from "../types/digitalTwin";

export function Report() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [calculations, setCalculations] = useState<CalculationResults | null>(
    null,
  );
  const [twin, setTwin] = useState<DigitalTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        const [reportData, calculationData, twinData] = await Promise.all([
          getReport(),
          getCalculations(),
          getDigitalTwin(),
        ]);

        if (active) {
          setReport(reportData);
          setCalculations(calculationData);
          setTwin(twinData);
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

    loadReport();

    return () => {
      active = false;
    };
  }, []);

  const sections = useMemo(() => {
    return report?.sections?.length ? report.sections : fallbackReportSections;
  }, [report]);

  const fullText = useMemo(() => {
    if (report?.full_text) {
      return report.full_text;
    }

    return sections.map((section) => `${section.title}\n${section.text}`).join("\n\n");
  }, [report, sections]);

  const conclusionText =
    sections.find((section) => section.title.includes("Conclusão"))?.text ??
    reportConclusion;

  function exportSummaryJson() {
    if (!calculations) {
      return;
    }

    const summary = {
      project: "Corvina Subsea Concept Designer",
      field: "Campo Corvina",
      oil_total_stb_d: calculations.total_oil_rate_stb_d,
      water_total_stb_d: calculations.total_water_rate_stb_d,
      gas_total_mmscfd: calculations.total_gas_rate_mmscf_d,
      fpso_oil_occupancy_percent: Number(
        calculations.fpso_oil_occupancy_percent.toFixed(2),
      ),
      fpso_gas_occupancy_percent: Number(
        calculations.fpso_gas_occupancy_percent.toFixed(2),
      ),
      gas_available_for_reinjection_mmscfd:
        calculations.gas_available_for_reinjection_mmscf_d,
      recommended_architecture:
        "2 production manifolds, 1 water injection manifold, 1 gas PLET/manifold",
      digital_twin_type: twin?.metadata.digital_twin_type ?? "conceitual/sintético",
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "corvina-subsea-summary.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error || !report || !calculations) {
    return <ErrorState message={error ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-cyan-300">
            Relatório
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Relatório técnico automático
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Texto técnico estruturado para apoiar a redação acadêmica, a
            apresentação oral e a cópia de conclusões e justificativas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={fullText}
            label="Copiar relatório completo"
            successLabel="Relatório copiado"
            className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
          />
          <button
            type="button"
            onClick={exportSummaryJson}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400 hover:text-slate-950"
          >
            <Download className="h-4 w-4" />
            Exportar resumo técnico em JSON
          </button>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <CopyButton
          text={conclusionText}
          label="Copiar conclusões"
          successLabel="Conclusões copiadas"
        />
        <CopyButton
          text={architectureJustification}
          label="Copiar justificativa da arquitetura"
          successLabel="Justificativa copiada"
        />
        <CopyButton
          text={digitalTwinJustification}
          label="Copiar justificativa do gêmeo digital"
          successLabel="Justificativa copiada"
        />
        <CopyButton
          text={sections.map((section) => section.title).join("\n")}
          label="Copiar sumário"
          successLabel="Sumário copiado"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <SectionCard title="Sumário automático">
          <nav className="space-y-2 text-sm">
            {sections.map((section) => (
              <a
                key={section.title}
                href={`#${section.title.toLowerCase().replace(/\W+/g, "-")}`}
                className="block rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-slate-300 transition hover:border-cyan-500/35 hover:text-cyan-100"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </SectionCard>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{report.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Seções colapsáveis para revisão rápida e uso em apresentação.
            </p>
          </div>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <details
                key={section.title}
                id={section.title.toLowerCase().replace(/\W+/g, "-")}
                className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
                open={index < 2}
              >
                <summary className="cursor-pointer text-base font-semibold text-cyan-100">
                  {section.title}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {section.text}
                </p>
              </details>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
