const boardElement = document.getElementById("board");
const statusText = document.getElementById("statusText");
const solveBtn = document.getElementById("solveBtn");
const resetBtn = document.getElementById("resetBtn");

const initialBoard = [
  [5, 3, "", "", 7, "", "", "", ""],
  [6, "", "", 1, 9, 5, "", "", ""],
  ["", 9, 8, "", "", "", "", 6, ""],
  [8, "", "", "", 6, "", "", "", 3],
  [4, "", "", 8, "", 3, "", "", 1],
  [7, "", "", "", 2, "", "", "", 6],
  ["", 6, "", "", "", "", 2, 8, ""],
  ["", "", "", 4, 1, 9, "", "", 5],
  ["", "", "", "", 8, "", "", 7, 9]
];

let board = [];

function copyBoard(source) {
  return source.map(row => [...row]);
}

function drawBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.classList.add("cell");
      input.setAttribute("maxlength", "1");

      const value = board[row][col];
      input.value = value;

      if (initialBoard[row][col] !== "") {
        input.classList.add("prefilled");
        input.readOnly = true;
      }

      if (col === 2 || col === 5) {
        input.classList.add("box-border-right");
      }

      if (row === 2 || row === 5) {
        input.classList.add("box-border-bottom");
      }

      input.addEventListener("input", (e) => {
        const val = e.target.value;
        if (val === "" || (val >= 1 && val <= 9)) {
          board[row][col] = val === "" ? "" : Number(val);
        } else {
          e.target.value = "";
        }
      });

      boardElement.appendChild(input);
    }
  }
}

function isValid(board, row, col, num) {
  // fila
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  // columna
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  // subcuadro 3x3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true;
}

function findEmpty(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === "") {
        return [row, col];
      }
    }
  }
  return null;
}

function solveSudoku(board) {
  const empty = findEmpty(board);

  if (!empty) return true;

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudoku(board)) {
        return true;
      }

      board[row][col] = "";
    }
  }

  return false;
}

function updateBoardUI() {
  const inputs = document.querySelectorAll(".cell");

  inputs.forEach((input, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    input.value = board[row][col];
  });
}

function solveHandler() {
  const tempBoard = copyBoard(board);

  const solved = solveSudoku(tempBoard);

  if (solved) {
    board = tempBoard;
    updateBoardUI();
    statusText.textContent = "Sudoku solved using backtracking.";
  } else {
    statusText.textContent = "No solution found.";
  }
}

function resetBoard() {
  board = copyBoard(initialBoard);
  drawBoard();
  statusText.textContent = "Board reset.";
}

solveBtn.addEventListener("click", solveHandler);
resetBtn.addEventListener("click", resetBoard);

function init() {
  board = copyBoard(initialBoard);
  drawBoard();
}

init();