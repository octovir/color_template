<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ColorLibrary, PalettePreset, TabId } from './types'
import { getColorLibrary, getPalettePresets } from './services/api'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import MobileTabBar from './components/MobileTabBar.vue'
import OverviewView from './views/OverviewView.vue'
import FullPaletteView from './views/FullPaletteView.vue'
import PalettePickerView from './views/PalettePickerView.vue'
import BackTop from './components/BackTop.vue'
import Toast from './components/Toast.vue'
import ClipboardTray from './components/ClipboardTray.vue'

const TAB_KEY = 'ct-tab'

// Restore the last visited tab (falls back to home).
function initialTab(): TabId {
  try {
    const t = localStorage.getItem(TAB_KEY)
    if (t === 'home' || t === 'palette' || t === 'picker') return t
  } catch {
    /* ignore */
  }
  return 'home'
}

const activeTab = ref<TabId>(initialTab())
const loaded = ref(false)
const library = ref<ColorLibrary>({ categories: [], chartColors: [], aliases: {} })
const presets = ref<PalettePreset[]>([])
// Query passed from the Overview search into the Full Palette search box.
const presetQuery = ref<string | null>(null)

function switchTab(tab: TabId) {
  activeTab.value = tab
  try {
    localStorage.setItem(TAB_KEY, tab)
  } catch {
    /* ignore */
  }
}

function focusSearch() {
  switchTab('palette')
  setTimeout(() => {
    const el = document.getElementById('palette-search') as HTMLInputElement | null
    if (el) {
      el.focus()
      el.select()
    }
  }, 60)
}

// Overview search box → jump to the palette tab with the query applied.
function searchLibrary(query: string) {
  presetQuery.value = query
  switchTab('palette')
}

// ⌘K / Ctrl+K — jump to the color search
function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault()
    focusSearch()
  }
}

// Sticky sub-nav offset: track the real header height (mobile top bar only; 0 on desktop)
function syncNavHeight() {
  const h = document.querySelector('header')
  if (h) document.documentElement.style.setProperty('--nav-h', h.offsetHeight + 'px')
  else document.documentElement.style.setProperty('--nav-h', '0px')
}
let navResizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize() {
  if (navResizeTimer) clearTimeout(navResizeTimer)
  navResizeTimer = setTimeout(syncNavHeight, 150)
}

onMounted(async () => {
  try {
    const [lib, pres] = await Promise.all([getColorLibrary(), getPalettePresets()])
    library.value = lib
    presets.value = pres
  } finally {
    loaded.value = true
  }
  syncNavHeight()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
  window.addEventListener('load', syncNavHeight)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncNavHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('load', syncNavHeight)
  if (navResizeTimer) clearTimeout(navResizeTimer)
})
</script>

<template>
  <div class="lg:flex">
    <AppSidebar :active-tab="activeTab" @switch-tab="switchTab" @focus-search="focusSearch" />

    <div class="flex-1 min-w-0">
      <AppHeader @switch-tab="switchTab" @focus-search="focusSearch" />

      <main class="max-w-[1200px] mx-auto px-4 sm:px-8 pt-6 lg:pt-10 pb-28 lg:pb-14">
        <template v-if="loaded">
          <OverviewView
            v-show="activeTab === 'home'"
            :library="library"
            :presets="presets"
            @navigate="switchTab"
            @search="searchLibrary"
          />
          <FullPaletteView
            v-show="activeTab === 'palette'"
            :library="library"
            :active="activeTab === 'palette'"
            :preset-query="presetQuery"
          />
          <PalettePickerView v-show="activeTab === 'picker'" :presets="presets" />
        </template>
      </main>

      <footer class="max-w-[1200px] mx-auto px-4 sm:px-8 pb-10 lg:pb-8">
        <div
          class="border-t border-[#E4E4E7] pt-5 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2.5"
        >
          <p class="text-[12px] font-medium text-[#71717A]">
            Color System · 245 colors · 22 families · 46 palettes · 15 site types
          </p>
          <p class="text-[12px] text-[#A1A1AA]">Click any swatch to copy · Built with Tailwind CSS &amp; Lucide</p>
        </div>
      </footer>
    </div>
  </div>

  <MobileTabBar :active-tab="activeTab" @switch-tab="switchTab" />
  <ClipboardTray />
  <BackTop />
  <Toast />
</template>
