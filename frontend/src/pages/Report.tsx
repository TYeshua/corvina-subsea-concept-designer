import { useEffect, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import {
  downloadReportPdf,
  downloadReportPdfWithImages,
  getCalculations,
  getDigitalTwin,
  getEquipment,
  getReport,
  type ReportResponse,
} from "../api/client";
import { CopyButton } from "../components/CopyButton";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import type { CalculationResponse } from "../types/calculations";
import type { DigitalTwinData } from "../types/digitalTwin";
import type { EquipmentRecommendation } from "../types/equipment";
import { formatNumber, formatPercent } from "../utils/format";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function captureVisibleArtifacts() {
  const svg = document.querySelector("svg[role='img']");
  const canvas = document.querySelector("canvas");
  let layout2d_image_base64: string | undefined;
  let digital_twin_image_base64: string | undefined;

  if (svg) {
    const serialized = new XMLSerializer().serializeToString(svg);
    layout2d_image_base64 = `data:image/svg+xml;base64,${window.btoa(
      unescape(encodeURIComponent(serialized)),
    )}`;
  }

  if (canvas instanceof HTMLCanvasElement) {
    try {
      digital_twin_image_base64 = canvas.toDataURL("image/png");
    } catch {
      digital_twin_image_base64 = undefined;
    }
  }

  return { layout2d_image_base64, digital_twin_image_base64 };
}

export function Report() {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [calculationResponse, setCalculationResponse] =
    useState<CalculationResponse | null>(null);
  const [equipment, setEquipment] = useState<EquipmentRecommendation[]>([]);
  const [twin, setTwin] = useState<DigitalTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfStatus, setPdfStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        const [reportData, calculationData, twinData, equipmentData] =
          await Promise.all([
            getReport(),
            getCalculations(),
            getDigitalTwin(),
            getEquipment(),
          ]);

        if (active) {
          setReport(reportData);
          setCalculationResponse(calculationData);
          setTwin(twinData);
          setEquipment(equipmentData);
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

  const sections = useMemo(() => report?.sections ?? [], [report]);
  const fullText = report?.full_text ?? "";
  const calculationMemory =
    report?.calculation_memory ??
    calculationResponse?.detailed_steps
      .map(
        (step) =>
          `${step.indicator}\n${step.formula}\n${step.calculation_steps.join("\n")}\n${step.interpretation}`,
      )
      .join("\n\n") ??
    "";
  const inventoryText =
    report?.equipment_inventory_text ??
    equipment
      .map(
        (item) =>
          `${item.name} | Qtd.: ${item.quantity} | Tipo: ${item.type} | Conectado a: ${item.connected_to.join(", ")} | ${item.technical_justification}`,
      )
      .join("\n");

  async function exportPdf() {
    setPdfStatus("Gerando PDF...");

    try {
      const images = captureVisibleArtifacts();
      const hasImages =
        Boolean(images.layout2d_image_base64) ||
        Boolean(images.digital_twin_image_base64);
      const blob = hasImages
        ? await downloadReportPdfWithImages(images)
        : await downloadReportPdf();

      saveBlob(blob, "relatorio-campo-corvina.pdf");
      setPdfStatus("PDF gerado com sucesso.");
    } catch {
      try {
        const fallbackBlob = await downloadReportPdf();
        saveBlob(fallbackBlob, "relatorio-campo-corvina.pdf");
        setPdfStatus("PDF simples gerado com sucesso.");
      } catch (err) {
        setPdfStatus(
          err instanceof Error ? err.message : "Erro ao gerar relatório em PDF.",
        );
      }
    } finally {
      window.setTimeout(() => setPdfStatus(""), 3200);
    }
  }

  function exportSummaryJson() {
    if (!calculationResponse) {
      return;
    }

    const summary = {
      project: "Corvina Subsea Concept Designer",
      field: "Campo Corvina",
      calculations: calculationResponse.summary,
      digital_twin_type: twin?.metadata.digital_twin_type ?? "conceitual/sintético",
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    saveBlob(blob, "corvina-subsea-summary.json");
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error || !report || !calculationResponse) {
    return <ErrorState message={error ?? undefined} />;
  }

  const summary = calculationResponse.summary;

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
            Relatório técnico detalhado em português, com cálculos, inventário,
            gráficos gerados no backend e exportação em PDF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportPdf}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <FileText className="h-4 w-4" />
            Exportar relatório em PDF
          </button>
          <button
            type="button"
            onClick={exportSummaryJson}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400 hover:text-slate-950"
          >
            <Download className="h-4 w-4" />
            Exportar resumo JSON
          </button>
        </div>
      </div>

      {pdfStatus ? <p className="text-sm text-cyan-200">{pdfStatus}</p> : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <CopyButton
          text={fullText}
          label="Copiar relatório completo"
          successLabel="Relatório copiado"
        />
        <CopyButton
          text={calculationMemory}
          label="Copiar memória de cálculo"
          successLabel="Memória copiada"
        />
        <CopyButton
          text={inventoryText}
          label="Copiar inventário de equipamentos"
          successLabel="Inventário copiado"
        />
        <CopyButton
          text={sections.map((section) => section.title).join("\n")}
          label="Copiar sumário"
          successLabel="Sumário copiado"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Óleo total</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatNumber(summary.total_oil_rate_stb_d)}
          </p>
          <p className="text-xs text-slate-400">STB/d</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">BSW ponderado</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatPercent(summary.weighted_bsw_percent)}%
          </p>
          <p className="text-xs text-slate-400">mais representativo que a média simples</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Água / líquidos</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {formatPercent(summary.water_injection_liquid_replacement_ratio_percent)}%
          </p>
          <p className="text-xs text-slate-400">reposição conceitual simplificada</p>
        </article>
        <article className="rounded-lg border border-cyan-500/20 bg-slate-950/60 p-4">
          <p className="text-xs uppercase text-slate-500">Equipamentos</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {equipment.length}
          </p>
          <p className="text-xs text-slate-400">grupos no inventário</p>
        </article>
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
              Seções organizadas para revisão rápida antes da apresentação.
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
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                  {section.text}
                </p>
              </details>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Miniatura do layout 2D">
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-cyan-500/30 bg-slate-950/60 text-center text-sm leading-6 text-slate-400">
            O PDF inclui dados e gráficos do layout. Quando a imagem for
            capturada pela interface, ela será anexada ao relatório.
          </div>
        </SectionCard>
        <SectionCard title="Miniatura do gêmeo digital conceitual">
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-cyan-500/30 bg-slate-950/60 text-center text-sm leading-6 text-slate-400">
            O gêmeo digital conceitual representa superfície, leito marinho,
            reservatório e trajetórias conceituais dos poços.
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
