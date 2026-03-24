---
mode: agent
applyTo: "starter/app.py"
---

Update the /new route in app.py to support difficulty levels.

The sudoku_logic module now has a DIFFICULTY constant with "easy", "medium", "hard"
and generate_puzzle() accepts a difficulty parameter instead of clues.

Change the /new route so it:
- accepts a "difficulty" query parameter (default: "medium")
- passes it directly to generate_puzzle(difficulty=difficulty)
- removes the old "clues" parameter

Do NOT change anything else. Do NOT run pip install.
All code must be Black-formatted (line-length 88).