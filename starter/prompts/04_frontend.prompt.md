---
mode: agent
applyTo: "starter/templates/index.html,starter/static/**"
---

Rebuild the Sudoku frontend. Do NOT change app.py or sudoku_logic.py.
Do NOT run pip install. All code must be Black-formatted where applicable.

## HTML (templates/index.html)
- Difficulty selector (easy, medium, hard)
- New Game button
- 9x9 Sudoku board with alternating colors for 3x3 squares
- Check button — highlights incorrect cells in red
- Hint button — fills one correct empty cell, locks it, highlights in green
- Timer display (format: mm:ss)
- Dark mode toggle button
- Message area for win/error messages
- Top 10 scoreboard table (rank, name, time, difficulty, hints)

## CSS (static/styles.css)
- Light and dark mode support
- Alternating colors for 3x3 squares (two clearly different background colors)
- Responsive layout for mobile and desktop
- Locked cells (prefilled + hint) must look different from editable cells
- Incorrect cells highlighted in red, hint cells in green

## JavaScript (static/main.js)
- On new game: fetch /new?difficulty=X, render board, start timer, reset hint counter
- Locked cells: prefilled cells are not editable
- Timer: counts up in mm:ss, stops when puzzle is solved
- Check button: fetch /check with current board, highlight incorrect cells
- Hint button: find one empty cell, fill with correct value from solution — 
  store solution in JS from a new /hint route
- Dark mode toggle: switches CSS class on body
- Win detection: when board is complete and correct, stop timer, show message,
  prompt for player name, save to Top 10 in localStorage
- Top 10: load from localStorage, display sorted by time, keep only top 10

## New Flask route needed in app.py
Add GET /hint route that returns one empty cell position and its correct value.