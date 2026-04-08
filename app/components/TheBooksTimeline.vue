<template>
  <div class="timeline-container bg-transparent p-0 flex flex-col cursor-auto pointer-events-auto overflow-y-auto w-full h-full">
    <div class="text-center space-y-4 mb-12 mt-12">
      <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full" style="background: rgba(139,105,20,0.1); border: 1px solid rgba(139,105,20,0.2);">
        <span style="font-size: 28px;">📖</span>
        <span class="font-bold uppercase tracking-[0.2em]" style="color: #8b6914; font-size: 18px;">Parcours Interactif</span>
      </div>
      <h2 class="font-black" style="font-size: 56px; color: inherit;">Mon Parcours</h2>
    </div>
    
    <div class="flex flex-col gap-12 px-12 pb-12">
      <!-- Expériences -->
      <div class="space-y-10">
        <h3 class="font-bold flex items-center gap-4" style="color: #8b6914; font-size: 28px;">
          <span style="font-size: 36px;">🚀</span> Expériences
        </h3>
        <div class="space-y-8 pl-4" style="border-left: 3px solid rgba(139,105,20,0.4);">
          <div v-for="(exp, index) in experiences" :key="index" class="relative pl-8">
            <div class="absolute w-5 h-5 bg-transparent border-4 border-[#8b6914] rounded-full -left-[14px] top-2 z-10" style="background: inherit;"></div>
            <h4 class="font-bold mb-2" style="font-size: 32px; color: inherit;">{{ exp.title }}</h4>
            <p class="font-semibold mb-3 font-mono" style="color: #8b6914; font-size: 18px;">{{ exp.date }} | {{ exp.company }}</p>
            <p class="leading-relaxed opacity-80" style="font-size: 22px; color: inherit;">{{ exp.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="space-y-10">
        <h3 class="font-bold flex items-center gap-4" style="color: #8b6914; font-size: 28px;">
          <span style="font-size: 36px;">⚡</span> Stack Technique Résumée
        </h3>
        <div class="flex flex-wrap gap-4">
          <span 
            v-for="skill in skills" 
            :key="skill" 
            class="px-5 py-2.5 rounded-xl font-bold shadow-sm"
            style="background: rgba(139,105,20,0.15); color: #8b6914; font-size: 20px; border: 1px solid rgba(139,105,20,0.3);"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const skills = [
  'Vue.js', 'Nuxt', 'Node.js', 'Express', 'MySQL', 'REST APIs', 
  'TailwindCSS', 'JavaScript', 'HTML5/CSS3', 'Git', 'UML'
]

const experiences = [
  {
    title: 'Développeur Web Full-Stack',
    company: 'H&S Consulting // Remote, Canada',
    date: '09/2025 - 10/2025',
    desc: 'Création d\'un site corporatif et d\'un CMS (Système de gestion de contenu) sur mesure avec Node.js et Vue.js, Architecture de la base de données MySQL.'
  },
  {
    title: 'Licence Pro. Génie Logiciel & BDD',
    company: 'École Nationale D\'Informatique, Madagascar',
    date: '05/2025',
    desc: 'Équivalence au Québec : Baccalauréat en informatique. Apprentissage approfondi de la modélisation et du développement logiciel.'
  }
]
</script>

<style scoped>
/* Scrollbar personnalisée pour le panneau pour rester premium */
.timeline-container::-webkit-scrollbar {
  width: 8px;
}
.timeline-container::-webkit-scrollbar-track {
  background: transparent; 
}
.timeline-container::-webkit-scrollbar-thumb {
  background: rgba(139,105,20,0.5); 
  border-radius: 10px;
}
.timeline-container::-webkit-scrollbar-thumb:hover {
  background: rgba(139,105,20,0.8); 
}
</style>
