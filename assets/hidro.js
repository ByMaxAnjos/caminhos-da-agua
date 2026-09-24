/* Caminhos da Água — núcleo hidrológico (sem DOM, testável em Node).
   Relevo sintético → preenchimento de depressões → D8 → fluxo acumulado →
   rede por limiar → bacia de um exutório → Strahler/Shreve → morfometria.
   Grade: índice c = y * W + x; célula de CEL metros. */
(function (root) {
  "use strict";

  var DX = [1, 1, 0, -1, -1, -1, 0, 1];
  var DY = [0, 1, 1, 1, 0, -1, -1, -1];
  var DIST = [1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2];

  // ---------- Relevo sintético ----------
  function rng(seed) { // mulberry32
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function ruido(W, H, seed, oitavas) { // value noise fractal, 0..1
    var r = rng(seed), out = new Float32Array(W * H), amp = 1, soma = 0;
    for (var o = 0; o < oitavas; o++) {
      var passo = Math.max(2, Math.round(Math.min(W, H) / (3 * Math.pow(2, o))));
      var gw = Math.ceil(W / passo) + 2, gh = Math.ceil(H / passo) + 2, g = new Float32Array(gw * gh);
      for (var k = 0; k < g.length; k++) g[k] = r();
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var fx = x / passo, fy = y / passo, x0 = Math.floor(fx), y0 = Math.floor(fy);
        var tx = fx - x0, ty = fy - y0;
        tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
        var a = g[y0 * gw + x0], b = g[y0 * gw + x0 + 1], c = g[(y0 + 1) * gw + x0], d = g[(y0 + 1) * gw + x0 + 1];
        out[y * W + x] += amp * ((a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty);
      }
      soma += amp; amp *= 0.5;
    }
    for (var i = 0; i < out.length; i++) out[i] /= soma;
    return out;
  }

  // forma: "circular" | "alongado". A bacia é uma elipse cercada por um divisor
  // (crista), aberta só no exutório, no meio da borda inferior. Dentro, um cone
  // que sobe a partir do exutório + ruído cria a rede; fora, o terreno cai para as bordas.
  // Altitudes na faixa de Juiz de Fora (~680–1000 m), só por verossimilhança.
  function gerarRelevo(opts) {
    opts = opts || {};
    var W = opts.W || 90, H = opts.H || 90, seed = opts.seed || 1, forma = opts.forma || "circular";
    var b = Math.floor(H * 0.46), a = forma === "alongado" ? Math.floor(W * 0.2) : b;
    var ox = Math.floor(W / 2), oy = H - 2, cy = oy - b;
    var n = ruido(W, H, seed, 5), z = new Float32Array(W * H), R = 140;
    function suave(e0, e1, v) { var t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var r = Math.hypot((x - ox) / a, (y - cy) / b);
      var dOut = Math.hypot(x - ox, y - oy), dn = Math.min(1.5, dOut / (2 * b));
      var brecha = suave(3, 9, dOut); // o divisor se abre perto do exutório
      var base = 680 + 230 * Math.pow(dn, 0.85) + 90 * (n[y * W + x] - 0.5);
      z[y * W + x] = r <= 1 ? base + R * suave(0.78, 1, r) * brecha : base + R * brecha - 120 * (r - 1);
    }
    return { W: W, H: H, cel: opts.cel || 30, z: z, seed: seed, forma: forma, exutorio: oy * W + ox };
  }

  // ---------- Preenchimento de depressões (priority-flood + ε, Barnes et al. 2014) ----------
  function preencher(z, W, H) {
    var N = W * H, f = new Float64Array(z), feito = new Uint8Array(N);
    var heap = [], EPS = 1e-4;
    function push(c) {
      heap.push(c); var i = heap.length - 1;
      while (i > 0) { var p = (i - 1) >> 1; if (f[heap[p]] <= f[heap[i]]) break; var t = heap[p]; heap[p] = heap[i]; heap[i] = t; i = p; }
    }
    function pop() {
      var top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last; var i = 0;
        for (;;) {
          var l = 2 * i + 1, r = l + 1, m = i;
          if (l < heap.length && f[heap[l]] < f[heap[m]]) m = l;
          if (r < heap.length && f[heap[r]] < f[heap[m]]) m = r;
          if (m === i) break; var t = heap[m]; heap[m] = heap[i]; heap[i] = t; i = m;
        }
      }
      return top;
    }
    for (var x = 0; x < W; x++) for (var y = 0; y < H; y++) {
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) { var c = y * W + x; feito[c] = 1; push(c); }
    }
    while (heap.length) {
      var c0 = pop(), cx = c0 % W, cy = (c0 - cx) / W;
      for (var k = 0; k < 8; k++) {
        var nx = cx + DX[k], ny = cy + DY[k];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        var nb = ny * W + nx; if (feito[nb]) continue;
        feito[nb] = 1; if (f[nb] <= f[c0]) f[nb] = f[c0] + EPS; push(nb);
      }
    }
    return f;
  }

  // ---------- D8: cada célula aponta para a vizinha de maior declive (-1 = sai da grade) ----------
  function d8(f, W, H) {
    var dir = new Int8Array(W * H).fill(-1);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var c = y * W + x, melhor = 0, kb = -1;
      for (var k = 0; k < 8; k++) {
        var nx = x + DX[k], ny = y + DY[k];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        var s = (f[c] - f[ny * W + nx]) / DIST[k];
        if (s > melhor) { melhor = s; kb = k; }
      }
      dir[c] = kb;
    }
    return dir;
  }
  function jusante(dir, W, c) { var k = dir[c]; return k < 0 ? -1 : c + DY[k] * W + DX[k]; }

  // Ordem topológica de montante para jusante (Kahn). Usada por acumulação e Strahler.
  function ordemTopologica(dir, W, H) {
    var N = W * H, entra = new Int32Array(N), fila = new Int32Array(N), ini = 0, fim = 0;
    for (var c = 0; c < N; c++) { var j = jusante(dir, W, c); if (j >= 0) entra[j]++; }
    for (c = 0; c < N; c++) if (!entra[c]) fila[fim++] = c;
    while (ini < fim) { var a = fila[ini++], b = jusante(dir, W, a); if (b >= 0 && --entra[b] === 0) fila[fim++] = b; }
    return fila;
  }

  // Fluxo acumulado: nº de células que drenam por cada célula (inclui ela mesma).
  function acumulacao(dir, W, H, ordem) {
    ordem = ordem || ordemTopologica(dir, W, H);
    var acc = new Float64Array(W * H).fill(1);
    for (var i = 0; i < ordem.length; i++) { var c = ordem[i], j = jusante(dir, W, c); if (j >= 0) acc[j] += acc[c]; }
    return acc;
  }

  // Leva o exutório para a célula de maior acumulação num raio (o "snap" do Whitebox).
  function ajustarExutorio(acc, W, H, c, raio) {
    var x0 = c % W, y0 = (c - x0) / W, melhor = c;
    for (var y = Math.max(0, y0 - raio); y <= Math.min(H - 1, y0 + raio); y++)
      for (var x = Math.max(0, x0 - raio); x <= Math.min(W - 1, x0 + raio); x++)
        if (acc[y * W + x] > acc[melhor]) melhor = y * W + x;
    return melhor;
  }

  // Bacia: todas as células cujo caminho D8 passa pelo exutório.
  function bacia(dir, W, H, exutorio) {
    var mask = new Uint8Array(W * H), pilha = [exutorio]; mask[exutorio] = 1;
    while (pilha.length) {
      var c = pilha.pop(), cx = c % W, cy = (c - cx) / W;
      for (var k = 0; k < 8; k++) {
        var nx = cx + DX[k], ny = cy + DY[k];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        var nb = ny * W + nx;
        if (!mask[nb] && jusante(dir, W, nb) === c) { mask[nb] = 1; pilha.push(nb); }
      }
    }
    return mask;
  }

  // Strahler e Shreve na rede (acc >= limiar), opcionalmente só dentro de uma máscara.
  function hierarquia(dir, acc, W, H, limiar, ordem) {
    ordem = ordem || ordemTopologica(dir, W, H);
    var N = W * H, strahler = new Uint8Array(N), shreve = new Uint32Array(N);
    var maxO = new Uint8Array(N), nMax = new Uint8Array(N); // maior ordem que chega e quantas vezes
    for (var i = 0; i < ordem.length; i++) {
      var c = ordem[i];
      if (acc[c] < limiar) continue;
      if (!maxO[c]) { strahler[c] = 1; shreve[c] = shreve[c] || 1; }
      else strahler[c] = nMax[c] >= 2 ? maxO[c] + 1 : maxO[c];
      var j = jusante(dir, W, c);
      if (j < 0 || acc[j] < limiar) continue;
      shreve[j] += shreve[c];
      if (strahler[c] > maxO[j]) { maxO[j] = strahler[c]; nMax[j] = 1; }
      else if (strahler[c] === maxO[j]) nMax[j]++;
    }
    return { strahler: strahler, shreve: shreve };
  }

  // Perímetro por marching squares sobre a máscara (evita o "efeito escada" do raster).
  function perimetro(mask, W, H, cel) {
    var L = 0, d = Math.SQRT2 / 2;
    function v(x, y) { return x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x] ? 1 : 0; }
    for (var y = -1; y < H; y++) for (var x = -1; x < W; x++) {
      var caso = v(x, y) * 8 + v(x + 1, y) * 4 + v(x + 1, y + 1) * 2 + v(x, y + 1);
      if (caso === 0 || caso === 15) continue;
      if (caso === 5 || caso === 10) L += 2 * d;
      else if (caso === 3 || caso === 6 || caso === 9 || caso === 12) L += 1;
      else L += d;
    }
    return L * cel;
  }

  // ---------- Índices morfométricos (fórmulas da tabela do plano) ----------
  // Entradas: A km², P km, L km (canal principal), Lb km (comprimento axial), Lt km,
  // N (nº total de canais), Nu [n1, n2, ...], Lu [comprimento total por ordem, km],
  // Hmax/Hmin/Hmed m, dH m (desnível do canal principal), Dv km (nascente–foz em linha reta).
  function indices(m) {
    var r = {}, ok = function (v) { return typeof v === "number" && isFinite(v) && v > 0; };
    if (ok(m.A) && ok(m.P)) { r.Kc = 0.28 * m.P / Math.sqrt(m.A); r.Ic = 12.57 * m.A / (m.P * m.P); }
    if (ok(m.A) && ok(m.Lb)) r.Kf = m.A / (m.Lb * m.Lb);
    if (ok(m.A) && ok(m.Lt)) { r.Dd = m.Lt / m.A; r.Cm = 1000 / r.Dd; r.Eps = 1 / (2 * r.Dd); }
    if (ok(m.A) && ok(m.N)) r.Dh = m.N / m.A;
    if (m.Nu && m.Nu.length > 1) {
      var rb = [];
      for (var u = 0; u < m.Nu.length - 1; u++) if (m.Nu[u] > 0 && m.Nu[u + 1] > 0) rb.push(m.Nu[u] / m.Nu[u + 1]);
      if (rb.length) r.Rb = rb.reduce(function (s, x) { return s + x; }, 0) / rb.length;
      if (m.Lu && m.Lu.length === m.Nu.length) {
        var rl = [];
        for (u = 0; u < m.Nu.length - 1; u++) {
          if (m.Nu[u] > 0 && m.Nu[u + 1] > 0 && m.Lu[u] > 0) rl.push((m.Lu[u + 1] / m.Nu[u + 1]) / (m.Lu[u] / m.Nu[u]));
        }
        if (rl.length) r.RL = rl.reduce(function (s, x) { return s + x; }, 0) / rl.length;
      }
    }
    if (typeof m.Hmax === "number" && typeof m.Hmin === "number" && m.Hmax > m.Hmin) {
      r.Hm = m.Hmax - m.Hmin;
      if (ok(m.Lb)) r.Rr = r.Hm / (m.Lb * 1000);
      if (r.Dd) r.Ir = (r.Hm / 1000) * r.Dd;
      if (typeof m.Hmed === "number") r.HI = (m.Hmed - m.Hmin) / r.Hm;
    }
    if (ok(m.L) && ok(m.dH)) { r.S = m.dH / (m.L * 1000); r.tc = 57 * Math.pow(Math.pow(m.L, 3) / m.dH, 0.385); }
    if (ok(m.L) && ok(m.Dv)) r.Is = m.L / m.Dv;
    return r;
  }

  // Leitura de cada índice, com as faixas do plano. Devolve texto curto.
  var INDICES = {
    Kc: { nome: "Coeficiente de compacidade", un: "", ler: function (v) { return v < 1.25 ? "próxima de circular: alta tendência a cheias" : v < 1.5 ? "tendência média a cheias" : "alongada: pouco sujeita a cheias"; } },
    Kf: { nome: "Fator de forma", un: "", ler: function (v) { return v > 0.75 ? "sujeita a cheias" : v >= 0.5 ? "tendência média a cheias" : "alongada: pouco sujeita a cheias"; } },
    Ic: { nome: "Índice de circularidade", un: "", ler: function (v) { return v >= 0.51 ? "tende a circular: escoamento concentrado" : "alongada: escoamento mais distribuído"; } },
    Dd: { nome: "Densidade de drenagem", un: "km/km²", ler: function (v) { return v < 0.5 ? "drenagem pobre" : v < 1.5 ? "drenagem regular" : v < 2.5 ? "drenagem boa" : v < 3.5 ? "muito bem drenada" : "excepcionalmente bem drenada"; } },
    Dh: { nome: "Densidade hidrográfica", un: "canais/km²", ler: function () { return "capacidade de gerar novos canais"; } },
    Cm: { nome: "Coeficiente de manutenção", un: "m²/m", ler: function () { return "área necessária para manter 1 m de canal"; } },
    Eps: { nome: "Extensão do percurso superficial", un: "km", ler: function () { return "distância média da vertente até um canal"; } },
    Rb: { nome: "Relação de bifurcação", un: "", ler: function (v) { return v < 3 ? "baixa: relevo suave ou rede pouco ramificada" : v <= 5 ? "típica de rede natural sem controle estrutural forte" : "alta: indício de controle estrutural"; } },
    RL: { nome: "Relação de comprimento", un: "", ler: function () { return "lei de Horton dos comprimentos"; } },
    Hm: { nome: "Amplitude altimétrica", un: "m", ler: function () { return "energia disponível do relevo"; } },
    Rr: { nome: "Relação de relevo", un: "m/m", ler: function () { return "declividade geral da bacia"; } },
    Ir: { nome: "Índice de rugosidade", un: "", ler: function () { return "quanto maior, mais dissecado e íngreme"; } },
    HI: { nome: "Integral hipsométrica", un: "", ler: function (v) { return v > 0.6 ? "relevo jovem, pouco dissecado" : v >= 0.35 ? "relevo maduro" : "relevo senil (muito erodido)"; } },
    S: { nome: "Declividade do canal principal", un: "m/m", ler: function () { return "controla a velocidade da água no canal"; } },
    tc: { nome: "Tempo de concentração (Kirpich)", un: "min", ler: function (v) { return v < 30 ? "resposta muito rápida à chuva" : v < 90 ? "resposta rápida" : "resposta lenta"; } },
    Is: { nome: "Índice de sinuosidade", un: "", ler: function (v) { return v < 1.05 ? "retilíneo (natural raro: canal retificado?)" : v <= 1.5 ? "transicional" : "meandrante"; } }
  };

  // ---------- Análise completa de uma bacia simulada ----------
  function analisarBacia(t, dir, acc, hier, exutorio, limiar) {
    var W = t.W, H = t.H, cel = t.cel, z = t.z, mask = bacia(dir, W, H, exutorio);
    var n = 0, hmax = -Infinity, hmin = Infinity, hsoma = 0, Lt = 0, Nu = [], Lu = [];
    var ox = exutorio % W, oy = (exutorio - ox) / W, Lb = 0;
    for (var c = 0; c < W * H; c++) {
      if (!mask[c]) continue;
      n++; if (z[c] > hmax) hmax = z[c]; if (z[c] < hmin) hmin = z[c]; hsoma += z[c];
      var cx = c % W, cy = (c - cx) / W, dd = Math.hypot(cx - ox, cy - oy);
      if (dd > Lb) Lb = dd;
      if (acc[c] < limiar || c === exutorio) continue;
      var k = dir[c], comp = k < 0 ? 0 : DIST[k] * cel / 1000, u = hier.strahler[c];
      Lt += comp;
      while (Nu.length < u) { Nu.push(0); Lu.push(0); }
      Lu[u - 1] += comp;
      // um canal de ordem u começa onde nenhum afluente da rede tem a mesma ordem
      var inicio = true;
      for (var q = 0; q < 8 && inicio; q++) {
        var nx = cx + DX[q], ny = cy + DY[q];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        var nb = ny * W + nx;
        if (acc[nb] >= limiar && jusante(dir, W, nb) === c && hier.strahler[nb] === u) inicio = false;
      }
      if (inicio) Nu[u - 1]++;
    }
    // canal principal: do exutório para montante, sempre pelo afluente de maior acumulação
    var canal = [exutorio], atual = exutorio;
    for (;;) {
      var ax = atual % W, ay = (atual - ax) / W, prox = -1;
      for (var p = 0; p < 8; p++) {
        var mx = ax + DX[p], my = ay + DY[p];
        if (mx < 0 || my < 0 || mx >= W || my >= H) continue;
        var m2 = my * W + mx;
        if (jusante(dir, W, m2) === atual && acc[m2] >= limiar && (prox < 0 || acc[m2] > acc[prox])) prox = m2;
      }
      if (prox < 0) break;
      canal.push(prox); atual = prox;
    }
    canal.reverse(); // nascente → exutório
    var perfil = [], s = 0;
    for (var i = 0; i < canal.length; i++) {
      if (i > 0) { var a = canal[i - 1], b = canal[i]; s += Math.hypot(a % W - b % W, Math.floor(a / W) - Math.floor(b / W)) * cel / 1000; }
      perfil.push({ d: s, z: z[canal[i]] });
    }
    var nasc = canal[0], Dv = Math.hypot(nasc % W - ox, Math.floor(nasc / W) - oy) * cel / 1000;
    var medidas = {
      A: n * cel * cel / 1e6, P: perimetro(mask, W, H, cel) / 1000, L: s, Lb: Lb * cel / 1000, Lt: Lt,
      N: Nu.reduce(function (x, y) { return x + y; }, 0), Nu: Nu, Lu: Lu,
      Hmax: hmax, Hmin: hmin, Hmed: hsoma / n, dH: z[nasc] - z[exutorio], Dv: Dv, ordemMax: Nu.length
    };
    return { mask: mask, canal: canal, perfil: perfil, medidas: medidas, indices: indices(medidas) };
  }

  // Tudo que depende só do relevo, calculado uma vez por paisagem.
  function prepararRelevo(t) {
    var f = preencher(t.z, t.W, t.H), dir = d8(f, t.W, t.H), ordem = ordemTopologica(dir, t.W, t.H);
    return { f: f, dir: dir, ordem: ordem, acc: acumulacao(dir, t.W, t.H, ordem) };
  }

  // Sombreamento (azimute 315°, elevação 45°) → 0..1
  function sombreamento(z, W, H, cel) {
    var out = new Float32Array(W * H), az = 315 * Math.PI / 180, alt = 45 * Math.PI / 180;
    function g(x, y) { x = Math.max(0, Math.min(W - 1, x)); y = Math.max(0, Math.min(H - 1, y)); return z[y * W + x]; }
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var dzdx = (g(x + 1, y) - g(x - 1, y)) / (2 * cel), dzdy = (g(x, y + 1) - g(x, y - 1)) / (2 * cel);
      var slope = Math.atan(Math.hypot(dzdx, dzdy)), aspect = Math.atan2(dzdy, -dzdx);
      out[y * W + x] = Math.max(0, Math.cos(alt) * Math.cos(slope) + Math.sin(alt) * Math.sin(slope) * Math.cos(az - aspect));
    }
    return out;
  }

  // ---------- Árvore para o jogo de hierarquia ----------
  // Nós: { filhos: [..] }. Devolve lista de trechos com strahler/shreve já calculados.
  function gerarArvore(seed, minFolhas) {
    var r = rng(seed);
    for (var tentativa = 0; tentativa < 50; tentativa++) {
      var folhas = 0;
      var crescer = function (prof) {
        if (prof >= 5 || (prof > 1 && r() < 0.28 + prof * 0.09)) { folhas++; return { filhos: [] }; }
        return { filhos: [crescer(prof + 1), crescer(prof + 1)] };
      };
      var raiz = crescer(0);
      if (folhas >= (minFolhas || 6) && folhas <= 12) return ordenarArvore(raiz);
    }
    return ordenarArvore(raiz);
  }
  function ordenarArvore(no) {
    no.filhos.forEach(ordenarArvore);
    if (!no.filhos.length) { no.strahler = 1; no.shreve = 1; return no; }
    var ords = no.filhos.map(function (f) { return f.strahler; }), mx = Math.max.apply(null, ords);
    no.strahler = ords.filter(function (o) { return o === mx; }).length >= 2 ? mx + 1 : mx;
    no.shreve = no.filhos.reduce(function (s, f) { return s + f.shreve; }, 0);
    return no;
  }

  var Hidro = {
    rng: rng, gerarRelevo: gerarRelevo, preencher: preencher, d8: d8, jusante: jusante,
    ordemTopologica: ordemTopologica, acumulacao: acumulacao, ajustarExutorio: ajustarExutorio,
    bacia: bacia, hierarquia: hierarquia, perimetro: perimetro, indices: indices, INDICES: INDICES,
    analisarBacia: analisarBacia, prepararRelevo: prepararRelevo, sombreamento: sombreamento,
    gerarArvore: gerarArvore, ordenarArvore: ordenarArvore
  };
  if (typeof module !== "undefined" && module.exports) module.exports = Hidro;
  else root.Hidro = Hidro;
})(typeof self !== "undefined" ? self : this);
