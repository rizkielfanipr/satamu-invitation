---
version: alpha
name: Satamu
description: >-
  A warm, heartfelt design system for digital invitations: navy and coral from the
  Satamu logo, cream-toned backgrounds, soft bordered surfaces, clear typography and
  restrained elevation.
basedOn: ../../prasetya-webworks/docs/design.md
---

# Satamu Design System

This document is the source of truth for Satamu's visual language. It follows the Prasetya Webworks design system (`../../prasetya-webworks/docs/design.md`) one to one: layout, typography, spacing, radius, elevation and component rules are the same. **Only the colours differ**, taken from the Satamu logo. Satamu implements it with Tailwind CSS v4 and shadcn/ui (see [ADR 0002](decisions/0002-tailwind-shadcn.md)).

## Visual direction

- Warm, heartfelt and celebratory, while staying clean and trustworthy.
- Coral is reserved for primary actions, emphasis and active states.
- Cream backgrounds create separation without heavy shadows.
- Cards use thin borders, subtle transparency and generous whitespace.
- Headings are geometric and confident; body text stays clean and highly legible.
- Static surfaces remain flat. Only primary calls to action receive elevation.

## Logo

- Mark: a navy **S** that curls into a coral door standing ajar, with a small cream handle. It stands for an invitation: the door opened for the guest (*satamu* echoes "tamu", guest).
- Wordmark: "satamu" in navy bold, with "by prasetya webworks" below it in slate.
- Files:
  - `public/images/satamu-logo-flat.svg` — flat logo for light backgrounds (`site.logo`).
  - `public/images/satamu-logo.png` — glowing version on a dark background, for social and presentation use only.
- The SVG wordmark still uses system font text (Avenir Next). Outline it to paths before using it at small sizes or in new places, as the Prasetya logo does.
- Do not recolour the logo with CSS filters.

## Brand palette

| Name | Value | Use |
|---|---|---|
| Navy | `#102A43` | Text, logo mark, dark surfaces (`text-navy`) |
| Coral | `#FF6542` | Primary actions, emphasis (`bg-coral`) |
| Slate | `#526779` | Supporting text (`text-slate-brand`) |
| Cream | `#FFF7F2` | Soft surfaces (`bg-cream`) |

## Semantic color tokens

Defined as shadcn/ui variables in `src/styles/global.css` and exposed to Tailwind through `@theme inline` (`bg-background`, `text-primary`, `border-border`, …).

| Token | Value | Role | Prasetya equivalent |
|---|---|---|---|
| `--background` | `#FFFAF6` | Page background | `#FFFAF4` |
| `--foreground` | `#102A43` | Primary text | `#0F172A` |
| `--card` | `#FFFFFF` | Cards and panels | `#FFFFFF` |
| `--primary` | `#FF6542` | Primary CTA and emphasis | `#FF5100` |
| `--primary-foreground` | `#FFFFFF` | Text and icons on coral | `#FFFFFF` |
| `--secondary` | `#FFF7F2` | Soft coral surface | `#FFF1E8` |
| `--accent` | `#FFE6DC` | Highlight surface | `#FFE2CF` |
| `--muted` | `#F6F2EF` | Neutral raised surface | `--muted-surface` `#F6F3F0` |
| `--muted-foreground` | `#526779` | Supporting text | `#646464` |
| `--border` / `--input` | `#F1E2D9` | Default border, input border | `#EADED5` |
| `--ring` | `#FF6542` | Keyboard focus ring | `#FF5100` |
| `--destructive` | `#DC2626` | Errors (shadcn components) | — |

Do not introduce a new visual color for ordinary components when a semantic token already covers its role. Status colors may be added only when the product has an actual error, warning, success or information state.

## Typography

### Families

- Display and headings: **Raleway**, fallback `sans-serif` (`font-display`).
- Body, captions and interface labels: **Plus Jakarta Sans**, fallback `sans-serif` (`font-sans`, the default).

### Scale

| Role | Size | Weight | Line height | Tracking |
|---|---:|---:|---:|---:|
| Display desktop | `60px` | 500–600 | 1 | `-1.5px` |
| Display tablet | `48px` | 500–600 | 1 | `-1px` |
| Display mobile | `36px` | 500–600 | 1.05 | `-0.7px` |
| Heading small | `14px` | 600 | 1.43 | `-0.35px` |
| Body large | `16px` | 400 | 1.5 | 0 |
| Body medium | `15px` | 400 | 1.87 | 0 |
| Body small | `14px` | 500 | 1.43 | 0 |
| Body small strong | `14px` | 600 | 1.43 | 0 |
| Caption | `12px` | 500–700 | 1.33 | 0 |
| Eyebrow | `12px` | 700 | 1.33 | `1.44px` |

Eyebrows use uppercase coral text. Avoid mixing Raleway and Plus Jakarta Sans within a single heading.

### Mixing styles

Large headings may mix weight and style within Raleway:

- **Semibold upright** for the plain statement ("Undangan digital,").
- *Medium italic* for the middle phrase ("terasa personal").
- ***Semibold italic in coral*** for the payoff ("untuk setiap tamu."), flowing inline.

Use at most three styles in one heading and keep coral for the last, most important phrase. The hero heading stays within 3 lines at every width from 360px up; check it when the copy changes.

## Spacing

The base unit is `4px`, which matches Tailwind's spacing scale (`1` = `4px`).

| Name | Value | Tailwind |
|---|---:|---|
| `xxs` | `4px` | `1` |
| `xs` | `8px` | `2` |
| `sm` | `12px` | `3` |
| `md` | `16px` | `4` |
| `lg` | `20px` | `5` |
| `xl` | `24px` | `6` |
| `xxl` | `32px` | `8` |
| `xxxl` | `36px` | `9` |
| `section` | `40px` | `10` |
| `band` | `64px` | `16` |

Section padding-inline is `24px` on mobile, `32px` on tablet and `40px` from desktop upward (`px-6 md:px-8 lg:px-10`).

## Radius and elevation

- Standard cards, buttons and form containers: `16px` (`--radius`, `rounded-lg`).
- Compact controls: `12px` (`rounded-md` is `14px`; use `rounded-[12px]` where the exact value matters).
- Small inline controls: minimum `8px`.
- Avoid pill shapes unless the control semantically benefits from it.
- Cards use a border and no shadow by default.
- Primary CTA shadow (`shadow-brand`):

```css
box-shadow:
  0 10px 15px -3px rgb(255 101 66 / 25%),
  0 4px 6px -4px rgb(255 101 66 / 25%);
```

Do not invent additional elevation levels.

## Components

### Primary button

- Height: `48px` (`h-12`).
- Padding: `14px 24px` (`px-6`).
- Background: `--primary`; hover `primary/90`.
- Text and icons: white (`--primary-foreground`), Plus Jakarta Sans 14/600.
- Radius: `16px`.
- Uses the primary CTA shadow.
- Implementation: `buttonVariants()` from `@/components/ui/button` with size and radius classes, on an `<a>` for links.

### Outline button

- Height: `38–48px` depending on context.
- White background, foreground text and `--border` stroke (`variant: 'outline'`).
- No shadow.
- Hover uses `--secondary` and a stronger coral border.

### Card

- White or translucent-white background.
- `1px` border using `--border` or a low-opacity coral.
- Radius: `16px`.
- Padding: `20–24px`.
- No shadow at rest.
- Hover may strengthen the border and move at most `3px` vertically.

### Form controls

- White background, `1px` input border and `12px` radius.
- Keyboard focus uses the coral ring and must not rely on color alone when an error exists.
- Labels remain visible; placeholders do not replace labels.

### Navigation

- At the top of the page the header is transparent over the hero, full width, `80px` tall.
- Once the page scrolls it becomes a floating bar: inset `12px` from the top and `12–24px` from the sides, `64px` tall, `--background` fill, `--border` stroke, `16px` radius and a soft navy shadow. It stays opaque so text never shows through.
- Desktop: logo, horizontal links in the centre, primary button "Order Sekarang" on the right. Mobile: logo, menu trigger and a bordered white panel with the links and the primary button.
- Minimum touch target is `36px`; primary actions target `48px`.

### Hero

- Two columns from `1024px` (text a little wider than the visual), one column below with the visual after the text.
- Below the heading, a price block as on Prasetya Webworks instead of a paragraph: uppercase Eyebrow-style prefix ("Mulai dari"), the price in Raleway 700 (`30–48px`, `-0.04em`) and a muted suffix that drops to its own line on phones.
- One primary button only. A vertical timeline of the order steps follows it: `44px` round bordered icons in coral, joined by a `1px` `--border` line, step title Body small strong and description in `--muted-foreground`.
- Visual: phone mockups of invitation covers on a faint navy grid with coral glows (`bg-satamu-hero`). Mockups are decorative (`aria-hidden`), may use theme surfaces (navy, coral, cream gradient) and must not overflow the page width. Below `640px` the phone group scales down as one unit (`62%` under `400px`, `72%` up to `640px`) so the tilted side phones stay on screen; the overlay card keeps its normal size.

### Pricing

- Section heading with `SectionIntro`, then three package cards: one column (max `448px`) below `1024px`, three columns from `1024px`.
- Card: white, `1px` `--border`, `16px` radius, `24px` padding, no shadow. Name (Raleway 600, `20px`), tagline (Body small, muted), price (Raleway 700, `34px`, `-0.04em`) followed by a muted "/ acara" that never breaks apart, a `--border` divider, a feature list with coral check icons, and a full-width `48px` button pinned to the bottom.
- The recommended package has a coral border plus `1px` coral ring, a soft `--secondary` to white gradient, a coral "Paling diminati" badge sitting on the top edge, and a filled primary button with the brand shadow. Other packages use the outline button.
- A muted note about the active period sits centred below the cards.

### FAQ

- Section heading with `SectionIntro`, then a stack of native `<details>` items (`12px` gap): white card, `1px` `--border`, `16px` radius, question Body large strong, a `28px` coral round plus that rotates into a cross when open, and the answer in muted `15px` text. An open item gets a soft coral border.

### Footer

- Same layout as the Prasetya Webworks footer: `--foreground` (navy) background with a `3px` coral top border.
- Three columns from `1024px` (brand, Menu, Hubungi Kami), two below with the brand on top, one on phones.
- Brand: white logo (`satamu-logo-white.svg`), tagline in white at `70%`, `40px` bordered social icons that fill coral on hover.
- Column headings: Raleway 700, uppercase, `0.12em` tracking, white. Links in white at `70%`, white on hover.
- Bottom bar: thin white `12%` divider, copyright and "Kembali ke atas ↑" in white at `50%`.

### Theme collection

- Section heading with `SectionIntro` (lined eyebrow, title with coral italic emphasis, description on the right).
- Category filter: outline `sm` buttons with `12px` radius; the active one is filled coral (`aria-pressed`). All filters stay visible; on narrow screens they wrap onto a second line (no sideways scrolling).
- Grid: 2 columns on phones, 3 from `640px`, 6 from `1024px`. The home shows 12 themes (two rows of six), followed by an outline "Lihat Semua Template" button; `/themes/` shows all.
- Card: a small phone frame (`PhoneMockup size="sm"`, max `200px` wide) with the cover centred on the screen, then left-aligned category (Caption, muted), theme name (Raleway 600, `18px`) and a text link "Pakai template ini →" (Body small strong, `--muted-foreground`, coral on hover with the arrow nudging right; no box). The link is pinned to the bottom so links line up across a row.
- Cover colours come from each theme's data (theme surfaces), not from Satamu tokens.

## Responsive layout

| Viewport | Grid | Heading | Section padding |
|---:|---:|---:|---:|
| `375px` | 1 column | `36px` | `24px` |
| `768px` | 2 columns | `48px` | `32px` |
| `1024px` | 4 columns | `60px` | `40px` |
| `1280–1440px` | up to 5 columns | `60px` | `40px` |

- Never force desktop grids onto mobile. Write mobile classes first, then `md:` / `lg:`.
- Text columns use `minmax(0, 1fr)` (`grid-cols-[minmax(0,1fr)]`) to prevent overflow.
- Long Indonesian strings must wrap without changing page width.
- Respect `prefers-reduced-motion` for every transition and animation (`motion-reduce:`).

## shadcn implementation rules

- shadcn/ui components are owned source in `src/components/ui/*.tsx`, added from the registry and adjusted there.
- Use semantic tokens (`bg-primary`, `text-muted-foreground`) rather than hard-coded colors.
- React components render to static HTML; add `client:*` only when state cannot be handled accessibly with native HTML.
- Compose existing components before adding duplicate markup; merge classes with `cn()`.

Current components:

- `src/components/ui/button.tsx` (shadcn Button: variants `default`, `outline`, `secondary`, `ghost`, `link`, `destructive`)
- `src/components/layout/SiteHeader.astro` (transparent → floating header)
- `src/components/home/PhoneMockup.astro` (decorative invitation phone: `theme` = `cream` | `navy` | `coral` presets or a `palette` from data; `size` = `md` | `sm`)
- `src/components/ui/SectionIntro.astro` (section heading, `level` = `h2` | `h1`)
- `src/components/themes/ThemeGrid.astro`, `ThemeCard.astro` (theme filter, grid and card)
- Icons: `lucide-react`, rendered as static SVG in Astro

## Do

- Use coral for primary calls to action and short visual emphasis.
- Use Raleway for headings and Plus Jakarta Sans for body/interface copy.
- Use bordered cards with clear spacing and restrained hover movement.
- Keep content readable and layouts responsive from 320px upward.
- Preserve visible focus, semantic HTML and sufficient touch targets.

## Do not

- Add arbitrary shadow tiers.
- Use Prasetya orange (`#FF5100`) or other brand colors in Satamu.
- Use full-pill radii everywhere.
- Hide labels in favor of placeholders.
- Add a dark theme without a measured and approved design.
- Hard-code visible UI text outside `src/i18n/content.ts`.

## Known gaps

- **Contrast of coral:** white on coral `#FF6542` is about 2.9:1 and coral text on the cream background about 2.8:1, below WCAG AA (4.5:1 for normal text, 3:1 for large text). Prasetya's orange has the same issue to a lesser degree (3.3:1). Options to decide: a deeper coral for buttons and small text (for example `#D9472A`, 4.3:1 with white), or navy text on coral (5.0:1). Until then, keep coral text large and bold.
- A complete semantic status-color ramp is not defined.
- A first-class dark theme is not defined.
- Complex form error and readonly states need a future design pass.
- Invitation themes (the customer-facing WordPress pages) are out of scope; this document covers the Satamu website.
