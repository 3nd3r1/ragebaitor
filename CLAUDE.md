# CLAUDE.md

@AGENTS.md

@README.md

Run a single test with `npm test -- tests/lib/daily.test.ts`. Add shadcn components with `npx shadcn@latest add [component]`.

## Shadcn

Prefer shadcn components over custom ones when one fits. They live in `src/components/ui/` and use the `base-sera` style on Base UI, not Radix. Compose with the `render` prop instead of `asChild`. Style links that look like buttons with `cn(buttonVariants())`. Without `cn()` the base and variant classes conflict and the outline border ends up transparent.

`npx shadcn apply --only font` rewrites `layout.tsx` messily and drops `--background` and `--foreground` from `:root`, so check the diff after it.

## Theming rules

- Color only through theme tokens, like `bg-card` or `text-muted-foreground`. No hex, `oklch()` or palette classes like `bg-red-500` outside `src/components/ui/`. `tests/components/theme-tokens.test.ts` checks this.
- Game colors are `bait`, `correct` and `wrong` in the `.dark` block of `globals.css`. Alias theme variables where one fits, like `--bait: var(--primary)`, so they follow preset changes. A new color gets a token there and a `--color-*` line in `@theme inline`.
- Red means bait. Keep the rest of the UI in foreground, background and borders.
- Customize shadcn components with variants in `src/components/ui/`, like Button's `bait` variant and `xl` size, instead of long `className` overrides.
- Headings are `font-heading` at regular weight. Instrument Serif only has 400 and faux bold is off. Small labels use the `text-label` utility. Avoid `font-bold`, `font-extrabold` and `tracking-tight`.
- Keep Sera's square corners. No `rounded-*` on cards, buttons or images.

## Code rules

- Use the `@/` alias for imports from `src/`
- Client components need `"use client"`
- Zod schemas go in `src/validators/`, with types from `z.infer<>`
- Site details live in `src/lib/config.ts` and flow to the layout, manifest, sitemap, robots and OG images
- Game components are in `src/components/game/`, posts in `src/data/posts.json`, scripts in `scripts/`
- Tests in `tests/` mirror `src/`. API tests import route handlers directly
- Keep comments to a minimum. Only add one for a non-obvious why, like a workaround or a magic number

## Behavior

- Be concise
- Search or read docs when uncertain
- Follow the existing structure
