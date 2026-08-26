import type { Hex } from '../types'

export function hexToRgba(hex: Hex, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function luminance(hex: Hex): number {
  const h = hex.replace('#', '')
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

export function bestTextOn(hex: Hex): string {
  return luminance(hex) > 0.45 ? '#18181B' : '#FFFFFF'
}

// WCAG 2.x relative-luminance contrast ratio between two colors (1..21).
export function contrastRatio(a: Hex, b: Hex): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// Normal-text WCAG level for a ratio (AA = 4.5:1, AAA = 7:1).
export function wcagLevel(ratio: number): 'AAA' | 'AA' | null {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return null
}
