import { ref } from 'vue'
import { useToast } from './useToast'

// Shared clipboard history — module-level singleton so every copy from anywhere
// (swatches, palettes, preview rows) lands in the same tray.
export interface HistoryItem {
  id: number
  hex: string
  label: string
}

const history = ref<HistoryItem[]>([])
let nextId = 1

export function useClipboard() {
  const { showToast } = useToast()

  async function copy(hex: string, label?: string) {
    try {
      await navigator.clipboard.writeText(hex)
      pushHistory(hex, label ?? hex)
      showToast(`COPIED ${hex}`)
    } catch {
      showToast('COPY FAILED')
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      if (/^#?[0-9a-fA-F]{6}$/.test(text.trim())) pushHistory(text.trim(), text.trim())
      showToast(label)
    } catch {
      showToast('COPY FAILED')
    }
  }

  function pushHistory(text: string, label: string) {
    history.value = [{ id: nextId++, hex: text, label }, ...history.value].slice(0, 6)
  }

  function removeHistory(id: number) {
    history.value = history.value.filter((h) => h.id !== id)
  }

  function clearHistory() {
    history.value = []
  }

  return { copy, copyText, history, removeHistory, clearHistory }
}
