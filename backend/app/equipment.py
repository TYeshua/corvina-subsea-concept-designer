from __future__ import annotations

from .models import EquipmentRecommendation


def get_equipment_recommendations() -> list[EquipmentRecommendation]:
    """Return conceptual subsea equipment recommendations for Campo Corvina."""
    return [
        EquipmentRecommendation(
            category="Completação submarina",
            equipment="Árvore de Natal Molhada",
            recommendation="Horizontal",
            technical_justification="Adequada para águas profundas, completação submarina e flexibilidade de intervenção.",
        ),
        EquipmentRecommendation(
            category="Coleta de produção",
            equipment="Manifolds de produção",
            recommendation="2 manifolds de produção",
            technical_justification="Reduzem concentração de risco, organizam os produtores em clusters e reduzem comprimentos de jumpers.",
        ),
        EquipmentRecommendation(
            category="Injeção de água",
            equipment="Manifold de injeção de água",
            recommendation="1 manifold dedicado",
            technical_justification="Permite distribuir água tratada para os dois poços injetores de água.",
        ),
        EquipmentRecommendation(
            category="Injeção de gás",
            equipment="PLET ou manifold de gás",
            recommendation="1 PLET ou manifold dedicado para gás",
            technical_justification="Necessário porque não há infraestrutura de exportação de gás e o gás excedente deve ser reinjetado.",
        ),
        EquipmentRecommendation(
            category="Linhas submarinas",
            equipment="Flowlines de produção",
            recommendation="Linhas rígidas com isolamento térmico",
            technical_justification="Óleo parafínico e lâmina d'água elevada exigem atenção à garantia de escoamento.",
        ),
        EquipmentRecommendation(
            category="Linhas submarinas",
            equipment="Flowlines de injeção",
            recommendation="Linhas rígidas",
            technical_justification="Maior robustez para transporte de água e gás tratados.",
        ),
        EquipmentRecommendation(
            category="Interligações submarinas",
            equipment="Jumpers",
            recommendation="Jumpers flexíveis ou spools rígidos",
            technical_justification="Permitem conexão entre árvores e manifolds com tolerância de instalação.",
        ),
        EquipmentRecommendation(
            category="Risers",
            equipment="Risers",
            recommendation="Steel Lazy Wave Riser ou sistema híbrido",
            technical_justification="Configuração mais adequada para lâmina d'água ultraprofundas e correntes intensas.",
        ),
        EquipmentRecommendation(
            category="Controle submarino",
            equipment="Umbilicais",
            recommendation="Eletro-hidráulicos multiplexados",
            technical_justification="Permitem controle, comunicação, acionamento hidráulico e injeção química.",
        ),
        EquipmentRecommendation(
            category="Distribuição submarina",
            equipment="SDUs",
            recommendation="Posicionados próximos aos manifolds",
            technical_justification="Distribuem energia, sinal, hidráulica e químicos para os equipamentos submarinos.",
        ),
        EquipmentRecommendation(
            category="Controle submarino",
            equipment="Sistema de controle",
            recommendation="Eletro-hidráulico multiplexado",
            technical_justification="Tecnologia madura e confiável para sistemas submarinos complexos.",
        ),
    ]

