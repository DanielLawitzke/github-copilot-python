---
applyTo: "**/*.py,**/*.html,**/*.js,**/*.css"
---

# Copilot Instructions

## Project
Flask Sudoku app — refactor legacy code, add modern features.

## Code Style
- Python 3.10+, PEP 8 and black compliant
- Modular structure: logic in separate files (sudoku.py, routes.py)
- English comments, minimal and meaningful
- Consistent error handling with try/except

## Frontend
- Vanilla JS — no frameworks
- Plain CSS or CSS modules — no Tailwind, no Bootstrap
- Single HTML template with Jinja2

## Architecture
- app.py: Flask entry point only
- sudoku.py: all puzzle logic (generation, validation, solving)
- templates/index.html: UI
- static/: CSS and JS files

## Standards
- Every new feature needs at least one test in pytest
- No hardcoded puzzle data — always generate dynamically
- Prefilled cells must be locked (not editable)