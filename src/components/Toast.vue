<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { message, visible } = useToast()
</script>

<template>
  <div
    id="toast"
    style="bottom: calc(1.5rem + env(safe-area-inset-bottom))"
    class="fixed left-1/2 transform -translate-x-1/2 lg:bottom-8 bg-[#09090B] text-white px-5 py-3 rounded-full shadow-2xl text-[12px] font-semibold transition-all duration-300 pointer-events-none z-50 flex items-center gap-2.5 max-w-[calc(100vw-2rem)]"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
  >
    <div class="w-2 h-2 rounded-full bg-[#10B981]"></div>
    <span>{{ message }}</span>
  </div>
</template>
