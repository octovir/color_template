# Color System — Design Brief

## Identity
A curated color library tool for designers and developers: search 245 swatches (Thai/English), browse by hue family, build palettes by site type, preview on a page mockup, copy with one click.

## Design intent (de-AI'd, 2026-08-27)
The chrome is monochrome zinc; **the swatches carry all the color**. One interactive accent: near-black (#18181B / inverted to #FAFAFA in dark). No gradients, no glow orbs, no animated gradient text, no uppercase tracked eyebrows, no emoji, no gradient-border selection states.

## Tokens
- Canvas: #FAFAFA light / #09090B dark
- Surface (cards, header): #FFFFFF / #18181B
- Hairline borders: #E4E4E7 / #27272A (borders over shadows; shadow only for floating UI)
- Text: #18181B / #71717A / #A1A1AA (light); #FAFAFA / #A1A1AA / #71717A (dark)
- Font: IBM Plex Sans Thai ONLY (weights 100–700 loaded; avoid font-extrabold 800 — not loaded). font-mono for hex codes.
- Radius: 8px inputs/buttons, 12px cards, 16px header, full pills/chips
- Dark mode: `.dark` class + attribute-selector mapping in `src/styles/dark.css` (not Tailwind `dark:` variants)

## Layout & motion
- Header: floating rounded bar, text tabs with underline indicator (`.nav-tab`), second nav row on mobile
- Motion budget: 150–220ms (fade-in per tab, pop-in check badges, hover states). No scroll reveals, no stagger, no count-up. `prefers-reduced-motion` honored.
- Sentence case everywhere. Numbers `tabular-nums`.

## Signature elements
- **Color wall** (Overview hero): every swatch as a click-to-copy tile in one horizontal scroll strip, edge-faded via `--wall-edge`
- Stats row: hairline-divided, plain numbers (no cards, no count-up)
- Full Palette: flat sections on canvas — no nested cards; sticky category chips with live scroll-spy (mobile-first)
- Picker: neutral selection = black ring + check badge; **WCAG contrast check** (AA/AAA) for key role pairs in step 3

## Learned constraints
- Whole-card clickable; one clear path per destination (no redundant nav buttons)
- Desktop ≥640px layout is stable — changes must preserve base + sm:/lg: variants
- Keep functions: Thai/English search, ⌘K focus, copy hex/CSS vars, scroll-spy chips, theme toggle, tab persistence (`ct-tab`), back-to-top, toasts
