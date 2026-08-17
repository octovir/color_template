<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PalettePreset } from '../types'
import { useClipboard } from '../composables/useClipboard'
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

onMounted(() => {
  if (props.presets.length) selectCat(props.presets[0].id)
})
</script>

<template>
  <div class="grid-cols-1 gap-8 fade-in">
    <div class="bg-white p-5 sm:p-8 rounded-2xl border border-[#E4E4E7] shadow-sm">
      <div class="mb-6 border-b border-[#F4F4F5] pb-4">
        <h2 class="text-lg font-bold text-[#09090B]">Palette Picker</h2>
        <p class="text-sm text-[#71717A] mt-1">
          Step 1 — pick what you're building. Step 2 — choose a hand-tuned palette. Step 3 — preview it live and copy
          the colors. All 46 palettes are curated for harmony and readable contrast — and every single color comes from
          the Full Palette library.
        </p>
      </div>

      <div class="mb-3 flex items-center justify-between">
        <div class="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">1 · What are you building?</div>
        <div class="text-[10px] font-semibold text-[#A1A1AA]">{{ presets.length }} site types</div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <div
          v-for="c in presets"
          :key="c.id"
          @click="selectCat(c.id)"
          class="cursor-pointer rounded-xl p-[1.5px] transition-all duration-200"
          :class="
            activeCatId === c.id
              ? 'bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#10B981] shadow-[0_8px_24px_rgba(124,58,237,0.3)] select-pop'
              : 'hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(9,9,11,0.08)]'
          "
        >
          <div class="relative rounded-[10px] bg-white p-3.5 h-full" :class="activeCatId === c.id ? 'border-transparent' : 'border border-[#E4E4E7]'">
            <div
              v-if="activeCatId === c.id"
              class="pop-in absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#10B981] flex items-center justify-center shadow-md"
            >
              <Check class="w-3 h-3 text-white" />
            </div>
            <div class="flex items-center gap-2.5 mb-2 flex-wrap">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :class="activeCatId === c.id ? 'bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#10B981]' : 'bg-[#F4F4F5] border border-[#E4E4E7]'"
              >
                <component :is="icon(c.icon)" class="w-4 h-4" :class="activeCatId === c.id ? 'text-white' : 'text-[#52525B]'" />
              </div>
              <h4 class="text-[12px] font-bold text-[#09090B] leading-tight">{{ c.name }}</h4>
            </div>
            <p class="text-[10px] text-[#71717A] leading-relaxed line-clamp-2">{{ c.desc }}</p>
            <div class="mt-2.5 pt-2 border-t border-[#F4F4F5] flex items-center justify-between">
              <span class="text-[9px] font-bold uppercase tracking-wide" :class="activeCatId === c.id ? 'text-[#7C3AED]' : 'text-[#A1A1AA]'">
                {{ c.palettes.length }} palettes
              </span>
              <span v-if="activeCatId === c.id" class="text-[9px] font-bold text-[#0D9488]">Selected</span>
            </div>
          </div>
        </div>
      </div>

      <template v-if="activePreset">
        <div class="mb-3 flex items-center justify-between">
          <div class="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">2 · Choose a palette</div>
          <div class="text-[10px] font-semibold text-[#A1A1AA]">{{ activePreset.palettes.length }} palettes</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <div
            v-for="(p, i) in activePreset.palettes"
            :key="p.name"
            @click="selectPalette(activePreset.id, i)"
            class="pal-card card-in cursor-pointer rounded-xl p-[1.5px] transition-all duration-200"
            :style="{ animationDelay: i * 45 + 'ms' }"
            :class="
              activeIdx === i
                ? 'bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#10B981] shadow-[0_8px_24px_rgba(124,58,237,0.3)] select-pop'
                : 'hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(9,9,11,0.08)]'
            "
          >
            <div class="pal-inner relative rounded-[10px] bg-white p-4 h-full" :class="activeIdx === i ? 'border-transparent' : 'border border-[#E4E4E7]'">
              <div
                v-if="activeIdx === i"
                class="pal-check pop-in absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#10B981] flex items-center justify-center shadow-md"
              >
                <Check class="w-3 h-3 text-white" />
              </div>
              <div class="flex items-center justify-between mb-2.5">
                <h4 class="text-[13px] font-bold text-[#09090B]">{{ p.name }}</h4>
                <span class="text-[9px] font-bold text-[#71717A] uppercase tracking-wide">{{ p.colors.length }} colors</span>
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
                  class="text-[10px] font-bold text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] px-2.5 py-1.5 rounded-md hover:bg-[#CCFBF1] transition-colors"
                >
                  Copy CSS variables
                </button>
                <span class="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wide">Tap to preview</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-2 text-[10px] font-bold text-[#71717A] uppercase tracking-wider">3 · Preview &amp; copy</div>
        <div v-if="activePalette" class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-[13px] font-bold text-[#09090B]">Live preview</h4>
              <span class="text-[10px] font-bold text-[#71717A]">How this palette feels on a typical page</span>
            </div>
            <PreviewMockup :palette="activePalette" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-[13px] font-bold text-[#09090B]">{{ activePalette.name }}</h4>
              <button
                @click="copyCssVars()"
                class="text-[10px] font-bold text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] px-2.5 py-1.5 rounded-md hover:bg-[#CCFBF1] transition-colors"
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
                class="cursor-pointer flex items-center gap-3 p-2.5 rounded-lg border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-colors"
                title="Click to copy"
              >
                <div class="w-7 h-7 rounded-md border border-black/5 shrink-0" :style="{ background: hex }"></div>
                <span class="text-[11px] font-bold text-[#27272A] w-24">{{ role }}</span>
                <span class="text-[10px] font-mono text-[#71717A]">{{ hex }}</span>
                <span class="ml-auto text-[9px] font-bold text-[#A1A1AA]">COPY</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
