from __future__ import annotations

from .models import EquipmentRecommendation


def get_equipment_recommendations() -> list[EquipmentRecommendation]:
    """Return the detailed conceptual subsea equipment inventory."""
    return [
        EquipmentRecommendation(
            id="wet-christmas-trees",
            category="Completação submarina",
            name="Árvores de Natal Molhadas",
            quantity=8,
            type="Árvore de Natal Molhada Horizontal",
            installation_location=(
                "No leito marinho, sobre cada cabeça de poço, em lâmina d'água "
                "de aproximadamente 2.300 m."
            ),
            position_reference="P-01, P-02, P-03, P-04, P-05, I-01, I-02 e I-03",
            function=(
                "Controlar o fluxo produzido ou injetado, permitir fechamento de segurança, "
                "conexão com jumpers e integração ao sistema de controle submarino."
            ),
            connected_to=["P-01", "P-02", "P-03", "P-04", "P-05", "I-01", "I-02", "I-03"],
            technical_justification=(
                "A árvore horizontal é adequada para águas profundas/ultraprofundas e "
                "oferece flexibilidade para completação e intervenções submarinas ao longo "
                "da vida útil do campo."
            ),
            operational_notes=(
                "Cinco unidades atendem produtores, duas atendem injetores de água e uma "
                "atende o injetor de gás."
            ),
        ),
        EquipmentRecommendation(
            id="production-manifolds",
            category="Coleta de produção",
            name="Manifolds de Produção",
            quantity=2,
            type="Manifold submarino de produção multifásica",
            installation_location="Leito marinho, próximos aos clusters de produtores.",
            position_reference="MP-01: (2,8 km, 5,4 km); MP-02: (6,9 km, 5,0 km)",
            function=(
                "Coletar a produção dos poços produtores e direcionar os fluidos "
                "multifásicos para a FPSO por flowlines e risers de produção."
            ),
            connected_to=["MP-01 -> P-01/P-02/P-03", "MP-02 -> P-04/P-05", "FPSO"],
            technical_justification=(
                "A divisão em dois manifolds reduz concentração de risco, diminui a extensão "
                "dos jumpers, organiza os produtores em clusters e facilita futuras expansões."
            ),
            operational_notes="MP-01 atende o cluster oeste e MP-02 atende o cluster leste.",
        ),
        EquipmentRecommendation(
            id="water-injection-manifold",
            category="Injeção de água",
            name="Manifold de Injeção de Água",
            quantity=1,
            type="Manifold submarino dedicado à água tratada",
            installation_location="Leito marinho, em posição central-sul do campo.",
            position_reference="MI-WATER: (5,0 km, 3,0 km)",
            function="Receber água tratada da FPSO e distribuir para os poços I-01 e I-03.",
            connected_to=["FPSO", "I-01", "I-03", "SDU-03"],
            technical_justification=(
                "A injeção de água auxilia a manutenção de pressão e melhora a eficiência "
                "de varrido. O manifold dedicado permite melhor controle de distribuição "
                "entre os injetores."
            ),
            operational_notes="Deve prever controle de vazão e monitoramento de pressão por ramal.",
        ),
        EquipmentRecommendation(
            id="gas-injection-plet",
            category="Injeção de gás",
            name="PLET/Manifold de Injeção de Gás",
            quantity=1,
            type="PLET ou manifold dedicado de gás",
            installation_location="Leito marinho, próximo ao injetor de gás I-02.",
            position_reference="PLET-GAS: (5,0 km, 6,1 km)",
            function="Direcionar o gás tratado excedente para o poço injetor de gás I-02.",
            connected_to=["FPSO", "I-02", "SDU-03"],
            technical_justification=(
                "Como não há infraestrutura prevista para exportação de gás, o gás excedente "
                "após o consumo operacional da FPSO deve ser reinjetado. O PLET dedicado "
                "organiza essa conexão e reduz interferências com as linhas de produção."
            ),
            operational_notes="Requer instrumentação para pressão, temperatura e integridade da linha de gás.",
        ),
        EquipmentRecommendation(
            id="sdus",
            category="Controle submarino",
            name="Subsea Distribution Units (SDUs)",
            quantity=3,
            type="SDU eletro-hidráulico multiplexado",
            installation_location="Leito marinho, próximo aos manifolds e PLET.",
            position_reference="SDU-01: (3,1 km, 5,0 km); SDU-02: (6,6 km, 4,7 km); SDU-03: (5,2 km, 3,3 km)",
            function="Distribuir energia, sinal, comandos hidráulicos e químicos para os equipamentos submarinos.",
            connected_to=["FPSO", "MP-01", "MP-02", "MI-WATER", "PLET-GAS"],
            technical_justification=(
                "A instalação próxima aos manifolds reduz comprimentos de linhas de controle, "
                "organiza os umbilicais e facilita operação e manutenção."
            ),
            operational_notes="SDU-01 atende MP-01; SDU-02 atende MP-02; SDU-03 atende injeção de água e gás.",
        ),
        EquipmentRecommendation(
            id="flowlines",
            category="Linhas submarinas",
            name="Flowlines principais",
            quantity=4,
            type="Flowlines rígidas; produção com isolamento térmico",
            installation_location="Leito marinho, conectando FPSO, manifolds e PLET.",
            position_reference="MP-01 -> FPSO; MP-02 -> FPSO; FPSO -> MI-WATER; FPSO -> PLET-GAS",
            function="Transportar produção multifásica, água tratada e gás tratado entre os principais nós do sistema.",
            connected_to=["MP-01", "MP-02", "MI-WATER", "PLET-GAS", "FPSO"],
            technical_justification=(
                "O óleo parafínico, a lâmina d'água elevada e as baixas temperaturas no fundo "
                "do mar exigem atenção à garantia de escoamento. Por isso, recomenda-se "
                "isolamento térmico nas flowlines de produção e previsão de injeção química."
            ),
            operational_notes="Inclui duas linhas de produção, uma de injeção de água e uma de injeção de gás.",
        ),
        EquipmentRecommendation(
            id="jumpers",
            category="Interligações submarinas",
            name="Jumpers de poço",
            quantity=8,
            type="Jumpers flexíveis ou spools rígidos",
            installation_location="Leito marinho, entre árvores submarinas e equipamentos de coleta/injeção.",
            position_reference="P-01/P-02/P-03 -> MP-01; P-04/P-05 -> MP-02; I-01/I-03 -> MI-WATER; I-02 -> PLET-GAS",
            function=(
                "Conectar as árvores de natal molhadas aos manifolds ou PLETs, acomodando "
                "tolerâncias de instalação e facilitando intervenções."
            ),
            connected_to=["Árvores de Natal Molhadas", "MP-01", "MP-02", "MI-WATER", "PLET-GAS"],
            technical_justification=(
                "Permitem modularidade e acomodação de tolerâncias de instalação em águas profundas."
            ),
            operational_notes="Devem considerar envelopes de metrologia submarina e acesso por ROV.",
        ),
        EquipmentRecommendation(
            id="risers",
            category="Risers",
            name="Risers principais",
            quantity=4,
            type="Steel Lazy Wave Riser ou sistema híbrido",
            installation_location="Entre a FPSO e o sistema submarino, no corredor de risers.",
            position_reference="2 produção; 1 injeção de água; 1 injeção de gás",
            function=(
                "Conectar o sistema submarino à FPSO, transportando produção multifásica, "
                "água de injeção e gás de injeção."
            ),
            connected_to=["FPSO", "MP-01", "MP-02", "MI-WATER", "PLET-GAS"],
            technical_justification=(
                "A lâmina d'água de 2.300 m e as correntes intensas tornam necessário um "
                "sistema de risers adequado a águas ultraprofundas, capaz de acomodar "
                "esforços dinâmicos e movimentos da unidade flutuante."
            ),
            operational_notes="A seleção final exige análise dinâmica, fadiga e interferência entre risers.",
        ),
        EquipmentRecommendation(
            id="umbilicals",
            category="Controle submarino",
            name="Umbilicais principais",
            quantity=3,
            type="Umbilicais eletro-hidráulicos multiplexados",
            installation_location="Entre a FPSO e os SDUs no leito marinho.",
            position_reference="FPSO -> SDU-01; FPSO -> SDU-02; FPSO -> SDU-03",
            function=(
                "Transmitir energia, comunicação, sinais de controle, comandos hidráulicos "
                "e químicos de tratamento para os equipamentos submarinos."
            ),
            connected_to=["FPSO", "SDU-01", "SDU-02", "SDU-03"],
            technical_justification=(
                "Tecnologia madura para controle de sistemas submarinos complexos em águas profundas."
            ),
            operational_notes="Devem prever linhas para injeção química associada à garantia de escoamento.",
        ),
        EquipmentRecommendation(
            id="subsea-accessories",
            category="Acessórios e proteção",
            name="Acessórios e demais equipamentos submarinos",
            quantity=1,
            type="Conjunto de acessórios, painéis, válvulas, sensores e proteções",
            installation_location="Distribuídos nos manifolds, PLETs, árvores, linhas e interfaces de conexão.",
            position_reference="Ao longo do arranjo submarino conforme necessidade de instalação e operação.",
            function=(
                "Permitir conexão, monitoramento, proteção, intervenção por ROV, controle local, "
                "injeção química, pigagem quando aplicável e proteção anticorrosiva."
            ),
            connected_to=["Árvores", "Manifolds", "PLETs", "Flowlines", "Umbilicais", "SDUs"],
            technical_justification=(
                "ROV panels, válvulas submarinas, módulos de conexão, sensores de pressão e "
                "temperatura, conectores hidráulicos/elétricos, proteções mecânicas, ânodos de "
                "sacrifício, injeção química e pontos de pigagem aumentam operabilidade, "
                "integridade e manutenibilidade do sistema."
            ),
            operational_notes=(
                "Representa um pacote conceitual; o detalhamento executivo dependeria de FEED, "
                "normas aplicáveis e engenharia de fornecedores."
            ),
        ),
    ]
