from __future__ import annotations

from .calculations import calculate_field_indicators
from .data import SCENARIO
from .equipment import get_equipment_recommendations


def generate_report_text() -> dict[str, object]:
    """Generate a structured Portuguese technical base text for the report."""
    calculations = calculate_field_indicators()
    recommendations = get_equipment_recommendations()

    sections = [
        {
            "title": "1. Introdução",
            "text": (
                "O presente projeto propõe o desenvolvimento conceitual do sistema submarino de produção "
                f"do Campo {SCENARIO.field.name}, localizado no Bloco {SCENARIO.field.block}, na Bacia "
                f"da {SCENARIO.field.basin}. Como complemento ao relatório tradicional, foi desenvolvida "
                "uma ferramenta web denominada Corvina Subsea Concept Designer, voltada à integração dos "
                "dados do campo, cálculos de engenharia, seleção de equipamentos, geração de layout em "
                "planta e representação em gêmeo digital conceitual."
            ),
        },
        {
            "title": "2. Caracterização do Campo Corvina",
            "text": (
                f"O Campo {SCENARIO.field.name} apresenta lâmina d'água de aproximadamente "
                f"{SCENARIO.field.water_depth_m:.0f} m, reservatório a cerca de "
                f"{SCENARIO.field.reservoir_depth_m:.0f} m de profundidade e sistema de desenvolvimento "
                f"composto por {SCENARIO.field.total_wells} poços submarinos. O plano conceitual considera "
                f"{SCENARIO.field.producer_wells} poços produtores, dois poços injetores de água e um poço "
                "injetor de gás, todos conectados a uma FPSO. As condições meteo-oceanográficas indicam "
                f"correntes intensas, com velocidade máxima de projeto de "
                f"{SCENARIO.meteo_ocean.design_current_velocity_m_s:.1f} m/s, fator relevante para o arranjo "
                "de risers, flowlines e umbilicais."
            ),
        },
        {
            "title": "3. Síntese dos Cálculos",
            "text": (
                f"A produção total de óleo do campo é de {calculations.total_oil_rate_stb_d:.0f} STB/d, "
                f"correspondente a aproximadamente {calculations.fpso_oil_occupancy_percent:.1f}% da "
                "capacidade de processamento de óleo da FPSO. A produção total de gás é de "
                f"{calculations.total_gas_rate_mmscf_d:.0f} MMSCF/d, equivalente a "
                f"{calculations.fpso_gas_occupancy_percent:.1f}% da capacidade de processamento de gás da "
                f"unidade. A produção total de água é de {calculations.total_water_rate_stb_d:.0f} STB/d, "
                "ainda baixa em relação à capacidade de tratamento e injeção de água da FPSO. Considerando "
                f"o consumo operacional de gás de {SCENARIO.fpso.gas_consumption_mmscf_d:.0f} MMSCF/d, o "
                f"volume conceitualmente disponível para reinjeção é de "
                f"{calculations.gas_available_for_reinjection_mmscf_d:.0f} MMSCF/d."
            ),
        },
        {
            "title": "4. Arquitetura Submarina Recomendada",
            "text": (
                "A arquitetura proposta utiliza uma configuração por clusters, com dois manifolds de produção, "
                "um manifold dedicado à injeção de água e um PLET ou manifold simplificado para injeção de gás. "
                "Os produtores P-01, P-02 e P-03 são conectados ao MP-01, enquanto P-04 e P-05 são conectados "
                "ao MP-02. Os injetores de água I-01 e I-03 são conectados ao MI-WATER, enquanto o injetor "
                "de gás I-02 é conectado ao PLET-GAS."
            ),
        },
        {
            "title": "5. Layout em Planta",
            "text": (
                "O layout em planta organiza os equipamentos submarinos buscando reduzir cruzamentos, diminuir "
                "comprimentos de jumpers, facilitar intervenções e manter espaço para expansão futura. A FPSO "
                "é posicionada ao norte da área de desenvolvimento, permitindo um corredor organizado de risers "
                "e umbilicais. A direção predominante da corrente, de Nordeste para Sudoeste, é representada "
                "no layout para apoiar a interpretação do arranjo."
            ),
        },
        {
            "title": "6. Gêmeo Digital Conceitual",
            "text": (
                "O gêmeo digital conceitual representa o sistema submarino em ambiente tridimensional interativo. "
                "A cena 3D inclui a FPSO na superfície, o leito marinho, os poços, manifolds, flowlines, risers, "
                "umbilicais, SDUs e o vetor de corrente predominante. Cada componente possui dados técnicos "
                "associados, permitindo inspeção visual e informacional da arquitetura proposta. A escala vertical "
                "é comprimida para fins de visualização e não representa proporções físicas reais."
            ),
        },
        {
            "title": "7. Discussão Técnica",
            "text": (
                "A lâmina d'água ultraprofundas influencia diretamente a seleção dos risers, o sistema de controle, "
                "a instalação dos equipamentos e a confiabilidade do arranjo submarino. As correntes intensas "
                "aumentam a importância da análise de esforços, estabilidade das linhas e comportamento dinâmico "
                "dos risers. O óleo parafínico exige atenção à garantia de escoamento, justificando o uso de "
                "flowlines de produção com isolamento térmico e previsão de injeção química via umbilicais."
            ),
        },
        {
            "title": "8. Limitações do Protótipo",
            "text": (
                "O protótipo desenvolvido possui finalidade acadêmica e conceitual. Ele não realiza simulação "
                "hidráulica multifásica, cálculo estrutural de risers, análise de fadiga, deposição de parafina, "
                "formação de hidratos ou conexão com sensores reais. Apesar disso, a ferramenta organiza os dados "
                "do projeto, automatiza os cálculos principais, melhora a visualização da arquitetura submarina e "
                "fortalece a comunicação técnica do trabalho."
            ),
        },
        {
            "title": "9. Conclusão",
            "text": (
                "O Corvina Subsea Concept Designer demonstra como conceitos de Engenharia de Petróleo podem ser "
                "integrados a tecnologias modernas de Engenharia de Software. A ferramenta amplia a abordagem "
                "tradicional do trabalho ao oferecer uma plataforma interativa para cálculo, seleção de equipamentos, "
                "visualização em planta e gêmeo digital conceitual. Dessa forma, o projeto contribui para uma "
                "apresentação mais clara, técnica e inovadora do sistema submarino proposto para o Campo Corvina."
            ),
        },
    ]

    full_text = "\n\n".join(
        f"{section['title']}\n{section['text']}" for section in sections
    )

    return {
        "title": "Texto-base para relatório técnico do Campo Corvina",
        "sections": sections,
        "equipment_recommendations_count": len(recommendations),
        "full_text": full_text,
    }
