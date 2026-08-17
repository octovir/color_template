import { ref } from 'vue'

// Global toast singleton — showToast() from anywhere.
const message = ref('')
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function showToast(msg: string) {
    message.value = msg
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, 2000)
  }
  return { message, visible, showToast }
}
