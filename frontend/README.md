# Corvina Subsea Concept Designer - Frontend

Frontend em React, Vite, TypeScript e TailwindCSS para o Corvina Subsea Concept
Designer.

## Requisitos

- Node.js
- npm
- Backend FastAPI rodando em `http://127.0.0.1:8000`

## Como Executar

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Rotas

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

## Recursos Implementados

- Dashboard com cards, gráficos e leitura executiva.
- Dados do Campo com premissas técnicas.
- Cálculos com fórmula, substituição de valores, resultado e interpretação para
  cada indicador.
- Arquitetura submarina com inventário detalhado de equipamentos.
- Layout 2D em SVG interativo, com seleção, camadas, modos de visualização,
  estimativas de distância, tela cheia e exportação SVG.
- Gêmeo Digital 3D com React Three Fiber, camadas, plano do reservatório,
  trajetórias de poços, modos de câmera, painel de profundidades, tela cheia e
  captura de imagem.
- Relatório técnico com cópia de textos, resumo JSON e exportação PDF pelo
  backend.
- Roteiro de demonstração para apresentação.

## API Consumida

O arquivo `src/api/client.ts` aponta para:

```text
http://127.0.0.1:8000
```
