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
- `src/components/layout/` site-wide pieces; `components/ui/` generic, text via props; `components/home/` one component per home section, composed in `HomePage.astro`.
- Reuse existing components before writing new markup. Do not copy a component to change it slightly; add a prop.
- Shared browser logic goes in `src/scripts/` as exported functions; component `<script>` blocks import them.
- Site constants (name, WhatsApp number, logo, parent brand) come from `src/config/site.ts`.
- Components talk through `data-*` attributes and ids they own, not globals.

### Text and URLs

- All UI text lives in `src/i18n/content.ts`. Indonesian (`id`) only for now; when English is added, use the same keys in `en`. Never hard-code visible text in components.
- URLs and anchors are English, lowercase, hyphenated, plural for collections (`/themes/`, `#packages`).

### CSS

- Component styles go in the component's scoped `<style>`. `src/styles/global.css` holds only design tokens, base element styles and cross-component utilities (`.section-pad`).
- Colours come from the Satamu logo tokens (`var(--navy)`, `var(--coral)`, `var(--slate)`, `var(--cream)`); use tokens instead of raw values.
- One rule per selector (Stylelint enforces `no-duplicate-selectors`). Order: base rules, `@keyframes`, `@media` 1000px → 800px → 560px, then `prefers-reduced-motion`.
- Never use `filter: blur()` for decoration (Stylelint blocks it): Safari iOS clips it to a square inside rounded, overflow-hidden containers. Use `radial-gradient`.
- Constrain grid columns that hold text with `minmax(0, 1fr)`.
- Respect `prefers-reduced-motion` for animations and transitions.

### Git

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `ci:`, `chore:`).
- Pushing to `main` deploys to production (`satamu.prasetyawebworks.web.id`).

## Documentation

Project documentation: `docs/README.md`. Cross-project plan: `../README.md`.

Astro documentation: https://docs.astro.build
