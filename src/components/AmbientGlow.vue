<script setup lang="ts">
import { computed } from 'vue'
import { useAmbient } from '../composables/useAmbient'
import { useTheme } from '../composables/useTheme'
import { hexToRgba } from '../lib/color'
import type { GlowScene } from '../composables/useAmbient'

const { scene, tint } = useAmbient()
const { dark } = useTheme()

// Soft static color washes — one scene per tab. The dominant tone stays zinc
// (mode-controlled); these are low-alpha tints that give the canvas "ฟุ้ง".
const SCENES: GlowScene[] = ['home', 'palette', 'picker']

const sceneColors = computed<Record<GlowScene, [string, string, string]>>(() => {
  const d = dark.value
  return {
    home: d
      ? ['rgba(124, 58, 237, 0.20)', 'rgba(14, 165, 233, 0.15)', 'rgba(16, 185, 129, 0.12)']
      : ['rgba(251, 146, 60, 0.19)', 'rgba(99, 102, 241, 0.13)', 'rgba(20, 184, 166, 0.12)'],
    palette: d
      ? ['rgba(59, 130, 246, 0.22)', 'rgba(99, 102, 241, 0.17)', 'rgba(6, 182, 212, 0.13)']
      : ['rgba(59, 130, 246, 0.17)', 'rgba(99, 102, 241, 0.13)', 'rgba(6, 182, 212, 0.11)'],
    picker: d
      ? ['rgba(217, 70, 239, 0.17)', 'rgba(99, 102, 241, 0.15)', 'rgba(20, 184, 166, 0.12)']
      : ['rgba(217, 70, 239, 0.12)', 'rgba(99, 102, 241, 0.13)', 'rgba(20, 184, 166, 0.11)'],
  }
})

// Blob geometry (index 0..2): top-left, right-mid, bottom-center.
const BLOBS = [
  { top: '-16rem', left: '-14rem', size: '52rem' },
  { top: '14%', right: '-18rem', size: '56rem' },
  { bottom: '-20rem', left: '20%', size: '60rem' },
]

function blobStyle(sceneName: GlowScene, i: number) {
  const c = sceneColors.value[sceneName][i]
  const b = BLOBS[i]
  return {
    ...b,
    background: `radial-gradient(circle, ${c} 0%, transparent 65%)`,
  }
}

// Picker: tint the glow with the selected palette's own colors.
const tintStyle = computed(() => {
  if (!tint.value) return null
  const [a, b] = tint.value
  const alpha = dark.value ? 0.20 : 0.14
  return {
    background: `radial-gradient(56rem at 78% 18%, ${hexToRgba(a, alpha)} 0%, transparent 62%), radial-gradient(50rem at 25% 82%, ${hexToRgba(b, alpha)} 0%, transparent 62%)`,
  }
})
</script>

<template>
  <div id="ambient-glow" aria-hidden="true" class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <!-- One stack of blobs per scene; the active scene fades in, others out -->
    <template v-for="sc in SCENES" :key="sc">
      <div
        v-for="(_, i) in 3"
        :key="i"
        class="glow-blob"
        :class="scene === sc ? 'glow-on' : 'glow-off'"
        :style="blobStyle(sc, i)"
      ></div>
    </template>

    <!-- Selected-palette tint (crossfades on palette change) -->
    <Transition name="glow-fade">
      <div v-if="tintStyle" :key="tint ? tint.join('') : 'none'" class="absolute inset-0" :style="tintStyle"></div>
    </Transition>
  </div>
</template>
