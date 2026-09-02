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

  // ---------- T3 · Cebola porosa ----------
  function renderCebola(_args, view) {
    var d = getDossie();
    var m = getMissao();
    view.appendChild(el("h2", { text: "A cebola porosa" }));
    view.appendChild(el("p", { class: "lede", text: (m.perguntaProblema || "") }));
    view.appendChild(svgCebola(d));

    var pts = calcularPontos(d);
    view.appendChild(el("p", { class: "evidencia-status",
      text: "Nível " + pts.nivel + "/5 · " + pts.total + " pontos de investigação · " +
        conexoesSustentadas(d).length + " conexões sustentadas (" +
        d.conexoes.filter(function (c) { return conexaoSustentada(c) && dentroFora(c); }).length +
        " de dentro para fora)." }));

    var lista = el("div", {});
    camadas().forEach(function (c) {
      var n = evidenciasDaCamada(d, c.id).length;
      var card = el("div", { class: "card" }, [
        el("h3", { text: c.id + ". " + c.nome + " — " + c.caminho }),
        el("p", { class: "evidencia-status", text: n + " evidência(s) registrada(s)" }),
        el("button", { class: "secondary", onclick: function () { navegar("#/camada/" + c.id); }, text: "Investigar" })
      ]);
      lista.appendChild(card);
    });
    view.appendChild(lista);
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

    view.appendChild(el("h3", { text: "Exportar dossiê" }));
    view.appendChild(el("button", { class: "primary", text: "Baixar dossiê (JSON)", onclick: exportarDossie }));
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

    view.appendChild(el("button", { class: "secondary", text: "Exportar dossiê", onclick: exportarDossie }));
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
    rota("camada", renderCamada);
    rota("evidencias", renderEvidencias);
    rota("conexoes", renderConexoes);
    rota("sintese", renderSintese);
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
    function iniciar(json) {
      var nome = document.getElementById("nome").value.trim() || "Investigador(a)";
      var turma = document.getElementById("turma").value.trim();
      var missaoAnterior = getMissao();
      setAluno({ nome: nome, turma: turma });
      setMissao(json);
      if (!getDossie() || !missaoAnterior || missaoAnterior.id !== json.id) setDossie(dossieVazio());
      location.href = "app.html";
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
      { titulo: "1. Comece por uma pergunta", texto: "Toda missão apresenta um problema real, como uma enchente, a falta de água ou um conflito de uso.", acao: "Leia o contexto e escreva uma hipótese antes de olhar os dados." },
      { titulo: "2. Percorra as seis camadas", texto: "Clima, ciclo da água, relevo, ecossistemas, sociedade e gestão são caminhos diferentes para observar o mesmo sistema.", acao: "Abra cada camada e procure o que ela ajuda a explicar." },
      { titulo: "3. Registre evidências", texto: "Uma evidência pode ser um mapa, gráfico, fotografia, medição, documento ou observação de campo.", acao: "Anote o que você vê e o que isso indica. Diferencie dado de interpretação." },
      { titulo: "4. Crie conexões", texto: "Ligue duas camadas com uma seta e escreva o mecanismo da relação.", acao: "Lembre que o fluxo também parte do rio: ele erode, fertiliza, organiza, produz riscos e provoca decisões." },
      { titulo: "5. Explique e proponha", texto: "Quando tiver evidências e conexões suficientes, escreva uma síntese sobre o sistema.", acao: "Depois proponha uma ação, reconheça seus limites, revise sua hipótese e exporte o dossiê." }
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
