## 3SCRIPTs3BOTs

![3SCRIPTs3BOTs Banner](https://dave-sommerville.github.io/ds-code-releases/img/Gemini_Generated_robots.png)

The premise is simple enough. Three different examples of game AI written in three different programming languages. This is a part of my journey in learning more about AI. While ultimately I'm looking to create a customized AI agent with an LLM, I first wanted to hone my basics skills first. Each game presented a unique and engaging challenge. I've included links to and break downs of each bot below. 

### Name: Connect Four

### Written In: Python

![Connect Four Preview](https://dave-sommerville.github.io/ds-code-releases/img/connect-four.png)

Link: [Connect Four Program](https://github.com/dave-sommerville/eternal-september-labs/tree/main/Programs/3SCRIPTs3BOTs/connect-four)
Description:

Connect Four is a two-player game played on a vertical board with a grid. Players take turns dropping colored discs from the top into a chosen column. The goal is to be the first player to get four of their own discs in a row, either horizontally, vertically, or diagonally.

Class: Perfect Information

* All game states are always visible to both players

Heuristics: Winning State Search

* Potential winning lines for each player
* Three-in-a-rows spot
* Two-in-a-rows spot

Driving Strategy: Minimax Algorithm, Alpha Beta Pruning

* Recursive algorithm used in two-player, zero-sum games (where one player's gain is the other's loss)
* Explores the game tree of possible game states (possible future moves) to a certain depth\*
* Evaluation function assigns a score to the board state to estimate its value

Personal Notes on Code:

Python is my newest language, but this project was easy to conceptualize and execute. I find the code elegant and efficient. I have already built an intuition for programs like this in other languages and found Python easily adaptable.

Optimization Notes:

Connection Four is a solved game. As in, if the first player ensures every move is optimized, they will always win. This prevents much further optimization, although you have control of the depth of the branch pruning.

---

### Name: Ship-Attack (Battleship)

### Written In: JavaScript

![Ship Attack Preview](https://dave-sommerville.github.io/ds-code-releases/img/ship-attack.png)

Link: [Ship Attack](https://dave-sommerville.github.io/ship-attack/)

Description:

Ship-Attack is a two-player guessing game played on a grid. Each player secretly places their own fleet of ships (of varying lengths) on their grid. Players take turns selecting a grid coordinate to "fire a shot" at the opponent's hidden grid. The opponent must indicate whether the shot was a "Hit" or a "Miss." The first player to locate and sink all of their opponent's ships wins.

Class: Imperfect Information

* Enemy game state is hidden, creating two state components
* Visible State: The information set available to based moves on
* True State: All actual possible game states, combining both player's information sets

Heuristics: Adjacent Search

Driving Strategy: Hunt and Target

* AI operates on two modes based on accumulated moves
* Hunt: Shoot randomly until landing a hit
* Target: Test the areas around the hit and proceed linearly

Script Notes:

As a loosely typed language, JavaScript isn't the best language for complex game strategies. Its strength, however, is the ease in creating a web interface for you to play the game in. Ship-Attack was the best choice for JavaScript because it has the simplest logic and benefits the most from visual interactions.

Optimization Notes:

* Checkboard hunting pattern
* Use of a Probability Density Function\*\*

---

### Name: Cheat (Card Game)

### Written In: C#

![Cheat Preview](https://dave-sommerville.github.io/ds-code-releases/img/cheat-console.png)

Link: [Cheat](https://github.com/dave-sommerville/cheat)

Description:

Cheat is a card game where players try to be the first to get rid of all their cards. Players take turns placing cards face-down and announcing what they are (e.g., "Three Queens"). Players have the option to lie about the cards they put down. Any other player can challenge the claim by calling "Cheat!" If the player was lying, they pick up the entire discard pile; if they were telling the truth, the challenger picks up the pile.

Class: Imperfect and Deceptive Information

* All four players have their own information set
* Unlike Ship-Attack, deception is part of the game play
* Players can only make strategic guesses and bluffs

Driving Strategy:

* Tell the truth frequently, as you'll often be forced to lie
* Prioritize cards out of sequence
* Use moderate and random risks as much as possible

Heuristics: Card/Sequence tracking, Play evaluation


Script Notes:

C# is a very object oriented language with strong typing, making it very simple to set up card game interactions. Using the console is an effective way of conveying the game without a UI and the explicitness of C# methods make its execution clean and clear.

Optimization Notes:

With its elements of deception and forced plays, true optimization is impossible. If taken to a much larger scale, you could create a machine learning system that attempts to track patterns in player behavior, but that is well out of the current scope of the project. You could, however, "cheat" to give the AI an advantage by letting the computer share hand information. But what fun would that be.







\*

Because the game tree is too large to search entirely in real-time. Connect Four has about 4.5 trillion possible board states.

\*\*

AI calculates, for every single empty cell on the enemy's board, the number of ways all remaining, unsunk ships can legally fit onto the board through that cell, consistent with all known hits and misses.	\[Grid Cell (i, j)] -> \[Probability that a ship occupies this cell]

