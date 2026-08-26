<script setup lang="ts">
import { useClipboard } from '../composables/useClipboard'
import { useToast } from '../composables/useToast'
import { Copy, Trash2 } from 'lucide-vue-next'

const { history, clearHistory } = useClipboard()
const { showToast } = useToast()

function copyHex(hex: string) {
  navigator.clipboard
    .writeText(hex)
    .then(() => showToast(`COPIED ${hex}`))
    .catch(() => showToast('COPY FAILED'))
}

function copyAll() {
  const text = history.value.map((h) => h.hex).join(', ')
  navigator.clipboard
    .writeText(text)
    .then(() => showToast(`COPIED ${history.value.length} COLORS`))
    .catch(() => showToast('COPY FAILED'))
}
</script>

<template>
  <Transition name="tray">
    <div
      v-if="history.length"
      class="glass-strong fixed z-40 inset-x-4 lg:inset-x-auto lg:right-6 w-auto lg:w-[264px] bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:bottom-24 rounded-2xl"
    >
      <div class="flex items-center justify-between px-3 py-2 border-b border-[#F4F4F5]">
        <span class="text-[11px] font-semibold text-[#18181B]">Recent copies</span>
        <div class="flex items-center gap-1.5">
          <button
            @click="copyAll"
            class="flex items-center gap-1 text-[10px] font-semibold text-[#71717A] px-1.5 py-1 rounded-md hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          >
            <Copy class="w-3 h-3" />
            Copy all
          </button>
          <button
            @click="clearHistory"
            title="Clear history"
            class="flex items-center gap-1 text-[10px] font-semibold text-[#71717A] px-1.5 py-1 rounded-md hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          >
            <Trash2 class="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>
      <div class="flex gap-1.5 p-2.5 overflow-x-auto nav-scroll">
        <button
          v-for="h in history"
          :key="h.id"
          @click="copyHex(h.hex)"
          :title="`${h.label} — click to copy again`"
          class="shrink-0 w-9 h-9 rounded-md border border-black/5 hover:brightness-110 active:brightness-125 transition-[filter]"
          :style="{ background: h.hex }"
        ></button>
      </div>
    </div>
  </Transition>
</template>
