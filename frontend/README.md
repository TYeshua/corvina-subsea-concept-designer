# Corvina Subsea Concept Designer - Frontend

Frontend em React, Vite, TypeScript e TailwindCSS para o Corvina Subsea Concept Designer.

## Requisitos

- Node.js
- npm
- Backend FastAPI rodando em `http://localhost:8000`

## Como executar

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

O backend precisa estar rodando em:

```text
http://localhost:8000
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Rotas disponíveis

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

## Recursos implementados

- Dashboard com cards, gráficos e leitura executiva.
- Dados do Campo com premissas técnicas.
- Cálculos com indicadores, status e equações demonstradas.
- Arquitetura submarina com recomendações por grupo técnico.
- Layout 2D em SVG interativo, com seleção, camadas, tela cheia e exportação SVG.
- Gêmeo Digital 3D com React Three Fiber, camadas, painel de detalhes, tela cheia e captura de imagem.
- Relatório técnico com cópia de textos e exportação de resumo.
- Roteiro de demonstração para apresentação.

## API consumida

O arquivo `src/api/client.ts` aponta para:

```text
http://localhost:8000
```
