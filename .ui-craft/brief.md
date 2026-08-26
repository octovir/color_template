# Color System — Design Brief

## Identity
A curated color library tool for designers and developers: search 245 swatches (Thai/English), browse by hue family, build palettes by site type, preview on a page mockup, copy with one click.

## Design intent (de-AI'd, v2 structural, 2026-08-27)
The chrome is monochrome zinc; **the swatches carry all the color**. One interactive accent: near-black (#18181B / inverted to #FAFAFA in dark). No gradients (except wall edge-fades), no glow orbs, no animated gradient text, no uppercase tracked eyebrows, no emoji, no gradient-border selection states.

## App shell (structural)
- **Desktop (lg+)**: sticky left sidebar (248px) — brand, search (⌘K), 3 nav rows, theme toggle at bottom. No top header. Content column max-w-[1200px].
- **Mobile (<lg)**: floating top bar (brand + search + theme) + **bottom tab bar** (Home/Palette/Picker, icons + labels, safe-area padding). Main content gets pb-28 so the bar never covers content.
- Tab persistence (`ct-tab`), ⌘K focuses the palette search, `--nav-h` tracks the mobile top bar (0 on desktop) for sticky offsets.

## Tokens
- Canvas: #FAFAFA light / #09090B dark
- Surface (cards, header): #FFFFFF / #18181B
- Hairline borders: #E4E4E7 / #27272A (borders over shadows; shadow only for floating UI)
- Text: #18181B / #71717A / #A1A1AA (light); #FAFAFA / #A1A1AA / #71717A (dark)
- Font: IBM Plex Sans Thai ONLY (weights 100–700 loaded; avoid font-extrabold 800 — not loaded). font-mono for hex codes.
- Radius: 8px inputs/buttons, 12px cards, 16px header, full pills/chips
- Dark mode: `.dark` class + **exact-token** attribute mapping in `src/styles/dark.css` using `[class~="..."]` (not Tailwind `dark:` variants; `[class*="..."]` substring matching is WRONG — it gives hover-only buttons a rest background)

## Layout & motion
- Motion budget: 150–220ms (fade-in per tab, pop-in check badges, tray slide-up, hover states). No scroll reveals, no stagger, no count-up. `prefers-reduced-motion` honored.
- Sentence case everywhere. Numbers `tabular-nums`.

## Signature elements
- **Color wall** (Overview hero): every swatch as a click-to-copy tile in one horizontal scroll strip, edge-faded via `--wall-edge`
- **Overview = search-forward home**: big search input (Enter → Full Palette with query applied via `presetQuery` prop), wall, hairline stats row, taste ramps. NO hero marketing, NO section cards duplicating nav.
- **Full Palette**: flat sections on canvas — no nested cards; sticky two-row filter bar: category chips (scroll-spy) + **shade-level chips (All/50–950)** that filter across the library and hide the chart set.
- **Picker = 3-pane workspace (xl)**: sticky left rail of 15 site types, palette cards in the middle, **sticky right preview panel** (mockup + color rows + WCAG contrast check AA/AAA). At lg: rail + cards, preview below. Mobile: horizontal rail, cards, preview.
- **Clipboard tray**: last 6 copies collect in a floating panel (desktop bottom-right, mobile strip above the tab bar) with copy-again tiles, Copy all, Clear. History lives in the `useClipboard` singleton.

## Learned constraints
- Whole-card clickable; one clear path per destination (no redundant nav buttons)
- Desktop ≥640px layout is stable — changes must preserve base + sm:/lg: variants
- Keep functions: Thai/English search, ⌘K focus, copy hex/CSS vars, scroll-spy chips, theme toggle, tab persistence, back-to-top (positioned above the mobile tab bar), toasts (same)
- Headless Chrome verification: pin `prefers-color-scheme: light` via `Emulation.setEmulatedMedia`, clear `ct-tab`/`ct-theme` per load, and stub `navigator.clipboard` with `Object.defineProperty` AFTER the final reload to test copy pipelines
