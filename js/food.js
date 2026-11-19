export function spawnFood(snakeBody, gridSize) {
  const freeCells = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const occupied = snakeBody.some((part) => part.x === x && part.y === y);
      if (!occupied) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) return null;

  const index = Math.floor(Math.random() * freeCells.length);
  return freeCells[index];
}