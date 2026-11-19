const PREFIX = "snakeexe:";

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.warn("Não foi possível salvar:", error);
  }
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn("Não foi possível ler:", error);
    return fallback;
  }
}

export function getHighScores() {
  const defaults = { easy: 0, normal: 0, hard: 0 };
  return { ...defaults, ...load("highscores:classic", {}) };
}

export function saveHighScore(speed, score) {
  const scores = getHighScores();
  if (score > scores[speed]) {
    scores[speed] = score;
    save("highscores:classic", scores);
    return true;
  }
  return false;
}

export function getBestScore() {
  const scores = getHighScores();
  return Math.max(scores.easy, scores.normal, scores.hard);
}