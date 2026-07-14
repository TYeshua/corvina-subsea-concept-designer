from __future__ import annotations

from .calculations import calculate_field_indicators
from .data import SCENARIO
from .equipment import get_equipment_recommendations


def generate_report_text() -> dict[str, object]:
    """Generate a structured Portuguese technical base text for the report."""
    calculation_response = calculate_field_indicators()
    calculations = calculation_response.summary
    detailed_steps = calculation_response.detailed_steps
    equipment = get_equipment_recommendations()

    calculation_text = "\n".join(
        (
            f"{index}. {step.indicator}\n"
            f"Formula: {step.formula}\n"
            f"Valores de entrada: {step.input_values}\n"
            f"Memoria: {' | '.join(step.calculation_steps)}\n"
            f"Resultado: {step.result} {step.unit}\n"
            f"Interpretacao: {step.interpretation}"
        )
        for index, step in enumerate(detailed_steps, start=1)
    )

    equipment_text = "\n".join(
        (
            f"- {item.name}: quantidade {item.quantity}; tipo {item.type}; "
            f"local: {item.installation_location}; conexoes: {', '.join(item.connected_to)}; "
            f"justificativa: {item.technical_justification}"
        )
        for item in equipment
    )

    sections = [
        {
            "title": "1. Introducao",
            "text": (
                "O presente relatorio consolida o desenvolvimento conceitual do sistema submarino "
                f"de producao do Campo {SCENARIO.field.name}, no Bloco {SCENARIO.field.block}, "
                f"Bacia da {SCENARIO.field.basin}. A ferramenta Corvina Subsea Concept Designer "
                "organiza dados do campo, calculos de engenharia, inventario de equipamentos, "
                "layout 2D, gemeo digital conceitual 3D e relatorio tecnico automatico."
            ),
        },
        {
            "title": "2. Fundamentacao teorica",
            "text": (
                "Sistemas submarinos de producao em aguas profundas integram arvores submarinas, "
                "jumpers, manifolds, PLETs, flowlines, risers, umbilicais, SDUs, sensores e "
                "sistemas de controle. A concepcao deve considerar garantia de escoamento, "
                "integridade, instalacao, manutencao, correntes, profundidade, estrategia de "
                "injecao e capacidade da unidade de producao."
            ),
        },
        {
            "title": "3. Caracterizacao do Campo Corvina",
            "text": (
                f"O Campo {SCENARIO.field.name} possui lamina d'agua de aproximadamente "
                f"{SCENARIO.field.water_depth_m:.0f} m e reservatorio a cerca de "
                f"{SCENARIO.field.reservoir_depth_m:.0f} m de profundidade. A lamina d'agua "
                "corresponde a distancia entre a superficie do mar e o leito marinho, onde "
                "ficam instalados os equipamentos submarinos. O reservatorio e representado "
                "como camada inferior no gemeo digital conceitual."
            ),
        },
        {
            "title": "4. Dados de entrada",
            "text": (
                f"O cenario considera {SCENARIO.field.producer_wells} produtores, "
                f"{SCENARIO.field.injector_wells} injetores, FPSO com capacidade de "
                f"{SCENARIO.fpso.max_oil_processing_stb_d:.0f} STB/d de oleo, "
                f"{SCENARIO.fpso.max_gas_processing_mmscf_d:.0f} MMSCF/d de gas e "
                f"{SCENARIO.fpso.max_water_treatment_injection_stb_d:.0f} STB/d de "
                "tratamento/injecao de agua. O oleo e parafinico, com risco conceitual "
                "de deposicao de parafina em baixa temperatura."
            ),
        },
        {
            "title": "5. Desenvolvimento detalhado dos calculos",
            "text": calculation_text,
        },
        {
            "title": "6. Resultados calculados",
            "text": (
                f"A producao total de oleo e {calculations.total_oil_rate_stb_d:.0f} STB/d, "
                f"a producao de agua e {calculations.total_water_rate_stb_d:.0f} STB/d, "
                f"a producao de gas e {calculations.total_gas_rate_mmscf_d:.0f} MMSCF/d "
                f"e a producao total de liquidos e {calculations.total_liquid_rate_stb_d:.0f} STB/d. "
                f"O BSW ponderado do campo e {calculations.weighted_bsw_percent:.2f}%, enquanto "
                f"o BSW medio simples e {calculations.simple_average_bsw_percent:.1f}%. "
                f"A injecao de agua representa {calculations.water_injection_liquid_replacement_ratio_percent:.2f}% "
                "da producao total de liquidos, portanto nao deve ser interpretada como reposicao "
                "integral isolada."
            ),
        },
        {
            "title": "7. Inventario de equipamentos submarinos",
            "text": equipment_text,
        },
        {
            "title": "8. Projeto conceitual do sistema submarino",
            "text": (
                "A arquitetura proposta utiliza dois manifolds de producao para organizar os "
                "produtores em clusters, um manifold de injecao de agua para I-01 e I-03, um "
                "PLET/manifold de gas para I-02, tres SDUs, flowlines rigidas, jumpers, risers "
                "adequados a aguas ultraprofundas e umbilicais eletro-hidraulicos multiplexados."
            ),
        },
        {
            "title": "9. Layout em planta",
            "text": (
                "O layout 2D apresenta a distribuicao conceitual dos ativos no campo, com modos "
                "de visualizacao para producao, injecao de agua, injecao de gas, controle, risers, "
                "correntes, expansao futura e estimativas conceituais de comprimentos."
            ),
        },
        {
            "title": "10. Gemeo digital conceitual",
            "text": (
                "O gemeo digital conceitual representa a FPSO na superficie, o leito marinho em "
                "2.300 m, a camada de reservatorio em 5.600 m, equipamentos submarinos, linhas, "
                "risers, umbilicais e trajetorias conceituais dos pocos. A escala vertical foi "
                "comprimida para visualizacao e nao representa proporcoes fisicas reais."
            ),
        },
        {
            "title": "11. Discussao tecnica",
            "text": (
                "Os principais riscos conceituais sao oleo parafinico, lamina d'agua elevada, "
                "correntes intensas, ausencia de exportacao de gas e alta ocupacao da FPSO em oleo. "
                "A combinacao de injecao de agua e reinjecao de gas e coerente para manutencao "
                "de pressao em nivel conceitual, embora a avaliacao final exija estudo de reservatorio."
            ),
        },
        {
            "title": "12. Limitacoes",
            "text": (
                "O prototipo possui finalidade academica. Ele nao realiza simulacao hidraulica "
                "multifasica, analise estrutural de risers, fadiga, garantia de escoamento detalhada, "
                "analise economica, sensores reais ou operacao em tempo real."
            ),
        },
        {
            "title": "13. Conclusao",
            "text": (
                "O Corvina Subsea Concept Designer melhora a comunicacao do projeto conceitual ao "
                "integrar dados, calculos, equipamentos, visualizacoes e relatorio tecnico em uma "
                "interface unica, mantendo coerencia com as premissas de aguas profundas do Campo Corvina."
            ),
        },
        {
            "title": "14. Referencias sugeridas",
            "text": (
                "Sugere-se consultar literatura de engenharia submarina, normas e praticas de projeto "
                "para arvores submarinas, manifolds, risers, flowlines, garantia de escoamento, "
                "sistemas de controle submarino e desenvolvimento de campos offshore em aguas profundas."
            ),
        },
    ]

    full_text = "\n\n".join(
        f"{section['title']}\n{section['text']}" for section in sections
    )

    return {
        "title": "Relatorio tecnico do Campo Corvina",
        "sections": sections,
        "equipment_recommendations_count": len(equipment),
        "calculation_steps_count": len(detailed_steps),
        "calculation_memory": calculation_text,
        "equipment_inventory_text": equipment_text,
        "full_text": full_text,
    }
