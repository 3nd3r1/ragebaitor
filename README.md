# Ragebaitor

A daily guessing game. You see 10 real posts and guess whether each one is ragebait or genuine, then see the answer and why.

- [Concept](docs/concept.md): the idea and content rules
- [Plan](docs/mvp-plan.md): how the game works and what Phase 2 adds
- [Tasks](docs/tasks.md)
- [Adding posts](docs/capture.md)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # ESLint and Prettier check
npm run format       # Format with Prettier
npm run test         # Run tests
npm run type-check   # TypeScript check
npm run add-post -- <x-link> --label bait --reason "..."  # Add a post
npm run theme -- <code>  # Apply colors from a shadcn preset
npm run db:up        # Start Postgres in Docker
npm run db:generate  # Make a migration after changing src/db/schema.ts
npm run db:migrate   # Apply migrations
npm run db:seed      # Load posts.json and copy images to MEDIA_DIR
npm run db:studio    # Browse the database
```

## Database

Copy `.env.example` to `.env`, then run `npm run db:up`, `npm run db:migrate` and `npm run db:seed`. Seeding again updates posts in place and keeps the dates they're pinned to.
