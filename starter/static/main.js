
// Sudoku Frontend Logic (see prompt for requirements)
const SIZE = 9;
let puzzle = [];
let solution = [];
let locked = [];
let timerInterval = null;
let startTime = null;
let elapsed = 0;
let hintCount = 0;
let currentDifficulty = 'easy';
let gameActive = false;

function getSquareClass(i, j) {
  // Alternating 3x3 backgrounds
  return ((Math.floor(i/3) + Math.floor(j/3)) % 2 === 0) ? 'square-a' : 'square-b';
}

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = `sudoku-cell ${getSquareClass(i, j)}`;
      input.dataset.row = i;
      input.dataset.col = j;
      input.autocomplete = 'off';
      input.inputMode = 'numeric';
      input.pattern = '[1-9]';
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^1-9]/g, '');
        e.target.value = val;
      });
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function renderPuzzle(puz, sol, lockedCells) {
  puzzle = puz;
  solution = sol;
  locked = lockedCells;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      inp.classList.remove('locked', 'hint', 'incorrect');
      if (val !== 0) {
        inp.value = val;
        inp.readOnly = true;
        inp.classList.add('locked');
      } else {
        inp.value = '';
        inp.readOnly = false;
      }
    }
  }
  // Lock hint cells if any
  if (locked && locked.length) {
    for (const [i, j, type] of locked) {
      const idx = i * SIZE + j;
      const inp = inputs[idx];
      inp.readOnly = true;
      inp.classList.add(type === 'hint' ? 'hint' : 'locked');
    }
  }
}

function getBoard() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  return board;
}

function setTimerDisplay(secs) {
  const timer = document.getElementById('timer');
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  timer.textContent = `${mm}:${ss}`;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  startTime = Date.now() - elapsed * 1000;
  timerInterval = setInterval(() => {
    elapsed = Math.floor((Date.now() - startTime) / 1000);
    setTimerDisplay(elapsed);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  elapsed = 0;
  setTimerDisplay(0);
}

async function newGame() {
  const difficulty = document.getElementById('difficulty').value;
  currentDifficulty = difficulty;
  const res = await fetch(`/new?difficulty=${difficulty}`);
  const data = await res.json();
  renderPuzzle(data.puzzle, [], []);
  document.getElementById('message').innerText = '';
  hintCount = 0;
  resetTimer();
  startTimer();
  gameActive = true;
}

async function checkSolution() {
  if (!gameActive) return;
  const board = getBoard();
  const res = await fetch('/check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let idx = 0; idx < inputs.length; idx++) {
    inputs[idx].classList.remove('incorrect');
  }
  if (data.error) {
    msg.style.color = '';
    msg.innerText = data.error;
    return;
  }
  const incorrect = new Set(data.incorrect.map(x => x[0]*SIZE + x[1]));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.readOnly) continue;
    // Only highlight if user entered a value and it's wrong
    if (incorrect.has(idx) && inp.value !== '' && inp.value !== '0') {
      inp.classList.add('incorrect');
    }
  }
  // Only count as solved if all cells are filled and no incorrect
  const allFilled = Array.from(inputs).every(inp => inp.value !== '' && inp.value !== '0');
  if (incorrect.size === 0 && allFilled) {
    winGame();
  } else if (incorrect.size > 0) {
    msg.style.color = '';
    msg.innerText = 'Some cells are incorrect.';
  } else {
    msg.style.color = '';
    msg.innerText = '';
  }
}

async function hint() {
  if (!gameActive) return;
  const board = getBoard();
  const res = await fetch('/hint', {
    method: 'GET',
  });
  const data = await res.json();
  if (data.error) {
    document.getElementById('message').innerText = data.error;
    return;
  }
  const {row, col, value} = data;
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const idx = row * SIZE + col;
  const inp = inputs[idx];
  inp.value = value;
  inp.readOnly = true;
  inp.classList.remove('locked');
  inp.classList.add('hint');
  hintCount++;
  // Optionally store hint cells for locked tracking
}

function winGame() {
  stopTimer();
  gameActive = false;
  document.getElementById('message').style.color = '';
  document.getElementById('message').innerText = 'Congratulations! You solved it!';
  setTimeout(() => {
    const name = prompt('You made the Top 10! Enter your name:','');
    if (name !== null && name.trim() !== '') {
      saveScore(name.trim());
      renderScoreboard();
    }
  }, 300);
}

function saveScore(name) {
  const scores = JSON.parse(localStorage.getItem('sudoku_scores') || '[]');
  scores.push({
    name,
    time: elapsed,
    difficulty: currentDifficulty,
    hints: hintCount
  });
  scores.sort((a, b) => a.time - b.time);
  const top10 = scores.slice(0, 10);
  localStorage.setItem('sudoku_scores', JSON.stringify(top10));
}

function renderScoreboard() {
  const scores = JSON.parse(localStorage.getItem('sudoku_scores') || '[]');
  const tbody = document.querySelector('#scoreboard tbody');
  tbody.innerHTML = '';
  scores.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${s.name}</td><td>${formatTime(s.time)}</td><td>${capitalize(s.difficulty)}</td><td>${s.hints}</td>`;
    tbody.appendChild(tr);
  });
}

function formatTime(secs) {
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('sudoku_dark_mode', document.body.classList.contains('dark-mode'));
}

function loadDarkMode() {
  if (localStorage.getItem('sudoku_dark_mode') === 'true') {
    document.body.classList.add('dark-mode');
  }
}

window.addEventListener('load', () => {
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint').addEventListener('click', hint);
  document.getElementById('difficulty').addEventListener('change', newGame);
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  loadDarkMode();
  renderScoreboard();
  newGame();
});