<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ColorRole, PalettePreset } from '../types'
import { useClipboard } from '../composables/useClipboard'
import { useAmbient } from '../composables/useAmbient'
import { contrastRatio, wcagLevel } from '../lib/color'
import { icon } from '../lib/icons'
import PreviewMockup from '../components/PreviewMockup.vue'
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps<{ presets: PalettePreset[] }>()
const { copy, copyText } = useClipboard()
const { setTint } = useAmbient()

const activeCatId = ref<string | null>(null)
const activeIdx = ref(0)

const activePreset = computed(() => props.presets.find((c) => c.id === activeCatId.value) ?? null)
const activePalette = computed(() => activePreset.value?.palettes[activeIdx.value] ?? null)

function selectCat(id: string) {
  activeCatId.value = id
  activeIdx.value = 0
}

function selectPalette(catId: string, idx: number) {
  activeCatId.value = catId
  activeIdx.value = idx
}

function copyCssVars() {
  const preset = activePreset.value
  const palette = activePalette.value
  if (!preset || !palette) return
  const lines = palette.colors.map(([role, hex]) => `  --${role.toLowerCase()}: ${hex};`).join('\n')
  copyText(`:root {\n${lines}\n}`, 'COPIED CSS VARIABLES')
}

// WCAG contrast check for the selected palette's key text/background pairs.
interface ContrastRow {
  label: string
  fg: string
  ratio: number
  level: 'AAA' | 'AA' | null
}

const contrastRows = computed<ContrastRow[]>(() => {
  const p = activePalette.value
  if (!p) return []
  const m = new Map<ColorRole, string>()
  for (const [role, hex] of p.colors) m.set(role, hex)
  const pairs: { label: string; fg: ColorRole; bg: ColorRole }[] = [
    { label: 'Text on background', fg: 'Text', bg: 'Background' },
    { label: 'Text on surface', fg: 'Text', bg: 'Surface' },
    { label: 'Secondary on background', fg: 'Secondary', bg: 'Background' },
    { label: 'Accent on background', fg: 'Accent', bg: 'Background' },
  ]
  return pairs
    .filter((p) => m.has(p.fg) && m.has(p.bg) && m.get(p.fg) !== m.get(p.bg))
    .map((p) => {
      const fg = m.get(p.fg)!
      const ratio = contrastRatio(fg, m.get(p.bg)!)
      return { label: p.label, fg, ratio, level: wcagLevel(ratio) }
    })
})

onMounted(() => {
  if (props.presets.length) selectCat(props.presets[0].id)
})

// Tint the ambient background with the selected palette's own colors.
watch(activePalette, (p) => {
  if (!p) {
    setTint(null)
    return
  }
  const m = new Map(p.colors)
  const primary = m.get('Primary')
  const accent = m.get('Accent')
  const bg = m.get('Background')
  if (primary && accent) setTint([primary, accent])
  else if (primary && bg) setTint([primary, bg])
  else setTint(null)
})
</script>

<template>
  <div class="fade-in">
    <!-- Page header -->
    <div class="pb-6 border-b border-[#E4E4E7]">
      <h2 class="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181B]">Palette picker</h2>
      <p class="text-[13px] sm:text-[14px] text-[#71717A] mt-1.5 max-w-2xl leading-relaxed">
        Choose a site type, pick a hand-tuned palette, and preview it live with a contrast check — then copy the
        colors. Every palette is curated for harmony and readable contrast.
      </p>
    </div>

    <!-- Site-type selector — segmented chips, same language as the navbar -->
    <div class="glass-track mt-6 w-fit max-w-full rounded-full p-1.5 flex gap-1 overflow-x-auto nav-scroll">
      <button
        v-for="c in presets"
        :key="c.id"
        @click="selectCat(c.id)"
        class="shrink-0 flex items-center gap-2 pl-3 pr-3.5 h-9 rounded-full text-[12px] font-medium transition-all touch-manipulation"
        :class="
          activeCatId === c.id
            ? 'bg-white shadow-sm text-[#18181B] font-semibold'
            : 'text-[#71717A] hover:text-[#18181B]'
        "
      >
        <component
          :is="icon(c.icon)"
          class="w-3.5 h-3.5"
          :class="activeCatId === c.id ? '' : 'text-[#A1A1AA]'"
        />
        {{ c.name }}
      </button>
    </div>

    <!-- Content: palette cards + sticky preview -->
    <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 lg:items-start mt-8">
      <!-- Palettes -->
      <div v-if="activePreset" class="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div
          v-for="(p, i) in activePreset.palettes"
          :key="p.name"
          role="button"
          tabindex="0"
          @click="selectPalette(activePreset.id, i)"
          @keydown.enter.prevent="selectPalette(activePreset.id, i)"
          class="pal-card relative cursor-pointer glass rounded-2xl p-4 transition-all duration-150 touch-manipulation active:scale-[0.98] select-pop"
          :class="activeIdx === i ? 'border-[#18181B] ring-2 ring-[#18181B]/15' : 'hover:shadow-md'"
        >
          <div
            v-if="activeIdx === i"
            class="pal-check pop-in absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#18181B] text-[#FAFAFA] flex items-center justify-center shadow-sm"
          >
            <Check class="w-3 h-3" />
          </div>
          <div class="flex items-baseline justify-between gap-2 mb-3">
            <h4 class="text-[13px] font-semibold text-[#18181B]">{{ p.name }}</h4>
            <span class="text-[10px] font-medium text-[#A1A1AA] tabular-nums">{{ p.colors.length }} colors</span>
          </div>
          <div class="flex h-10 rounded-lg overflow-hidden border border-black/5 mb-3">
            <div
              v-for="[role, hex] in p.colors"
              :key="role"
              class="flex-1"
              :style="{ background: hex }"
              :title="`${role} ${hex}`"
            ></div>
          </div>
          <p class="text-[11px] text-[#71717A] leading-relaxed line-clamp-2">{{ p.desc }}</p>
        </div>
      </div>

      <!-- Sticky preview -->
      <div
        v-if="activePalette"
        class="mt-8 lg:mt-0 lg:sticky lg:top-[calc(var(--nav-h,0px)_+_16px)] lg:max-h-[calc(100vh_-_var(--nav-h,0px)_-_2rem)] lg:overflow-y-auto"
      >
        <div class="glass-strong rounded-2xl p-4 fade-in">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h4 class="text-[14px] font-semibold text-[#18181B]">{{ activePalette.name }}</h4>
            <button
              @click="copyCssVars()"
              class="h-8 px-3.5 rounded-full bg-[#18181B] text-[#FAFAFA] text-[11px] font-semibold hover:bg-[#27272A] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0"
            >
              <Copy class="w-3 h-3" />
              Copy CSS
            </button>
          </div>
          <p class="text-[11px] text-[#71717A] leading-relaxed mb-3.5">{{ activePalette.desc }}</p>

          <PreviewMockup :key="activePalette.name" :palette="activePalette" class="fade-in" />

          <!-- Colors -->
          <div class="mt-3.5">
            <div class="flex items-baseline justify-between mb-1">
              <h4 class="text-[12px] font-semibold text-[#18181B]">Colors</h4>
              <span class="text-[10px] text-[#A1A1AA]">Click to copy</span>
            </div>
            <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <div
                v-for="[role, hex] in activePalette.colors"
                :key="role"
                @click="copy(hex)"
                class="cursor-pointer flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-[#F4F4F5] transition-colors touch-manipulation min-w-0"
                :title="`Copy ${role} ${hex}`"
              >
                <div class="w-5 h-5 rounded-md border border-black/5 shrink-0" :style="{ background: hex }"></div>
                <span class="text-[10px] font-medium text-[#27272A] truncate min-w-0 flex-1">{{ role }}</span>
                <span class="text-[9px] font-mono text-[#71717A] tabular-nums shrink-0">{{ hex }}</span>
              </div>
            </div>
          </div>

          <!-- Contrast check -->
          <div class="mt-3.5 pt-3 border-t border-[#F4F4F5]">
            <div class="flex items-baseline justify-between mb-1.5">
              <h4 class="text-[12px] font-semibold text-[#18181B]">Contrast check</h4>
              <span class="text-[10px] text-[#A1A1AA]">WCAG AA · 4.5:1</span>
            </div>
            <div class="space-y-1">
              <div
                v-for="row in contrastRows"
                :key="row.label"
                class="flex items-center gap-2 px-2 py-1.5 rounded-md border border-[#E4E4E7]"
              >
                <div class="w-4 h-4 rounded border border-black/5 shrink-0" :style="{ background: row.fg }"></div>
                <span class="text-[10px] font-medium text-[#18181B] truncate min-w-0 flex-1">{{ row.label }}</span>
                <span class="text-[10px] font-mono text-[#71717A] tabular-nums shrink-0">{{ row.ratio.toFixed(1) }}:1</span>
                <span
                  class="text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                  :class="row.level ? 'bg-[#18181B] text-[#FAFAFA]' : 'bg-[#F4F4F5] text-[#A1A1AA]'"
                >
                  {{ row.level ?? 'below AA' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
