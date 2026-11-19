
import { Snake, DIRECTIONS } from "./snake.js";
import { spawnFood } from "./food.js";
import { getHighScores, saveHighScore } from "./storage.js";
import { getSkin } from "./skins.js";
import { playSound, startMusic, stopMusic } from "./audio.js";
import { recordGameStart, recordFoodEaten, recordGameCompleted } from "./statistics.js";
import { getPlayerName } from "./player.js";
import { isRankingConfigured, isBetterThanSent, submitScore } from "./ranking.js";

// ---------- Configurações ----------
const GRID_SIZE = 20;   // tabuleiro de 20 x 20 casas
const CELL = 24;        // cada casa tem 24px (20 * 24 = 480px do canvas)
const POINTS_PER_FOOD = 10;

const SPEEDS = { easy: 180, normal: 120, hard: 70 };

const FOOD_COLOR = "#ff6b81";

// ---------- Elementos da página ----------
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d"); // "ctx" é o nosso pincel
const scoreEl = document.getElementById("hud-score");
const recordEl = document.getElementById("hud-record");
const gameOverEl = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const finalRecordEl = document.getElementById("final-record");
const newRecordEl = document.getElementById("new-record");
const pauseEl = document.getElementById("pause-menu");
const rankingStatusEl = document.getElementById("ranking-status-game");

// ---------- Estado da partida ----------
let snake;
let food;
let score;
let tickMs;           // intervalo entre passos
let lastTick;         // quando foi o último passo
let animationId;      // "número do ingresso" do loop, pra poder cancelar
let running = false;  // true = o loop está rodando
let paused = false;   // true = jogo congelado pela jogadora
let directionQueue;   // fila de curvas que a jogadora apertou
let currentSpeed;     // "easy" | "normal" | "hard" (pra saber qual recorde usar)
let highScore;        // recorde da dificuldade atual (mostrado no HUD)
let skin;             // cores da cobrinha nesta partida

// ---------- Começar / parar ----------
export function startGame(speed) {
  stopGame(); // garante que não tem outro loop rodando

  snake = new Snake(5, 10);
  food = spawnFood(snake.body, GRID_SIZE);
  score = 0;
  tickMs = SPEEDS[speed];
  directionQueue = [];

  currentSpeed = speed;
  highScore = getHighScores()[speed];
  recordEl.textContent = highScore;
  skin = getSkin(); // a skin é lida quando a partida começa

  scoreEl.textContent = score;
  gameOverEl.classList.remove("visible");
  pauseEl.classList.remove("visible");
  rankingStatusEl.hidden = true;

  recordGameStart(snake.body.length);
  startMusic();

  running = true;
  lastTick = performance.now();
  draw();
  animationId = requestAnimationFrame(loop);
}

export function stopGame() {
  running = false;
  paused = false;
  cancelAnimationFrame(animationId);
  stopMusic();
}

function endGame() {
  stopGame();

  const isNewRecord = saveHighScore(currentSpeed, score);
  recordGameCompleted();
  playSound("gameover");

  finalScoreEl.textContent = score;
  finalRecordEl.textContent = getHighScores()[currentSpeed];
  newRecordEl.hidden = !isNewRecord;
  gameOverEl.classList.add("visible");

  if (isRankingConfigured() && isBetterThanSent(currentSpeed, score)) {
    rankingStatusEl.textContent = "Enviando pro ranking...";
    rankingStatusEl.hidden = false;

    submitScore(getPlayerName(), currentSpeed, score).then((ok) => {
      rankingStatusEl.textContent = ok
        ? "Pontuação enviada pro ranking! 🏆"
        : "Não deu pra enviar pro ranking (sem internet?)";
    });
  }
}

// ---------- Pausa ----------
// Pausar = parar o loop (nada se mexe) e mostrar o menu.
// Continuar = ligar o loop de novo.
export function pauseGame() {
  if (!running) return; // só dá pra pausar uma partida rolando
  running = false;
  paused = true;
  cancelAnimationFrame(animationId);
  stopMusic();
  pauseEl.classList.add("visible");
}

export function resumeGame() {
  if (!paused) return; // só dá pra continuar se estava pausado
  paused = false;
  running = true;
  pauseEl.classList.remove("visible");
  startMusic();

  lastTick = performance.now();
  animationId = requestAnimationFrame(loop);
}

// ---------- O loop do jogo ----------
// O navegador chama loop() ~60 vezes por segundo (requestAnimationFrame).
// Mas a cobrinha NÃO anda 60 vezes por segundo: só damos um passo
// quando já passou tempo suficiente (tickMs) desde o último.
function loop(time) {
  if (time - lastTick >= tickMs) {
    lastTick = time;
    update();
  }
  if (running) {
    animationId = requestAnimationFrame(loop);
  }
}

// Um "passo" do jogo: decide o que acontece e atualiza o estado.
function update() {
  // 1) Pega a próxima curva da fila (se tiver)
  if (directionQueue.length > 0) {
    snake.direction = directionQueue.shift();
  }

  // 2) Calcula pra onde a cabeça vai
  const next = snake.getNextHead();

  // 3) Parede?
  if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
    endGame();
    return;
  }

  // 4) Vai comer?
  const willEat = food !== null && next.x === food.x && next.y === food.y;

  // 5) Bateu no próprio corpo?
  if (snake.hitsItself(next, willEat)) {
    endGame();
    return;
  }

  // 6) Tá tudo certo: anda!
  snake.move(willEat);

  if (willEat) {
    score += POINTS_PER_FOOD;
    scoreEl.textContent = score;
    playSound("eat");
    recordFoodEaten(snake.body.length);

    if (score > highScore) {
      highScore = score;
      recordEl.textContent = highScore;
    }

    food = spawnFood(snake.body, GRID_SIZE);
    if (food === null) {
      endGame(); // tabuleiro cheio, não tem mais onde pôr comida
      return;
    }
  }

  draw();
}

// ---------- Desenho ----------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // O brilhinho (glow) vem do shadowBlur
  ctx.shadowBlur = 10;

  if (food) {
    ctx.shadowColor = FOOD_COLOR;
    ctx.fillStyle = FOOD_COLOR;
    drawCell(food.x, food.y);
  }

  snake.body.forEach((part, index) => {
    const color = index === 0 ? skin.head : skin.body;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    drawCell(part.x, part.y);
  });

  ctx.shadowBlur = 0;
}

// Desenha um quadradinho na casa (x, y), com 1px de folga
// em volta pra dar aquele visual de gominhos.
function drawCell(x, y) {
  ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
}

// ---------- Teclado ----------
const KEY_TO_DIRECTION = {
  ArrowUp: DIRECTIONS.up,
  ArrowDown: DIRECTIONS.down,
  ArrowLeft: DIRECTIONS.left,
  ArrowRight: DIRECTIONS.right,
};

document.addEventListener("keydown", (event) => {
  // Esc ou P: pausa (se está jogando) ou continua (se está pausado)
  if (event.key === "Escape" || event.key === "p" || event.key === "P") {
    if (running) pauseGame();
    else resumeGame();
    return;
  }

  const newDirection = KEY_TO_DIRECTION[event.key];
  if (!newDirection || !running) return;

  event.preventDefault(); // evita a página rolar com as setas
  queueDirection(newDirection);
});

function queueDirection(newDirection) {
  const last = directionQueue.length > 0
    ? directionQueue[directionQueue.length - 1]
    : snake.direction;

  const isSame = newDirection === last;
  const isReverse = newDirection.x === -last.x && newDirection.y === -last.y;

  if (isSame || isReverse) return;
  if (directionQueue.length < 2) {
    directionQueue.push(newDirection);
  }
}