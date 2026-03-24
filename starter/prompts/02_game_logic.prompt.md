---
mode: agent
applyTo: "starter/sudoku_logic.py"
---

Refactor starter/sudoku_logic.py. Do NOT change app.py or any other file.
Do NOT run pip install.
All code must be Black-formatted (line-length 88).

## 1. Unique solution validation
Add a function count_solutions(board) that counts solutions up to 2.
Update remove_cells() to ensure the puzzle has exactly one unique solution.

## 2. Difficulty levels
Add a constant DIFFICULTY with three levels:
- easy: 36 clues
- medium: 27 clues  
- hard: 22 clues

Update generate_puzzle(difficulty="medium") to accept difficulty as parameter.

## 3. Keep all existing functions intact
Do not remove or rename: create_empty_board, is_safe, fill_board, generate_puzzle, deep_copy, SIZE, EMPTY