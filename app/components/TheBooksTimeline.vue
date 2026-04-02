<template>
  <div class="timeline-container bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-700/50 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col cursor-auto pointer-events-auto overflow-y-auto w-full h-full">
    <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 mb-8 uppercase tracking-wider">
      Parcours & Compétences
    </h2>
    
    <div class="grid grid-cols-2 gap-10">
      <!-- Skills -->
      <div class="space-y-6">
        <h3 class="text-2xl font-bold text-white border-b border-zinc-700/50 pb-3 flex items-center gap-2">
          <span class="text-orange-500">⚡</span> Stack Technique
        </h3>
        <div class="flex flex-wrap gap-3">
          <span 
            v-for="skill in skills" 
            :key="skill" 
            class="px-4 py-2 bg-zinc-800/80 text-orange-300 rounded-lg text-sm font-mono border border-zinc-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all cursor-default shadow-sm"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Experience -->
      <div class="space-y-8">
        <h3 class="text-2xl font-bold text-white border-b border-zinc-700/50 pb-3 flex items-center gap-2">
          <span class="text-orange-500">🚀</span> Expériences
        </h3>
        <div class="space-y-6">
          <div v-for="(exp, index) in experiences" :key="index" class="relative pl-8 border-l-2 border-orange-500/30">
            <div class="absolute w-4 h-4 bg-zinc-900 border-2 border-orange-500 rounded-full -left-[9px] top-1 shadow-[0_0_10px_rgba(249,115,22,0.8)] z-10"></div>
            <h4 class="text-xl font-bold text-white">{{ exp.title }}</h4>
            <p class="text-orange-400 text-sm font-mono mb-2">{{ exp.date }} | {{ exp.company }}</p>
            <p class="text-zinc-300 text-sm leading-relaxed">{{ exp.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// N'hésite pas à modifier ces données avec ton vrai parcours !
const skills = [
  'Vue.js', 'Nuxt 3/4', 'Three.js', 'TresJS', 'WebGL', 'GSAP', 
  'TailwindCSS', 'JavaScript', 'TypeScript', 'Node.js', 'Git'
]

const experiences = [
  {
    title: 'Développeur Web & 3D',
    company: 'Projets Personnels // Québec',
    date: '2023 - Présent',
    desc: 'Création d\'applications interactives, d\'expériences 3D WebGL et de portfolios immersifs avec Vue/Nuxt et ThreeJS.'
  },
  {
    title: 'Formation Développement Web',
    company: 'Autodidacte & Projets',
    date: '2021 - 2023',
    desc: 'Apprentissage approfondi des technologies front-end modernes et des principes du design d\'interface (UI/UX).'
  }
]
</script>

<style scoped>
/* Scrollbar personnalisée pour le panneau pour rester premium */
.timeline-container::-webkit-scrollbar {
  width: 6px;
}
.timeline-container::-webkit-scrollbar-track {
  background: transparent; 
}
.timeline-container::-webkit-scrollbar-thumb {
  background: #f97316; 
  border-radius: 10px;
}
.timeline-container::-webkit-scrollbar-thumb:hover {
  background: #ea580c; 
}
</style>
