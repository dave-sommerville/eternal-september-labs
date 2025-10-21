using cheat;

public class AI : Player
{
    private Random rnd = new Random();

    public AI(string name) : base(name) { }

    // AI selects cards to play. Basic heuristics:
    // - if has cards of the required rank, usually play truthfully (but not always)
    // - otherwise bluff by playing random cards
    public List<Card> MakePlay(int seqIndex)
    {
        List<Card> sequenceCards = MatchesSequence(seqIndex);
        List<Card> play = new List<Card>();

        if (Hand.Count == 0) return play;

        // Decide whether to be honest
        double honestChance = sequenceCards.Count > 0 ? 0.75 : 0.20;
        bool goHonest = rnd.NextDouble() < honestChance && sequenceCards.Count > 0;

        int playCount;
        if (goHonest)
        {
            playCount = rnd.Next(1, Math.Min(sequenceCards.Count, 4) + 1);
            // take that many matching sequence cards
            for (int i = 0; i < playCount; i++)
            {
                Card c = sequenceCards[i];
                Hand.Remove(c);
                play.Add(c);
            }
        }
        else
        {
            // bluff: play random cards (prefer cards that don't match seq)
            playCount = rnd.Next(1, Math.Min(4, Hand.Count) + 1);
            // try to avoid picking sequence cards when bluffing
            var nonSeq = Hand.Where(c => c.Value != seqIndex).ToList();
            for (int i = 0; i < playCount && Hand.Count > 0; i++)
            {
                if (nonSeq.Count > 0)
                {
                    Card chosen = nonSeq[rnd.Next(nonSeq.Count)];
                    Hand.Remove(chosen);
                    play.Add(chosen);
                    nonSeq.Remove(chosen);
                }
                else
                {
                    // forced to pick from all remaining
                    Card chosen = Hand[rnd.Next(Hand.Count)];
                    Hand.Remove(chosen);
                    play.Add(chosen);
                }
            }
        }

        TellingTruth = play.Count > 0 && play.All(c => c.Value == seqIndex);

        Console.WriteLine($"{Name} plays {play.Count} card(s), claiming they are {Program.RankName(seqIndex)}.");
        return play;
    }

    // AI decides whether to accuse based on simple heuristics:
    // - If the claimedCount is impossible given what AI knows (it has many of that rank), accuse.
    // - Small random chance that increases with the size of discard pile.
    public override bool ChooseToAccuse(Player targetPlayer, List<Card> discardPile, int claimedValue, int claimedCount)
    {
        int knownInHand = Hand.Count(c => c.Value == claimedValue);

        // If claim seems unlikely given AI's hand (e.g., they claim many copies while AI already holds several), accuse.
        if (claimedCount > (4 - knownInHand))
        {
            Console.WriteLine($"{Name} decides to accuse based on suspicious claim.");
            Accuse(targetPlayer, discardPile);
            return true;
        }

        // otherwise random chance scaled by discard pile size
        double baseProb = 0.02 + Math.Min(0.25, discardPile.Count * 0.02);
        if (rnd.NextDouble() < baseProb)
        {
            Console.WriteLine($"{Name} calls cheat randomly (prob triggered).");
            Accuse(targetPlayer, discardPile);
            return true;
        }

        // otherwise do not accuse
        return false;
    }
}