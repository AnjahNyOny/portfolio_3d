<template>
  <div class="h-svh w-screen bg-zinc-950 overflow-hidden">

    <ClientOnly>
      <TheScene 
        ref="sceneRef" 
        :selected-project="selectedProject" 
        :selected-book="selectedBook" 
        :show-intro="showIntro"
        :mobile-mode="isMobile"
        @select-project="selectedProject = $event"
        @select-book="selectedBook = $event"
        @drawer-state="isDrawerOpen = $event"
        @background-click="handleBack"
        @theme-toggled="isDarkMode = $event"
        @mobile-activate="handleMobileActivate"
      />
    </ClientOnly>

    <!-- 🎮 MENU GAME-STYLE (desktop uniquement) -->
    <TheGameMenu 
      v-if="!isMobile"
      :visible="!sceneActive" 
      :drawer-open="isDrawerOpen"
      :is-dark-mode="isDarkMode"
      @navigate="handleMenuNavigate"
      @preview="handleMenuPreview"
    />

    <!-- BOUTON RETOUR DESKTOP -->
    <Transition name="fade">
      <button 
        v-if="sceneActive && !isMobile"
        @click.stop="handleBack"
        class="absolute top-10 left-10 z-100 bg-zinc-800/80 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all pointer-events-auto backdrop-blur-sm border border-zinc-700/50"
      >
        ← Retour au bureau
      </button>
    </Transition>

    <!-- 📱 BOUTON RETOUR MOBILE -->
    <Transition name="fade">
      <button 
        v-if="isMobile && sceneActive"
        @click.stop="handleBack"
        class="absolute top-4 left-4 z-100 bg-zinc-900/80 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg pointer-events-auto backdrop-blur-sm border border-zinc-700/50"
      >
        ← Retour
      </button>
    </Transition>

    <!-- 📱 HINT MOBILE (disparaît après 4s) -->
    <Transition name="fade">
      <div 
        v-if="isMobile && showMobileHint && !mobileOverlay.active"
        class="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div class="bg-black/60 backdrop-blur-sm text-white/80 text-xs font-medium tracking-wider px-5 py-2.5 rounded-full border border-white/10">
          GLISSE POUR EXPLORER · TAPE POUR INTERAGIR
        </div>
      </div>
    </Transition>

    <!-- 📱 MOBILE OVERLAY -->
    <MobileOverlay
      v-if="isMobile"
      :active="mobileOverlay.active"
      :section="mobileOverlay.section"
      :project="mobileOverlay.project"
      :book-id="mobileOverlay.bookId"
      :is-dark-mode="isDarkMode"
      @close="closeMobileOverlay"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const sceneRef = ref(null)
const selectedProject = ref(null)
const selectedBook = ref(null)
const showIntro = ref(false)
const isDrawerOpen = ref(false)
const isDarkMode = ref(false)

// 📱 Détection mobile
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768 || 'ontouchstart' in window
}

// 📱 Hint mobile
const showMobileHint = ref(true)

// 📱 Mobile overlay state
const mobileOverlay = ref({
  active: false,
  section: null,
  project: null,
  bookId: null
})

// Données projets pour le MobileOverlay
const projects = {
  babacode: { id: 'babacode', name: 'Babacode', description: 'Site vitrine & portfolio dynamique' },
  monopoly: { id: 'monopoly', name: 'Monopoly', description: 'Jeu de plateau en ligne multijoueur' },
  eni: { id: 'eni', name: 'ENI', description: "Plateforme de gestion d'école" },
}

const openMobileOverlay = (section, data = {}) => {
  mobileOverlay.value = {
    active: true,
    section,
    project: data.folder ? projects[data.folder] || { id: data.folder, name: data.folder } : null,
    bookId: data.book || null
  }
}

const closeMobileOverlay = () => {
  mobileOverlay.value = { active: false, section: null, project: null, bookId: null }
}

const handleMobileActivate = (payload) => {
  openMobileOverlay(payload.section, payload)
}

// Réactivement tracker si un élément est actif dans la scène
const sceneActive = computed(() => {
  return sceneRef.value?.activeElement ?? null
})

const handleMenuPreview = (item) => {
  if (sceneRef.value && sceneRef.value.previewItem) {
    sceneRef.value.previewItem(item)
  }
}

const handleMenuNavigate = (payload) => {
  if (!sceneRef.value) return

  switch (payload.action) {
    case 'intro':
      showIntro.value = true
      sceneRef.value.zoomTo('laptop')
      break
    case 'drawer':
      sceneRef.value.activateItemByName('drawer')
      break
    case 'folder':
      selectedProject.value = payload.folder
      sceneRef.value.activateItemByName('folder', payload.folder)
      break
    case 'books':
      selectedBook.value = payload.book
      sceneRef.value.activateItemByName('books', payload.book)
      break
    case 'phone':
      sceneRef.value.zoomTo('phone')
      break
    case 'laptop':
      showIntro.value = false
      sceneRef.value.zoomTo('laptop')
      break
    case 'toggle-light':
      sceneRef.value.toggleLight()
      break
    case 'social':
      if (payload.url) {
        window.open(payload.url, '_blank')
      }
      break
  }
}

const handleBack = () => {
  sceneRef.value?.resetZoom()
  selectedProject.value = null
  selectedBook.value = null
  showIntro.value = false
}

// Touche Escape globale pour quitter un élément actif
const handleGlobalKeydown = (e) => {
  if (e.key === 'Escape') {
    if (mobileOverlay.value.active) closeMobileOverlay()
    else if (sceneActive.value) handleBack()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', handleGlobalKeydown)

  // Hint mobile disparaît après 4 secondes
  if (isMobile.value) {
    setTimeout(() => { showMobileHint.value = false }, 4000)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style>
@import '@fontsource-variable/inter/wght.css';

body {
  margin: 0;
  background: #09090b;
  font-family: 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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