import { computed, ref } from 'vue'
import type { StyleValue } from 'vue'
import { PALETTE, CHART_COLORS } from '../data/colors'
import { flattenSwatches } from './useSearch'
import { hexToRgba } from '../lib/color'

// Every hex in the library, deduped — the pool the focus glow draws from.
// "ฟุ้งเป็นสีแบบ random ตามสีที่มีให้" — each focus picks a soft glow from a
// real swatch color, not a hardcoded accent.
const ALL_HEXES = [...new Set(flattenSwatches(PALETTE, CHART_COLORS).map((s) => s.hex))]

export function useFocusGlow() {
  const active = ref<string | null>(null)

  // Soft frosted glow: a tight colored ring + a wide halo, over the field's
  // specular inset so the search still reads as glass while focused.
  const focusGlowStyle = computed<StyleValue | undefined>(() => {
    if (!active.value) return undefined
    return {
      boxShadow: [
        `0 0 0 3px ${hexToRgba(active.value, 0.16)}`,
        `0 0 22px 4px ${hexToRgba(active.value, 0.2)}`,
        'inset 0 1px 0 rgba(255,255,255,0.6)',
      ].join(', '),
    }
  })

  const glowPick = () => {
    active.value = ALL_HEXES[Math.floor(Math.random() * ALL_HEXES.length)]
  }
  const glowClear = () => {
    active.value = null
  }

  return { focusGlowStyle, glowPick, glowClear }
}