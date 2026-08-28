import { ref } from 'vue'
import { PALETTE, CHART_COLORS } from '../data/colors'
import { flattenSwatches } from './useSearch'
import { hexToRgba } from '../lib/color'
import { useTheme } from './useTheme'

// Every hex in the library, deduped — the pool the focus glow draws from.
// "ฟุ้งจาก background" — focus lights up the ambient background right at the
// search bar with a random library color, rendered as a large soft radial
// pool (same language as the site's ambient blobs) that melts into the
// canvas, NOT a discrete blurred box hanging behind the field.
const ALL_HEXES = [...new Set(flattenSwatches(PALETTE, CHART_COLORS).map((s) => s.hex))]

export function useFocusGlow() {
  const { dark } = useTheme()
  const glowColor = ref<string | null>(null)

  const glowPick = () => {
    glowColor.value = ALL_HEXES[Math.floor(Math.random() * ALL_HEXES.length)]
  }
  const glowClear = () => {
    glowColor.value = null
  }

  // A soft, oversized radial pool centered on the field. ellipse falloff to
  // ~70% transparent means the colour washes the surrounding canvas and the
  // glass field picks it up through its blur — reads as the background being
  // lit, not a bubble. Dark mode glows a touch stronger.
  const haloStyle = () => {
    if (!glowColor.value) return { background: 'transparent', opacity: 0 }
    const alpha = dark.value ? 0.24 : 0.16
    return {
      background: `radial-gradient(ellipse 130% 340% at 50% 50%, ${hexToRgba(glowColor.value, alpha)} 0%, transparent 70%)`,
      opacity: 1,
    }
  }

  return { glowColor, glowPick, glowClear, haloStyle }
}