# Ragebaitor

Oct 28, 2026 · @Viljami

## Pitch

Ragebaitor shows you a real post and you guess: ragebait or genuine? Then it tells you what it was, and how everyone else guessed. Everyone thinks they can spot bait. The game is finding out you can't.

The new part is guessing _intent_. Games like Onion or Not ask whether something is real or fake, which is a fact. Ragebaitor asks whether someone meant to make you angry, which is fuzzier, and that's what makes it fun to argue about.

## Core loop

A round is 10 posts, the same 10 for everyone each day, Wordle-style.

1. Show a post as a neutral card: text, maybe an image, fake handle, no real names.
2. Player taps **Bait** or **Genuine**.
3. Reveal: the verdict, a one-line reason ("account later admitted it", "posts the same take every week"), and the crowd split ("68% said bait").
4. Next post.
5. After 10: score, streak, and a share card like `ragebaitor 7/10 🎣🎣⬜🎣...` that people paste into group chats.

The share card does the marketing. "I'm unbaitable" and "I got baited 6 times" are both things people post.

## The answer key

v1 uses a hybrid: hand-labelled posts where the intent is actually known, and the crowd split shown on every post. Nobody can know for sure what someone meant, so the game should never pretend otherwise.

| Source of truth   | How it works                                                                                                                | Good                        | Bad                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------- |
| Known intent      | Account admitted it, known engagement farm, parody account people fell for, or clearly sincere (personal post, no audience) | Answers you can defend      | Slow to collect, small set               |
| Engagement signal | Lots of quotes and replies compared to likes ("the ratio")                                                                  | Measurable, scales          | Noisy: sincere bad takes get ratioed too |
| Crowd             | Show "73% said bait" after each guess                                                                                       | Never wrong, fun to compare | Not a real answer on its own             |

In v1, every post has a curator label (bait / genuine) plus a short reason, and the crowd split shows under it. If the crowd strongly disagrees with the label, that post gets flagged for review. Those disagreements are interesting content in their own right later ("posts nobody agrees on").

## Content

Posts are curated by hand and re-rendered as our own cards, not embedded. That skips the X API cost, stops players from looking the post up, and keeps real names out.

- **Format:** text plus an optional image, a generated handle and avatar, and a platform-neutral card. Platform style (X, Threads, Reddit, LinkedIn) can be a later skin.
- **Sources:** viral posts that got called out as bait, known bait accounts, r/NotTheOnion-style sincere-but-insane posts as "genuine" decoys, and ordinary hot takes that were sincere.
- **Balance:** roughly 50/50 bait vs genuine per day, so guessing "bait" every time doesn't win.
- **Starting volume:** 100 posts covers 10 days of play. Enough to test whether it's fun.
- **Rules:** no private individuals, nothing targeting someone small, no slurs or harassment as content. Bait about pineapple pizza is better than bait about a real person anyway.

## MVP scope

The MVP is a mobile-first web app with one daily round and no accounts. The goal is to test whether people finish a round and share it.

**In**

- [ ] Daily set of 10 posts, picked deterministically by date
- [ ] Post card, Bait / Genuine buttons, reveal with verdict, reason and crowd %
- [ ] Votes stored anonymously (random id in localStorage)
- [ ] End screen with score, streak and copyable share text
- [ ] Simple admin: a JSON or CSV file of posts, or a basic form behind a password
- [ ] Seed set of ~30 posts to play with

**Out (for now)**

- Accounts, leaderboards, friends
- Endless mode and categories (politics, tech, food)
- User-submitted posts
- Platform skins
- Native apps

## Tech stack and data model

Suggested starting point: Next.js on Vercel and Supabase (Postgres) for posts and votes.

| Table        | Columns                                                                                          | Notes                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `posts`      | id, body, image_url, display_handle, label (`bait` / `genuine`), reason, source_note, created_at | source_note is private, for us only                                   |
| `daily_sets` | date, post_ids[]                                                                                 | 10 ids, ordered; could also be derived from a seed                    |
| `votes`      | id, post_id, player_id, guess, created_at                                                        | player_id = anonymous localStorage uuid; one vote per player per post |

The crowd % is a count over `votes` grouped by post. Cache it, since it doesn't need to be live to the second.

## Prior art

| Thing                                                                                                     | What it is                                                         | Takeaway                                      |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------- |
| [Onion or Not](https://github.com/nmoroze/onion-or-not/blob/master/README.md)                             | Guess if a headline is from the Onion or real (from r/nottheonion) | Same mechanic, but the answer is a fact       |
| [Elon Musk Battle Royale](https://isaquepicaosanches.itch.io/elon-musk-battle-royable)                    | Party game: real or fake Musk tweet (Nordic Game Jam 2022)         | A live party mode could work                  |
| [Two Tweets & A Lie](https://avclub.com/get-involved-internet-help-turn-weird-celebrity-tweet-1839103898) | Card game: spot the fake celebrity tweet                           | Shows people pay for this format              |
| [Trick or Tweet (NPR)](https://www.npr.org/transcripts/452707617)                                         | Radio quiz: real vs made-up celebrity tweet                        | Same                                          |
| [RageCheck](https://korben.info/en/detect-rage-bait-articles-ragecheck.html)                              | Paste a URL and get a 0 to 100 manipulation score                  | Its categories could become the "reason" text |
| [FeedFirewall](https://chromewebstore.google.com/detail/dchnceoncmglnoekmlbpodoepgcgminc)                 | Extension that flags likely ragebait on X, Reddit and LinkedIn     | Tool, not a game; tiny user base              |
| [Ragebait on Japanese X (arXiv)](https://arxiv.org/pdf/2609.02262)                                        | 18,558 labelled posts plus a detector                              | LLM pre-labels, a human checks                |

## Open questions

- [ ] Two buttons, or add a third "can't tell" option?
- [ ] Show real engagement numbers (likes, quotes) as a clue, or hide them?
- [ ] Re-type real posts, or write lookalikes inspired by real ones?
- [ ] Finnish content as a separate daily set?
- [ ] Name check: is ragebaitor.com (or a .app) free?
