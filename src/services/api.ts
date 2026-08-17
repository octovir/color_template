import type { PalettePreset } from '../types'
import { CHART_COLORS, PALETTE } from '../data/colors'
import { ALIASES } from '../data/aliases'
import { PALETTE_PRESETS } from '../data/palettes'
import type { ColorLibrary } from '../types'

// ---------------------------------------------------------------------------
// Backend-ready API client.
//
// Today these resolve from the bundled local data modules. To move behind a
// backend, set VITE_API_BASE_URL (see .env.example) and swap the local return
// for `fetch(...)` — the call sites in the app stay unchanged.
// ---------------------------------------------------------------------------

const BASE: string = import.meta.env.VITE_API_BASE_URL || ''

export async function getColorLibrary(): Promise<ColorLibrary> {
  if (BASE) {
    const res = await fetch(`${BASE}/colors`)
    if (!res.ok) throw new Error(`GET /colors -> ${res.status}`)
    return res.json()
  }
  return { categories: PALETTE, chartColors: CHART_COLORS, aliases: ALIASES }
}

export async function getPalettePresets(): Promise<PalettePreset[]> {
  if (BASE) {
    const res = await fetch(`${BASE}/palettes`)
    if (!res.ok) throw new Error(`GET /palettes -> ${res.status}`)
    return res.json()
  }
  return PALETTE_PRESETS
}
