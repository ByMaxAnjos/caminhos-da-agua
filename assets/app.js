/* Caminhos da Água v2 — Unidade II: a bacia hidrográfica como unidade de análise.
   Telas: início, trilha (7 encontros), simulador de bacia, ferramentas (calculadora,
   jogo de hierarquia, sinuosidade), roteiros QGIS e relatório. Tudo no aparelho (localStorage).
   Depende de: hidro.js (Hidro) e conteudo.js (CONTEUDO). */
(function () {
  "use strict";

  // ---------- Estado (localStorage, prefixo cda2:) ----------
  function ler(k, def) { try { var v = localStorage.getItem("cda2:" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function gravar(k, v) { try { localStorage.setItem("cda2:" + k, JSON.stringify(v)); } catch (e) { /* aba privada: segue sem salvar */ } }
  function estadoVazio() { return { hipoteses: {}, quiz: {}, qgis: {}, calc: { A: {}, B: {} }, sim: { bacias: {}, limiares: [] }, jogo: { rodadas: 0, acertos: 0 }, sinuosidade: {} }; }
  function estado() {
    var e = ler("estado", null) || estadoVazio(), v = estadoVazio();
    Object.keys(v).forEach(function (k) { if (e[k] === undefined) e[k] = v[k]; });
    return e;
  }
  function salvar(e) { gravar("estado", e); }
  function aluno() { return ler("aluno", null); }

  // ---------- Utilidades ----------
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function textoSeguro(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]; });
  }
  function fmt(v, d) {
    if (typeof v !== "number" || !isFinite(v)) return "—";
    return v.toLocaleString("pt-BR", { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d });
  }
  function nomeArquivo(t) {
    return String(t || "aluno").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "aluno";
  }
  function baixar(nome, conteudo, tipo) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  }
  function card(cls, filhos) { return el("section", { class: "card " + (cls || "") }, filhos); }
  function eyebrow(t) { return el("p", { class: "eyebrow", text: t }); }

  // ---------- Ajuda: "Como usar esta tela" (aberta na 1ª visita) ----------
  function ajuda(chave) {
    var a = AJUDA.telas[chave]; if (!a) return null;
    var vistas = ler("vistas", {}), primeira = !vistas[chave];
    vistas[chave] = true; gravar("vistas", vistas);
    var det = el("details", { class: "card ajuda" });
    if (primeira) det.setAttribute("open", "");
    det.appendChild(el("summary", {}, [el("span", { class: "ajuda-icone", "aria-hidden": "true", text: "?" }), el("span", { text: a.titulo })]));
    det.appendChild(el("ol", { class: "ajuda-passos" }, a.passos.map(function (p) { return el("li", { text: p }); })));
    if (a.atividade) {
      det.appendChild(el("p", { class: "ajuda-sub", text: "Atividades sugeridas" }));
      det.appendChild(el("ul", { class: "ajuda-passos" }, a.atividade.map(function (p) { return el("li", { text: p }); })));
    }
    if (a.dica) det.appendChild(el("p", { class: "ajuda-dica", text: a.dica }));
    return det;
  }
  // Explicação curta de um bloco ("para que serve")
  function explica(t) { return el("p", { class: "explica", text: t }); }

  function abrirTutorial() {
    var passos = AJUDA.tutorial, i = 0;
    var fundo = el("div", { class: "tutorial-backdrop" });
    var dlg = el("section", { class: "tutorial", role: "dialog", "aria-modal": "true", "aria-labelledby": "tut-t" });
    var num = el("div", { class: "tutorial-step" }), tit = el("h2", { id: "tut-t", tabindex: "-1" }), txt = el("p", {}), acao = el("p", { class: "helper-text" });
    var barra = el("span", {}), ant = el("button", { class: "secondary", type: "button", text: "Voltar" }), prox = el("button", { class: "primary", type: "button" });
    function fechar() { gravar("tutorial-visto", true); fundo.remove(); document.removeEventListener("keydown", tecla); }
    function tecla(ev) { if (ev.key === "Escape") fechar(); }
    function mostrar() {
      num.textContent = String(i + 1); tit.textContent = passos[i].t; txt.textContent = passos[i].d; acao.textContent = passos[i].a;
      barra.style.width = ((i + 1) / passos.length * 100) + "%";
      ant.disabled = i === 0; prox.textContent = i === passos.length - 1 ? "Começar" : "Próximo";
      tit.focus();
    }
    ant.addEventListener("click", function () { if (i > 0) { i--; mostrar(); } });
    prox.addEventListener("click", function () { if (i < passos.length - 1) { i++; mostrar(); } else fechar(); });
    dlg.appendChild(el("div", { class: "tutorial-header" }, [el("p", { class: "eyebrow", text: "Como usar o app" }), el("button", { class: "tutorial-close", type: "button", "aria-label": "Fechar tutorial", text: "Fechar", onclick: fechar })]));
    [num, tit, txt, acao, el("div", { class: "tutorial-progress" }, [barra]), el("div", { class: "tutorial-actions" }, [el("button", { class: "text-button", type: "button", text: "Pular", onclick: fechar }), ant, prox])].forEach(function (x) { dlg.appendChild(x); });
    fundo.appendChild(dlg); document.body.appendChild(fundo);
    document.addEventListener("keydown", tecla);
    mostrar();
  }

  // ---------- Roteador ----------
  var ROTAS = {};
  function rota(nome, fn) { ROTAS[nome] = fn; }
  function rotearAgora() {
    var view = document.getElementById("view");
    var partes = (location.hash.replace(/^#\/?/, "") || (aluno() ? "trilha" : "inicio")).split("/");
    var nome = ROTAS[partes[0]] ? partes[0] : "trilha";
    if (!aluno() && nome !== "inicio") nome = "inicio";
    document.body.classList.toggle("sem-abas", nome === "inicio");
    document.querySelectorAll("nav.tabs button").forEach(function (b) {
      var ativo = b.dataset.rota === nome || (b.dataset.rota === "ferramentas" && /^(calculadora|jogo|sinuosidade)$/.test(nome)) || (b.dataset.rota === "trilha" && nome === "encontro");
      b.classList.toggle("active", ativo);
      if (ativo) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    view.innerHTML = "";
    ROTAS[nome](partes.slice(1), view);
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  }

  // ---------- Início ----------
  rota("inicio", function (_a, view) {
    var al = aluno() || {};
    var nome = el("input", { type: "text", id: "nome", autocomplete: "nickname", placeholder: "Como a equipe reconhece você", value: al.nome || "" });
    var turma = el("input", { type: "text", id: "turma", autocomplete: "organization", placeholder: "Ex.: equipe 3", value: al.turma || "" });
    var aviso = el("p", { class: "helper-text", role: "status" });
    view.appendChild(el("header", { class: "brand-block" }, [
      el("p", { class: "kicker", text: "Hidrogeografia · Unidade II" }),
      el("h1", { html: 'Caminhos da <span class="accent-word">Água</span>' }),
      el("p", { class: "lede", text: "A bacia hidrográfica como unidade de análise: do relevo ao número, com simulador, ferramentas e roteiros de QGIS." })
    ]));
    view.appendChild(card("problema-card", [eyebrow("A pergunta da unidade"), el("h2", { text: CONTEUDO.problema.pergunta }), el("p", { class: "helper-text", text: CONTEUDO.problema.sub })]));
    view.appendChild(card("", [
      eyebrow("Começar"), el("h2", { text: al.nome ? "Continuar como " + al.nome : "Entre na trilha" }),
      el("p", { class: "helper-text", text: "Use um nome ou apelido. Seus dados ficam só neste aparelho." }),
      el("label", { for: "nome", text: "Nome ou apelido" }), nome,
      el("label", { for: "turma", html: "Turma ou equipe <span>(opcional)</span>" }), turma,
      el("div", { class: "action-stack" }, [el("button", { class: "primary", type: "button", text: "Entrar na trilha", onclick: function () {
        if (!nome.value.trim()) { aviso.textContent = "Escreva um nome ou apelido para continuar."; nome.focus(); return; }
        gravar("aluno", { nome: nome.value.trim(), turma: turma.value.trim() });
        location.hash = "#/trilha";
      } })]), aviso
    ]));
    view.appendChild(el("div", { class: "steps", "aria-label": "O que tem no app" }, [
      el("div", { class: "step" }, [el("span", { text: "1" }), el("p", { html: "<strong>Trilha</strong><br>7 encontros com ideias-chave e quiz." })]),
      el("div", { class: "step" }, [el("span", { text: "2" }), el("p", { html: "<strong>Simulador</strong><br>Delimite bacias e veja a morfometria." })]),
      el("div", { class: "step" }, [el("span", { text: "3" }), el("p", { html: "<strong>QGIS</strong><br>Roteiros passo a passo para o laboratório." })])
    ]));
  });

  // ---------- Trilha ----------
  function encontroFeito(e, enc) {
    var q = e.quiz[enc.id] || {};
    return !!(e.hipoteses[enc.id] && enc.quiz.every(function (_x, i) { return q[i] === true; }));
  }
  rota("trilha", function (_a, view) {
    var e = estado(), feitos = CONTEUDO.encontros.filter(function (enc) { return encontroFeito(e, enc); }).length;
    view.appendChild(eyebrow("Trilha da Unidade II"));
    view.appendChild(el("h2", { text: "Olá, " + (aluno().nome || "") + "." }));
    view.appendChild(ajuda("trilha"));
    if (!ler("tutorial-visto", false)) setTimeout(abrirTutorial, 0);
    view.appendChild(card("problema-card", [eyebrow("A pergunta que atravessa a unidade"), el("p", { class: "pergunta", text: CONTEUDO.problema.pergunta })]));
    view.appendChild(el("div", { class: "guided-progress", role: "progressbar", "aria-valuenow": String(feitos), "aria-valuemin": "0", "aria-valuemax": "7", "aria-label": "Encontros concluídos" }, [el("span", { style: "width:" + (feitos / 7 * 100) + "%" })]));
    view.appendChild(el("p", { class: "helper-text", text: feitos + " de 7 encontros concluídos. Um encontro conclui quando você registra a hipótese e acerta o quiz." }));
    view.appendChild(el("div", { class: "module-list" }, CONTEUDO.encontros.map(function (enc) {
      return el("a", { class: "module-item" + (encontroFeito(e, enc) ? " done" : ""), href: "#/encontro/" + enc.id }, [
        el("span", { class: "module-number", text: String(enc.id) }),
        el("span", {}, [el("strong", { text: enc.titulo }), el("small", { text: enc.sub })]),
        el("span", { class: "guided-arrow", "aria-hidden": "true", text: "→" })
      ]);
    })));
  });

  var FERRAMENTA = { simulador: ["Abrir o simulador de bacia", "#/simulador"], calculadora: ["Abrir a calculadora de morfometria", "#/calculadora"], jogo: ["Jogar: hierarquia fluvial", "#/jogo"], sinuosidade: ["Calcular a sinuosidade", "#/sinuosidade"] };

  rota("encontro", function (a, view) {
    var enc = CONTEUDO.encontros.filter(function (x) { return String(x.id) === a[0]; })[0] || CONTEUDO.encontros[0];
    var e = estado();
    view.appendChild(el("a", { class: "text-button voltar", href: "#/trilha", text: "← Trilha" }));
    view.appendChild(el("p", { class: "eyebrow", text: "Encontro " + enc.id + " · " + enc.sub }));
    view.appendChild(el("h2", { class: "titulo-encontro", text: enc.titulo }));
    view.appendChild(el("p", { class: "lede", text: enc.objetivo }));
    view.appendChild(ajuda("encontro"));

    // 1. Hipótese antes do conteúdo
    var txt = el("textarea", { id: "hip", "aria-label": "Sua hipótese" });
    txt.value = e.hipoteses[enc.id] || "";
    var estadoHip = el("p", { class: "helper-text", role: "status" });
    var areaConteudo = el("div", {});
    function liberar() { areaConteudo.classList.toggle("hidden", !estado().hipoteses[enc.id]); }
    view.appendChild(card("module-desafio", [eyebrow("Passo 1 · Antes de estudar"), explica("Responda com o que você pensa agora. Não vale nota e não existe resposta errada: serve para comparar depois."), el("h3", { text: enc.hipotese }), el("label", { for: "hip", text: "Sua hipótese (escreva antes de ver o conteúdo)" }), txt,
      el("button", { class: "secondary", type: "button", text: "Registrar hipótese", onclick: function () {
        var s = estado(); if (!txt.value.trim()) { estadoHip.textContent = "Escreva algo, mesmo que seja um palpite."; return; }
        s.hipoteses[enc.id] = txt.value.trim(); salvar(s); estadoHip.textContent = "Hipótese registrada. O conteúdo foi liberado."; liberar();
      } }), estadoHip]));

    // 2. Ideias-chave
    areaConteudo.appendChild(card("module-lesson", [eyebrow("Passo 2 · Ideias-chave"), explica("O resumo do que será trabalhado na aula. Leia e volte à sua hipótese: ela se confirma?"), el("ol", { class: "ideias" }, enc.ideias.map(function (i) { return el("li", { text: i }); }))]));

    // 3. Prática + ferramenta
    var pratica = [eyebrow("Passo 3 · Prática"), explica("A atividade da aula. Use o botão para abrir a ferramenta do app e o link para o roteiro do laboratório."), el("p", { text: enc.pratica })];
    if (enc.ferramenta) pratica.push(el("a", { class: "botao-link", href: FERRAMENTA[enc.ferramenta][1], text: FERRAMENTA[enc.ferramenta][0] + " →" }));
    pratica.push(el("a", { class: "text-button", href: "#/qgis/" + enc.id, text: "Ver o roteiro de laboratório deste encontro" }));
    areaConteudo.appendChild(card("", pratica));

    // 4. Quiz
    var quiz = card("module-quiz", [eyebrow("Passo 4 · Confira"), explica("Toque na opção que achar certa. Se errar, leia a explicação e tente de novo. O encontro conclui quando todas estiverem certas.")]);
    enc.quiz.forEach(function (q, qi) {
      var fb = el("p", { class: "quiz-feedback hidden", role: "status" });
      var opcoes = el("div", { class: "quiz-options" });
      q.opcoes.forEach(function (op, oi) {
        opcoes.appendChild(el("button", { class: "secondary quiz-option", type: "button", text: op, onclick: function (ev) {
          var certo = oi === q.correta, s = estado();
          s.quiz[enc.id] = s.quiz[enc.id] || {};
          if (s.quiz[enc.id][qi] !== true) s.quiz[enc.id][qi] = certo;
          salvar(s);
          opcoes.querySelectorAll("button").forEach(function (b) { b.classList.remove("quiz-correct", "quiz-wrong"); });
          ev.currentTarget.classList.add(certo ? "quiz-correct" : "quiz-wrong");
          fb.className = "quiz-feedback " + (certo ? "correct" : "wrong");
          fb.textContent = (certo ? "Isso. " : "Ainda não. ") + q.fb;
          if (encontroFeito(estado(), enc)) concluido.classList.remove("hidden");
        } }));
      });
      quiz.appendChild(el("h3", { text: (qi + 1) + ". " + q.p }));
      quiz.appendChild(opcoes); quiz.appendChild(fb);
    });
    var concluido = el("p", { class: "pill concluido" + (encontroFeito(e, enc) ? "" : " hidden"), text: "Encontro concluído" });
    quiz.appendChild(concluido);
    areaConteudo.appendChild(quiz);
    areaConteudo.appendChild(el("p", { class: "helper-text", text: "Leitura: " + enc.leitura }));

    var nav = el("div", { class: "step-actions" });
    if (enc.id > 1) nav.appendChild(el("a", { class: "text-button", href: "#/encontro/" + (enc.id - 1), text: "← Encontro " + (enc.id - 1) }));
    if (enc.id < 7) nav.appendChild(el("a", { class: "text-button", href: "#/encontro/" + (enc.id + 1), text: "Encontro " + (enc.id + 1) + " →" }));
    areaConteudo.appendChild(nav);
    view.appendChild(areaConteudo);
    liberar();
  });

  // ---------- Simulador de bacia ----------
  var SIM = { seed: 7, forma: "circular", limiar: 60, modo: "strahler" };
  var CACHE = {};
  function paisagem() {
    var chave = SIM.seed + ":" + SIM.forma;
    if (CACHE.chave !== chave) {
      var t = Hidro.gerarRelevo({ seed: SIM.seed, forma: SIM.forma }), r = Hidro.prepararRelevo(t);
      CACHE = { chave: chave, t: t, r: r, base: imagemBase(t), exutorio: Hidro.ajustarExutorio(r.acc, t.W, t.H, t.exutorio, 3) };
    }
    return CACHE;
  }
  function corHipso(v) { // 0..1 → verde (baixo) → amarelo → marrom → claro (alto)
    var p = [[0, [70, 140, 90]], [0.35, [160, 190, 110]], [0.6, [220, 200, 130]], [0.82, [175, 120, 80]], [1, [240, 232, 220]]];
    for (var i = 1; i < p.length; i++) if (v <= p[i][0]) {
      var t = (v - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
      return p[i - 1][1].map(function (c, k) { return c + (p[i][1][k] - c) * t; });
    }
    return p[p.length - 1][1];
  }
  function imagemBase(t) {
    var cv = document.createElement("canvas"); cv.width = t.W; cv.height = t.H;
    var ctx = cv.getContext("2d"), img = ctx.createImageData(t.W, t.H), s = Hidro.sombreamento(t.z, t.W, t.H, t.cel);
    var mn = Infinity, mx = -Infinity;
    for (var i = 0; i < t.z.length; i++) { if (t.z[i] < mn) mn = t.z[i]; if (t.z[i] > mx) mx = t.z[i]; }
    for (i = 0; i < t.z.length; i++) {
      var c = corHipso((t.z[i] - mn) / (mx - mn)), sh = 0.55 + 0.6 * s[i];
      img.data[i * 4] = Math.min(255, c[0] * sh); img.data[i * 4 + 1] = Math.min(255, c[1] * sh); img.data[i * 4 + 2] = Math.min(255, c[2] * sh); img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return { canvas: cv, min: mn, max: mx };
  }
  var AZUIS = ["#9fd3f5", "#4ea8e6", "#1d7fd0", "#1257a8", "#0b3a78", "#07275a"];

  function desenharMapa(cv, P, hier, analise) {
    var t = P.t, r = P.r, ctx = cv.getContext("2d"), S = cv.width / t.W;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(P.base.canvas, 0, 0, cv.width, cv.height);
    if (analise) { // bacia: escurece o que está fora (máscara em W×H, ampliada de uma vez)
      var mc = document.createElement("canvas"); mc.width = t.W; mc.height = t.H;
      var mctx = mc.getContext("2d"), mi = mctx.createImageData(t.W, t.H);
      for (var c = 0; c < t.W * t.H; c++) if (!analise.mask[c]) { mi.data[c * 4] = 5; mi.data[c * 4 + 1] = 46; mi.data[c * 4 + 2] = 43; mi.data[c * 4 + 3] = 120; }
      mctx.putImageData(mi, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(mc, 0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = true;
    }
    ctx.lineCap = "round";
    var maxShreve = 1;
    if (SIM.modo === "shreve") for (c = 0; c < t.W * t.H; c++) if (hier.shreve[c] > maxShreve) maxShreve = hier.shreve[c];
    for (c = 0; c < t.W * t.H; c++) {
      if (r.acc[c] < SIM.limiar) continue;
      var j = Hidro.jusante(r.dir, t.W, c); if (j < 0) continue;
      var o = hier.strahler[c], nivel = SIM.modo === "shreve" ? Math.min(5, Math.floor(Math.log2(hier.shreve[c]))) : Math.min(5, o - 1);
      ctx.strokeStyle = AZUIS[nivel];
      ctx.lineWidth = Math.max(1, S * (0.25 + 0.22 * (SIM.modo === "shreve" ? nivel + 1 : o)));
      ctx.beginPath();
      ctx.moveTo((c % t.W + 0.5) * S, (Math.floor(c / t.W) + 0.5) * S);
      ctx.lineTo((j % t.W + 0.5) * S, (Math.floor(j / t.W) + 0.5) * S);
      ctx.stroke();
    }
    if (analise) {
      var ex = analise.canal[analise.canal.length - 1];
      ctx.fillStyle = "#ff6b4a"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc((ex % t.W + 0.5) * S, (Math.floor(ex / t.W) + 0.5) * S, Math.max(5, S * 1.2), 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    }
  }

  function svgLinha(pontos, rotX, rotY, w, h) { // gráfico de linha simples: pontos [[x,y]]
    var xs = pontos.map(function (p) { return p[0]; }), ys = pontos.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var m = { l: 46, r: 10, t: 10, b: 30 }, W = w, H = h;
    function px(x) { return m.l + (x - x0) / ((x1 - x0) || 1) * (W - m.l - m.r); }
    function py(y) { return H - m.b - (y - y0) / ((y1 - y0) || 1) * (H - m.t - m.b); }
    var d = pontos.map(function (p, i) { return (i ? "L" : "M") + px(p[0]).toFixed(1) + " " + py(p[1]).toFixed(1); }).join(" ");
    return '<svg class="grafico" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + textoSeguro(rotY + " por " + rotX) + '">' +
      '<line x1="' + m.l + '" y1="' + (H - m.b) + '" x2="' + (W - m.r) + '" y2="' + (H - m.b) + '" class="eixo"/>' +
      '<line x1="' + m.l + '" y1="' + m.t + '" x2="' + m.l + '" y2="' + (H - m.b) + '" class="eixo"/>' +
      '<path d="' + d + '" class="linha"/>' +
      '<text x="' + (m.l - 6) + '" y="' + (m.t + 10) + '" text-anchor="end">' + fmt(y1, 0) + "</text>" +
      '<text x="' + (m.l - 6) + '" y="' + (H - m.b) + '" text-anchor="end">' + fmt(y0, 0) + "</text>" +
      '<text x="' + m.l + '" y="' + (H - 10) + '">' + fmt(x0, x1 < 5 ? 1 : 0) + "</text>" +
      '<text x="' + (W - m.r) + '" y="' + (H - 10) + '" text-anchor="end">' + fmt(x1, x1 < 5 ? 1 : 0) + " " + textoSeguro(rotX) + "</text></svg>";
  }

  function tabelaIndices(ind) {
    var linhas = Object.keys(Hidro.INDICES).filter(function (k) { return ind[k] !== undefined; }).map(function (k) {
      var info = Hidro.INDICES[k];
      return "<tr><th scope=\"row\"><abbr title=\"" + textoSeguro(info.nome) + "\">" + k + "</abbr></th><td class=\"num\">" + fmt(ind[k], k === "Cm" || k === "tc" || k === "Hm" ? 0 : 2) + (info.un ? " <small>" + info.un + "</small>" : "") + "</td><td>" + textoSeguro(info.ler(ind[k])) + "</td></tr>";
    });
    return "<table class=\"tabela\"><thead><tr><th>Índice</th><th>Valor</th><th>Leitura</th></tr></thead><tbody>" + linhas.join("") + "</tbody></table>";
  }

  rota("simulador", function (_a, view) {
    var P = paisagem(), t = P.t;
    view.appendChild(eyebrow("Simulador de bacia"));
    view.appendChild(el("h2", { text: "Do relevo à bacia" }));
    view.appendChild(el("p", { class: "helper-text", text: "Relevo sintético e didático (não é Juiz de Fora). Toque no mapa para escolher o exutório. Mova o limiar e veja a rede mudar." }));
    view.appendChild(ajuda("simulador"));

    var cv = el("canvas", { id: "mapa", width: "720", height: "720", "aria-label": "Mapa do relevo com a rede de drenagem. Toque para escolher o exutório." });
    var aviso = el("p", { class: "aviso hidden", role: "status" });
    var limVal = el("output", { for: "limiar" });
    var lim = el("input", { type: "range", id: "limiar", min: "10", max: "400", step: "5", value: String(SIM.limiar) });
    var forma = el("select", { id: "forma", "aria-label": "Forma da bacia" }, [el("option", { value: "circular", text: "Bacia circular" }), el("option", { value: "alongado", text: "Bacia alongada" })]);
    forma.value = SIM.forma;
    var modo = el("select", { id: "modo", "aria-label": "Hierarquia" }, [el("option", { value: "strahler", text: "Cores: Strahler" }), el("option", { value: "shreve", text: "Cores: Shreve" })]);
    modo.value = SIM.modo;
    var resultados = el("div", {});

    view.appendChild(card("sim-card", [
      cv, aviso,
      el("div", { class: "legenda", html: "Rede colorida pela ordem: <span style=\"color:" + AZUIS[0] + "\">■</span> 1ª <span style=\"color:" + AZUIS[1] + "\">■</span> 2ª <span style=\"color:" + AZUIS[2] + "\">■</span> 3ª <span style=\"color:" + AZUIS[3] + "\">■</span> 4ª+ · <span style=\"color:#ff6b4a\">●</span> exutório" }),
      el("div", { class: "lab-control" }, [el("label", { for: "limiar" }, ["Limiar de acumulação", limVal]), lim,
        explica("Área mínima que precisa drenar para um ponto para ele virar rio. Arraste para a esquerda: mais rios pequenos. Para a direita: só os maiores.")]),
      el("div", { class: "controles" }, [forma, modo, el("button", { class: "secondary", type: "button", text: "Nova paisagem", onclick: function () { SIM.seed = Math.floor(Math.random() * 1e6); P = paisagem(); t = P.t; exutorio = P.exutorio; atualizar(); } })])
    ]));
    view.appendChild(resultados);

    var exutorio = P.exutorio;
    function atualizar() {
      SIM.limiar = Number(lim.value);
      limVal.textContent = SIM.limiar + " células ≈ " + fmt(SIM.limiar * t.cel * t.cel / 1e6, 2) + " km²";
      var hier = Hidro.hierarquia(P.r.dir, P.r.acc, P.t.W, P.t.H, SIM.limiar, P.r.ordem);
      var an = null;
      if (P.r.acc[exutorio] >= SIM.limiar) an = Hidro.analisarBacia(P.t, P.r.dir, P.r.acc, hier, exutorio, SIM.limiar);
      desenharMapa(cv, P, hier, an);
      renderResultados(an);
    }
    function renderResultados(an) {
      resultados.innerHTML = "";
      if (!an) { resultados.appendChild(card("", [el("p", { text: "O exutório escolhido não está num canal com este limiar. Toque sobre um canal azul." })])); return; }
      var m = an.medidas;
      resultados.appendChild(card("lab-results-card", [eyebrow("Medidas da bacia"), explica("Medidas da bacia do exutório laranja. Elas mudam quando você toca em outro ponto ou move o limiar."), el("div", { class: "medidas", html:
        "<div><b>" + fmt(m.A) + "</b><span>área (km²)</span></div><div><b>" + fmt(m.P) + "</b><span>perímetro (km)</span></div>" +
        "<div><b>" + m.ordemMax + "ª</b><span>ordem máxima</span></div><div><b>" + fmt(m.Lt) + "</b><span>rede total (km)</span></div>" +
        "<div><b>" + fmt(m.L) + "</b><span>canal principal (km)</span></div><div><b>" + fmt(m.Hmax - m.Hmin, 0) + "</b><span>amplitude (m)</span></div>" }),
        el("p", { class: "helper-text", text: "Canais por ordem (Strahler): " + m.Nu.map(function (n, i) { return (i + 1) + "ª = " + n; }).join(" · ") + ". Magnitude de Shreve no exutório: " + m.Nu[0] + "." }),
        el("div", { class: "action-stack" }, [
          el("button", { class: "secondary", type: "button", text: "Registrar no experimento de limiar", onclick: function () {
            var s = estado(); s.sim.limiares.push({ limiar: SIM.limiar, forma: SIM.forma, n1: m.Nu[0], ordemMax: m.ordemMax, Lt: m.Lt, Dd: an.indices.Dd }); salvar(s); renderExperimento();
          } }),
          el("button", { class: "secondary", type: "button", text: "Guardar como bacia A", onclick: function () { guardar("A"); } }),
          el("button", { class: "secondary", type: "button", text: "Guardar como bacia B", onclick: function () { guardar("B"); } })
        ]),
        el("p", { class: "helper-text", id: "guardado", role: "status" })
      ]));
      function guardar(k) {
        var s = estado(); s.sim.bacias[k] = { forma: SIM.forma, limiar: SIM.limiar, seed: SIM.seed, medidas: m, indices: an.indices }; salvar(s);
        document.getElementById("guardado").textContent = "Bacia " + k + " guardada. Compare no relatório ou abra na calculadora.";
      }
      resultados.appendChild(card("", [eyebrow("Morfometria automática"), explica("Os índices que você calcula no QGIS, feitos automaticamente. A coluna Leitura diz o que o número significa para a cheia."), el("div", { class: "tabela-wrap", html: tabelaIndices(an.indices) })]));
      var hipso = [], zs = [];
      for (var c = 0; c < an.mask.length; c++) if (an.mask[c]) zs.push(P.t.z[c]);
      zs.sort(function (x, y) { return y - x; });
      for (var i = 0; i < zs.length; i += Math.max(1, Math.floor(zs.length / 80))) hipso.push([(i + 1) / zs.length, (zs[i] - m.Hmin) / (m.Hmax - m.Hmin)]);
      resultados.appendChild(card("", [eyebrow("Perfil longitudinal do canal principal"), el("div", { html: svgLinha(an.perfil.map(function (p) { return [p.d, p.z]; }), "km", "altitude (m)", 560, 220) }),
        el("p", { class: "helper-text", text: "Da nascente (esquerda) ao exutório (direita). Procure o formato côncavo e as rupturas de declive (knickpoints)." })]));
      resultados.appendChild(card("", [eyebrow("Curva hipsométrica"), el("div", { html: svgLinha(hipso, "área relativa", "altura relativa", 560, 220) }),
        el("p", { class: "helper-text", text: "Integral hipsométrica = " + fmt(an.indices.HI) + " (" + Hidro.INDICES.HI.ler(an.indices.HI) + ")." })]));
      renderExperimento();
    }
    var exp = el("div", {});
    function renderExperimento() {
      exp.innerHTML = "";
      var ls = estado().sim.limiares;
      if (!ls.length) return;
      var html = "<table class=\"tabela\"><thead><tr><th>Limiar</th><th>Forma</th><th>1ª ordem</th><th>Ordem máx.</th><th>Lt (km)</th><th>Dd</th></tr></thead><tbody>" +
        ls.map(function (l) { return "<tr><td>" + l.limiar + "</td><td>" + l.forma + "</td><td class=\"num\">" + l.n1 + "</td><td class=\"num\">" + l.ordemMax + "ª</td><td class=\"num\">" + fmt(l.Lt) + "</td><td class=\"num\">" + fmt(l.Dd) + "</td></tr>"; }).join("") + "</tbody></table>";
      exp.appendChild(card("", [eyebrow("Experimento de limiar"), el("div", { class: "tabela-wrap", html: html }),
        el("p", { class: "helper-text", text: "Qual é a ordem 'verdadeira' do rio? Depende do limiar, assim como depende da escala da carta." }),
        el("button", { class: "text-button", type: "button", text: "Limpar experimento", onclick: function () { var s = estado(); s.sim.limiares = []; salvar(s); renderExperimento(); } })]));
      resultados.appendChild(exp);
    }

    cv.addEventListener("click", function (ev) {
      var rect = cv.getBoundingClientRect();
      var x = Math.floor((ev.clientX - rect.left) / rect.width * t.W), y = Math.floor((ev.clientY - rect.top) / rect.height * t.H);
      var c = Math.max(0, Math.min(t.H - 1, y)) * t.W + Math.max(0, Math.min(t.W - 1, x));
      var aj = P.r.acc[c] >= SIM.limiar ? c : Hidro.ajustarExutorio(P.r.acc, t.W, t.H, c, 3);
      aviso.classList.add("hidden");
      if (P.r.acc[aj] < SIM.limiar) { aviso.textContent = "Nenhum canal por perto. Toque sobre uma linha azul."; aviso.classList.remove("hidden"); return; }
      if (aj !== c) { aviso.textContent = "O ponto foi levado para o canal mais próximo. No QGIS isso não é automático: exutório fora do canal é o erro nº 1."; aviso.classList.remove("hidden"); }
      exutorio = aj; atualizar();
    });
    lim.addEventListener("input", atualizar);
    forma.addEventListener("change", function () { SIM.forma = forma.value; P = paisagem(); t = P.t; exutorio = P.exutorio; atualizar(); });
    modo.addEventListener("change", function () { SIM.modo = modo.value; atualizar(); });
    atualizar();
  });

  // ---------- Ferramentas ----------
  rota("ferramentas", function (_a, view) {
    view.appendChild(eyebrow("Ferramentas"));
    view.appendChild(el("h2", { text: "Medir, ordenar, comparar" }));
    view.appendChild(ajuda("ferramentas"));
    [["Calculadora de morfometria", "Lance as medidas do QGIS e obtenha os 16 índices com a leitura de cada um. Compare duas bacias.", "#/calculadora", "Encontros 5 e 6"],
     ["Jogo de hierarquia fluvial", "Ordene uma rede por Strahler ou por Shreve e confira na hora.", "#/jogo", "Encontro 2"],
     ["Sinuosidade", "Compare um trecho natural com um retificado.", "#/sinuosidade", "Encontro 7"],
     ["Simulador de bacia", "Delimite bacias num relevo sintético e veja a morfometria automática.", "#/simulador", "Encontros 3, 4 e 6"]].forEach(function (f) {
      view.appendChild(el("a", { class: "module-item ferramenta", href: f[2] }, [el("span", {}, [el("strong", { text: f[0] }), el("small", { text: f[1] }), el("span", { class: "module-tag", text: f[3] })]), el("span", { class: "guided-arrow", "aria-hidden": "true", text: "→" })]));
    });
  });

  // ---------- Calculadora de morfometria ----------
  var CAMPOS = [ // [chave, rótulo, onde obter no QGIS]
    ["A", "Área (km²)", "Calculadora de campo no polígono: $area / 1e6"],
    ["P", "Perímetro (km)", "Calculadora de campo no polígono: $perimeter / 1000"],
    ["L", "Canal principal (km)", "Soma dos trechos do rio principal, da nascente mais distante ao exutório"],
    ["Lb", "Comprimento axial (km)", "Linha reta do exutório ao ponto mais distante do divisor"],
    ["Lt", "Rede total (km)", "Soma de $length / 1000 de todos os canais (Estatísticas básicas)"],
    ["N1", "Canais de 1ª ordem", "Estatísticas por categoria, agrupando pelo campo de Strahler"],
    ["N2", "Canais de 2ª ordem", "Idem; deixe vazio se não houver"], ["N3", "Canais de 3ª ordem", "Idem; deixe vazio se não houver"],
    ["N4", "Canais de 4ª ordem", "Idem; deixe vazio se não houver"], ["N5", "Canais de 5ª ordem", "Idem; deixe vazio se não houver"],
    ["Hmax", "Altitude máxima (m)", "Estatísticas zonais (MDE × bacia): máximo"],
    ["Hmin", "Altitude mínima (m)", "Estatísticas zonais: mínimo (geralmente no exutório)"],
    ["Hmed", "Altitude média (m)", "Estatísticas zonais: média"],
    ["dH", "Desnível do canal principal (m)", "Altitude da nascente − altitude do exutório (perfil de elevação)"],
    ["Dv", "Nascente–foz em linha reta (km)", "Ferramenta de medição: da nascente ao exutório, em linha reta"]
  ];
  function numero(v) { var n = parseFloat(String(v || "").replace(",", ".")); return isFinite(n) ? n : undefined; }
  function medidasDe(obj) {
    var m = {}; CAMPOS.forEach(function (c) { if (!/^N\d$/.test(c[0])) m[c[0]] = numero(obj[c[0]]); });
    var Nu = []; for (var u = 1; u <= 5; u++) { var n = numero(obj["N" + u]); if (n === undefined) break; Nu.push(n); }
    m.Nu = Nu; m.N = Nu.length ? Nu.reduce(function (s, x) { return s + x; }, 0) : undefined;
    return m;
  }
  rota("calculadora", function (_a, view) {
    var s = estado();
    view.appendChild(el("a", { class: "text-button voltar", href: "#/ferramentas", text: "← Ferramentas" }));
    view.appendChild(eyebrow("Calculadora de morfometria"));
    view.appendChild(el("h2", { text: "Duas bacias lado a lado" }));
    view.appendChild(el("p", { class: "helper-text", text: "Use as medidas do QGIS (tudo em EPSG:31983). Vírgula ou ponto funcionam. Campos vazios são ignorados." }));
    view.appendChild(ajuda("calculadora"));
    var nomes = { A: s.calc.A.nome || "Ipiranga", B: s.calc.B.nome || "Teixeiras" };
    var tab = el("table", { class: "tabela entrada" });
    var cab = el("tr", {}, [el("th", { text: "Medida" })]);
    ["A", "B"].forEach(function (k) {
      var inp = el("input", { type: "text", value: nomes[k], "aria-label": "Nome da bacia " + k, "data-k": k, "data-c": "nome" });
      cab.appendChild(el("th", {}, [inp]));
    });
    tab.appendChild(el("thead", {}, [cab]));
    var corpo = el("tbody", {});
    CAMPOS.forEach(function (c) {
      var tr = el("tr", {}, [el("th", { scope: "row" }, [c[1], el("small", { class: "dica-campo", text: c[2] })])]);
      ["A", "B"].forEach(function (k) {
        tr.appendChild(el("td", {}, [el("input", { type: "text", inputmode: "decimal", value: s.calc[k][c[0]] == null ? "" : String(s.calc[k][c[0]]), "aria-label": c[1] + ", bacia " + k, "data-k": k, "data-c": c[0] })]));
      });
      corpo.appendChild(tr);
    });
    tab.appendChild(corpo);
    var saida = el("div", {});
    view.appendChild(card("", [el("div", { class: "tabela-wrap", html: "" }, [tab]),
      el("div", { class: "action-stack" }, [
        el("button", { class: "text-button", type: "button", text: "Preencher com as bacias A e B do simulador", onclick: function () {
          var st = estado();
          ["A", "B"].forEach(function (k) {
            var b = st.sim.bacias[k]; if (!b) return;
            var m = b.medidas, o = { nome: "Simulada " + k + " (" + b.forma + ")" };
            ["A", "P", "L", "Lb", "Lt", "Hmax", "Hmin", "Hmed", "dH", "Dv"].forEach(function (c) { o[c] = +m[c].toFixed(c.charAt(0) === "H" || c === "dH" ? 0 : 2); });
            m.Nu.slice(0, 5).forEach(function (n, i) { o["N" + (i + 1)] = n; });
            st.calc[k] = o;
          });
          salvar(st); rotearAgora();
        } })
      ])]));
    view.appendChild(saida);
    function calcular() {
      var st = estado();
      tab.querySelectorAll("input").forEach(function (i) { st.calc[i.dataset.k][i.dataset.c] = i.value; });
      salvar(st);
      var rA = Hidro.indices(medidasDe(st.calc.A)), rB = Hidro.indices(medidasDe(st.calc.B));
      var ks = Object.keys(Hidro.INDICES).filter(function (k) { return rA[k] !== undefined || rB[k] !== undefined; });
      if (!ks.length) { saida.innerHTML = '<p class="helper-text">Preencha ao menos área e perímetro para ver os índices.</p>'; return; }
      function cel(r, k) { return r[k] === undefined ? "<td>—</td>" : "<td><b class=\"num\">" + fmt(r[k], k === "Cm" || k === "tc" || k === "Hm" ? 0 : 2) + "</b><br><small>" + textoSeguro(Hidro.INDICES[k].ler(r[k])) + "</small></td>"; }
      saida.innerHTML = "<section class=\"card\"><p class=\"eyebrow\">Índices</p><div class=\"tabela-wrap\"><table class=\"tabela\"><thead><tr><th>Índice</th><th>" + textoSeguro(st.calc.A.nome || "A") + "</th><th>" + textoSeguro(st.calc.B.nome || "B") + "</th></tr></thead><tbody>" +
        ks.map(function (k) { return "<tr><th scope=\"row\">" + k + "<br><small>" + Hidro.INDICES[k].nome + (Hidro.INDICES[k].un ? " (" + Hidro.INDICES[k].un + ")" : "") + "</small></th>" + cel(rA, k) + cel(rB, k) + "</tr>"; }).join("") +
        "</tbody></table></div><p class=\"helper-text\">Kc = 0,28P/√A · Kf = A/Lb² · Ic = 12,57A/P² · Dd = Lt/A · Rb = média de Nu/Nu+1 · HI = (Hméd−Hmín)/(Hmáx−Hmín) · tc = 57(L³/ΔH)^0,385 · Is = L/Dv</p></section>";
    }
    tab.addEventListener("input", calcular);
    calcular();
  });

  // ---------- Jogo de hierarquia fluvial ----------
  var JOGO = { seed: 3, modo: "strahler" };
  rota("jogo", function (_a, view) {
    view.appendChild(el("a", { class: "text-button voltar", href: "#/ferramentas", text: "← Ferramentas" }));
    view.appendChild(eyebrow("Jogo de hierarquia fluvial"));
    view.appendChild(el("h2", { text: JOGO.modo === "strahler" ? "Ordene por Strahler" : "Calcule a magnitude de Shreve" }));
    view.appendChild(ajuda("jogo"));
    view.appendChild(el("p", { class: "helper-text", text: JOGO.modo === "strahler"
      ? "Toque em cada trecho para mudar a ordem. Dois de mesma ordem se unem → ordem + 1. Ordens diferentes → vale a maior."
      : "Toque em cada trecho para aumentar a magnitude. Cada nascente vale 1; na junção, as magnitudes se somam." }));
    var raiz = Hidro.gerarArvore(JOGO.seed, 6), trechos = [], folhas = 0, prof = 0;
    (function posicionar(no, d, pai) {
      no.d = d; if (d > prof) prof = d; no.pai = pai; trechos.push(no);
      if (!no.filhos.length) no.x = folhas++;
      else { no.filhos.forEach(function (f) { posicionar(f, d + 1, no); }); no.x = (no.filhos[0].x + no.filhos[1].x) / 2; }
    })(raiz, 0, null);
    var W = 600, H = 460, mx = 40, my = 30;
    function X(no) { return mx + no.x / Math.max(1, folhas - 1) * (W - 2 * mx); }
    function Y(no) { return H - 60 - no.d / Math.max(1, prof) * (H - 60 - my); }
    var resposta = trechos.map(function () { return 0; });
    var maxValor = JOGO.modo === "strahler" ? 5 : folhas + 1;
    var svg = "<svg id=\"arvore\" viewBox=\"0 0 " + W + " " + H + "\" role=\"group\" aria-label=\"Rede de drenagem: toque nos trechos\">";
    trechos.forEach(function (no, i) {
      var x1 = X(no), y1 = Y(no), x2 = no.pai ? X(no.pai) : x1, y2 = no.pai ? Y(no.pai) : H - 20;
      svg += "<g class=\"trecho\" data-i=\"" + i + "\" tabindex=\"0\" role=\"button\" aria-label=\"Trecho " + (i + 1) + "\">" +
        "<line class=\"alvo\" x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\"/>" +
        "<line class=\"rio\" x1=\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\"/>" +
        "<circle cx=\"" + ((x1 + x2) / 2) + "\" cy=\"" + ((y1 + y2) / 2) + "\" r=\"22\"/>" +
        "<text x=\"" + ((x1 + x2) / 2) + "\" y=\"" + ((y1 + y2) / 2 + 7) + "\" text-anchor=\"middle\">?</text></g>";
      if (!no.filhos.length) svg += "<circle class=\"nascente\" cx=\"" + x1 + "\" cy=\"" + y1 + "\" r=\"4\"/>";
    });
    svg += "<text x=\"" + X(raiz) + "\" y=\"" + (H - 4) + "\" text-anchor=\"middle\" class=\"rotulo\">exutório</text></svg>";
    var area = el("div", { class: "jogo-area", html: svg });
    var fb = el("p", { class: "quiz-feedback hidden", role: "status" });
    view.appendChild(card("", [area, fb, el("div", { class: "controles" }, [
      el("button", { class: "primary", type: "button", text: "Conferir", onclick: conferir }),
      el("button", { class: "secondary", type: "button", text: "Nova rede", onclick: function () { JOGO.seed = Math.floor(Math.random() * 1e6); rotearAgora(); } }),
      el("button", { class: "secondary", type: "button", text: JOGO.modo === "strahler" ? "Mudar para Shreve" : "Mudar para Strahler", onclick: function () { JOGO.modo = JOGO.modo === "strahler" ? "shreve" : "strahler"; rotearAgora(); } })
    ])]));
    var placar = estado().jogo;
    view.appendChild(el("p", { class: "helper-text", text: "Redes conferidas: " + placar.rodadas + " · totalmente corretas: " + placar.acertos + "." }));

    function tocar(g) {
      var i = Number(g.dataset.i);
      resposta[i] = resposta[i] >= maxValor ? 1 : resposta[i] + 1;
      g.querySelector("text").textContent = String(resposta[i]);
      g.classList.remove("certo", "errado");
      g.setAttribute("aria-label", "Trecho " + (i + 1) + ": " + resposta[i]);
    }
    area.querySelectorAll(".trecho").forEach(function (g) {
      g.addEventListener("click", function () { tocar(g); });
      g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); tocar(g); } });
    });
    function conferir() {
      var erros = 0;
      area.querySelectorAll(".trecho").forEach(function (g) {
        var i = Number(g.dataset.i), certo = resposta[i] === trechos[i][JOGO.modo];
        if (!certo) erros++;
        g.classList.toggle("certo", certo); g.classList.toggle("errado", !certo);
      });
      var s = estado(); s.jogo.rodadas++; if (!erros) s.jogo.acertos++; salvar(s);
      fb.className = "quiz-feedback " + (erros ? "wrong" : "correct");
      fb.textContent = erros ? erros + " trecho(s) em vermelho. Comece pelas nascentes (sempre " + (JOGO.modo === "strahler" ? "1ª ordem" : "magnitude 1") + ") e desça até o exutório."
        : "Tudo certo! O exutório tem " + (JOGO.modo === "strahler" ? raiz.strahler + "ª ordem." : "magnitude " + raiz.shreve + " = nº de nascentes.");
    }
  });

  // ---------- Sinuosidade ----------
  rota("sinuosidade", function (_a, view) {
    var s = estado();
    view.appendChild(el("a", { class: "text-button voltar", href: "#/ferramentas", text: "← Ferramentas" }));
    view.appendChild(eyebrow("Sinuosidade"));
    view.appendChild(el("h2", { text: "Natural × retificado" }));
    view.appendChild(ajuda("sinuosidade"));
    view.appendChild(el("p", { class: "helper-text", text: "Is = L / Dv. L: comprimento do canal medido sobre a imagem; Dv: distância em linha reta entre as extremidades do trecho." }));
    var saida = el("div", {});
    var trechos = [["nat", "Trecho natural (montante)"], ["ret", "Trecho retificado (área urbana)"]];
    var campos = el("div", { class: "duas-colunas" }, trechos.map(function (tr) {
      var v = s.sinuosidade[tr[0]] || {};
      return card("", [el("h3", { text: tr[1] }),
        el("label", { for: tr[0] + "L", text: "L (km)" }), el("input", { type: "text", inputmode: "decimal", id: tr[0] + "L", value: v.L || "", "data-t": tr[0], "data-c": "L" }),
        el("label", { for: tr[0] + "D", text: "Dv (km)" }), el("input", { type: "text", inputmode: "decimal", id: tr[0] + "D", value: v.Dv || "", "data-t": tr[0], "data-c": "Dv" })]);
    }));
    view.appendChild(campos); view.appendChild(saida);
    function calc() {
      var st = estado();
      campos.querySelectorAll("input").forEach(function (i) { st.sinuosidade[i.dataset.t] = st.sinuosidade[i.dataset.t] || {}; st.sinuosidade[i.dataset.t][i.dataset.c] = i.value; });
      salvar(st);
      saida.innerHTML = "";
      trechos.forEach(function (tr) {
        var v = st.sinuosidade[tr[0]] || {}, r = Hidro.indices({ L: numero(v.L), Dv: numero(v.Dv) });
        if (r.Is) saida.appendChild(card("lab-results-card", [el("p", { class: "eyebrow", text: tr[1] }), el("p", { class: "grande", text: "Is = " + fmt(r.Is) }), el("p", { text: Hidro.INDICES.Is.ler(r.Is) })]));
      });
      if (saida.children.length === 2) saida.appendChild(el("p", { class: "helper-text", text: "Pergunta para o campo: o que a retificação muda na velocidade da água e na cheia a jusante?" }));
    }
    campos.addEventListener("input", calc);
    calc();
  });

  // ---------- Roteiros QGIS ----------
  rota("qgis", function (a, view) {
    var s = estado();
    view.appendChild(eyebrow("Laboratório"));
    view.appendChild(el("h2", { text: "Roteiros de QGIS" }));
    view.appendChild(ajuda("qgis"));
    view.appendChild(card("module-desafio", [el("h3", { text: "Três armadilhas (resolva antes)" }), el("ul", { class: "ideias" }, CONTEUDO.armadilhas.map(function (x) { return el("li", { html: "<strong>" + textoSeguro(x.t) + ".</strong> " + textoSeguro(x.d) }); }))]));
    CONTEUDO.encontros.forEach(function (enc) {
      var marcados = s.qgis[enc.id] || [], feitos = marcados.filter(Boolean).length;
      var det = el("details", { class: "card roteiro", id: "qgis-" + enc.id });
      if (a[0] === String(enc.id)) det.setAttribute("open", "");
      det.appendChild(el("summary", {}, [el("span", { class: "module-number", text: String(enc.id) }), el("span", {}, [el("strong", { text: enc.titulo }), el("small", { class: "contagem", text: feitos + "/" + enc.qgis.length + " passos" })])]));
      var lista = el("ol", { class: "passos" });
      enc.qgis.forEach(function (p, i) {
        var id = "p" + enc.id + "-" + i, cb = el("input", { type: "checkbox", id: id });
        cb.checked = !!marcados[i];
        cb.addEventListener("change", function () {
          var st = estado(); st.qgis[enc.id] = st.qgis[enc.id] || []; st.qgis[enc.id][i] = cb.checked; salvar(st);
          det.querySelector(".contagem").textContent = st.qgis[enc.id].filter(Boolean).length + "/" + enc.qgis.length + " passos";
        });
        lista.appendChild(el("li", {}, [cb, el("label", { for: id, text: p })]));
      });
      det.appendChild(lista);
      view.appendChild(det);
      if (a[0] === String(enc.id)) setTimeout(function () { det.scrollIntoView({ block: "start" }); }, 0);
    });
    view.appendChild(card("", [el("h3", { text: "Problemas frequentes" }), el("div", { class: "tabela-wrap", html:
      "<table class=\"tabela\"><thead><tr><th>Sintoma</th><th>Causa provável</th><th>Solução</th></tr></thead><tbody>" +
      CONTEUDO.problemas.map(function (p) { return "<tr><td>" + textoSeguro(p[0]) + "</td><td>" + textoSeguro(p[1]) + "</td><td>" + textoSeguro(p[2]) + "</td></tr>"; }).join("") + "</tbody></table>" })]));
  });

  // ---------- Relatório ----------
  function htmlRelatorio() {
    var s = estado(), al = aluno() || {};
    var h = "<h1>Caminhos da Água · Unidade II</h1><p class=\"report-meta\">" + textoSeguro(al.nome) + (al.turma ? " · " + textoSeguro(al.turma) : "") + " · " + new Date().toLocaleDateString("pt-BR") + "</p>";
    h += "<h2>Pergunta da unidade</h2><p>" + textoSeguro(CONTEUDO.problema.pergunta) + "</p>";
    h += "<h2>Encontros</h2><ul class=\"report-list\">" + CONTEUDO.encontros.map(function (enc) {
      var q = s.quiz[enc.id] || {}, ac = enc.quiz.filter(function (_x, i) { return q[i] === true; }).length;
      return "<li><strong>" + enc.id + ". " + textoSeguro(enc.titulo) + "</strong> · quiz " + ac + "/" + enc.quiz.length + " · QGIS " + (s.qgis[enc.id] || []).filter(Boolean).length + "/" + enc.qgis.length +
        "<br><em>Hipótese:</em> " + (s.hipoteses[enc.id] ? textoSeguro(s.hipoteses[enc.id]) : "<span class=\"report-empty\">não registrada</span>") + "</li>";
    }).join("") + "</ul>";
    if (s.sim.limiares.length) h += "<h2>Experimento de limiar</h2><table class=\"tabela\"><tr><th>Limiar</th><th>Forma</th><th>1ª ordem</th><th>Ordem máx.</th><th>Lt (km)</th><th>Dd</th></tr>" +
      s.sim.limiares.map(function (l) { return "<tr><td>" + l.limiar + "</td><td>" + l.forma + "</td><td>" + l.n1 + "</td><td>" + l.ordemMax + "ª</td><td>" + fmt(l.Lt) + "</td><td>" + fmt(l.Dd) + "</td></tr>"; }).join("") + "</table>";
    ["A", "B"].forEach(function (k) {
      var b = s.sim.bacias[k]; if (!b) return;
      h += "<h2>Bacia simulada " + k + " (" + b.forma + ", limiar " + b.limiar + ")</h2>" + tabelaIndices(b.indices);
    });
    var rA = Hidro.indices(medidasDe(s.calc.A)), rB = Hidro.indices(medidasDe(s.calc.B));
    if (Object.keys(rA).length || Object.keys(rB).length) {
      h += "<h2>Calculadora: " + textoSeguro(s.calc.A.nome || "A") + " × " + textoSeguro(s.calc.B.nome || "B") + "</h2><table class=\"tabela\"><tr><th>Índice</th><th>" + textoSeguro(s.calc.A.nome || "A") + "</th><th>" + textoSeguro(s.calc.B.nome || "B") + "</th></tr>" +
        Object.keys(Hidro.INDICES).filter(function (k) { return rA[k] !== undefined || rB[k] !== undefined; }).map(function (k) { return "<tr><td>" + k + "</td><td>" + fmt(rA[k]) + "</td><td>" + fmt(rB[k]) + "</td></tr>"; }).join("") + "</table>";
    }
    var sn = s.sinuosidade, linhasS = [["nat", "Natural"], ["ret", "Retificado"]].map(function (tr) { var v = sn[tr[0]] || {}, r = Hidro.indices({ L: numero(v.L), Dv: numero(v.Dv) }); return r.Is ? "<li>" + tr[1] + ": Is = " + fmt(r.Is) + " (" + Hidro.INDICES.Is.ler(r.Is) + ")</li>" : ""; }).join("");
    if (linhasS) h += "<h2>Sinuosidade</h2><ul>" + linhasS + "</ul>";
    h += "<h2>Jogo de hierarquia</h2><p>" + s.jogo.rodadas + " redes conferidas, " + s.jogo.acertos + " totalmente corretas.</p>";
    return h;
  }
  rota("relatorio", function (_a, view) {
    view.appendChild(eyebrow("Relatório"));
    view.appendChild(el("h2", { text: "Seu percurso na Unidade II" }));
    view.appendChild(ajuda("relatorio"));
    view.appendChild(el("div", { class: "report-actions" }, [
      el("button", { class: "primary", type: "button", text: "Imprimir / salvar PDF", onclick: function () { window.print(); } }),
      el("button", { class: "secondary", type: "button", text: "Baixar HTML", onclick: function () {
        var css = "body{font-family:system-ui,sans-serif;max-width:48rem;margin:2rem auto;padding:0 1rem;color:#052e2b;line-height:1.5}table{border-collapse:collapse;width:100%;margin:.5rem 0}td,th{border:1px solid #d9e8e2;padding:.35rem .5rem;text-align:left;font-size:.9rem}h2{margin-top:1.6rem;border-top:1px solid #d9e8e2;padding-top:.8rem}";
        baixar("relatorio-unidade-ii-" + nomeArquivo(aluno().nome) + ".html", "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"><title>Relatório · Caminhos da Água</title><style>" + css + "</style></head><body>" + htmlRelatorio() + "</body></html>", "text/html;charset=utf-8");
      } }),
      el("button", { class: "secondary", type: "button", text: "Exportar JSON", onclick: function () {
        baixar("dados-unidade-ii-" + nomeArquivo(aluno().nome) + ".json", JSON.stringify({ versaoEsquema: 2, aluno: aluno(), estado: estado(), exportadoEm: new Date().toISOString() }, null, 2), "application/json");
      } })
    ]));
    view.appendChild(el("article", { class: "report-card", html: htmlRelatorio() }));
    view.appendChild(el("details", { class: "teacher-tools" }, [el("summary", { text: "Trocar de aluno ou apagar dados deste aparelho" }),
      el("button", { class: "secondary", type: "button", text: "Apagar meus dados", onclick: function () {
        if (!window.confirm("Apagar nome, hipóteses e resultados deste aparelho?")) return;
        try { localStorage.removeItem("cda2:estado"); localStorage.removeItem("cda2:aluno"); } catch (e) { /* nada a apagar */ }
        location.hash = "#/inicio";
      } })]));
  });

  // ---------- Boot ----------
  function registrarPwa() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(function () { /* segue online */ });
  }
  window.CaminhosDaAgua = { abrirTutorial: abrirTutorial };
  window.addEventListener("hashchange", rotearAgora);
  document.addEventListener("DOMContentLoaded", function () { registrarPwa(); rotearAgora(); });
})();
