from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .calculations import calculate_field_indicators
from .data import SCENARIO
from .digital_twin import get_digital_twin_data
from .equipment import get_equipment_recommendations
from .layout import get_layout_data
from .models import CalculationResults, EquipmentRecommendation, Scenario
from .report import generate_report_text


app = FastAPI(
    title="Corvina Subsea Concept Designer API",
    description=(
        "API para apoio ao projeto conceitual do sistema submarino de produção "
        "do Campo Corvina, incluindo dados do cenário, cálculos, recomendações "
        "de equipamentos, layout conceitual e dados para gêmeo digital 3D."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {
        "message": "API do Corvina Subsea Concept Designer está ativa.",
    }


@app.get("/api/scenario/corvina", response_model=Scenario)
def read_corvina_scenario() -> Scenario:
    return SCENARIO


@app.get("/api/calculate", response_model=CalculationResults)
def read_calculations() -> CalculationResults:
    return calculate_field_indicators()


@app.get("/api/equipment", response_model=list[EquipmentRecommendation])
def read_equipment_recommendations() -> list[EquipmentRecommendation]:
    return get_equipment_recommendations()


@app.get("/api/layout")
def read_layout() -> dict[str, Any]:
    return get_layout_data()


@app.get("/api/digital-twin")
def read_digital_twin() -> dict[str, Any]:
    return get_digital_twin_data()


@app.get("/api/report")
def read_report() -> dict[str, object]:
    try:
        return generate_report_text()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Erro ao gerar texto-base para relatório.",
        ) from exc

