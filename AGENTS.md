## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project conventions

Satamu follows the same conventions as `../prasetya-webworks`. Details and reasons are in `docs/architecture.md` and `docs/decisions/`.

### Before you finish a change

1. `npm run format` then `npm run validate` (Prettier check, ESLint, Stylelint, `astro check`). It must pass with 0 errors; CI runs the same command.
2. `npm run build` succeeds.
3. For UI changes, check the built site (`npm run preview`) at 360px, 768px and desktop: no horizontal scroll.
4. For refactors that should not change the UI, compare full-page screenshots before and after (with `prefers-reduced-motion: reduce`) and expect zero pixel difference.
5. Update the docs in `docs/` in the same change when behaviour, structure, routes or setup change. Record new technical decisions as an ADR in `docs/decisions/`.

### Structure

- `src/pages/` only routes: import a page component and pass `locale` and params. No markup or styles there.
- `src/components/layout/` site-wide pieces; `components/ui/` shadcn/ui primitives (`button.tsx`, …), text via props; `components/home/` one component per home section, composed in `HomePage.astro`.
- Reuse existing components before writing new markup. Do not copy a component to change it slightly; add a prop.
- Shared browser logic goes in `src/scripts/` as exported functions; component `<script>` blocks import them.
- Site constants (name, WhatsApp number, logo, parent brand) come from `src/config/site.ts`.
- Components talk through `data-*` attributes and ids they own, not globals.

### Text and URLs

- All UI text lives in `src/i18n/content.ts`. Indonesian (`id`) only for now; when English is added, use the same keys in `en`. Never hard-code visible text in components.
- URLs and anchors are English, lowercase, hyphenated, plural for collections (`/themes/`, `#packages`).

### Styling (Tailwind CSS + shadcn/ui)

- `docs/design.md` is the source of truth for colours, typography, spacing, radius and component rules. It mirrors the Prasetya Webworks design system (including Raleway + Plus Jakarta Sans) with Satamu colours.
- Style with Tailwind utility classes in the markup. No `<style>` blocks in components; see ADR 0002.
- `src/styles/global.css` holds only the Tailwind import, the shadcn/ui theme variables (`--background`, `--primary`, `--muted-foreground`, …, coloured from the Satamu logo), the `@theme inline` mapping, base layer rules and a few `@utility` helpers (`bg-satamu-glow`).
- Use theme colours (`bg-primary`, `text-muted-foreground`, `border-border`, `text-navy`, `bg-cream`) instead of raw hex values. Add a new colour as a variable plus `@theme` entry, not inline.
- shadcn/ui components live in `src/components/ui/*.tsx` and are owned source. Add them from the registry (`npx shadcn add <name>`, run with `--cwd` from outside the project if npm blocks install scripts) and adjust them there; do not wrap a copy.
- React components render to static HTML by default. Add `client:*` only when the component really needs browser state (dialogs, menus); prefer an `<a>`/`<button>` with `buttonVariants()` from `@/components/ui/button` for links and simple buttons.
- Merge class names with `cn()` from `@/lib/utils`. Import with the `@/` alias (`@/components/...`, `@/lib/...`).
- Prettier sorts Tailwind classes (`prettier-plugin-tailwindcss`); do not reorder by hand.
- Never use `filter: blur()` or `blur-*` utilities for decoration: Safari iOS clips them to a square inside rounded, overflow-hidden containers. Use radial gradients (`bg-satamu-glow`).
- Respect reduced motion: pair transitions and transforms with `motion-reduce:` variants.
- Mobile first: base classes for phones, then `md:` / `lg:`. Check 360px, 768px and desktop.

### Git

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `ci:`, `chore:`).
- Pushing to `main` deploys to production (`satamu.prasetyawebworks.web.id`).

## Documentation

Project documentation: `docs/README.md`. Cross-project plan: `../README.md`.

Astro documentation: https://docs.astro.build
