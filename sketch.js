let fazendeira;
let tomates = [];
let milhos = [];
let numeroTomates = 8; // **MODIFICADO: Começa com 8 tomates (maçãs)**
let todosColhidos = false;

// Variáveis para o temporizador contínuo do jogo
let tempoTotalRestante = 25; // Tempo inicial em segundos para o jogo inteiro (mantido em 25s)
let timerComecouJogo = false;
let startTimeJogo;
let jogoAcabouPorTempo = false; // Flag para controlar se o jogo terminou por tempo

function setup() {
  createCanvas(600, 400);
  background(124, 252, 0); // Fundo verde grama

  // Inicializa a posição da fazendeira
  fazendeira = {
    x: width / 2,
    y: height / 2,
    tamanho: 40
  };

  // Cria os tomates em posições aleatórias
  for (let i = 0; i < numeroTomates; i++) {
    tomates.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      tamanho: 30,
      colhido: false
    });
  }

  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  // Se o jogo não terminou por tempo, continue atualizando
  if (!jogoAcabouPorTempo) {
    // Inicia o timer do jogo quando o draw começa pela primeira vez
    if (!timerComecouJogo) {
      startTimeJogo = millis();
      timerComecouJogo = true;
    }

    let tempoDecorrido = (millis() - startTimeJogo) / 1000; // Tempo em segundos
    tempoTotalRestante = max(0, 25 - floor(tempoDecorrido)); // Garante que o tempo não seja negativo

    // Verifica se o tempo esgotou para qualquer fase do jogo
    if (tempoTotalRestante === 0) {
      jogoAcabouPorTempo = true; // Marca que o jogo acabou por tempo
      noLoop(); // Para o jogo
      background(255, 0, 0); // Fundo vermelho para indicar "Game Over"
      fill(255); // Texto branco
      textSize(50);
      text("GAME OVER!", width / 2, height / 2 - 20); // Frase curta aqui
      textSize(20);
      text("Você não recolheu todos os alimentos a tempo.", width / 2, height / 2 + 20);
      return; // Sai da função draw para não desenhar mais nada do jogo
    }

    // Desenha o fundo e o tempo restante, independente da fase
    background(124, 252, 0); // Fundo verde para ambas as fases
    fill(0); // Cor preta para o texto
    textSize(28); // Tamanho da fonte para o tempo
    text("Tempo: " + tempoTotalRestante, width - 100, 30); // Posição do tempo

    // Lógica para a primeira fase (coleta de tomates)
    if (!todosColhidos) {
      desenharFazendeira();
      desenharAlimentos(); // Desenha tomates e milhos que surgiram
      moverFazendeira();
      verificarColisao();
      verificarFimDeJogo(); // Verifica se todos os tomates foram colhidos
    }
    // Lógica para a segunda fase (coleta de milhos)
    else {
      desenharFazendeira();
      desenharMilhosParaSumir(); // Esta função desenha APENAS os milhos que AINDA NÃO sumiram
      moverFazendeira();
      verificarColisaoMilho(); // Faz o milho sumir ao colidir
    }
  }
}

function desenharFazendeira() {
  textSize(fazendeira.tamanho);
  text("👩‍🌾", fazendeira.x, fazendeira.y);
}

function desenharAlimentos() {
  for (let i = 0; i < tomates.length; i++) {
    let tomate = tomates[i];
    if (!tomate.colhido) {
      textSize(tomate.tamanho);
      text("🍎", tomate.x, tomate.y);
    }
  }

  // Aqui desenhamos os milhos que já apareceram NA PRIMEIRA FASE
  for (let i = 0; i < milhos.length; i++) {
    let milho = milhos[i];
    // Se estiver na primeira fase e o milho ainda não sumiu (caso tenha sido colhido antes da transição)
    if (!todosColhidos && !milho.sumiu) {
      textSize(milho.tamanho);
      text("🌽", milho.x, milho.y);
    }
  }
}

function desenharMilhosParaSumir() {
  // Esta função é chamada na SEGUNDA FASE do jogo
  for (let i = 0; i < milhos.length; i++) {
    let milho = milhos[i];
    if (!milho.sumiu) { // Só verifica colisão se o milho ainda não sumiu
      textSize(milho.tamanho);
      text("🌽", milho.x, milho.y);
    }
  }
}

function moverFazendeira() {
  let velocidade = 5;

  if (keyIsDown(LEFT_ARROW)) {
    fazendeira.x -= velocidade;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    fazendeira.x += velocidade;
  }
  if (keyIsDown(UP_ARROW)) {
    fazendeira.y -= velocidade;
  }
  if (keyIsDown(DOWN_ARROW)) {
    fazendeira.y += velocidade;
  }

  // Limita a fazendeira dentro da tela
  fazendeira.x = constrain(fazendeira.x, fazendeira.tamanho / 2, width - fazendeira.tamanho / 2);
  fazendeira.y = constrain(fazendeira.y, fazendeira.tamanho / 2, height - fazendeira.tamanho / 2);
}

function verificarColisao() {
  for (let i = 0; i < tomates.length; i++) {
    let tomate = tomates[i];
    if (!tomate.colhido) {
      let d = dist(fazendeira.x, fazendeira.y, tomate.x, tomate.y);
      if (d < (fazendeira.tamanho / 2 + tomate.tamanho / 2) * 0.7) { // Ajuste para melhor detecção
        tomate.colhido = true; // Marca o tomate colidido como colhido

        // **MODIFICADO: Faz 3 maçãs (tomates) desaparecerem**
        let tomatesRemovidos = 1; // Já removemos 1 (o colidido)
        for (let j = 0; j < tomates.length && tomatesRemovidos < 3; j++) {
          if (!tomates[j].colhido) {
            tomates[j].colhido = true;
            tomatesRemovidos++;
          }
        }

        // **MODIFICADO: Cria 5 abacaxis (milhos) em posições aleatórias**
        for (let k = 0; k < 5; k++) {
          milhos.push({
            x: random(50, width - 50), // Posição aleatória
            y: random(50, height - 50), // Posição aleatória
            tamanho: tomate.tamanho, // Mantém o tamanho do tomate
            sumiu: false
          });
        }
        break; // Sai do loop para evitar múltiplas colisões na mesma iteração do draw
      }
    }
  }
}

function verificarColisaoMilho() {
  // Esta função é chamada na segunda fase do jogo para fazer o milho "sumir"
  for (let i = 0; i < milhos.length; i++) {
    let milho = milhos[i];
    if (!milho.sumiu) { // Só verifica colisão se o milho ainda não sumiu
      let d = dist(fazendeira.x, fazendeira.y, milho.x, milho.y);
      if (d < (fazendeira.tamanho / 2 + milho.tamanho / 2) * 0.7) {
        milho.sumiu = true; // Marca o milho para desaparecer
      }
    }
  }

  // Verifica se todos os milhos sumiram para finalizar o jogo e mudar a tela
  let todosMilhosSumiram = true;
  for (let i = 0; i < milhos.length; i++) {
    if (!milhos[i].sumiu) {
      todosMilhosSumiram = false;
      break;
    }
  }

  if (todosMilhosSumiram && todosColhidos) {
    // Se todos os milhos sumiram e estamos na segunda fase
    background(255); // Muda a tela para branco
    fill(0); // Texto preto
    textSize(40);
    text("Missão Completa!", width / 2, height / 2);
    noLoop(); // Para o jogo
  }
}

function verificarFimDeJogo() {
  let todosColhidosAgora = true;
  for (let i = 0; i < tomates.length; i++) {
    if (!tomates[i].colhido) {
      todosColhidosAgora = false;
      break;
    }
  }

  if (todosColhidosAgora && !todosColhidos) {
    todosColhidos = true; // Apenas muda para a segunda fase
  }
}