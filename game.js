const SIZE = 20;
const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
const boardEl = document.getElementById("game-board");
const statusEl = document.getElementById("status");

let currentPlayer = "X";
let gameOver = false;

function createBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handlePlayerClick);
      boardEl.appendChild(cell);
    }
  }
}

function handlePlayerClick(e) {
  if (gameOver) return;

  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;

  if (board[row][col] !== "") return;

  makeMove(row, col, "X");

  if (checkWin(row, col, "X")) {
    endGame("Bạn thắng!");
    return;
  }

  setTimeout(() => {
    const botMove = getBestMove(board, SIZE, "O");
    if (botMove) {
      makeMove(botMove.row, botMove.col, "O");
      if (checkWin(botMove.row, botMove.col, "O")) {
        endGame("Máy thắng!");
      }
    }
  }, 300);
}

function makeMove(row, col, player) {
  board[row][col] = player;
  const cell = getCell(row, col);
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  currentPlayer = player === "X" ? "O" : "X";
  statusEl.textContent = `Lượt của bạn: ${currentPlayer}`;
}

function getCell(row, col) {
  return boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function checkWin(row, col, player) {
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 }
  ];

  for (const { dx, dy } of directions) {
    let count = 1;
    const cells = [[row, col]];

    // Forward
    for (let step = 1; step < 5; step++) {
      const r = row + dy * step;
      const c = col + dx * step;
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
        count++;
        cells.push([r, c]);
      } else break;
    }

    // Backward
    for (let step = 1; step < 5; step++) {
      const r = row - dy * step;
      const c = col - dx * step;
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
        count++;
        cells.push([r, c]);
      } else break;
    }

    if (count >= 5) {
      // Highlight thắng
      cells.forEach(([r, c]) => {
        getCell(r, c).classList.add("win");
      });
      return true;
    }
  }

  return false;
}

function endGame(message) {
  gameOver = true;
  statusEl.textContent = message;
}

// Khởi tạo game
createBoard();
