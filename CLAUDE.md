# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## About

This is a Next.js template that can be modified for any project. Update `src/lib/config.ts` with your site details to get started.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # ESLint + Prettier check
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run test         # Run all tests
npm test -- tests/api/ping.test.ts  # Run single test file
npm run type-check   # TypeScript checking
npm run theme -- <code>  # Apply shadcn preset colors to globals.css
```

Add shadcn components: `npx shadcn@latest add [component]`

## Shadcn

This project uses shadcn/ui for UI components. Always prefer shadcn components over custom implementations when a suitable component exists. Browse available components at [ui.shadcn.com](https://ui.shadcn.com). Components are installed to `src/components/ui/` and can be customized after installation.

Components use the `base-sera` style, built on Base UI (not Radix). Compose with the `render` prop instead of `asChild`. For links that look like buttons, style the link with `cn(buttonVariants())` rather than wrapping it in `Button`. The `cn()` is required: without it the base and variant classes conflict (the outline border ends up transparent).

Theme colors are CSS variables in `src/app/globals.css`, generated from a shadcn preset code (currently `b8V3L7ZapU`: Sera, taupe base, red theme, IBM Plex Sans and Instrument Serif). Change them with `npm run theme -- <code>` rather than editing by hand; `npx shadcn preset decode <code>` shows what a code contains. Fonts are applied separately with `npx shadcn apply <code> --only font --yes`; it rewrites `layout.tsx` messily and drops `--background`/`--foreground` from `:root`, so check the diff. The app is forced to dark mode, so the manifest, OG images and viewport theme color read the `.dark` colors from `globals.css` via `src/lib/theme.ts`.

### Theming rules

- Only use theme tokens for color (`bg-card`, `text-muted-foreground`, `bg-primary`, ...). No hex, `oklch()` or Tailwind palette colors like `bg-red-500` outside `src/components/ui/`. `tests/components/theme-tokens.test.ts` enforces this.
- Game colors are tokens in the `.dark` block: `bait`, `correct`, `wrong`. Alias theme variables where one fits (`--bait: var(--primary)`) so they follow preset changes. Red is the only loud color: it means bait (and wrong). Keep other UI in foreground, background and borders. A new color gets a token there and a `--color-*` line in `@theme inline`.
- Customize shadcn components with variants in `src/components/ui/` (like Button's `bait` variant and `xl` size), not long `className` overrides at each use.
- Match Sera's type: headings are `font-heading` at regular weight (Instrument Serif only has 400, and faux bold is turned off), small labels use the `text-label` utility (uppercase, wide tracking, like Sera's buttons). Avoid `font-bold`, `font-extrabold` and `tracking-tight`.
- Keep Sera's square corners: no `rounded-*` on cards, buttons or images.

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (route.ts files)
│   ├── opengraph-image.tsx # Auto-generated OG image
│   ├── twitter-image.tsx   # Auto-generated Twitter image
│   ├── manifest.ts         # PWA manifest
│   ├── sitemap.ts          # Sitemap generation
│   ├── robots.ts           # Robots.txt generation
│   ├── layout.tsx          # Root layout with metadata
│   └── [page]/page.tsx     # Pages
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── common/             # Shared custom components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── config.ts           # Site configuration
│   ├── theme.ts            # Reads theme colors from globals.css
│   └── utils.ts            # Utility functions (cn)
└── validators/             # Zod schemas and types

tests/                      # Tests mirror src/ structure
├── api/                    # API route tests
├── components/             # Component tests
├── hooks/                  # Hook tests
├── lib/                    # Utility tests
├── utils/                  # Test utilities
└── setup.ts                # Test setup
```

## Code Rules

- Use `@/` path alias for imports from `src/`
- Client components need `"use client"` directive
- Zod schemas go in `src/validators/`, types are inferred with `z.infer<>`
- Site metadata flows from `src/lib/config.ts` to layout, manifest, sitemap, robots, and OG images
- API routes export named functions (GET, POST, etc.) in `route.ts` files
- Tests import route handlers directly for API testing
- Keep comments to a minimum. Don't comment what the code already says; only add one for a non-obvious why (a workaround, a magic number, a gotcha)

## Behavior

- Be concise
- Search or read docs when uncertain
- Maintain code quality and follow the existing structure
