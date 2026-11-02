# Tasks

Working checklist for [mvp-plan.md](./mvp-plan.md). Tick items off as they land.

## Phase 1: playable, no backend

### Setup

- [x] Template cleanup
    - [x] Remove navbar and about page (layout, sitemap)
    - [x] Site config for Ragebaitor (feeds metadata, manifest, OG/Twitter images)
    - [x] Fix manifest icon paths to match `public/`
    - [x] README

### Data

- [x] `src/validators/post.ts`: Zod post schema
- [x] Rework schema for screenshot posts: `media`, `alt`, `reason`, optional `sourceUrl`, optional `proof`
- [x] `src/data/posts.json` + `public/posts/`: placeholder screenshot posts
- [x] `src/lib/posts.ts`: load and validate posts at import

### Content workflow

- [x] `docs/capture.md`: capture guide
    - DevTools device mode at a fixed width (390px)
    - Edit out real names and like counts in DevTools before capturing
    - Inspect the post → Capture node screenshot
- [x] `npm run add-post` import script
    - Resize to 1080px wide WebP with `sharp`
    - Strip metadata
    - Assign the next id (`p042.webp`) and append the entry to `posts.json`

### Game logic

- [x] `src/lib/daily.ts`: day number, pick 5 bait + 5 genuine without repeats, shuffle
- [x] Share text formatting (plain: score, grid, link)
- [x] `src/hooks/use-daily-game.ts`: localStorage state (games by date, stats), resume, streak

### UI

- [x] `PostCard`: screenshot sized to fit, up to a max height
- [x] `GuessButtons`, pinned to the bottom of the screen
- [x] `Reveal` (verdict, reason, View original, Show proof, Next)
- [x] `ProgressDots`
- [x] `EndScreen` (score, grid, streak, copy result)
- [x] Home page wires it together

### Tests

- [x] `daily.ts`: same date same set, 5/5 balance, no repeats
- [x] Share text
- [x] Game hook: guess, advance, finish, resume, streak rollover

### Content

- [ ] Seed set of ~30 real posts in `posts.json`

## Phase 2: Supabase

- [ ] Tables: `posts`, `daily_sets`, `votes`
- [ ] Seed script from `posts.json`
- [ ] `GET /api/daily` (posts without labels)
- [ ] `POST` guess returns label, reason, crowd split
- [ ] Anonymous `playerId` in localStorage
- [ ] `POST /api/votes` with one vote per player per post
- [ ] Cache crowd %
- [ ] Flag posts where crowd disagrees with label

## Later

- [ ] Video posts (screen recordings, normalized with ffmpeg)

## Open

- [ ] Domain check for ragebaitor.com / .app
