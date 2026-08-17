import type { ChartColor, ColorCategory, SwatchEntry } from '../types'
import { ALIASES } from '../data/aliases'
import { SHADE_TERMS } from '../data/shade-terms'

// ---- Thai dictionary (longest-match word segmentation, from aliases + shade words) ----
const THAI_WORDS: string[] = (() => {
  const s = new Set<string>()
  Object.values(ALIASES).forEach((v) =>
    v.split(/\s+/).forEach((w) => {
      if (/[\u0E00-\u0E7F]/.test(w)) s.add(w)
    }),
  )
  Object.keys(SHADE_TERMS).forEach((w) => {
    if (/[\u0E00-\u0E7F]/.test(w)) s.add(w)
  })
  return [...s].sort((a, b) => b.length - a.length)
})()

function tokenizeQuery(q: string): string[] {
  const tokens: string[] = []
  q.split(/([\u0E00-\u0E7F]+)/).forEach((part) => {
    if (!part) return
    if (/[\u0E00-\u0E7F]/.test(part)) {
      let rest = part
      while (rest.length) {
        let matched: string | null = null
        for (const w of THAI_WORDS) {
          if (rest.startsWith(w)) {
            matched = w
            break
          }
        }
        if (matched) {
          tokens.push(matched)
          rest = rest.slice(matched.length)
        } else {
          tokens.push(rest[0])
          rest = rest.slice(1)
        }
      }
    } else {
      part
        .split(/\s+/)
        .filter(Boolean)
        .forEach((t) => {
          if (/^[0-9a-f]{6}$/.test(t)) {
            tokens.push(t)
            return // hex code stays whole
          }
          t.split(/(?<=[a-z])(?=\d)|(?<=\d)(?=[a-z])/).forEach((x) => tokens.push(x))
        })
    }
  })
  return tokens
}

export function flattenSwatches(categories: ColorCategory[], chartColors: ChartColor[]): SwatchEntry[] {
  const out: SwatchEntry[] = []
  for (const cat of categories)
    for (const f of cat.families)
      for (const [shade, hex] of f.shades)
        out.push({ family: f.name, shade, hex: hex.toUpperCase(), note: f.note })
  for (const c of chartColors)
    out.push({ family: c.name, shade: 'chart', hex: c.hex.toUpperCase(), note: 'categorical chart series' })
  return out
}

function filterSwatches(all: SwatchEntry[], q: string): SwatchEntry[] {
  const tokens = q ? tokenizeQuery(q) : []
  if (!tokens.length) return all
  const shadeTokens = tokens.filter((t) => SHADE_TERMS[t] || /^\d{1,3}$/.test(t))
  const kwTokens = tokens.filter((t) => !(SHADE_TERMS[t] || /^\d{1,3}$/.test(t)))
  const shadeSets = shadeTokens.map((t) => SHADE_TERMS[t] || [parseInt(t, 10)])

  const scored = all.map((sw) => {
    const hay = [sw.family, sw.shade, sw.hex, sw.note, ALIASES[sw.family] || '']
      .join(' ')
      .toLowerCase()
      .replace(/#/g, '')
    return {
      sw,
      kwOk: kwTokens.length === 0 || kwTokens.every((t) => hay.includes(t)),
      orKw: kwTokens.length === 0 || kwTokens.some((t) => hay.includes(t)),
      shadeOk: shadeSets.length === 0 || shadeSets.some((set) => set.includes(parseInt(sw.shade, 10))),
    }
  })

  // AND-first; if nothing matches at all, fall back to OR (lenient search)
  const anyAnd = scored.some((r) => r.kwOk && r.shadeOk)
  const useOr = tokens.length > 0 && !anyAnd

  return scored
    .filter((r) => (useOr ? r.orKw && r.shadeOk : r.kwOk && r.shadeOk))
    .map((r) => r.sw)
}

export interface LibrarySearchResult {
  categories: ColorCategory[]
  chartColors: ChartColor[]
  total: number
}

// Applies the search query to the whole library, pruning non-matching shades and
// empty families/categories. Result preserves the original category structure.
export function searchLibrary(
  categories: ColorCategory[],
  chartColors: ChartColor[],
  query: string,
): LibrarySearchResult {
  const q = query.trim().toLowerCase().replace(/^#/, '')
  const filtered = filterSwatches(flattenSwatches(categories, chartColors), q)
  const matchSet = new Set(filtered.map((s) => `${s.family}|${s.shade}|${s.hex}`))

  const cats = categories
    .map((cat) => ({
      ...cat,
      families: cat.families
        .map((f) => ({
          ...f,
          shades: f.shades.filter(([shade, hex]) => matchSet.has(`${f.name}|${shade}|${hex.toUpperCase()}`)),
        }))
        .filter((f) => f.shades.length > 0),
    }))
    .filter((c) => c.families.length > 0)

  const charts = chartColors.filter((c) => matchSet.has(`${c.name}|chart|${c.hex.toUpperCase()}`))

  return { categories: cats, chartColors: charts, total: filtered.length }
}
