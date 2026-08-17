<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { message, visible } = useToast()
</script>

<template>
  <div
    id="toast"
    style="bottom: calc(2rem + env(safe-area-inset-bottom))"
    class="fixed left-1/2 transform -translate-x-1/2 bg-[#09090B] text-white px-6 py-3.5 rounded-lg shadow-2xl text-[13px] font-bold tracking-wide transition-all duration-300 pointer-events-none z-50 flex items-center gap-3"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
  >
    <div class="w-2 h-2 rounded-full bg-[#10B981]"></div>
    <span>{{ message }}</span>
  </div>
</template>
