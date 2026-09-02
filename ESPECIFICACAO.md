# Caminhos da Água

**Água, território e sociedade em conexão**

> Toda água percorre caminhos. Para compreender uma bacia, é preciso investigar todos eles.

Especificação de produto — v1.0 · 02/09/2026
Disciplina de origem: GEO164 — Hidrogeografia · UFJF · 2026/2 · Prof. Dr. Max Anjos

Convenção usada em todo o documento: **[dado local]** marca informação que muda conforme a bacia
investigada e precisa ser curada antes de a missão ir ao ar.

---

## 1. Resumo executivo

**O que é.** Um aplicativo web instalável (PWA) em que o estudante de Geografia investiga uma bacia
hidrográfica real como sistema complexo socioambiental. Ele percorre seis camadas de análise, coleta e
classifica evidências, **cria conexões direcionadas entre camadas**, formula hipóteses, escreve uma explicação
e propõe uma ação de gestão.

**Por que existe.** A hidrografia é ensinada e aprendida como descrição — nome de rio, extensão, afluente,
foz. O aplicativo força a operação cognitiva que a descrição não exige: dizer *o que causa o quê, em que
direção, com base em qual evidência*.

**A aposta central de produto.** A unidade de valor do app não é a resposta certa, é a **conexão**. Evidência
sozinha vale pouco; conexão entre duas camadas sustentada por evidência nas duas pontas é o que gera ponto,
progresso e conquista. Quem só lê e responde perguntas não avança.

**O que ele não é.** Não é questionário, não é quiz cronometrado, não é banco de conteúdo. As seis lições
teóricas do curso continuam sendo o material de estudo; o app é onde o aluno *usa* aquilo.

**Alavanca decisiva.** O modelo das seis camadas não é novo: já é o framework oficial do curso, registrado em
`learning-records/0002-modelo-camadas-cebola.md`, sintetizado em
`reference/0001-modelo-camadas-hidrogeografia.html` e aprofundado nas Lições 4 a 8, cada uma com um mecanismo
causal e um exercício calculável à mão. **O app operacionaliza conteúdo já escrito e validado**, o que reduz
o MVP a um problema de interface e de dados, não de autoria.

**Escopo do primeiro protótipo.** Uma bacia (Rio Paraibuna e os córregos Ipiranga e Teixeiras), uma missão
(as enchentes de Juiz de Fora de fevereiro e junho de 2026), seis camadas, HTML estático com armazenamento
local no aparelho, sem servidor e sem login, distribuído pelo Google Classroom, funcionando offline em campo.
Validação em uma aula de 50 minutos com a turma real de GEO164 no próprio semestre.

**Decisões estruturais já fechadas.**

| Decisão | Escolha | Motivo |
|---|---|---|
| Público | Graduação em Geografia (GEO164) | Alinha ao curso real, reaproveita conteúdo pronto, tem turma para validar já |
| Metáfora | Cebola **porosa**, fluxos nos dois sentidos | O modelo do curso proíbe explicitamente o funil de mão única |
| Stack | PWA em HTML/CSS/JS puro, `localStorage`, export/import JSON | Mesmo stack das lições, zero backend, zero custo, offline em campo, sem dado pessoal em nuvem |
| Avaliação | Nota é do professor, por rubrica; app dá pontos de investigação | Texto aberto não é corrigível automaticamente sem servidor — e não deveria ser |

---

## 2. Conceito pedagógico

### 2.1 O problema de aprendizagem

O aluno chega sabendo *descrever* hidrografia e sai da disciplina precisando saber *explicar* uma bacia.
Entre descrever e explicar há três operações que o ensino tradicional raramente exercita:

1. **Atribuir direção causal** — não "o relevo e o rio estão relacionados", mas "esta declividade de 25%
   nesta encosta acelera o escoamento e antecipa o pico de cheia neste trecho do canal".
2. **Ancorar afirmação em evidência** — dizer com base em quê: uma série de precipitação, um mapa de uso do
   solo, uma medida de pH, um relato de morador, um artigo da lei.
3. **Rever a própria interpretação** — trocar uma hipótese por outra quando a evidência não fecha, e saber
   dizer por que trocou.

O aplicativo é uma máquina de exercitar essas três operações, repetidamente, sobre território conhecido.

### 2.2 Alinhamento com as estratégias didáticas já adotadas

O app não introduz metodologia nova. Ele instrumenta o que `plano_disciplina.md` já prevê:

| Estratégia do plano de curso | Como o app a executa |
|---|---|
| Aprendizagem Baseada em Problemas (ABP/PBL) | Toda missão parte de uma situação-problema real e o app só libera a síntese depois de o aluno passar pelas camadas |
| Ensino por investigação em campo | Tela de hipótese **bloqueia** antes da coleta: o aluno registra o que espera encontrar, depois registra o que encontrou, e o app confronta as duas versões |
| Sala de aula invertida (parcial) | Cada camada linka a lição correspondente para leitura prévia; o tempo de aula fica para conexões e debate |
| Aprendizagem colaborativa | Missão de equipe: cada integrante assume camadas diferentes e as conexões só fecham cruzando evidências de colegas |
| Avaliação formativa contínua | Feedback processual por camada e "revisão" como ação premiada, não penalizada |
| Comunicação científica | A síntese final exporta em formato aproveitável no pôster/laudo da Avaliação 2 |

### 2.3 A cebola porosa — e a regra que a governa

A representação é concêntrica (miolo hidrográfico ao centro, seis camadas em volta), mas **os fluxos são
bidirecionais e obrigatoriamente explícitos**. A regra vem de `learning-records/0002` e é aplicada na
interface, não só no discurso:

- **De fora para dentro** (condicionamento): o clima define quanto e quando chove; a declividade acelera o
  escoamento; o solo define quanto infiltra; a vegetação regula a chegada da água; a sociedade impermeabiliza
  e retifica; a política outorga e restringe.
- **De dentro para fora** (o rio como agente): o rio escava e deposita, refazendo o relevo; fertiliza várzeas
  e sustenta ecossistemas; organiza onde a cidade nasce e por onde cresce; condiciona economias; produz risco
  de inundação; e, ao produzir risco e conflito, **força a existência de política pública**.

Consequência de interface, não negociável: nenhuma tela pode desenhar o modelo como funil. Toda conexão
criada pelo aluno carrega direção, e as conexões de dentro para fora — as que os estudantes esquecem —
valem mais pontos (ver §7).

### 2.4 Progressão: do reconhecimento à intervenção

Cinco níveis cognitivos, que também são a progressão de jogo (§7.4) e os "caminhos" da identidade do produto:

| Nível | Operação | Verbo | Evidência de que o aluno chegou lá |
|---|---|---|---|
| 1. Reconhecer | Identificar elementos da bacia | localizar | Nomeia nascente, canal principal, divisor, foz no mapa |
| 2. Descrever | Caracterizar cada camada | caracterizar | Preenche cada camada com evidência classificada |
| 3. Relacionar | Ligar duas camadas com direção | conectar | Cria conexões com evidência nas duas pontas |
| 4. Explicar | Encadear causas em sistema | explicar | Monta cadeia de efeito dominó com ≥3 elos e ≥3 camadas |
| 5. Intervir | Propor ação viável e situada | propor | Propõe ação, indica camada-alvo, quem executa e o que pode dar errado |

Nenhum nível é destravado por tempo de uso. O nível 4 exige conexões nas duas direções; o nível 5 exige que
a ação proposta seja rastreável a alguma evidência registrada pelo próprio aluno.

### 2.5 Papéis

**Aluno — investigador.** Escolhe um recorte, lê o problema, percorre camadas, classifica evidências,
formula hipótese *antes* de ver os dados, conecta, explica, propõe, revisa. Nunca "responde ao app": produz
um dossiê que outra pessoa vai ler.

**Professor — editor da investigação, não corretor de gabarito.** Define missão e bacia, cura as cartas de
evidência **[dado local]**, importa os dossiês das equipes, lê, comenta, aplica rubrica e usa o painel para
ver onde a turma travou — que camada ficou vazia, que conexão ninguém fez.

**Equipe — unidade de investigação.** Divisão de camadas entre integrantes, com conexões que só fecham
cruzando evidência coletada por outro (ver §7.8).

### 2.6 Avaliação e amarração com as três notas da disciplina

O app produz **pontos de investigação** (feedback processual, dentro do app) e **artefatos** (o dossiê
exportado, que é o que vale nota). Ponto não é nota — a separação é deliberada, para o aluno não confundir
progresso de jogo com desempenho acadêmico.

| Avaliação do plano de curso | Pontos | O que o app alimenta |
|---|---|---|
| Av. 1 — prova individual, Unidade I | 20 | Preparação: as missões curtas de camada funcionam como recall practice antes da prova |
| Av. 2 — pôster/relatório de campo | 40 | O dossiê exportado fornece as evidências de campo classificadas, com data, local e autor |
| Av. 3 — projeto sobre os corpos hídricos de JF | 40 | É a missão demonstrativa (§8) levada até a proposta de intervenção e a defesa oral |

**Rubrica de correção do dossiê** (a mesma que o app usa como espinha dorsal das telas, para o aluno saber o
que se espera dele):

| Critério | Peso | O que se avalia |
|---|---|---|
| Qualidade das evidências | 20% | Pertinência, classificação correta do tipo, fonte identificada |
| Correção das conexões | 30% | Direção causal plausível, mecanismo nomeado, evidência nas duas pontas |
| Coerência da explicação | 25% | A síntese decorre das conexões declaradas, sem salto lógico |
| Viabilidade da ação proposta | 15% | Ação situada, com responsável e limitação reconhecida |
| Revisão e honestidade intelectual | 10% | O aluno mudou de hipótese quando a evidência pediu, e disse por quê |

---

## 3. Público e objetivos

### 3.1 Público-alvo

**Primário:** estudantes de graduação em Geografia matriculados em GEO164 — Hidrogeografia (UFJF). Turma de
20 a 40 alunos, celular próprio Android/iOS, conectividade instável no campo, familiaridade média com QGIS
adquirida na Unidade II.

**Secundário:** estudantes de GEO316 — Prática de Hidrogeografia e participantes do projeto de extensão
(ciclo de palestras + visita técnica ao Comitê de Bacia dos Afluentes Mineiros dos Rios Preto e Paraibuna),
que podem usar o app como caderno de campo estruturado na visita.

**Não é público desta versão:** ensino fundamental e médio. A linguagem, as fontes normativas (Lei 9.433/1997,
CONAMA 357/2005, Lei 12.651/2012) e o nível de exigência das conexões são de ensino superior. Adaptação para
a escola é item de roadmap (§12), não do MVP — e exigiria reescrever todo o conteúdo, não só simplificar
palavras.

### 3.2 Objetivos de aprendizagem

Ao final de uma missão completa, o estudante é capaz de:

1. **Delimitar** o objeto hidrográfico investigado e situá-lo na hierarquia fluvial (ordem de Strahler).
2. **Caracterizar** cada uma das seis camadas com pelo menos uma evidência empírica identificada por fonte.
3. **Formular** uma hipótese explícita antes de acessar os dados e reconhecer, depois, se ela se sustentou.
4. **Estabelecer** conexões causais direcionadas entre camadas, nomeando o mecanismo (não só a correlação).
5. **Reconhecer** o rio como agente — que transforma relevo, ecossistema, cidade, economia e agenda política.
6. **Identificar** conflitos de uso e desigualdades de acesso à água no recorte investigado.
7. **Explicar** por escrito o comportamento hidrológico do recorte, encadeando causas de camadas distintas.
8. **Propor** uma ação de gestão ou conservação viável, indicando instrumento, responsável e limitação.
9. **Revisar** a própria explicação diante de evidência nova, registrando o que mudou e por quê.

### 3.3 Competências desenvolvidas

- **Raciocínio geográfico** — escala, localização, conexão, diferenciação de lugares.
- **Pensamento sistêmico** — retroalimentação, efeito indireto, atraso entre causa e efeito.
- **Alfabetização em dados** — ler série de precipitação, mapa temático, tabela de parâmetro físico-químico.
- **Argumentação baseada em evidência** — distinguir dado, inferência e opinião.
- **Leitura socioambiental crítica** — identificar quem ganha e quem perde na configuração hídrica atual
  (lastro teórico: ciclo hidrossocial e ecologia política da água, §4).
- **Colaboração** — divisão de investigação e integração de achados alheios.
- **Comunicação científica** — sintetizar dossiê em texto e material apresentável.

### 3.4 Critérios de sucesso do produto (não do aluno)

| Indicador | Meta no protótipo |
|---|---|
| Conclusão da missão | ≥ 70% das equipes concluem a síntese em uma aula de 50 min |
| Densidade de conexões | Média ≥ 6 conexões por equipe, com ≥ 2 na direção de dentro para fora |
| Uso offline | Missão completável com o aparelho em modo avião, após a primeira abertura |
| Sobrevivência do dado | Zero equipe perde o dossiê entre a coleta em campo e a entrega |
| Percepção do aluno | ≥ 70% relatam que o app os fez perceber relação que não tinham percebido |

---

## 4. Modelo das seis camadas

Miolo: **objeto hidrográfico investigado** — rio, córrego, nascente, lago, aquífero ou bacia. Todo miolo tem
recorte espacial declarado e ordem de Strahler.

Cada camada abaixo traz: conceitos fundamentais · perguntas-guia (as que o app faz ao aluno) · evidências
analisáveis · conexões com outras camadas (com direção) · erros conceituais que o app deve ativamente
impedir. As fontes citadas existem em `RESOURCES.md` ou em `plano_disciplina.md` — nenhuma foi inventada.

---

### Camada 1 — Sistema climático · *Caminho do clima*

Base de conteúdo: `lessons/0004-camada1-sistema-climatico.html`

**Conceitos fundamentais.** Desigualdade de aquecimento latitudinal como motor da circulação; células de
Hadley, Ferrel e Polar; Zona de Convergência Intertropical (ZCIT); massas de ar atuantes no Brasil (mEc, mEa,
mTa, mTc, mPa); frentes frias como mecanismo de chuva no Sudeste; Zona de Convergência do Atlântico Sul
(ZCAS) como reguladora do verão chuvoso no Sudeste e pano de fundo dos eventos extremos; classificação de
Köppen; sazonalidade e sua medida.

**Perguntas-guia.**
- Quanto chove aqui, e principalmente *quando*?
- Qual mecanismo traz essa chuva — convecção de verão, frente fria, ZCAS estacionária?
- A chuva é concentrada ou distribuída no ano? Quanto?
- O evento que estamos investigando foi chuva de que tipo, e de que intensidade em relação à normal?

**Evidências analisáveis.** Normais climatológicas do INMET para a estação mais próxima **[dado local]**;
série diária de precipitação do evento **[dado local]**; boletins e alertas do CEMADEN **[dado local]**;
imagem de satélite de nebulosidade do período; classificação de Köppen do recorte.

**Exercício herdado da lição.** Índice de sazonalidade calculado à mão sobre a normal real da estação.

**Conexões.**
- → C2: define o volume e a intensidade de entrada de água no sistema.
- → C4: o regime de chuva e a temperatura condicionam o tipo de vegetação possível.
- → C5: sazonalidade define calendário agrícola e demanda de irrigação.
- ← C4: a evapotranspiração da vegetação devolve umidade à atmosfera e influencia a chuva regional.
- ← C5: urbanização produz ilha de calor e altera a chuva convectiva local.

**Erros a impedir.**
- Confundir *tempo* com *clima* — ler um evento extremo como mudança do clima sem série histórica.
- Atribuir a chuva de JF à ZCIT (que atua mais ao norte) em vez da ZCAS.
- Tratar "choveu muito" como explicação suficiente de enchente: o app não aceita síntese que use só a C1.

---

### Camada 2 — Ciclo hidrológico · *Caminho da água*

Base de conteúdo: `lessons/0001-distribuicao-agua-planeta.html` e
`lessons/0002-aguas-superficiais-subterraneas.html` (esta camada não tem lição própria — ver
`learning-records/0003`).

**Conceitos fundamentais.** Balanço hídrico: precipitação = evapotranspiração + escoamento + infiltração +
armazenamento; a partição da chuva no momento em que ela atinge a superfície; interceptação; escoamento
superficial, subsuperficial e de base; recarga de aquífero; tempo de concentração da bacia; hidrograma e pico
de cheia; distribuição e disponibilidade hídrica no planeta e no Brasil (Rebouças); passagem do ciclo
hidrológico ao **ciclo hidrossocial** (Imbelloni & Felippe) — a água que circula já é socialmente apropriada.

**Perguntas-guia.**
- Onde a chuva se divide aqui: infiltra, escoa ou evapora — e em que proporção?
- Quanto tempo a água leva para chegar ao canal?
- De onde vem a água do rio na estiagem?
- Quem já se apropriou dessa água antes de ela chegar aqui?

**Evidências analisáveis.** Série fluviométrica da ANA para a estação do recorte **[dado local]**; hidrograma
do evento **[dado local]**; percentual de área impermeabilizada **[dado local]**; nível de poços; balanço
hídrico da bacia publicado pelo comitê **[dado local]**.

**Conexões.**
- → miolo: define vazão, nível e regime do corpo hídrico.
- ← C1: recebe a entrada de água.
- ← C3: declividade e permeabilidade do solo definem a partição entre infiltrar e escoar.
- ← C4: a vegetação intercepta, retarda e favorece infiltração.
- ← C5: impermeabilização e canalização aumentam e antecipam o escoamento — **é aqui que entra o dado da
  Lição 2: em cobertura natural cerca de 10% da chuva vira escoamento superficial; quando a impermeabilização
  atinge 30–50% da superfície, esse percentual sobe para cerca de 55%** (EPA, 1998, reproduzido por Paz,
  2004). O número é coeficiente de escoamento, não área impermeável — a distinção importa e o app não deve
  deixar o aluno confundir as duas coisas.
- → C5: a disponibilidade condiciona abastecimento, indústria e irrigação.

**Erros a impedir.**
- Desenhar o ciclo como circuito fechado e natural, sem apropriação humana (é exatamente o que o ciclo
  hidrossocial corrige).
- Tratar infiltração e escoamento como independentes: são partição do mesmo total; o que não infiltra, escoa.
- Supor que abundância nacional significa ausência de escassez local (Rebouças: abundância, desperdício **e**
  escassez convivem).

---

### Camada 3 — Solos, geologia e relevo · *Caminho do relevo*

Base de conteúdo: `lessons/0005-camada3-solos-relevo.html`

**Conceitos fundamentais.** Declividade como controle mais direto da velocidade do escoamento; solo como
filtro entre superfície e subsolo (textura, estrutura, porosidade, compactação); canal encaixado x meandrante;
planície de inundação como parte do rio, não como terreno vago; aquíferos livres, confinados, porosos e
fissurais (Feitosa & Manoel Filho); hierarquia fluvial de Strahler; densidade de drenagem e forma da bacia
como controles do tempo de concentração.

**Perguntas-guia.**
- Qual a declividade média das encostas que drenam para este trecho?
- O canal está encaixado ou tem planície? Onde está a planície de inundação?
- Que ordem de Strahler tem o canal onde estamos?
- O substrato favorece infiltração profunda ou escoamento rápido?

**Evidências analisáveis.** MDE e mapa de declividade **[dado local]**; perfil topográfico produzido na
prática de QGIS da Unidade II; carta geológica **[dado local]**; mapa de solos **[dado local]**; foto de
barranco e de trecho canalizado tirada em campo.

**Exercício herdado da lição.** Ordenação de Strahler feita no papel sobre a rede de drenagem do recorte.

**Conexões.**
- → C2: define a partição infiltração/escoamento e o tempo de concentração.
- → C4: relevo e solo condicionam que vegetação se estabelece.
- → C5: relevo define onde a cidade pôde se instalar — e a planície ocupada é escolha, não acidente.
- ← miolo: **o rio esculpe o relevo** — erode, transporta, deposita, constrói a própria planície.
- ← C5: corte de encosta, aterro, retificação e canalização reconfiguram o relevo em escala de anos.

**Erros a impedir.**
- Ler o relevo como cenário fixo, e não como produto (parcialmente) da ação do próprio rio.
- Chamar planície de inundação de "área vazia": ela é o rio em cheia, e ocupá-la é assumir risco.
- Confundir declividade alta com "mais erosão" sem considerar cobertura vegetal e tipo de solo.

---

### Camada 4 — Vegetação e ecossistemas · *Caminho dos ecossistemas*

Base de conteúdo: `lessons/0006-camada4-vegetacao-ecossistemas.html`

**Conceitos fundamentais.** Dois mecanismos em dois tempos — interceptação/infiltração (efeito rápido,
escala do evento de chuva) e evapotranspiração/reciclagem de umidade (efeito lento, escala regional); função
específica da mata ciliar; Área de Preservação Permanente como tradução legal da função ecológica
(Lei 12.651/2012, art. 4º); serviços ecossistêmicos aquáticos; ordem em que as funções se perdem no
desmatamento; áreas úmidas e nascentes (Felippe).

**Perguntas-guia.**
- Qual a cobertura vegetal das margens deste trecho, hoje?
- Que faixa de APP a lei exige aqui, dada a largura do curso d'água?
- O que se perde primeiro quando essa faixa desaparece?
- A vegetação a montante ainda regula a chegada da água até aqui?

**Evidências analisáveis.** Imagem de satélite recente e histórica do recorte **[dado local]**; mapa de uso e
cobertura do solo **[dado local]**; largura medida do curso d'água (define a faixa de APP); foto de margem
com e sem mata ciliar; inventário de fauna aquática, quando houver **[dado local]**.

**Exercício herdado da lição.** Cálculo da faixa de APP exigida pelo art. 4º da Lei 12.651/2012 a partir da
largura medida do curso d'água, e do raio de APP de nascente — comparado com a faixa que existe de fato.

**Conexões.**
- → C2: intercepta, retarda e favorece infiltração; reduz e atrasa o pico de cheia.
- → C1: devolve umidade por evapotranspiração.
- → C3: raízes estabilizam encosta e reduzem erosão.
- → miolo: sombreia, controla temperatura da água e fornece matéria orgânica.
- ← miolo: **o rio sustenta a mata ciliar** — o lençol raso da várzea é o que permite aquela vegetação
  específica existir.
- ← C5: desmatamento, pastagem e ocupação de margem removem a camada.
- ← C6: a APP é instrumento legal — a camada 4 é, em parte, produto de política pública.

**Erros a impedir.**
- Tratar vegetação como cenário ou ornamento ("a mata deixa o rio bonito").
- Achar que reflorestar resolve enchente urbana isoladamente, ignorando a área já impermeabilizada.
- Aplicar faixa de APP única para qualquer rio: a faixa depende da largura do curso d'água.

---

### Camada 5 — Sociedade e economia · *Caminho da sociedade*

Base de conteúdo: `lessons/0007-camada5-socioeconomica.html`

**Conceitos fundamentais.** Usos da água e a hierarquia real de consumo (a agricultura irrigada consome
muito mais que o abastecimento urbano — resultado que contraria a intuição do aluno); usos que competem entre
si e usos que se excluem; água virtual e pegada hídrica (Carmo et al.; ordens de grandeza da Water Footprint
Network); o Brasil como "grande exportador" de água embutida em commodities; desigualdade de acesso a água e
saneamento (Libânio et al.; Queiroz et al.); urbanização, impermeabilização e ocupação de planície;
vulnerabilidade socioambiental como distribuição desigual do risco; **ciclo hidrossocial** — a água como
produto de relações sociais, não só de processos físicos (Imbelloni & Felippe).

**Perguntas-guia.**
- Quem usa a água deste recorte, para quê, e em que volume?
- Quais usos entram em conflito aqui?
- Quem ocupa a planície de inundação — e por que essas pessoas, e não outras?
- Quem sofre o dano quando o rio transborda, e quem produziu a condição para o dano?

**Evidências analisáveis.** Densidade demográfica e mancha urbana por período **[dado local]**; percentual de
impermeabilização **[dado local]**; cobertura de esgotamento sanitário por bairro **[dado local]**; mapa de
áreas de risco da Defesa Civil **[dado local]**; matéria de jornal e relato de morador sobre o evento
**[dado local]**; indicadores de renda por setor censitário **[dado local]**.

**Exercício herdado da lição.** Pegada hídrica de um dia da própria alimentação, com valores de ordem de
grandeza da WFN — usados como escala de comparação, nunca como números a decorar.

**Conexões.**
- → C2: impermeabiliza, canaliza, retifica, capta e lança — altera diretamente o ciclo.
- → C3: corta encosta, aterra várzea, reconfigura o relevo.
- → C4: remove ou recompõe a cobertura vegetal.
- → C6: o conflito de uso é o que produz demanda por regulação.
- ← miolo: **o rio organiza a cidade** — define onde ela nasceu, por onde cresceu, onde está o bairro caro e
  onde está a área de risco; condiciona a economia e distribui o dano.
- ← C1: a sazonalidade condiciona o calendário econômico.
- ← C6: outorga, cobrança e enquadramento restringem e redirecionam o uso.

**Erros a impedir.**
- Reduzir "sociedade" a poluição, esquecendo apropriação, conflito e desigualdade.
- Tratar a ocupação da planície como escolha individual descontextualizada, sem mercado de terras nem
  ausência de política habitacional.
- Assumir que o consumo urbano doméstico é o maior uso da água.
- Culpar genericamente "a população" pela enchente: o app exige nomear qual ação, de quem, em que lugar.

---

### Camada 6 — Política, técnica e gestão · *Caminho da gestão*

Base de conteúdo: `lessons/0008-camada6-politica-institucional.html`

**Conceitos fundamentais.** Política Nacional de Recursos Hídricos (Lei 9.433/1997): água como bem de domínio
público e recurso dotado de valor econômico, bacia como unidade de gestão, gestão descentralizada e
participativa, e prioridade do consumo humano e da dessedentação animal em situação de escassez. Os cinco
instrumentos: Plano de Recursos Hídricos, enquadramento dos corpos de água em classes, outorga de direito de
uso, cobrança pelo uso e Sistema de Informações sobre Recursos Hídricos. Comitê de bacia como "parlamento da
água" e sua composição tripartite. Enquadramento e padrões da Resolução CONAMA 357/2005, distintos do padrão
de potabilidade da Portaria GM/MS nº 888. Novo marco do saneamento (Lei 14.026/2020). Monitoramento e alerta
(ANA, INMET, CEMADEN) e gestão de risco pela Defesa Civil. Leitura crítica: a gestão como campo de disputa —
público x privado (Bordalo), a água como disputa epistêmica e política (Ayala/Porto-Gonçalves), geografia
política das águas (Turcato).

**Perguntas-guia.**
- Que comitê de bacia responde por este recorte, e o que diz o plano dele?
- Em que classe este corpo d'água está enquadrado, e a qualidade medida atende essa classe?
- Este uso precisa de outorga? Quem outorgou?
- Existe alerta, mapeamento de risco e plano de contingência para este trecho — e eles funcionaram no evento?
- Quem está na mesa de decisão, e quem não está?

**Evidências analisáveis.** Plano da bacia e atas do comitê **[dado local]**; enquadramento vigente do corpo
d'água **[dado local]**; outorgas emitidas **[dado local]**; plano diretor e lei de uso do solo municipal
**[dado local]**; boletins e alertas emitidos no evento **[dado local]**; painel/observatório hídrico da
bacia **[dado local]**.

**Exercício herdado da lição.** Decidir, para uma lista de usos, quais exigem outorga e quais são
insignificantes, segundo a PNRH.

**Conexões.**
- → C5: regula, autoriza, cobra, proíbe e redistribui o uso.
- → C4: institui APP e unidades de conservação.
- → C2: opera reservatório, define regra de operação e obras de drenagem.
- → C3: licencia (ou não) intervenção em encosta e em canal.
- ← C5: o conflito social é o que gera a política — a camada 6 é resposta, não origem.
- ← miolo: **o rio impõe a agenda** — a cheia de 2026 é que produz plano de contingência, obra e lei.

**Erros a impedir.**
- Confundir os padrões da CONAMA 357 (qualidade de corpo d'água por classe) com potabilidade (Portaria 888):
  água de rio classe 2 não é água de beber.
- Achar que existir lei significa lei aplicada: o app pede evidência de implementação, não de vigência.
- Tratar a gestão como neutra e técnica, sem disputa de interesses.
- Ver a camada 6 como a "camada de fora" que só condiciona: ela é, sobretudo, resposta ao que vem de dentro.

---

### 4.7 Matriz de conexões (o que o app considera plausível)

Marcação: **→** condiciona · **←** é transformado por. Linha = origem, coluna = destino.

| de \ para | Miolo | C1 clima | C2 ciclo | C3 relevo | C4 vegetação | C5 sociedade | C6 gestão |
|---|---|---|---|---|---|---|---|
| **Miolo** | — | umidade local | — | esculpe relevo | sustenta mata ciliar | organiza a cidade, distribui risco | impõe agenda |
| **C1 clima** | regime | — | entrada de água | intemperismo | tipo de vegetação | calendário econômico | política climática |
| **C2 ciclo** | vazão, nível | evaporação | — | erosão, deposição | disponibilidade hídrica | abastecimento | demanda de outorga |
| **C3 relevo** | forma do canal | orografia | partição, tempo de concentração | — | condição de solo | onde a cidade cabe | licenciamento |
| **C4 vegetação** | sombra, matéria orgânica | evapotranspiração | interceptação, infiltração | estabilidade de encosta | — | recurso, serviço | demanda de APP |
| **C5 sociedade** | poluição, retificação | ilha de calor | impermeabilização, captação | corte, aterro | desmatamento | — | pressão por regulação |
| **C6 gestão** | enquadramento | — | operação de reservatório | licença | APP, unidade de conservação | outorga, cobrança | — |

A matriz é o dicionário de mecanismos plausíveis do app: célula vazia não bloqueia o aluno, mas gera o aviso
"conexão incomum — nomeie o mecanismo" e vai para revisão do professor (§7.9).

---

## 5. Fluxos de usuário

### 5.1 Fluxo do aluno (10 passos)

**1. Entrar na turma.** Abre o link do Classroom, digita o código da turma **[dado local]** e o próprio nome
(sem senha, sem e-mail, sem conta — ver §10.7). O app instala-se na tela inicial e baixa a missão para uso
offline.
*Tela:* Inicial → *Estado de erro:* código inexistente → oferece "explorar em modo livre".

**2. Escolher a bacia / recorte.** Seleciona o recorte definido pelo professor ou, em modo livre, cadastra o
próprio (nome, ponto no mapa, tipo de objeto hidrográfico).
*Tela:* Seleção da bacia.

**3. Conhecer o problema.** Lê a situação-problema, vê o que se espera de entrega e **registra sua hipótese
inicial antes de qualquer dado**. Esse registro é obrigatório para prosseguir e fica congelado — o app o
mostrará de novo no fim (passo 9).
*Tela:* T9, aba Briefing (a mesma tela da síntese, aberta na primeira aba — é ali que a hipótese congelada
reaparece no passo 9). *Regra:* sem hipótese, sem acesso às camadas.

**4. Investigar as camadas.** Entra na cebola porosa e escolhe por onde começar. A ordem é livre — a única
restrição é que a síntese exige um mínimo de camadas visitadas. Cada camada mostra suas perguntas-guia e
linka a lição correspondente.
*Telas:* Cebola porosa → Camada.

**5. Coletar e classificar evidências.** Em cada camada, abre as cartas de evidência disponibilizadas pelo
professor, lê, e para cada uma que julgar relevante registra: *o que ela mostra*, *que tipo de evidência é*
(mapa, série de dados, imagem, relato, norma legal, medição de campo) e *o que ela permite concluir*. Pode
criar carta própria em campo (foto, medição, observação, coordenada).
*Tela:* Cartas de evidência. *Estado vazio:* camada sem carta curada → "crie sua própria evidência de campo".

**6. Criar conexões.** Liga duas camadas: escolhe origem, destino, **direção**, nomeia o mecanismo em uma
frase e anexa ao menos uma evidência de cada ponta. Sem evidência nas duas pontas, a conexão fica salva como
"suposição" e vale menos ponto — não é bloqueada, é marcada.
*Telas:* Conexões, Cebola porosa (visualização acumulada).

**7. Formular a explicação.** Monta a cadeia de efeito dominó — sequência causal de elos entre camadas — e
escreve a síntese em texto, com as conexões criadas listadas ao lado como apoio.
*Telas:* Desafio de efeito dominó → Síntese final.

**8. Propor uma ação.** Indica intervenção, camada-alvo, instrumento de gestão aplicável, responsável pela
execução, evidência que a justifica e **uma limitação ou risco da própria proposta**. O último campo é
obrigatório.
*Tela:* Síntese final (aba Ação).

**9. Receber feedback.** O app confronta a hipótese inicial congelada com a síntese final e pergunta o que
mudou. Mostra o mapa de cobertura (que camada ficou vazia, que conexão ninguém fez), os pontos por tipo de
contribuição, e as conquistas destravadas. O aluno pode revisar — e revisar dá ponto (§7.5). Depois, exporta
o dossiê JSON e o entrega no Classroom.
*Telas:* Síntese final, Perfil e progresso.

**10. Avançar.** Desbloqueia a próxima missão ou uma missão curta de camada específica, mantendo o progresso
acumulado no perfil.
*Tela:* Inicial.

**Loop curto, para uso em aula de 50 min:** passos 3 → 5 → 6 → 7, com duas camadas apenas. Loop longo, para
a Avaliação 3: os 10 passos, em equipe, ao longo de semanas, incluindo o campo.

### 5.2 Fluxo do professor

O MVP não tem servidor. O professor trabalha com arquivos, e isso é uma escolha (§10) — não uma limitação a
contornar.

**1. Criar turma.** No painel, define nome da turma, semestre e um código curto. O app gera um arquivo
`turma.json` que o professor publica no Classroom junto com o link do app.

**2. Escolher/montar missão.** Seleciona uma missão do catálogo ou cria: título, pergunta-problema, recorte,
camadas obrigatórias, cartas de evidência e critérios. As cartas são o trabalho real — cada uma é um JSON com
título, tipo, camada, fonte, conteúdo (texto, tabela, imagem embutida) e uma pergunta que ela responde.
*Este é o gargalo de esforço do produto (§13).*

**3. Publicar.** Exporta `missao.json` e publica no Classroom. Alunos importam ao abrir o app.

**4. Acompanhar equipes.** Importa os dossiês entregues (arrastar múltiplos JSONs para o painel). O painel
agrega: quantas evidências, quantas conexões, direção das conexões, camadas vazias, hipóteses iniciais x
sínteses finais.

**5. Avaliar.** Abre o dossiê de uma equipe, lê evidências, conexões e síntese, e aplica a rubrica de §2.6
com nota por critério. O app calcula o total e exporta um CSV de notas.

**6. Comentar.** Escreve comentário por conexão, por síntese ou geral. Exporta um `feedback.json` que o aluno
importa e vê ancorado no próprio dossiê. *(Assíncrono por arquivo no MVP; ao vivo na v2.)*

**7. Ver dificuldades da turma.** Visão agregada: mapa de calor de camadas por cobertura, conexões mais e
menos feitas, erros conceituais recorrentes marcados na correção. É o insumo para a aula seguinte — o app
diz ao professor o que precisa ser retomado.

---

## 6. Telas

Padrão comum a todas: cabeçalho com nome da missão e pontos acumulados; navegação inferior de quatro
destinos (Cebola · Evidências · Conexões · Perfil); tipografia e paleta de `assets/style.css`; toda ação
salva imediatamente em `localStorage` — não existe botão "salvar" e não existe estado perdido.

---

### T1 · Tela inicial

- **Objetivo.** Entrar, retomar de onde parou, instalar o app.
- **Conteúdo.** Marca e frase de abertura; campo de código de turma e nome; card da missão em andamento com
  progresso; lista de missões concluídas; botão "instalar na tela inicial".
- **Componentes.** Campo de texto, card de progresso, lista, aviso de status offline.
- **Ações.** Entrar na turma · retomar missão · importar missão (JSON) · entrar em modo livre.
- **Feedback.** "Missão baixada — você pode usar sem internet." Indicador de sincronia local.
- **Estados.** *Vazio:* sem turma → só modo livre e demonstração. *Erro:* código inválido → mensagem com a
  ação alternativa, sem beco sem saída. *Offline na primeira abertura:* explica que a primeira carga precisa
  de rede, uma vez só.

---

### T2 · Seleção da bacia

- **Objetivo.** Fixar o objeto hidrográfico e o recorte espacial da investigação.
- **Conteúdo.** Lista de recortes disponíveis com miniatura de mapa; ficha do recorte (tipo de objeto,
  município, comitê responsável, ordem de Strahler) **[dado local]**; opção de cadastrar recorte próprio.
- **Componentes.** Lista com miniaturas, ficha, formulário de cadastro (nome, tipo, coordenada, município).
- **Ações.** Escolher recorte · ver ficha · cadastrar novo · usar minha localização atual.
- **Feedback.** "Você vai investigar: Córrego Ipiranga, afluente do Paraibuna, canal de 2ª ordem" — a ordem de Strahler é
  **[dado local]**, resultado da ordenação feita pela turma sobre a rede de drenagem, não valor pré-fixado.
- **Estados.** *Vazio:* nenhum recorte curado → formulário de cadastro em destaque. *Erro:* GPS negado →
  seleção manual no mapa, sem insistir na permissão.

---

### T3 · Cebola porosa interativa — *tela-assinatura do produto*

- **Objetivo.** Ser o mapa mental da investigação: mostrar, em um olhar, o que já foi investigado, o que
  está vazio e quais conexões o aluno já sustentou.
- **Conteúdo.** Miolo ao centro com o nome do objeto hidrográfico; seis anéis rotulados com os nomes dos
  "caminhos"; preenchimento de cada anel proporcional às evidências registradas nele; **setas desenhadas
  sobre os anéis, uma por conexão criada, com ponta indicando direção** — inclusive as que apontam de dentro
  para fora, cruzando os anéis; contador de conexões por direção.
- **Componentes.** SVG inline com anéis e arcos; setas geradas a partir dos dados; painel lateral do elemento
  selecionado; alternância de visualização (camadas / conexões / cobertura).
- **Ações.** Tocar um anel → abre a camada (T4) · tocar uma seta → abre a conexão · arrastar de um anel a
  outro → cria conexão (T7) · alternar visualização.
- **Feedback.** Anel vazio fica com traço interrompido (poroso) e etiqueta "sem evidência ainda". Ao criar a
  primeira conexão de dentro para fora: "Você acabou de tratar o rio como agente, e não só como receptor."
- **Estados.** *Vazio:* seis anéis vazados, com a pergunta "por qual caminho você começa?" e nenhuma seta
  pré-desenhada. *Erro:* SVG não suportado → lista textual das seis camadas com mesma funcionalidade.
- **Restrição de projeto.** Proibido representar hierarquia de fora para dentro: sem gradiente de "mais
  importante", sem ordem numerada obrigatória, sem setas apenas centrípetas. A porosidade é literal — os
  anéis têm falhas por onde as setas passam.

---

### T4 · Tela de camada

- **Objetivo.** Conduzir a investigação de uma camada, das perguntas-guia às evidências.
- **Conteúdo.** Nome do caminho e do conceito; 3 a 5 perguntas-guia (§4); link para a lição correspondente;
  cartas de evidência disponíveis; evidências já registradas pelo aluno; conexões que envolvem esta camada;
  bloco "erros comuns nesta camada", visível só depois do primeiro registro, para não entregar a resposta.
- **Componentes.** Acordeão de perguntas, grade de cartas, lista de registros, chips de conexão.
- **Ações.** Abrir carta · registrar evidência própria · criar conexão a partir daqui · marcar pergunta como
  respondida · abrir a lição.
- **Feedback.** Barra de cobertura da camada; ao registrar a primeira evidência, o app sugere: "essa
  evidência conversa com a camada 2 — quer conectar?"
- **Estados.** *Vazio:* sem cartas curadas → "esta camada depende de dado local: colete em campo ou consulte
  a fonte indicada", com a fonte de `RESOURCES.md`. *Erro:* carta com imagem que não carregou offline →
  mostra legenda e fonte, e marca para rever com rede.

---

### T5 · Cartas de evidência

- **Objetivo.** Apresentar o dado bruto e exigir do aluno uma leitura, não um clique.
- **Conteúdo.** Frente: título, tipo, camada, fonte com data, conteúdo (mapa, gráfico, tabela, foto, trecho
  de norma, relato). Verso: a pergunta que a carta responde e três campos do aluno — *o que eu vejo*, *o que
  isso indica*, *grau de confiança* (alta / média / a confirmar).
- **Componentes.** Card virável, visualizador de imagem com zoom, tabela rolável, seletor de tipo, campos de
  texto curto.
- **Ações.** Virar a carta · registrar leitura · marcar como irrelevante (com motivo) · anexar a uma conexão ·
  criar carta própria (foto, medição, coordenada, observação).
- **Feedback.** Carta lida ganha marca visível; carta registrada entra na contagem da camada. Marcar uma
  carta como irrelevante **também dá ponto** se o motivo for preenchido — descartar com critério é habilidade.
- **Estados.** *Vazio:* nenhuma carta na camada → botão único "criar evidência de campo". *Erro:* arquivo de
  imagem grande demais para o armazenamento local → reduz resolução e avisa (§10.5).

---

### T6 · Mapa da bacia

- **Objetivo.** Ancorar toda evidência em lugar, e tornar visível a distribuição espacial do que foi coletado.
- **Conteúdo.** Base de mapa em cache do recorte **[dado local]**; camadas alternáveis (drenagem, uso do
  solo, declividade, áreas de risco) **[dado local]**; pinos das evidências registradas, coloridos por
  camada; divisor de águas do recorte.
- **Componentes.** Mapa com zoom, controle de camadas, pinos, ficha do pino.
- **Ações.** Tocar pino → abre a evidência · registrar evidência no ponto atual · alternar camadas · medir
  distância aproximada (útil para conferir faixa de APP).
- **Feedback.** "3 das suas 8 evidências estão neste trecho — e nenhuma a montante."
- **Estados.** *Vazio:* nenhuma evidência georreferenciada → mapa com o divisor e a pergunta "onde você está
  investigando?" *Erro:* offline sem tile em cache → base cinza com a rede de drenagem vetorial, que é leve e
  vai embutida na missão.

---

### T7 · Tela de conexões

- **Objetivo.** Ser o coração do app: transformar duas observações separadas em uma afirmação causal
  defensável.
- **Conteúdo.** Seletor de camada de origem e de destino; **seletor de direção, obrigatório**; campo "o
  mecanismo, em uma frase"; anexo de evidência de cada ponta; nível de confiança; lista das conexões já
  criadas, com marcação de "sustentada" x "suposição".
- **Componentes.** Dois seletores, alternador de direção, campo de texto com contador, dois seletores de
  evidência, lista.
- **Ações.** Criar · editar · anexar evidência · inverter direção · excluir · marcar para debater com a
  equipe.
- **Feedback.** Ao salvar, o app compara com a matriz de §4.7: mecanismo plausível → "conexão sustentada,
  +pontos"; célula vazia da matriz → "conexão incomum: descreva melhor o mecanismo" (aceita, marca para o
  professor, não bloqueia). Conexão de dentro para fora recebe destaque próprio.
- **Estados.** *Vazio:* nenhuma conexão → mostra duas evidências já registradas em camadas diferentes e
  pergunta "essas duas têm relação?" *Erro:* origem igual ao destino → sugere que conexão interna à camada
  seja registrada como observação, não conexão.

---

### T8 · Desafio de efeito dominó

- **Objetivo.** Exigir cadeia causal, não par isolado — o salto do nível 3 (relacionar) para o nível 4
  (explicar).
- **Conteúdo.** Trilha de elos que o aluno monta a partir das conexões que já criou; regra visível (mínimo de
  3 elos atravessando ao menos 3 camadas, chegando ou partindo do miolo); pergunta-alvo da missão no topo.
- **Componentes.** Trilha arrastável de blocos, gaveta de conexões disponíveis, validador de continuidade,
  campo de conclusão da cadeia.
- **Ações.** Arrastar conexão para a trilha · reordenar · remover · fechar a cadeia com uma conclusão · criar
  cadeia alternativa.
- **Feedback.** Validação de continuidade em tempo real ("o destino do elo 2 não é a origem do elo 3");
  contagem de camadas atravessadas; ao fechar: "sua cadeia atravessa 4 camadas e inclui um efeito do rio
  sobre a cidade."
- **Estados.** *Vazio:* menos de duas conexões criadas → orienta a voltar para T7, com o que falta.
  *Erro:* cadeia circular → aceita, e pergunta se é retroalimentação (o que é achado valioso, com ponto
  próprio) ou erro de montagem.

---

### T9 · Síntese final

- **Objetivo.** Produzir o artefato que vale nota: explicação escrita + ação proposta + revisão da hipótese.
- **Conteúdo.** Três abas. *Explicação:* a hipótese inicial congelada no topo, a cadeia dominó e as conexões
  como apoio, e o campo de texto da síntese. *Ação:* intervenção, camada-alvo, instrumento de gestão
  (lista da PNRH e do plano diretor), responsável, evidência que a justifica, limitação — este último
  obrigatório. *Revisão:* "o que você pensava no início x o que pensa agora, e por que mudou".
- **Componentes.** Abas, editor de texto longo, painel lateral de apoio, seletores, checklist da rubrica de
  §2.6 visível ao aluno.
- **Ações.** Escrever · revisar · exportar dossiê (JSON) · exportar resumo (texto para o pôster) ·
  reabrir para revisão depois do feedback.
- **Feedback.** Checklist da rubrica marcando o que já está coberto e o que falta — sem nota automática.
  Aviso explícito quando a síntese usa apenas uma camada: "sua explicação está apoiada só no clima; a
  pergunta pede sistema."
- **Estados.** *Vazio:* nenhuma conexão → bloqueia com o caminho de volta ("a síntese se apoia nas conexões:
  crie ao menos três"). *Erro:* exportação falhou → mostra o JSON em tela para copiar à mão, como último
  recurso — nunca perder o trabalho do aluno.

---

### T10 · Perfil e progresso

- **Objetivo.** Mostrar crescimento cognitivo, não ranking.
- **Conteúdo.** Nível atual entre os cinco de §2.4 e o que falta para o próximo; pontos por **tipo** de
  contribuição (evidência, conexão, hipótese, revisão, síntese, ação) — nunca só o total; conquistas;
  histórico de missões; mapa pessoal de cobertura das seis camadas; contador de revisões, apresentado como
  qualidade.
- **Componentes.** Medidor de nível, barras por tipo, grade de conquistas, radar das seis camadas.
- **Ações.** Ver detalhe de conquista · retomar missão · exportar histórico.
- **Feedback.** "Você é forte em clima e relevo, e ainda não trouxe evidência de gestão." O app aponta lacuna,
  não posição em lista.
- **Estados.** *Vazio:* nenhuma missão → mostra os cinco níveis como percurso a fazer. *Sem erro previsto.*

---

### T11 · Painel do professor

Acesso por URL própria (`/professor.html`), sem login no MVP — separação por endereço, não por autenticação
(§10.7). Pensado para desktop.

- **Objetivo.** Montar missão, ler dossiês, avaliar e ver onde a turma travou.
- **Conteúdo.** Quatro abas. *Turmas e missões:* criar, editar, exportar. *Editor de cartas:* formulário
  de carta de evidência com pré-visualização. *Equipes:* tabela de dossiês importados com evidências,
  conexões, direções, camadas vazias e status de correção. *Turma:* agregado — mapa de calor de cobertura
  por camada, conexões mais e menos feitas, hipóteses iniciais x sínteses finais.
- **Componentes.** Área de arrastar arquivos, tabela ordenável, leitor de dossiê com rubrica lateral,
  editor de carta, mapa de calor, exportação CSV.
- **Ações.** Criar turma/missão · criar carta · importar dossiês (vários de uma vez) · avaliar por rubrica ·
  comentar · exportar notas em CSV · exportar `feedback.json` para os alunos.
- **Feedback.** "22 de 24 equipes deixaram a camada 6 vazia" — sinal direto para a aula seguinte. Ao avaliar:
  soma dos pesos e o que falta preencher.
- **Estados.** *Vazio:* nenhum dossiê importado → instrução de onde baixar os JSONs do Classroom.
  *Erro:* JSON de versão incompatível → informa a versão do esquema e importa o que for legível, campo por
  campo, sem descartar o arquivo inteiro.

---

### 6.12 Verificação de cobertura das telas

| Tela | Aparece no fluxo (§5) | Entidade correspondente (§9) |
|---|---|---|
| T1 Inicial | Aluno 1, 10 | `Turma`, `Aluno`, `Missao` |
| T2 Seleção da bacia | Aluno 2 | `Bacia` |
| T3 Cebola porosa | Aluno 4 | `Camada`, `Conexao` |
| T4 Camada | Aluno 4, 5 | `Camada`, `RegistroEvidencia` |
| T5 Cartas de evidência | Aluno 5 | `CartaEvidencia`, `RegistroEvidencia` |
| T6 Mapa da bacia | Aluno 5 | `Bacia`, `RegistroEvidencia.geo` |
| T7 Conexões | Aluno 6 | `Conexao` |
| T8 Efeito dominó | Aluno 7 | `Cadeia` |
| T9 Síntese final (+ aba Briefing) | Aluno 3, 7, 8, 9 | `Hipotese`, `Sintese`, `Acao`, `Revisao` |
| T10 Perfil | Aluno 9, 10 | `Pontuacao`, `Conquista` |
| T11 Painel professor | Professor 1–7 | `Turma`, `Missao`, `CartaEvidencia`, `Avaliacao` |

Nenhuma tela órfã; nenhuma entidade sem tela.

---

## 7. Gamificação

### 7.1 Princípio

**Premiar a operação cognitiva mais difícil, na proporção da dificuldade.** Ler dá pouco ponto. Conectar dá
muito. Rever a própria conclusão dá mais que acertar de primeira. Não existe bônus por velocidade em nenhum
lugar do sistema.

### 7.2 Tabela de pontos

| Contribuição | Pontos | Condição |
|---|---|---|
| Carta de evidência lida | 2 | Apenas virar a carta |
| Evidência registrada com leitura completa | 8 | Os três campos do verso preenchidos |
| Evidência de campo criada pelo aluno | 12 | Com local e data; +3 se tiver foto ou medição |
| Carta descartada com justificativa | 5 | Descartar com critério é habilidade |
| Conexão criada como suposição | 5 | Direção e mecanismo, sem evidência nas duas pontas |
| **Conexão sustentada de fora para dentro** | **15** | Evidência nas duas pontas + mecanismo nomeado |
| **Conexão sustentada de dentro para fora** | **25** | Idem, partindo do miolo ou da camada interna |
| Retroalimentação identificada (ciclo A→B→A) | 30 | As duas conexões sustentadas |
| Hipótese inicial registrada | 10 | Obrigatória para iniciar |
| Hipótese refutada e reconhecida | 25 | O aluno diz o que não se sustentou e por quê |
| Cadeia dominó válida (≥3 elos, ≥3 camadas) | 30 | Continuidade validada |
| Síntese final escrita | 40 | Mínimo de três conexões referenciadas |
| Ação proposta com limitação declarada | 25 | O campo de limitação é obrigatório |
| Revisão da síntese após feedback | 20 | Por revisão substantiva, até 2 vezes |
| Comentário útil na produção da equipe | 8 | Marcado como útil por um colega — **apurado na mesclagem dos dossiês (T11), não no aparelho do aluno** |

### 7.3 Tetos deliberados (anti-farm)

- Máximo **6 evidências pontuadas por camada** — o sétimo registro é salvo, mas não pontua. Acumular carta é
  fácil; o app não recompensa acúmulo.
- Máximo **3 conexões pontuadas por par de camadas**. Variedade de relações vale mais que repetição.
- Nenhum ponto por tempo de tela, sequência de dias ou velocidade de resposta.
- Conexão excluída devolve os pontos. Criar e apagar em loop não rende nada.

### 7.4 Níveis

Os cinco níveis de §2.4, com requisitos que exigem *tipo* de contribuição, não só total:

| Nível | Título | Requisito |
|---|---|---|
| 1 | Observador de campo | Recorte escolhido + 3 evidências registradas |
| 2 | Investigador de camada | ≥1 evidência em 4 camadas distintas |
| 3 | Cartógrafo de conexões | 5 conexões sustentadas, em ≥3 pares distintos |
| 4 | Analista de sistema | Cadeia dominó válida + ≥1 conexão de dentro para fora |
| 5 | Gestor proponente | Síntese + ação com limitação + 1 revisão registrada |

Nível nunca regride. O nível 5 é intencionalmente inalcançável sem revisar algo — a revisão é requisito, não
enfeite.

### 7.5 A revisão como mecânica central

Um app educativo comum penaliza o erro. Aqui, mudar de opinião com fundamento é a jogada mais valiosa por
esforço investido: hipótese refutada e reconhecida vale 25 pontos, mais que uma conexão de fora para dentro
sustentada. E o perfil (T10) exibe o número de revisões como indicador positivo, ao lado do nível.

Efeito colateral desejado: o aluno arrisca uma hipótese forte no passo 3, porque errar publicamente não custa.

### 7.6 Conquistas

Cada conquista nomeia uma operação intelectual, não um volume:

| Conquista | Como se destrava |
|---|---|
| **Rio que Esculpe** | Primeira conexão de dentro para fora |
| **Duas Mãos** | Conectar o mesmo par de camadas nas duas direções, com evidência |
| **Volta ao Início** | Identificar uma retroalimentação |
| **Seis Caminhos** | Evidência registrada em todas as seis camadas |
| **Pé na Água** | 5 evidências criadas em campo, com coordenada |
| **Mudei de Ideia** | Hipótese inicial refutada e reconhecida |
| **Quem Não Está na Mesa** | Evidência de gestão que identifique um ausente da decisão |
| **A Lei e o Chão** | Comparar a faixa de APP exigida por lei com a existente no local |
| **Montante** | Registrar evidência a montante do ponto do problema |
| **Efeito Dominó** | Cadeia de 5 elos atravessando 4 camadas |
| **Leitor Crítico** | 3 cartas descartadas com justificativa aceita pelo professor |

### 7.7 Missões individuais

- **Missão de camada (10–15 min).** Uma camada, três cartas, uma conexão obrigatória com camada vizinha.
  Usada como preparação para a Avaliação 1.
- **Missão de reconhecimento (20 min).** Delimitar o recorte, situar na hierarquia fluvial, registrar três
  evidências. Nível 1 e 2.
- **Missão completa (2–4 h, distribuídas).** Os 10 passos. É o formato da Avaliação 3.

### 7.8 Missões em equipe — a interdependência é estrutural

Cada integrante recebe **camadas diferentes**. A regra que faz a colaboração acontecer:

> Conexão entre camadas de responsáveis diferentes só conta como **sustentada** se a evidência de cada ponta
> tiver sido registrada pelo responsável daquela camada.

Como o MVP não tem edição simultânea (§11.2), essa verificação **não roda no aparelho do aluno**: durante a
missão a conexão aparece como "pendente de cruzamento", e a condição é apurada na mesclagem dos dossiês no
painel do professor (T11). O aluno vê o que falta — de quem ele depende —, não um placar falso.

Ninguém fecha as conexões mais valiosas sozinho. Complementos:

- **Placar da equipe por cobertura**, não por soma individual: a equipe é medida pela camada mais fraca.
- **Desafio de contradição** — quando duas evidências da equipe se contradizem, o app sinaliza e oferece 30
  pontos coletivos para quem resolver a contradição por escrito.
- **Debate obrigatório antes da síntese** — a síntese da equipe exige que ao menos dois integrantes tenham
  comentado a cadeia dominó.

### 7.9 Mecanismos contra competição superficial

1. **Sem ranking geral.** Nunca. Não há lista de alunos ordenada por pontos, em nenhuma tela.
2. **Sem cronômetro e sem bônus de velocidade** em nenhuma mecânica.
3. **Pontos ≠ nota.** Ditos com palavras diferentes em toda a interface: "pontos de investigação" x "nota da
   avaliação". A nota sai da rubrica do professor.
4. **Sem correção automática de texto aberto.** O app nunca diz que uma explicação está certa ou errada — ele
   confere *cobertura* (usou quantas camadas, quantas conexões, tem evidência?). Julgamento de conteúdo é do
   professor. Isso é limitação técnica assumida (offline, sem servidor) **e** decisão pedagógica.
5. **Tetos por camada e por par** (§7.3), que tornam o acúmulo bruto inútil.
6. **Feedback comparativo é sempre consigo mesmo** ou com a cobertura da turma em agregado anônimo, jamais
   aluno contra aluno.
7. **Conexão implausível não zera nada** — é marcada para revisão humana. Errar não custa ponto; não tentar
   custa.

### 7.10 Recompensas

Sem moeda, sem loja, sem cosmético. As recompensas são de acesso e reconhecimento:

- Desbloqueio de **cartas avançadas** — dados mais difíceis (série longa, laudo técnico, ata de comitê),
  liberados no nível 3.
- Selo de conquista no dossiê exportado, visível na entrega.
- **Curadoria**: no nível 4, o aluno pode propor uma carta de evidência própria ao professor; se aceita, ela
  entra na missão com crédito nominal e passa a ser usada pelas outras turmas.
- Destaque coletivo: a melhor cadeia dominó da turma vira material da aula seguinte, com crédito à equipe.

---

## 8. Missão demonstrativa

## “Por que o rio da nossa cidade está mais sujeito a enchentes?”

**Instância desta versão:** Rio Paraibuna e os córregos Ipiranga e Teixeiras, Juiz de Fora (MG) — os mesmos
corpos hídricos do trabalho de campo da Unidade II e do objeto da Avaliação 3.

### 8.1 Contexto apresentado ao aluno

> Juiz de Fora foi atingida por chuvas intensas em fevereiro e novamente em junho de 2026. Houve alagamento
> em pontos que já alagavam e em pontos que não alagavam. Moradores antigos dizem que "antes chovia mais e
> alagava menos". A prefeitura anunciou obras de drenagem. O comitê de bacia discute o plano.
>
> Sua tarefa não é dizer se choveu muito. É explicar **por que a mesma chuva produz mais enchente hoje do que
> produziria há trinta anos** — e o que se pode fazer a respeito.

O enquadramento é deliberado: ele torna a resposta "choveu muito" insuficiente por construção, porque a
pergunta já contém a chuva como constante e pede o que mudou.

### 8.2 Objetivo da missão

Produzir uma explicação sistêmica do aumento da suscetibilidade a enchentes no recorte, sustentada em
evidências das seis camadas e em uma cadeia causal de pelo menos quatro elos, e propor uma intervenção viável
com instrumento, responsável e limitação declarada.

Duração: 2 aulas de 50 min + coleta em campo. Formato: equipes de 3 a 4, com camadas divididas.

### 8.3 Evidências fornecidas (12 cartas)

Todas marcadas **[dado local]** — precisam ser montadas pelo professor antes de a missão ir ao ar. A fonte de
cada uma está em `RESOURCES.md`.

| # | Carta | Tipo | Camada | Fonte |
|---|---|---|---|---|
| 1 | Normal climatológica de precipitação mensal — estação de Juiz de Fora | Série de dados | C1 | INMET — Normais Climatológicas |
| 2 | Precipitação diária de fevereiro e junho de 2026 | Série de dados | C1 | INMET / CEMADEN |
| 3 | Boletim de alerta emitido no evento | Documento | C1 / C6 | CEMADEN |
| 4 | Hidrograma do Paraibuna no evento | Gráfico | C2 | ANA |
| 5 | Mancha urbana em três datas (décadas de 1990, 2010, 2020) | Mapa | C5 / C2 | Imagem de satélite |
| 6 | Mapa de declividade das encostas do recorte | Mapa | C3 | MDE, prática de QGIS da Unidade II |
| 7 | Mapa de solos e carta geológica do recorte | Mapa | C3 | Base estadual |
| 8 | Fotos de trecho canalizado e de trecho com mata ciliar | Imagem | C3 / C4 | Campo |
| 9 | Largura medida do córrego em três pontos | Medição | C4 | Campo — insumo do cálculo de APP |
| 10 | Mapa de áreas de risco e ocorrências registradas | Mapa | C5 / C6 | Defesa Civil de JF |
| 11 | Cobertura de esgotamento sanitário e renda por bairro | Tabela | C5 | Dados municipais / censo |
| 12 | Trecho do plano da bacia e ata do comitê sobre drenagem urbana | Documento | C6 | CBH Afluentes Mineiros dos Rios Preto e Paraibuna |

Cartas avançadas, liberadas no nível 3: série histórica longa de precipitação; laudo de qualidade da água do
próprio campo da turma; texto integral do plano diretor no que trata de ocupação de fundo de vale.

### 8.4 Perguntas por camada

**C1 · Clima.** A chuva de 2026 foi excepcional em relação à normal da estação — em volume total ou em
intensidade concentrada? Que mecanismo a trouxe (a ZCAS estacionária é a hipótese a testar, ver Lição 4)? A
série histórica mostra tendência, ou o evento é isolado?

**C2 · Ciclo hidrológico.** Onde a chuva se divide neste recorte, hoje? Que fração da área é impermeável? O
pico do hidrograma chegou mais rápido do que a chuva sugeriria? De onde vem a água do córrego na estiagem?

**C3 · Relevo e solos.** Qual a declividade das encostas que drenam para o ponto alagado? Onde está a
planície de inundação — e o que existe construído sobre ela? O canal foi retificado? O que a retificação faz
com a velocidade da água?

**C4 · Vegetação.** Que faixa de APP o art. 4º da Lei 12.651/2012 exige para a largura medida na carta 9?
Que faixa existe de fato? O que essa diferença faz com a água em um evento de chuva intensa?

**C5 · Sociedade e economia.** Quando a cidade ocupou o fundo de vale, e por quê? Quem mora nas áreas de
risco da carta 10, e como isso se relaciona com a renda da carta 11? Quem sofre o dano da enchente e quem se
beneficiou da ocupação que a agravou?

**C6 · Gestão.** Em que classe o corpo d'água está enquadrado? O alerta da carta 3 chegou, e a quem? O plano
da bacia prevê drenagem urbana — e foi executado? Quem está na mesa do comitê, e quem não está?

### 8.5 Conexões esperadas

Sustentadas de fora para dentro:

1. **C1 → C2** — chuva concentrada em poucas horas gera pico de escoamento, não apenas volume total.
2. **C3 → C2** — declividade alta reduz o tempo de concentração e antecipa o pico.
3. **C5 → C2** — a impermeabilização vista na carta 5 converte infiltração em escoamento (o mecanismo a
   nomear é o da Lição 2: acima de 30–50% de superfície impermeabilizada, a fração da chuva que escoa sobe
   de ~10% para ~55%; o grau real do recorte é **[dado local]**).
4. **C4 → C2** — a mata ciliar ausente deixou de interceptar e retardar a água.
5. **C5 → C3** — retificação e canalização do canal aumentaram a velocidade do fluxo e transferiram o
   problema para jusante.
6. **C6 → C4** — a APP existe em lei e não existe no terreno: vigência não é implementação.

De dentro para fora — as que os alunos esquecem e a missão precisa provocar:

7. **Miolo → C3** — o rio construiu a planície de inundação que a cidade hoje ocupa; o "terreno plano barato"
   é obra do próprio rio.
8. **Miolo → C5** — o rio definiu onde Juiz de Fora nasceu e cresceu, e hoje distribui o dano de forma
   desigual pelo território.
9. **Miolo → C6** — as cheias de 2026 é que produziram alerta, obra e pauta no comitê: a política é resposta
   ao rio.
10. **C5 → C6** — o conflito e o prejuízo é que geram demanda por regulação.

Retroalimentação a identificar: **C4 → C2 → C3 → C4** — remoção da mata ciliar aumenta o escoamento, que
erode a margem, que impede a mata de se restabelecer.

### 8.6 Cadeia dominó esperada

> Chuva concentrada pela ZCAS (C1) → encontra bacia com alto grau de impermeabilização **[dado local: medir
> na carta 5]** e sem mata ciliar (C5, C4) → a partir de 30–50% de superfície impermeabilizada, a fração da
> chuva que vira escoamento salta de ~10% para ~55% (EPA/Paz), com tempo de concentração curto (C2) →
> pico de cheia rápido em canal retificado (C3) → transbordamento sobre planície de inundação ocupada, construída pelo próprio rio (miolo → C3 → C5) →
> dano concentrado na população de menor renda (C5) → demanda por obra, alerta e plano (C6).

Atravessa as seis camadas, inclui dois elos de dentro para fora e fecha em política pública.

### 8.7 Resposta final esperada

Uma explicação que sustente, com evidência: **a chuva não é a variável que mudou — a bacia é.** A mesma
precipitação produz mais enchente porque a superfície que a recebe foi impermeabilizada, a mata ciliar que a
retardava foi removida, o canal que a conduzia foi retificado e acelerado, e a planície que a acomodava foi
ocupada — sendo essa planície obra do próprio rio. O dano se distribui desigualmente porque a ocupação da
área de risco também é desigual. E a política pública aparece como resposta ao evento, não como prevenção
anterior a ele.

Uma resposta que atribua a enchente apenas à chuva, ou apenas ao desmatamento, ou apenas à prefeitura, não
atende — e a checagem de cobertura de T9 avisa antes da entrega.

### 8.8 Critérios de avaliação desta missão

Rubrica de §2.6, com os pesos aplicados ao caso:

| Critério | Peso | Excelente nesta missão |
|---|---|---|
| Evidências | 20% | Usa ≥8 das 12 cartas, com leitura própria, e traz ≥2 evidências de campo |
| Conexões | 30% | ≥8 conexões sustentadas, incluindo ≥2 de dentro para fora e a retroalimentação |
| Explicação | 25% | Cadeia de ≥4 elos, sem salto lógico, com a chuva tratada como constante |
| Ação | 15% | Intervenção com camada-alvo, instrumento legal, responsável e limitação real |
| Revisão | 10% | Confronta a hipótese inicial e explicita o que mudou |

### 8.9 Intervenções possíveis (e como o app as trata)

O app não classifica proposta como certa ou errada. Ele exige os cinco campos e devolve a pergunta certa:

| Proposta típica | Camada-alvo | Instrumento | A pergunta que o app devolve |
|---|---|---|---|
| Recompor mata ciliar | C4 | APP, Lei 12.651/2012 | Quanto do pico de cheia isso reduz, se a bacia já passou do limiar de impermeabilização? |
| Dragar e alargar o canal | C3 / C2 | Obra pública, licença | Isso resolve aqui ou transfere o problema para jusante? |
| Bacias de detenção / piscinões | C2 | Plano de drenagem | Onde couberam, de quem é o terreno, quem mantém? |
| Telhado verde e pavimento permeável | C5 / C2 | Plano diretor, incentivo fiscal | Que fração da área impermeável isso atinge de fato? |
| Proibir construção em fundo de vale | C5 / C6 | Plano diretor, zoneamento | E quem já mora lá — a proposta inclui para onde vai? |
| Sistema de alerta e rota de evacuação | C6 | Defesa Civil, CEMADEN | Reduz o dano ou reduz a enchente? A diferença importa |
| Cobrança pelo uso e destinação a drenagem | C6 / C5 | PNRH, Lei 9.433/1997 | Quem paga, quem decide onde o recurso é aplicado? |

O campo obrigatório de limitação é onde o aluno demonstra que compreendeu o sistema: uma proposta sem
limitação declarada é sinal de que ele ainda vê a bacia como problema simples.

---

## 9. Modelo de dados

Formato: JSON puro, persistido em `localStorage` e trocado por arquivo. Todo registro tem `id` (UUID v4),
`criadoEm` e `versaoEsquema`.

### 9.1 Entidades

```
Turma            { id, nome, semestre, codigo, professor, missoes[] }
Aluno            { id, nome, turmaId, equipeId, camadasAtribuidas[] }
Equipe           { id, nome, turmaId, integrantes[] }
Bacia            { id, nome, tipoObjeto, municipio, uf, comite, ordemStrahler,
                   geo{lat,lon}, camadasMapa[], miniatura }
Missao           { id, titulo, perguntaProblema, contexto, baciaId,
                   camadasObrigatorias[], cartas[], criterios[], duracaoEstimada }
Camada           { id: 1..6, nome, caminho, perguntasGuia[], licaoUrl, errosComuns[] }
CartaEvidencia   { id, missaoId, camadaId, titulo, tipo, fonte, data,
                   conteudo{texto?, tabela?, imagemBase64?, geo?}, perguntaQueResponde,
                   nivelMinimo }
RegistroEvidencia{ id, autorId, missaoId, camadaId, cartaId?, propria: bool,
                   oQueVejo, oQueIndica, confianca, descartada?, motivoDescarte?,
                   geo?, foto?, medicao?, criadoEm }
Conexao          { id, autorId, missaoId, origemCamada, destinoCamada, direcao,
                   mecanismo, evidenciaOrigemId?, evidenciaDestinoId?,
                   sustentada: bool, plausivel: bool, confianca, criadoEm }
Cadeia           { id, autorId, missaoId, elos[conexaoId], conclusao,
                   camadasAtravessadas, valida: bool, circular: bool }
Hipotese         { id, autorId, missaoId, texto, momento: 'inicial'|'final',
                   congelada: bool, criadoEm }
Sintese          { id, autorId|equipeId, missaoId, texto, conexoesReferenciadas[],
                   cadeiaId?, coberturaCamadas[], criadoEm, atualizadoEm }
Acao             { id, sinteseId, intervencao, camadaAlvo, instrumento, responsavel,
                   evidenciaJustificativaId, limitacao }
Revisao          { id, autorId, alvoTipo, alvoId, oQueMudou, porque, criadoEm }
Pontuacao        { autorId, missaoId, porTipo{evidencia, conexao, hipotese, revisao,
                   sintese, acao, colaboracao}, total, nivel, tetosAtingidos[] }
Conquista        { id, autorId, chave, destravadaEm, missaoId }
Comentario       { id, autorId, alvoTipo, alvoId, texto, util: bool, criadoEm }
Avaliacao        { id, professorId, alvo: equipeId|alunoId, missaoId,
                   notas{evidencias, conexoes, explicacao, acao, revisao},
                   total, comentarioGeral }
```

### 9.2 Invariantes

1. `Conexao.sustentada` é **derivada**, nunca digitada: verdadeira se e só se `evidenciaOrigemId` e
   `evidenciaDestinoId` existirem e apontarem para as camadas declaradas.
2. `Conexao.plausivel` é derivada da matriz de §4.7. Falso não bloqueia — marca para revisão humana.
3. `Conexao.direcao` é obrigatória e nunca tem valor padrão. A interface não pré-seleciona nada.
4. Em missão de equipe, `sustentada` exige que cada evidência tenha sido registrada pelo responsável da sua
   camada (§7.8) — condição avaliada **na mesclagem dos dossiês (T11)**, não no aparelho do aluno, que exibe
   a conexão como `pendenteCruzamento` até lá.
5. `Hipotese` com `momento: 'inicial'` e `congelada: true` é imutável. A revisão cria registro novo, não
   sobrescreve.
6. `Sintese` requer ≥3 itens em `conexoesReferenciadas`.
7. `Acao.limitacao` não aceita string vazia.
8. `Pontuacao` é sempre **recalculada** a partir dos registros, nunca incrementada. Isso torna
   estorno (§7.3) trivial e o placar auditável.
9. `Cadeia.valida` exige continuidade entre elos e ≥3 camadas distintas.
10. Nenhuma entidade guarda e-mail, telefone, foto de pessoa ou identificador oficial (§10.7).

### 9.3 Chaves em `localStorage`

```
cda:versao                    → versão do esquema
cda:aluno                     → identidade local (nome, turma, equipe, camadas)
cda:missao:<missaoId>         → missão importada, com cartas
cda:dossie:<missaoId>         → registros, conexões, cadeias, hipóteses, síntese, ação, revisões
cda:pontos:<missaoId>         → pontuação derivada, em cache
cda:conquistas                → conquistas acumuladas entre missões
cda:mapa:<baciaId>            → vetores de drenagem e divisor, para uso offline
```

### 9.4 Formatos de arquivo trocados

| Arquivo | Quem gera | Quem consome | Conteúdo |
|---|---|---|---|
| `turma.json` | Professor | Aluno | Turma, código, equipes, atribuição de camadas |
| `missao.json` | Professor | Aluno | Missão, bacia, cartas (imagens em base64), critérios |
| `dossie-<equipe>.json` | Aluno | Professor | Tudo o que a equipe produziu |
| `feedback.json` | Professor | Aluno | Comentários e notas por critério |
| `notas.csv` | Professor | Diário de classe | Uma linha por aluno/equipe, uma coluna por critério |

A importação é tolerante por construção: versão desconhecida importa os campos reconhecidos e relata o resto,
em vez de recusar o arquivo (T11).

---

## 10. Arquitetura técnica

### 10.1 Decisão central e sua justificativa

**PWA em HTML/CSS/JavaScript puro, sem framework, sem build, sem backend.** Alternativas consideradas e por
que perderam:

| Alternativa | Por que não no MVP |
|---|---|
| React Native / Expo | Loja, conta de desenvolvedor, build, atualização por versão. Nada disso é necessário para uma turma de 30 alunos |
| PWA com backend (Supabase/Firebase) | Traz sincronização e painel ao vivo, e traz junto autenticação, custo e tratamento de dado pessoal de aluno. Fica para a v2 |
| React/Vite sem backend | Ganho real pequeno para 11 telas, e introduz build e dependências onde hoje não existe nenhuma |
| **HTML puro (escolhido)** | Mesmo stack das lições, editável em qualquer editor, publicável em qualquer URL estática, zero custo, offline nativo, nenhum dado pessoal saindo do aparelho |

O critério decisivo: o professor precisa conseguir manter isso sozinho, no semestre, sem cadeia de
ferramentas. O stack existente já provou isso — `assets/quiz.js` resolve o quiz das oito lições em 18 linhas.

### 10.2 Estrutura de arquivos

```
Caminhos_da_Agua/
├── index.html              T1 — inicial e roteamento por hash
├── app.html                T2–T10 — telas do aluno, uma única página
├── professor.html          T11 — painel
├── manifest.webmanifest    instalação na tela inicial
├── sw.js                   service worker: cache-first do app e das missões
├── assets/
│   ├── style.css           importa ../../assets/style.css e adiciona o que é do app
│   ├── cebola.js           SVG da cebola porosa + setas direcionais (T3)
│   ├── evidencia.js        cartas e registros (T4, T5)
│   ├── conexao.js          criação, validação pela matriz, pontuação (T7)
│   ├── domino.js           montagem e validação de cadeia (T8)
│   ├── store.js            localStorage, export/import, migração de esquema
│   ├── pontos.js           recálculo de pontuação, níveis, conquistas
│   └── mapa.js             mapa com vetores locais (T6)
└── missoes/
    └── paraibuna-enchentes.json
```

Reaproveitamento explícito: `assets/style.css` da raiz do workspace (variáveis `--ink`, `--paper`,
`--accent`, `--serif`, medida de 42em) e o padrão de componente de `assets/quiz.js` — comportamento declarado
por atributos `data-*` no HTML, sem estado global, sem framework.

### 10.3 Navegação

Uma única página com roteamento por hash (`app.html#camada/3`), o que dá botão "voltar" do navegador de graça
e nenhuma dependência de roteador. Navegação inferior fixa de quatro destinos: **Cebola · Evidências ·
Conexões · Perfil**. A cebola (T3) é sempre o destino inicial e o hub — todo caminho passa por ela, o que
reforça o modelo mental na própria estrutura do app.

### 10.4 Armazenamento e sincronização

- **Escrita imediata** em `localStorage` a cada ação. Não existe "salvar" e não existe trabalho perdido.
- **Sincronização por arquivo**: exportar/importar JSON (§9.4). O aparelho é a fonte de verdade.
- **Backup automático de segurança**: a cada 10 ações, o app guarda uma cópia do dossiê em uma chave
  separada, e a tela de perfil sempre oferece "baixar dossiê agora". Perda de dado de campo é o risco mais
  grave do produto (§13) e merece redundância.
- **Migração de esquema**: `store.js` compara `cda:versao` e aplica migrações incrementais, tolerando campo
  desconhecido.

### 10.5 Offline e limites reais

Service worker com estratégia *cache-first* para o casco do app e para o `missao.json` já importado; rede
apenas para tiles de mapa e para atualização de versão. Depois da primeira abertura, a missão inteira roda em
modo avião — requisito não negociável, porque o campo no Paraibuna não tem rede confiável.

Limite a respeitar: `localStorage` oferece na ordem de 5 MB por origem. Consequências de projeto, não
detalhes: fotos de campo são redimensionadas para ~800 px e comprimidas antes de virar base64; imagens de
carta grandes ficam em arquivo separado com carregamento sob demanda; o app monitora o uso e avisa em 80% da
capacidade, sugerindo exportar o dossiê. *(A migração para IndexedDB, que remove esse teto, é item da v2 —
não do MVP.)*

### 10.6 Perfis de usuário

Sem sistema de autenticação. Três perfis, separados por **arquivo e endereço**:

| Perfil | Como se identifica | O que pode |
|---|---|---|
| Aluno | Nome digitado + código de turma | Investigar, registrar, conectar, sintetizar, exportar dossiê |
| Equipe | `equipeId` no `turma.json` | Mesclar dossiês de integrantes na importação |
| Professor | Abre `professor.html` | Criar missão e carta, importar dossiês, avaliar, exportar notas |

É separação por conveniência, não por segurança — e o documento diz isso com clareza para que ninguém
suponha proteção que não existe. Um aluno que abra `professor.html` vê o editor de missões, e não há segredo
ali: as respostas esperadas não ficam no arquivo do aluno.

### 10.7 Segurança e privacidade

Decisões que resolvem LGPD por **arquitetura**, não por política escrita:

1. **Nenhum dado pessoal transita pela rede.** Não há servidor. O dossiê vai do aparelho para o Google
   Classroom, que a instituição já usa e já regulou.
2. **Coleta mínima**: nome (ou apelido) e turma. Sem e-mail, sem telefone, sem matrícula, sem conta.
3. **Sem rastreamento**: nenhuma analítica, nenhum script de terceiro, nenhum cookie.
4. **Foto de campo**: a orientação, no próprio app, no momento da captura, é fotografar o rio, a margem, o
   canal — não pessoas. Se houver pessoa identificável, não publicar.
5. **Localização** só quando o aluno pede, para marcar um ponto, com a coordenada gravada apenas no dossiê.
6. **Direito de apagar** é trivial e visível: um botão no perfil limpa todo o armazenamento local.
7. **Conteúdo de terceiros nas cartas** (mapa, imagem, texto de lei) leva fonte e data obrigatórias, em uso
   educacional, com preferência por dado público e aberto — ANA, INMET, CEMADEN, Planalto, IBGE.
8. **Nada é publicado na web pelo app.** Toda saída é arquivo que o usuário controla.

---

## 11. Escopo do MVP

### 11.1 Dentro do MVP (v0.1 — protótipo do semestre 2026/2)

| # | Funcionalidade | Tela |
|---|---|---|
| 1 | Entrar com nome + código de turma, sem conta | T1 |
| 2 | Importar `missao.json` e usar offline | T1 |
| 3 | Uma bacia: Paraibuna + Ipiranga + Teixeiras | T2 |
| 4 | Briefing com hipótese inicial obrigatória e congelada | T9 (aba) |
| 5 | Cebola porosa em SVG com preenchimento e setas direcionais | T3 |
| 6 | Seis telas de camada com perguntas-guia e link para a lição | T4 |
| 7 | Cartas de evidência com leitura em três campos | T5 |
| 8 | Criação de evidência de campo com foto, medição e coordenada | T5, T6 |
| 9 | Conexões com direção, mecanismo e evidência nas duas pontas | T7 |
| 10 | Validação pela matriz de plausibilidade | T7 |
| 11 | Cadeia de efeito dominó com validação de continuidade | T8 |
| 12 | Síntese, ação com limitação obrigatória e revisão da hipótese | T9 |
| 13 | Pontuação por tipo, cinco níveis, conquistas | T10 |
| 14 | Export/import de dossiê JSON | T9, T10 |
| 15 | Painel: importar dossiês, ler, avaliar por rubrica, exportar CSV | T11 |
| 16 | Mapa com vetores locais e pinos de evidência | T6 |
| 17 | Instalação na tela inicial e operação em modo avião | todas |

### 11.2 Fora do MVP, explicitamente

Servidor e sincronização ao vivo · login e senha · notificações · chat na equipe · múltiplas bacias ·
catálogo de missões · comentário do professor em tempo real · correção automática de texto ·
ranking · conteúdo para ensino básico · publicação em loja de aplicativos · modo colaborativo simultâneo
(no MVP, a colaboração acontece por mesclagem de dossiês, não por edição concorrente).

### 11.3 Dependências

| Dependência | Natureza | Situação |
|---|---|---|
| Cartas de evidência do Paraibuna **[dado local]** | Curadoria do professor | **Bloqueante** — nada funciona sem as 12 cartas |
| Vetor de drenagem e divisor do recorte | Saída da prática de QGIS da Unidade II | Disponível; exportar como GeoJSON |
| Série do INMET da estação de JF | Download público | Disponível |
| Dados do evento de 2026 (CEMADEN, Defesa Civil) | Boletim e notícia | A coletar no momento do estudo de caso (lacuna já registrada em `RESOURCES.md`) |
| `assets/style.css` e padrão de `quiz.js` | Reaproveitamento interno | Disponível |
| Google Classroom | Distribuição | Já em uso na disciplina |
| Turma de GEO164 | Validação | Disponível neste semestre |

### 11.4 Critérios de validação com a turma

Uma aula de 50 minutos, equipes de 3, celular próprio, aparelho em modo avião após a primeira carga:

1. **Instalação** — ≥90% dos alunos abrem e entram na turma em menos de 3 minutos, sem ajuda.
2. **Compreensão da mecânica** — ≥80% criam a primeira conexão sem intervenção do professor.
3. **Conclusão** — ≥70% das equipes chegam à síntese dentro da aula.
4. **Qualidade** — média ≥6 conexões sustentadas por equipe, das quais ≥2 de dentro para fora.
5. **Robustez** — zero dossiê perdido; zero travamento por limite de armazenamento.
6. **Utilidade para o professor** — o painel importa todos os dossiês e responde, em menos de 5 minutos,
   "qual camada a turma ignorou".
7. **Percepção** — ≥70% dos alunos relatam ter percebido uma relação que não tinham percebido antes.
8. **Sinal negativo a vigiar** — se as equipes acumularem evidência sem conectar, a proposta central falhou
   e o problema é de interface, não de esforço do aluno.

---

## 12. Roadmap

### v0.1 — Protótipo (2026/2, uso na própria disciplina)

Tudo de §11.1, uma bacia, uma missão, validação em aula. Objetivo: descobrir se a mecânica de conexão
funciona com aluno real. Marco: aula de validação com GEO164.

### v0.2 — Ajuste pós-validação (mesmo semestre)

Correções de usabilidade da validação; calibração dos pontos com base na distribuição real observada;
duas missões curtas de camada como preparação para a Avaliação 1; melhoria do painel conforme o uso do
próprio professor na correção da Avaliação 3.

### v1.0 — Segunda versão (2027/1)

- **Backend leve** (Supabase ou equivalente): turmas reais, sincronização, painel ao vivo, comentário do
  professor durante a investigação. Traz consigo autenticação e tratamento de dado pessoal — decidir com o
  jurídico/DPO da UFJF antes, não depois.
- **IndexedDB** substituindo `localStorage`, removendo o teto de armazenamento e liberando foto em resolução
  maior.
- **Catálogo de missões** com 3 a 5 bacias e a possibilidade de professores de outras disciplinas montarem a
  sua.
- **Modo campo dedicado**: sequência otimizada para coleta, com ficha de parâmetros físico-químicos alinhada
  à Unidade III (pH, condutividade, turbidez, temperatura) e comparação automática com as classes da
  CONAMA 357.
- **Colaboração simultânea** na mesma equipe.

### v2.0 — Futuro

- **Trilha para ensino básico**, com conteúdo reescrito e alinhamento à BNCC — produto irmão, não configuração
  do mesmo.
- **Banco colaborativo de bacias** alimentado por professores, com curadoria.
- **Integração com QGIS**: importar diretamente a bacia delimitada pelo aluno na prática da Unidade II.
- **Importação automática de dados abertos** (ANA, INMET, CEMADEN) por API, gerando cartas de evidência
  atualizadas em vez de curadas à mão — é o que ataca o gargalo de §13.
- **Modo debate**: duas equipes defendem explicações concorrentes sobre a mesma bacia.
- **Análise de série longa** para distinguir tendência climática de evento isolado, articulando com a
  Unidade III.

### Sequência de dependências

```
Cartas do Paraibuna curadas
        └─> v0.1 protótipo ──> validação com a turma
                                      └─> v0.2 ajuste
                                              └─> v1.0 (backend, IndexedDB, catálogo)
                                                      ├─> v2.0 ensino básico
                                                      └─> v2.0 dados abertos por API
```

O caminho crítico é a curadoria das cartas, não o código.

---

## 13. Riscos e decisões em aberto

### 13.1 Riscos de produto

| # | Risco | Severidade | Mitigação |
|---|---|---|---|
| R1 | **Curadoria das cartas é o gargalo real.** Cada bacia nova exige 10 a 15 cartas montadas à mão. É trabalho de professor, não de programador, e não escala | **Alta** | MVP com uma bacia só; alunos de nível 4 podem propor cartas (§7.10); importação por API no roadmap |
| R2 | Gamificação vira caça-pontos e o aluno otimiza o placar em vez de pensar | Alta | Tetos por camada e por par (§7.3); sem ranking; ponto separado de nota; pontuação recalculada, nunca incrementada |
| R3 | O aluno acumula evidência e não conecta — a mecânica central não pega | Alta | Camada vazia visível na cebola; sugestão de conexão ao registrar evidência; síntese bloqueada sem 3 conexões; é o sinal negativo nº 8 da validação |
| R4 | Conexão errada não corrigida a tempo consolida erro conceitual | Média | Matriz de plausibilidade avisa na hora; bloco de erros comuns por camada; painel expõe conexões implausíveis ao professor |
| R5 | Limite de ~5 MB do `localStorage` estoura com fotos de campo | Média | Redimensionamento e compressão; aviso em 80%; backup a cada 10 ações; IndexedDB na v1.0 |
| R6 | Perda de dossiê entre o campo e a entrega | **Alta** | Escrita imediata, backup automático, exportação sempre visível, JSON em tela como último recurso |
| R7 | Aluno sem celular compatível ou sem espaço no aparelho | Média | App leve; funciona em qualquer navegador moderno; trabalho em equipe permite um aparelho por equipe |
| R8 | O professor não consegue manter o app sozinho | Média | Zero build, zero dependência, HTML editável; é o motivo de §10.1 |
| R9 | Nome digitado permite se passar por outro aluno | Baixa | Aceito no MVP e declarado (§10.6); a entrega é pelo Classroom, que já identifica o autor |
| R10 | A metáfora da cebola volta a ser lida como funil pelos alunos | Média | Setas bidirecionais obrigatórias; conexão de dentro para fora vale 25 contra 15; conquista "Rio que Esculpe"; anéis literalmente porosos |

### 13.2 Riscos de conteúdo (lacunas reais já registradas em `RESOURCES.md`)

| # | Lacuna | Impacto | Encaminhamento |
|---|---|---|---|
| C1 | `LIVRO_UNICO_hidrogeografia.pdf` (Machado & Torres) desapareceu da raiz do workspace em 19/08/2026 | Fonte primária do curso indisponível para citar nas cartas | Localizar e recolocar antes de montar as cartas |
| C2 | Sem fonte local de climatologia geral (Hadley, ZCAS, El Niño) | Cartas da C1 dependem do portal do INMET | Usar INMET e buscar capítulo dedicado |
| C3 | Sem manual de índices morfométricos (Horton/Strahler, densidade de drenagem, coeficiente de compacidade) | Cartas da C3 ficam limitadas ao que a Lição 5 cobre | Buscar quando a lição de morfometria for montada |
| C4 | Sem fonte específica sobre mudanças climáticas e eventos extremos em JF (fev/jun 2026) | Cartas 2, 3 e 10 dependem de notícia e boletim | Coletar no momento do estudo de caso e registrar a fonte com data |
| C5 | Pegada hídrica sem PDF local; valores da WFN são ordem de grandeza | Risco de o aluno decorar número como fato | O app rotula esses valores como "ordem de grandeza, para comparação" |

### 13.3 Decisões em aberto

1. **A missão demonstrativa entra como Avaliação 3 ou como preparação para ela?** Se for a própria avaliação,
   a rubrica do app precisa espelhar exatamente os pesos do plano (25/25/25/25) em vez dos de §2.6.
   *Recomendação:* usar como preparação no primeiro semestre e avaliar a mecânica antes de amarrar nota a ela.
2. **Um dossiê por equipe ou um por aluno com mesclagem?** *Recomendação:* por aluno, com mesclagem no
   painel — preserva a contribuição individual, que a regra de §7.8 depende de identificar.
3. **A extensão (GEO316 e visita ao comitê) usa o app como caderno de campo já no MVP?** Exigiria uma missão
   própria de camada 6 sobre instrumentos de gestão. *Recomendação:* sim, na v0.2 — é barato e o comitê é
   evidência viva da camada 6.
4. **Quanto de conteúdo teórico fica dentro do app?** *Recomendação:* nada além de perguntas-guia e links
   para as lições. O app é onde se investiga; a lição é onde se estuda. Duplicar conteúdo cria duas fontes
   para manter.
5. **Aceitar conexão implausível sem atrito?** Hoje: aceita, marca, não bloqueia. Se a validação mostrar
   proliferação de conexão aleatória, endurecer para exigir mecanismo mínimo antes de salvar.
6. **Vale enfrentar autenticação na v1.0?** Traz painel ao vivo e traz LGPD de dado de aluno.
   *Recomendação:* só depois de o protótipo provar que a mecânica funciona. Não pagar esse custo por um app
   que talvez precise mudar de forma.

---

# Síntese de uma página — para designer e desenvolvedor

**Produto.** *Caminhos da Água* — Água, território e sociedade em conexão. PWA educacional em que o estudante
de graduação em Geografia investiga uma bacia hidrográfica real como sistema complexo e produz um dossiê
avaliável.

**Usuários.** Aluno de GEO164 (UFJF), em equipe, no celular, frequentemente offline em campo. Professor, no
desktop, montando missão e corrigindo dossiê.

**A ideia em uma frase.** Seis camadas de análise em torno de um rio; o valor está nas **conexões
direcionadas** que o aluno cria entre elas, sustentadas por evidência nas duas pontas.

**As seis camadas (os "caminhos").** 1 Clima · 2 Ciclo hidrológico · 3 Solos, geologia e relevo ·
4 Vegetação e ecossistemas · 5 Sociedade e economia · 6 Política e gestão. Miolo: o rio, córrego, nascente,
lago ou aquífero investigado.

**A regra visual que não se negocia.** A cebola é **porosa** e os fluxos vão nos **dois sentidos**. Nada de
funil, nada de setas só centrípetas, nada de hierarquia de fora para dentro. O rio não só recebe: ele esculpe
o relevo, sustenta a mata ciliar, organiza a cidade, distribui o risco e impõe a agenda política. Conexão de
dentro para fora vale 25 pontos; de fora para dentro, 15. Os anéis têm falhas literais por onde as setas
atravessam.

**Fluxo do aluno.** Entrar → escolher recorte → ler o problema e **congelar uma hipótese** → percorrer
camadas → ler e registrar evidências → **criar conexões com direção e mecanismo** → montar cadeia de efeito
dominó → escrever a síntese → propor ação com limitação obrigatória → confrontar com a hipótese inicial →
exportar dossiê.

**11 telas.** T1 Inicial · T2 Seleção da bacia · **T3 Cebola porosa (tela-assinatura e hub de navegação)** ·
T4 Camada · T5 Cartas de evidência · T6 Mapa · **T7 Conexões (coração do produto)** · T8 Efeito dominó ·
T9 Síntese final · T10 Perfil · T11 Painel do professor.

**Gamificação em três regras.** Premiar conexão, hipótese e **revisão** — nunca velocidade. Teto de 6
evidências por camada e 3 conexões por par, para que acumular não sirva. Sem ranking, e pontos ditos sempre
como "pontos de investigação", separados da nota, que é do professor por rubrica.

**Missão de estreia.** "Por que o rio da nossa cidade está mais sujeito a enchentes?" — Rio Paraibuna,
córregos Ipiranga e Teixeiras, chuvas de fevereiro e junho de 2026 em Juiz de Fora. 12 cartas de evidência.
A pergunta trata a chuva como constante, de modo que "choveu muito" não seja resposta. Resposta esperada: a
chuva não é o que mudou — a bacia é.

**Stack.** HTML, CSS e JavaScript puros. Sem framework, sem build, sem servidor. Uma página com roteamento
por hash, `localStorage` como fonte de verdade, export/import de JSON como sincronização, service worker
cache-first para funcionar em modo avião, distribuição pelo Google Classroom. Reaproveitar
`assets/style.css` do workspace e o padrão de componente por atributos `data-*` de `assets/quiz.js`.

**Dados.** `Missao` e `CartaEvidencia` vêm do professor. O aluno produz `RegistroEvidencia`, `Conexao`,
`Cadeia`, `Hipotese`, `Sintese`, `Acao` e `Revisao`. `Conexao.sustentada`, `Conexao.plausivel` e
`Pontuacao` são **sempre derivadas**, nunca gravadas como estado — o placar é recalculado do zero a cada
leitura.

**Privacidade por arquitetura.** Sem servidor, sem conta, sem e-mail, sem rastreamento. Coleta-se nome e
turma. Nada sai do aparelho a não ser o arquivo que o próprio aluno exporta.

**O que decide o sucesso.** As equipes conectam, ou só acumulam evidência? Se acumularem, o problema é da
interface. Meta na validação: ≥6 conexões sustentadas por equipe, com ≥2 de dentro para fora, em uma aula de
50 minutos, offline, sem perder um único dossiê.

**O maior risco não é técnico.** É a curadoria: cada bacia nova exige de 10 a 15 cartas de evidência montadas
à mão pelo professor. Uma bacia no MVP. Importação de dados abertos por API é o que resolve isso — e fica
para a v2.0.
