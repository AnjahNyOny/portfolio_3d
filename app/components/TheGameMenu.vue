<template>
  <Transition name="menu-fade">
    <div 
      v-if="visible" 
      class="game-menu"
      tabindex="0"
      ref="menuRef"
    >
      <!-- HEADER -->
      <div class="menu-header">
        <h1 class="menu-title">ANJAH NY ONY</h1>
        <p class="menu-subtitle">Junior Web Developer · Québec</p>
        <div class="menu-divider mt-4"></div>
      </div>

      <!-- MENU ITEMS -->
      <nav class="menu-nav">
        <div 
          v-for="(item, index) in flatItems" 
          :key="item.id"
          class="menu-item-wrapper"
        >
          <button
            :class="[
              'menu-item',
              { 'active': focusIndex === index },
              { 'sub-item': item.isChild },
              { 'has-children': item.hasChildren },
              { 'expanded': item.hasChildren && expandedSection === item.id }
            ]"
            @click="selectItem(item, index)"
            @mouseenter="focusIndex = index"
          >
            <span class="item-indicator">
              <template v-if="item.hasChildren">
                {{ expandedSection === item.id ? '▾' : '▸' }}
              </template>
              <template v-else-if="item.isChild">·</template>
              <template v-else>▸</template>
            </span>
            <span class="item-label">{{ item.label }}</span>
            <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
          </button>
        </div>
      </nav>

      <!-- BOUTON MODE SOMBRE (même style que les items du menu) -->
      <div class="menu-item-wrapper">
        <button
          class="menu-item"
          @click="emit('navigate', { action: 'toggle-light' })"
          tabindex="-1"
        >
          <span class="item-indicator">▸</span>
          <span class="item-label">{{ isDarkMode ? 'Mode Clair' : 'Mode Sombre' }}</span>
        </button>
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

const emit = defineEmits(['navigate'])

const menuRef = ref(null)
const focusIndex = ref(0)
const expandedSection = ref(null)

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
      { id: 'projet-monopoly', label: 'Monopoly Madagascar', action: 'folder', folder: 'monopoly', badge: '🎲' },
      { id: 'projet-cms', label: 'CMS Propriétaire', action: 'folder', folder: 'cms', badge: '📝' },
      { id: 'projet-portfolio', label: 'Portfolio Bilingue', action: 'folder', folder: 'portfolio', badge: '🌐' },
      { id: 'projet-movie', label: 'Perfect-Movie', action: 'folder', folder: 'movie', badge: '🎬' },
      { id: 'projet-soccer', label: 'Club de Soccer', action: 'folder', folder: 'soccer', badge: '⚽' },
    ]
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
    id: item.id
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
  pointer-events: auto;
  outline: none;
  min-width: 280px;
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
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  margin: 0;
  line-height: 1;
}

.menu-subtitle {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
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
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  font-size: 1rem;
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
  color: rgba(255, 255, 255, 0.35);
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
  color: rgba(255, 255, 255, 0.5);
}

.menu-item.has-children.expanded {
  color: rgba(255, 255, 255, 0.7);
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
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.03em;
}

.menu-controls kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  font-family: inherit;
  font-size: 0.6rem;
  margin-right: 3px;
  color: rgba(255, 255, 255, 0.35);
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

.menu-item-wrapper:nth-child(1) { animation-delay: 0.1s; }
.menu-item-wrapper:nth-child(2) { animation-delay: 0.15s; }
.menu-item-wrapper:nth-child(3) { animation-delay: 0.2s; }
.menu-item-wrapper:nth-child(4) { animation-delay: 0.25s; }
.menu-item-wrapper:nth-child(5) { animation-delay: 0.3s; }
.menu-item-wrapper:nth-child(6) { animation-delay: 0.35s; }
.menu-item-wrapper:nth-child(7) { animation-delay: 0.4s; }
.menu-item-wrapper:nth-child(8) { animation-delay: 0.45s; }
.menu-item-wrapper:nth-child(9) { animation-delay: 0.5s; }
.menu-item-wrapper:nth-child(10) { animation-delay: 0.55s; }
.menu-item-wrapper:nth-child(11) { animation-delay: 0.6s; }

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
