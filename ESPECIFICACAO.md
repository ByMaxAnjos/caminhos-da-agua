# Caminhos da Água v2: Unidade II (bacia hidrográfica + SIG)

App web (PWA) de GEO164 Hidrogeografia (UFJF) para a Unidade II: a bacia hidrográfica como unidade de análise.
Fonte do conteúdo: `../plano_unidade_II_bacia_SIG.md`. A v1 (investigação "cebola", Unidades I–III)
está preservada no git: tag `v1-cebola`.

## Público e princípios
- Turma de 20–40 alunos, no celular ou no laboratório. Sem login e sem backend: tudo fica no aparelho (`localStorage`, prefixo `cda2:`).
- Situação-problema (PBL): *por que alguns córregos de Juiz de Fora responderam mais rápido às chuvas de fevereiro de 2026?*
- Em cada encontro o aluno escreve a hipótese **antes** de ver o conteúdo.
- O relevo do simulador é **sintético e didático**, não Juiz de Fora. Os dados reais vêm do QGIS e entram pela calculadora.

## Telas
| Rota | O que faz |
|---|---|
| `#/inicio` | Nome/equipe e a pergunta da unidade |
| `#/trilha`, `#/encontro/N` | 7 encontros: hipótese → ideias-chave → prática → quiz. Um encontro conclui com hipótese registrada + quiz certo. |
| `#/simulador` | Relevo sintético (circular/alongado), limiar de acumulação, exutório por toque (com ajuste ao canal), Strahler/Shreve, 16 índices, perfil longitudinal, curva hipsométrica, experimento de limiar, bacias A/B |
| `#/calculadora` | Medidas do QGIS → 16 índices com leitura, duas bacias lado a lado |
| `#/jogo` | Ordenar uma rede por Strahler ou Shreve, com correção |
| `#/sinuosidade` | Is = L/Dv, trecho natural × retificado |
| `#/qgis/N` | Roteiros marcáveis por encontro, armadilhas, problemas frequentes |
| `#/relatorio` | Resumo; imprimir/PDF, baixar HTML, exportar JSON |

## Arquivos
- `index.html`: página única.
- `assets/hidro.js`: cálculo puro (relevo, priority-flood, D8, acumulação, bacia, Strahler/Shreve, perímetro por marching squares, índices).
- `assets/conteudo.js`: textos, quizzes e roteiros.
- `assets/app.js`: interface.
- `assets/app.css`: tema Aurora.
- `sw.js`: cache `caminhos-da-agua-v4`, rede primeiro. **Suba a versão a cada publicação.**
- `test_hidro.js`: `node test_hidro.js` deve imprimir `hidro: ok`.

## Editar conteúdo
Tudo em `assets/conteudo.js`: `encontros[].ideias`, `quiz` (`correta` = índice da opção, começando em 0), `qgis`, `armadilhas` e `problemas`. As faixas de interpretação dos índices ficam em `Hidro.INDICES` (`assets/hidro.js`).
