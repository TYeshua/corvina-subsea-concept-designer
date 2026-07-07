# Corvina Subsea Concept Designer - Backend

Backend em Python com FastAPI para apoio ao projeto conceitual do sistema submarino de produção do Campo Corvina.

## Requisitos

- Python 3.10 ou superior
- FastAPI
- Pydantic
- Uvicorn
- NumPy

## Como executar

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://localhost:8000
```

A documentação automática do FastAPI ficará disponível em:

```text
http://localhost:8000/docs
```

## Endpoints

```text
GET /
GET /api/scenario/corvina
GET /api/calculate
GET /api/equipment
GET /api/layout
GET /api/digital-twin
GET /api/report
```

## Módulos

- `main.py`: aplicação FastAPI, CORS e rotas.
- `models.py`: modelos Pydantic do cenário, cálculos, equipamentos, layout e gêmeo digital.
- `data.py`: dados fixos do Campo Corvina.
- `calculations.py`: indicadores de produção, ocupação, injeção e margens.
- `equipment.py`: recomendações conceituais de equipamentos.
- `layout.py`: dados para o layout 2D em planta.
- `digital_twin.py`: dados para o gêmeo digital 3D.
- `report.py`: relatório técnico automático.

## Integração com o frontend

O frontend espera que este backend esteja rodando em:

```text
http://localhost:8000
```
