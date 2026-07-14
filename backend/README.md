# Corvina Subsea Concept Designer - Backend

Backend em Python com FastAPI para apoio ao projeto conceitual do sistema
submarino de produção do Campo Corvina.

## Requisitos

- Python 3.10 ou superior
- FastAPI
- Pydantic
- Uvicorn
- ReportLab
- Matplotlib
- Pandas

## Como Executar

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://127.0.0.1:8000
```

A documentação automática do FastAPI ficará disponível em:

```text
http://127.0.0.1:8000/docs
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

## Módulos

- `main.py`: aplicação FastAPI, CORS e rotas.
- `models.py`: modelos Pydantic do cenário, cálculos, equipamentos, layout e
  gêmeo digital.
- `data.py`: dados fixos do Campo Corvina.
- `calculations.py`: memória de cálculo detalhada, indicadores de produção,
  ocupação, injeção, BSW, margens e interpretação técnica.
- `equipment.py`: inventário conceitual de equipamentos submarinos.
- `layout.py`: dados para o layout 2D em planta.
- `digital_twin.py`: dados para o gêmeo digital 3D, incluindo plano do
  reservatório e trajetórias conceituais de poços.
- `report.py`: relatório técnico textual.
- `pdf_report.py`: geração de PDF com tabelas, gráficos e imagens opcionais.

## Integração com o Frontend

O frontend espera que este backend esteja rodando em:

```text
http://127.0.0.1:8000
```
