# Concept

Ragebaitor shows a real post and you guess whether it's ragebait or genuine. Then it shows what it was and why.

Games like Onion or Not ask whether something is real, which is a fact. Ragebaitor asks whether someone meant to make you angry. That's fuzzier, which is what makes it fun to argue about.

## Core loop

A round is 10 posts, the same for everyone each day, like Wordle.

1. Show a post as our own card with a made-up handle and no real names.
2. The player taps Bait or Genuine.
3. Reveal the verdict and a one-line reason, like "account later admitted it". Phase 2 adds the crowd split, like "68% said bait".
4. After 10 posts, show the score, streak and share text for group chats.

## The answer key

Every post has a curator label and a short reason. Nobody can know for sure what someone meant, so the game never pretends otherwise.

| Source            | How it works                                                                           | Good                   | Bad                               |
| ----------------- | -------------------------------------------------------------------------------------- | ---------------------- | --------------------------------- |
| Known intent      | Account admitted it, known engagement farm, parody people fell for, or clearly sincere | Answers you can defend | Slow to collect                   |
| Engagement signal | Lots of quotes and replies compared to likes                                           | Scales                 | Sincere bad takes get ratioed too |
| Crowd             | Show "73% said bait" after each guess                                                  | Fun to compare         | Not a real answer on its own      |

Labels come from known intent. When the crowd strongly disagrees with a label, the post gets flagged for review.

## Content

Posts are re-rendered as our own cards, not embedded. That skips the X API, stops players looking the post up and keeps real names out.

- Sources: posts called out as bait, known bait accounts, sincere-but-insane posts as decoys, and ordinary sincere hot takes.
- Balance: 5 bait and 5 genuine per day, so always guessing bait doesn't win.
- Rules: no private individuals, nothing targeting someone small, no slurs or harassment. Bait about pineapple pizza beats bait about a real person.

## Out of scope for now

Accounts, leaderboards, endless mode, categories, user-submitted posts, platform skins and native apps.

## Prior art

| Thing                                                                                                     | What it is                                                     | Takeaway                                |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| [Onion or Not](https://github.com/nmoroze/onion-or-not/blob/master/README.md)                             | Guess if a headline is from the Onion or real                  | Same mechanic, but the answer is a fact |
| [Elon Musk Battle Royale](https://isaquepicaosanches.itch.io/elon-musk-battle-royable)                    | Party game: real or fake Musk tweet                            | A live party mode could work            |
| [Two Tweets & A Lie](https://avclub.com/get-involved-internet-help-turn-weird-celebrity-tweet-1839103898) | Card game: spot the fake celebrity tweet                       | People pay for this format              |
| [Trick or Tweet (NPR)](https://www.npr.org/transcripts/452707617)                                         | Radio quiz: real vs made-up celebrity tweet                    | Same                                    |
| [RageCheck](https://korben.info/en/detect-rage-bait-articles-ragecheck.html)                              | Paste a URL and get a 0 to 100 manipulation score              | Its categories could become reason text |
| [FeedFirewall](https://chromewebstore.google.com/detail/dchnceoncmglnoekmlbpodoepgcgminc)                 | Extension that flags likely ragebait on X, Reddit and LinkedIn | A tool, not a game                      |
| [Ragebait on Japanese X (arXiv)](https://arxiv.org/pdf/2609.02262)                                        | 18,558 labelled posts plus a detector                          | LLM pre-labels, a human checks          |
