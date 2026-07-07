import {
  ArrowRight,
  BarChart3,
  Boxes,
  Calculator,
  Database,
  FileText,
  Lightbulb,
  Map,
  Network,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";

interface DemoStep {
  title: string;
  summary: string;
  path: string;
  buttonLabel: string;
  icon: LucideIcon;
}

const demoSteps: DemoStep[] = [
  {
    title: "1. Problema",
    summary:
      "Projetos conceituais submarinos exigem integração de dados, cálculos, escolhas de equipamentos e justificativas técnicas em um fluxo claro.",
    path: "/",
    buttonLabel: "Abrir início",
    icon: Lightbulb,
  },
  {
    title: "2. Solução proposta",
    summary:
      "O Corvina Subsea Concept Designer centraliza dados, indicadores, arquitetura, layout, gêmeo digital e relatório técnico em uma interface web.",
    path: "/dashboard",
    buttonLabel: "Ver visão geral",
    icon: BarChart3,
  },
  {
    title: "3. Dados de entrada",
    summary:
      "O cenário do Campo Corvina estrutura dados do campo, FPSO, poços produtores, poços injetores, fluidos e meteo-oceanografia.",
    path: "/field-data",
    buttonLabel: "Abrir dados",
    icon: Database,
  },
  {
    title: "4. Cálculos automáticos",
    summary:
      "A ferramenta calcula produção total, médias por poço, ocupação da FPSO, injeção e margens operacionais.",
    path: "/calculations",
    buttonLabel: "Abrir cálculos",
    icon: Calculator,
  },
  {
    title: "5. Arquitetura recomendada",
    summary:
      "A arquitetura por clusters organiza produtores, injetores, manifolds, PLET, risers, umbilicais e garantia de escoamento.",
    path: "/architecture",
    buttonLabel: "Ver arquitetura",
    icon: Network,
  },
  {
    title: "6. Layout 2D",
    summary:
      "O mapa em planta apresenta ativos, conexões, fluxo, Norte, escala, corrente de projeto e exportação SVG.",
    path: "/layout-2d",
    buttonLabel: "Abrir layout",
    icon: Map,
  },
  {
    title: "7. Gêmeo digital 3D",
    summary:
      "A cena 3D permite demonstrar FPSO, leito marinho, poços, manifolds, linhas, risers, umbilicais, SDUs e camadas visuais.",
    path: "/digital-twin-3d",
    buttonLabel: "Abrir 3D",
    icon: Boxes,
  },
  {
    title: "8. Limitações",
    summary:
      "O MVP é acadêmico e conceitual: não substitui softwares industriais nem executa simulação hidráulica, estrutural ou operacional real.",
    path: "/report",
    buttonLabel: "Ver relatório",
    icon: ShieldAlert,
  },
  {
    title: "9. Valor agregado",
    summary:
      "O principal valor agregado da ferramenta está na integração entre Engenharia de Petróleo e Engenharia de Software. O sistema transforma dados de produção e critérios de engenharia em uma interface visual, interativa e organizada, permitindo comunicar o projeto conceitual de forma mais clara e inovadora.",
    path: "/report",
    buttonLabel: "Abrir relatório",
    icon: FileText,
  },
];

const presentationScript = [
  "Apresentar o problema: projeto conceitual submarino exige integração de dados, cálculos e justificativas.",
  "Mostrar a solução: ferramenta web Corvina Subsea Concept Designer.",
  "Abrir o Dashboard e destacar produção total, ocupação da FPSO e reinjeção de gás.",
  "Abrir Dados do Campo e mostrar que o cenário do Campo Corvina está estruturado.",
  "Abrir Arquitetura Submarina e explicar as escolhas de equipamentos.",
  "Abrir Layout 2D e explicar a configuração por clusters.",
  "Abrir Gêmeo Digital 3D e demonstrar a visualização interativa.",
  "Abrir Relatório e mostrar que a ferramenta gera texto técnico copiável.",
  "Fechar destacando que o sistema é conceitual, mas integra Engenharia de Petróleo e Engenharia de Software.",
];

export function Demo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-300">
          Demonstração
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Roteiro rápido para apresentação do MVP
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
          Use esta página como trilha de navegação durante a apresentação oral:
          ela conecta problema, dados, cálculos, arquitetura, visualizações e
          relatório em uma sequência curta.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demoSteps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="flex min-h-64 flex-col rounded-lg border border-cyan-500/20 bg-slate-900/80 p-5 shadow-panel transition hover:border-cyan-400/35 hover:bg-slate-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                {step.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                {step.summary}
              </p>
              <Link
                to={step.path}
                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-cyan-500/30 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400 hover:text-slate-950"
              >
                {step.buttonLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </section>

      <SectionCard title="Roteiro sugerido de apresentação do software">
        <ol className="space-y-3 text-sm leading-6 text-slate-300">
          {presentationScript.map((item, index) => (
            <li
              key={item}
              className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3"
            >
              <span className="mr-2 font-semibold text-cyan-200">
                {index + 1}.
              </span>
              {item}
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}
