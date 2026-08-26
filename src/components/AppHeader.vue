<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import type { TabId } from '../types'
import { Moon, Palette, Search, Sun } from 'lucide-vue-next'

defineProps<{ activeTab: TabId }>()
const emit = defineEmits<{ 'switch-tab': [tab: TabId]; 'focus-search': [] }>()

const { dark, toggleTheme } = useTheme()

const tabs: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Overview' },
  { id: 'palette', label: 'Full Palette' },
  { id: 'picker', label: 'Palette Picker' },
]
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="border-b border-[#E4E4E7]/80 bg-white/70 backdrop-blur-xl">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div class="flex items-center justify-between gap-4 h-14 sm:h-16">
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

          <!-- Desktop nav -->
          <nav class="hidden sm:flex items-stretch h-full gap-1">
            <button
              v-for="t in tabs"
              :key="t.id"
              @click="emit('switch-tab', t.id)"
              class="relative flex items-center px-3.5 text-[13px] font-medium transition-colors"
              :class="
                activeTab === t.id
                  ? 'text-[#18181B] after:absolute after:inset-x-3.5 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#18181B]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              "
            >
              {{ t.label }}
            </button>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              @click="emit('focus-search')"
              title="Search colors (⌘K)"
              class="w-9 h-9 rounded-full text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B] flex items-center justify-center transition-colors"
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

        <!-- Mobile nav row -->
        <nav class="sm:hidden flex gap-1 overflow-x-auto nav-scroll border-t border-[#E4E4E7]/60">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="emit('switch-tab', t.id)"
            class="relative px-3.5 py-3 text-[13px] font-medium whitespace-nowrap transition-colors"
            :class="
              activeTab === t.id
                ? 'text-[#18181B] after:absolute after:inset-x-3.5 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#18181B]'
                : 'text-[#71717A] hover:text-[#18181B]'
            "
          >
            {{ t.label }}
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>
