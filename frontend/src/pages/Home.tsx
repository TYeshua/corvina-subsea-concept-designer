import {
  ArrowRight,
  BarChart3,
  Boxes,
  FileText,
  Map,
  Network,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";
import { prototypeLimitation } from "../content/technicalTexts";

interface ModuleCard {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

const modules: ModuleCard[] = [
  {
    title: "Dashboard executivo",
    description:
      "Indicadores de produção, ocupação da FPSO, reinjeção de gás e margens operacionais.",
    path: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Arquitetura submarina",
    description:
      "Recomendações conceituais de árvores, manifolds, flowlines, risers, umbilicais e controle.",
    path: "/architecture",
    icon: Network,
  },
  {
    title: "Layout 2D",
    description:
      "Visualização em planta com ativos, conexões, Norte, escala, corrente e exportação SVG.",
    path: "/layout-2d",
    icon: Map,
  },
  {
    title: "Gêmeo digital 3D",
    description:
      "Cena interativa para inspecionar FPSO, poços, manifolds, linhas, risers, umbilicais e SDUs.",
    path: "/digital-twin-3d",
    icon: Boxes,
  },
  {
    title: "Relatório técnico",
    description:
      "Texto estruturado, copiável e pronto para apoiar a apresentação acadêmica.",
    path: "/report",
    icon: FileText,
  },
];

const deliverables = [
  "Integra dados do Campo Corvina em uma interface única.",
  "Automatiza cálculos de produção, ocupação e margens da FPSO.",
  "Organiza recomendações de arquitetura submarina por grupos técnicos.",
  "Apresenta layout 2D em planta com ativos e conexões exportáveis.",
  "Demonstra um gêmeo digital conceitual 3D navegável.",
  "Gera relatório técnico copiável para uso acadêmico.",
];

export function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-6 shadow-panel md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-cyan-300">
              Corvina Subsea Concept Designer
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white xl:text-5xl">
              Ferramenta acadêmica para projeto conceitual de sistemas
              submarinos de produção
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300">
              O Corvina Subsea Concept Designer foi desenvolvido como uma
              ferramenta acadêmica de apoio ao projeto conceitual de sistemas
              submarinos de produção. A aplicação integra dados do campo,
              cálculos de engenharia, seleção de equipamentos, layout em planta
              e gêmeo digital conceitual 3D em uma única interface web.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Acessar Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex min-h-11 items-center rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/10"
              >
                Ver roteiro de demonstração
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm font-medium text-cyan-300">Campo Corvina</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <dt className="text-xs uppercase text-slate-500">Bacia</dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  Foz do Amazonas
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">
                  Lâmina d'água
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">2.300 m</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">Poços</dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  5 produtores · 3 injetores
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">
                  Área conceitual
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">90 km²</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.title}
              to={module.path}
              className="rounded-lg border border-cyan-500/20 bg-slate-900/80 p-5 shadow-panel transition hover:border-cyan-400/35 hover:bg-slate-900"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold text-white">{module.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {module.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Por que esta ferramenta foi criada?">
          <p className="text-sm leading-7 text-slate-300">
            Projetos submarinos conceituais combinam muitas informações
            dispersas: premissas do campo, capacidade da unidade, vazões dos
            poços, decisões de arquitetura, arranjo físico, justificativas e
            limitações. A ferramenta foi criada para transformar esse conjunto
            de dados em um fluxo navegável, visual e apresentável.
          </p>
        </SectionCard>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            O que o protótipo entrega?
          </h2>
          <ul className="grid gap-3 text-sm leading-6 text-slate-300">
            {deliverables.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </section>

      <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-none" />
          <p>{prototypeLimitation}</p>
        </div>
      </div>
    </div>
  );
}
