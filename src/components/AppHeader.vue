<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useFocusGlow } from '../composables/useFocusGlow'
import type { TabId } from '../types'
import { Home, Moon, Palette, Search, Sun, Wand2, type LucideIcon } from 'lucide-vue-next'

defineProps<{ activeTab: TabId }>()
const emit = defineEmits<{ 'switch-tab': [tab: TabId]; 'focus-search': [] }>()

const { dark, toggleTheme } = useTheme()
const { glowPick, glowClear, haloStyle } = useFocusGlow()

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Overview', icon: Home },
  { id: 'palette', label: 'Full Palette', icon: Palette },
  { id: 'picker', label: 'Palette Picker', icon: Wand2 },
]
</script>

<template>
  <header class="sticky top-0 z-50 px-4 sm:px-8 pt-3 sm:pt-4">
    <div class="glass-strong max-w-[1200px] mx-auto rounded-2xl">
      <div class="flex items-center justify-between gap-3 px-3 sm:px-4 h-14 sm:h-16">
        <!-- Brand -->
        <a
          href="#"
          @click.prevent="emit('switch-tab', 'home')"
          class="flex items-center gap-2.5 min-w-0 group"
          title="Back to overview"
        >
          <div
            class="w-8 h-8 rounded-lg bg-[#18181B] text-[#FAFAFA] flex items-center justify-center transition-transform duration-150 group-active:scale-95"
          >
            <Palette class="w-4 h-4" />
          </div>
          <span class="text-[15px] font-semibold tracking-tight text-[#18181B] whitespace-nowrap">Color System</span>
        </a>

        <!-- Desktop segmented nav -->
        <nav class="hidden md:flex items-center gap-1 p-1 rounded-full glass-track">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="emit('switch-tab', t.id)"
            class="flex items-center gap-1.5 px-3.5 h-8 rounded-full text-[12px] font-medium transition-all"
            :class="
              activeTab === t.id
                ? 'bg-white shadow-sm text-[#18181B] font-semibold'
                : 'text-[#71717A] hover:text-[#18181B]'
            "
          >
            <component :is="t.icon" class="w-3.5 h-3.5" />
            {{ t.label }}
          </button>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-1 shrink-0">
          <div class="relative hidden sm:block">
            <span
              aria-hidden="true"
              class="absolute left-0 right-0 top-1/2 h-full -translate-y-1/2 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
              :style="haloStyle(0.5)"
            ></span>
            <button
              @click="emit('focus-search')"
              class="glass-field flex items-center gap-2 h-9 px-3 rounded-full w-44 focus:outline-none"
              @focus="glowPick"
              @blur="glowClear"
            >
            <Search class="w-3.5 h-3.5 shrink-0 text-[#A1A1AA]" />
            <span class="text-[12px] text-[#A1A1AA]">Search colors</span>
            <kbd
              class="ml-auto inline-flex items-center px-1.5 h-5 rounded border border-[#E4E4E7] bg-white text-[9px] font-semibold text-[#A1A1AA]"
            >
              ⌘K
            </kbd>
          </button>
          </div>
          <button
            @click="emit('focus-search')"
            title="Search colors (⌘K)"
            class="sm:hidden w-9 h-9 rounded-full text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B] flex items-center justify-center transition-colors"
          >
            <Search class="w-[18px] h-[18px]" />
          </button>
          <button
            @click="toggleTheme"
            :title="dark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="w-9 h-9 rounded-full text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B] flex items-center justify-center transition-colors"
          >
            <Sun v-if="dark" class="w-[18px] h-[18px]" />
            <Moon v-else class="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <!-- Mobile segmented nav -->
      <nav class="md:hidden flex gap-1 p-1 rounded-xl glass-track mx-3 mb-3">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="emit('switch-tab', t.id)"
          class="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-medium transition-all touch-manipulation"
          :class="
            activeTab === t.id
              ? 'bg-white shadow-sm text-[#18181B] font-semibold'
              : 'text-[#71717A] hover:text-[#18181B]'
          "
        >
          <component :is="t.icon" class="w-3.5 h-3.5" />
          {{ t.label }}
        </button>
      </nav>
    </div>
  </header>
</template>
