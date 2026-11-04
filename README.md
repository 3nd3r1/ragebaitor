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
```
