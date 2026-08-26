import { ref } from 'vue'
import type { Hex } from '../types'

export type GlowScene = 'home' | 'palette' | 'picker'

// Singleton ambient-glow state: the active scene drives the background color
// wash; the picker can additionally tint the glow with the selected palette.
const scene = ref<GlowScene>('home')
const tint = ref<[Hex, Hex] | null>(null)

export function useAmbient() {
  function setScene(s: GlowScene) {
    scene.value = s
  }

  function setTint(t: [Hex, Hex] | null) {
    tint.value = t
  }

  return { scene, tint, setScene, setTint }
}
