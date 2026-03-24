import copy
import random
import pytest
import sudoku_logic
from sudoku_logic import create_empty_board, is_safe, generate_puzzle

SIZE = 9
EMPTY = 0


def deep_copy(board):
    return copy.deepcopy(board)


def create_empty_board():
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]


def is_safe(board, row, col, num):
    # Check row and column
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False
    # Check 3x3 box
    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True


def fill_board(board):
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                possible = list(range(1, SIZE + 1))
                random.shuffle(possible)
                for candidate in possible:
                    if is_safe(board, row, col, candidate):
                        board[row][col] = candidate
                        if fill_board(board):
                            return True
                        board[row][col] = EMPTY
                return False
    return True


def remove_cells(board, clues):
    attempts = SIZE * SIZE - clues
    while attempts > 0:
        row = random.randrange(SIZE)
        col = random.randrange(SIZE)
        if board[row][col] != EMPTY:
            board[row][col] = EMPTY
            attempts -= 1


def generate_puzzle(clues=35):
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)
    remove_cells(board, clues)
    puzzle = deep_copy(board)
    return puzzle, solution


def test_create_empty_board():
    board = create_empty_board()
    assert isinstance(board, list)
    assert len(board) == 9
    for row in board:
        assert isinstance(row, list)
        assert len(row) == 9
        assert all(cell == 0 for cell in row)


def test_is_safe():
    board = create_empty_board()
    board[0][0] = 7
    assert not is_safe(board, 0, 1, 7)  # Row conflict
    assert not is_safe(board, 1, 0, 7)  # Column conflict
    assert not is_safe(board, 1, 1, 7)  # Box conflict
    assert is_safe(board, 0, 1, 3)  # No conflict


def test_generate_puzzle_shape():
    puzzle, solution = generate_puzzle()
    assert isinstance(puzzle, list)
    assert isinstance(solution, list)
    assert len(puzzle) == 9
    assert len(solution) == 9
    for row in puzzle:
        assert isinstance(row, list)
        assert len(row) == 9
    for row in solution:
        assert isinstance(row, list)
        assert len(row) == 9


def test_generate_puzzle_solution_no_zeros():
    _, solution = generate_puzzle()
    for row in solution:
        assert all(cell != 0 for cell in row)


def test_new_route(client):
    response = client.get("/new")
    assert response.status_code == 200
    data = response.get_json()
    assert "puzzle" in data
    assert "solution" not in data
    puzzle = data["puzzle"]
    assert isinstance(puzzle, list)
    assert len(puzzle) == 9
    for row in puzzle:
        assert isinstance(row, list)
        assert len(row) == 9


def test_check_route(client):
    response = client.get("/new")
    assert response.status_code == 200
    data = response.get_json()
    board = data["puzzle"]
    check_response = client.post("/check", json={"board": board})
    assert check_response.status_code == 200
    check_data = check_response.get_json()
    assert "incorrect" in check_data
