
import copy
import random

SIZE = 9
EMPTY = 0

# Difficulty levels: number of clues
DIFFICULTY = {
    "easy": 36,
    "medium": 27,
    "hard": 22,
}

def deep_copy(board):
    return copy.deepcopy(board)

def create_empty_board():
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]

def is_safe(board, row, col, num):
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False
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

def count_solutions(board):
    """
    Counts the number of solutions for a given Sudoku board, up to 2.
    Returns 0, 1, or 2.
    """
    def solve_count(b, count):
        for row in range(SIZE):
            for col in range(SIZE):
                if b[row][col] == EMPTY:
                    for num in range(1, SIZE + 1):
                        if is_safe(b, row, col, num):
                            b[row][col] = num
                            c = solve_count(b, count)
                            if c >= 2:
                                b[row][col] = EMPTY
                                return 2
                            count += c
                            b[row][col] = EMPTY
                    return count
        return 1

    board_copy = deep_copy(board)
    return min(solve_count(board_copy, 0), 2)

def remove_cells(board, clues):
    # Remove cells while ensuring unique solution
    cells = [(r, c) for r in range(SIZE) for c in range(SIZE)]
    random.shuffle(cells)
    removed = 0
    max_remove = SIZE * SIZE - clues
    for row, col in cells:
        if removed >= max_remove:
            break
        backup = board[row][col]
        board[row][col] = EMPTY
        if count_solutions(board) != 1:
            board[row][col] = backup
        else:
            removed += 1

def generate_puzzle(difficulty="medium"):
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)
    clues = DIFFICULTY.get(difficulty, DIFFICULTY["medium"]) if isinstance(difficulty, str) else difficulty
    remove_cells(board, clues)
    puzzle = deep_copy(board)
    return puzzle, solution
