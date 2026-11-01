# MVP plan

How we build the MVP in [concept.md](./concept.md) on top of this template. Phase 1 is a playable game with no backend. Phase 2 adds Supabase.

## Phase 1: playable, no backend

Goal: play a full round on a phone, end with share text you can paste.

### Data

Posts are screenshots of real posts, not re-typed text. A screenshot works for any platform and looks like the real thing.

`src/data/posts.json`, validated at import with a Zod schema in `src/validators/post.ts`:

```ts
{
  id: string,            // "p001"
  label: "bait" | "genuine",
  media: { type: "image", url: string, width: number, height: number },  // set by add-post; video later
  alt: string,           // what the post says, for screen readers
  reason: string,        // one line shown on reveal
  sourceUrl?: string,    // "View original" after reveal, when we have it
  proof?: { type: "image", url: string }[],  // "Show proof" after reveal
}
```

Everything ships in the client bundle until Phase 2 moves posts to the server.

### Content workflow

Every screenshot is captured and imported the same way, so posts look consistent.

1. **Capture** (guide in `docs/capture.md`): DevTools device mode at 390px wide, edit out real names and like counts in DevTools, then Inspect the post → Capture node screenshot.
2. **Import** with `npm run add-post`: resizes to 1080px wide WebP with `sharp`, strips metadata, records the image size, assigns the next id and appends the entry to `posts.json`.
3. **Display:** the card is sized to the screenshot, up to a max height. The guess buttons are pinned to the bottom of the screen, so they don't move between posts.

### Daily set

`src/lib/daily.ts`:

- The day changes at the player's local midnight, like Wordle.
- Day number = days since a fixed launch date. Used in share text: `Ragebaitor #3`.
- Each day takes the next 5 bait and next 5 genuine posts in id order, so nothing repeats until the pool runs out, then it cycles. New posts get higher ids, so adding them doesn't change upcoming days.
- The 10 are shuffled with a seed from the date, so everyone gets the same order.
- With fewer posts than a round, every post is used each day.

### Game state

`src/hooks/use-daily-game.ts`, stored in localStorage:

- `games[date]`: the round's post ids, guesses and position. A reload resumes mid-round (even mid-reveal), a finished day shows the end screen, and changing `posts.json` mid-day doesn't move guesses onto different posts.
- `stats`: current streak, max streak, last completed date

Streak = consecutive days with a finished round. Missing a day resets it.

The anonymous `playerId` for votes is added in Phase 2, when there's something to use it for.

### UI (one page, mobile-first)

| Component        | Does                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| `PostCard`       | Screenshot sized to fit, up to a max height                              |
| `GuessButtons`   | Bait / Genuine, large tap targets at the bottom of the screen            |
| `Reveal`         | Right/wrong, verdict, reason, View original, Show proof, Next            |
| `ProgressDots`   | 10 dots showing done / current / correct / wrong                         |
| `EndScreen`      | Score, result grid, streak, Copy result button                           |

Components go in `src/components/game/`. Uses existing shadcn `Card`, `Button`, `sonner` (for "Copied!"); may add `progress`.

Template cleanup: replace the home page, drop the navbar and about page, update `src/lib/config.ts`, OG image and manifest with the game name.

### Share text

Kept plain: score, grid, link. No streak line or extra emoji.

```
Ragebaitor #3 7/10
🎣🎣⬜🎣⬜⬜🎣⬜⬜⬜
ragebaitor.com
```

🎣 = got baited (wrong guess), ⬜ = called it right.

### Tests

- `daily.ts`: same date gives same set, 5/5 balance, different dates differ
- share text formatting
- game hook: guess, advance, finish, resume, streak rollover

## Phase 2: Supabase

- Tables from concept.md: `posts`, `daily_sets`, `votes`
- `POST /api/votes` (one vote per player per post, enforced by a unique index)
- `GET /api/daily` returns today's posts without labels; `POST` a guess returns the label, reason and crowd split. This stops people reading answers from the bundle.
- Crowd % cached (revalidate every few minutes)
- Flag posts where the crowd disagrees with the label by a wide margin
- Admin: probably keep posts in a JSON/CSV file and seed the DB from a script, before building any form

## Decisions

| Question              | Decision                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Name                  | Ragebaitor                                                                                |
| Share emoji           | 🎣 = got baited (wrong guess), ⬜ = correct. Fewer hooks is better |
| Seed posts            | You provide real posts in `posts.json`; code ships with the schema and 2–3 placeholders |
| Buttons               | Bait / Genuine only. "Can't tell" maybe later                                             |
| Engagement numbers    | Hidden in Phase 1 (default, revisit after playtesting)                                    |
| Finnish set           | Out of scope for Phase 1                                                                  |
| Post format           | Screenshots of real posts, captured and imported with a fixed workflow                    |
| Proof                 | Optional; `reason` is always required                                                     |
| Video                 | Later                                                                                     |
| Crowd %               | Not in Phase 1. Comes with real votes in Phase 2                                          |

## Still open

- Domain check for ragebaitor.com / .app
