# Tasks

Phase 1 is done. Open work for [mvp-plan.md](./mvp-plan.md).

## Content

- [ ] Get to about 30 real posts, roughly half bait (16 so far)
- [ ] Remove the 4 placeholder posts, p001 to p004
- [ ] Playtest with friends
- [x] Short intro that explains the game before the first post, along the lines of "Most of the internet is ragebait. Can you spot it?" Shown on first visit, then reachable from a help button

## Phase 2: Postgres

### Database

- [ ] Postgres service in `docker-compose.yml` for local dev
- [ ] Drizzle setup, `DATABASE_URL`, migration scripts in `package.json`
- [ ] Schema: `posts` (with optional `date`) and `votes` (unique per post and player)
- [ ] Seed script that loads `posts.json` and copies images to the media folder
- [ ] Delete `posts.json` and `public/posts` once the seed works

### Media

- [ ] Store images in a folder from `MEDIA_DIR`, a Coolify persistent volume in production
- [ ] Route that serves images from it, with long cache headers

### Daily set

- [ ] Dated posts fill their day first, the cycle fills the rest
- [ ] Dated posts never join the cycle
- [ ] Tests for both, plus the existing 5/5 balance and same-date tests

### Game API

- [ ] `GET /api/daily?date=` returns the round without labels, accepting today plus or minus a day
- [ ] `POST /api/guess` stores the vote and returns label, reason and crowd split
- [ ] Anonymous `playerId` in localStorage
- [ ] Switch `use-daily-game` to the API, keeping resume and streaks
- [ ] Show the crowd split on the reveal
- [ ] Cache crowd % for a few minutes

### Admin

- [ ] `/admin` login with `ADMIN_PASSWORD` and a signed cookie
- [ ] Next 7 days with their posts
- [ ] Pin a post to a date, or unpin it
- [ ] Add a post from an X link, reusing the `add-post` code
- [ ] Edit a post's label and reason
- [ ] Flag posts where the crowd disagrees with the label

### Deploy

- [ ] Postgres database in Coolify with scheduled backups
- [ ] `DATABASE_URL`, `ADMIN_PASSWORD` and the media volume on the app
- [ ] Run migrations on deploy

## Later

- [ ] Analytics for finished rounds and copied results
- [ ] Video posts
- [ ] Reddit and Bluesky links in `add-post`
