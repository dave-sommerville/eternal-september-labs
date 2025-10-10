using cheat;

internal class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("=== Welcome to Cheat (a.k.a. I Doubt It) - Console Edition ===");

        int sequenceIndex = 1; // Start with Ace (1)
        Deck deck = new Deck();
        deck.Shuffle();
        List<Card> discardPile = new List<Card>();

        // Create players
        Player[] players = new Player[]
        {
                new Player("You"),
                new AI("AI 1"),
                new AI("AI 2"),
                new AI("AI 3")
        };

        // Deal cards round-robin
        int dealIndex = 0;
        while (deck.CardsRemaining > 0)
        {
            players[dealIndex % players.Length].Hand.Add(deck.Deal());
            dealIndex++;
        }

        // Initial sort
        foreach (var p in players) p.SortHand();

        int turnIndex = 0;
        bool gameEnded = false;
        while (!gameEnded)
        {
            Player current = players[turnIndex];
            Console.WriteLine();
            Console.WriteLine($"--- Turn: {current.Name} ---");
            Console.WriteLine($"Current claim rank: {RankName(sequenceIndex)} ({sequenceIndex}). Discard pile has {discardPile.Count} cards.");

            // Player plays
            List<Card> played;
            if (current is AI ai)
            {
                played = ai.MakePlay(sequenceIndex);
            }
            else
            {
                played = current.SelectCards(sequenceIndex);
            }

            // Put played cards to discard pile (face-down)
            if (played.Count > 0)
            {
                discardPile.AddRange(played);
            }
            else
            {
                Console.WriteLine($"{current.Name} could not play any cards.");
            }

            // Check immediate win (if player emptied their hand and no one accuses they win)
            if (current.Hand.Count == 0)
            {
                Console.WriteLine($"{current.Name} has no cards left!");
                // Allow others one chance to accuse (some rules allow accusation even if they emptied)
                bool lateAccused = false;
                for (int j = 1; j < players.Length; j++)
                {
                    int idx = (turnIndex + j) % players.Length;
                    var p = players[idx];
                    if (p.ChooseToAccuse(current, discardPile, sequenceIndex, played.Count))
                    {
                        lateAccused = true;
                        break;
                    }
                }

                if (!lateAccused && discardPile.Count == 0)
                {
                    Console.WriteLine($"*** {current.Name} wins the game! ***");
                    break;
                }
                // If lateAccused resolved and cards given, continue — do not immediately finish
            }

            // Accusation phase (if there are cards)
            bool someoneAccused = false;
            int accuserIndex = -1;
            if (discardPile.Count > 0)
            {
                for (int j = 1; j < players.Length; j++)
                {
                    int idx = (turnIndex + j) % players.Length;
                    var p = players[idx];
                    bool accused = p.ChooseToAccuse(current, discardPile, sequenceIndex, played.Count);
                    if (accused)
                    {
                        someoneAccused = true;
                        accuserIndex = idx;
                        break;
                    }
                }
            }

            // After accusation, discardPile is cleared in Accuse().

            // Next turn decision
            if (someoneAccused)
            {
                // Give next turn to the accuser (arbitrary decision; you can adjust rule)
                Console.WriteLine($"Next turn goes to {players[accuserIndex].Name}.");
                turnIndex = accuserIndex;
            }
            else
            {
                // No accusation: advance sequence and move to next player
                sequenceIndex = sequenceIndex % 13 + 1; // 1..13 cycle
                turnIndex = (turnIndex + 1) % players.Length;
            }

            // End game check: any player with zero cards wins
            foreach (var p in players)
            {
                if (p.Hand.Count == 0)
                {
                    Console.WriteLine($"*** {p.Name} wins the game! ***");
                    gameEnded = true;
                    break;
                }
            }

            Console.WriteLine("Press Enter to continue...");
            Console.ReadLine();
        }

        Console.WriteLine("Game over. Thanks for playing!");
    }

    public static string RankName(int value)
    {
        return value switch
        {
            1 => "Ace",
            11 => "Jack",
            12 => "Queen",
            13 => "King",
            _ => value.ToString()
        };
    }
}