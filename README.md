# Ragebaitor

A daily guessing game: you see a real post and guess whether it's ragebait or genuine. Then you see the answer and how everyone else guessed.

- [Concept](docs/concept.md)
- [MVP plan](docs/mvp-plan.md)
- [Tasks](docs/tasks.md)
- [Capturing posts](docs/capture.md)

## Stack

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Zod, Vitest.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint and Prettier check
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run coverage     # Run tests with coverage
npm run type-check   # TypeScript type checking
npm run theme -- <code>  # Apply colors from a shadcn preset
```

## Theme

The theme is shadcn's Sera style with neutral grays and a purple primary color,
with Noto Sans text and Playfair Display headings. Its preset code is
`b4pl265ewS`. The app is always in dark
mode, and the colors are CSS variables in `src/app/globals.css`.

To change the colors, build a preset on
[ui.shadcn.com/create?preset=b4pl265ewS](https://ui.shadcn.com/create?preset=b4pl265ewS),
copy its code and run `npm run theme -- <code>`. The PWA manifest, OG images and
browser theme color take their colors from `globals.css`.
