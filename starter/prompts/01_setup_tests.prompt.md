---
mode: agent
applyTo: "starter/tests/**"
---

Set up a pytest testing framework for this Flask Sudoku app.

## Prerequisites
- If pyproject.toml does not exist: create it with Black (line-length 88, target-version py310) and pytest (addopts --black)
- If requirements.txt does not exist: create it with pytest and pytest-black
- If they exist: leave them unchanged
- Do NOT run pip install — assume all packages are already installed
- Create all files inside the starter/ directory

## Tests
Create starter/tests/conftest.py with Flask app fixture using test client.

Rewrite starter/tests/test_sudoku.py completely:
- Imports only: import sudoku_logic, from sudoku_logic import ..., use client fixture from conftest.py
- No code from sudoku_logic.py — only imports and test functions
- All code must be Black-formatted (line-length 88)

Tests to implement:
- test_create_empty_board: check 9x9 grid of zeros
- test_is_safe: check row/column/box validation
- test_generate_puzzle_shape: puzzle and solution are 9x9
- test_generate_puzzle_solution_no_zeros: solution has no zeros
- test_new_route: GET /new returns 200, puzzle in response, solution NOT in response
- test_check_route: call GET /new first, send POST /check with board from /new response, assert 200 and incorrect in response — do NOT call generate_puzzle()