let currentPlayer = 'X';
let gameActive = true;
let points1 = 0;
let points2 = 0;
let boardSize = 3;
let board = [];
let player1Name = '';
let player2Name = '';

const boardElement = document.getElementById('board');
const turnIndicator = document.getElementById('turnIndicator');
const points1Display = document.getElementById('points1');
const points2Display = document.getElementById('points2');

function createBoard() {
  boardSize = parseInt(document.getElementById('boardSize').value);
  board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 60px)`;
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.onclick = () => cellClick(rowIndex, cellIndex);
      boardElement.appendChild(cellElement);
    });
  });
  resetGame();
}

function cellClick(rowIndex, cellIndex) {
  if (gameActive && !board[rowIndex][cellIndex]) {
    board[rowIndex][cellIndex] = currentPlayer;
    updateBoard();
    if (checkResult()) {
      gameActive = false;
      turnIndicator.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} wins!`;
      updatePoints();
    } else if (board.flat().every(cell => cell)) {
      gameActive = false;
      turnIndicator.textContent = `It's a draw!`;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateTurnIndicator();
    }
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const rowIndex = Math.floor(index / boardSize);
    const cellIndex = index % boardSize;
    cell.textContent = board[rowIndex][cellIndex];
    cell.classList.toggle('win', board[rowIndex][cellIndex] === currentPlayer && gameActive && checkResult());
  });
}

function checkResult() {
  const lines = [
    // Rows
    ...board,
    // Columns
    ...board[0].map((_, colIndex) => board.map(row => row[colIndex])),
    // Diagonals
    board.map((_, index) => board[index][index]),
    board.map((_, index) => board[index][boardSize - index - 1])
  ];
  return lines.some(line => line.every(cell => cell === currentPlayer));
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
  updateBoard();
  updateTurnIndicator();
}

function updateTurnIndicator() {
  turnIndicator.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
}

function updatePoints() {
  if (currentPlayer === 'X') {
    points1++;
    points1Display.textContent = points1;
  } else {
    points2++;
    points2Display.textContent = points2;
  }
}

function saveGame() {
  localStorage.setItem('points1', points1);
  localStorage.setItem('points2', points2);
}

window.onload = function() {
  if (localStorage.getItem('points1') !== null) {
    points1 = parseInt(localStorage.getItem('points1'));
    points1Display.textContent = points1;
  }
  if (localStorage.getItem('points2') !== null) {
    points2 = parseInt(localStorage.getItem('points2'));
    points2Display.textContent = points2;
  }
  player1Name = prompt('Enter name for Player 1', 'Player 1');
  player2Name = prompt('Enter name for Player 2', 'Player 2');
  document.getElementById('player1Name').value = player1Name;
  document.getElementById('player2Name').value = player2Name;
  createBoard();
};
