<template>
  <div id="ambient-glow" aria-hidden="true" class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div class="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-20" style="background: radial-gradient(circle, #2563EB 0%, transparent 70%); filter: blur(90px); animation: glowFloat 22s ease-in-out infinite alternate;"></div>
    <div class="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full opacity-20" style="background: radial-gradient(circle, #8B5CF6 0%, transparent 70%); filter: blur(90px); animation: glowFloat 26s ease-in-out infinite alternate-reverse; animation-delay: -8s;"></div>
    <div class="absolute -bottom-40 left-1/4 w-[560px] h-[560px] rounded-full opacity-15" style="background: radial-gradient(circle, #10B981 0%, transparent 70%); filter: blur(100px); animation: glowFloat 30s ease-in-out infinite alternate; animation-delay: -16s;"></div>
  </div>
</template>
