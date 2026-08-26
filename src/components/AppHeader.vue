<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import type { TabId } from '../types'
import { Moon, Palette, Search, Sun } from 'lucide-vue-next'

const emit = defineEmits<{ 'switch-tab': [tab: TabId]; 'focus-search': [] }>()

const { dark, toggleTheme } = useTheme()
</script>

<template>
  <header class="lg:hidden sticky top-0 z-40 px-4 sm:px-8 pt-3">
    <div
      class="max-w-[1280px] mx-auto rounded-2xl border border-[#E4E4E7] bg-white/85 backdrop-blur-xl shadow-[0_1px_2px_rgba(9,9,11,0.04)]"
    >
      <div class="flex items-center justify-between px-4 py-2.5">
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
    </div>
  </header>
</template>
