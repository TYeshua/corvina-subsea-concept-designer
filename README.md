# Corvina Subsea Concept Designer

Ferramenta web acadêmica para apoio ao projeto conceitual do sistema submarino
de produção do Campo Corvina, integrando cálculos de engenharia, seleção de
equipamentos, layout 2D em planta, gêmeo digital conceitual 3D e relatório
técnico exportável em PDF.

## Objetivo

O projeto reúne, em uma aplicação demonstrável, as principais informações
técnicas de um estudo conceitual submarino: dados do campo, indicadores de
produção, ocupação da FPSO, inventário de equipamentos, arquitetura submarina,
layout em planta, visualização 3D e relatório técnico automático.

A aplicação foi preparada para apresentação acadêmica e execução local por
backend FastAPI e frontend React.

## Stack

- Backend: Python, FastAPI, Pydantic, Uvicorn
- Relatório PDF: ReportLab, Matplotlib, Pandas
- Frontend: React, Vite, TypeScript, TailwindCSS
- Visualização: Recharts, SVG interativo, Three.js, React Three Fiber, Drei
- Ícones: Lucide React

## Módulos

- Início: visão geral do projeto e limitações conceituais.
- Dashboard: resumo executivo com cards e gráficos.
- Dados do Campo: premissas do Campo Corvina, FPSO, poços, fluidos e ambiente.
- Cálculos: memória de cálculo com fórmula, substituição de valores, resultado,
  unidade e interpretação para cada indicador.
- Arquitetura Submarina: inventário detalhado de equipamentos com quantidade,
  função, instalação, conexões e justificativa técnica.
- Layout 2D: SVG interativo com camadas, modos de visualização, tela cheia,
  estimativas de distância e exportação SVG melhorada.
- Gêmeo Digital 3D: cena interativa com FPSO, poços, manifolds, SDUs, linhas,
  risers, umbilicais, plano do reservatório, trajetórias de poços, modos de
  câmera, tela cheia e captura de imagem.
- Relatório: texto técnico estruturado, memória de cálculo, inventário e
  exportação em PDF.
- Demonstração: roteiro sugerido para apresentação oral.

## Premissas Técnicas Principais

- Lâmina d'água: 2.300 m.
- Profundidade aproximada do reservatório: 5.600 m.
- Equipamentos submarinos no leito marinho: aproximadamente 2.300 m.
- Sistema de poços: 5 produtores, 2 injetores de água e 1 injetor de gás.
- FPSO: 180.000 STB/d de óleo, 300 MMSCF/d de gás e 200.000 BWPD de água.

## Estrutura

```text
corvina-subsea-concept-designer/
  backend/
    app/
      main.py
      models.py
      data.py
      calculations.py
      equipment.py
      layout.py
      digital_twin.py
      report.py
      pdf_report.py
    requirements.txt
    README.md

  frontend/
    src/
      api/
      components/
      content/
      pages/
      types/
      utils/
      App.tsx
      main.tsx
      index.css
    package.json
    vite.config.ts
    README.md

  README.md
  .gitignore
```

## Como Rodar o Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Documentação:

```text
http://127.0.0.1:8000/docs
```

## Como Rodar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Aplicação:

```text
http://localhost:5173
```

## Endpoints

```text
GET  /
GET  /api/scenario/corvina
GET  /api/calculate
GET  /api/equipment
GET  /api/layout
GET  /api/digital-twin
GET  /api/report
GET  /api/report/pdf
POST /api/report/pdf-with-images
```

## Rotas da Aplicação

```text
/
/dashboard
/field-data
/calculations
/architecture
/layout-2d
/digital-twin-3d
/report
/demo
```

## Checklist de Validação

```text
[ ] Backend executa sem erro
[ ] Frontend compila sem erro
[ ] Dashboard carrega os dados da API
[ ] Cálculos exibem equações e memória de cálculo
[ ] Inventário de equipamentos aparece na Arquitetura Submarina
[ ] Layout 2D renderiza corretamente em tela cheia
[ ] Exportação SVG do layout gera arquivo legível
[ ] Gêmeo Digital 3D renderiza reservatório e trajetórias de poços
[ ] Relatório PDF é gerado pelo backend
[ ] Projeto pronto para apresentação
```

## Limitações do Protótipo

Este protótipo é acadêmico e conceitual. Ele não substitui softwares industriais
de engenharia submarina e não realiza simulação hidráulica multifásica, cálculo
estrutural de risers, análise de fadiga, deposição de parafina, formação de
hidratos, análise econômica completa, autenticação, banco de dados, integração
com sensores reais ou validação normativa final.

Os dados do Campo Corvina são fixos no backend e servem para demonstração
técnica do fluxo de projeto conceitual.

## Fluxo Sugerido de Apresentação

```text
Campo Corvina -> Cálculos -> Arquitetura Submarina -> Layout 2D -> Gêmeo Digital 3D -> Relatório Técnico
```
