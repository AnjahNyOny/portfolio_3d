<template>
  <div class="h-screen w-screen bg-zinc-950 overflow-hidden">
    <div class="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-10">
      <h1 class="text-white text-5xl font-black uppercase tracking-taller">
        Anjah Ny Ony
      </h1>
      <p class="text-zinc-500 font-mono">Junior Web Developer // Québec</p>
    </div>

    <ClientOnly>
      <TheScene />
    </ClientOnly>
  </div>
</template>

<style>
body { margin: 0; background: #09090b; }
</style>