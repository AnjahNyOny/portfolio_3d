<template>
  <Transition name="overlay-slide">
    <div 
      v-if="active"
      class="fixed inset-0 z-[200] flex flex-col overflow-hidden"
      :class="isDarkMode ? 'bg-zinc-950/95' : 'bg-white/95'"
      style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between px-5 pt-5 pb-3">
        <span 
          class="text-[10px] font-bold tracking-[0.2em] uppercase"
          :class="isDarkMode ? 'text-zinc-500' : 'text-zinc-400'"
        >
          {{ sectionTitle }}
        </span>
        <button 
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          :class="isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'"
        >
          ✕
        </button>
      </div>

      <!-- CONTENT -->
      <div class="flex-1 overflow-y-auto px-5 pb-8" style="-webkit-overflow-scrolling: touch;">

        <!-- INTRO -->
        <div v-if="section === 'intro'" class="space-y-6 pt-4">
          <h1 class="text-3xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-zinc-900'">
            ANJAH Rakotovao
          </h1>
          <p class="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Développeur Web Fullstack
          </p>
          <p class="leading-relaxed" :class="isDarkMode ? 'text-zinc-400' : 'text-zinc-600'">
            Passionné par l'innovation numérique, je conçois des solutions web modernes, fluides et performantes.
          </p>
          <div class="flex gap-3 pt-2">
            <a href="/CV-ANJAH.pdf" download="CV_Anjah_Rakotovao.pdf" 
              class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition-all">
              ↓ Télécharger CV
            </a>
          </div>
        </div>

        <!-- CONTACT / PHONE -->
        <div v-else-if="section === 'phone'" class="space-y-6 pt-4">
          <h2 class="text-2xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-zinc-900'">
            CONTACT
          </h2>
          <p class="text-sm" :class="isDarkMode ? 'text-zinc-400' : 'text-zinc-600'">
            Envoyez-moi un message pour discuter d'un projet ou d'une collaboration.
          </p>
          <form class="space-y-4" @submit.prevent>
            <input type="text" placeholder="Votre nom" 
              class="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              :class="isDarkMode ? 'bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500' : 'bg-zinc-100 text-zinc-900 border border-zinc-300 focus:border-cyan-500'" />
            <input type="email" placeholder="Email" 
              class="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              :class="isDarkMode ? 'bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500' : 'bg-zinc-100 text-zinc-900 border border-zinc-300 focus:border-cyan-500'" />
            <textarea placeholder="Message" rows="4" 
              class="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none transition-colors"
              :class="isDarkMode ? 'bg-zinc-800 text-white border border-zinc-700 focus:border-cyan-500' : 'bg-zinc-100 text-zinc-900 border border-zinc-300 focus:border-cyan-500'">
            </textarea>
            <button class="w-full py-3 rounded-lg font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition-all">
              Envoyer
            </button>
          </form>
        </div>

        <!-- BOOKS / PARCOURS -->
        <div v-else-if="section === 'books'" class="space-y-6 pt-4">
          <h2 class="text-2xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-zinc-900'">
            MON PARCOURS
          </h2>
          <div 
            v-if="bookId"
            class="p-4 rounded-xl border"
            :class="isDarkMode ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-200'"
          >
            <span class="text-xs font-bold tracking-wider uppercase" :class="isDarkMode ? 'text-cyan-400' : 'text-cyan-600'">
              {{ bookId }}
            </span>
          </div>
          <p class="text-sm leading-relaxed" :class="isDarkMode ? 'text-zinc-400' : 'text-zinc-600'">
            Consultez les détails de mon parcours académique et professionnel dans la scène 3D en tapant sur les livres.
          </p>
        </div>

        <!-- FOLDER / PROJETS -->
        <div v-else-if="section === 'folder'" class="space-y-6 pt-4">
          <h2 class="text-2xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-zinc-900'">
            {{ project?.name || 'PROJET' }}
          </h2>
          <p class="text-sm leading-relaxed" :class="isDarkMode ? 'text-zinc-400' : 'text-zinc-600'">
            {{ project?.description || 'Détails du projet' }}
          </p>
        </div>

        <!-- USB / CV DOWNLOAD -->
        <div v-else-if="section === 'usb'" class="space-y-6 pt-4">
          <h2 class="text-2xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-zinc-900'">
            TÉLÉCHARGER MON CV
          </h2>
          <p class="text-sm" :class="isDarkMode ? 'text-zinc-400' : 'text-zinc-600'">
            Le fichier sera téléchargé en PDF.
          </p>
          <a href="/CV-ANJAH.pdf" download="CV_Anjah_Rakotovao.pdf" 
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition-all">
            ↓ Télécharger CV (PDF)
          </a>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
  section: { type: String, default: null },
  project: { type: Object, default: null },
  bookId: { type: String, default: null },
  isDarkMode: { type: Boolean, default: false }
})

defineEmits(['close'])

const sectionTitle = computed(() => {
  const titles = {
    intro: 'Introduction',
    phone: 'Contact',
    books: 'Parcours',
    folder: 'Projet',
    usb: 'CV'
  }
  return titles[props.section] || ''
})
</script>

<style scoped>
.overlay-slide-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-slide-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.overlay-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
