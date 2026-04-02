<template>
  <div 
    class="relative h-screen w-full bg-zinc-950 overflow-hidden"
  >
    
    <Transition name="fade">
      <button 
        v-if="activeElement"
        @click.stop="resetZoom"
        class="absolute top-10 left-10 z-[100] bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all pointer-events-auto"
      >
        ← Retour au bureau
      </button>
    </Transition>

    <!-- 💡 BOUTON POUR AFFICHER LA CALIBRATION LUMIÈRE -->
    <button v-if="calibrationMode && !showLightCalibration" @click="showLightCalibration = true" class="absolute top-10 left-10 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-zinc-600">
      💡 Régler Lumières
    </button>

    <!-- 🛠️ INTERFACE DE CALIBRATION LUMIÈRES -->
    <div v-if="calibrationMode && showLightCalibration" class="absolute top-10 left-10 z-[100] bg-zinc-800/90 text-white p-4 rounded text-xs w-[250px] pointer-events-auto shadow-2xl">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-yellow-400">Calibration Lumières</h3>
        <button @click="showLightCalibration = false" class="text-red-400 font-bold px-2 hover:bg-zinc-700 rounded">X</button>
      </div>
      <div class="mb-2 border-b border-zinc-600 pb-2">
        <label class="block font-bold">☀️ Soleil Pos (Jour)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.sun.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.5" v-model.number="lightPos.sun.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.5" v-model.number="lightPos.sun.z" class="w-full bg-black/50 p-1 mb-1" />
        <label class="block font-bold text-gray-400">Taille de l'ombre (Frustum)</label>
        <input type="number" step="1" v-model.number="lightPos.sun.frustum" class="w-full bg-black/50 p-1 mb-1" />
        
        <label class="block font-bold text-orange-400 mt-2">Intensité Soleil & Ambiance</label>
        Soleil (Intensité): <input type="number" step="0.5" v-model.number="lightState.window" class="w-full bg-black/50 p-1 mb-1" />
        Ambiance (Jour): <input type="number" step="0.1" v-model.number="lightState.ambient" class="w-full bg-black/50 p-1 mb-1" />
        
        <label class="block font-bold text-red-500 mt-2">🎯 Cible du Soleil (Où il pointe)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.z" class="w-full bg-black/50 p-1 mb-1" />
      </div>
      <div>
        <label class="block font-bold text-blue-400">🌙 Lampe Bureau (Nuit)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.desk.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.5" v-model.number="lightPos.desk.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.5" v-model.number="lightPos.desk.z" class="w-full bg-black/50 p-1 mb-1" />
        Lampe (Intensité): <input type="number" step="1" v-model.number="lightState.desk" class="w-full bg-black/50 p-1 mb-1" />
      </div>
    </div>

    <!-- 🛠️ INTERFACE DE CALIBRATION (à activer via le flag calibrationMode) -->
    <div v-if="calibrationMode && activeElement" class="absolute top-10 right-10 z-[100] bg-zinc-800/90 text-white p-4 rounded text-xs w-[300px] pointer-events-auto max-h-[80vh] overflow-y-auto">
      <h3 class="font-bold mb-2 text-orange-400">Calibration : {{ activeElement }}</h3>
      
      <button @click="copyCurrentCamera" class="w-full bg-blue-600 hover:bg-blue-500 transition-colors p-2 rounded mb-3 font-bold text-white shadow-lg">
        📸 Utiliser la vue actuelle (Souris)
      </button>

      <div class="mb-4">
        <label class="block font-bold mt-2">Caméra Pos</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].camX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].camY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].camZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
      </div>

      <div class="mb-4">
        <label class="block font-bold">LookAt Target</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].lookX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].lookY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].lookZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
      </div>

      <div class="mt-4 pt-2 border-t border-zinc-600">
        <label class="block font-bold text-blue-300">HTML Pos (TresGroup)</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlPosX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlPosY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlPosZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <div class="mb-4">
        <label class="block font-bold text-blue-300">HTML Rot</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlRotX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlRotY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlRotZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <div class="mb-4">
        <label class="block font-bold text-blue-300">Scale</label>
        scale: <input type="number" step="0.001" v-model.number="settings[activeElement].scale" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <div>
        <label class="block font-bold text-purple-400">Dimensions HTML (px)</label>
        width: <input type="number" step="1" v-model.number="settings[activeElement].width" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        height: <input type="number" step="1" v-model.number="settings[activeElement].height" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <!-- SECTON TÉLÉPHONE 3D (Seulement si le téléphone est zoomé) -->
      <div v-if="activeElement === 'phone'" class="mt-4 border-t border-zinc-600 pt-2">
        <h3 class="font-bold text-green-400 mb-2">📱 Animation Téléphone 3D</h3>
        Décalage (X): <input type="number" step="0.1" v-model.number="phoneAnimConfig.posX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Lévitation (Y): <input type="number" step="0.1" v-model.number="phoneAnimConfig.posY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Décalage (Z): <input type="number" step="0.1" v-model.number="phoneAnimConfig.posZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Rotation X (deg): <input type="number" step="5" v-model.number="phoneAnimConfig.rotX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Rotation Y (deg): <input type="number" step="5" v-model.number="phoneAnimConfig.rotY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Rotation Z (deg): <input type="number" step="5" v-model.number="phoneAnimConfig.rotZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
      </div>
    </div>
    <TresCanvas :clear-color="isDarkMode ? '#050505' : '#e0f2fe'" shadows window-size>
      <TresPerspectiveCamera 
        ref="cameraRef" 
        :position="[4, 3, 4]" 
        :look-at="[0, 1, 0]" 
      />
      
      <OrbitControls 
        ref="controlsRef" 
        :enabled="!animating"
        :enable-pan="calibrationMode"
        :min-distance="1" 
        :max-distance="calibrationMode ? 50 : 7" 
        :min-polar-angle="calibrationMode ? 0 : Math.PI / 3"
        :max-polar-angle="calibrationMode ? Math.PI : Math.PI / 2 - 0.2"
        :min-azimuth-angle="calibrationMode ? -Infinity : -Math.PI / 70"
        :max-azimuth-angle="calibrationMode ? Infinity : Math.PI / 2"
      />

      <!-- 🟢 AIDES VISUELLES : Marqueurs sphériques pour les lumières (Seulement en mode Calibration) -->
      <TresMesh v-if="calibrationMode" :position="[lightPos.sun.x, lightPos.sun.y, lightPos.sun.z]">
        <TresSphereGeometry :args="[0.3]" />
        <TresMeshBasicMaterial color="yellow" />
      </TresMesh>
      
      <TresMesh v-if="calibrationMode" :position="[lightPos.desk.x, lightPos.desk.y, lightPos.desk.z]">
        <TresSphereGeometry :args="[0.1]" />
        <TresMeshBasicMaterial color="cyan" />
      </TresMesh>
      <!-- LUMIÈRE AMBIANTE -->
      <TresAmbientLight :intensity="lightState.ambient" />
      
      <!-- LUMIÈRE FENÊTRE (Jour) -->
      <TresDirectionalLight 
        :position="[lightPos.sun.x, lightPos.sun.y, lightPos.sun.z]" 
        :intensity="lightState.window" 
        color="#fff0dd"
        cast-shadow 
        :shadow-mapSize-width="2048"
        :shadow-mapSize-height="2048"
        :shadow-camera-left="-lightPos.sun.frustum"
        :shadow-camera-right="lightPos.sun.frustum"
        :shadow-camera-top="lightPos.sun.frustum"
        :shadow-camera-bottom="-lightPos.sun.frustum"
        :shadow-bias="-0.0001"
      >
        <!-- Permet d'orienter spécifiquement la lumière du "soleil" -->
        <TresObject3D attach="target" :position="[lightPos.sunTarget.x, lightPos.sunTarget.y, lightPos.sunTarget.z]" />
      </TresDirectionalLight>
      
      <!-- LUMIÈRE LAMPE DE BUREAU (Nuit) -->
      <TresPointLight 
        :position="[lightPos.desk.x, lightPos.desk.y, lightPos.desk.z]" 
        :intensity="lightState.desk" 
        :distance="10"
        color="#ffcc88" 
        cast-shadow
        :shadow-bias="-0.001"
      />

      <!-- PÉNOMBRE BLEUTÉE (Nuit, ambiance claire de lune) -->
      <TresDirectionalLight 
        :position="[-3, 5, -3]" 
        :intensity="lightState.nightReflect" 
        color="#3b82f6" 
      />

      <Suspense>
        <Environment preset="city" />
      </Suspense>
      
      <Suspense>
        <GLTFModel 
          path="/models/room_v8.glb" 
          draco 
          cast-shadow 
          receive-shadow
          @load="onModelLoaded"
          @click="onModelClick"
          @pointermove="onPointerMove"
          @pointerleave="onPointerOut"
        />
      </Suspense>

      <!-- ECRAN LAPTOP -->
      <TresGroup 
        v-if="activeElement === 'laptop'" 
        :position="[settings.laptop.htmlPosX, settings.laptop.htmlPosY, settings.laptop.htmlPosZ]" 
      >
        <Html transform wrapper-class="ecran-virtuel" 
              :rotation-x="settings.laptop.htmlRotX" 
              :rotation-y="settings.laptop.htmlRotY" 
              :rotation-z="settings.laptop.htmlRotZ" 
              :scale="settings.laptop.scale">
          <iframe src="https://anjahnyony.com" 
                  :style="{ width: settings.laptop.width + 'px', height: settings.laptop.height + 'px', backfaceVisibility: 'hidden' }"
                  class="border-none bg-white rounded-md pointer-events-auto shadow-[0_0_10px_rgba(255,255,255,0.1)]"></iframe>
        </Html>
      </TresGroup>

      <!-- ECRAN TELEPHONE -->
      <TresGroup 
        v-if="activeElement === 'phone'" 
        :position="[settings.phone.htmlPosX, settings.phone.htmlPosY, settings.phone.htmlPosZ]" 
      >
        <Html transform wrapper-class="ecran-phone" 
              :rotation-x="settings.phone.htmlRotX" 
              :rotation-y="settings.phone.htmlRotY" 
              :rotation-z="settings.phone.htmlRotZ" 
              :scale="settings.phone.scale">
          <Transition 
            enter-active-class="transition-opacity duration-700" 
            enter-from-class="opacity-0" 
            leave-active-class="transition-opacity duration-300" 
            leave-to-class="opacity-0"
          >
            <div v-show="showPhoneContent" :style="{ width: settings.phone.width + 'px', height: settings.phone.height + 'px' }"
                 class="relative bg-black rounded-[40px] border-[12px] border-zinc-800 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto">
              <iframe src="https://anjahnyony.com/fr/contact" class="w-full h-full border-none"></iframe>
              <div class="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl"></div> <!-- Fake notch -->
            </div>
          </Transition>
        </Html>
      </TresGroup>

      <!-- PANNEAU LIVRES -->
      <TresGroup 
        v-if="activeElement === 'books'" 
        :position="[settings.books.htmlPosX, settings.books.htmlPosY, settings.books.htmlPosZ]" 
      >
        <Html transform wrapper-class="ecran-books"
              :rotation-x="settings.books.htmlRotX" 
              :rotation-y="settings.books.htmlRotY" 
              :rotation-z="settings.books.htmlRotZ" 
              :scale="settings.books.scale">
          <TheBooksTimeline :style="{ width: settings.books.width + 'px', maxHeight: settings.books.height + 'px' }" />
        </Html>
      </TresGroup>

    </TresCanvas>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OrbitControls, GLTFModel, Environment, Html } from '@tresjs/cientos'
import gsap from 'gsap'

import TheBooksTimeline from './TheBooksTimeline.vue'

const cameraRef = ref(null)
const controlsRef = ref(null)

// --- STATE & SETTINGS ---
const activeElement = ref(null) // 'laptop', 'phone', 'books', 'switch', or null
const isHovered = ref(false)
const animating = ref(false)

const showPhoneContent = ref(false)

// 🪄 Passe à 'true' pour faire apparaître les panneaux de configuration
const calibrationMode = ref(true) 
const showLightCalibration = ref(false)

// --- VARIABLES POUR L'ANIMATION DES OBJETS ---
let phoneGroup = null
const phoneAnimConfig = ref({
  posX: 0.4,
  posY: 0.3,
  posZ: 0.4,
  rotX: 80,
  rotY: 5,
  rotZ: 145
})

const getPhoneGroup = () => {
  if (phoneGroup) return phoneGroup

  let sceneRoot = cameraRef.value
  while (sceneRoot && !sceneRoot.isScene && sceneRoot.parent) {
    sceneRoot = sceneRoot.parent
  }

  sceneRoot?.traverse((n) => {
    if (n.isMesh && n.name.startsWith('Plane038_') && !phoneGroup) {
      phoneGroup = n.parent
      console.log(`[GET PHONE] Téléphone trouvé, parent group: ${phoneGroup.name}`)
    }
  })

  // Si on a trouvé le groupe et qu'on n'a pas encore sauvé ses offsets
  if (phoneGroup && !phoneGroup.userData.originalPos) {
    phoneGroup.userData.originalPos = phoneGroup.position.clone()
    phoneGroup.userData.originalRot = phoneGroup.rotation.clone()
  }

  return phoneGroup
}

const updatePhoneAnim = () => {
  const pg = getPhoneGroup()
  if (pg && pg.userData.originalPos && activeElement.value === 'phone') {
    gsap.killTweensOf(pg.position)
    gsap.killTweensOf(pg.rotation)
    pg.position.x = pg.userData.originalPos.x + phoneAnimConfig.value.posX
    pg.position.y = pg.userData.originalPos.y + phoneAnimConfig.value.posY
    pg.position.z = pg.userData.originalPos.z + phoneAnimConfig.value.posZ
    pg.rotation.x = pg.userData.originalRot.x + (phoneAnimConfig.value.rotX * Math.PI / 180)
    pg.rotation.y = pg.userData.originalRot.y + (phoneAnimConfig.value.rotY * Math.PI / 180)
    pg.rotation.z = pg.userData.originalRot.z + (phoneAnimConfig.value.rotZ * Math.PI / 180)
  }
}

// --- GESTION DE LA LUMIÈRE (Interrupteur) ---
const isDarkMode = ref(false)
const lightState = ref({
  ambient: 0.7,
  window: 2.5,
  desk: 0,
  nightReflect: 0,
  envIntensity: 1
})

const lightPos = ref({
  sun: { x: -3, y: 3, z: -1, frustum: 10 },
  sunTarget: { x: 0, y: 0, z: 0 },
  desk: { x: 1.5, y: 2.5, z: 0.5 },
})

const toggleLight = () => {
  isDarkMode.value = !isDarkMode.value
  
  // Trouve la scène principale de ThreeJS pour ajuster l'Environment map
  let sceneRoot = cameraRef.value
  while (sceneRoot && !sceneRoot.isScene && sceneRoot.parent) {
    sceneRoot = sceneRoot.parent
  }

  if (isDarkMode.value) {
    // Mode Nuit
    gsap.to(lightState.value, {
      ambient: 0.1,    // Sombre comme tu avais aimé
      window: 0,
      desk: 6,         // Puissance ciblée de la lampe
      nightReflect: 0.1, 
      envIntensity: 0.05, // ON ÉTEINT L'ENVIRONNEMENT GLOBALE ICI !!!
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (sceneRoot?.isScene && sceneRoot.environmentIntensity !== undefined) {
          sceneRoot.environmentIntensity = lightState.value.envIntensity
        }
      }
    })
  } else {
    // Mode Jour
    gsap.to(lightState.value, {
      ambient: 0.7,   // Ambiance claire parfaite
      window: 2.5,    // Merveilleuses ombres directionnelles
      desk: 0,
      nightReflect: 0,
      envIntensity: 1, // On rallume l'environnement pour les textures
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (sceneRoot?.isScene && sceneRoot.environmentIntensity !== undefined) {
          sceneRoot.environmentIntensity = lightState.value.envIntensity
        }
      }
    })
  }
}

const settings = ref({
  laptop: { 
    camX: 1.54, camY: 1.81, camZ: 0.90, 
    lookX: 1.54, lookY: 1.65, lookZ: 0.24,
    htmlPosX: 1.54, htmlPosY: 1.65, htmlPosZ: 0.24,
    htmlRotX: -0.33, htmlRotY: 0.03, htmlRotZ: 0.00,
    scale: 0.0114,
    width: 1024,
    height: 830
  },
  phone: {
    camX: 1.75, camY: 1.929, camZ: 1.401,
    lookX: 1.25, lookY: 1.73, lookZ: 0.55,
    htmlPosX: 0.9, htmlPosY: 1.57, htmlPosZ: 0.46,
    htmlRotX: -0.17, htmlRotY: 0.54, htmlRotZ: 0.07,
    scale: 0.023,
    width: 380,
    height: 800
  },
  books: { 
    camX: 0.6, camY: 2.5, camZ: 0.8, 
    lookX: 0.6, lookY: 2.5, lookZ: -0.15,
    htmlPosX: 0.6, htmlPosY: 2.5, htmlPosZ: -0.15,
    htmlRotX: 0, htmlRotY: 0.1, htmlRotZ: 0,
    scale: 0.012,
    width: 800,
    height: 600
  }
})

// Met à jour la position de la caméra en temps réel depuis le panel de calibration
const updateCalibration = () => {
  if (activeElement.value && cameraRef.value) {
    const s = settings.value[activeElement.value]
    cameraRef.value.position.set(s.camX, s.camY, s.camZ)
    cameraRef.value.lookAt(s.lookX, s.lookY, s.lookZ)

    const rawRef = controlsRef.value
    const controls = rawRef?.value ?? rawRef?.instance ?? rawRef
    if (controls && controls.target) {
      controls.target.set(s.lookX, s.lookY, s.lookZ)
    }
  }
}

// 📸 Capture la position actuelle de la souris
const copyCurrentCamera = () => {
  if (!activeElement.value || !cameraRef.value) return
  const s = settings.value[activeElement.value]
  s.camX = Number(cameraRef.value.position.x.toFixed(3))
  s.camY = Number(cameraRef.value.position.y.toFixed(3))
  s.camZ = Number(cameraRef.value.position.z.toFixed(3))
  
  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef
  if (controls && controls.target) {
    s.lookX = Number(controls.target.x.toFixed(3))
    s.lookY = Number(controls.target.y.toFixed(3))
    s.lookZ = Number(controls.target.z.toFixed(3))
  }
}

// Fonction pour gérer le clic sur un objet précis
// Constantes pour identifier les meshes
const LAPTOP_PARTS = ['laptop_bottom', 'laptop_cover', 'screen', 'Plane006_1', 'Plane006_2', 'Plane002', 'Plane003', 'Plane004'] // Inclus anciens et nouveaux noms au cas où
const PHONE_PREFIX = 'Plane038_'
const BOOK_PARTS = ['book', 'book001', 'book002', 'book003', 'book_shelf']
const LIGHT_SWITCH = 'light_switch'

// Récupère le nom du mesh réellement touché par le rayon
const getHitMeshName = (event) => {
  return event?.intersection?.object?.name || event?.object?.name || ''
}

// Helper pour vérifier si on clique sur un élément interactif
const isInteractive = (meshName) => {
  if (!meshName) return false
  return (
    LAPTOP_PARTS.includes(meshName) ||
    meshName.startsWith(PHONE_PREFIX) ||
    BOOK_PARTS.includes(meshName) ||
    meshName === LIGHT_SWITCH
  )
}

// 📥 À la fin du chargement du modèle, forcer les ombres
const onModelLoaded = (gltf) => {
  const modelToTraverse = gltf?.scene || gltf
  if (modelToTraverse?.traverse) {
    modelToTraverse.traverse((node) => {
      if (node.isMesh) {
        node.receiveShadow = true
        
        // Empêcher les murs transparents/fenêtres de projeter des ombres massives
        const name = node.name.toLowerCase()
        if (name.includes('window') || node.material?.transparent) {
             node.castShadow = false
        } else {
             node.castShadow = true
        }

        // Améliorer l'acné d'ombre sur les petits détails
        if (node.material) {
          node.material.shadowSide = 1 // THREE.BackSide diminue l'acné d'ombre
        }
      }
    })
  }
}

// 🔍 Clic sur un objet
const onModelClick = (event) => {
  if (animating.value || activeElement.value) return // Ignore les autres clics si on est déjà zoomé

  const meshName = getHitMeshName(event)
  
  if (LAPTOP_PARTS.includes(meshName)) {
    zoomTo('laptop')
  } else if (meshName.startsWith(PHONE_PREFIX)) {
    zoomTo('phone')
  } else if (BOOK_PARTS.includes(meshName)) {
    zoomTo('books')
  } else if (meshName === LIGHT_SWITCH) {
    toggleLight()
    console.log(isDarkMode.value ? "🌙 Nuit activée !" : "☀️ Jour activé !")
  }
}

// Mouvement sur le modèle — détecte le mesh survolé en continu
const onPointerMove = (event) => {
  const meshName = getHitMeshName(event)
  
  if (isInteractive(meshName)) {
    if (!isHovered.value) {
      isHovered.value = true
      document.body.style.cursor = 'pointer'
    }
  } else {
    if (isHovered.value) {
      isHovered.value = false
      document.body.style.cursor = 'auto'
    }
  }
}

// Sortie complète du modèle
const onPointerOut = () => {
  isHovered.value = false
  document.body.style.cursor = 'auto'
}

const zoomTo = (target) => {
  if (activeElement.value !== null || !cameraRef.value) return

  const setting = settings.value[target]
  if (!setting) return

  activeElement.value = target // Verrouille l'interface pour empêcher d'autres clics
  animating.value = true
  isHovered.value = false
  document.body.style.cursor = 'auto'

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  const lookAtProxy = { x: controls?.target?.x ?? 0, y: controls?.target?.y ?? 0, z: controls?.target?.z ?? 0 }

  // Animation GSAP de l'objet Téléphone pour qu'il "lévite et tourne"
  if (target === 'phone') {
    const pg = getPhoneGroup()
    if (pg && pg.userData.originalPos) {
      console.log("Animation GSAP Lancée sur le téléphone")
      gsap.to(pg.position, {
        x: pg.userData.originalPos.x + phoneAnimConfig.value.posX,
        y: pg.userData.originalPos.y + phoneAnimConfig.value.posY,
        z: pg.userData.originalPos.z + phoneAnimConfig.value.posZ,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      gsap.to(pg.rotation, {
        x: pg.userData.originalRot.x + (phoneAnimConfig.value.rotX * Math.PI / 180), 
        y: pg.userData.originalRot.y + (phoneAnimConfig.value.rotY * Math.PI / 180),
        z: pg.userData.originalRot.z + (phoneAnimConfig.value.rotZ * Math.PI / 180),
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          showPhoneContent.value = true // Le téléphone est arrivé, on allume l'écran !
        }
      })
    }
  } // Fin de l'animation objet

  gsap.to(cameraRef.value.position, {
    x: setting.camX, y: setting.camY, z: setting.camZ,
    duration: 1.5, ease: "power2.inOut",
    onUpdate: () => {
      cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
    }
  })

  gsap.to(lookAtProxy, {
    x: setting.lookX, y: setting.lookY, z: setting.lookZ,
    duration: 1.5, ease: "power2.inOut",
    onComplete: () => {
      if (controls?.target) {
        controls.target.set(setting.lookX, setting.lookY, setting.lookZ)
      }
      cameraRef.value.lookAt(setting.lookX, setting.lookY, setting.lookZ)
      animating.value = false
    }
  })
}

const resetZoom = () => {
  if (animating.value) return
  animating.value = true
  activeElement.value = null

  // --- RESTAURER LA SCÈNE (Téléphone) ---
  if (phoneGroup && phoneGroup.userData.originalPos) {
    showPhoneContent.value = false // Cacher l'écran du tel immédiatement
    gsap.killTweensOf(phoneGroup.position)
    gsap.killTweensOf(phoneGroup.rotation)
    gsap.to(phoneGroup.position, {
      x: phoneGroup.userData.originalPos.x,
      y: phoneGroup.userData.originalPos.y,
      z: phoneGroup.userData.originalPos.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
    gsap.to(phoneGroup.rotation, {
      x: phoneGroup.userData.originalRot.x,
      y: phoneGroup.userData.originalRot.y,
      z: phoneGroup.userData.originalRot.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  const resetTarget = { x: 0, y: 1, z: 0 }
  const lookAtProxy = { 
    x: controls?.target?.x ?? 0, 
    y: controls?.target?.y ?? 0, 
    z: controls?.target?.z ?? 0 
  }

  gsap.to(cameraRef.value.position, {
    x: 4, y: 3, z: 4,
    duration: 1.5, ease: "power2.inOut",
    onUpdate: () => {
      cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
    },
    onComplete: () => {
      // 🔓 ON RÉACTIVE LES CONTRÔLES SEULEMENT QUAND LE RETOUR EST FINI
      if (controls) {
        controls.target.set(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
        controls.enabled = true
      }
    }
  })

  gsap.to(lookAtProxy, {
    x: resetTarget.x, y: resetTarget.y, z: resetTarget.z,
    duration: 1.5, ease: "power2.inOut",
    onComplete: () => {
      animating.value = false
    }
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>