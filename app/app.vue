<template>
  <div class="h-screen w-screen bg-zinc-950 overflow-hidden">

    <ClientOnly>
      <TheScene ref="sceneRef" :selected-project="selectedProject" :selected-book="selectedBook" :show-intro="showIntro" />
    </ClientOnly>

    <!-- 🎮 MENU GAME-STYLE -->
    <TheGameMenu 
      :visible="!sceneActive" 
      @navigate="handleMenuNavigate" 
    />

    <!-- BOUTON RETOUR (en dehors de la scène pour rester visible) -->
    <Transition name="fade">
      <button 
        v-if="sceneActive"
        @click.stop="handleBack"
        class="absolute top-10 left-10 z-[100] bg-zinc-800/80 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all pointer-events-auto backdrop-blur-sm border border-zinc-700/50"
      >
        ← Retour au bureau
      </button>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const sceneRef = ref(null)
const selectedProject = ref(null)
const selectedBook = ref(null)
const showIntro = ref(false)

// Réactivement tracker si un élément est actif dans la scène
const sceneActive = computed(() => {
  return sceneRef.value?.activeElement ?? null
})

const handleMenuNavigate = (payload) => {
  if (!sceneRef.value) return

  switch (payload.action) {
    case 'intro':
      showIntro.value = true
      sceneRef.value.zoomTo('laptop')
      break
    case 'folder':
      selectedProject.value = payload.folder
      sceneRef.value.zoomTo('folder')
      break
    case 'books':
      selectedBook.value = payload.book
      sceneRef.value.zoomTo('books')
      break
    case 'phone':
      sceneRef.value.zoomTo('phone')
      break
    case 'laptop':
      showIntro.value = false
      sceneRef.value.zoomTo('laptop')
      break
  }
}

const handleBack = () => {
  sceneRef.value?.resetZoom()
  selectedProject.value = null
  selectedBook.value = null
  showIntro.value = false
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

body {
  margin: 0;
  background: #09090b;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>