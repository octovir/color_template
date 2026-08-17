import { ref } from 'vue'

// Singleton dark-mode state (the anti-FOUC script in index.html already applied .dark
// before first paint, so this simply reads that initial state).
const dark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

export function useTheme() {
  function apply() {
    document.documentElement.classList.toggle('dark', dark.value)
    try {
      localStorage.setItem('ct-theme', dark.value ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }

  function toggleTheme() {
    dark.value = !dark.value
    apply()
  }

  return { dark, toggleTheme }
}
