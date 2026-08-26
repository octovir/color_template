# Color System — Design Brief

## Identity
A curated color library website for designers and developers: search 245 swatches (Thai/English), browse by hue family, build palettes by site type, preview on a page mockup, copy with one click.

## Design intent (v3 website, 2026-08-27)
**This is a WEBSITE, not a dashboard.** No sidebar, no bottom tab bar — those read as app/dashboard chrome and were removed. Shell = full-width sticky header (hairline border + blur) with brand, text nav (underline on active), search + theme actions; mobile gets a second nav row under the bar. Content is centered (max-w-[1200px]) with generous vertical rhythm.

**Ambient glow (ฟุ้งของสี)** — the signature. Static, large, soft radial color washes behind the content (`AmbientGlow.vue` + `useAmbient` singleton):
- One 3-blob scene per tab, crossfaded over 1.4s (`.glow-blob` opacity toggling, never animated position — floating orbs are an AI tell)
- Light mode: warm amber top-left, indigo right, teal bottom (alphas 0.11–0.19). Dark mode: violet/blue/teal, stronger (0.12–0.22)
- Picker adds a **palette tint layer**: the selected palette's Primary + Accent colors wash the background at ~0.14 alpha, crossfading when you switch palettes — the content colors the canvas
- Dominant tone stays zinc per mode; glow is a haze, not a wallpaper

## Tokens
- Canvas: #FAFAFA light / #09090B dark
- Surface (cards, header): #FFFFFF / #18181B; header bar = bg-white/70 blur
- Hairline borders: #E4E4E7 / #27272A (shadows only for floating UI)
- Text: #18181B / #71717A / #A1A1AA (light); #FAFAFA / #A1A1AA / #71717A (dark)
- Font: IBM Plex Sans Thai ONLY (100–700 loaded; avoid 800). font-mono for hex codes.
- Radius: 8px inputs/buttons, 12px cards, full pills/chips
- Dark mode: `.dark` class + **exact-token** `[class~="..."]` mapping in `src/styles/dark.css`. Keep opacity variants in sync: bg-white/60..90 and border-[#E4E4E7]/60..80 must ALL be mapped or dark mode shows light bars (real bug caught by pixel verification).

## Layout & motion
- Motion budget: 150–220ms UI (fade-in, pop-in, tray), 1.4s glow crossfade. No scroll reveals, no stagger, no count-up. `prefers-reduced-motion` honored (glow crossfade disabled).
- Sentence case everywhere. Numbers `tabular-nums`.
- Sticky offsets under the header use `--nav-h` (synced from the real header height): `top-[calc(var(--nav-h,0px)_+_16px)]` — Tailwind arbitrary calc needs underscores for spaces.

## Signature elements
- **Color wall** (home hero): every swatch as a click-to-copy tile in one horizontal scroll strip, edge-faded via `--wall-edge`
- **Home = editorial hero**: 54px headline, 16px sub, big search (Enter → Full Palette with query via `presetQuery`), wall, hairline stats row, taste ramps. No marketing cards duplicating nav.
- **Full Palette**: flat sections on canvas; sticky two-row filter bar (category chips w/ scroll-spy + shade-level chips All/50–950, chart set hides under shade filter).
- **Picker = 3-pane workspace (xl)**: sticky rail (15 site types), palette cards, sticky preview (mockup + color rows + WCAG contrast AA/AAA). lg: rail + cards, preview below. Mobile: horizontal rail, cards, preview.
- **Clipboard tray**: last 6 copies (shared `useClipboard` history), copy-again tiles, Copy all, Clear. Desktop bottom-right, mobile bottom strip above content.

## Learned constraints
- Whole-card clickable; one clear path per destination (no redundant nav)
- Desktop ≥640px stable — preserve base + sm:/lg: variants
- Keep functions: Thai/English search, ⌘K, copy hex/CSS vars, scroll-spy chips, theme toggle, tab persistence (`ct-tab`), back-to-top, toasts
- Headless verification: pin `prefers-color-scheme: light` via `Emulation.setEmulatedMedia`, clear `ct-tab`/`ct-theme` per load, stub `navigator.clipboard` with `Object.defineProperty` AFTER final reload, and pixel-scan screenshots to catch unmapped dark tokens
