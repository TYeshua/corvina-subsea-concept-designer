export const layoutJustification =
  "O layout em planta foi organizado em uma configuração por clusters. Os poços produtores P-01, P-02 e P-03 foram conectados ao manifold MP-01, enquanto P-04 e P-05 foram conectados ao manifold MP-02. Os poços I-01 e I-03, responsáveis pela injeção de água tratada, foram associados ao manifold MI-WATER. O poço I-02 foi conectado ao PLET-GAS, viabilizando a reinjeção do gás excedente produzido pelo campo. A FPSO foi posicionada ao norte da área de desenvolvimento para organizar o corredor de risers e umbilicais, reduzir interferências e preservar áreas para expansão futura.";

export const digitalTwinJustification =
  "O gêmeo digital conceitual do Campo Corvina representa a arquitetura submarina proposta em um ambiente tridimensional interativo. A visualização integra FPSO, poços, manifolds, flowlines, risers, umbilicais e SDUs, permitindo compreender a organização espacial do sistema. O modelo é conceitual e não realiza simulação hidráulica, estrutural ou operacional em tempo real. Ainda assim, funciona como ferramenta de comunicação técnica e apoio à decisão, conectando dados de engenharia à visualização digital do sistema submarino.";

export const architectureJustification =
  "A arquitetura proposta utiliza uma configuração por clusters, distribuindo os cinco produtores em dois manifolds de produção. Essa solução reduz a concentração de risco em um único equipamento, diminui a extensão dos jumpers e melhora a organização do arranjo submarino. Os dois injetores de água são conectados a um manifold dedicado, enquanto o injetor de gás é atendido por um PLET ou manifold simplificado, compatível com a necessidade de reinjeção do gás produzido.";

export const architectureDecisions = [
  "Uso de dois manifolds de produção para reduzir risco e organizar clusters.",
  "Reinjeção do gás excedente devido à ausência de exportação.",
  "Flowlines de produção rígidas e isoladas termicamente devido ao óleo parafínico.",
  "Risers do tipo Steel Lazy Wave ou híbrido devido à lâmina d'água ultraprofundas.",
  "Controle eletro-hidráulico multiplexado pela confiabilidade e maturidade tecnológica.",
];

export const fieldDataInterpretation =
  "A combinação de lâmina d'água ultraprofundas, correntes intensas e óleo parafínico exige atenção especial à seleção de risers, isolamento térmico das flowlines, controle submarino confiável e estratégias de garantia de escoamento.";

export const executiveSummary =
  "O Campo Corvina apresenta produção total de 150.000 STB/d de óleo, ocupando aproximadamente 83,3% da capacidade de processamento da FPSO. A produção total de gás é de 210 MMSCF/d e, como não há infraestrutura de exportação, o excedente após o consumo operacional da FPSO deve ser destinado à reinjeção. A produção de água ainda é baixa em relação à capacidade de tratamento e injeção, indicando margem operacional para a estratégia de manutenção de pressão.";

export const prototypeLimitation =
  "Este protótipo não substitui softwares industriais de engenharia submarina. A ferramenta tem finalidade acadêmica e conceitual, sendo voltada à organização dos dados, visualização da arquitetura e apoio à comunicação técnica.";

export const fallbackReportSections = [
  {
    title: "1. Introdução",
    text: "O presente projeto propõe o desenvolvimento conceitual do sistema submarino de produção do Campo Corvina, localizado no Bloco FZM-59, na Bacia da Foz do Amazonas. Como complemento ao relatório tradicional, foi desenvolvida uma ferramenta web denominada Corvina Subsea Concept Designer, voltada à integração dos dados do campo, cálculos de engenharia, seleção de equipamentos, geração de layout em planta e representação em gêmeo digital conceitual.",
  },
  {
    title: "2. Caracterização do Campo Corvina",
    text: "O Campo Corvina apresenta lâmina d'água de aproximadamente 2.300 m, reservatório a cerca de 5.600 m de profundidade e sistema de desenvolvimento composto por oito poços submarinos. O plano conceitual considera cinco poços produtores, dois poços injetores de água e um poço injetor de gás, todos conectados a uma FPSO. As condições meteo-oceanográficas indicam correntes intensas, com velocidade máxima de projeto de 2,3 m/s, fator relevante para o arranjo de risers, flowlines e umbilicais.",
  },
  {
    title: "3. Síntese dos Cálculos",
    text: "A produção total de óleo do campo é de 150.000 STB/d, correspondente a aproximadamente 83,3% da capacidade de processamento de óleo da FPSO. A produção total de gás é de 210 MMSCF/d, equivalente a 70% da capacidade de processamento de gás da unidade. A produção total de água é de 17.000 STB/d, ainda baixa em relação à capacidade de tratamento e injeção de água da FPSO. Considerando o consumo operacional de gás de 20 MMSCF/d, o volume conceitualmente disponível para reinjeção é de 190 MMSCF/d.",
  },
  {
    title: "4. Arquitetura Submarina Recomendada",
    text: "A arquitetura proposta utiliza uma configuração por clusters, com dois manifolds de produção, um manifold dedicado à injeção de água e um PLET ou manifold simplificado para injeção de gás. Os produtores P-01, P-02 e P-03 são conectados ao MP-01, enquanto P-04 e P-05 são conectados ao MP-02. Os injetores de água I-01 e I-03 são conectados ao MI-WATER, enquanto o injetor de gás I-02 é conectado ao PLET-GAS.",
  },
  {
    title: "5. Layout em Planta",
    text: "O layout em planta organiza os equipamentos submarinos buscando reduzir cruzamentos, diminuir comprimentos de jumpers, facilitar intervenções e manter espaço para expansão futura. A FPSO é posicionada ao norte da área de desenvolvimento, permitindo um corredor organizado de risers e umbilicais. A direção predominante da corrente, de Nordeste para Sudoeste, é representada no layout para apoiar a interpretação do arranjo.",
  },
  {
    title: "6. Gêmeo Digital Conceitual",
    text: "O gêmeo digital conceitual representa o sistema submarino em ambiente tridimensional interativo. A cena 3D inclui a FPSO na superfície, o leito marinho, os poços, manifolds, flowlines, risers, umbilicais, SDUs e o vetor de corrente predominante. Cada componente possui dados técnicos associados, permitindo inspeção visual e informacional da arquitetura proposta. A escala vertical é comprimida para fins de visualização e não representa proporções físicas reais.",
  },
  {
    title: "7. Discussão Técnica",
    text: "A lâmina d'água ultraprofundas influencia diretamente a seleção dos risers, o sistema de controle, a instalação dos equipamentos e a confiabilidade do arranjo submarino. As correntes intensas aumentam a importância da análise de esforços, estabilidade das linhas e comportamento dinâmico dos risers. O óleo parafínico exige atenção à garantia de escoamento, justificando o uso de flowlines de produção com isolamento térmico e previsão de injeção química via umbilicais.",
  },
  {
    title: "8. Limitações do Protótipo",
    text: "O protótipo desenvolvido possui finalidade acadêmica e conceitual. Ele não realiza simulação hidráulica multifásica, cálculo estrutural de risers, análise de fadiga, deposição de parafina, formação de hidratos ou conexão com sensores reais. Apesar disso, a ferramenta organiza os dados do projeto, automatiza os cálculos principais, melhora a visualização da arquitetura submarina e fortalece a comunicação técnica do trabalho.",
  },
  {
    title: "9. Conclusão",
    text: "O Corvina Subsea Concept Designer demonstra como conceitos de Engenharia de Petróleo podem ser integrados a tecnologias modernas de Engenharia de Software. A ferramenta amplia a abordagem tradicional do trabalho ao oferecer uma plataforma interativa para cálculo, seleção de equipamentos, visualização em planta e gêmeo digital conceitual. Dessa forma, o projeto contribui para uma apresentação mais clara, técnica e inovadora do sistema submarino proposto para o Campo Corvina.",
  },
];

export const reportConclusion = fallbackReportSections[8].text;
