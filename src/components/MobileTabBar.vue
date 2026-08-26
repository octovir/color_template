<script setup lang="ts">
import type { TabId } from '../types'
import { Home, Palette, Wand2, type LucideIcon } from 'lucide-vue-next'

defineProps<{ activeTab: TabId }>()
const emit = defineEmits<{ 'switch-tab': [tab: TabId] }>()

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'palette', label: 'Palette', icon: Palette },
  { id: 'picker', label: 'Picker', icon: Wand2 },
]
</script>

<template>
  <nav
    class="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[#E4E4E7] bg-white/90 backdrop-blur-xl"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Main"
  >
    <div class="flex">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="emit('switch-tab', t.id)"
        class="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors touch-manipulation"
        :class="activeTab === t.id ? 'text-[#18181B]' : 'text-[#A1A1AA] hover:text-[#71717A]'"
      >
        <component :is="t.icon" class="w-5 h-5" />
        {{ t.label }}
      </button>
    </div>
  </nav>
</template>
