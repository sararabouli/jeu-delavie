// Jeu de la Vie - Logique principale

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let rows = 20;
let cols = 20;
let cellSize = 20;
let grid = [];
let running = false;
let speed = 5; // cycles/seconde

// --- Initialisation de la grille ---
function createGrid() {
  grid = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));
}

// --- Dessiner la grille ---
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = grid[y][x] ? "#333" : "#fafafa";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// --- Compter les voisins vivants ---
function countNeighbors(r, c) {
  let count = 0;
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      if (x === 0 && y === 0) continue;
      const newY = (r + y + rows) % rows;
      const newX = (c + x + cols) % cols;
      count += grid[newY][newX];
    }
  }
  return count;
}

// --- Calcul de la génération suivante ---
function nextGeneration() {
  const newGrid = grid.map(arr => [...arr]);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(y, x);
      if (grid[y][x] === 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[y][x] = 0;
      } else if (grid[y][x] === 0 && neighbors === 3) {
        newGrid[y][x] = 1;
      }
    }
  }
  grid = newGrid;
  drawGrid();
}

// --- Contrôles ---
document.getElementById("startBtn").addEventListener("click", () => {
  running = true;
  loop();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  running = false;
});

function loop() {
  if (!running) return;
  nextGeneration();
  setTimeout(loop, 1000 / speed);
}

// --- Initialisation au chargement ---
window.onload = () => {
  createGrid();
  drawGrid();

  // Permet de cliquer sur les cellules pour les activer
  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    grid[y][x] = grid[y][x] ? 0 : 1;
    drawGrid();
  });
};