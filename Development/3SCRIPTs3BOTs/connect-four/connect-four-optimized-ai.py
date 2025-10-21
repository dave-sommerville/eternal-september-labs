# Libraries
import random
import math

# Global Variables
num_rows = 6
num_cols = 7
space_char = ' '
player_char = 'X'
ai_char = 'O'
game_board = [[space_char for _ in range(num_cols)] for _ in range(num_rows)]
game_over = False

# Action Functions
def drop_disc(col, char):
    for row in range(len(game_board) - 1, -1, -1):
        if game_board[row][col-1] == ' ':
            game_board[row][col-1] = char
            return row  # return row index
    return None  # column is full
def undo_disc(col, row):
    game_board[row][col-1] = space_char
def print_board():
    print("\n--- Board ---")
    for row in game_board:
        print(f"|{' '.join(row)}|")
    print(" 1 2 3 4 5 6 7 ")

# Validation Functions
def board_full():
    return all(game_board[0][col] != ' ' for col in range(num_cols))
def check_win(player_symbol):
    rows = num_rows
    cols = num_cols
    # Horizontal
    for row in range(rows):
        for col in range(cols - 3):
            if all(game_board[row][col + i] == player_symbol for i in range(4)):
                return True
    # Vertical
    for row in range(rows - 3):
        for col in range(cols):
            if all(game_board[row + i][col] == player_symbol for i in range(4)):
                return True
    # Diagonal down-right
    for row in range(rows - 3):
        for col in range(cols - 3):
            if all(game_board[row + i][col + i] == player_symbol for i in range(4)):
                return True
    # Diagonal down-left
    for row in range(rows - 3):
        for col in range(3, cols):
            if all(game_board[row + i][col - i] == player_symbol for i in range(4)):
                return True
    return False
def is_terminal():
    return check_win(player_char) or check_win(ai_char) or board_full()

# Evaluation Functions
def get_valid_cols():
    return [c for c in range(1, num_cols + 1) if game_board[0][c-1] == ' ']
def evaluate_window(window, piece):
    score = 0
    opp_piece = player_char if piece == ai_char else ai_char
    if window.count(piece) == 4:
        score += 1000
    elif window.count(piece) == 3 and window.count(space_char) == 1:
        score += 10
    elif window.count(piece) == 2 and window.count(space_char) == 2:
        score += 5
    if window.count(opp_piece) == 3 and window.count(space_char) == 1:
        score -= 80
    return score
def score_position(piece):
    score = 0
    # Statistically best to favour the center of the grid
    center_col = [game_board[r][num_cols//2] for r in range(num_rows)]
    score += center_col.count(piece) * 3
    # Horizontal
    for r in range(num_rows):
        row_array = game_board[r]
        for c in range(num_cols - 3):
            window = row_array[c:c+4]
            score += evaluate_window(window, piece)
    # Vertical
    for c in range(num_cols):
        col_array = [game_board[r][c] for r in range(num_rows)]
        for r in range(num_rows - 3):
            window = col_array[r:r+4]
            score += evaluate_window(window, piece)
    # Diagonal down-right
    for r in range(num_rows - 3):
        for c in range(num_cols - 3):
            window = [game_board[r+i][c+i] for i in range(4)]
            score += evaluate_window(window, piece)
    # Diagonal down-left
    for r in range(num_rows - 3):
        for c in range(3, num_cols):
            window = [game_board[r+i][c-i] for i in range(4)]
            score += evaluate_window(window, piece)
    return score

# Minimax with Alpha-Beta pruning, optimized for evaluating next moves
def minimax(depth, alpha, beta, maximizingPlayer):
    valid_cols = get_valid_cols()
    if depth == 0 or is_terminal():
        if check_win(ai_char):
            return (None, 1000000)
        elif check_win(player_char):
            return (None, -1000000)
        else:
            return (None, score_position(ai_char))
    if maximizingPlayer:
        value = -math.inf #Smallest possible number
        best_col = random.choice(valid_cols)
        for col in valid_cols:
            row = drop_disc(col, ai_char)
            if row is None: 
                continue # Recurrence to checkout another depth of evaluation
            new_score = minimax(depth-1, alpha, beta, False)[1]
            undo_disc(col, row)
            if new_score > value:
                value = new_score
                best_col = col
            alpha = max(alpha, value)
            if alpha >= beta:
                break
        return best_col, value
    else:
        value = math.inf #Largest possible number
        best_col = random.choice(valid_cols)
        for col in valid_cols:
            row = drop_disc(col, player_char)
            if row is None: 
                continue
            new_score = minimax(depth-1, alpha, beta, True)[1]
            undo_disc(col, row)
            if new_score < value:
                value = new_score
                best_col = col
            beta = min(beta, value)
            if alpha >= beta:
                break
        return best_col, value
    
# Game play
def ai_turn():
    col, score = minimax(4, -math.inf, math.inf, True)  # depth: 4 for speed,  
    if col is not None:                                 # can more thoroughly check with larger depth
        drop_disc(col, ai_char)
def your_turn():
    while True:
        try:
            col = int(input("Please choose a column (1-7): "))
            if 1 <= col <= num_cols and drop_disc(col, player_char) is not None:
                break
            else:
                print("Invalid move, try again.")
        except ValueError:
            print("Please enter a number.")
def take_turns():
    global game_over
    your_turn()
    print_board()
    if check_win(player_char):
        print("You win!")
        game_over = True
        return    
    ai_turn()
    print_board()
    if check_win(ai_char):
        print("AI wins!")
        game_over = True
        return
    if board_full():
        print("It's a tie!")
        game_over = True
# Game loop
print_board()
while not game_over:
    take_turns()
