using cheat;

public class Player
{
    public string Name { get; set; }
    public List<Card> Hand { get; private set; }
    public bool TellingTruth { get; set; }
    public bool IsAccused { get; set; }
    public Player(string name)
    {
        Hand = new List<Card>();
        TellingTruth = true;
        IsAccused = false;
        Name = name;
    }

    public void PrintHand()
    {
        Console.WriteLine($"--- {Name}'s hand ({Hand.Count} cards) ---");
        for (int i = 0; i < Hand.Count; i++)
        {
            Console.WriteLine($"{i + 1}: {Hand[i].Name} of {Hand[i].Suit}");
        }
    }

    // Returns an int in range [0..options] inclusive (0 allowed)
    public static int PrintMenu(int options)
    {
        int intDecision;
        bool isValid;
        do
        {
            string decision = Console.ReadLine();
            isValid = int.TryParse(decision, out intDecision) && intDecision >= 0 && intDecision <= options;
            if (!isValid)
            {
                Console.WriteLine("Invalid input. Please try again.");
            }
        } while (!isValid);
        return intDecision;
    }

    public void SortHand()
    {
        Hand = Hand.OrderBy(c => c.Value).ThenBy(c => c.Suit).ToList();
    }

    public List<Card> MatchesSequence(int seqIndex)
    {
        List<Card> sequenceCards = new List<Card>();
        foreach (var card in Hand)
        {
            if (card.Value == seqIndex)
            {
                sequenceCards.Add(card);
            }
        }
        return sequenceCards;
    }

    // Human selection: choose 1-4 cards from hand to play (removes them from Hand)
    // Returns the list of cards actually played.
    public virtual List<Card> SelectCards(int seqIndex)
    {
        if (Hand.Count == 0) return new List<Card>();

        Console.WriteLine($"{Name}, it's your turn. Current required rank: {Program.RankName(seqIndex)} ({seqIndex})");
        PrintHand();

        int maxPlayable = Math.Min(4, Hand.Count);
        int numToPlay = 0;
        while (numToPlay < 1 || numToPlay > maxPlayable)
        {
            Console.WriteLine($"How many cards do you want to play? (1 - {maxPlayable})");
            numToPlay = PrintMenu(maxPlayable); // allows 0..maxPlayable; we check afterwards
        }

        List<Card> played = new List<Card>();
        for (int s = 0; s < numToPlay; s++)
        {
            Console.WriteLine($"Select card #{s + 1} by index (1 - {Hand.Count}):");
            int pick = 0;
            while (pick < 1 || pick > Hand.Count)
            {
                pick = PrintMenu(Hand.Count);
            }
            Card chosen = Hand[pick - 1];
            played.Add(chosen);
            Hand.RemoveAt(pick - 1);
            Console.WriteLine($"Selected {chosen.Name} of {chosen.Suit}");
        }

        // Determine truth: all played cards match seqIndex
        TellingTruth = played.Count > 0 && played.All(c => c.Value == seqIndex);

        return played;
    }

    // Called during an accusation phase. Returns true if this player accused the target.
    // Base (human) implementation: prompts user.
    public virtual bool ChooseToAccuse(Player targetPlayer, List<Card> discardPile, int claimedValue, int claimedCount)
    {
        Console.WriteLine($"{Name}, do you want to accuse {targetPlayer.Name} of cheating on their claim of {claimedCount} x {Program.RankName(claimedValue)}? (1 = Yes, 0 = No)");
        int decision = PrintMenu(1);
        if (decision == 1)
        {
            Accuse(targetPlayer, discardPile);
            return true;
        }
        return false;
    }

    // Resolve an accusation: 'this' is the accuser.
    public void Accuse(Player targetPlayer, List<Card> discardPile)
    {
        Console.WriteLine($"{Name} accuses {targetPlayer.Name}!");
        if (targetPlayer.TellingTruth)
        {
            Console.WriteLine($"False accusation — {targetPlayer.Name} was telling the truth.");
            // accuser takes the discard pile
            Console.WriteLine($"{Name} picks up {discardPile.Count} card(s).");
            this.Hand.AddRange(discardPile);
        }
        else
        {
            Console.WriteLine($"Correct — {targetPlayer.Name} was bluffing!");
            // liar (target) takes the discard pile
            Console.WriteLine($"{targetPlayer.Name} picks up {discardPile.Count} card(s).");
            targetPlayer.Hand.AddRange(discardPile);
        }
        discardPile.Clear();
    }
}