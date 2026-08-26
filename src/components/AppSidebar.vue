<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import type { TabId } from '../types'
import { Home, Moon, Palette, Search, Sun, Wand2, type LucideIcon } from 'lucide-vue-next'

defineProps<{ activeTab: TabId }>()
const emit = defineEmits<{ 'switch-tab': [tab: TabId]; 'focus-search': [] }>()

const { dark, toggleTheme } = useTheme()

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Overview', icon: Home },
  { id: 'palette', label: 'Full Palette', icon: Palette },
  { id: 'picker', label: 'Palette Picker', icon: Wand2 },
]
</script>

<template>
  <aside
    class="hidden lg:flex flex-col sticky top-0 h-screen w-[248px] shrink-0 border-r border-[#E4E4E7] bg-white/60 backdrop-blur-xl"
  >
    <!-- Brand -->
    <a
      href="#"
      @click.prevent="emit('switch-tab', 'home')"
      class="flex items-center gap-2.5 px-6 pt-6 pb-5 group"
      title="Back to overview"
    >
      <div
        class="w-8 h-8 rounded-lg bg-[#18181B] text-[#FAFAFA] flex items-center justify-center transition-transform duration-150 group-active:scale-95"
      >
        <Palette class="w-4 h-4" />
      </div>
      <span class="text-[15px] font-semibold tracking-tight text-[#18181B]">Color System</span>
    </a>

    <!-- Search -->
    <div class="px-4">
      <button
        @click="emit('focus-search')"
        class="w-full h-9 px-3 flex items-center justify-between gap-2 rounded-lg bg-[#F4F4F5] text-[12px] text-[#A1A1AA] hover:text-[#52525B] hover:bg-[#E4E4E7] transition-colors"
      >
        <span class="flex items-center gap-2">
          <Search class="w-3.5 h-3.5" />
          Search colors
        </span>
        <kbd
          class="hidden sm:inline-flex items-center px-1.5 h-5 rounded border border-[#E4E4E7] bg-white text-[9px] font-semibold text-[#A1A1AA]"
        >
          ⌘K
        </kbd>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto nav-scroll">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="emit('switch-tab', t.id)"
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors"
        :class="
          activeTab === t.id
            ? 'bg-[#F4F4F5] text-[#18181B] font-semibold'
            : 'text-[#71717A] hover:bg-[#F4F4F5]/60 hover:text-[#18181B]'
        "
      >
        <component :is="t.icon" class="w-[17px] h-[17px] shrink-0" />
        {{ t.label }}
      </button>
    </nav>

    <!-- Theme -->
    <div class="px-4 pb-6 pt-4">
      <button
        @click="toggleTheme"
        class="w-full h-9 px-3 flex items-center gap-2.5 rounded-lg text-[13px] text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
      >
        <Sun v-if="dark" class="w-[17px] h-[17px]" />
        <Moon v-else class="w-[17px] h-[17px]" />
        {{ dark ? 'Light mode' : 'Dark mode' }}
      </button>
    </div>
  </aside>
</template>
