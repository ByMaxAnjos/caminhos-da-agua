/* Caminhos da Água — conteúdo da Unidade II (fonte: plano_unidade_II_bacia_SIG.md).
   Cada encontro: ideias curtas, pergunta para hipótese, quiz, ferramenta e roteiro QGIS. */
var CONTEUDO = {
  problema: {
    pergunta: "Por que alguns córregos de Juiz de Fora responderam mais rápido às chuvas de fevereiro de 2026?",
    sub: "A forma e o relevo da bacia explicam parte disso? Cada encontro entrega uma peça da resposta."
  },

  encontros: [
    {
      id: 1, titulo: "A bacia como sistema", sub: "Aspectos físicos",
      objetivo: "Entender a bacia como sistema aberto delimitado pelo relevo.",
      ideias: [
        "Bacia é a área drenada por um rio e seus afluentes até um exutório.",
        "Entradas: chuva. Saídas: vazão, sedimentos e evapotranspiração.",
        "O divisor passa pelos topos e corta as curvas de nível em ângulo reto.",
        "Divisor topográfico e divisor freático nem sempre coincidem.",
        "Geologia, clima, solo, relevo e vegetação controlam como a bacia responde."
      ],
      hipotese: "Olhando o relevo de Juiz de Fora (vales encaixados, várzeas estreitas), o que você espera que aconteça com a água de uma chuva forte?",
      quiz: [
        { p: "Por onde passa o divisor de águas numa carta topográfica?", opcoes: ["Pelo fundo dos vales", "Pelos topos, cortando as curvas de nível em ângulo reto", "Ao longo das curvas de nível", "Pelo leito do rio principal"], correta: 1, fb: "O divisor segue os pontos mais altos e só cruza um canal no exutório." },
        { p: "Na visão sistêmica, qual é a principal entrada de uma bacia?", opcoes: ["A vazão no exutório", "A evapotranspiração", "A precipitação", "O transporte de sedimentos"], correta: 2, fb: "Vazão, sedimentos e evapotranspiração são saídas; a chuva é a entrada." }
      ],
      ferramenta: null,
      pratica: "Papel amassado + borrifador: marque os divisores antes de borrifar e confira. Depois trace o divisor numa carta 1:50.000 e no Google Earth Pro (perfil de elevação).",
      qgis: [
        "Google Earth Pro: desenhar o divisor de uma microbacia como polígono.",
        "Ativar relevo 3D e usar 'Mostrar perfil de elevação' num caminho que cruze o divisor.",
        "Salvar o polígono como .kml: ele será comparado com a delimitação automática no encontro 4."
      ],
      leitura: "Christofoletti (1980), cap. 4 · Barros et al. · Oliveira (2020)"
    },
    {
      id: 2, titulo: "Hierarquia fluvial", sub: "Ordens e padrões de drenagem",
      objetivo: "Ordenar uma rede de drenagem e relacionar o padrão da rede à geologia.",
      ideias: [
        "Strahler: canal sem afluente = 1ª ordem; dois de ordem u se unem → u+1.",
        "Canais de ordens diferentes se unem → vale a maior. É o padrão da morfometria.",
        "Shreve: magnitude = soma das magnitudes (nº de nascentes a montante).",
        "O padrão da rede (dendrítico, treliça, retangular...) denuncia o controle estrutural.",
        "A ordem depende da escala: uma carta 1:10.000 mostra mais canais de 1ª ordem que uma 1:50.000."
      ],
      hipotese: "Um rio que recebe dez afluentes de 1ª ordem vira um rio de 5ª ordem? Por quê?",
      quiz: [
        { p: "Um canal de 2ª ordem recebe um afluente de 1ª ordem. Pela regra de Strahler, o trecho a jusante é de:", opcoes: ["1ª ordem", "2ª ordem", "3ª ordem", "Depende do comprimento"], correta: 1, fb: "Só a junção de dois canais de mesma ordem aumenta a ordem." },
        { p: "Padrão retangular ou em treliça numa rede de drenagem indica principalmente:", opcoes: ["Relevo plano e homogêneo", "Controle estrutural (fraturas, falhas, foliação)", "Clima árido", "Área urbana"], correta: 1, fb: "Em Juiz de Fora, fraturas e foliação da Mantiqueira condicionam trechos retangulares." }
      ],
      ferramenta: "jogo",
      pratica: "Ordenar à mão (lápis de cor) a rede da carta por Strahler e por Shreve e contar os canais por ordem.",
      qgis: [
        "Carregar a BHO (ANA) e a imagem Google Satellite (Navegador → XYZ Tiles).",
        "Recortar a rede do Paraibuna em JF: Vetor → Geoprocessamento → Recortar.",
        "Abrir a tabela de atributos e comparar o código de Otto (Pfafstetter) com a sua ordenação.",
        "Estilizar a rede por espessura (simbologia Graduado)."
      ],
      leitura: "Christofoletti (1980), cap. 4 · Felippe (Nascentes: Geomorfologia Fluvial)"
    },
    {
      id: 3, titulo: "O relevo como dado", sub: "SIG I: o MDE",
      objetivo: "Dominar o Modelo Digital de Elevação, matéria-prima de toda a análise.",
      ideias: [
        "MDE é um raster: cada célula guarda uma altitude (ex.: 30 m × 30 m).",
        "Copernicus é modelo de superfície (MDS): prédios e árvores entram como relevo.",
        "Para medir área e distância, reprojete para SIRGAS 2000 / UTM 23S (EPSG:31983).",
        "Sombreamento, hipsometria, curvas e declividade saem do mesmo MDE."
      ],
      hipotese: "Onde um MDE de 30 m vai errar mais em Juiz de Fora: no centro urbano ou na zona rural? Por quê?",
      quiz: [
        { p: "Você calculou a área da bacia e obteve 0,0003. O que provavelmente aconteceu?", opcoes: ["A bacia é minúscula", "A camada está em graus (SRC geográfico)", "O MDE tem resolução baixa", "Faltou preencher depressões"], correta: 1, fb: "Em graus, $area não sai em m². Reprojete para EPSG:31983." },
        { p: "Por que o Copernicus GLO-30 exige cuidado na área urbana?", opcoes: ["Não cobre o Brasil", "É um modelo de superfície: prédios viram 'morros'", "Tem resolução de 1 km", "Só tem dados de 2000"], correta: 1, fb: "Edificações criam barragens falsas na drenagem extraída." }
      ],
      ferramenta: "simulador",
      pratica: "No simulador, observe a hipsometria e o sombreamento do relevo sintético.",
      qgis: [
        "Baixar o MDE: plugin OpenTopography DEM Downloader → COP30 (ou arquivo do Drive).",
        "Reprojetar para EPSG:31983: Raster → Projeções → Reprojetar (bilinear, 30 m).",
        "Recortar pela área de interesse: Raster → Extração → Recortar raster pela extensão.",
        "Sombreamento: Raster → Análise → Sombreamento (MDE por cima com 50% de transparência).",
        "Hipsometria: Simbologia → Banda simples falsa-cor, 8–10 classes.",
        "Curvas de nível: Raster → Extração → Contorno, equidistância 20 m.",
        "Declividade: Raster → Análise → Declividade; reclassificar nas classes da Embrapa."
      ],
      leitura: "QGIS Training Manual (docs.qgis.org)"
    },
    {
      id: 4, titulo: "Delimitar a bacia", sub: "SIG II: do relevo à rede",
      objetivo: "Delimitar bacias a partir do MDE e extrair a rede com hierarquia.",
      ideias: [
        "Depressões sem saída interrompem o fluxo: são preenchidas ou rompidas.",
        "Direção de fluxo (D8): cada célula drena para a vizinha mais baixa entre 8.",
        "Fluxo acumulado: quantas células drenam para cada célula. Valores altos = canais.",
        "Limiar: a partir de quantas células existe um canal. É decisão do analista.",
        "Exutório: a bacia é tudo o que drena para ele. Ponto fora do canal = bacia errada."
      ],
      hipotese: "Se você diminuir o limiar pela metade, o que acontece com a ordem máxima do rio e com a densidade de drenagem?",
      quiz: [
        { p: "Ao aumentar o limiar de acumulação, a rede extraída fica:", opcoes: ["Mais densa, com mais canais de 1ª ordem", "Mais pobre, com menos canais", "Igual: o limiar só muda a cor", "Com a bacia maior"], correta: 1, fb: "Limiar maior exige mais área de contribuição para existir canal." },
        { p: "A bacia delimitada saiu minúscula. Causa mais provável:", opcoes: ["Limiar muito alto", "Exutório fora do canal de acumulação alta", "MDE em UTM", "Falta do plugin Profile Tool"], correta: 1, fb: "Erro nº 1: coloque o exutório sobre a célula de acumulação máxima (ou use SnapPourPoints)." }
      ],
      ferramenta: "simulador",
      pratica: "Experimento: extraia a rede com 3 limiares diferentes e anote nº de canais de 1ª ordem, ordem máxima e comprimento total. Qual é a ordem 'verdadeira'?",
      qgis: [
        "r.watershed: Elevation = MDE UTM; limiar em células (30 m → 1 km² ≈ 1.111 células; comece com ~500); saídas accumulation, drainage, stream. Não precisa de fill antes.",
        "Criar camada de pontos e clicar o exutório sobre uma célula de acumulação alta.",
        "r.water.outlet: Drainage direction = saída drainage; coordenadas do exutório.",
        "Raster → Conversão → Poligonizar; apagar polígonos de valor 0/nulo.",
        "r.stream.extract: Elevation = MDE; accumulation; mesmo limiar; saída vetorial.",
        "Recortar a rede pela bacia: Vetor → Geoprocessamento → Recortar.",
        "Ordem de Strahler: Whitebox StrahlerStreamOrder, ou SAGA Channel network (campo ORDER), ou editar à mão na tabela.",
        "Comparar a bacia automática com o divisor manual do encontro 1."
      ],
      leitura: "Manuais GRASS r.watershed, r.water.outlet, r.stream.extract · WhiteboxTools"
    },
    {
      id: 5, titulo: "Forma e rede", sub: "Morfometria I",
      objetivo: "Transformar a bacia delimitada em números interpretáveis.",
      ideias: [
        "Kc = 0,28 P/√A: perto de 1 = bacia circular, cheia rápida.",
        "Kf = A/Lb²: alto = mais sujeita a cheias.",
        "Dd = Lt/A: mais canais por km² = água chega mais rápido ao rio.",
        "Rb = Nu/Nu+1: entre 3 e 5 é típico; alto indica controle estrutural.",
        "Tudo em EPSG:31983: $area/1e6 (km²), $perimeter/1000 e $length/1000 (km)."
      ],
      hipotese: "Duas bacias de mesma área: uma circular, outra alongada. Qual gera o pico de cheia mais alto e mais cedo? Por quê?",
      quiz: [
        { p: "Uma bacia tem Kc = 1,08. Isso indica:", opcoes: ["Bacia alongada, pouco sujeita a cheias", "Bacia próxima de circular, maior tendência a cheias", "Drenagem pobre", "Relevo senil"], correta: 1, fb: "Kc próximo de 1 = forma circular: os afluentes chegam juntos ao exutório." },
        { p: "Densidade de drenagem de 3,2 km/km² (Villela & Mattos) é:", opcoes: ["Pobre", "Regular", "Muito bem drenada", "Impossível"], correta: 2, fb: "2,5–3,5 = muito bem drenada." }
      ],
      ferramenta: "calculadora",
      pratica: "Medir A, P, comprimentos e nº de canais por ordem e lançar na calculadora para Ipiranga × Teixeiras.",
      qgis: [
        "Área e perímetro: calculadora de campo no polígono: $area / 1e6 e $perimeter / 1000.",
        "Comprimento de cada canal: $length / 1000 na camada da rede.",
        "Comprimento total (Lt): Vetor → Ferramentas de análise → Estatísticas básicas (soma).",
        "Nº e comprimento de canais por ordem: Estatísticas por categoria (agrupar por strahler).",
        "Canal principal (L): selecionar os trechos e somar (ou Dissolver e medir).",
        "Comprimento axial (Lb): linha reta do exutório ao ponto mais distante do divisor."
      ],
      leitura: "Horton (1945) · Strahler (1957) · Villela & Mattos (1975)"
    },
    {
      id: 6, titulo: "Relevo e perfis", sub: "Morfometria II",
      objetivo: "Somar o relevo à forma e responder à situação-problema.",
      ideias: [
        "Perfil longitudinal: altitude ao longo do canal, da nascente à foz.",
        "Curva e integral hipsométrica mostram quanto do relevo já foi erodido.",
        "tc (Kirpich) = 57 (L³/ΔH)^0,385 min: menor tc = resposta mais rápida.",
        "A morfometria não vê tudo: impermeabilização, canalização e bueiros também contam."
      ],
      hipotese: "Com Kc, Dd e tc das duas bacias, qual córrego responde mais rápido? O que os números NÃO explicam?",
      quiz: [
        { p: "Dois córregos com a mesma área: tc de 18 min e tc de 55 min. Qual tende a transbordar mais cedo numa chuva intensa curta?", opcoes: ["O de 55 min", "O de 18 min", "Os dois ao mesmo tempo", "Não dá para saber"], correta: 1, fb: "Menor tempo de concentração = toda a bacia contribui mais cedo no exutório." },
        { p: "Integral hipsométrica de 0,28 indica relevo:", opcoes: ["Jovem", "Maduro", "Senil (muito erodido)", "Urbano"], correta: 2, fb: "Strahler: < 0,35 = senil; 0,35–0,6 = maduro; > 0,6 = jovem." }
      ],
      ferramenta: "simulador",
      pratica: "Compare no simulador uma bacia circular e uma alongada: anote Kc, Kf, Dd e tc e o perfil longitudinal.",
      qgis: [
        "Altitudes mín., máx. e média: Processamento → Estatísticas zonais (MDE × bacia).",
        "Declividade média: Estatísticas zonais (declividade × bacia).",
        "Perfil longitudinal: painel Perfil de Elevação sobre a linha do canal principal; exportar.",
        "Perfil transversal: linha cruzando o vale no alto, médio e baixo curso.",
        "Curva hipsométrica: Processamento → Análise de terreno raster → Curvas hipsométricas.",
        "Tempo de concentração: calculadora do app (Kirpich)."
      ],
      leitura: "Strahler (1952) · Pike & Wilson (1971)"
    },
    {
      id: 7, titulo: "Sistema fluvial", sub: "O rio como sistema dinâmico",
      objetivo: "Passar da forma da bacia para o rio que transporta água e sedimentos.",
      ideias: [
        "Schumm (1977): zona de produção (cabeceiras), de transferência e de deposição.",
        "Perfil de equilíbrio é côncavo; knickpoints são rupturas de declive.",
        "Padrões de canal: retilíneo, meandrante, entrelaçado, anastomosado.",
        "A planície de inundação faz parte do rio: não é 'terreno livre'.",
        "Retificar o canal acelera o fluxo e transfere a cheia para jusante."
      ],
      hipotese: "O Paraibuna foi retificado na área urbana de JF. Que efeitos você espera a montante, no trecho retificado e a jusante?",
      quiz: [
        { p: "Um trecho com índice de sinuosidade 1,02 na área urbana sugere:", opcoes: ["Canal meandrante natural", "Canal retificado ou fortemente controlado", "Rio entrelaçado", "Erro de medida"], correta: 1, fb: "Is ≈ 1 é raro na natureza em planícies: indício de retificação." },
        { p: "Na zona de produção de Schumm predomina:", opcoes: ["Deposição de sedimentos finos", "Erosão e fornecimento de sedimentos", "Formação de deltas", "Meandros amplos"], correta: 1, fb: "Cabeceiras produzem sedimentos; a deposição predomina a jusante." }
      ],
      ferramenta: "sinuosidade",
      pratica: "Medir a sinuosidade de um trecho natural e de um retificado; ver imagens históricas no Google Earth Pro; marcar zonas de Schumm e escrever hipóteses para o campo.",
      qgis: [
        "Sinuosidade: medir L (comprimento do canal) e Dv (linha reta) nos dois trechos; lançar na ferramenta do app.",
        "Google Earth Pro → barra de tempo: mudanças no canal e na ocupação da várzea.",
        "Mapa antigo ou foto aérea: Raster → Georreferenciador.",
        "Marcar no mapa as zonas de produção, transferência e deposição a partir do perfil e da declividade.",
        "Marcar os pontos de campo (Paraibuna, Ipiranga, Teixeiras) com uma hipótese para cada um."
      ],
      leitura: "Rocha (Sistemas Rio-Planície) · Christofoletti (1981) · Schumm (1977)"
    }
  ],

  armadilhas: [
    { t: "Caminho com acento ou espaço", d: "O GRASS falha. Trabalhe em C:\\SIG\\hidro\\ (sem acento, sem espaço)." },
    { t: "SRC em graus", d: "Área e comprimento saem errados. Reprojete tudo para EPSG:31983 (UTM 23S)." },
    { t: "MDE grande demais", d: "Recorte a área de interesse antes: o r.watershed trava em máquinas fracas." }
  ],

  problemas: [
    ["Área da bacia em '0,0003'", "Camada em graus", "Reprojetar para 31983 e recalcular"],
    ["Bacia minúscula ou em 'tripa'", "Exutório fora do canal", "Aproximar e clicar sobre a acumulação máxima (ou SnapPourPoints)"],
    ["GRASS falha sem mensagem clara", "Acento/espaço no caminho", "Pasta C:\\SIG\\hidro\\, nomes sem acento"],
    ["Rede quebrada na cidade", "MDS com prédios; vales estreitos", "Comparar com a BHO; BreachDepressionsLeastCost ajuda"],
    ["Rede densa ou pobre demais", "Limiar inadequado", "Faz parte do experimento do encontro 4"],
    ["Sem algoritmo de Strahler", "GRASS sem addon", "Whitebox/SAGA ou ordenação manual na tabela"]
  ]
};

/* ---------- Ajuda: tutorial de boas-vindas e "Como usar esta tela" ---------- */
var AJUDA = {
  tutorial: [
    { t: "Bem-vindo ao Caminhos da Água", d: "Este app acompanha a Unidade II de Hidrogeografia: bacia hidrográfica, hierarquia fluvial, delimitação, morfometria e sistema fluvial.", a: "Tudo o que você faz fica salvo só neste aparelho. Não precisa de internet depois do primeiro acesso." },
    { t: "1. Trilha: um encontro por aula", d: "A aba Trilha tem os 7 encontros da unidade, na ordem das aulas. Abra o encontro do dia.", a: "Em cada encontro: escreva sua hipótese → leia as ideias-chave → faça a prática → responda ao quiz." },
    { t: "2. Simulador: veja a teoria acontecer", d: "A aba Simulador mostra um relevo e a rede de drenagem. Você escolhe o exutório tocando no mapa e o app delimita a bacia e calcula os índices.", a: "É um relevo inventado para estudo, não Juiz de Fora. Use-o para entender os conceitos antes de ir ao QGIS." },
    { t: "3. Ferramentas: medir e comparar", d: "A aba Ferramentas tem a calculadora de morfometria, o jogo de hierarquia fluvial e a calculadora de sinuosidade.", a: "Na calculadora você lança as medidas feitas no QGIS e recebe os índices já interpretados." },
    { t: "4. QGIS: o passo a passo do laboratório", d: "A aba QGIS tem o roteiro de cada encontro. Marque cada passo quando concluir.", a: "Leia antes as três armadilhas: elas evitam os erros mais comuns do laboratório." },
    { t: "5. Relatório: entregue seu percurso", d: "A aba Relatório reúne hipóteses, quizzes, bacias simuladas e cálculos.", a: "Use 'Imprimir / salvar PDF' ou 'Baixar HTML' para entregar ao professor. Botão 'Como usar' (no topo) reabre este tutorial." }
  ],

  telas: {
    trilha: {
      titulo: "Como usar a Trilha",
      passos: [
        "Os 7 cartões são os encontros da unidade, na ordem das aulas.",
        "Toque no encontro do dia para abrir.",
        "O cartão fica verde quando o encontro é concluído (hipótese registrada + quiz todo certo).",
        "A barra mostra quantos encontros você já concluiu."
      ],
      dica: "Pode voltar a um encontro quantas vezes quiser: suas respostas ficam salvas."
    },
    encontro: {
      titulo: "Como fazer um encontro",
      passos: [
        "Leia a pergunta em 'Antes de estudar' e escreva sua hipótese: o que você acha, com suas palavras. Não existe resposta errada aqui.",
        "Toque em 'Registrar hipótese'. Só então o conteúdo aparece.",
        "Leia as 'Ideias-chave': é o resumo do que o professor vai trabalhar.",
        "Em 'Prática', veja a atividade da aula e, se houver, abra a ferramenta indicada (simulador, calculadora ou jogo).",
        "Responda ao quiz em 'Confira'. Errou? Leia a explicação e tente outra opção.",
        "Quando tudo estiver certo, aparece 'Encontro concluído'."
      ],
      dica: "Por que escrever a hipótese antes? Comparar o que você pensava com o que aprendeu é o que fixa o conteúdo. Ao final da unidade, releia suas hipóteses no Relatório."
    },
    simulador: {
      titulo: "Como usar o Simulador",
      passos: [
        "O mapa mostra um relevo: verde = áreas baixas, amarelo e marrom = áreas altas. O sombreado dá a sensação de relevo.",
        "As linhas azuis são os rios que o computador extraiu do relevo. Quanto mais escura e grossa a linha, maior a ordem do rio.",
        "Toque sobre uma linha azul para escolher o exutório (ponto laranja). A área clara é a bacia desse exutório; a área escurecida fica fora dela.",
        "Arraste o controle 'Limiar de acumulação'. Limiar baixo = muitos rios pequenos; limiar alto = só os rios maiores.",
        "Troque entre 'Bacia circular' e 'Bacia alongada' para comparar formas. 'Nova paisagem' cria outro relevo.",
        "Role a tela para ver as medidas, os 16 índices com a leitura de cada um, o perfil longitudinal e a curva hipsométrica."
      ],
      atividade: [
        "Experimento de limiar (encontro 4): com a mesma bacia, use três limiares (ex.: 30, 100 e 250). Em cada um, toque em 'Registrar no experimento de limiar'. Compare a ordem máxima e a densidade de drenagem na tabela.",
        "Forma e cheia (encontros 5 e 6): escolha 'Bacia circular', toque em 'Guardar como bacia A'; mude para 'Bacia alongada' e toque em 'Guardar como bacia B'. Abra Ferramentas → Calculadora → 'Preencher com as bacias A e B' e compare Kc, Kf e tc.",
        "Perfil (encontro 7): observe o perfil longitudinal. Onde o rio é mais íngreme (zona de produção) e onde fica mais plano (deposição)?"
      ],
      dica: "O relevo é inventado para estudo. Os números servem para entender os conceitos, não descrevem Juiz de Fora."
    },
    ferramentas: {
      titulo: "Qual ferramenta usar?",
      passos: [
        "Calculadora de morfometria: depois de medir a bacia no QGIS (encontros 5 e 6).",
        "Jogo de hierarquia fluvial: para treinar Strahler e Shreve (encontro 2).",
        "Sinuosidade: para comparar um trecho natural com um retificado (encontro 7).",
        "Simulador: para ver a delimitação e a morfometria acontecendo (encontros 3, 4 e 6)."
      ]
    },
    calculadora: {
      titulo: "Como usar a Calculadora",
      passos: [
        "Cada coluna é uma bacia. Troque os nomes no topo (ex.: Ipiranga e Teixeiras).",
        "Preencha as medidas que você obteve no QGIS. Embaixo de cada medida há uma dica de onde encontrá-la.",
        "Pode usar vírgula ou ponto. Campos vazios são ignorados: o índice que depende deles não aparece.",
        "Os índices aparecem abaixo da tabela, já com a leitura (ex.: 'próxima de circular: alta tendência a cheias').",
        "Sem dados do QGIS ainda? Guarde duas bacias no Simulador e toque em 'Preencher com as bacias A e B do simulador'."
      ],
      dica: "Tudo precisa estar em SIRGAS 2000 / UTM 23S (EPSG:31983). Se a área der algo como 0,0003, a camada está em graus."
    },
    jogo: {
      titulo: "Como jogar",
      passos: [
        "A figura é uma rede de drenagem: as bolinhas verdes no alto são nascentes e a água desce até o exutório, embaixo.",
        "Toque no círculo de um trecho para mudar o número (1, 2, 3...). Toque de novo para aumentar; depois do máximo, volta para 1.",
        "Comece pelas nascentes e desça até o exutório.",
        "Toque em 'Conferir': trechos certos ficam verdes, errados ficam vermelhos. Corrija e confira de novo.",
        "'Mudar para Shreve' troca a regra; 'Nova rede' sorteia outra rede."
      ],
      dica: "Strahler: dois de mesma ordem se unem → ordem + 1; ordens diferentes → vale a maior. Shreve: some os números que chegam na junção."
    },
    sinuosidade: {
      titulo: "Como calcular a sinuosidade",
      passos: [
        "Escolha dois trechos do Paraibuna: um natural (a montante) e um retificado (na área urbana).",
        "No QGIS ou no Google Earth, meça L: o comprimento do rio acompanhando as curvas.",
        "Meça Dv: a distância em linha reta entre o início e o fim do mesmo trecho.",
        "Digite L e Dv em km. O índice Is = L/Dv aparece com a classificação."
      ],
      dica: "Is perto de 1 = canal reto. Numa planície, isso raramente é natural: pode indicar retificação."
    },
    qgis: {
      titulo: "Como usar os roteiros",
      passos: [
        "Leia primeiro as 'Três armadilhas': elas evitam os erros que mais travam o laboratório.",
        "Toque no encontro para abrir o roteiro. Os passos estão na ordem em que você faz no QGIS.",
        "Marque cada passo concluído. O contador (ex.: 3/7 passos) fica salvo.",
        "Travou? Veja a tabela 'Problemas frequentes' no fim da página."
      ],
      dica: "Os caminhos de menu estão escritos como no QGIS em português: 'Raster → Análise → Declividade' quer dizer menu Raster, depois Análise, depois Declividade."
    },
    relatorio: {
      titulo: "Como entregar o relatório",
      passos: [
        "Confira abaixo o resumo: hipóteses, quizzes, passos do QGIS, experimentos e cálculos.",
        "'Imprimir / salvar PDF' abre a impressão do navegador: escolha 'Salvar como PDF'.",
        "'Baixar HTML' salva um arquivo que abre em qualquer navegador.",
        "'Exportar JSON' é uma cópia completa dos seus dados (use só se o professor pedir)."
      ],
      dica: "Os dados ficam só neste aparelho. Se trocar de celular ou limpar o navegador, eles se perdem: baixe o relatório ao fim de cada encontro."
    }
  }
};
