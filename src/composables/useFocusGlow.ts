import { ref } from 'vue'
import { PALETTE, CHART_COLORS } from '../data/colors'
import { flattenSwatches } from './useSearch'

// Every hex in the library, deduped — the pool the focus halo draws from.
// "ฟุ้งเป็นสีแบบ random ตามสีที่มีให้" — each focus picks a soft ambient wash
// from a real swatch color, rendered as a blurred halo BEHIND the field (not
// a hard ring on top of it).
const ALL_HEXES = [...new Set(flattenSwatches(PALETTE, CHART_COLORS).map((s) => s.hex))]

export function useFocusGlow() {
  // The random hex when focused, null when idle.
  const glowColor = ref<string | null>(null)

  const glowPick = () => {
    glowColor.value = ALL_HEXES[Math.floor(Math.random() * ALL_HEXES.length)]
  }
  const glowClear = () => {
    glowColor.value = null
  }

  // Style for a blurred halo span placed BEHIND the field.
  const haloStyle = (opacity = 0.55) => ({
    background: glowColor.value ? glowColor.value : 'transparent',
    opacity: glowColor.value ? opacity : 0,
  })

  return { glowColor, glowPick, glowClear, haloStyle }
}