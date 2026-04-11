<template>
  <Transition name="menu-fade">
    <div v-if="visible" class="game-menu" tabindex="0" ref="menuRef">
      <!-- HEADER -->
      <div class="menu-header">
        <h1 class="menu-title">ANJAH Rakotovao</h1>
        <p class="menu-subtitle">Junior Web Developer · Québec</p>
        <div class="menu-divider mt-4"></div>
      </div>

      <!-- MENU ITEMS -->
      <nav class="menu-nav">
        <div v-for="(item, index) in flatItems" :key="item.id" class="menu-item-wrapper">
          <button :class="[
            'menu-item',
            { 'active': focusIndex === index },
            { 'sub-item': item.isChild },
            { 'has-children': item.hasChildren },
            { 'expanded': item.hasChildren && expandedSection === item.id }
          ]" @click="selectItem(item, index)" @mouseenter="focusIndex = index">
            <span class="item-indicator">
              <template v-if="item.hasChildren">
                {{ expandedSection === item.id ? '▾' : '▸' }}
              </template>
              <template v-else-if="item.isChild">·</template>
              <template v-else>▸</template>
            </span>
            <span class="item-label">{{ item.label }}</span>
            <span v-if="item.badge" class="item-badge" v-html="icons[item.badge]"></span>
          </button>
        </div>
      </nav>

      <!-- MENU BOTTOM ACTIONS (Reseaux sociaux + Mode Sombre inline) -->
      <div class="menu-bottom-actions">
        <button
          v-for="social in socials"
          :key="social.id"
          class="icon-btn"
          @click="emit('navigate', { action: 'social', url: social.url })"
          @mouseenter="emit('preview', { action: 'social', socialId: social.socialId })"
          @mouseleave="emit('preview', null)"
          v-html="icons[social.badge]"
          :title="social.label"
          tabindex="-1"
        ></button>
        <div class="menu-divider-vertical"></div>
        <button
          class="icon-btn"
          @click="emit('navigate', { action: 'toggle-light' })"
          @mouseenter="emit('preview', { action: 'toggle-light' })"
          @mouseleave="emit('preview', null)"
          v-html="isDarkMode ? icons.sun : icons.moon"
          :title="isDarkMode ? 'Mode Clair' : 'Mode Sombre'"
          tabindex="-1"
        ></button>
      </div>

      <!-- FOOTER -->
      <div class="menu-footer">
        <div class="menu-divider"></div>
        <div class="menu-controls">
          <span><kbd>↑</kbd><kbd>↓</kbd> Naviguer</span>
          <span><kbd>↵</kbd> Sélectionner</span>
          <span><kbd>Esc</kbd> Retour</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: true },
  drawerOpen: { type: Boolean, default: false },
  isDarkMode: { type: Boolean, default: false }
})

watch(() => props.drawerOpen, (val) => {
  if (val) {
    if (expandedSection.value !== 'projets') {
      expandedSection.value = 'projets'
    }
  } else {
    // Si le drawer se ferme, on referme la section Projets
    if (expandedSection.value === 'projets') {
      expandedSection.value = null
    }
  }
})

const emit = defineEmits(['navigate', 'preview'])

const menuRef = ref(null)
const focusIndex = ref(0)
const expandedSection = ref(null)

watch(focusIndex, (newIdx) => {
  const item = flatItems.value[newIdx]
  if (item && item.action !== 'intro') {
     emit('preview', item)
  } else {
     emit('preview', null)
  }
})

// Icones SVG
const ico = (d) => `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const icons = {
  dice: ico('<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
  monitor: ico('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
  globe: ico('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
  star: ico('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  camera: ico('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),
  github: ico('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>'),
  linkedin: ico('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'),
  facebook: ico('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
  sun: ico('<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'),
  moon: ico('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>')
}

// Variables pour les réseaux sociaux inline
const socials = [
  { id: 'github', label: 'GitHub', socialId: 'github_card', badge: 'github', url: 'https://github.com/AnjahNyOny' },
  { id: 'linkedin', label: 'LinkedIn', socialId: 'linkedin_card', badge: 'linkedin', url: 'https://linkedin.com/in/rakotovao-liantsoa' },
  { id: 'facebook', label: 'Facebook', socialId: 'facebook_card', badge: 'facebook', url: 'https://facebook.com/anjahnyony.rakotovao' }
]

// Structure du menu (Réactif)
const menuStructure = computed(() => [
  {
    id: 'intro',
    label: 'Introduction',
    action: 'intro'
  },
  {
    id: 'projets',
    label: 'Projets',
    action: 'drawer',
    hasChildren: true,
    children: [
      { id: 'projet-monopoly', label: 'Monopoly Madagascar', action: 'folder', folder: 'monopoly', badge: 'dice' },
      { id: 'projet-cms', label: 'CMS Propriétaire', action: 'folder', folder: 'cms', badge: 'monitor' },
      { id: 'projet-portfolio', label: 'Portfolio Bilingue', action: 'folder', folder: 'portfolio', badge: 'globe' },
      { id: 'projet-movie', label: 'Perfect-Movie', action: 'folder', folder: 'movie', badge: 'star' },
      { id: 'projet-soccer', label: 'Soccer Interculturel Bellechasse', action: 'folder', folder: 'soccer', badge: 'camera' },
    ]
  },
  {
    id: 'timeline',
    label: 'Mon Parcours',
    action: 'books',
    book: 'timeline'
  },
  {
    id: 'stack',
    label: 'Stack & Skills',
    action: 'books',
    book: 'stack'
  },
  {
    id: 'about',
    label: 'À propos',
    action: 'books',
    book: 'about'
  },
  {
    id: 'contact',
    label: 'Contact',
    action: 'phone'
  }
])

// Flatten pour la navigation clavier
const flatItems = computed(() => {
  const items = []
  for (const item of menuStructure.value) {
    items.push({ ...item, isChild: false })
    if (item.hasChildren && expandedSection.value === item.id) {
      for (const child of item.children) {
        items.push({ ...child, isChild: true })
      }
    }
  }
  return items
})

const selectItem = (item, index) => {
  focusIndex.value = index

  if (item.hasChildren) {
    // Si l'item a une action (ex: drawer), l'UI s'ouvrira toute seule via la prop drawerOpen une fois le vrai tiroir ouvert.
    if (item.action) {
      emit('navigate', { action: item.action })
    } else {
      expandedSection.value = expandedSection.value === item.id ? null : item.id
    }
    return
  }

  // Émet l'action vers le parent
  emit('navigate', {
    action: item.action,
    folder: item.folder,
    book: item.book,
    id: item.id,
    socialId: item.socialId,
    url: item.url
  })
}

const handleKeydown = (e) => {
  const len = flatItems.value.length

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      focusIndex.value = (focusIndex.value - 1 + len) % len
      break
    case 'ArrowDown':
      e.preventDefault()
      focusIndex.value = (focusIndex.value + 1) % len
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectItem(flatItems.value[focusIndex.value], focusIndex.value)
      break
    case 'Escape':
      if (expandedSection.value) {
        // Retrouver l'index du parent pour ne pas être "out of bounds" après la fermeture
        const parentIndex = flatItems.value.findIndex(i => i.id === expandedSection.value)
        if (parentIndex !== -1) focusIndex.value = parentIndex

        // Si c'est l'accordion projet, on envoie la demande de fermeture du drawer à la 3D
        if (expandedSection.value === 'projets') {
          emit('navigate', { action: 'drawer' })
        } else {
          expandedSection.value = null
        }
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      const currentItem = flatItems.value[focusIndex.value]
      if (currentItem.hasChildren && expandedSection.value !== currentItem.id) {
        expandedSection.value = currentItem.id
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      const currentItem2 = flatItems.value[focusIndex.value]
      if (currentItem2.isChild) {
        expandedSection.value = null
      }
      break
  }
}

// Focus auto quand le menu apparaît
watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => {
      menuRef.value?.focus()
      // Fix: Mettre l'index de focus sur "Projets" si déroulé, sinon à 0
      focusIndex.value = expandedSection.value ? flatItems.value.findIndex(i => i.id === expandedSection.value) : 0
      // On ne reset PAS expandedSection.value = null; le tiroir peut être encore ouvert !
    })
  }
})

// Écouter les touches même quand le menu n'a pas le focus
const globalKeyHandler = (e) => {
  if (!props.visible) return
  // Ne pas intercepter si on est dans un input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  handleKeydown(e)
}

onMounted(() => {
  window.addEventListener('keydown', globalKeyHandler)
  nextTick(() => menuRef.value?.focus())
})

onUnmounted(() => {
  window.removeEventListener('keydown', globalKeyHandler)
})
</script>

<style scoped>
.game-menu {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
  pointer-events: none;
  outline: none;
}

.menu-header {
  margin-bottom: 20px;
}

.menu-title {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
  margin: 0;
  line-height: 1;
}

.menu-subtitle {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 6px;
  letter-spacing: 0.05em;
}

.menu-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
  margin-top: 12px;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
}

.menu-bottom-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 0 4px;
}

.icon-btn {
  background: transparent;
  border: none;
  pointer-events: auto;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

.menu-divider-vertical {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: auto;
  min-width: 180px;
  padding: 8px 12px;
  pointer-events: auto;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  position: relative;
  text-align: left;
  font-family: inherit;
}

.menu-item:hover,
.menu-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.06);
}

.menu-item.active {
  padding-left: 24px;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: white;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.2);
}

.menu-item.active .item-label {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* Sous-items (enfants d'un drawer) */
.menu-item.sub-item {
  padding-left: 36px;
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  min-width: 340px;
}

.menu-item.sub-item.active {
  padding-left: 44px;
  color: white;
}

.menu-item.sub-item.active::before {
  left: 18px;
  height: 40%;
  background: rgba(255, 255, 255, 0.7);
}

/* Items avec enfants (drawer headers) */
.menu-item.has-children {
  color: rgba(255, 255, 255, 0.7);
}

.menu-item.has-children.expanded {
  color: rgba(255, 255, 255, 0.85);
}

.item-indicator {
  font-size: 0.75rem;
  width: 14px;
  flex-shrink: 0;
  transition: transform 0.2s;
  opacity: 0.6;
}

.menu-item.active .item-indicator {
  opacity: 1;
}

.item-label {
  flex: 1;
}

.item-badge {
  font-size: 0.85rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.menu-item.active .item-badge {
  opacity: 1;
}

/* FOOTER */
.menu-footer {
  margin-top: 24px;
}

.menu-controls {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.menu-controls span {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.03em;
}

.menu-controls kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  font-family: inherit;
  font-size: 0.6rem;
  margin-right: 3px;
  color: rgba(255, 255, 255, 0.5);
}

/* TRANSITIONS */
.menu-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(-30px);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-20px);
}

/* Animation d'entrée des items */
.menu-item-wrapper {
  animation: itemSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.menu-item-wrapper:nth-child(1) {
  animation-delay: 0.1s;
}

.menu-item-wrapper:nth-child(2) {
  animation-delay: 0.15s;
}

.menu-item-wrapper:nth-child(3) {
  animation-delay: 0.2s;
}

.menu-item-wrapper:nth-child(4) {
  animation-delay: 0.25s;
}

.menu-item-wrapper:nth-child(5) {
  animation-delay: 0.3s;
}

.menu-item-wrapper:nth-child(6) {
  animation-delay: 0.35s;
}

.menu-item-wrapper:nth-child(7) {
  animation-delay: 0.4s;
}

.menu-item-wrapper:nth-child(8) {
  animation-delay: 0.45s;
}

.menu-item-wrapper:nth-child(9) {
  animation-delay: 0.5s;
}

.menu-item-wrapper:nth-child(10) {
  animation-delay: 0.55s;
}

.menu-item-wrapper:nth-child(11) {
  animation-delay: 0.6s;
}

@keyframes itemSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
