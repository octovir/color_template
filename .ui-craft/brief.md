# Color System — Design Brief

## Identity
A curated color library website for designers and developers: search 245 swatches (Thai/English), browse by hue family, build palettes by site type, preview on a page mockup, copy with one click.

## Design intent (v3 website, 2026-08-27)
**This is a WEBSITE, not a dashboard.** No sidebar, no bottom tab bar — those read as app/dashboard chrome and were removed. Shell = **floating rounded-2xl pill header** (blur + soft shadow, pt-3/4) with brand, **segmented nav** (zinc track, active item = white pill + shadow — desktop inline, mobile as a second rounded row inside the pill), and a **search-as-field button** (with ⌘K kbd, icon-only on xs) + theme toggle. Content is centered (max-w-[1200px]) with generous vertical rhythm.

**Ambient glow (ฟุ้งของสี)** — the signature. Static, large, soft radial color washes behind the content (`AmbientGlow.vue` + `useAmbient` singleton):
- One 3-blob scene per tab, crossfaded over 1.4s (`.glow-blob` opacity toggling, never animated position — floating orbs are an AI tell)
- Light mode: warm amber top-left, indigo right, teal bottom (alphas 0.11–0.19). Dark mode: violet/blue/teal, stronger (0.12–0.22)
- Picker adds a **palette tint layer**: the selected palette's Primary + Accent colors wash the background at ~0.14 alpha, crossfading when you switch palettes — the content colors the canvas
- Dominant tone stays zinc per mode; glow is a haze, not a wallpaper

## Design tokens — Liquid Glass (v4, 2026-08-27)
**ONE surface language for the whole site** (user: "control UX/UI to look like one piece"):
- `.glass` / `.glass-strong` — translucent frosted panes: `blur(20–24px) saturate(160–180%)`, **50/64% white** (light) / 48/64% dark — user: "less opaque, a bit" (was 58/72). `.glass-solid` (72% + blur(48px)) is for the sticky filter bar — **visible frost + heavy blur so behind-content is unreadable**
- **Chromium blur gotchas (both real, both fixed):** (1) backdrop-filter fails to blur content scrolling behind an element whose sticky `top` ≠ 0 — the Full Palette filter bar is therefore **static at page top, switching to `position:fixed` via JS once scrolled past its natural position** (`checkBarPosition()` in FullPaletteView), with a spacer preventing layout jump; (2) the `.fade-in` animation must use `fill-mode: backwards` — fill-mode:both leaves an identity transform on the view root, which becomes the containing block and breaks `position:fixed` descendants
- `.glass-chip` — pills: chips, ghost buttons, count badges (rounded-full)
- `.glass-field` — ALL search inputs identical: rounded-full, blur(16px) saturate(160%), inset highlight; focus = brightened bg + black ring
- `.glass-track` — segmented-control tracks (nav, rail hover)
- **All classes use `:where()` (zero specificity)** so Tailwind utilities (ring-2, border-[#18181B]) can override glass chrome — verified: selected cards show the ring on top of glass
- Dark mode handled INSIDE the glass classes; the zinc token mapping in dark.css covers the remaining flat text/borders. **Every glass variant needs its own `.dark :where(.glass*)` rule — `.glass` was once missed → white cards on dark** (fixed 2026-08-27, incl. `border-[#18181B]` mapping for the picker's active card)
- Interactive controls = rounded-full; surfaces/cards = rounded-2xl (16px); content tiles (swatches) stay solid for clarity
- Glass works because the ambient glow sits behind — surfaces frost the color haze

## Tokens (flat chrome)
- Canvas: #FAFAFA light / #09090B dark; Text: #18181B / #71717A / #A1A1AA (light); #FAFAFA / #A1A1AA / #71717A (dark)
- Font: IBM Plex Sans Thai ONLY (100–700 loaded; avoid 800). font-mono for hex codes.
- Hairlines on flat sections: #E4E4E7 / #27272A; dark mapping = exact-token `[class~="..."]` (bg-white/60..90, border /60..80 all mapped)

## Layout & motion
- Motion budget: 150–220ms UI (fade-in, pop-in, tray), 1.4s glow crossfade. No scroll reveals, no stagger, no count-up. `prefers-reduced-motion` honored (glow crossfade disabled).
- Sentence case everywhere. Numbers `tabular-nums`.
- Sticky offsets under the header use `--nav-h` (synced from the real header height): `top-[calc(var(--nav-h,0px)_+_16px)]` — Tailwind arbitrary calc needs underscores for spaces.

## Signature elements
- **Featured family ramps** (home hero): four families (Blue/Emerald/Orange/Violet) as vertical shade columns 50→950, hover reveals shade + hex, click to copy. Replaced the 245-tile color wall (user: "too many colors").
- **Home = editorial hero**: 54px headline, 16px sub, big search (Enter → Full Palette with query via `presetQuery`), ramps, hairline stats row, taste strips. No marketing cards duplicating nav.
- **Full Palette**: flat sections on canvas; **sticky glass-strong filter bar** (matches navbar opacity — user: "see-through, unlike the others" → fixed) with category chips w/ scroll-spy + shade-level chips All/50–950 (near-solid 0.78 chips), chart set hides under shade filter.
- **Picker (minimal, 2026-08-27)**: NO rail/list — **segmented chip selector** for 15 site types (glass-track, white active pill, exactly the navbar language, horizontal scroll). Palette cards = clean glass (name + color strip + desc only, no redundant copy buttons). Right sticky **glass-strong preview** with mockup + color rows + WCAG contrast + ONE primary action (solid black "Copy CSS" pill).
- **Clipboard tray**: last 6 copies (shared `useClipboard` history), copy-again tiles, Copy all, Clear. Desktop bottom-right, mobile bottom strip above content.

## Learned constraints
- Whole-card clickable; one clear path per destination (no redundant nav)
- Desktop ≥640px stable — preserve base + sm:/lg: variants
- Keep functions: Thai/English search, ⌘K, copy hex/CSS vars, scroll-spy chips, theme toggle, tab persistence (`ct-tab`), back-to-top, toasts
- Headless verification: pin `prefers-color-scheme: light` via `Emulation.setEmulatedMedia`, clear `ct-tab`/`ct-theme` per load, stub `navigator.clipboard` with `Object.defineProperty` AFTER final reload, and pixel-scan screenshots to catch unmapped dark tokens
