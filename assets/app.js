// Caminhos da Água — motor do app. Um arquivo, sem framework, sem build.
// ponytail: um único módulo em vez dos 7 arquivos do §10.2 da spec — o app ainda é pequeno
// o bastante para isso. Separar por tela quando o arquivo passar de ~800 linhas fizer sentido.
(function () {
  "use strict";

  // ---------- Modelo universal das seis camadas (o núcleo do produto, não do curso) ----------
  // perguntasGuia/licaoUrl podem ser sobrescritas pela missão importada (missao.camadas[id]),
  // para que outra universidade adapte sem tocar em código.
  var CAMADAS_PADRAO = [
    { id: 1, nome: "Sistema climático", caminho: "Caminho do clima",
      perguntasGuia: ["Quanto chove aqui, e principalmente quando?", "Que mecanismo climático traz essa chuva?", "O evento é excepcional frente à normal histórica da estação?"] },
    { id: 2, nome: "Ciclo hidrológico", caminho: "Caminho da água",
      perguntasGuia: ["Onde a chuva se divide: infiltra, escoa ou evapora?", "Quanto tempo a água leva até o canal?", "De onde vem a água do corpo hídrico na estiagem?"] },
    { id: 3, nome: "Solos, geologia e relevo", caminho: "Caminho do relevo",
      perguntasGuia: ["Qual a declividade das encostas que drenam para este trecho?", "O canal é encaixado ou tem planície de inundação?", "O substrato favorece infiltração profunda ou escoamento rápido?"] },
    { id: 4, nome: "Vegetação e ecossistemas", caminho: "Caminho dos ecossistemas",
      perguntasGuia: ["Qual a cobertura vegetal das margens deste trecho?", "Que faixa de proteção a lei exige aqui?", "O que se perde primeiro quando essa faixa desaparece?"] },
    { id: 5, nome: "Sociedade e economia", caminho: "Caminho da sociedade",
      perguntasGuia: ["Quem usa esta água, para quê, e em que volume?", "Quem ocupa a área de risco, e por quê?", "Quem sofre o dano — e quem produziu a condição para o dano?"] },
    { id: 6, nome: "Política, técnica e gestão", caminho: "Caminho da gestão",
      perguntasGuia: ["Que instrumento de gestão se aplica a este caso?", "Existe alerta e plano de contingência para este trecho?", "Quem está na mesa de decisão, e quem não está?"] }
  ];

  // Matriz de plausibilidade (§4.7 da spec) — não bloqueia, só marca "conexão incomum".
  var PLAUSIVEIS = {
    "miolo-1": 1, "miolo-3": 1, "miolo-4": 1, "miolo-5": 1, "miolo-6": 1,
    "1-2": 1, "1-4": 1, "1-5": 1,
    "2-3": 1, "2-5": 1, "2-miolo": 1,
    "3-2": 1, "3-4": 1, "3-5": 1, "3-miolo": 1,
    "4-1": 1, "4-2": 1, "4-3": 1, "4-miolo": 1,
    "5-1": 1, "5-2": 1, "5-3": 1, "5-4": 1, "5-6": 1, "5-miolo": 1,
    "6-2": 1, "6-3": 1, "6-4": 1, "6-5": 1, "6-miolo": 1
  };

  var TETO_EVIDENCIA_POR_CAMADA = 6;
  var TETO_CONEXAO_POR_PAR = 3;

  // Percurso curricular: cada modulo prepara uma habilidade usada na missao integradora.
  var MODULOS = [
    { id: "i1", unidade: "Unidade I", titulo: "Onde está a água?", foco: "Distribuição e disponibilidade hídrica", objetivo: "Distinguir a presença de água da disponibilidade de água para diferentes usos.", exemplo: "O Brasil possui muita água, mas essa água não está distribuída igualmente no território nem chega igualmente às pessoas.", desafio: "Escolha uma cidade e escreva uma diferença entre ter água no território e ter água disponível para a população.", pergunta: "Qual afirmação é mais adequada?", opcoes: ["Toda água existente está disponível para consumo.", "Disponibilidade depende de quantidade, qualidade, acesso e usos concorrentes.", "A água só é um problema em regiões desérticas."], correta: 1, feedback: "Disponibilidade é uma relação entre oferta, qualidade, acesso, infraestrutura e demandas." },
    { id: "i2", unidade: "Unidade I", titulo: "Águas superficiais e subterrâneas", foco: "Hidrologia básica", objetivo: "Reconhecer que rios, lagos, nascentes e aquíferos fazem parte de um sistema conectado.", exemplo: "A vazão de um rio na estiagem pode receber contribuição subterrânea, enquanto a impermeabilização reduz a recarga do solo.", desafio: "Observe seu bairro: indique um lugar onde a água infiltra e outro onde ela escoa rapidamente.", pergunta: "O que melhor descreve um aquífero?", opcoes: ["Uma camada ou formação que armazena e transmite água subterrânea.", "Qualquer poça formada depois da chuva.", "Somente a água presente em rios."], correta: 0, feedback: "Aquíferos são formações geológicas capazes de armazenar e transmitir água subterrânea." },
    { id: "i3", unidade: "Unidade I", titulo: "Do ciclo hidrológico ao hidrossocial", foco: "Água, natureza e sociedade", objetivo: "Explicar como processos físicos e decisões sociais reorganizam os caminhos da água.", exemplo: "Uma avenida, uma barragem ou uma rede de abastecimento altera tempos, volumes, acessos e riscos no ciclo da água.", desafio: "Complete: uma obra urbana muda o caminho da água porque...", pergunta: "O ciclo hidrossocial acrescenta ao ciclo hidrológico a análise de...", opcoes: ["Apenas a evaporação.", "Poder, infraestrutura, usos, conflitos e desigualdades.", "Somente a vida dos peixes."], correta: 1, feedback: "O ciclo hidrossocial evidencia que a água também é produzida, distribuída e disputada socialmente." },
    { id: "i4", unidade: "Unidade I", titulo: "Água, economia e geopolítica", foco: "Usos múltiplos, água virtual e conflitos", objetivo: "Relacionar consumo, produção, circulação de mercadorias e disputas pela água.", exemplo: "Um produto agrícola consumido longe de sua origem carrega água virtual e pode transferir pressões ambientais entre territórios.", desafio: "Escolha um produto cotidiano e formule uma pergunta sobre a água usada para produzi-lo.", pergunta: "Água virtual é...", opcoes: ["A água invisível na atmosfera.", "O volume de água usado direta e indiretamente na produção de um bem.", "A água subterrânea que não pode ser medida."], correta: 1, feedback: "Água virtual ajuda a enxergar relações entre produção, comércio, consumo e pressão hídrica." },
    { id: "ii1", unidade: "Unidade II", titulo: "A bacia como unidade de análise", foco: "Hierarquia fluvial e sistema hidrológico", objetivo: "Ler a bacia como área de contribuição e sistema de entradas, caminhos, armazenamentos e saídas.", exemplo: "O Rio Paraibuna reúne contribuições de afluentes e atravessa diferentes formas de ocupação até deixar a área de estudo.", desafio: "Desenhe com palavras o caminho de uma gota desde uma encosta até o rio principal.", pergunta: "Uma bacia hidrográfica é delimitada principalmente por...", opcoes: ["Divisores topográficos do relevo.", "Limites dos bairros.", "A extensão da rede de abastecimento."], correta: 0, feedback: "O divisor de águas separa áreas que drenam para saídas diferentes." },
    { id: "ii2", unidade: "Unidade II", titulo: "Delimitar e representar no SIG", foco: "MDE, bacia e perfil topográfico", objetivo: "Entender a sequência lógica da delimitação de uma bacia e da leitura do relevo em SIG.", exemplo: "No QGIS, um modelo digital de elevação permite identificar direção do fluxo, acumulação e o divisor da bacia.", desafio: "Ordene mentalmente: ponto de saída, direção do fluxo, acumulação, delimitação e conferência no mapa.", pergunta: "O que o perfil topográfico ajuda a interpretar?", opcoes: ["A variação de altitude ao longo de um trajeto.", "A qualidade química da água sozinho.", "O volume exato de chuva sem estação."], correta: 0, feedback: "O perfil mostra a forma do relevo ao longo de uma linha e apoia a interpretação do escoamento." },
    { id: "ii3", unidade: "Unidade II", titulo: "Medir a água", foco: "Pluviometria, fluviometria e vazão", objetivo: "Diferenciar chuva, nível, velocidade e vazão e reconhecer o papel das séries de dados.", exemplo: "Uma régua de nível não mede diretamente a vazão; é preciso relacionar nível e descarga por uma curva-chave ou medição apropriada.", desafio: "Liste dois dados que você coletaria antes de comparar a resposta de dois córregos.", pergunta: "Vazão corresponde a...", opcoes: ["Volume de água que passa por uma seção por unidade de tempo.", "Altura da margem acima do mar.", "Quantidade de lixo visível na água."], correta: 0, feedback: "Vazão é uma grandeza de fluxo, geralmente expressa em m³/s ou L/s." },
    { id: "ii4", unidade: "Unidade II", titulo: "Comparar bacias", foco: "Análise morfométrica", objetivo: "Usar forma, área, perímetro, hierarquia e relevo para comparar respostas hidrológicas.", exemplo: "Bacias menores, íngremes e com menor infiltração podem responder mais rapidamente a chuvas intensas, mas a interpretação depende do conjunto de fatores.", desafio: "Explique por que um único índice morfométrico não basta para prever uma inundação.", pergunta: "A morfometria serve para...", opcoes: ["Descrever e comparar características geométricas e do relevo da bacia.", "Substituir toda observação de campo.", "Definir sozinha quem tem direito à água."], correta: 0, feedback: "Índices são evidências úteis, mas precisam ser articulados a clima, uso do solo, solos, rede e sociedade." },
    { id: "ii5", unidade: "Unidade II", titulo: "Quem decide sobre a água?", foco: "Lei das Águas e gestão participativa", objetivo: "Reconhecer instrumentos, atores e conflitos na governança das águas.", exemplo: "Comitês de bacia reúnem usuários, poder público e sociedade civil para discutir problemas e prioridades de gestão.", desafio: "Escolha um conflito hídrico e identifique três atores que deveriam participar da decisão.", pergunta: "A gestão participativa busca...", opcoes: ["Concentrar toda decisão em um único usuário.", "Articular diferentes interesses e responsabilidades na bacia.", "Eliminar a necessidade de dados."], correta: 1, feedback: "Participação não elimina conflitos; cria espaço institucional para debatê-los com informação e responsabilidade." },
    { id: "ii-lab", unidade: "Unidade II", tipo: "laboratorio", titulo: "Laboratório da Bacia", foco: "Simular cenários e observar respostas do sistema", objetivo: "Manipular condições do território e comparar como a bacia responde a diferentes combinações de chuva, urbanização, margens e gestão.", exemplo: "Uma mesma chuva pode produzir respostas distintas quando mudam a infiltração, a ocupação e a preparação do território.", desafio: "Crie dois cenários: um com alto risco e outro com maior segurança. Explique o que mudou.", pergunta: "O laboratório é uma simplificação para formular hipóteses, não uma previsão automática.", opcoes: ["Verdadeiro: o modelo ajuda a pensar relações e deve ser confrontado com dados reais.", "Falso: o resultado substitui trabalho de campo e dados históricos.", "Verdadeiro: qualquer combinação representa uma medição real."], correta: 0, feedback: "Modelos didáticos ajudam a raciocinar sobre mecanismos, mas precisam ser confrontados com observações e dados." },
    { id: "ii6", unidade: "Unidade II", titulo: "Investigar em campo", foco: "Observação, amostragem e caderno de campo", objetivo: "Planejar uma observação que conecte hipótese, local, dado, registro e interpretação.", exemplo: "No Paraibuna e nos córregos Ipiranga e Teixeiras, a comparação entre pontos pode revelar diferenças de margem, uso do solo e qualidade da água.", desafio: "Escreva uma hipótese testável para dois pontos do mesmo curso d'água.", pergunta: "Uma boa hipótese de campo deve ser...", opcoes: ["Impossível de verificar.", "Clara, localizada e relacionada a evidências observáveis.", "Apenas uma opinião sem relação com o lugar."], correta: 1, feedback: "A hipótese orienta o que observar e pode ser revista quando os dados contradizem a expectativa." },
    { id: "iii1", unidade: "Unidade III", titulo: "Ler a qualidade da água", foco: "Parâmetros e indicadores", objetivo: "Interpretar pH, temperatura, turbidez, condutividade e outros indicadores sem reduzir a qualidade a um único número.", exemplo: "Turbidez elevada pode indicar sedimentos, mas sua causa precisa ser relacionada a chuva, erosão, obras, margens e usos do solo.", desafio: "Escolha dois parâmetros e explique por que observá-los juntos é mais informativo.", pergunta: "Um indicador de qualidade deve ser interpretado...", opcoes: ["Sem contexto, sempre da mesma maneira.", "Com método, referência, local, data e demais evidências.", "Apenas pela cor da água."], correta: 1, feedback: "O significado de uma medida depende do método e do contexto físico e social da coleta." },
    { id: "iii2", unidade: "Unidade III", titulo: "Saneamento e poluição", foco: "Escoamento urbano e saúde", objetivo: "Relacionar infraestrutura, poluição difusa, esgoto e desigualdade socioambiental.", exemplo: "A chuva pode carregar sedimentos, óleo e resíduos das ruas para os canais; a ausência de saneamento adiciona outra pressão ao sistema.", desafio: "Mapeie uma fonte potencial de poluição e uma ação preventiva possível.", pergunta: "O escoamento superficial urbano tende a...", opcoes: ["Carregar materiais da superfície para a drenagem e os corpos d'água.", "Impedir qualquer poluente de chegar ao rio.", "Acontecer somente em áreas rurais."], correta: 0, feedback: "A drenagem conecta superfícies urbanas aos canais, especialmente durante chuvas intensas." },
    { id: "iii3", unidade: "Unidade III", titulo: "Cheias, secas e mudanças climáticas", foco: "Risco e vulnerabilidade", objetivo: "Diferenciar perigo, exposição, vulnerabilidade e risco na análise de eventos extremos.", exemplo: "A mesma chuva pode produzir impactos diferentes conforme a impermeabilização, a ocupação da várzea, a qualidade da drenagem e a capacidade de resposta.", desafio: "Explique por que uma chuva intensa não causa o mesmo dano em todos os bairros.", pergunta: "Risco hidrológico resulta da relação entre...", opcoes: ["Perigo, exposição e vulnerabilidade.", "Apenas volume de chuva.", "Somente altitude."], correta: 0, feedback: "O evento físico importa, mas o risco também depende de quem está exposto e de suas condições de proteção e resposta." },
    { id: "iii4", unidade: "Unidade III", titulo: "Comunicar uma análise", foco: "Pôster, laudo e defesa do estudo de caso", objetivo: "Transformar dados e argumentos em uma comunicação científica clara para públicos diferentes.", exemplo: "O projeto final deve explicar a dinâmica do Paraibuna e afluentes articulando mapa, dados hidrológicos, qualidade da água, ocupação e risco.", desafio: "Escreva uma frase de conclusão que una evidência, mecanismo e consequência.", pergunta: "Uma boa conclusão deve...", opcoes: ["Repetir o título sem evidência.", "Responder à pergunta com dados, limites e implicações.", "Esconder resultados que contradizem a hipótese."], correta: 1, feedback: "Comunicação científica mostra como se chegou à conclusão e reconhece limites da análise." }
  ];

  var NIVEIS = [
    { n: 1, titulo: "Observador de campo", req: function (d) { return !!d.hipoteseInicial && contarEvidencias(d) >= 3; } },
    { n: 2, titulo: "Investigador de camada", req: function (d) { return camadasComEvidencia(d).length >= 4; } },
    { n: 3, titulo: "Cartógrafo de conexões", req: function (d) { return conexoesSustentadas(d).length >= 5 && paresDistintos(d) >= 3; } },
    { n: 4, titulo: "Analista de sistema", req: function (d) { return conexoesSustentadas(d).length >= 1 && d.conexoes.some(function (c) { return c.origem === "miolo" && conexaoSustentada(c); }); } },
    { n: 5, titulo: "Gestor proponente", req: function (d) { return !!(d.sintese && d.sintese.texto) && !!(d.acao && d.acao.limitacao) && !!(d.revisao && d.revisao.oQueMudou); } }
  ];

  // ---------- Persistência ----------
  function uid() { return "id-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function nowIso() { return new Date().toISOString(); }

  function getAluno() { try { return JSON.parse(localStorage.getItem("cda:aluno") || "null"); } catch (e) { return null; } }
  function setAluno(a) { localStorage.setItem("cda:aluno", JSON.stringify(a)); }

  function getMissao() { try { return JSON.parse(localStorage.getItem("cda:missao") || "null"); } catch (e) { return null; } }
  function setMissao(m) { localStorage.setItem("cda:missao", JSON.stringify(m)); }

  function dossieVazio() {
    return { hipoteseInicial: null, evidencias: [], conexoes: [], sintese: { texto: "" }, acao: {}, revisao: {} };
  }
  function getDossie() {
    try { return JSON.parse(localStorage.getItem("cda:dossie") || "null") || dossieVazio(); }
    catch (e) { return dossieVazio(); }
  }
  function setDossie(d) { localStorage.setItem("cda:dossie", JSON.stringify(d)); }
  function salvarBackup(d) {
    // ponytail: um backup simples sobrescrito, não histórico completo (§10.4) — suficiente
    // para não perder o dossiê entre o campo e a entrega; histórico fica para a v1.0.
    localStorage.setItem("cda:dossie:backup", JSON.stringify({ em: nowIso(), dossie: d }));
  }

  function modulosConcluidos() {
    try { return JSON.parse(localStorage.getItem("cda:modulos") || "[]"); } catch (e) { return []; }
  }
  function getRespostaDesafio(moduloId) {
    try { return JSON.parse(localStorage.getItem("cda:desafios") || "{}")[moduloId] || ""; } catch (e) { return ""; }
  }
  function setRespostaDesafio(moduloId, texto) {
    var todas; try { todas = JSON.parse(localStorage.getItem("cda:desafios") || "{}"); } catch (e) { todas = {}; }
    todas[moduloId] = texto;
    localStorage.setItem("cda:desafios", JSON.stringify(todas));
  }
  function marcarModulo(id) {
    var feitos = modulosConcluidos();
    if (feitos.indexOf(id) < 0) feitos.push(id);
    localStorage.setItem("cda:modulos", JSON.stringify(feitos));
  }
  function laboratorioVazio() { return { chuva: 2, cidade: 2, margens: 2, gestao: 1 }; }
  function getLaboratorio() {
    try { return Object.assign(laboratorioVazio(), JSON.parse(localStorage.getItem("cda:laboratorio") || "{}")); }
    catch (e) { return laboratorioVazio(); }
  }
  function setLaboratorio(c) { localStorage.setItem("cda:laboratorio", JSON.stringify(c)); }
  function limitar(n) { return Math.max(0, Math.min(100, Math.round(n))); }
  function resultadoLaboratorio(c) {
    var escoamento = limitar(25 + c.chuva * 18 + c.cidade * 14 - c.margens * 10 - c.gestao * 6);
    var infiltracao = limitar(78 - c.cidade * 15 + c.margens * 11 + c.gestao * 4);
    var qualidade = limitar(86 - c.cidade * 14 - c.chuva * 5 + c.margens * 12 + c.gestao * 5);
    var risco = limitar(18 + c.chuva * 19 + c.cidade * 13 - c.margens * 8 - c.gestao * 10);
    return { escoamento: escoamento, infiltracao: infiltracao, qualidade: qualidade, risco: risco };
  }

  // ---------- Utilidades de domínio ----------
  function camadas() {
    var m = getMissao();
    return CAMADAS_PADRAO.map(function (c) {
      var override = m && m.camadas && m.camadas[c.id];
      return override ? Object.assign({}, c, override) : c;
    });
  }
  function camadaPorId(id) { return camadas().filter(function (c) { return String(c.id) === String(id); })[0]; }
  function nodeNome(node) {
    if (node === "miolo") { var m = getMissao(); return m && m.bacia ? m.bacia.nome : "o objeto hidrográfico"; }
    var c = camadaPorId(node); return c ? c.nome : node;
  }

  function cartasDaCamada(camadaId) {
    var m = getMissao();
    if (!m || !m.cartas) return [];
    return m.cartas.filter(function (c) { return String(c.camadaId) === String(camadaId); });
  }

  function evidenciasDaCamada(d, camadaId) {
    return d.evidencias.filter(function (e) { return String(e.camadaId) === String(camadaId); });
  }
  function contarEvidencias(d) { return d.evidencias.length; }
  function camadasComEvidencia(d) {
    var s = {}; d.evidencias.forEach(function (e) { s[e.camadaId] = 1; }); return Object.keys(s);
  }
  function conexaoSustentada(c) { return !!(c.evidenciaOrigemId && c.evidenciaDestinoId); }
  function conexoesSustentadas(d) { return d.conexoes.filter(conexaoSustentada); }
  function paresDistintos(d) {
    var s = {}; conexoesSustentadas(d).forEach(function (c) { s[[c.origem, c.destino].sort().join("|")] = 1; });
    return Object.keys(s).length;
  }
  function plausivel(origem, destino) { return !!PLAUSIVEIS[origem + "-" + destino]; }
  function dentroFora(c) { return c.origem === "miolo"; }

  // ---------- Pontuação (sempre recalculada — invariante 8 da spec) ----------
  function calcularPontos(d) {
    var porTipo = { evidencia: 0, conexao: 0, hipotese: 0, revisao: 0, sintese: 0, acao: 0 };

    var porCamada = {};
    d.evidencias.forEach(function (e) {
      porCamada[e.camadaId] = porCamada[e.camadaId] || 0;
      if (porCamada[e.camadaId] < TETO_EVIDENCIA_POR_CAMADA) {
        var completa = e.oQueVejo && e.oQueIndica && e.confianca;
        if (completa) porTipo.evidencia += e.propria ? 12 : 8;
      }
      porCamada[e.camadaId]++;
    });

    var porPar = {};
    d.conexoes.forEach(function (c) {
      var chave = [c.origem, c.destino].sort().join("|");
      porPar[chave] = porPar[chave] || 0;
      if (porPar[chave] < TETO_CONEXAO_POR_PAR) {
        if (conexaoSustentada(c)) porTipo.conexao += dentroFora(c) ? 25 : 15;
        else if (c.mecanismo) porTipo.conexao += 5;
      }
      porPar[chave]++;
    });

    if (d.hipoteseInicial && d.hipoteseInicial.texto) porTipo.hipotese += 10;
    if (d.revisao && d.revisao.oQueMudou && d.revisao.porque) porTipo.revisao += 20;
    if (d.sintese && d.sintese.texto && conexoesSustentadas(d).length >= 3) porTipo.sintese += 40;
    if (d.acao && d.acao.limitacao) porTipo.acao += 25;

    var total = Object.keys(porTipo).reduce(function (s, k) { return s + porTipo[k]; }, 0);
    var nivel = 0;
    NIVEIS.forEach(function (nv) { if (nv.req(d)) nivel = nv.n; });
    return { porTipo: porTipo, total: total, nivel: nivel };
  }

  // ---------- Roteador (app.html) ----------
  var ROTAS = {};
  function rota(nome, fn) { ROTAS[nome] = fn; }
  function navegar(hash) { location.hash = hash; }
  function rotearAgora() {
    var view = document.getElementById("view");
    if (!view) return;
    var hash = location.hash.replace(/^#\/?/, "") || "cebola";
    var partes = hash.split("/");
    var fn = ROTAS[partes[0]];
    marcarTabAtiva(partes[0]);
    view.innerHTML = "";
    if (!getMissao()) { view.innerHTML = '<p class="evidencia-status">Nenhuma missão carregada. <a href="index.html">Voltar à tela inicial.</a></p>'; return; }
    if (fn) fn(partes.slice(1), view); else ROTAS.cebola([], view);
  }
  function marcarTabAtiva(nome) {
    document.querySelectorAll("nav.tabs button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.rota === nome);
      if (b.dataset.rota === nome) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    var view = document.getElementById("view");
    if (view) view.focus({ preventScroll: true });
  }
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function textoSeguro(valor) {
    return String(valor || "").replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }
  function nomeArquivo(texto) {
    return String(texto || "relatorio").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "relatorio";
  }
  function dataCurta(iso) {
    var data = iso ? new Date(iso) : new Date();
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function cartaPorId(id) {
    var m = getMissao();
    return m && m.cartas ? m.cartas.filter(function (c) { return c.id === id; })[0] : null;
  }
  function tituloEvidencia(e) {
    var carta = e && e.cartaId ? cartaPorId(e.cartaId) : null;
    return e && e.titulo || carta && carta.titulo || "Evidência";
  }
  function evidenciaPorId(d, id) {
    return d.evidencias.filter(function (e) { return e.id === id; })[0] || null;
  }

  // ---------- T3 · Cebola porosa ----------
  function renderCebola(_args, view) {
    var d = getDossie();
    var m = getMissao();
    var pts = calcularPontos(d);
    view.appendChild(el("p", { class: "eyebrow", text: "Missão em andamento" }));
    view.appendChild(el("h2", { text: m.titulo }));
    view.appendChild(el("p", { class: "lede", text: m.perguntaProblema || "Investigue os caminhos da água neste território." }));
    view.appendChild(el("div", { class: "card mission-context" }, [
      el("p", { class: "eyebrow", text: "Seu desafio" }),
      el("p", { text: m.contexto || "Observe as evidências, conecte as camadas e construa uma explicação." }),
      el("p", { class: "evidencia-status", text: "Progresso: " + d.evidencias.filter(function (e) { return !e.descartada; }).length + " evidências · " + conexoesSustentadas(d).length + " conexões · " + pts.total + " pontos" })
    ]));
    view.appendChild(el("h3", { text: "Seu percurso" }));
    view.appendChild(el("div", { class: "guided-path" }, [
      etapaResumo(1, "Observar", "Analise as evidências selecionadas.", "#/etapa/1", d.evidencias.length >= 1),
      etapaResumo(2, "Conectar", "Ligue causas e consequências.", "#/etapa/2", conexoesSustentadas(d).length >= 1),
      etapaResumo(3, "Explicar", "Escreva uma síntese e proponha uma ação.", "#/etapa/3", !!(d.sintese && d.sintese.texto))
    ]));
    view.appendChild(el("h3", { text: "Mapa da investigação" }));
    view.appendChild(svgCebola(d));
    view.appendChild(el("p", { class: "evidencia-status center-text", text: "A cebola porosa mostra as relações que você construiu entre o território e o rio." }));
  }

  function etapaResumo(numero, titulo, texto, rotaDestino, concluida) {
    return el("a", { class: "guided-step" + (concluida ? " done" : ""), href: rotaDestino }, [
      el("span", { class: "guided-number", text: concluida ? "✓" : String(numero), "aria-hidden": "true" }),
      el("span", {}, [el("strong", { text: titulo }), el("small", { text: texto })]),
      el("span", { class: "guided-arrow", text: "→", "aria-hidden": "true" })
    ]);
  }

  // ---------- Percurso da disciplina ----------
  function renderCurso(_args, view) {
    var feitos = modulosConcluidos();
    var total = MODULOS.length;
    view.appendChild(el("p", { class: "eyebrow", text: "Percurso da disciplina" }));
    view.appendChild(el("h2", { text: "Hidrogeografia em movimento" }));
    view.appendChild(el("p", { class: "lede", text: "Aprenda os conceitos, teste ideias e use tudo na investigação do Paraibuna. Você pode avançar no seu ritmo." }));
    view.appendChild(el("div", { class: "card course-summary" }, [
      el("p", { class: "pill", text: feitos.length + " de " + total + " módulos" }),
      el("p", { text: "O percurso começa nos fundamentos, passa pela bacia e pelo campo e chega à qualidade da água, aos riscos e à comunicação científica." }),
      el("div", { class: "guided-progress", "aria-label": "Progresso do percurso" }, [el("span", { style: "width: " + (feitos.length / total * 100) + "%" })])
    ]));
    var unidades = {
      "Unidade I": { nome: "Ler a água", texto: "Comece pelo planeta, pelo ciclo e pelas disputas que dão sentido à água." },
      "Unidade II": { nome: "Investigar a bacia", texto: "Desça do mapa para o relevo, os instrumentos, o campo e as decisões." },
      "Unidade III": { nome: "Cuidar do território", texto: "Interprete qualidade, saneamento e risco para comunicar uma ação possível." }
    };
    ["Unidade I", "Unidade II", "Unidade III"].forEach(function (unidade, unidadeIndex) {
      var itens = MODULOS.filter(function (m) { return m.unidade === unidade; });
      var completos = itens.filter(function (m) { return feitos.indexOf(m.id) >= 0; }).length;
      view.appendChild(el("section", { class: "unit-journey" }, [
        el("div", { class: "unit-heading" }, [el("span", { class: "unit-marker", text: String(unidadeIndex + 1) }), el("div", {}, [el("p", { class: "eyebrow", text: unidade }), el("h3", { text: unidades[unidade].nome }), el("p", { class: "helper-text", text: unidades[unidade].texto })]), el("span", { class: "unit-count", text: completos + "/" + itens.length })]),
        el("div", { class: "module-list" }, itens.map(function (m, moduleIndex) {
        var done = feitos.indexOf(m.id) >= 0;
        return el("a", { class: "module-item" + (done ? " done" : ""), href: "#/modulo/" + m.id }, [
          el("span", { class: "module-number", text: done ? "✓" : String(moduleIndex + 1), "aria-hidden": "true" }),
          el("span", {}, [el("strong", { text: m.titulo }), el("small", { text: m.foco }), m.tipo === "laboratorio" ? el("span", { class: "module-tag", text: "experiência prática" }) : null]),
          el("span", { class: "guided-arrow", text: "→", "aria-hidden": "true" })
        ]);
      }))
      ]));
    });
    view.appendChild(el("div", { class: "card mission-context" }, [
      el("p", { class: "eyebrow", text: "Projeto integrador" }),
      el("p", { text: "Depois dos módulos, entre na Missão para analisar uma situação real, registrar evidências, conectar camadas e gerar seu relatório final." }),
      el("button", { class: "primary", text: "Ir para a missão", onclick: function () { navegar("#/cebola"); } })
    ]));
  }

  function renderLaboratorio(_args, view, modulo) {
    var c = getLaboratorio();
    var r = resultadoLaboratorio(c);
    view.appendChild(el("p", { class: "eyebrow", text: modulo ? modulo.unidade + " · Módulo prático" : "Laboratório da Bacia" }));
    view.appendChild(el("h2", { text: "E se o território mudasse?" }));
    view.appendChild(el("p", { class: "lede", text: "Faça uma hipótese com as mãos: ajuste quatro condições e observe o sistema responder. O modelo é uma lente de investigação, não uma previsão real." }));
    view.appendChild(el("div", { class: "card lab-brief" }, [
      el("p", { class: "pill", text: "desafio" }),
      el("h3", { text: "Crie uma bacia mais segura" }),
      el("p", { text: "Reduza o risco sem eliminar a chuva. Que combinação de ações mantém água no território, protege a qualidade e diminui a exposição?" })
    ]));
    var controls = el("div", { class: "card lab-controls" });
    controls.appendChild(el("h3", { text: "Monte o cenário" }));
    var campos = [
      ["chuva", "Intensidade da chuva", ["baixa", "moderada", "intensa"]],
      ["cidade", "Urbanização e impermeabilização", ["baixa", "média", "alta"]],
      ["margens", "Vegetação e proteção das margens", ["degradada", "em recuperação", "protegida"]],
      ["gestao", "Gestão e preparação", ["reativa", "planejada", "integrada"]]
    ];
    campos.forEach(function (campo) {
      var row = el("div", { class: "lab-control" });
      var label = el("label", { text: campo[1] });
      var value = el("output", { text: campo[2][c[campo[0]] - 1] });
      label.appendChild(value);
      var input = el("input", { type: "range", min: "1", max: "3", step: "1", value: String(c[campo[0]]), "aria-label": campo[1] });
      input.addEventListener("input", function () { c[campo[0]] = Number(input.value); value.textContent = campo[2][c[campo[0]] - 1]; atualizarLaboratorio(); });
      row.appendChild(label); row.appendChild(input); controls.appendChild(row);
    });
    view.appendChild(controls);
    var painel = el("div", { class: "lab-results" });
    view.appendChild(painel);
    function barra(titulo, valor, classe, explicacao) {
      var item = el("div", { class: "lab-result" });
      item.appendChild(el("div", { class: "lab-result-head" }, [el("strong", { text: titulo }), el("span", { text: valor + "/100" })]));
      item.appendChild(el("div", { class: "lab-meter" }, [el("span", { class: classe, style: "width: " + valor + "%" })]));
      item.appendChild(el("small", { text: explicacao }));
      return item;
    }
    function atualizarLaboratorio() {
      setLaboratorio(c); r = resultadoLaboratorio(c); painel.innerHTML = "";
      painel.appendChild(el("div", { class: "card lab-results-card" }, [
        el("p", { class: "pill", text: "resposta do sistema" }),
        barra("Escoamento superficial", r.escoamento, "meter-warm", "Quanto maior, mais água chega rapidamente aos canais."),
        barra("Infiltração e armazenamento", r.infiltracao, "meter-blue", "Maior infiltração ajuda a retardar o escoamento e sustentar a estiagem."),
        barra("Qualidade potencial", r.qualidade, "meter-green", "Uma leitura comparativa influenciada por cobertura, chuva e gestão."),
        barra("Risco hidrológico", r.risco, "meter-coral", "Combinação simplificada de perigo, exposição e vulnerabilidade."),
        el("p", { class: "lab-reading", text: leituraLaboratorio(r) })
      ]));
      painel.appendChild(el("div", { class: "step-actions" }, [
        el("button", { class: "secondary", text: "Salvar cenário no diário", onclick: salvarCenario }),
        el("button", { class: "primary", text: "Levar hipótese à missão", onclick: function () { navegar("#/cebola"); } })
      ]));
      var diarios = getCenarios();
      if (diarios.length) {
        painel.appendChild(el("h3", { text: "Diário de cenários" }));
        diarios.slice(0, 3).forEach(function (item) { painel.appendChild(el("div", { class: "scenario-log card" }, [el("strong", { text: item.nome }), el("small", { text: "Risco " + item.resultado.risco + "/100 · infiltração " + item.resultado.infiltracao + "/100" })])); });
      }
    }
    function salvarCenario() {
      var lista = getCenarios();
      lista.unshift({ nome: "Cenário " + (lista.length + 1), resultado: resultadoLaboratorio(c), criadoEm: nowIso() });
      localStorage.setItem("cda:cenarios", JSON.stringify(lista.slice(0, 8)));
      marcarModulo("ii-lab");
      atualizarLaboratorio();
    }
    atualizarLaboratorio();
  }
  function getCenarios() { try { return JSON.parse(localStorage.getItem("cda:cenarios") || "[]"); } catch (e) { return []; } }
  function leituraLaboratorio(r) {
    if (r.risco >= 65) return "Este cenário concentra uma resposta rápida e maior risco. Investigue qual camada está pressionando o sistema e quem está mais exposto.";
    if (r.infiltracao >= 65 && r.qualidade >= 65) return "Este cenário retém mais água e protege melhor a qualidade. Pergunte quais políticas e usos do solo tornariam isso possível.";
    return "O sistema está em uma condição intermediária. Compare este cenário com outro e procure a combinação que explica a diferença.";
  }

  function renderModulo(args, view) {
    var modulo = MODULOS.filter(function (m) { return m.id === args[0]; })[0];
    if (!modulo) { renderCurso([], view); return; }
    if (modulo.tipo === "laboratorio") return renderLaboratorio([], view, modulo);
    var feitos = modulosConcluidos();
    var respondida = null;
    view.appendChild(el("p", { class: "eyebrow", text: modulo.unidade + " · Módulo " + modulo.id.toUpperCase() }));
    view.appendChild(el("h2", { text: modulo.titulo }));
    view.appendChild(el("p", { class: "lede", text: modulo.foco }));
    view.appendChild(el("div", { class: "card module-lesson" }, [
      el("p", { class: "pill", text: "ideia-chave" }),
      el("p", { text: modulo.objetivo }),
      el("h3", { text: "Exemplo para pensar" }),
      el("p", { text: modulo.exemplo })
    ]));

    var desafioCard = el("div", { class: "card module-desafio" });
    desafioCard.appendChild(el("p", { class: "pill", text: "desafio" }));
    desafioCard.appendChild(el("h3", { text: "Escreva antes de conferir" }));
    desafioCard.appendChild(el("p", { class: "helper-text", text: modulo.desafio }));
    var campoResposta = el("textarea", { "aria-label": "Sua resposta ao desafio", placeholder: "Escreva sua resposta em poucas linhas..." });
    campoResposta.value = getRespostaDesafio(modulo.id);
    campoResposta.addEventListener("input", function () { setRespostaDesafio(modulo.id, campoResposta.value); });
    desafioCard.appendChild(campoResposta);
    var btnComparar = el("button", { class: "primary", text: "Comparar com a leitura de referência" });
    desafioCard.appendChild(btnComparar);
    view.appendChild(desafioCard);

    var quiz = el("div", { class: "card module-quiz hidden" });
    quiz.appendChild(el("p", { class: "pill", text: "confronto" }));
    quiz.appendChild(el("p", { class: "helper-text", text: "Agora compare sua resposta com a leitura que a disciplina sustenta." }));
    quiz.appendChild(el("h3", { text: modulo.pergunta }));
    var options = el("div", { class: "quiz-options" });
    modulo.opcoes.forEach(function (opcao, i) {
      var b = el("button", { class: "secondary quiz-option", text: opcao });
      b.addEventListener("click", function () {
        options.querySelectorAll("button").forEach(function (item) { item.disabled = true; });
        var acerto = i === modulo.correta;
        b.classList.add(acerto ? "quiz-correct" : "quiz-wrong");
        quiz.appendChild(el("p", { class: acerto ? "quiz-feedback correct" : "quiz-feedback wrong", text: (acerto ? "Sua leitura confere. " : "Vale ajustar sua resposta acima. ") + modulo.feedback }));
        if (acerto) { marcarModulo(modulo.id); quiz.appendChild(el("button", { class: "primary", text: "Marcar módulo como concluído", onclick: function () { navegar("#/curso"); } })); }
      });
      options.appendChild(b);
    });
    quiz.appendChild(options);
    if (feitos.indexOf(modulo.id) >= 0) quiz.appendChild(el("p", { class: "quiz-feedback correct", text: "Módulo concluído. Você pode revisitar este conteúdo quando quiser." }));
    btnComparar.addEventListener("click", function () { quiz.classList.remove("hidden"); quiz.scrollIntoView({ behavior: "smooth", block: "start" }); });
    view.appendChild(quiz);
    var idx = MODULOS.indexOf(modulo);
    var proximo = MODULOS[idx + 1];
    view.appendChild(el("div", { class: "step-actions" }, [
      el("button", { class: "secondary", text: "Voltar ao percurso", onclick: function () { navegar("#/curso"); } }),
      proximo ? el("button", { class: "primary", text: "Próximo módulo", onclick: function () { navegar("#/modulo/" + proximo.id); } }) : el("button", { class: "primary", text: "Ir para a missão", onclick: function () { navegar("#/cebola"); } })
    ]));
  }

  function renderEtapa(args, view) {
    var etapa = Number(args[0]) || 1;
    if (etapa === 1) return renderEtapaEvidencias(view);
    if (etapa === 2) return renderEtapaConexoes(view);
    renderEtapaSintese(view);
  }

  function cabecalhoEtapa(view, numero, titulo, texto) {
    view.appendChild(el("p", { class: "eyebrow", text: "Etapa " + numero + " de 3" }));
    view.appendChild(el("h2", { text: titulo }));
    view.appendChild(el("p", { class: "lede", text: texto }));
    view.appendChild(el("div", { class: "guided-progress", "aria-label": "Etapa " + numero + " de 3" }, [el("span", { style: "width: " + (numero / 3 * 100) + "%" })]));
  }

  function renderEtapaEvidencias(view) {
    var d = getDossie();
    cabecalhoEtapa(view, 1, "Observe as evidências", "Escolha pelo menos três cartas. Para cada uma, escreva o que você percebe e que consequência ela sugere.");
    if (!d.hipoteseInicial) { view.appendChild(hipoteseGuiada(d)); return; }
    var m = getMissao();
    var ids = ["c1", "c4", "c5", "c6", "c10"];
    var cartas = (m.cartas || []).filter(function (carta) { return ids.indexOf(carta.id) >= 0; });
    cartas.forEach(function (carta) { view.appendChild(cartaGuiada(carta, d)); });
    view.appendChild(el("div", { class: "step-actions" }, [
      el("button", { class: "secondary", text: "Voltar à missão", onclick: function () { navegar("#/cebola"); } }),
      el("button", { class: "primary", text: "Continuar para conexões", onclick: function () { navegar("#/etapa/2"); } })
    ]));
  }

  function hipoteseGuiada(d) {
    var wrap = el("div", { class: "card" });
    wrap.appendChild(el("p", { class: "helper-text", text: "Antes de ver as evidências: o que você acha que explica o problema? Depois de registrar, isso fica congelado — você só vai revê-lo na etapa de explicação." }));
    var ta = el("textarea", { rows: 4, placeholder: "Minha hipótese inicial é..." });
    var btn = el("button", { class: "primary", text: "Congelar hipótese e ver as evidências" });
    btn.addEventListener("click", function () {
      if (!ta.value.trim()) { alert("Escreva uma hipótese antes de continuar."); return; }
      d.hipoteseInicial = { texto: ta.value.trim(), criadoEm: nowIso() };
      setDossie(d); salvarBackup(d); rotearAgora();
    });
    wrap.appendChild(ta); wrap.appendChild(btn);
    return wrap;
  }

  function cartaGuiada(carta, d) {
    var registrada = d.evidencias.some(function (e) { return e.cartaId === carta.id && !e.descartada; });
    var wrap = el("article", { class: "evidence-choice" });
    wrap.appendChild(el("div", { class: "evidence-choice-top" }, [
      el("span", { class: "pill", text: carta.tipo }),
      registrada ? el("span", { class: "pill", text: "registrada" }) : null
    ]));
    wrap.appendChild(el("h3", { text: carta.titulo }));
    wrap.appendChild(el("p", { class: "evidencia-status", text: carta.perguntaQueResponde || "O que esta evidência ajuda a entender?" }));
    if (registrada) return wrap;
    var btn = el("button", { class: "secondary", text: "Analisar esta evidência" });
    btn.addEventListener("click", function () {
      wrap.appendChild(el("p", { class: "helper-text", text: carta.conteudo || "Observe a carta e registre sua interpretação." }));
      var vejo = el("textarea", { rows: 2, placeholder: "O que você percebe?" });
      var indica = el("textarea", { rows: 2, placeholder: "Que consequência isso sugere?" });
      var salvar = el("button", { class: "primary", text: "Salvar observação" });
      salvar.addEventListener("click", function () {
        if (!vejo.value.trim() || !indica.value.trim()) { alert("Preencha as duas observações para continuar."); return; }
        d.evidencias.push({ id: uid(), camadaId: carta.camadaId, cartaId: carta.id, propria: false, oQueVejo: vejo.value.trim(), oQueIndica: indica.value.trim(), confianca: "media", criadoEm: nowIso() });
        setDossie(d); salvarBackup(d); rotearAgora();
      });
      btn.remove(); wrap.appendChild(vejo); wrap.appendChild(indica); wrap.appendChild(salvar);
    });
    wrap.appendChild(btn);
    return wrap;
  }

  function renderEtapaConexoes(view) {
    var d = getDossie();
    cabecalhoEtapa(view, 2, "Conecte as evidências", "Agora transforme observações em explicações. Escolha uma evidência de cada lado e confirme a relação sugerida.");
    var receitas = [
      { titulo: "Chuva intensa aumenta a resposta do rio", origem: 1, destino: 2, mecanismo: "A chuva intensa aumenta a entrada de água e pode elevar rapidamente a vazão." },
      { titulo: "Cidade impermeabilizada acelera o escoamento", origem: 5, destino: 2, mecanismo: "A impermeabilização reduz a infiltração e acelera a chegada da água ao canal." },
      { titulo: "Relevo e ocupação ampliam o risco", origem: 3, destino: 5, mecanismo: "A declividade e a ocupação de áreas baixas aproximam pessoas das áreas sujeitas à inundação." }
    ];
    receitas.forEach(function (receita) { view.appendChild(receitaConexao(receita, d)); });
    view.appendChild(el("div", { class: "step-actions" }, [
      el("button", { class: "secondary", text: "Voltar às evidências", onclick: function () { navegar("#/etapa/1"); } }),
      el("button", { class: "primary", text: "Continuar para síntese", onclick: function () { navegar("#/etapa/3"); } })
    ]));
  }

  function receitaConexao(receita, d) {
    var wrap = el("article", { class: "connection-choice card" });
    var origem = evidenciasDaCamada(d, receita.origem).filter(function (e) { return !e.descartada; });
    var destino = evidenciasDaCamada(d, receita.destino).filter(function (e) { return !e.descartada; });
    var existe = d.conexoes.some(function (c) { return c.origem === String(receita.origem) && c.destino === String(receita.destino) && c.mecanismo === receita.mecanismo; });
    wrap.appendChild(el("h3", { text: receita.titulo }));
    wrap.appendChild(el("p", { class: "evidencia-status", text: receita.mecanismo }));
    if (existe) { wrap.appendChild(el("span", { class: "pill", text: "conexão registrada" })); return wrap; }
    if (!origem.length || !destino.length) { wrap.appendChild(el("p", { class: "helper-text", text: "Registre primeiro uma evidência em cada lado desta relação." })); return wrap; }
    var origemSel = selectEvidenciasGuiada(origem, "Evidência de origem");
    var destinoSel = selectEvidenciasGuiada(destino, "Evidência de destino");
    var btn = el("button", { class: "primary", text: "Confirmar conexão" });
    btn.addEventListener("click", function () {
      d.conexoes.push({ id: uid(), origem: String(receita.origem), destino: String(receita.destino), mecanismo: receita.mecanismo, evidenciaOrigemId: origemSel.value, evidenciaDestinoId: destinoSel.value, plausivel: true, criadoEm: nowIso() });
      setDossie(d); salvarBackup(d); rotearAgora();
    });
    wrap.appendChild(origemSel); wrap.appendChild(destinoSel); wrap.appendChild(btn);
    return wrap;
  }

  function selectEvidenciasGuiada(lista, label) {
    var select = el("select", { "aria-label": label });
    lista.forEach(function (e, i) { select.appendChild(el("option", { value: e.id, text: (i + 1) + ". " + (e.titulo || e.oQueVejo).slice(0, 54) })); });
    return select;
  }

  function renderEtapaSintese(view) {
    var d = getDossie();
    cabecalhoEtapa(view, 3, "Explique o sistema", "Use suas evidências e conexões para responder ao problema. Uma boa explicação mostra mais de um caminho da água.");
    if (d.hipoteseInicial) {
      view.appendChild(el("div", { class: "card" }, [el("p", { class: "pill", text: "hipótese inicial" }), el("p", { text: d.hipoteseInicial.texto })]));
    }
    var texto = el("textarea", { rows: 6, placeholder: "O que explica o problema nesta bacia?" }); texto.value = d.sintese && d.sintese.texto || "";
    var acao = el("textarea", { rows: 3, placeholder: "Que ação poderia reduzir o problema? Quem poderia realizá-la?" }); acao.value = d.acao && d.acao.intervencao || "";
    var limite = el("textarea", { rows: 2, placeholder: "Que limitação ou risco essa ação tem?" }); limite.value = d.acao && d.acao.limitacao || "";
    var mudou = el("textarea", { rows: 2, placeholder: "O que mudou desde sua hipótese inicial, e por quê?" }); mudou.value = d.revisao && d.revisao.oQueMudou || "";
    var salvar = el("button", { class: "primary", text: "Salvar síntese" });
    salvar.addEventListener("click", function () {
      if (!texto.value.trim()) { alert("Escreva uma explicação antes de salvar."); return; }
      d.sintese = { texto: texto.value.trim(), atualizadoEm: nowIso() };
      d.acao = Object.assign({}, d.acao, { intervencao: acao.value.trim(), limitacao: limite.value.trim() });
      if (mudou.value.trim()) d.revisao = { oQueMudou: mudou.value.trim(), porque: mudou.value.trim() };
      setDossie(d); salvarBackup(d); rotearAgora();
    });
    view.appendChild(el("div", { class: "card" }, [
      el("label", { text: "Sua explicação" }), texto,
      el("label", { text: "Ação possível (opcional)" }), acao,
      el("label", { text: "Limitação dessa ação (opcional)" }), limite,
      el("label", { text: "O que mudou desde sua hipótese (opcional)" }), mudou,
      salvar
    ]));
    view.appendChild(el("div", { class: "step-actions" }, [
      el("button", { class: "secondary", text: "Voltar às conexões", onclick: function () { navegar("#/etapa/2"); } }),
      el("button", { class: "primary", text: "Gerar relatório final", onclick: function () { navegar("#/relatorio"); } })
    ]));
  }

  function svgCebola(d) {
    var W = 320, H = 320, cx = W / 2, cy = H / 2;
    var raios = [40, 60, 80, 100, 120, 140, 160];
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("id", "cebola-svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);

    var miolo = document.createElementNS(ns, "circle");
    miolo.setAttribute("cx", cx); miolo.setAttribute("cy", cy); miolo.setAttribute("r", 26);
    miolo.setAttribute("class", "miolo");
    svg.appendChild(miolo);
    var mioloLabel = document.createElementNS(ns, "text");
    mioloLabel.setAttribute("x", cx); mioloLabel.setAttribute("y", cy + 3);
    mioloLabel.setAttribute("class", "miolo-label");
    mioloLabel.textContent = "rio";
    svg.appendChild(mioloLabel);

    var pontos = { miolo: { x: cx, y: cy } };
    var raioAnel = 92, raioLabel = 138;
    camadas().forEach(function (c, i) {
      var ang = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      // anel: arco poroso — traço interrompido quando não há evidência
      var anel = document.createElementNS(ns, "circle");
      anel.setAttribute("cx", cx); anel.setAttribute("cy", cy); anel.setAttribute("r", raioAnel);
      anel.setAttribute("class", "anel");
      var temEvidencia = evidenciasDaCamada(d, c.id).length > 0;
      anel.setAttribute("stroke", temEvidencia ? "#e5f4ee" : "transparent");
      anel.setAttribute("stroke-dasharray", temEvidencia ? "none" : "3 6");
      svg.appendChild(anel);

      var pxAnel = cx + raioAnel * Math.cos(ang);
      var pyAnel = cy + raioAnel * Math.sin(ang);
      pontos[c.id] = { x: pxAnel, y: pyAnel };

      var px = cx + raioLabel * Math.cos(ang);
      var py = cy + raioLabel * Math.sin(ang);
      var label = document.createElementNS(ns, "text");
      label.setAttribute("x", px); label.setAttribute("y", py);
      label.setAttribute("class", "anel-label"); label.setAttribute("text-anchor", "middle");
      label.textContent = c.id + ". " + c.caminho.replace("Caminho d", "").trim();
      svg.appendChild(label);
    });

    var marker = document.createElementNS(ns, "marker");
    marker.setAttribute("id", "seta-ponta"); marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6"); marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto-start-reverse");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M0,0 L10,5 L0,10 z"); path.setAttribute("fill", "context-stroke");
    marker.appendChild(path);
    var defs = document.createElementNS(ns, "defs"); defs.appendChild(marker);
    svg.appendChild(defs);

    d.conexoes.forEach(function (c) {
      var a = pontos[c.origem], b = pontos[c.destino];
      if (!a || !b) return;
      var linha = document.createElementNS(ns, "path");
      var mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12, my = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;
      linha.setAttribute("d", "M" + a.x + "," + a.y + " Q" + mx + "," + my + " " + b.x + "," + b.y);
      var tipo = !conexaoSustentada(c) ? "suposicao" : (dentroFora(c) ? "dentro-fora" : "fora-dentro");
      linha.setAttribute("class", "seta " + tipo);
      linha.setAttribute("marker-end", "url(#seta-ponta)");
      svg.appendChild(linha);
    });

    return svg;
  }

  // ---------- T9 · Briefing / hipótese (aba da síntese, ver §5.1 passo 3) ----------
  function renderBriefing(view, d) {
    view.appendChild(el("h3", { text: "Antes de investigar: sua hipótese" }));
    if (d.hipoteseInicial) {
      view.appendChild(el("div", { class: "card" }, [
        el("p", { class: "pill", text: "hipótese congelada" }),
        el("p", { text: d.hipoteseInicial.texto })
      ]));
      return;
    }
    view.appendChild(el("p", { class: "evidencia-status", text: "Antes de ver qualquer dado: o que você acha que explica o problema? Depois de registrar, isso fica congelado — você só vai revê-lo no fim." }));
    var ta = el("textarea", { rows: 4, placeholder: "Minha hipótese inicial é..." });
    view.appendChild(ta);
    view.appendChild(el("button", { class: "primary", text: "Congelar hipótese e liberar as camadas", onclick: function () {
      if (!ta.value.trim()) return;
      d.hipoteseInicial = { texto: ta.value.trim(), criadoEm: nowIso() };
      setDossie(d); salvarBackup(d);
      navegar("#/cebola");
    } }));
  }

  // ---------- T4/T5 · Camada e cartas de evidência ----------
  function renderCamada(args, view) {
    var id = args[0];
    var c = camadaPorId(id);
    if (!c) { view.appendChild(el("p", { text: "Camada não encontrada." })); return; }
    var d = getDossie();
    if (!d.hipoteseInicial) { renderBriefing(view, d); return; }

    view.appendChild(el("h2", { text: c.id + ". " + c.nome }));
    view.appendChild(el("p", { class: "lede", text: c.caminho }));

    view.appendChild(el("h3", { text: "Perguntas-guia" }));
    var ul = el("ul", {});
    (c.perguntasGuia || []).forEach(function (p) { ul.appendChild(el("li", { text: p })); });
    view.appendChild(ul);

    view.appendChild(el("h3", { text: "Cartas de evidência" }));
    var cartas = cartasDaCamada(c.id);
    if (!cartas.length) {
      view.appendChild(el("p", { class: "evidencia-status", text: "Esta camada depende de dado local: nenhuma carta curada ainda. Crie uma evidência de campo abaixo." }));
    }
    cartas.forEach(function (carta) {
      var registrada = d.evidencias.some(function (e) { return e.cartaId === carta.id; });
      view.appendChild(cartaEvidencia(carta, c, d, registrada));
    });

    view.appendChild(el("h3", { text: "Criar evidência de campo" }));
    view.appendChild(formEvidenciaPropria(c, d));

    view.appendChild(el("h3", { text: "Suas evidências nesta camada" }));
    evidenciasDaCamada(d, c.id).forEach(function (e) {
      view.appendChild(el("div", { class: "card" }, [
        el("p", { class: "pill", text: e.propria ? "campo" : "carta" }),
        el("p", { text: "Vejo: " + e.oQueVejo }),
        el("p", { text: "Indica: " + e.oQueIndica }),
        el("p", { class: "evidencia-status", text: "Confiança: " + e.confianca })
      ]));
    });

    view.appendChild(el("button", { class: "secondary", text: "← voltar à cebola", onclick: function () { navegar("#/cebola"); } }));
  }

  function cartaEvidencia(carta, camada, d, registrada) {
    var virada = false;
    var wrap = el("div", { class: "card" });
    var frente = el("div", {}, [
      el("p", { class: "pill", text: carta.tipo }),
      el("h3", { text: carta.titulo }),
      el("p", { class: "evidencia-status", text: "Fonte: " + carta.fonte }),
      el("button", { class: "secondary", text: "Virar carta", onclick: function () { virar(); } })
    ]);
    wrap.appendChild(frente);

    function virar() {
      if (virada) return; virada = true;
      wrap.innerHTML = "";
      wrap.appendChild(el("p", { class: "pill", text: carta.tipo }));
      wrap.appendChild(el("h3", { text: carta.titulo }));
      wrap.appendChild(el("p", { text: carta.conteudo || "(sem conteúdo — ver fonte)" }));
      wrap.appendChild(el("p", { class: "evidencia-status", text: "Pergunta que responde: " + carta.perguntaQueResponde }));
      if (registrada) {
        wrap.appendChild(el("p", { class: "pill", text: "já registrada" }));
        return;
      }
      var vejo = el("textarea", { rows: 2, placeholder: "O que eu vejo nesta evidência" });
      var indica = el("textarea", { rows: 2, placeholder: "O que isso indica" });
      var conf = el("select", {}, [
        el("option", { value: "alta", text: "confiança alta" }),
        el("option", { value: "media", text: "confiança média" }),
        el("option", { value: "a-confirmar", text: "a confirmar" })
      ]);
      wrap.appendChild(vejo); wrap.appendChild(indica); wrap.appendChild(conf);
      var linha = el("div", {}, [
        el("button", { class: "primary", text: "Registrar", onclick: function () {
          if (!vejo.value.trim() || !indica.value.trim()) return;
          d.evidencias.push({ id: uid(), camadaId: camada.id, cartaId: carta.id, propria: false,
            oQueVejo: vejo.value.trim(), oQueIndica: indica.value.trim(), confianca: conf.value, criadoEm: nowIso() });
          setDossie(d); salvarBackup(d); rotearAgora();
        } }),
        el("button", { class: "secondary", text: "Descartar com justificativa", onclick: function () {
          var motivo = prompt("Por que esta carta não é relevante aqui?");
          if (!motivo) return;
          d.evidencias.push({ id: uid(), camadaId: camada.id, cartaId: carta.id, propria: false, descartada: true,
            motivoDescarte: motivo, oQueVejo: "(descartada)", oQueIndica: motivo, confianca: "alta", criadoEm: nowIso() });
          setDossie(d); salvarBackup(d); rotearAgora();
        } })
      ]);
      wrap.appendChild(linha);
    }
    return wrap;
  }

  function formEvidenciaPropria(camada, d) {
    var titulo = el("input", { type: "text", placeholder: "O que você observou (ex.: margem sem mata ciliar no ponto X)" });
    var vejo = el("textarea", { rows: 2, placeholder: "O que eu vejo" });
    var indica = el("textarea", { rows: 2, placeholder: "O que isso indica" });
    var wrap = el("div", { class: "card" }, [
      titulo, vejo, indica,
      el("button", { class: "primary", text: "Registrar evidência de campo", onclick: function () {
        if (!titulo.value.trim() || !vejo.value.trim() || !indica.value.trim()) return;
        d.evidencias.push({ id: uid(), camadaId: camada.id, propria: true, titulo: titulo.value.trim(),
          oQueVejo: vejo.value.trim(), oQueIndica: indica.value.trim(), confianca: "alta", criadoEm: nowIso() });
        setDossie(d); salvarBackup(d); rotearAgora();
      } })
    ]);
    return wrap;
  }

  function renderEvidencias(_args, view) {
    var d = getDossie();
    view.appendChild(el("h2", { text: "Evidências por camada" }));
    camadas().forEach(function (c) {
      var n = evidenciasDaCamada(d, c.id).length;
      view.appendChild(el("div", { class: "card" }, [
        el("h3", { text: c.id + ". " + c.nome }),
        el("p", { class: "evidencia-status", text: n + " evidência(s)" }),
        el("button", { class: "secondary", text: "Abrir", onclick: function () { navegar("#/camada/" + c.id); } })
      ]));
    });
  }

  // ---------- T7 · Conexões ----------
  function renderConexoes(_args, view) {
    var d = getDossie();
    if (!d.hipoteseInicial) { renderBriefing(view, d); return; }
    view.appendChild(el("h2", { text: "Conexões" }));
    view.appendChild(el("p", { class: "lede", text: "O ponto do app: ligue duas camadas com direção e mecanismo. Conexões de dentro para fora (o objeto hidrográfico transformando a camada) valem mais." }));

    var opcoes = [{ id: "miolo", nome: nodeNome("miolo") + " (miolo)" }].concat(
      camadas().map(function (c) { return { id: String(c.id), nome: c.id + ". " + c.nome }; })
    );
    function selectOpcoes() {
      var s = el("select", {});
      opcoes.forEach(function (o) { s.appendChild(el("option", { value: o.id, text: o.nome })); });
      return s;
    }

    var origemSel = selectOpcoes();
    var destinoSel = selectOpcoes(); destinoSel.selectedIndex = 1;
    var mecanismo = el("textarea", { rows: 2, placeholder: "O mecanismo, em uma frase (ex.: a impermeabilização reduz a infiltração e acelera o pico de cheia)" });

    function evidenciaSelect(camadaId) {
      var s = el("select", {}, [el("option", { value: "", text: "(sem evidência anexada)" })]);
      evidenciasDaCamada(d, camadaId === "miolo" ? "miolo" : camadaId).forEach(function (e) {
        s.appendChild(el("option", { value: e.id, text: (e.titulo || e.oQueVejo).slice(0, 40) }));
      });
      return s;
    }
    var evOrigemWrap = el("div", {}, [el("label", { text: "Evidência da origem" }), evidenciaSelect(origemSel.value)]);
    var evDestinoWrap = el("div", {}, [el("label", { text: "Evidência do destino" }), evidenciaSelect(destinoSel.value)]);
    function atualizarEvidencias() {
      evOrigemWrap.innerHTML = ""; evOrigemWrap.appendChild(el("label", { text: "Evidência da origem" })); evOrigemWrap.appendChild(evidenciaSelect(origemSel.value));
      evDestinoWrap.innerHTML = ""; evDestinoWrap.appendChild(el("label", { text: "Evidência do destino" })); evDestinoWrap.appendChild(evidenciaSelect(destinoSel.value));
    }
    origemSel.addEventListener("change", atualizarEvidencias);
    destinoSel.addEventListener("change", atualizarEvidencias);

    view.appendChild(el("div", { class: "card" }, [
      el("label", { text: "De" }), origemSel,
      el("label", { text: "Para →" }), destinoSel,
      el("label", { text: "Mecanismo" }), mecanismo,
      evOrigemWrap, evDestinoWrap,
      el("button", { class: "primary", text: "Criar conexão", onclick: function () {
        if (origemSel.value === destinoSel.value) { alert("Origem e destino não podem ser a mesma camada."); return; }
        if (!mecanismo.value.trim()) { alert("Descreva o mecanismo em uma frase."); return; }
        var evO = evOrigemWrap.querySelector("select").value || null;
        var evD = evDestinoWrap.querySelector("select").value || null;
        var plaus = plausivel(origemSel.value, destinoSel.value);
        d.conexoes.push({ id: uid(), origem: origemSel.value, destino: destinoSel.value,
          mecanismo: mecanismo.value.trim(), evidenciaOrigemId: evO, evidenciaDestinoId: evD,
          plausivel: plaus, criadoEm: nowIso() });
        setDossie(d); salvarBackup(d); rotearAgora();
      } })
    ]));

    view.appendChild(el("h3", { text: "Conexões criadas" }));
    d.conexoes.slice().reverse().forEach(function (c) {
      var sustentada = conexaoSustentada(c);
      var pills = [];
      pills.push(el("span", { class: "pill " + (dentroFora(c) ? "dentro-fora" : ""), text: dentroFora(c) ? "dentro→fora" : "fora→dentro" }));
      pills.push(el("span", { class: "pill", text: sustentada ? "sustentada" : "suposição" }));
      if (!c.plausivel) pills.push(el("span", { class: "pill warn", text: "conexão incomum — revisar mecanismo" }));
      view.appendChild(el("div", { class: "card" }, [
        el("p", {}, pills),
        el("p", { text: nodeNome(c.origem) + " → " + nodeNome(c.destino) }),
        el("p", { class: "evidencia-status", text: c.mecanismo })
      ]));
    });
  }

  // ---------- T9 · Síntese, ação, revisão ----------
  function renderSintese(_args, view) {
    var d = getDossie();
    if (!d.hipoteseInicial) { renderBriefing(view, d); return; }

    view.appendChild(el("h2", { text: "Síntese final" }));
    var sustentadas = conexoesSustentadas(d);
    if (sustentadas.length < 3) {
      view.appendChild(el("p", { class: "evidencia-status", text: "A síntese se apoia nas conexões: crie ao menos três sustentadas antes de escrever (você tem " + sustentadas.length + ")." }));
      view.appendChild(el("button", { class: "secondary", text: "Ir para conexões", onclick: function () { navegar("#/conexoes"); } }));
      return;
    }

    view.appendChild(el("div", { class: "card" }, [
      el("p", { class: "pill", text: "hipótese inicial (congelada)" }),
      el("p", { text: d.hipoteseInicial.texto })
    ]));

    view.appendChild(el("h3", { text: "Explicação" }));
    var texto = el("textarea", { rows: 6, placeholder: "Explique o sistema, apoiado nas conexões que você criou." });
    texto.value = (d.sintese && d.sintese.texto) || "";
    view.appendChild(texto);
    view.appendChild(el("button", { class: "primary", text: "Salvar síntese", onclick: function () {
      d.sintese = { texto: texto.value.trim(), atualizadoEm: nowIso() };
      setDossie(d); salvarBackup(d); rotearAgora();
    } }));

    view.appendChild(el("h3", { text: "Ação proposta" }));
    var interv = el("input", { type: "text", placeholder: "Intervenção" }); interv.value = (d.acao && d.acao.intervencao) || "";
    var alvo = el("select", {}); camadas().forEach(function (c) { alvo.appendChild(el("option", { value: c.id, text: c.nome })); });
    var instr = el("input", { type: "text", placeholder: "Instrumento de gestão (ex.: APP, outorga, plano diretor)" }); instr.value = (d.acao && d.acao.instrumento) || "";
    var resp = el("input", { type: "text", placeholder: "Responsável pela execução" }); resp.value = (d.acao && d.acao.responsavel) || "";
    var limit = el("textarea", { rows: 2, placeholder: "Limitação ou risco da própria proposta (obrigatório)" }); limit.value = (d.acao && d.acao.limitacao) || "";
    view.appendChild(el("div", { class: "card" }, [
      el("label", { text: "Intervenção" }), interv,
      el("label", { text: "Camada-alvo" }), alvo,
      el("label", { text: "Instrumento" }), instr,
      el("label", { text: "Responsável" }), resp,
      el("label", { text: "Limitação (obrigatório)" }), limit,
      el("button", { class: "primary", text: "Salvar ação", onclick: function () {
        if (!limit.value.trim()) { alert("A limitação é obrigatória — toda proposta tem um ponto fraco."); return; }
        d.acao = { intervencao: interv.value.trim(), camadaAlvo: alvo.value, instrumento: instr.value.trim(), responsavel: resp.value.trim(), limitacao: limit.value.trim() };
        setDossie(d); salvarBackup(d); rotearAgora();
      } })
    ]));

    view.appendChild(el("h3", { text: "Revisão — o que mudou desde a hipótese inicial" }));
    var mudou = el("textarea", { rows: 2, placeholder: "O que mudou" }); mudou.value = (d.revisao && d.revisao.oQueMudou) || "";
    var porque = el("textarea", { rows: 2, placeholder: "Por que mudou" }); porque.value = (d.revisao && d.revisao.porque) || "";
    view.appendChild(el("div", { class: "card" }, [
      mudou, porque,
      el("button", { class: "primary", text: "Salvar revisão", onclick: function () {
        d.revisao = { oQueMudou: mudou.value.trim(), porque: porque.value.trim() };
        setDossie(d); salvarBackup(d); rotearAgora();
      } })
    ]));

    view.appendChild(el("h3", { text: "Relatório final" }));
    view.appendChild(el("button", { class: "primary", text: "Ver relatório final", onclick: function () { navegar("#/relatorio"); } }));
  }

  function renderRelatorio(_args, view) {
    var d = getDossie(), aluno = getAluno(), m = getMissao();
    view.appendChild(el("p", { class: "eyebrow", text: "Produto final" }));
    view.appendChild(el("h2", { text: "Relatório da investigação" }));
    view.appendChild(el("p", { class: "lede", text: "Este é o texto final para entregar, imprimir ou salvar em PDF." }));
    view.appendChild(el("div", { class: "report-actions" }, [
      el("button", { class: "primary", text: "Baixar relatório", onclick: baixarRelatorio }),
      el("button", { class: "secondary", text: "Imprimir ou salvar PDF", onclick: function () { window.print(); } })
    ]));
    view.appendChild(relatorioDom(d, aluno, m));
  }

  function relatorioDom(d, aluno, m) {
    var art = el("article", { class: "report-card" });
    art.appendChild(el("h1", { text: "Caminhos da Água" }));
    art.appendChild(el("p", { class: "report-meta", text: (m && m.titulo || "Missão") + " · " + dataCurta() }));
    art.appendChild(el("p", { text: "Aluno(a)/equipe: " + (aluno && aluno.nome || "Não informado") + (aluno && aluno.turma ? " · Turma: " + aluno.turma : "") }));
    art.appendChild(el("h2", { text: "Problema investigado" }));
    art.appendChild(el("p", { text: m && m.perguntaProblema || "Investigar uma bacia hidrográfica como sistema socioambiental complexo." }));
    art.appendChild(el("h2", { text: "Hipótese inicial" }));
    art.appendChild(el("p", { text: d.hipoteseInicial && d.hipoteseInicial.texto || "Não registrada." }));
    art.appendChild(el("h2", { text: "Evidências observadas" }));
    var evidencias = d.evidencias.filter(function (e) { return !e.descartada; });
    art.appendChild(listaRelatorio(evidencias, function (e) {
      return tituloEvidencia(e) + " — " + nodeNome(e.camadaId) + ". Percebi: " + e.oQueVejo + " Consequência: " + e.oQueIndica;
    }, "Nenhuma evidência registrada."));
    art.appendChild(el("h2", { text: "Conexões entre camadas" }));
    art.appendChild(listaRelatorio(conexoesSustentadas(d), function (c) {
      var evO = evidenciaPorId(d, c.evidenciaOrigemId);
      var evD = evidenciaPorId(d, c.evidenciaDestinoId);
      return nodeNome(c.origem) + " → " + nodeNome(c.destino) + ": " + c.mecanismo +
        " Evidências: " + (evO ? tituloEvidencia(evO) : "origem não informada") + " + " + (evD ? tituloEvidencia(evD) : "destino não informado") + ".";
    }, "Nenhuma conexão sustentada registrada."));
    art.appendChild(el("h2", { text: "Explicação final" }));
    art.appendChild(el("p", { text: d.sintese && d.sintese.texto || "Síntese ainda não escrita." }));
    art.appendChild(el("h2", { text: "Ação proposta" }));
    art.appendChild(el("p", { text: d.acao && d.acao.intervencao || "Nenhuma ação proposta." }));
    if (d.acao && d.acao.limitacao) art.appendChild(el("p", { text: "Limitação: " + d.acao.limitacao }));
    if (d.revisao && d.revisao.oQueMudou) {
      art.appendChild(el("h2", { text: "Revisão da hipótese" }));
      art.appendChild(el("p", { text: d.revisao.oQueMudou }));
    }
    return art;
  }

  function listaRelatorio(itens, textoItem, vazio) {
    if (!itens.length) return el("p", { class: "report-empty", text: vazio });
    var ul = el("ul", { class: "report-list" });
    itens.forEach(function (item) { ul.appendChild(el("li", { text: textoItem(item) })); });
    return ul;
  }

  function htmlRelatorio() {
    var d = getDossie(), aluno = getAluno(), m = getMissao();
    var evidencias = d.evidencias.filter(function (e) { return !e.descartada; });
    var conexoes = conexoesSustentadas(d);
    function li(lista, fn, vazio) {
      if (!lista.length) return "<p>" + textoSeguro(vazio) + "</p>";
      return "<ul>" + lista.map(function (item) { return "<li>" + textoSeguro(fn(item)) + "</li>"; }).join("") + "</ul>";
    }
    return "<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
      "<title>Relatório Caminhos da Água</title><style>body{max-width:760px;margin:0 auto;padding:32px 20px;color:#052e2b;font:16px/1.6 Arial,sans-serif}h1,h2{line-height:1.15}h1{font-size:34px}h2{margin-top:28px;border-top:1px solid #d9e8e2;padding-top:18px}li{margin:10px 0}.meta{color:#5e7772}@media print{body{padding:0}button{display:none}}</style></head><body>" +
      "<h1>Caminhos da Água</h1><p class=\"meta\">" + textoSeguro(m && m.titulo || "Missão") + " · " + textoSeguro(dataCurta()) + "</p>" +
      "<p><strong>Aluno(a)/equipe:</strong> " + textoSeguro(aluno && aluno.nome || "Não informado") + (aluno && aluno.turma ? " · <strong>Turma:</strong> " + textoSeguro(aluno.turma) : "") + "</p>" +
      "<h2>Problema investigado</h2><p>" + textoSeguro(m && m.perguntaProblema || "Investigar uma bacia hidrográfica como sistema socioambiental complexo.") + "</p>" +
      "<h2>Hipótese inicial</h2><p>" + textoSeguro(d.hipoteseInicial && d.hipoteseInicial.texto || "Não registrada.") + "</p>" +
      "<h2>Evidências observadas</h2>" + li(evidencias, function (e) { return tituloEvidencia(e) + " — " + nodeNome(e.camadaId) + ". Percebi: " + e.oQueVejo + " Consequência: " + e.oQueIndica; }, "Nenhuma evidência registrada.") +
      "<h2>Conexões entre camadas</h2>" + li(conexoes, function (c) { var evO = evidenciaPorId(d, c.evidenciaOrigemId); var evD = evidenciaPorId(d, c.evidenciaDestinoId); return nodeNome(c.origem) + " → " + nodeNome(c.destino) + ": " + c.mecanismo + " Evidências: " + (evO ? tituloEvidencia(evO) : "origem não informada") + " + " + (evD ? tituloEvidencia(evD) : "destino não informado") + "."; }, "Nenhuma conexão sustentada registrada.") +
      "<h2>Explicação final</h2><p>" + textoSeguro(d.sintese && d.sintese.texto || "Síntese ainda não escrita.") + "</p>" +
      "<h2>Ação proposta</h2><p>" + textoSeguro(d.acao && d.acao.intervencao || "Nenhuma ação proposta.") + "</p>" +
      (d.acao && d.acao.limitacao ? "<p><strong>Limitação:</strong> " + textoSeguro(d.acao.limitacao) + "</p>" : "") +
      (d.revisao && d.revisao.oQueMudou ? "<h2>Revisão da hipótese</h2><p>" + textoSeguro(d.revisao.oQueMudou) + "</p>" : "") +
      "</body></html>";
  }

  function baixarRelatorio() {
    var aluno = getAluno();
    var blob = new Blob([htmlRelatorio()], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "relatorio-caminhos-da-agua-" + nomeArquivo(aluno && aluno.nome || "aluno") + ".html";
    document.body.appendChild(a); a.click(); a.remove();
  }

  function exportarDossie() {
    var d = getDossie(), aluno = getAluno(), m = getMissao();
    var pontos = calcularPontos(d);
    var pacote = { versaoEsquema: 1, aluno: aluno, missaoId: m && m.id, dossie: d, pontuacao: pontos, exportadoEm: nowIso() };
    var blob = new Blob([JSON.stringify(pacote, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "dossie-" + (aluno && aluno.nome ? aluno.nome.replace(/\s+/g, "-").toLowerCase() : "aluno") + ".json";
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- T10 · Perfil ----------
  function renderPerfil(_args, view) {
    var d = getDossie(); var pts = calcularPontos(d);
    view.appendChild(el("h2", { text: "Perfil e progresso" }));
    var nivelInfo = pts.nivel > 0 ? NIVEIS[pts.nivel - 1] : null;
    view.appendChild(el("div", { class: "card" }, [
      el("h3", { text: "Nível " + pts.nivel + "/5" + (nivelInfo ? " — " + nivelInfo.titulo : "") }),
      el("p", { class: "evidencia-status", text: pts.total + " pontos de investigação (não é nota — a nota é do professor, por rubrica)." })
    ]));

    var ROTULOS_TIPO = { evidencia: "evidência", conexao: "conexão", hipotese: "hipótese", revisao: "revisão", sintese: "síntese", acao: "ação" };
    var grid = el("div", { class: "pontos-tipo" });
    Object.keys(pts.porTipo).forEach(function (k) {
      grid.appendChild(el("span", { text: ROTULOS_TIPO[k] || k }));
      grid.appendChild(el("strong", { text: String(pts.porTipo[k]) }));
    });
    view.appendChild(el("div", { class: "card" }, [el("h3", { text: "Pontos por tipo de contribuição" }), grid]));

    view.appendChild(el("h3", { text: "Cobertura das seis camadas" }));
    camadas().forEach(function (c) {
      var n = evidenciasDaCamada(d, c.id).length;
      view.appendChild(el("p", { text: c.nome + ": " + (n ? n + " evidência(s)" : "ainda vazia") }));
    });

    view.appendChild(el("h3", { text: "Conquistas" }));
    var conquistas = calcularConquistas(d);
    if (!conquistas.length) view.appendChild(el("p", { class: "evidencia-status", text: "Nenhuma ainda." }));
    conquistas.forEach(function (c) { view.appendChild(el("p", {}, [el("span", { class: "pill", text: c })])); });

    view.appendChild(el("button", { class: "primary", text: "Ver relatório final", onclick: function () { navegar("#/relatorio"); } }));
    view.appendChild(el("details", { class: "teacher-tools" }, [
      el("summary", { text: "Exportação técnica" }),
      el("p", { class: "evidencia-status", text: "Arquivo para backup ou análise do professor, não necessário para a entrega dos alunos." }),
      el("button", { class: "secondary", text: "Baixar dados técnicos", onclick: exportarDossie })
    ]));
    view.appendChild(el("button", { class: "secondary", text: "Apagar todos os dados deste aparelho", onclick: function () {
      if (confirm("Isso apaga o dossiê deste aparelho. Exportou antes?")) { localStorage.clear(); location.href = "index.html"; }
    } }));
  }

  function calcularConquistas(d) {
    var c = [];
    if (d.conexoes.some(function (x) { return conexaoSustentada(x) && dentroFora(x); })) c.push("Rio que Esculpe");
    if (camadasComEvidencia(d).length >= 6) c.push("Seis Caminhos");
    if (d.evidencias.some(function (e) { return e.propria; })) c.push("Pé na Água");
    if (d.revisao && d.revisao.oQueMudou) c.push("Mudei de Ideia");
    var pares = {}; d.conexoes.forEach(function (x) { pares[[x.origem, x.destino].join(">")] = 1; });
    Object.keys(pares).forEach(function (k) {
      var rev = k.split(">").reverse().join(">");
      if (pares[rev] && k < rev) c.push("Duas Mãos");
    });
    return c;
  }

  // ---------- Boot ----------
  function bootApp() {
    registrarPwa();
    rota("cebola", renderCebola);
    rota("curso", renderCurso);
    rota("modulo", renderModulo);
    rota("laboratorio", renderLaboratorio);
    rota("etapa", renderEtapa);
    rota("camada", renderCamada);
    rota("evidencias", renderEvidencias);
    rota("conexoes", renderConexoes);
    rota("sintese", renderSintese);
    rota("relatorio", renderRelatorio);
    rota("perfil", renderPerfil);
    window.addEventListener("hashchange", rotearAgora);
    rotearAgora();
  }

  // ---------- index.html ----------
  function renderInicial() {
    registrarPwa();
    var m = getMissao(), d = getDossie();
    var area = document.getElementById("continuar-area");
    if (m) {
      area.innerHTML = "";
      area.appendChild(el("p", { text: "Missão: " + m.titulo }));
      area.appendChild(el("button", { class: "primary", text: "Continuar investigação", onclick: function () { location.href = "app.html"; } }));
    }
    document.getElementById("btn-demo").addEventListener("click", function () {
      fetch("missoes/paraibuna-enchentes.json").then(function (r) { return r.json(); }).then(function (json) {
        iniciar(json);
      });
    });
    document.getElementById("btn-curso").addEventListener("click", function () {
      fetch("missoes/paraibuna-enchentes.json").then(function (r) { return r.json(); }).then(function (json) {
        iniciar(json, "curso");
      });
    });
    document.getElementById("btn-importar").addEventListener("click", function () {
      document.getElementById("file-importar").click();
    });
    document.getElementById("btn-tutorial").addEventListener("click", function () { abrirTutorial(); });
    if (!localStorage.getItem("cda:tutorial-visto")) setTimeout(function () { abrirTutorial(); }, 250);
    document.getElementById("file-importar").addEventListener("change", function (ev) {
      var file = ev.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function () { try { iniciar(JSON.parse(reader.result)); } catch (e) { alert("JSON inválido."); } };
      reader.readAsText(file);
    });
    function iniciar(json, destino) {
      var nome = document.getElementById("nome").value.trim() || "Investigador(a)";
      var turma = document.getElementById("turma").value.trim();
      var missaoAnterior = getMissao();
      setAluno({ nome: nome, turma: turma });
      setMissao(json);
      if (!getDossie() || !missaoAnterior || missaoAnterior.id !== json.id) setDossie(dossieVazio());
      location.href = "app.html" + (destino ? "#/" + destino : "");
    }
  }

  function registrarPwa() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(function () { /* o app continua funcionando online */ });
    }
  }

  // Tutorial curto e reutilizavel: apresenta o metodo antes de pedir qualquer resposta.
  function abrirTutorial(inicio) {
    var root = document.getElementById("tutorial-root");
    if (!root) return;
    var passos = [
      { titulo: "Bem-vindo aos Caminhos da Água", texto: "Você vai investigar uma bacia conhecida e descobrir como água, território e sociedade se transformam mutuamente.", acao: "No fim, você terá uma explicação própria, apoiada em evidências." },
      { titulo: "1. Conheça o percurso", texto: "A aba Percurso reúne os temas da disciplina em módulos curtos: fundamentos, bacia, campo, qualidade da água, riscos e comunicação.", acao: "Leia os módulos no seu ritmo. Em cada um, escreva sua resposta ao desafio antes de comparar com a leitura de referência — é essa comparação que mostra o que você já entendeu." },
      { titulo: "2. Comece por uma pergunta", texto: "Toda missão apresenta um problema real, como uma enchente, a falta de água ou um conflito de uso.", acao: "Antes de ver qualquer evidência, escreva sua hipótese: o que você acha que explica o problema?" },
      { titulo: "3. Observe as evidências", texto: "Cada missão traz cartas de evidência: mapas, gráficos, fotos, documentos, dados de campo.", acao: "Analise pelo menos três. Para cada uma, anote o que você vê e que consequência isso sugere." },
      { titulo: "4. Conecte as evidências", texto: "O app sugere relações causais prontas, como \"a impermeabilização acelera o escoamento\". Você escolhe qual evidência sustenta cada lado.", acao: "Lembre que o rio também é agente: ele erode, organiza a cidade, produz riscos e provoca decisões." },
      { titulo: "5. Explique e proponha", texto: "Quando tiver evidências e conexões suficientes, escreva uma síntese sobre o sistema.", acao: "Depois proponha uma ação, reconheça seus limites e gere o relatório final." }
    ];
    var passoAtual = Math.min(Math.max(Number(inicio) || 0, 0), passos.length - 1);
    var backdrop = el("div", { class: "tutorial-backdrop" });
    var dialog = el("section", { class: "tutorial", role: "dialog", "aria-modal": "true", "aria-labelledby": "tutorial-titulo" });
    var titulo = el("h2", { id: "tutorial-titulo", tabindex: "-1" });
    var texto = el("p", {});
    var acao = el("p", { class: "helper-text" });
    var numero = el("div", { class: "tutorial-step", "aria-hidden": "true" });
    var progresso = el("div", { class: "tutorial-progress", "aria-hidden": "true" }, [el("span", {})]);
    var btnVoltar = el("button", { class: "secondary", text: "Voltar" });
    var btnAvancar = el("button", { class: "primary" });
    var btnPular = el("button", { class: "text-button", text: "Pular tutorial" });
    var btnFechar = el("button", { class: "tutorial-close", type: "button", "aria-label": "Fechar tutorial", text: "Fechar" });
    var actions = el("div", { class: "tutorial-actions" }, [btnPular, btnVoltar, btnAvancar]);
    dialog.appendChild(el("div", { class: "tutorial-header" }, [el("div", {}, [el("p", { class: "eyebrow", text: "Guia rápido" }), numero]), btnFechar]));
    dialog.appendChild(titulo); dialog.appendChild(texto); dialog.appendChild(acao); dialog.appendChild(progresso); dialog.appendChild(actions);
    backdrop.appendChild(dialog); root.innerHTML = ""; root.appendChild(backdrop);

    function fechar() { localStorage.setItem("cda:tutorial-visto", "1"); root.innerHTML = ""; }
    function atualizar() {
      var p = passos[passoAtual];
      numero.textContent = String(passoAtual + 1);
      titulo.textContent = p.titulo; texto.textContent = p.texto; acao.textContent = p.acao;
      progresso.firstChild.style.width = ((passoAtual + 1) / passos.length * 100) + "%";
      btnVoltar.disabled = passoAtual === 0;
      btnAvancar.textContent = passoAtual === passos.length - 1 ? "Começar investigação" : "Próximo";
      titulo.focus({ preventScroll: true });
    }
    btnVoltar.addEventListener("click", function () { if (passoAtual > 0) { passoAtual--; atualizar(); } });
    btnAvancar.addEventListener("click", function () { if (passoAtual === passos.length - 1) fechar(); else { passoAtual++; atualizar(); } });
    btnPular.addEventListener("click", fechar); btnFechar.addEventListener("click", fechar);
    backdrop.addEventListener("click", function (event) { if (event.target === backdrop) fechar(); });
    document.addEventListener("keydown", function escapar(event) { if (event.key === "Escape") { document.removeEventListener("keydown", escapar); fechar(); } });
    atualizar();
  }

  window.CaminhosDaAgua = { bootApp: bootApp, renderInicial: renderInicial, abrirTutorial: abrirTutorial };
})();
