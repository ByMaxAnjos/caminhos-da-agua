// Checagem mínima do núcleo hidrológico: node test_hidro.js
const assert = require("assert");
const H = require("./assets/hidro.js");

// D8 num plano inclinado para o sul: todas as células internas apontam para baixo (k=2)
{
  const W = 5, Hh = 5, z = new Float32Array(W * Hh);
  for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) z[y * W + x] = 100 - y * 10;
  const dir = H.d8(H.preencher(z, W, Hh), W, Hh);
  assert.strictEqual(dir[2 * W + 2], 2, "D8 deveria apontar para o sul");
}

// Relevo sintético: sem depressões após preencher, acumulação conserva células
{
  const t = H.gerarRelevo({ seed: 7, W: 60, H: 45 });
  const r = H.prepararRelevo(t);
  let saidas = 0, somaSaida = 0;
  for (let c = 0; c < t.W * t.H; c++) if (r.dir[c] < 0) { saidas++; somaSaida += r.acc[c]; }
  assert.strictEqual(somaSaida, t.W * t.H, "toda célula deve sair da grade por algum exutório");
  // célula interna sem saída = depressão não tratada
  for (let y = 1; y < t.H - 1; y++) for (let x = 1; x < t.W - 1; x++) assert(r.dir[y * t.W + x] >= 0, "depressão interna");

  // bacia de um exutório: nº de células = acumulação no exutório
  let ex = 0; for (let c = 0; c < t.W * t.H; c++) if (r.acc[c] > r.acc[ex]) ex = c;
  const limiar = 40, hier = H.hierarquia(r.dir, r.acc, t.W, t.H, limiar, r.ordem);
  const a = H.analisarBacia(t, r.dir, r.acc, hier, ex, limiar);
  const n = a.mask.reduce((s, v) => s + v, 0);
  assert.strictEqual(n, r.acc[ex], "bacia ≠ acumulação no exutório");
  assert(a.medidas.ordemMax >= 2 && a.indices.Kc >= 1 && a.indices.tc > 0, "morfometria incoerente");
  assert.strictEqual(a.medidas.Nu[a.medidas.Nu.length - 1], 1, "a maior ordem deve ter um único canal");
  // Shreve no exutório = nº de nascentes (canais de 1ª ordem)
  assert.strictEqual(hier.shreve[ex], a.medidas.Nu[0], "Shreve ≠ nº de nascentes");
}

// Strahler numa árvore conhecida: (1+1)=2, (2+1)=2, (2+2)=3
{
  const f = () => ({ filhos: [] });
  const raiz = H.ordenarArvore({ filhos: [{ filhos: [{ filhos: [f(), f()] }, f()] }, { filhos: [f(), f()] }] });
  assert.strictEqual(raiz.strahler, 3);
  assert.strictEqual(raiz.shreve, 5);
}

// Kc de um círculo ≈ 1 (fórmula) e de um círculo rasterizado próximo de 1 (perímetro)
{
  const R = 3; // km
  assert(Math.abs(H.indices({ A: Math.PI * R * R, P: 2 * Math.PI * R }).Kc - 1) < 0.01);
  const W = 101, mask = new Uint8Array(W * W);
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) if (Math.hypot(x - 50, y - 50) <= 40) mask[y * W + x] = 1;
  const A = mask.reduce((s, v) => s + v, 0) * 0.0009, P = H.perimetro(mask, W, W, 30) / 1000;
  const kc = H.indices({ A, P }).Kc;
  assert(kc > 0.98 && kc < 1.1, "Kc do círculo raster = " + kc);
}

console.log("hidro: ok");
