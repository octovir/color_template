<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ColorRole, PalettePreset } from '../types'
import { useClipboard } from '../composables/useClipboard'
import { contrastRatio, wcagLevel } from '../lib/color'
import { icon } from '../lib/icons'
import PreviewMockup from '../components/PreviewMockup.vue'
import { Check } from 'lucide-vue-next'

const props = defineProps<{ presets: PalettePreset[] }>()
const { copy, copyText } = useClipboard()

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

function copyCssVars(catId?: string, idx?: number) {
  const preset = props.presets.find((c) => c.id === (catId ?? activeCatId.value))
  const palette = preset?.palettes[idx ?? activeIdx.value]
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
</script>

<template>
  <div class="fade-in">
    <!-- Page header -->
    <div class="pb-6 border-b border-[#E4E4E7]">
      <h2 class="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181B]">Palette picker</h2>
      <p class="text-[13px] sm:text-[14px] text-[#71717A] mt-1.5 max-w-2xl leading-relaxed">
        Three steps: pick what you're building, choose a hand-tuned palette, preview it live with a contrast check,
        and copy the colors. All 46 palettes are curated for harmony and readable contrast — every color comes from
        the Full Palette library.
      </p>
    </div>

    <!-- Step 1 — site types -->
    <div class="mt-8 mb-3 flex items-baseline justify-between">
      <h3 class="text-[13px] font-semibold text-[#18181B]">Step 1 — What are you building?</h3>
      <span class="text-[11px] text-[#A1A1AA]">{{ presets.length }} site types</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
      <div
        v-for="c in presets"
        :key="c.id"
        role="button"
        tabindex="0"
        @click="selectCat(c.id)"
        @keydown.enter.prevent="selectCat(c.id)"
        class="relative cursor-pointer rounded-xl border bg-white p-3.5 sm:p-4 transition-all duration-150 touch-manipulation active:scale-[0.98] select-pop"
        :class="
          activeCatId === c.id
            ? 'border-[#18181B] ring-2 ring-[#18181B]/15'
            : 'border-[#E4E4E7] hover:border-[#D4D4D8] hover:shadow-sm'
        "
      >
        <div
          v-if="activeCatId === c.id"
          class="pop-in absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#18181B] text-[#FAFAFA] flex items-center justify-center shadow-sm"
        >
          <Check class="w-3 h-3" />
        </div>
        <div class="flex items-center gap-2.5 mb-2 flex-wrap">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            :class="activeCatId === c.id ? 'bg-[#18181B] text-[#FAFAFA]' : 'bg-[#F4F4F5] text-[#52525B]'"
          >
            <component :is="icon(c.icon)" class="w-4 h-4" />
          </div>
          <h4 class="text-[12px] font-semibold text-[#18181B] leading-tight">{{ c.name }}</h4>
        </div>
        <p class="text-[10px] text-[#71717A] leading-relaxed line-clamp-2">{{ c.desc }}</p>
        <div class="mt-2.5 pt-2 border-t border-[#F4F4F5] text-[10px] font-medium text-[#A1A1AA]">
          {{ c.palettes.length }} palettes
        </div>
      </div>
    </div>

    <!-- Step 2 — palettes -->
    <template v-if="activePreset">
      <div class="mb-3 flex items-baseline justify-between">
        <h3 class="text-[13px] font-semibold text-[#18181B]">Step 2 — Choose a palette</h3>
        <span class="text-[11px] text-[#A1A1AA]">{{ activePreset.palettes.length }} palettes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        <div
          v-for="(p, i) in activePreset.palettes"
          :key="p.name"
          role="button"
          tabindex="0"
          @click="selectPalette(activePreset.id, i)"
          @keydown.enter.prevent="selectPalette(activePreset.id, i)"
          class="pal-card relative cursor-pointer rounded-xl border bg-white p-4 transition-all duration-150 touch-manipulation active:scale-[0.98] select-pop"
          :class="
            activeIdx === i
              ? 'border-[#18181B] ring-2 ring-[#18181B]/15'
              : 'border-[#E4E4E7] hover:border-[#D4D4D8] hover:shadow-sm'
          "
        >
          <div
            v-if="activeIdx === i"
            class="pal-check pop-in absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#18181B] text-[#FAFAFA] flex items-center justify-center shadow-sm"
          >
            <Check class="w-3 h-3" />
          </div>
          <div class="flex items-center justify-between mb-2.5 gap-2">
            <h4 class="text-[13px] font-semibold text-[#18181B]">{{ p.name }}</h4>
            <span class="text-[10px] font-medium text-[#A1A1AA] whitespace-nowrap">{{ p.colors.length }} colors</span>
          </div>
          <div class="flex gap-1.5 mb-2.5">
            <div
              v-for="[role, hex] in p.colors"
              :key="role"
              class="flex-1 h-10 rounded-md border border-black/5"
              :style="{ background: hex }"
              :title="`${role} ${hex}`"
            ></div>
          </div>
          <p class="text-[11px] text-[#71717A] leading-relaxed mb-3">{{ p.desc }}</p>
          <div class="flex items-center justify-between pt-2.5 border-t border-[#F4F4F5]">
            <button
              @click.stop="copyCssVars(activePreset.id, i)"
              class="text-[10px] font-semibold text-[#52525B] px-2.5 py-1.5 rounded-md border border-[#E4E4E7] hover:text-[#18181B] hover:border-[#D4D4D8] hover:bg-[#F4F4F5] transition-colors"
            >
              Copy CSS variables
            </button>
            <span class="text-[10px] font-medium text-[#A1A1AA]">Click to preview</span>
          </div>
        </div>
      </div>

      <!-- Step 3 — preview & copy -->
      <div class="mb-3 flex items-baseline justify-between">
        <h3 class="text-[13px] font-semibold text-[#18181B]">Step 3 — Preview &amp; copy</h3>
      </div>
      <div v-if="activePalette" class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
        <div>
          <div class="flex items-baseline justify-between mb-3">
            <h4 class="text-[13px] font-semibold text-[#18181B]">Live preview</h4>
            <span class="text-[10px] text-[#A1A1AA]">How this palette feels on a typical page</span>
          </div>
          <PreviewMockup :palette="activePalette" />
        </div>
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <h4 class="text-[13px] font-semibold text-[#18181B]">{{ activePalette.name }}</h4>
            <button
              @click="copyCssVars()"
              class="text-[10px] font-semibold text-[#52525B] px-2.5 py-1.5 rounded-md border border-[#E4E4E7] hover:text-[#18181B] hover:border-[#D4D4D8] hover:bg-[#F4F4F5] transition-colors"
            >
              Copy CSS variables
            </button>
          </div>
          <p class="text-[11px] text-[#71717A] leading-relaxed mb-3">{{ activePalette.desc }}</p>
          <div class="space-y-2">
            <div
              v-for="[role, hex] in activePalette.colors"
              :key="role"
              @click="copy(hex)"
              class="cursor-pointer flex items-center gap-3 p-2.5 rounded-lg border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-colors touch-manipulation"
              title="Click to copy"
            >
              <div class="w-7 h-7 rounded-md border border-black/5 shrink-0" :style="{ background: hex }"></div>
              <span class="text-[11px] font-medium text-[#27272A] w-24">{{ role }}</span>
              <span class="text-[10px] font-mono text-[#71717A]">{{ hex }}</span>
              <span class="ml-auto text-[9px] font-semibold text-[#A1A1AA]">COPY</span>
            </div>
          </div>

          <!-- Contrast check -->
          <div class="mt-5">
            <div class="flex items-baseline justify-between mb-2.5">
              <h4 class="text-[12px] font-semibold text-[#18181B]">Contrast check</h4>
              <span class="text-[10px] text-[#A1A1AA]">WCAG AA · normal text needs 4.5:1</span>
            </div>
            <div class="space-y-1.5">
              <div
                v-for="row in contrastRows"
                :key="row.label"
                class="flex items-center gap-3 px-2.5 py-2 rounded-lg border border-[#E4E4E7]"
              >
                <div class="w-5 h-5 rounded-md border border-black/5 shrink-0" :style="{ background: row.fg }"></div>
                <span class="text-[11px] font-medium text-[#18181B] w-32 sm:w-44">{{ row.label }}</span>
                <span class="text-[11px] font-mono text-[#71717A] tabular-nums">{{ row.ratio.toFixed(1) }}:1</span>
                <span
                  class="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded"
                  :class="
                    row.level
                      ? 'bg-[#18181B] text-[#FAFAFA]'
                      : 'bg-[#F4F4F5] text-[#A1A1AA]'
                  "
                >
                  {{ row.level ?? 'below AA' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
