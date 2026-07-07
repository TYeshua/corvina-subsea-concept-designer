# Corvina Subsea Concept Designer

Ferramenta web acadêmica para apoio ao projeto conceitual do sistema submarino de produção do Campo Corvina, integrando cálculos de engenharia, seleção de equipamentos, layout 2D em planta e gêmeo digital conceitual 3D.

## Objetivo

O objetivo do projeto é reunir, em uma aplicação demonstrável, as principais informações técnicas de um estudo conceitual submarino: dados do campo, indicadores de produção, ocupação da FPSO, recomendações de equipamentos, arquitetura submarina, layout em planta, visualização 3D e relatório técnico automático.

A aplicação foi preparada para apresentação acadêmica e para execução local por backend FastAPI e frontend React.

## Stack Utilizada

- Backend: Python, FastAPI, Pydantic, Uvicorn
- Frontend: React, Vite, TypeScript, TailwindCSS
- Visualização: Recharts, SVG interativo, Three.js, React Three Fiber, Drei
- Ícones: Lucide React

## Módulos Implementados

- Início: visão geral do projeto e limitações conceituais.
- Dashboard: resumo executivo com cards e gráficos.
- Dados do Campo: premissas do Campo Corvina, FPSO, poços, fluidos e ambiente.
- Cálculos: indicadores de produção, médias, ocupação, injeção, margens e equações demonstradas.
- Arquitetura Submarina: recomendações de equipamentos e justificativas técnicas.
- Layout 2D: SVG interativo com ativos, conexões, legenda, escala, Norte, corrente, tela cheia e exportação SVG.
- Gêmeo Digital 3D: cena interativa com FPSO, poços, manifolds, SDUs, linhas, risers, umbilicais, camadas, tela cheia e captura de imagem.
- Relatório: texto técnico estruturado, seções copiáveis e exportação de resumo JSON.
- Demonstração: roteiro sugerido para apresentação oral do software.

## Estrutura de Pastas

```text
corvina-subsea-concept-designer/
  backend/
    app/
      __init__.py
      main.py
      models.py
      data.py
      calculations.py
      equipment.py
      layout.py
      digital_twin.py
      report.py
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
    tailwind.config.js
    postcss.config.js
    tsconfig.json
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
http://localhost:8000
```

Documentação:

```text
http://localhost:8000/docs
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

O frontend consome a API em:

```text
http://localhost:8000
```

## Endpoints da API

```text
GET /
GET /api/scenario/corvina
GET /api/calculate
GET /api/equipment
GET /api/layout
GET /api/digital-twin
GET /api/report
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

## Preparação para GitHub

Caso o projeto ainda não esteja versionado, inicialize o Git na pasta raiz:

```bash
git init
git add .
git commit -m "Initial version of Corvina Subsea Concept Designer"
```

Para conectar a um repositório remoto:

```bash
git remote add origin URL_DO_REPOSITORIO
git branch -M main
git push -u origin main
```

Após subir para o GitHub, o projeto pode ser baixado em:

```text
Code -> Download ZIP
```

## Checklist Final

```text
[ ] Backend executa sem erro
[ ] Frontend executa sem erro
[ ] Dashboard carrega dados da API
[ ] Layout 2D renderiza corretamente
[ ] Gêmeo Digital 3D renderiza corretamente
[ ] Relatório automático funciona
[ ] Projeto pronto para apresentação
```

## Limitações do Protótipo

Este protótipo é acadêmico e conceitual. Ele não substitui softwares industriais de engenharia submarina e não realiza simulação hidráulica multifásica, cálculo estrutural de risers, análise de fadiga, análise econômica completa, autenticação, banco de dados, integração com sensores reais ou validação normativa final.

Os dados do Campo Corvina são fixos no backend e servem para demonstração técnica do fluxo de projeto conceitual.

## Observação de Uso Acadêmico

O Corvina Subsea Concept Designer foi preparado para apoiar uma apresentação acadêmica, demonstrando a integração entre Engenharia de Petróleo, Engenharia Submarina e Engenharia de Software.

Fluxo sugerido de apresentação:

```text
Campo Corvina -> Cálculos -> Arquitetura Submarina -> Layout 2D -> Gêmeo Digital 3D -> Relatório Técnico
```
