<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const visible = ref(false)

function onScroll() {
  visible.value = (window.scrollY || document.documentElement.scrollTop) > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button
    @click="scrollTop"
    title="Back to top"
    style="bottom: calc(1.5rem + env(safe-area-inset-bottom))"
    class="fixed right-6 z-40 w-10 h-10 rounded-full bg-[#09090B] text-white border border-[#E4E4E7] shadow-lg flex items-center justify-center transition-all duration-300"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'"
  >
    <ArrowUp class="w-4 h-4" />
  </button>
</template>
