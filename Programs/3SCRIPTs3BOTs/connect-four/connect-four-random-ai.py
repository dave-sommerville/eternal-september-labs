import random

num_rows = 6
num_cols = 7
space_char = ' '
player_char = 'X'
ai_char = 'O'
game_board = [[space_char for _ in range(num_cols)] for _ in range(num_rows)]
game_over = False  # start game

def drop_disc(col, char):
    for row in range(len(game_board) - 1, -1, -1):
        if game_board[row][col-1] == ' ':
            game_board[row][col-1] = char
            return True
    return False  # column is full

def board_full():
    # whole board check: if top row has any space left, not full
    return all(game_board[0][col] != ' ' for col in range(num_cols))

def print_board():
    print("\n--- Board ---")
    for row in game_board:
        print(f"|{' '.join(row)}|")
    print(" 1 2 3 4 5 6 7 ")

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

def drop_random_disc(char):
    open_cols = [c for c in range(1, num_cols + 1) if game_board[0][c-1] == ' ']
    if not open_cols:
        return False
    col = random.choice(open_cols)
    return drop_disc(col, char)

def ai_turn():
    drop_random_disc(ai_char)

def your_turn():
    while True:
        try:
            col = int(input("Please choose a column (1-7): "))
            if 1 <= col <= num_cols and drop_disc(col, player_char):
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

# --- Game Loop ---
print_board()
while not game_over:
    take_turns()
