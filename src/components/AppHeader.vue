<script setup lang="ts">
import { computed } from 'vue'
import type { TabId } from '../types'
import { useTheme } from '../composables/useTheme'
import { Home, Palette, Wand2, Moon, Sun, Search, type LucideIcon } from 'lucide-vue-next'

const props = defineProps<{ activeTab: TabId }>()
const emit = defineEmits<{ 'switch-tab': [tab: TabId]; 'focus-search': [] }>()

const { dark, toggleTheme } = useTheme()

interface TabDef {
  id: TabId
  label: string
  title: string
  icon: LucideIcon
  indicator: string
}

const tabs: TabDef[] = [
  { id: 'home', label: 'Overview', title: 'OVERVIEW', icon: Home, indicator: 'bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.6)]' },
  { id: 'palette', label: 'Full Palette', title: 'FULL PALETTE', icon: Palette, indicator: 'bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]' },
  { id: 'picker', label: 'Palette Picker', title: 'PALETTE PICKER', icon: Wand2, indicator: 'bg-[#0D9488] shadow-[0_0_8px_rgba(13,148,136,0.6)]' },
]

const active = computed(() => tabs.find((t) => t.id === props.activeTab)!)
</script>

<template>
  <header class="sticky top-0 z-50 px-4 lg:px-8">
    <div
      class="max-w-[1400px] mx-auto mt-3 rounded-2xl border border-[#E4E4E7]/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:flex-nowrap"
    >
      <!-- Brand -->
      <a href="#" @click.prevent="emit('switch-tab', 'home')" class="flex items-center gap-2.5 min-w-0 group">
        <div
          class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#10B981] gradient-animate shadow-[0_4px_14px_rgba(79,70,229,0.35)] flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        >
          <Palette class="w-4 h-4 text-white" />
        </div>
        <div class="leading-tight">
          <div class="flex items-center gap-2">
            <span class="text-[15px] font-extrabold tracking-tight text-[#09090B] whitespace-nowrap">Color System</span>
            <span class="w-2 h-2 rounded-full" :class="active.indicator"></span>
          </div>
          <span class="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#71717A]">{{ active.title }}</span>
        </div>
      </a>

      <!-- Nav (segmented pills) -->
      <nav
        class="nav-scroll flex items-center gap-0.5 sm:gap-1 p-1 bg-[#F1F1F3]/70 border border-[#E4E4E7]/60 rounded-full order-3 sm:order-none basis-full sm:basis-auto justify-center sm:justify-start overflow-x-auto"
      >
        <button
          v-for="t in tabs"
          :key="t.id"
          :id="'tab-' + t.id"
          @click="emit('switch-tab', t.id)"
          class="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold whitespace-nowrap transition-all duration-200"
          :class="activeTab === t.id ? 'tab-active' : 'tab-inactive'"
        >
          <component :is="t.icon" class="w-3.5 h-3.5 hidden sm:block" />
          {{ t.label }}
        </button>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="toggleTheme"
          title="Toggle dark mode"
          class="w-9 h-9 rounded-full border border-[#E4E4E7] bg-white/80 hover:bg-[#F4F4F5] text-[#52525B] flex items-center justify-center transition-colors"
        >
          <Sun v-if="dark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>
        <button
          @click="emit('focus-search')"
          title="Search the color library (⌘K)"
          class="w-9 h-9 rounded-full border border-[#E4E4E7] bg-white/80 hover:bg-[#F4F4F5] text-[#52525B] flex items-center justify-center transition-colors"
        >
          <Search class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>
