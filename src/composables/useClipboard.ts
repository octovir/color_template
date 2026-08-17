import { useToast } from './useToast'

export function useClipboard() {
  const { showToast } = useToast()

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
      showToast(`COPIED ${hex}`)
    } catch {
      showToast('COPY FAILED')
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      showToast(label)
    } catch {
      showToast('COPY FAILED')
    }
  }

  return { copy, copyText }
}
