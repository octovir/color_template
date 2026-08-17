// Shared domain types for the color system.

export type Shade = string // '50'..'950'
export type Hex = string // '#64748B'

export interface ColorFamily {
  name: string
  note: string
  hex500: Hex
  shades: [Shade, Hex][]
}

export interface ColorCategory {
  cat: string
  note: string
  families: ColorFamily[]
}

export interface ChartColor {
  name: string
  hex: Hex
}

export type ColorRole = 'Primary' | 'Secondary' | 'Accent' | 'Background' | 'Surface' | 'Text'

export interface Palette {
  name: string
  desc: string
  colors: [ColorRole, Hex][]
}

export interface PalettePreset {
  id: string
  icon: string
  name: string
  desc: string
  palettes: Palette[]
}

// Flattened swatch used by the search engine.
export interface SwatchEntry {
  family: string
  shade: string
  hex: Hex
  note: string
}

export type TabId = 'home' | 'palette' | 'picker'

export interface ColorLibrary {
  categories: ColorCategory[]
  chartColors: ChartColor[]
  aliases: Record<string, string>
}
