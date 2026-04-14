<template>
  <div class="relative h-screen w-full bg-zinc-950 overflow-hidden">

    <!-- 🔧 TOGGLE CALIBRATION MODE (toujours visible, coin bas-droite) -->
    <button v-if="ENABLE_CALIBRATION_UI" @click="calibrationMode = !calibrationMode"
      class="absolute bottom-20 right-4 z-[200] p-3 rounded-lg text-sm font-bold border-2 transition-all pointer-events-auto shadow-lg"
      :class="calibrationMode ? 'bg-green-600/90 hover:bg-green-500 border-green-400 text-white' : 'bg-zinc-800/90 hover:bg-zinc-700 border-zinc-600 text-zinc-300'">
      {{ calibrationMode ? '🔓 ON' : '🔒 Calibration' }}
    </button>

    <!-- 💡 BOUTON POUR AFFICHER LA CALIBRATION LUMIÈRE -->
    <button v-if="calibrationMode && !showLightCalibration" @click="showLightCalibration = true"
      class="absolute top-10 left-10 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-zinc-600">
      💡 Régler Lumières
    </button>

    <!-- 📷 BOUTON POUR AFFICHER LA CALIBRATION CAMÉRA -->
    <button v-if="calibrationMode && !showCameraCalibration" @click="showCameraCalibration = true"
      class="absolute top-10 left-52 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-cyan-600">
      📷 Régler Caméra
    </button>

    <!-- 📱 BOUTON CALIBRATION LABELS MOBILE -->
    <button v-if="calibrationMode && !showLabelCalibration" @click="showLabelCalibration = true"
      class="absolute top-10 left-[170px] z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-pink-600">
      📱 Labels
    </button>

    <!-- 📱 BOUTON CALIBRATION CAMÉRA MOBILE -->
    <button v-if="calibrationMode && !showMobileCamCalibration" @click="showMobileCamCalibration = true"
      class="absolute top-20 left-52 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-orange-600">
      📱 Cam Mobile
    </button>

    <!-- 📱 BOUTON CALIBRATION DRAWER -->
    <button v-if="calibrationMode && !showDrawerCamCalibration" @click="showDrawerCamCalibration = true"
      class="absolute top-20 left-96 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-amber-600">
      📦 Cam Drawer
    </button>

    <!-- 📚 BOUTON CALIBRATION BOOKSHELF -->
    <button v-if="calibrationMode && !showBookshelfCamCalibration" @click="showBookshelfCamCalibration = true"
      class="absolute top-32 left-52 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-purple-600">
      📚 Cam Bookshelf
    </button>

    <!-- 🃏 BOUTON CALIBRATION SOCIALS -->
    <button v-if="calibrationMode && !showSocialsCamCalibration" @click="showSocialsCamCalibration = true"
      class="absolute top-32 left-96 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-teal-600">
      🃏 Cam Socials
    </button>

    <!-- 🃏 PANNEAU CALIBRATION SOCIALS -->
    <div v-if="showSocialsCamCalibration"
      class="absolute top-4 left-4 z-200 pointer-events-none">
      <div class="bg-black/50 backdrop-blur-md text-white p-3 rounded-lg border border-teal-500/40 text-[11px] font-mono pointer-events-auto w-56 space-y-2">
        <div class="flex justify-between items-center">
          <span class="font-bold text-teal-400">🃏 Cam Socials</span>
          <button @click="showSocialsCamCalibration = false" class="text-zinc-400 hover:text-white text-base">✕</button>
        </div>
        <div class="text-teal-300 font-bold">Position</div>
        <div v-for="axis in ['x','y','z']" :key="'scp'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="settings.socials['cam' + axis.toUpperCase()]" class="flex-1 accent-teal-500 h-4" @input="applySocialsCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ settings.socials['cam' + axis.toUpperCase()].toFixed(2) }}</span>
        </div>
        <div class="text-teal-300 font-bold">LookAt</div>
        <div v-for="axis in ['x','y','z']" :key="'scl'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="settings.socials['look' + axis.toUpperCase()]" class="flex-1 accent-teal-500 h-4" @input="applySocialsCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ settings.socials['look' + axis.toUpperCase()].toFixed(2) }}</span>
        </div>
        <div class="flex gap-1">
          <button @click="zoomTo('socials'); nextTick(() => levitateSocialCards(true))" class="flex-1 py-1.5 bg-teal-700/80 hover:bg-teal-600 rounded text-white font-bold text-xs">▶ Test</button>
          <button @click="copySocialsCamPositions" class="flex-1 py-1.5 bg-teal-600/80 hover:bg-teal-500 rounded text-white font-bold text-xs">📋 Copier</button>
        </div>
      </div>
    </div>

    <!-- 📚 PANNEAU CALIBRATION BOOKSHELF -->
    <div v-if="showBookshelfCamCalibration"
      class="absolute top-4 right-4 z-200 pointer-events-none">
      <div class="bg-black/50 backdrop-blur-md text-white p-3 rounded-lg border border-purple-500/40 text-[11px] font-mono pointer-events-auto w-56 space-y-2">
        <div class="flex justify-between items-center">
          <span class="font-bold text-purple-400">📚 Cam Bookshelf</span>
          <button @click="showBookshelfCamCalibration = false" class="text-zinc-400 hover:text-white text-base">✕</button>
        </div>
        <div class="text-purple-300 font-bold">Position</div>
        <div v-for="axis in ['x','y','z']" :key="'bsp'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="settings.bookshelf['cam' + axis.toUpperCase()]" class="flex-1 accent-purple-500 h-4" @input="applyBookshelfCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ settings.bookshelf['cam' + axis.toUpperCase()].toFixed(2) }}</span>
        </div>
        <div class="text-purple-300 font-bold">LookAt</div>
        <div v-for="axis in ['x','y','z']" :key="'bsl'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="settings.bookshelf['look' + axis.toUpperCase()]" class="flex-1 accent-purple-500 h-4" @input="applyBookshelfCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ settings.bookshelf['look' + axis.toUpperCase()].toFixed(2) }}</span>
        </div>
        <div class="flex gap-1">
          <button @click="zoomTo('bookshelf')" class="flex-1 py-1.5 bg-purple-700/80 hover:bg-purple-600 rounded text-white font-bold text-xs">▶ Test</button>
          <button @click="copyBookshelfCamPositions" class="flex-1 py-1.5 bg-purple-600/80 hover:bg-purple-500 rounded text-white font-bold text-xs">📋 Copier</button>
        </div>
      </div>
    </div>

    <!-- 📱 PANNEAU CALIBRATION CAMÉRA MOBILE -->
    <div v-if="showMobileCamCalibration"
      class="absolute top-20 right-4 z-[100] pointer-events-none">
      <div class="bg-black/50 backdrop-blur-md text-white p-3 rounded-lg border border-orange-500/40 text-[11px] font-mono pointer-events-auto w-56 space-y-2">
        <div class="flex justify-between items-center">
          <span class="font-bold text-orange-400">📱 Cam Mobile</span>
          <button @click="showMobileCamCalibration = false" class="text-zinc-400 hover:text-white text-base">✕</button>
        </div>
        <div class="text-orange-300 font-bold">Position</div>
        <div v-for="axis in ['x','y','z']" :key="'mcp'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="mobileCamPos[axis]" class="flex-1 accent-orange-500 h-4" @input="applyMobileCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ mobileCamPos[axis].toFixed(2) }}</span>
        </div>
        <div class="text-orange-300 font-bold">LookAt initial</div>
        <div v-for="axis in ['x','y','z']" :key="'mcl'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="mobileLookAtInit[axis]" class="flex-1 accent-orange-500 h-4" @input="applyMobileCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ mobileLookAtInit[axis].toFixed(2) }}</span>
        </div>
        <button @click="copyMobileCamPositions"
          class="w-full py-1.5 bg-orange-600/80 hover:bg-orange-500 rounded text-white font-bold text-xs">
          📋 Copier
        </button>
      </div>
    </div>

    <!-- 📦 PANNEAU CALIBRATION CAMÉRA DRAWER -->
    <div v-if="showDrawerCamCalibration"
      class="absolute top-4 left-4 z-[200] pointer-events-none">
      <div class="bg-black/50 backdrop-blur-md text-white p-3 rounded-lg border border-amber-500/40 text-[11px] font-mono pointer-events-auto w-56 space-y-2">
        <div class="flex justify-between items-center">
          <span class="font-bold text-amber-400">📦 Cam Drawer</span>
          <button @click="showDrawerCamCalibration = false" class="text-zinc-400 hover:text-white text-base">✕</button>
        </div>
        <div class="text-amber-300 font-bold">Position</div>
        <div v-for="axis in ['x','y','z']" :key="'dcp'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="settings.drawer['cam' + axis.toUpperCase()]" class="flex-1 accent-amber-500 h-4" @input="applyDrawerCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ settings.drawer['cam' + axis.toUpperCase()].toFixed(2) }}</span>
        </div>
        <div class="text-amber-300 font-bold">LookAt</div>
        <div v-for="axis in ['x','y','z']" :key="'dcl'+axis" class="flex gap-1 items-center">
          <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
          <input type="range" :min="-1" :max="4" step="0.01" v-model.number="settings.drawer['look' + axis.toUpperCase()]" class="flex-1 accent-amber-500 h-4" @input="applyDrawerCamCalibration" />
          <span class="w-10 text-right text-zinc-300">{{ settings.drawer['look' + axis.toUpperCase()].toFixed(2) }}</span>
        </div>
        <div class="flex gap-1">
          <button @click="zoomTo('drawer')" class="flex-1 py-1.5 bg-amber-700/80 hover:bg-amber-600 rounded text-white font-bold text-xs">▶ Test</button>
          <button @click="copyDrawerCamPositions" class="flex-1 py-1.5 bg-amber-600/80 hover:bg-amber-500 rounded text-white font-bold text-xs">📋 Copier</button>
        </div>
      </div>
    </div>

    <!-- 📱 PANNEAU CALIBRATION LABELS MOBILE -->
    <div v-if="showLabelCalibration"
      class="absolute bottom-12 left-2 right-2 z-[100] pointer-events-none">
      <div class="bg-black/50 backdrop-blur-md text-white p-2 rounded-lg border border-pink-500/40 text-[10px] font-mono pointer-events-auto max-h-[40vh] overflow-y-auto"
        style="touch-action: pan-y; -webkit-overflow-scrolling: touch;">
        <div class="flex justify-between items-center mb-1 sticky top-0 bg-black/80 py-1 -mx-2 px-2 z-10">
          <span class="font-bold text-pink-400">📱 Labels</span>
          <div class="flex gap-2">
            <button @click="copyLabelPositions" class="px-2 py-0.5 bg-pink-600/80 rounded text-white font-bold">📋 Copier</button>
            <button @click="showLabelCalibration = false" class="text-zinc-400 hover:text-white text-base">✕</button>
          </div>
        </div>
        <div class="space-y-1.5">
          <div v-for="label in mobileLabels" :key="label.id" class="border border-zinc-700/50 rounded p-1.5 bg-black/30">
            <div class="font-bold text-pink-300 mb-0.5">{{ label.name }}</div>
            <div v-for="axis in ['x','y','z']" :key="axis" class="flex gap-1 items-center">
              <span class="w-3 text-zinc-500 uppercase">{{ axis }}</span>
              <input type="range" :min="axis === 'y' ? 0 : -1" :max="axis === 'y' ? 4 : 3" step="0.01" v-model.number="label[axis]" class="flex-1 accent-pink-500 h-4" style="touch-action: none;" />
              <span class="w-10 text-right text-zinc-300">{{ label[axis].toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 📦 MINI MENU PROJETS (Drawer ouvert, mobile) -->
    <Transition name="fade">
      <div v-if="mobileMode && activeElement === 'drawer'"
        class="absolute bottom-6 left-3 right-3 z-150 pointer-events-auto">
        <div class="bg-black/60 backdrop-blur-lg rounded-2xl border border-zinc-700/50 p-3 space-y-2">
          <div class="text-center text-zinc-400 text-[11px] font-semibold uppercase tracking-widest mb-1">Choisir un projet</div>
          <div class="space-y-1.5">
            <button v-for="(proj, key) in projects" :key="key"
              @click="selectProjectFromDrawer(key)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.97]"
              :style="{ background: proj.color + '15', border: '1px solid ' + proj.color + '40' }">
              <span class="text-xl shrink-0">{{ proj.badge }}</span>
              <div class="text-left flex-1 min-w-0">
                <div class="text-white text-sm font-bold truncate">{{ proj.title }}</div>
                <div class="text-zinc-400 text-[10px] truncate">{{ proj.tagline }}</div>
              </div>
              <span class="text-zinc-500 text-lg shrink-0">›</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 📚 MINI MENU LIVRES (Bookshelf close-up, mobile) -->
    <Transition name="fade">
      <div v-if="mobileMode && activeElement === 'bookshelf'"
        class="absolute bottom-6 left-3 right-3 z-150 pointer-events-auto">
        <div class="bg-black/60 backdrop-blur-lg rounded-2xl border border-zinc-700/50 p-3 space-y-2">
          <div class="text-center text-zinc-400 text-[11px] font-semibold uppercase tracking-widest mb-1">Choisir un livre</div>
          <div class="space-y-1.5">
            <button v-for="(book, key) in books" :key="key"
              @click="selectBookFromShelf(key)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.97]"
              :style="{ background: book.color + '15', border: '1px solid ' + book.color + '40' }">
              <span class="text-xl shrink-0">{{ book.badge }}</span>
              <div class="text-left flex-1 min-w-0">
                <div class="text-white text-sm font-bold truncate">{{ book.title }}</div>
                <div class="text-zinc-400 text-[10px] truncate">{{ book.desc }}</div>
              </div>
              <span class="text-zinc-500 text-lg shrink-0">›</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 🔍 BOUTON DEBUG MESHS -->
    <button v-if="calibrationMode" @click="showMeshNames = !showMeshNames"
      class="absolute top-20 left-10 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border"
      :class="showMeshNames ? 'border-green-500 text-green-400' : 'border-zinc-600'">
      {{ showMeshNames ? '👁️ Cacher Noms Meshs' : '🔍 Afficher Noms Meshs' }}
    </button>

    <!-- 🟢 OVERLAY NOM MESH COURANT -->
    <div v-if="showMeshNames && hoveredMeshName"
      class="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black/90 text-green-400 p-4 rounded-lg border-2 border-green-500 font-mono text-lg shadow-[0_0_15px_rgba(34,197,94,0.5)] pointer-events-none transition-all">
      Mesh survolé : <span class="font-bold text-white">{{ hoveredMeshName }}</span>
    </div>

    <!-- 🛠️ INTERFACE DE CALIBRATION LUMIÈRES -->
    <div v-if="calibrationMode && showLightCalibration"
      class="absolute top-10 left-10 z-[100] bg-zinc-800/90 text-white p-4 rounded text-xs w-[250px] max-h-[80vh] overflow-y-auto pointer-events-auto shadow-2xl">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-yellow-400">Calibration Lumières</h3>
        <button @click="showLightCalibration = false"
          class="text-red-400 font-bold px-2 hover:bg-zinc-700 rounded">X</button>
      </div>
      <div class="mb-2 border-b border-zinc-600 pb-2">
        <label class="block font-bold">☀️ Soleil Pos (Jour)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.sun.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.5" v-model.number="lightPos.sun.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.5" v-model.number="lightPos.sun.z" class="w-full bg-black/50 p-1 mb-1" />
        <label class="block font-bold text-gray-400">Taille de l'ombre (Frustum)</label>
        <input type="number" step="1" v-model.number="lightPos.sun.frustum" class="w-full bg-black/50 p-1 mb-1" />

        <label class="block font-bold text-orange-400 mt-2">Intensité Soleil & Ambiance</label>
        Soleil (Intensité): <input type="number" step="0.5" v-model.number="lightState.window"
          class="w-full bg-black/50 p-1 mb-1" />
        Ambiance (Jour): <input type="number" step="0.1" v-model.number="lightState.ambient"
          class="w-full bg-black/50 p-1 mb-1" />
        Environnement GLOBAL: <input type="number" step="0.1" v-model.number="lightState.envIntensity"
          class="w-full bg-black/50 p-1 mb-1" @input="updateEnvIntensity" />

        <label class="block font-bold text-red-500 mt-2">🎯 Cible du Soleil (Où il pointe)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.x" class="w-full bg-black/50 p-1 mb-1"
          @input="updateSunTarget" />
        y: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.y" class="w-full bg-black/50 p-1 mb-1"
          @input="updateSunTarget" />
        z: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.z" class="w-full bg-black/50 p-1 mb-1"
          @input="updateSunTarget" />

        <label class="block font-bold text-yellow-300 mt-2">✨ God Ray (Rayon volumétrique)</label>
        x: <input type="number" step="0.1" v-model.number="lightPos.godRay.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.1" v-model.number="lightPos.godRay.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.1" v-model.number="lightPos.godRay.z" class="w-full bg-black/50 p-1 mb-1" />
        rotX (deg): <input type="number" step="5" v-model.number="lightPos.godRay.rotX"
          class="w-full bg-black/50 p-1 mb-1" />
        rotY (deg): <input type="number" step="5" v-model.number="lightPos.godRay.rotY"
          class="w-full bg-black/50 p-1 mb-1" />
        rotZ (deg): <input type="number" step="5" v-model.number="lightPos.godRay.rotZ"
          class="w-full bg-black/50 p-1 mb-1" />
        Opacité: <input type="number" step="0.05" v-model.number="lightPos.godRay.opacity"
          class="w-full bg-black/50 p-1 mb-1" @input="updateGodRayOpacity" />
      </div>
      <div>
        <label class="block font-bold text-blue-400">🌙 Lampe Bureau (Nuit)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.desk.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.5" v-model.number="lightPos.desk.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.5" v-model.number="lightPos.desk.z" class="w-full bg-black/50 p-1 mb-1" />
        Lampe (Intensité): <input type="number" step="1" v-model.number="lightState.desk"
          class="w-full bg-black/50 p-1 mb-1" />
      </div>
    </div>

    <!-- 📷 INTERFACE DE CALIBRATION CAMÉRA -->
    <div v-if="calibrationMode && showCameraCalibration"
      class="absolute top-10 left-[280px] z-[100] bg-zinc-900/95 text-white p-4 rounded-lg text-xs w-[280px] max-h-[85vh] overflow-y-auto pointer-events-auto shadow-2xl border border-cyan-700/50">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-cyan-400 text-sm">📷 Calibration Caméra</h3>
        <button @click="showCameraCalibration = false"
          class="text-red-400 font-bold px-2 hover:bg-zinc-700 rounded">X</button>
      </div>

      <!-- LIVE READOUT -->
      <div class="mb-3 p-2 bg-black/60 rounded border border-zinc-700">
        <label class="block font-bold text-green-400 mb-1">🔴 Position actuelle (LIVE)</label>
        <div class="font-mono text-[10px] text-green-300 space-y-0.5">
          <div>Cam: x={{ liveCamPos.x }} y={{ liveCamPos.y }} z={{ liveCamPos.z }}</div>
          <div>Target: x={{ liveCamTarget.x }} y={{ liveCamTarget.y }} z={{ liveCamTarget.z }}</div>
          <div class="text-yellow-300 mt-1">Polar: {{ liveAngles.polar }}° | Azimuth: {{ liveAngles.azimuth }}° | Dist:
            {{ liveAngles.distance }}</div>
        </div>
      </div>

      <!-- POSITION PAR DÉFAUT (HOME) -->
      <div class="mb-3 border-b border-zinc-600 pb-3">
        <label class="block font-bold text-cyan-300 mb-1">🏠 Position d'accueil (Home)</label>
        <div class="mb-2">
          <label class="block text-zinc-400">Caméra Position</label>
          x: <input type="number" step="0.1" v-model.number="defaultCamPos.x"
            class="w-full bg-black/50 p-1 mb-1 rounded" />
          y: <input type="number" step="0.1" v-model.number="defaultCamPos.y"
            class="w-full bg-black/50 p-1 mb-1 rounded" />
          z: <input type="number" step="0.1" v-model.number="defaultCamPos.z"
            class="w-full bg-black/50 p-1 mb-1 rounded" />
        </div>
        <div class="mb-2">
          <label class="block text-zinc-400">LookAt (Cible)</label>
          x: <input type="number" step="0.1" v-model.number="defaultLookAt.x"
            class="w-full bg-black/50 p-1 mb-1 rounded" />
          y: <input type="number" step="0.1" v-model.number="defaultLookAt.y"
            class="w-full bg-black/50 p-1 mb-1 rounded" />
          z: <input type="number" step="0.1" v-model.number="defaultLookAt.z"
            class="w-full bg-black/50 p-1 mb-1 rounded" />
        </div>
      </div>

      <!-- ORBIT CONSTRAINTS -->
      <div class="mb-3 border-b border-zinc-600 pb-3">
        <label class="block font-bold text-yellow-300 mb-2">🔒 Limites Orbit Controls</label>

        <!-- ZOOM (DISTANCE) -->
        <div class="mb-3 p-2 bg-black/40 rounded">
          <label class="block font-bold text-blue-300 text-[11px] mb-1">🔍 Zoom (Distance)</label>
          <p class="text-zinc-500 text-[9px] mb-1 italic">Combien l'utilisateur peut zoomer/dézoomer. Plus petit = plus
            proche du bureau, plus grand = plus de recul.</p>
          <div class="grid grid-cols-2 gap-1">
            <div>
              <label class="block text-zinc-400 text-[10px]">Min (zoom max)</label>
              <input type="range" min="0.5" max="5" step="0.1" v-model.number="orbitLimits.minDistance"
                class="w-full" />
              <input type="number" step="0.1" v-model.number="orbitLimits.minDistance"
                class="w-full bg-black/50 p-1 rounded text-center" />
            </div>
            <div>
              <label class="block text-zinc-400 text-[10px]">Max (dézoom max)</label>
              <input type="range" min="2" max="15" step="0.5" v-model.number="orbitLimits.maxDistance" class="w-full" />
              <input type="number" step="0.5" v-model.number="orbitLimits.maxDistance"
                class="w-full bg-black/50 p-1 rounded text-center" />
            </div>
          </div>
        </div>

        <!-- POLAR (VERTICAL) -->
        <div class="mb-3 p-2 bg-black/40 rounded">
          <label class="block font-bold text-orange-300 text-[11px] mb-1">📐 Angle Polaire (Haut ↕ Bas)</label>
          <p class="text-zinc-500 text-[9px] mb-1 italic">Contrôle la hauteur de la vue. 0° = plongée au-dessus. 90° =
            vue horizontale. 180° = vue d'en bas.</p>
          <div class="font-mono text-[9px] text-zinc-600 mb-2 leading-tight whitespace-pre"> 0° = 🔽 Vue plafond
            (plongée)
            45° = ↘ Vue 3/4 plongeante
            60° = ↗ Vue isométrique ← actuel min
            79° = → Vue quasi-horizontale ← actuel max
            90° = → Pile horizontale
            180° = 🔼 Vue sol (contre-plongée)</div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-orange-400 text-[10px] w-8">Min</span>
            <input type="range" min="0" max="90" step="1" v-model.number="orbitLimits.minPolarDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.minPolarDeg"
              class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-orange-400 text-[10px] w-8">Max</span>
            <input type="range" min="0" max="90" step="1" v-model.number="orbitLimits.maxPolarDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.maxPolarDeg"
              class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="text-green-400 text-[10px] mt-1 font-mono">👁️ Actuel : {{ liveAngles.polar }}°</div>
        </div>

        <!-- AZIMUTH (HORIZONTAL) -->
        <div class="mb-2 p-2 bg-black/40 rounded">
          <label class="block font-bold text-pink-300 text-[11px] mb-1">🧭 Angle Azimut (Gauche ↔ Droite)</label>
          <p class="text-zinc-500 text-[9px] mb-1 italic">Contrôle la rotation horizontale autour de la pièce. Permet de
            limiter pour ne pas voir derrière les murs.</p>
          <div class="font-mono text-[9px] text-zinc-600 mb-2 leading-tight whitespace-pre">-90° = ← Mur de gauche
            0° = ↑ Face (devant le bureau)
            +90° = → Mur de droite
            +180° = ↓ Derrière (mur du fond)</div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-pink-400 text-[10px] w-8">Min</span>
            <input type="range" min="-180" max="0" step="1" v-model.number="orbitLimits.minAzimuthDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.minAzimuthDeg"
              class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-pink-400 text-[10px] w-8">Max</span>
            <input type="range" min="0" max="180" step="1" v-model.number="orbitLimits.maxAzimuthDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.maxAzimuthDeg"
              class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="text-green-400 text-[10px] mt-1 font-mono">👁️ Actuel : {{ liveAngles.azimuth }}°</div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="space-y-2">
        <button @click="captureCurrentView"
          class="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors p-2 rounded font-bold text-white shadow-lg">
          📸 Capturer la vue actuelle → Home
        </button>
        <button @click="testHomePosition"
          class="w-full bg-green-600 hover:bg-green-500 transition-colors p-2 rounded font-bold text-white shadow-lg">
          ▶️ Tester (Aller à Home)
        </button>
        <button @click="copyCameraCode"
          class="w-full bg-purple-600 hover:bg-purple-500 transition-colors p-2 rounded font-bold text-white shadow-lg">
          📋 Copier le code
        </button>
      </div>

      <!-- CODE OUTPUT -->
      <div v-if="cameraCodeOutput"
        class="mt-3 p-2 bg-black/80 rounded border border-purple-500 font-mono text-[10px] text-purple-300 whitespace-pre-wrap">
        {{ cameraCodeOutput }}
      </div>
    </div>

    <!-- 🛠️ INTERFACE DE CALIBRATION (à activer via le flag calibrationMode) -->
    <div v-if="calibrationMode && activeElement"
      class="absolute top-10 right-10 z-[100] bg-zinc-800/90 text-white p-4 rounded text-xs w-[300px] pointer-events-auto max-h-[80vh] overflow-y-auto">
      <h3 class="font-bold mb-2 text-orange-400">Calibration : {{ activeElement }}</h3>

      <button @click="copyCurrentCamera"
        class="w-full bg-blue-600 hover:bg-blue-500 transition-colors p-2 rounded mb-3 font-bold text-white shadow-lg">
        📸 Utiliser la vue actuelle (Souris)
      </button>

      <div class="mb-4">
        <label class="block font-bold mt-2">Caméra Pos</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].camX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].camY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].camZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
      </div>

      <div class="mb-4">
        <label class="block font-bold">LookAt Target</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].lookX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].lookY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].lookZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateCalibration" />
      </div>

      <div class="mt-4 pt-2 border-t border-zinc-600">
        <label class="block font-bold text-blue-300">HTML Pos (TresGroup)</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlPosX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlPosY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlPosZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <div class="mb-4">
        <label class="block font-bold text-blue-300">HTML Rot</label>
        x: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlRotX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        y: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlRotY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        z: <input type="number" step="0.01" v-model.number="settings[activeElement].htmlRotZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <div class="mb-4">
        <label class="block font-bold text-blue-300">Scale</label>
        scale: <input type="number" step="0.001" v-model.number="settings[activeElement].scale"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <div>
        <label class="block font-bold text-purple-400">Dimensions HTML (px)</label>
        width: <input type="number" step="1" v-model.number="settings[activeElement].width"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
        height: <input type="number" step="1" v-model.number="settings[activeElement].height"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" />
      </div>
      <!-- SECTION USB / OBJETS 3D -->
      <div v-if="activeElement === 'usb' || activeElement === 'github' || activeElement === 'linkedin'" class="mt-4 border-t border-zinc-600 pt-2">
        <label class="block font-bold text-yellow-400 mb-2">Objet 3D : {{ activeElement }}</label>
        <div class="space-y-3">
          <div>
            <label class="block text-zinc-400 font-mono">X Pos: {{ settings[activeElement].posX }}</label>
            <input type="range" min="-1" max="3" step="0.001" v-model.number="settings[activeElement].posX" class="w-full" />
            <input type="number" step="0.001" v-model.number="settings[activeElement].posX" class="w-full bg-black/40 p-1" />
          </div>
          <div>
            <label class="block text-zinc-400 font-mono">Y Pos: {{ settings[activeElement].posY }}</label>
            <input type="range" min="-1" max="3" step="0.001" v-model.number="settings[activeElement].posY" class="w-full" />
            <input type="number" step="0.001" v-model.number="settings[activeElement].posY" class="w-full bg-black/40 p-1" />
          </div>
          <div>
            <label class="block text-zinc-400 font-mono">Z Pos: {{ settings[activeElement].posZ }}</label>
            <input type="range" min="-1" max="3" step="0.001" v-model.number="settings[activeElement].posZ" class="w-full" />
            <input type="number" step="0.001" v-model.number="settings[activeElement].posZ" class="w-full bg-black/40 p-1" />
          </div>
          <div class="pt-2 border-t border-zinc-700">
             <label class="block text-zinc-400 font-mono">X Rot (deg): {{ settings[activeElement].rotX }}</label>
             <input type="range" min="-180" max="180" step="1" v-model.number="settings[activeElement].rotX" class="w-full" />
          </div>
          <div>
             <label class="block text-zinc-400 font-mono">Y Rot (deg): {{ settings[activeElement].rotY }}</label>
             <input type="range" min="-180" max="180" step="1" v-model.number="settings[activeElement].rotY" class="w-full" />
          </div>
          <div>
             <label class="block text-zinc-400 font-mono">Z Rot (deg): {{ settings[activeElement].rotZ }}</label>
             <input type="range" min="-180" max="180" step="1" v-model.number="settings[activeElement].rotZ" class="w-full" />
          </div>
        </div>
      </div>

      <!-- SECTON TÉLÉPHONE 3D (Seulement si le téléphone est zoomé) -->
      <div v-if="activeElement === 'phone'" class="mt-4 border-t border-zinc-600 pt-2">
        <h3 class="font-bold text-green-400 mb-2">📱 Animation Téléphone 3D</h3>
        Décalage (X): <input type="number" step="0.1" v-model.number="phoneAnimConfig.posX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Lévitation (Y): <input type="number" step="0.1" v-model.number="phoneAnimConfig.posY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Décalage (Z): <input type="number" step="0.1" v-model.number="phoneAnimConfig.posZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Rotation X (deg): <input type="number" step="5" v-model.number="phoneAnimConfig.rotX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Rotation Y (deg): <input type="number" step="5" v-model.number="phoneAnimConfig.rotY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
        Rotation Z (deg): <input type="number" step="5" v-model.number="phoneAnimConfig.rotZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updatePhoneAnim" />
      </div>

      <!-- SECTON LIVRE 3D -->
      <div v-if="activeElement === 'books'" class="mt-4 border-t border-zinc-600 pt-2 max-h-[300px] overflow-y-auto">
        <h3 class="font-bold text-blue-400 mb-2">📚 Animation Livre 3D</h3>
        <h4 class="font-bold text-xs text-zinc-300">Position Finale (Absolue)</h4>
        Pos Cible X: <input type="number" step="0.1" v-model.number="bookAnimConfig.targetPosX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Pos Cible Y: <input type="number" step="0.1" v-model.number="bookAnimConfig.targetPosY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Pos Cible Z: <input type="number" step="0.1" v-model.number="bookAnimConfig.targetPosZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Rot Globale X: <input type="number" step="5" v-model.number="bookAnimConfig.baseRotX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Rot Globale Y: <input type="number" step="5" v-model.number="bookAnimConfig.baseRotY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Rot Globale Z: <input type="number" step="5" v-model.number="bookAnimConfig.baseRotZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />

        <h4 class="font-bold text-xs text-pink-300 mt-2">Ouverture (Couverture)</h4>
        Ouvrir Axe X: <input type="number" step="5" v-model.number="bookAnimConfig.coverRotX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Ouvrir Axe Y: <input type="number" step="5" v-model.number="bookAnimConfig.coverRotY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Ouvrir Axe Z: <input type="number" step="5" v-model.number="bookAnimConfig.coverRotZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
      </div>

      <!-- SECTON DOSSIER 3D -->
      <div v-if="activeElement === 'folder'" class="mt-4 border-t border-zinc-600 pt-2 max-h-[300px] overflow-y-auto">
        <h3 class="font-bold text-yellow-400 mb-2">📁 Animation Dossier 3D</h3>
        <h4 class="font-bold text-xs text-zinc-300">Position Finale (Absolue)</h4>
        Pos Cible X: <input type="number" step="0.1" v-model.number="folderAnimConfig.targetPosX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Pos Cible Y: <input type="number" step="0.1" v-model.number="folderAnimConfig.targetPosY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Pos Cible Z: <input type="number" step="0.1" v-model.number="folderAnimConfig.targetPosZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Rot Globale X: <input type="number" step="5" v-model.number="folderAnimConfig.baseRotX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Rot Globale Y: <input type="number" step="5" v-model.number="folderAnimConfig.baseRotY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Rot Globale Z: <input type="number" step="5" v-model.number="folderAnimConfig.baseRotZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />

        <h4 class="font-bold text-xs text-pink-300 mt-2">Ouverture (Couverture)</h4>
        Ouvrir Axe X: <input type="number" step="5" v-model.number="folderAnimConfig.coverRotX"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Ouvrir Axe Y: <input type="number" step="5" v-model.number="folderAnimConfig.coverRotY"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Ouvrir Axe Z: <input type="number" step="5" v-model.number="folderAnimConfig.coverRotZ"
          class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
      </div>
    </div>

    <!-- TOOLTIP INTERACTIF (style jeu vidéo) -->
    <Transition name="tooltip-fade">
      <div
        v-if="hoverTooltip.visible && !activeElement && !mobileMode"
        class="hover-tooltip"
        :style="{ left: hoverTooltip.x + 'px', top: hoverTooltip.y + 'px' }"
      >
        <span class="tooltip-indicator">▸</span>
        <span class="tooltip-text">{{ hoverTooltip.text }}</span>
      </div>
    </Transition>

    <TresCanvas :clear-color="isDarkMode ? '#050505' : '#e0f2fe'" shadows window-size @pointer-missed="onPointerMissed">
      <TresPerspectiveCamera ref="cameraRef" :position="[1.79, 2.26, 2.58]" :look-at="[1.31, 1.62, 0.06]" />

      <OrbitControls ref="controlsRef" :enabled="!animating && !activeElement && !mobileMode" :enable-pan="calibrationMode"
        :min-distance="orbitLimits.minDistance"
        :max-distance="(calibrationMode || activeElement) ? 50 : orbitLimits.maxDistance"
        :min-polar-angle="(calibrationMode || activeElement) ? 0 : (orbitLimits.minPolarDeg * Math.PI / 180)"
        :max-polar-angle="(calibrationMode || activeElement) ? Math.PI : (orbitLimits.maxPolarDeg * Math.PI / 180)"
        :min-azimuth-angle="(calibrationMode || activeElement) ? -Infinity : (orbitLimits.minAzimuthDeg * Math.PI / 180)"
        :max-azimuth-angle="(calibrationMode || activeElement) ? Infinity : (orbitLimits.maxAzimuthDeg * Math.PI / 180)"
        @change="updateLiveCamReadout" />

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
      <!-- On passe d'une DirectionalLight à une SpotLight pour éviter que la lumière ne passe par-dessus les murs sans plafond ! -->
      <TresSpotLight ref="sunLightRef" :position="[lightPos.sun.x, lightPos.sun.y, lightPos.sun.z]"
        :intensity="lightState.window" :angle="Math.PI / 6" :penumbra="0.3" :decay="0" :distance="100" color="#fff0dd"
        cast-shadow :shadow-mapSize-width="4096" :shadow-mapSize-height="4096" :shadow-bias="-0.0005"
        :shadow-normalBias="0.05">
        <TresObject3D attach="target" :position="[lightPos.sunTarget.x, lightPos.sunTarget.y, lightPos.sunTarget.z]" />
      </TresSpotLight>

      <!-- ✨ FAUX RAYONS VOLUMÉTRIQUES (GOD RAYS) DE LA FENÊTRE -->
      <!-- On l'enveloppe dans un Groupe pour pouvoir définir l'origine de rotation (pivot) tout en haut, façon lampe torche ! -->
      <TresGroup v-if="!isDarkMode" :position="[lightPos.godRay.x, lightPos.godRay.y, lightPos.godRay.z]"
        :rotation="[lightPos.godRay.rotX * (Math.PI / 180), lightPos.godRay.rotY * (Math.PI / 180), lightPos.godRay.rotZ * (Math.PI / 180)]">
        <!-- AIDES VISUELLES : Axes X (Rouge), Y (Vert), Z (Bleu) pour guider la visée au point de départ -->
        <TresAxesHelper v-if="calibrationMode" :args="[5]" />

        <!-- Le mesh est décalé vers le bas (y: -7.5 car longueur 15) pour pivoter depuis sa base -->
        <!-- La rotation Math.PI/4 (45°) convertit sa forme de losange par défaut en forme carrée ! -->
        <TresMesh :position="[0, -7.5, 0]" :rotation="[0, Math.PI / 4, 0]">
          <!-- Cylindre à 4 faces = Pyramide évasée pour la fenêtre -->
          <TresCylinderGeometry :args="[0.4, 3.0, 15, 4, 1, true]" />
          <TresShaderMaterial :transparent="true" :depthWrite="false" :blending="2" :side="2" :uniforms="godRayUniforms"
            :vertexShader="`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `" :fragmentShader="`
              varying vec2 vUv;
              uniform float uOpacity;
              void main() {
                // Disparition douce vers le bas (y=1 est en haut vers la fenêtre, y=0 en bas)
                float alpha = pow(vUv.y, 1.5);
                
                // Adoucissement très léger des 4 arêtes pour un effet poussière de lumière
                float edges = abs(sin(vUv.x * 3.14159 * 4.0));
                alpha *= (0.3 + 0.7 * edges);
                
                gl_FragColor = vec4(1.0, 0.9, 0.65, alpha * uOpacity);
              }
            `" />
        </TresMesh>
      </TresGroup>

      <!-- LUMIÈRE LAMPE DE BUREAU (Nuit) -->
      <TresPointLight :position="[lightPos.desk.x, lightPos.desk.y, lightPos.desk.z]" :intensity="lightState.desk"
        :distance="10" color="#ffcc88" cast-shadow :shadow-bias="-0.001" />

      <!-- PÉNOMBRE BLEUTÉE (Nuit, ambiance claire de lune) -->
      <TresDirectionalLight :position="[-3, 5, -3]" :intensity="lightState.nightReflect" color="#3b82f6" />

      <!-- ECRAN LAPTOP -->
      <TresGroup v-if="activeElement === 'laptop' || activeElement === 'usb' || showIntro"
        :position="[settings.laptop.htmlPosX, settings.laptop.htmlPosY, settings.laptop.htmlPosZ]">
        <Html transform wrapper-class="ecran-virtuel" :rotation-x="settings.laptop.htmlRotX"
          :rotation-y="settings.laptop.htmlRotY" :rotation-z="settings.laptop.htmlRotZ" :scale="settings.laptop.scale">

        <!-- 1. MODE INTRODUCTION (Toujours prioritaire au début) -->
        <div v-if="showIntro"
          :style="{ width: settings.laptop.width + 'px', height: settings.laptop.height + 'px', backgroundColor: ot.bg, color: ot.text }"
          class="rounded-md pointer-events-auto overflow-hidden flex items-center justify-center">
          <div class="p-16 max-w-2xl text-center">
            <div class="flex items-center justify-center gap-4 mb-12">
              <div class="h-px w-20" :style="{ background: ot.textFaint }"></div>
              <span class="tracking-[0.3em] uppercase font-light" :style="{ color: ot.textFaint, fontSize: '18px' }">Portfolio</span>
              <div class="h-px w-20" :style="{ background: ot.textFaint }"></div>
            </div>
            <h1 class="font-black tracking-wide mb-6" :style="{ color: ot.text, fontSize: '72px' }">ANJAH Rakotovao</h1>
            <p class="font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12" style="font-size: 32px;">Développeur Web Fullstack</p>
            <p class="leading-relaxed mb-12" :style="{ color: ot.textMuted, fontSize: '20px' }">Passionné par l'innovation numérique, je conçois des solutions web modernes, fluides et performantes.</p>
            <div class="flex items-center justify-center gap-6">
              <a href="/CV-ANJAH.pdf" download="CV_Anjah_Rakotovao.pdf" class="flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition-all hover:scale-105" style="font-size: 16px;">
                <span style="width: 20px; height: 20px;" v-html="projectIcons['download']"></span> Télécharger CV
              </a>
              <button @click="showIntro = false; activeElement = 'laptop'" class="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-white text-black transition-all hover:scale-105" style="font-size: 16px;">
                 Commencer
              </button>
            </div>
          </div>
        </div>

        <!-- 2. MODE TÉLÉCHARGEMENT USB (Overlay sur le laptop cliqué ou non) -->
        <div v-else-if="showDownloadScreen" 
          :style="{ width: settings.laptop.width + 'px', height: settings.laptop.height + 'px', backgroundColor: '#09090b', color: '#fff' }"
          class="rounded-md overflow-hidden flex flex-col items-center justify-center font-mono">
          <div class="w-[700px] border border-zinc-700 bg-zinc-900 rounded-3xl p-16 space-y-12">
            <div class="flex justify-between items-center text-cyan-400">
              <span class="text-2xl font-bold uppercase tracking-widest">Data Transfer: CV_ANJAH.PDF</span>
              <span class="animate-pulse bg-emerald-500/20 px-3 py-1 rounded text-emerald-500 text-sm">SECURE LINK</span>
            </div>
            <div class="h-6 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-cyan-500" :style="{ width: downloadPercent + '%' }"></div>
            </div>
            <div class="flex justify-between text-zinc-400 text-xl font-bold">
              <span>{{ downloadPercent }}% COMPLETED</span>
              <span>4.2 MB / 4.2 MB</span>
            </div>
          </div>
        </div>

        <!-- 3. MODE PAR DÉFAUT : SITE WEB / IFRAME -->
        <iframe v-else src="https://portfolio.anjahnyony.com"
          :style="{ width: settings.laptop.width + 'px', height: settings.laptop.height + 'px' }"
          class="border-none bg-white rounded-md pointer-events-auto"></iframe>

        </Html>
      </TresGroup>

      <Suspense>
        <GLTFModel path="/models/room_v16_draco.glb" draco draco-decoder-path="/draco/" cast-shadow receive-shadow
          @load="onModelLoaded" @click="onModelClick" @pointermove="onPointerMove" @pointerleave="onPointerOut" />
      </Suspense>

      <!-- 📱 LABELS FLOTTANTS MOBILE -->
      <TresGroup v-if="(mobileMode || showLabelCalibration) && !activeElement">
        <TresGroup v-for="label in mobileLabels" :key="label.id" :position="[label.x, label.y, label.z]">
          <Html center :distance-factor="4" :style="{ pointerEvents: 'auto' }">
            <div class="mobile-label mobile-label--clickable" @click="onLabelClick(label.id)">{{ label.name }}</div>
          </Html>
        </TresGroup>
      </TresGroup>

      <!-- ECRAN TELEPHONE -->
      <TresGroup v-if="activeElement === 'phone'"
        :position="[settings.phone.htmlPosX, settings.phone.htmlPosY, settings.phone.htmlPosZ]">
        <Html key="html-phone" transform wrapper-class="ecran-phone" :rotation-x="settings.phone.htmlRotX"
          :rotation-y="settings.phone.htmlRotY" :rotation-z="settings.phone.htmlRotZ" :scale="settings.phone.scale">
        <Transition enter-active-class="transition-opacity duration-700" enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-300" leave-to-class="opacity-0">
          <div v-show="showPhoneContent"
            :style="{ width: settings.phone.width + 'px', height: settings.phone.height + 'px', backgroundColor: ot.bg, color: ot.text }"
            class="relative rounded-[40px] border-[12px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-y-auto pointer-events-auto"
            :class="isDarkMode ? 'border-zinc-800' : 'border-zinc-300'" style="scrollbar-width: thin;">

            <!-- Fake notch -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl z-10"
              :class="isDarkMode ? 'bg-zinc-800' : 'bg-zinc-300'"></div>

            <div class="p-10 pt-16 space-y-10">
              <div class="text-center space-y-3">
                <div class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl"
                  :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                  <span style="width: 32px; height: 32px; display: inline-flex;" v-html="projectIcons['mail']"></span>
                </div>
                <h2 class="text-4xl font-black">Contact</h2>
                <p :style="{ color: ot.textFaint, fontSize: '18px' }">Envoyez-moi un message</p>
              </div>

              <!-- SUCCESS STATE -->
              <div v-if="contactStatus === 'success'" class="text-center space-y-6 py-8">
                <div class="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                  <span style="width: 40px; height: 40px; display: inline-flex; color: #34d399;" v-html="projectIcons['shield']"></span>
                </div>
                <h3 class="text-3xl font-black text-emerald-400">Message envoyé !</h3>
                <p :style="{ color: ot.textMuted, fontSize: '18px' }">Merci de m'avoir contacté. Je vous répondrai dans les plus brefs délais.</p>
              </div>

              <!-- ERROR STATE -->
              <div v-else-if="contactStatus === 'error'" class="text-center space-y-6 py-8">
                <div class="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/20">
                  <span style="width: 40px; height: 40px; display: inline-flex; color: #f87171;" v-html="projectIcons['zap']"></span>
                </div>
                <h3 class="text-3xl font-black text-red-400">Erreur d'envoi</h3>
                <p :style="{ color: ot.textMuted, fontSize: '18px' }">Veuillez réessayer ou m'écrire directement à anjahnyonyliantsoa@gmail.com</p>
                <button @click="contactStatus = 'idle'"
                  class="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                  style="font-size: 18px;">Réessayer</button>
              </div>

              <!-- FORM -->
              <form v-else class="space-y-6" @submit.prevent="submitContact">
                <div class="space-y-2">
                  <label class="block font-bold ml-2 uppercase tracking-wider"
                    :style="{ color: ot.textFaint, fontSize: '14px' }">Nom</label>
                  <input v-model="contactForm.name" type="text" placeholder="Votre nom" required
                    class="w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border, color: ot.text, fontSize: '20px' }" />
                </div>

                <div class="space-y-2">
                  <label class="block font-bold ml-2 uppercase tracking-wider"
                    :style="{ color: ot.textFaint, fontSize: '14px' }">Email</label>
                  <input v-model="contactForm.email" type="email" placeholder="votre@email.com" required
                    class="w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border, color: ot.text, fontSize: '20px' }" />
                </div>

                <div class="space-y-2">
                  <label class="block font-bold ml-2 uppercase tracking-wider"
                    :style="{ color: ot.textFaint, fontSize: '14px' }">Message</label>
                  <textarea v-model="contactForm.message" placeholder="Comment puis-je vous aider ?" rows="4" required
                    class="w-full px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium resize-none"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border, color: ot.text, fontSize: '20px' }"></textarea>
                </div>

                <button type="submit" :disabled="contactStatus === 'sending'"
                  class="w-full py-5 rounded-2xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style="font-size: 22px;">
                  <span v-if="contactStatus === 'sending'" class="flex items-center justify-center gap-3">
                    <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/></svg>
                    Envoi en cours...
                  </span>
                  <span v-else>Envoyer</span>
                </button>
              </form>

              <div class="pt-6 mt-6 text-center space-y-4" :style="{ borderTop: '1px solid ' + ot.border }">
                <p class="font-bold flex items-center justify-center gap-3"
                  :style="{ color: ot.textMuted, fontSize: '18px' }">
                  <span style="width: 22px; height: 22px; display: inline-flex;" v-html="projectIcons['map-pin']"></span> Québec, Canada
                </p>
                <p class="font-mono text-cyan-500 font-bold" style="font-size: 16px;">
                  contact@anjahnyony.com
                </p>
              </div>
            </div>

          </div>
        </Transition>

        </Html>
      </TresGroup>

      <!-- CONTENU DES LIVRES -->
      <TresGroup v-if="activeElement === 'books'"
        :position="[settings.books.htmlPosX, settings.books.htmlPosY, settings.books.htmlPosZ]">
        <Html key="html-books" transform wrapper-class="livre-content" :rotation-x="settings.books.htmlRotX"
          :rotation-y="settings.books.htmlRotY" :rotation-z="settings.books.htmlRotZ" :scale="settings.books.scale">
        <Transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-300" leave-to-class="opacity-0">
          <div v-show="showBookContent"
            :style="{ width: settings.books.width + 'px', height: settings.books.height + 'px', backgroundColor: ot.bg, color: ot.text }"
            class="relative pointer-events-auto overflow-y-auto" style="scrollbar-width: thin;">

            <!-- LIVRE : STACK & SKILLS -->
            <template v-if="selectedBook === 'stack'">
              <div class="p-12 space-y-12">
                <div class="text-center space-y-4">
                  <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <span style="font-size: 28px; width: 28px; height: 28px;" v-html="projectIcons['zap']"></span>
                    <span class="font-bold uppercase tracking-[0.2em]"
                      :style="{ color: ot.textFaint, fontSize: '18px' }">Stack & Skills</span>
                  </div>
                  <h2 class="font-black" :style="{ color: ot.text, fontSize: '56px' }">Compétences</h2>
                  <p :style="{ color: ot.textFaint, fontSize: '22px' }">Technologies et outils que je maîtrise</p>
                </div>

                <!-- CONTENU DES COMPÉTENCES -->
                <div class="space-y-6">

                  <!-- FRONTEND -->
                  <div class="p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-transform hover:scale-[1.01]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 shrink-0 border border-emerald-500/20">
                      <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['monitor']"></span>
                    </div>
                    <div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Développement Frontend</h3>
                      <p class="font-medium leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">JavaScript, HTML5, CSS3, TailwindCSS</p>
                    </div>
                  </div>

                  <!-- FRAMEWORK -->
                  <div class="p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-transform hover:scale-[1.01]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-cyan-500/10 text-cyan-500 shrink-0 border border-cyan-500/20">
                      <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['sparkles']"></span>
                    </div>
                    <div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Framework</h3>
                      <p class="font-medium leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">Vue.js</p>
                    </div>
                  </div>

                  <!-- BACKEND -->
                  <div class="p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-transform hover:scale-[1.01]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500 shrink-0 border border-blue-500/20">
                      <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['cog']"></span>
                    </div>
                    <div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Développement Backend</h3>
                      <p class="font-medium leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">Node.js, Express.js, APIs RESTful</p>
                    </div>
                  </div>

                  <!-- DATABASE -->
                  <div class="p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-transform hover:scale-[1.01]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-500 shrink-0 border border-indigo-500/20">
                      <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['database']"></span>
                    </div>
                    <div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Bases de Données</h3>
                      <p class="font-medium leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">MySQL (conception et gestion), Modélisation UML</p>
                    </div>
                  </div>

                  <!-- OUTILS -->
                  <div class="p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-transform hover:scale-[1.01]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-500/10 text-purple-500 shrink-0 border border-purple-500/20">
                      <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['wrench']"></span>
                    </div>
                    <div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Outils et Environnement</h3>
                      <p class="font-medium leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">Git, GitHub, VS Code</p>
                    </div>
                  </div>

                  <!-- SOFT SKILLS -->
                  <div class="p-6 rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-transform hover:scale-[1.01]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500 shrink-0 border border-amber-500/20">
                      <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['star']"></span>
                    </div>
                    <div class="w-full">
                      <h3 class="font-bold mb-4 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Soft Skills</h3>
                      <div class="flex flex-wrap gap-3">
                        <span v-for="soft in ['Autonomie', 'Ecoute', 'Patience', 'Gestion du stress', 'Curiosité', 'Soif d\'apprendre', 'Esprit d\'équipe']" :key="soft"
                          class="px-4 py-2 rounded-lg font-medium"
                          :style="{ fontSize: '16px', color: ot.textMuted, background: ot.bg, border: '1px solid ' + ot.border }">
                          {{ soft }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- EDUCATION & LANGUES-->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-6 rounded-2xl flex flex-col items-center text-center transition-transform hover:scale-[1.02]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                      <div class="w-14 h-14 rounded-full flex items-center justify-center bg-rose-500/10 text-rose-500 mb-4 border border-rose-500/20">
                        <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['graduation']"></span>
                      </div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Éducation</h3>
                      <p class="font-medium" :style="{ color: ot.textMuted, fontSize: '20px' }">Licence Professionnel</p>
                    </div>

                    <div class="p-6 rounded-2xl flex flex-col items-center text-center transition-transform hover:scale-[1.02]" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                      <div class="w-14 h-14 rounded-full flex items-center justify-center bg-sky-500/10 text-sky-500 mb-4 border border-sky-500/20">
                        <span style="width: 28px; height: 28px; display: inline-flex;" v-html="projectIcons['globe']"></span>
                      </div>
                      <h3 class="font-bold mb-2 uppercase tracking-[0.1em]" :style="{ color: ot.text, fontSize: '18px' }">Langues</h3>
                      <p class="font-medium" :style="{ color: ot.textMuted, fontSize: '20px' }">Français (Courant)<br>Anglais (Intermédiaire)</p>
                    </div>
                  </div>

                </div>
              </div>
            </template>

            <!-- LIVRE : PARCOURS TIMELINE -->
            <template v-else-if="selectedBook === 'timeline'">
               <div class="p-12 space-y-12">
                <div class="text-center space-y-4">
                  <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <span style="font-size: 28px; width: 28px; height: 28px;" v-html="projectIcons['calendar']"></span>
                    <span class="font-bold uppercase tracking-[0.2em]"
                      :style="{ color: ot.textFaint, fontSize: '18px' }">Mon Parcours</span>
                  </div>
                  <h2 class="font-black" :style="{ color: ot.text, fontSize: '56px' }">Mon Parcours</h2>
                </div>

                <!-- TIMELINE -->
                <div class="relative space-y-10 pl-10" :style="{ borderLeft: '3px solid ' + ot.border }">
                  <div class="relative">
                    <div class="absolute -left-[46px] top-1 w-5 h-5 rounded-full bg-cyan-500"
                      :style="{ border: '4px solid ' + ot.bg }"></div>
                    <div class="p-8 rounded-xl" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                      <div class="flex items-center gap-4 mb-4">
                        <span style="font-size: 36px; width: 36px; height: 36px;" v-html="projectIcons['monitor']"></span>
                        <div>
                          <h3 class="font-bold" :style="{ color: ot.text, fontSize: '28px' }">Développeur Full-Stack
                          </h3>
                          <p class="font-medium" :style="{ color: props.isDarkMode ? '#22d3ee' : '#0891b2', fontSize: '18px' }">H&S Consulting</p>
                        </div>
                      </div>
                      <p class="font-mono mb-4" :style="{ color: ot.textFaint, fontSize: '16px' }">09/2025 — 10/2025 ·
                        Remote, Canada</p>
                      <p class="leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">Création complète
                        d'un site corporatif et d'un CMS propriétaire (Node.js/Vue.js). Architecture de la base de
                        données MySQL, développement des API REST, et gestion complète du déploiement avec optimisation
                        SEO.</p>
                    </div>
                  </div>

                  <div class="relative">
                    <div class="absolute -left-[46px] top-1 w-5 h-5 rounded-full bg-amber-500"
                      :style="{ border: '4px solid ' + ot.bg }"></div>
                    <div class="p-8 rounded-xl" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                      <div class="flex items-center gap-4 mb-4">
                        <span style="font-size: 36px; width: 36px; height: 36px;" v-html="projectIcons['graduation']"></span>
                        <div>
                          <h3 class="font-bold" :style="{ color: ot.text, fontSize: '28px' }">Licence Pro. Génie
                            Logiciel</h3>
                          <p class="font-medium" :style="{ color: props.isDarkMode ? '#fbbf24' : '#b45309', fontSize: '18px' }">ENI Madagascar</p>
                        </div>
                      </div>
                      <p class="font-mono mb-4" :style="{ color: ot.textFaint, fontSize: '16px' }">05/2025</p>
                      <p class="leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">Équivalence au
                        Québec : Baccalauréat en informatique. Apprentissage approfondi de l'informatique, modélisation
                        de bases de données, et structuration de projets logiciels complexes.</p>
                    </div>
                  </div>

                  <div class="relative">
                    <div class="absolute -left-[46px] top-1 w-5 h-5 rounded-full bg-emerald-500"
                      :style="{ border: '4px solid ' + ot.bg }"></div>
                    <div class="p-8 rounded-xl" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                      <div class="flex items-center gap-4 mb-4">
                        <span style="font-size: 36px; width: 36px; height: 36px;" v-html="projectIcons['rocket']"></span>
                        <div>
                          <h3 class="font-bold" :style="{ color: ot.text, fontSize: '28px' }">Profil Actuel</h3>
                          <p class="font-medium" :style="{ color: props.isDarkMode ? '#34d399' : '#047857', fontSize: '18px' }">Disponible immédiatement</p>
                        </div>
                      </div>
                      <p class="leading-relaxed" :style="{ color: ot.textMuted, fontSize: '20px' }">Résident à
                        Saint-Anselme (Québec) avec un Permis de Travail Ouvert valide jusqu'en Octobre 2026. Doté d'une
                        forte capacité d'apprentissage, je suis prêt à relever de nouveaux défis !</p>
                      <div
                        class="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full border"
                        :style="{
                          fontSize: '18px',
                          color: props.isDarkMode ? '#34d399' : '#047857',
                          backgroundColor: props.isDarkMode ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.1)',
                          borderColor: props.isDarkMode ? 'rgba(52,211,153,0.2)' : 'rgba(4,120,87,0.2)'
                        }">
                        <span style="width: 22px; height: 22px; display: inline-flex;" v-html="projectIcons['globe']"></span> Permis de Travail Ouvert
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- LIVRE : À PROPOS -->
            <template v-else>
              <div class="p-12 space-y-10">
                <div class="text-center space-y-4">
                  <div class="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <span style="font-size: 28px; width: 28px; height: 28px;" v-html="projectIcons['filetext']"></span>
                    <span class="font-bold uppercase tracking-[0.2em]"
                      :style="{ color: ot.textFaint, fontSize: '18px' }">À propos de moi</span>
                  </div>
                  <h2 class="font-black" :style="{ color: ot.text, fontSize: '56px' }">Qui suis-je ?</h2>
                </div>

                <div class="p-8 rounded-2xl flex flex-col gap-6" :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                  <p class="leading-relaxed font-medium" :style="{ color: ot.textMuted, fontSize: '22px' }">
                    Bonjour ! Je m'appelle <strong :style="{ color: ot.text }">ANJAH Rakotovao</strong>. Développeur Full-Stack, je suis passionné par la création d'expériences numériques immersives et performantes.
                  </p>
                  
                  <p class="leading-relaxed font-medium" :style="{ color: ot.textMuted, fontSize: '22px' }">
                    Mon approche du développement repose sur trois piliers fondamentaux :
                  </p>

                  <ul class="space-y-4 ml-2">
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border" :style="{ backgroundColor: props.isDarkMode ? 'rgba(34,211,238,0.1)' : 'rgba(8,145,178,0.05)', borderColor: props.isDarkMode ? 'rgba(34,211,238,0.2)' : 'rgba(8,145,178,0.2)', color: props.isDarkMode ? '#22d3ee' : '#0891b2' }">
                         <span style="width: 20px; height: 20px;" v-html="projectIcons['monitor']"></span>
                      </span>
                      <span :style="{ color: ot.text, fontSize: '20px' }"><strong>L'Esthétique :</strong> Concevoir des interfaces belles et intuitives.</span>
                    </li>
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border" :style="{ backgroundColor: props.isDarkMode ? 'rgba(52,211,153,0.1)' : 'rgba(4,120,87,0.05)', borderColor: props.isDarkMode ? 'rgba(52,211,153,0.2)' : 'rgba(4,120,87,0.2)', color: props.isDarkMode ? '#34d399' : '#047857' }">
                         <span style="width: 20px; height: 20px;" v-html="projectIcons['zap']"></span>
                      </span>
                      <span :style="{ color: ot.text, fontSize: '20px' }"><strong>La Performance :</strong> Coder des applications rapides et optimisées.</span>
                    </li>
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border" :style="{ backgroundColor: props.isDarkMode ? 'rgba(168,85,247,0.1)' : 'rgba(126,34,206,0.05)', borderColor: props.isDarkMode ? 'rgba(168,85,247,0.2)' : 'rgba(126,34,206,0.2)', color: props.isDarkMode ? '#a855f7' : '#7e22ce' }">
                         <span style="width: 20px; height: 20px;" v-html="projectIcons['cog']"></span>
                      </span>
                      <span :style="{ color: ot.text, fontSize: '20px' }"><strong>La Robustesse :</strong> Bâtir des architectures backend solides.</span>
                    </li>
                  </ul>

                  <p class="leading-relaxed font-medium mt-2" :style="{ color: ot.textMuted, fontSize: '22px' }">
                    Mon parcours académique à Madagascar et mon expérience m'ont doté d'une forte autonomie, que je suis prêt à mettre au service de vos projets.  
                  </p>
                </div>
              </div>
            </template>

          </div>
        </Transition>

        </Html>
      </TresGroup>

      <!-- PANNEAU LIVRES -->
      <TresGroup v-if="activeElement === 'books'"
        :position="[settings.books.htmlPosX, settings.books.htmlPosY, settings.books.htmlPosZ]">
        <Html transform wrapper-class="ecran-books" :rotation-x="settings.books.htmlRotX"
          :rotation-y="settings.books.htmlRotY" :rotation-z="settings.books.htmlRotZ" :scale="settings.books.scale">

        </Html>
      </TresGroup>
      <!-- CONTENU DES DOSSIERS (Projets) -->
      <TresGroup v-if="activeElement === 'folder'"
        :position="[settings.folder.htmlPosX, settings.folder.htmlPosY, settings.folder.htmlPosZ]">
        <Html key="html-folder" transform wrapper-class="folder-content" :rotation-x="settings.folder.htmlRotX"
          :rotation-y="settings.folder.htmlRotY" :rotation-z="settings.folder.htmlRotZ" :scale="settings.folder.scale">
        <Transition enter-active-class="transition-opacity duration-1000" enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-300" leave-to-class="opacity-0">
          <div v-show="showFolderContent"
            :style="{ width: settings.folder.width + 'px', height: settings.folder.height + 'px', backgroundColor: ot.bg, color: ot.text }"
            class="relative pointer-events-auto overflow-y-auto" style="scrollbar-width: thin;">

            <!-- HERO IMAGE -->
            <div class="relative w-full" style="height: 45%;">
              <img :src="currentProject.image" class="w-full h-full object-cover" :alt="currentProject.title" />
              <div class="absolute inset-0"
                :style="{ background: `linear-gradient(to top, ${ot.bg} 0%, transparent 60%)` }">
              </div>
              <!-- BADGE flottant -->
              <div class="absolute top-8 right-8 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                :style="{ backgroundColor: currentProject.color + '20', border: '2px solid ' + currentProject.color + '40', backdropFilter: 'blur(8px)' }">
                {{ currentProject.badge }}
              </div>
            </div>

            <!-- CONTENU -->
            <div class="relative px-16 -mt-20 pb-16 space-y-12" style="z-index: 2;">
              <!-- TITRE -->
              <div>
                <h2 class="font-black tracking-tight leading-tight mb-4"
                  :style="{ color: currentProject.color, fontSize: '64px' }">
                  {{ currentProject.title }}
                </h2>
                <p class="italic" :style="{ color: ot.textFaint, fontSize: '24px' }">{{ currentProject.tagline }}</p>
              </div>

              <!-- DESCRIPTION -->
              <p class="leading-relaxed" :style="{ color: ot.textMuted, fontSize: '22px' }">{{
                currentProject.description }}
              </p>

              <!-- LIENS VERS LE PROJET -->
              <div v-if="currentProject.link || currentProject.github" class="flex flex-wrap gap-4">
                <a v-if="currentProject.link" :href="currentProject.link" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-lg"
                  :style="{ fontSize: '20px', background: `linear-gradient(135deg, ${currentProject.color}, ${currentProject.color}cc)`, boxShadow: `0 8px 30px ${currentProject.color}30` }">
                  <span v-html="projectIcons['link']"></span> Voir le projet en ligne
                  <span style="font-size: 16px;">↗</span>
                </a>
                <a v-if="currentProject.github" :href="currentProject.github" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02]"
                  :style="{ fontSize: '20px', color: ot.text, background: ot.card, border: '1px solid ' + ot.border }">
                  <span v-html="projectIcons['cog']"></span> Code Source GitHub
                  <span style="font-size: 16px;">↗</span>
                </a>
              </div>

              <!-- FEATURES -->
              <div class="space-y-6">
                <h3 class="font-bold uppercase tracking-[0.2em]" :style="{ color: ot.textFaint, fontSize: '20px' }">
                  Fonctionnalités clés</h3>
                <div class="grid gap-4">
                  <div v-for="feat in currentProject.features" :key="feat.title"
                    class="flex items-start gap-6 p-8 rounded-2xl"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <span class="flex-shrink-0 mt-1 opacity-70" :style="{ color: currentProject.color }" v-html="projectIcons[feat.icon] || feat.icon"></span>
                    <div>
                      <h4 class="font-bold mb-2" :style="{ color: ot.text, fontSize: '24px' }">{{ feat.title }}</h4>
                      <p class="leading-relaxed" :style="{ color: ot.textMuted, fontSize: '18px' }">{{ feat.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- DÉFIS & SOLUTIONS -->
              <div v-if="currentProject.challenges && currentProject.challenges.length" class="space-y-6">
                <h3 class="font-bold uppercase tracking-[0.2em]" :style="{ color: ot.textFaint, fontSize: '20px' }">
                  Défis & Solutions</h3>
                <div class="grid gap-4">
                  <div v-for="(challenge, idx) in currentProject.challenges" :key="idx"
                    class="p-8 rounded-2xl"
                    :style="{ background: ot.card, border: '1px solid ' + ot.border }">
                    <div class="flex items-start gap-4 mb-4">
                      <span class="flex-shrink-0 text-red-400" v-html="projectIcons['zap']"></span>
                      <div>
                        <h4 class="font-bold mb-1" :style="{ color: ot.text, fontSize: '20px' }">Défi</h4>
                        <p :style="{ color: ot.textMuted, fontSize: '18px' }">{{ challenge.problem }}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-4 mt-4 pt-4" :style="{ borderTop: '1px solid ' + ot.border }">
                      <span class="flex-shrink-0 text-emerald-400" v-html="projectIcons['shield']"></span>
                      <div>
                        <h4 class="font-bold mb-1" :style="{ color: ot.text, fontSize: '20px' }">Solution</h4>
                        <p :style="{ color: ot.textMuted, fontSize: '18px' }">{{ challenge.solution }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STACK -->
              <div>
                <h3 class="font-bold uppercase tracking-[0.2em] mb-6"
                  :style="{ color: ot.textFaint, fontSize: '20px' }">
                  Stack Technique</h3>
                <div class="flex flex-wrap gap-4">
                  <span v-for="tech in currentProject.stack" :key="tech"
                    class="px-6 py-3 rounded-full font-semibold border"
                    :style="{ fontSize: '18px', color: currentProject.color, borderColor: currentProject.color + '30', backgroundColor: currentProject.color + '10' }">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Transition>

        </Html>
      </TresGroup>

    </TresCanvas>
  </div>
</template>

<script setup>
import { ref, watch, shallowReactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls, GLTFModel, Html } from '@tresjs/cientos'
import gsap from 'gsap'

import TheBooksTimeline from './TheBooksTimeline.vue'

const props = defineProps({
  selectedProject: { type: String, default: null },
  selectedBook: { type: String, default: null },
  showIntro: { type: Boolean, default: false },
  mobileMode: { type: Boolean, default: false }
})

const emit = defineEmits(['select-project', 'select-book', 'drawer-state', 'background-click', 'theme-toggled', 'mobile-activate'])

const settings = ref({
  laptop: {
    camX: 1.54, camY: 1.91, camZ: 1,
    lookX: 1.53, lookY: 1.5, lookZ: 0.07,
    htmlPosX: 1.45, htmlPosY: 1.66, htmlPosZ: 0.1,
    htmlRotX: -0.33, htmlRotY: 0, htmlRotZ: 0,
    scale: 0.0175,
    width: 1400,
    height: 900
  },
  phone: {
    camX: 1.75, camY: 1.929, camZ: 1.401,
    lookX: 1.19, lookY: 1.73, lookZ: 0.55,
    htmlPosX: 0.9, htmlPosY: 1.57, htmlPosZ: 0.46,
    htmlRotX: -0.17, htmlRotY: 0.54, htmlRotZ: 0.07,
    scale: 0.023,
    width: 380,
    height: 800
  },
  books: {
    camX: 1.34, camY: 1.84, camZ: 1.29,
    lookX: 0.73, lookY: 1.5, lookZ: 0.31,
    htmlPosX: 0.972, htmlPosY: 1.704, htmlPosZ: 0.71,
    htmlRotX: 0, htmlRotY: 0.62, htmlRotZ: 0,
    scale: 0.014,
    width: 770,
    height: 1129
  },
  bookshelf: {
    camX: 0.83, camY: 2.83, camZ: 0.97,
    lookX: 0.68, lookY: 2.41, lookZ: -0.03,
  },
  socials: {
    camX: 0.9, camY: 1.75, camZ: 1.0,
    lookX: 0.5, lookY: 1.55, lookZ: 0.2,
  },
  drawer: {
    camX: 2.09, camY: 2.00, camZ: 1.55,
    lookX: -0.46, lookY: -0.92, lookZ: 0.53,
  },
  folder: {
    camX: 1.84, camY: 2.03, camZ: 1.64,
    lookX: 1, lookY: 1.68, lookZ: 0.45,
    htmlPosX: 1.5, htmlPosY: 1.882, htmlPosZ: 1.121,
    htmlRotX: 0, htmlRotY: 0.55, htmlRotZ: 0,
    scale: 0.014,
    width: 800,
    height: 1200
  },
  usb: {
    camX: 1.54, camY: 1.91, camZ: 1,
    lookX: 1.53, lookY: 1.5, lookZ: 0.07,
    posX: -0.096, posY: 0, posZ: 0,
    rotX: 0, rotY: 0, rotZ: 0,
    htmlPosX: 1.45, htmlPosY: 1.66, htmlPosZ: 0.1,
    htmlRotX: -0.33, htmlRotY: 0, htmlRotZ: 0,
    scale: 0.0175,
    width: 1400,
    height: 900
  },
  github: {
    camX: 1.8, camY: 2, camZ: 1.5,
    lookX: 1.2, lookY: 1.5, lookZ: 0.5,
    posX: 1.2, posY: 1.5, posZ: 0.5,
    rotX: 0, rotY: 0, rotZ: 0
  },
  linkedin: {
    camX: 2, camY: 2, camZ: 2,
    lookX: 1.5, lookY: 1.5, lookZ: 1,
    posX: 1.5, posY: 1.5, posZ: 1,
    rotX: 0, rotY: 0, rotZ: 0
  }
})

// --- ICÔNES SVG (Lucide-style) ---
const ico = (d, size = 24) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const projectIcons = {
  'github': ico('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>'),
  'linkedin': ico('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'),
  'download': ico('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>'),
  'refresh': ico('<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>'),
  'shield': ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  'dice': ico('<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
  'sparkles': ico('<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>'),
  'building': ico('<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/>'),
  'database': ico('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>'),
  'monitor': ico('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
  'zap': ico('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),
  'mail': ico('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  'settings': ico('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  'wrench': ico('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  'rocket': ico('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'),
  'globe': ico('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
  'gem': ico('<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>'),
  'filetext': ico('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
  'cog': ico('<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'),
  'link': ico('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  'search': ico('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
  'chart': ico('<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'),
  'star': ico('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  'shuffle': ico('<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H18"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18l-4 4-4-4"/><path d="M16.8 13.6c.5.8 1.4 1.4 2.3 1.4H22"/>'),
  'share': ico('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>'),
  'palette': ico('<circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2" fill="currentColor"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12.5" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"/>'),
  'calendar': ico('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>'),
  'camera': ico('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),
  'graduation': ico('<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
  'map-pin': ico('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
}

// --- DONNÉES DES PROJETS ---
const projects = {
  monopoly: {
    title: 'Monopoly Madagascar',
    badge: '🎲',
    color: '#e74c3c',
    image: '/projetc_img/monopoly_board.webp',
    link: 'https://monopoly.anjahnyony.com',
    github: 'https://github.com/AnjahNyOny/monopoly',
    tagline: 'Ariary Luxe Edition — Un jeu de Monopoly en ligne multijoueur sur mesure, thématisé sur Madagascar.',
    description: 'Conçu avec une approche esthétique "Luxe" (Dark mode, Glassmorphism) et animé dynamiquement sans moteur de jeu externe. Investissez, négociez et bâtissez votre empire en Ariary dans cette expérience multijoueur haut de gamme avec un plateau réactif, des dés 3D en CSS pur et une mécanique de jeu complète.',
    features: [
      { icon: 'refresh', title: 'Multijoueur en Temps Réel', desc: 'Système de salons privés (Room ID) permettant à plusieurs joueurs de se synchroniser et de jouer sur le même plateau de manière fluide.' },
      { icon: 'shield', title: 'Authentification Sécurisée', desc: 'Création de compte et connexion sécurisées par JWT (JSON Web Tokens) et mots de passe hashés avec bcrypt.' },
      { icon: 'dice', title: 'Animations Immersives', desc: 'Lancers de dés 3D codés entièrement en CSS pur et déplacement des pions géré par GSAP pour un rendu visuel fluide et réaliste.' },
      { icon: 'sparkles', title: 'Design System "Luxe"', desc: 'Interface sophistiquée inspirée de Plato, intégrant du Glassmorphism (verre dépoli), un thème sombre (Slate-950) et des accents premium Rouge et Or.' },
      { icon: 'building', title: 'Mécanique de Jeu Complète', desc: 'Achat de propriétés malgaches, gares, utilitaires, construction jusqu\'à l\'hôtel, cartes Chance et Caisse de communauté.' },
      { icon: 'database', title: 'Persistance de Session', desc: 'Le joueur peut rafraîchir la page ou se déconnecter puis revenir sans perdre l\'état continu de la partie.' },
    ],
    challenges: [
      { problem: 'Gérer des sessions multi-utilisateurs de façon performante tout en simplifiant le déploiement sur VPS (éviter la complexité de Socket.io).', solution: 'Conservation de l\'état de jeu (GameState) en mémoire sur le serveur Nitro, puis synchronisation des clients via un Polling ultra léger et optimisé (Pinia + syncGameState).' },
      { problem: 'Reproduire le tracé exact des pions sur un plateau 11×11 et adapter le rendu à toutes les tailles d\'écrans.', solution: 'Architecture avancée en CSS Grid avec classes métier (.t-0 à .t-39) et hook watch Pinia + GSAP pour animer les translations entre les cases.' },
      { problem: 'Avoir des lancers de dés 3D réalistes sans charger un moteur 3D lourd comme Three.js.', solution: 'Conception mathématique de la logique de transformation rotateX/Y/Z du système CSS 3D, pilotée par les hooks réactifs de Vue.js.' },
    ],
    stack: ['Nuxt 4 / Vue 3', 'Pinia', 'GSAP', 'CSS3 3D', 'Tailwind CSS', 'Nitro / Node.js', 'SQLite (better-sqlite3)', 'JWT / bcrypt', 'PM2', 'VPS'],
  },
  cms: {
    title: 'CMS Sur-Mesure & Admin',
    badge: '📝',
    color: '#3498db',
    image: '/projetc_img/CMS.webp',
    link: 'https://demo.babacode.ca/login?auto=true',
    github: 'https://github.com/AnjahNyOny/portfolio',
    tagline: 'Station de contrôle centralisée propulsée par des micro-workers et une UI moderne.',
    description: 'Développement from scratch d\'un système de gestion de contenu (CMS) couplé à un panneau d\'administration robuste fonctionnant comme une véritable SPA. Plus qu\'un gestionnaire texte/image, c\'est une plateforme intégrant un Webmail "In-App" en temps réel et un système de monitoring avancé.',
    features: [
      { icon: 'monitor', title: 'Interface SPA Moderne (Vue 3)', desc: 'Dashboard réactif avec Vue Router, Pinia, et un design modulaire grâce à Tailwind CSS v3 et Flowbite. Intègre un éditeur Markdown natif.' },
      { icon: 'zap', title: 'Backend RESTful Sécurisé', desc: 'API Node.js/Express avec base de données MySQL asynchrone et validation stricte des données via Zod.' },
      { icon: 'mail', title: 'Webmail Intégré "In-App"', desc: 'Capacité de lire et répondre aux clients directement depuis l\'interface, avec des mises à jour en temps réel via SSE et Socket.IO.' },
      { icon: 'settings', title: 'Architecture Multi-Processus', desc: 'Déploiement PM2 gérant le serveur API, un worker d\'ingestion IMAP 24/7 asynchrone, et un worker d\'envoi d\'emails (Nodemailer).' },
      { icon: 'shield', title: 'Sécurité & Observabilité', desc: 'Auth JWT/bcrypt, politique CORS millimétrée, protection DDoS (Helmet, Rate-limit), et télémétrie Prometheus (prête pour Grafana).' },
      { icon: 'wrench', title: 'Maintenance Autosuffisante', desc: 'Scripts CLI de nettoyage asynchrone des assets via cron et gestionnaire de sites dynamiques multi-langues.' },
    ],
    challenges: [
      { problem: 'Traiter les emails IMAP entrants et sortants sans imposer de latence à l\'API principale ni interrompre l\'expérience utilisateur.', solution: 'Isolation de la logique dans des processus "micro-workers" indépendants avec PM2 (worker-imap, worker-outbox), synchronisant silencieusement les données.' },
      { problem: 'Sécuriser un panneau d\'administration ultra-sensible et garantir la visibilité fine sur l\'état des serveurs.', solution: 'Implémentation de JWT sécurisés, protection agressive des requêtes réseau, et intégration d\'une télémétrie de rang d\'entreprise (Prometheus/Grafana via prom-client).' },
    ],
    stack: ['Vue.js 3', 'Pinia', 'Tailwind CSS / Flowbite', 'Node.js / Express', 'MySQL2', 'Micro-Workers (PM2)', 'Zod / JWT', 'SSE / Socket.IO', 'Prometheus'],
  },
  portfolio: {
    title: 'Site Vitrine SAP',
    badge: '💼',
    color: '#10b981',
    image: '/projetc_img/site_vitrine_SAP.webp',
    link: 'https://hsconseil.ca',
    tagline: 'Site vitrine moderne, performant et multilingue pour consultant indépendant.',
    description: 'Plateforme conçue spécifiquement pour maximiser la présence en ligne d\'un consultant SAP. L\'objectif est de mettre en valeur l\'expertise technique (services, réalisations, portfolio) et de générer des leads via une prise de contact hyper-fluide. Ce site frontend est intégralement découplé d\'un puissant espace d\'administration sécurisé.',
    features: [
      { icon: 'rocket', title: 'Landing Page & Catalogue', desc: 'Page d\'accueil percutante avec catalogue d\'expertise (intégration SAP, audits, AMOA) filtrable par tags.' },
      { icon: 'globe', title: 'Support Multilingue Natif', desc: 'Intégration profonde de Vue I18n v10 pour opérer à l\'international, et intégration du bandeau de consentement RGPD.' },
      { icon: 'zap', title: 'Prise de Contact Temps-Réel', desc: 'Formulaire avec alertes push envoyées instantanément via WebSockets (Socket.io) à l\'administrateur.' },
      { icon: 'gem', title: 'Design System Premium', desc: 'Interface UI TailwindCSS/Flowbite sur-mesure qui casse les codes "austères" de l\'ERP en offrant modernité et assurance.' },
      { icon: 'filetext', title: 'Parsage de Contenu', desc: 'Intégration d\'une librairie de conversion Markdown pour afficher élégamment les études de cas créées depuis l\'administration.' },
      { icon: 'cog', title: 'Architecture Modulaire SPA', desc: 'Single Page Application hyper-réactive propulsée par Vue Router, Pinia et Vuex pour les états de session.' },
    ],
    challenges: [
      { problem: 'Cibler le design : casser les codes rigides des services IT sans perdre la crédibilité corporate nécessaire en SAP.', solution: 'Conception institutionnelle "Premium" avec Tailwind CSS, iconographies fines (Lucide, Heroicons) et notifications élégantes (vue-toastification).' },
      { problem: 'Garder l\'interface visiteur ultra-légère malgré le back-office embarqué.', solution: 'Séparation structurelle radicale (dossiers Visitor vs Admin), supportée par une architecture en TypeScript assurant le découplage des modèles métier.' },
      { problem: 'Générer des leads avec réactivité absolue.', solution: 'Abolition des simples "emails" au profit d\'une connexion WebSocket front-back notifiant l\'administrateur du site à la seconde où le formulaire est envoyé.' },
    ],
    stack: ['Vue.js 3', 'TypeScript', 'Tailwind CSS v3', 'Pinia & Vuex', 'WebSockets (Socket.io)', 'Vue Router v4', 'Vue I18n', 'Vue CLI / Webpack'],
  },
  movie: {
    title: 'Perfect Movie',
    badge: '🎬',
    color: '#9b59b6',
    image: '/projetc_img/movie.webp',
    link: 'https://perfectmovie.anjahnyony.com/',
    github: 'https://github.com/AnjahNyOny/perfect-movie',
    tagline: 'L\'application ultime pour organiser vos soirées ciné en couple.',
    description: 'Perfect Movie est une application web collaborative conçue spécifiquement pour les couples (particulièrement ceux à distance) afin de centraliser, rechercher et synchroniser leur liste de films à regarder. Fini les "on regarde quoi ce soir ?", l\'application permet de constituer une bibliothèque commune, de noter les films vus et même de laisser le destin choisir pour vous.',
    features: [
      { icon: 'link', title: 'Synchronisation Temps Réel', desc: 'Grâce à un système de "Code Couple", deux utilisateurs peuvent lier leurs comptes pour partager instantanément la même liste.' },
      { icon: 'search', title: 'Recherche Intégrée (TMDB)', desc: 'Accès à une base de données de milliers de films avec affiches, synopsis et bandes-annonces directement dans l\'interface.' },
      { icon: 'chart', title: 'Tableau de Bord Statistiques', desc: 'Visualisation du temps total de visionnage, des genres préférés du couple et du plus gros contributeur de la liste.' },
      { icon: 'star', title: 'Gestion de Statut & Notes', desc: 'Possibilité de marquer un film comme "Terminé", de lui attribuer une note sur 10 et d\'ajouter un commentaire personnel.' },
      { icon: 'shuffle', title: 'Mode "Surprise-moi"', desc: 'Un algorithme de sélection aléatoire pour aider à choisir le prochain film parmi la liste d\'envies.' },
      { icon: 'share', title: 'Partage Public', desc: 'Génération d\'un lien unique en mode "Lecture Seule" pour montrer votre collection à vos amis ou votre famille.' },
      { icon: 'palette', title: 'Interface Premium', desc: 'Design moderne avec mode Sombre/Clair, animations fluides (Lucide Icons) et chargement optimisé (Skeletons).' },
    ],
    challenges: [
      { problem: 'Maîtrise du JavaScript Asynchrone : gestion complexe des appels API, des promesses et des mises à jour du DOM sans framework.', solution: 'Architecture modulaire en ES6+ Modules avec gestion centralisée des états et du cycle de vie des composants en JavaScript Vanille.' },
      { problem: 'Architecture NoSQL : conception d\'un schéma de données entre Utilisateurs, Couples et Films.', solution: 'Modélisation relationnelle adaptée à Firestore avec synchronisation temps réel et gestion des conflits d\'écriture.' },
    ],
    stack: ['HTML5', 'CSS3 (Variables, Flexbox, Grid)', 'JavaScript ES6+ Modules', 'Firebase Firestore', 'Firebase Auth', 'TMDB API', 'Dicebear API', 'YouTube Embed'],
  },
  soccer: {
    title: 'Soccer Interculturel Bellechasse',
    badge: '⚽',
    color: '#f39c12',
    image: '/projetc_img/soccer.webp',
    link: 'https://soccerinterculturelbellechasse.com/',
    tagline: 'Favoriser l\'intégration sociale et la diversité culturelle à travers le sport.',
    description: 'Développement d\'une vitrine web moderne pour un club de soccer promouvant l\'inclusion à Saint-Anselme (Québec). L\'objectif était de fournir une plateforme élégante et fonctionnelle pour attirer de nouveaux membres, informer sur les horaires des différentes saisons (été/hiver) et renforcer l\'image de marque du club.',
    features: [
      { icon: 'palette', title: 'Design Premium & Responsif', desc: 'Interface moderne utilisant une typographie élégante (Playfair Display & Montserrat) et un layout "split-screen" pour le héros.' },
      { icon: 'calendar', title: 'Planning Dynamique', desc: 'Système d\'onglets interactifs en JavaScript pour basculer facilement entre les horaires de la saison d\'été et d\'hiver.' },
      { icon: 'camera', title: 'Galerie Photo Immersive', desc: 'Galerie en grille Masonry avec un système de Lightbox fait maison pour une visualisation fluide des images.' },
      { icon: 'mail', title: 'Formulaire de Contact Intelligent', desc: 'Intégration d\'un formulaire avec envoi via AJAX (FormSubmit) pour une expérience utilisateur sans rechargement.' },
      { icon: 'rocket', title: 'Optimisation SEO & Performance', desc: 'Données structurées (JSON-LD), format WebP, lazy-loading pour un référencement optimal et un temps de chargement éclair.' },
    ],
    challenges: [
      { problem: 'Rendre le site performant malgré un grand nombre de photos dans la galerie.', solution: 'Conversion systématique des images en format WebP et mise en place du chargement différé (lazy-loading).' },
      { problem: 'Offrir une navigation claire sur mobile pour un contenu riche.', solution: 'Conception d\'un menu "burger" personnalisé avec un overlay flouté pour une esthétique moderne.' },
    ],
    stack: ['HTML5', 'CSS3 Vanilla', 'JavaScript ES6+', 'Schema.org', 'Google Maps API', 'FormSubmit', 'Font Awesome'],
  },
}

// --- DONNÉES DES LIVRES ---
const books = {
  stack: {
    title: 'Stack & Skills',
    icon: 'zap',
    badge: '⚡',
    color: '#eab308',
    desc: 'Technologies et compétences',
  },
  about: {
    title: 'À propos de moi',
    icon: 'filetext',
    badge: '📄',
    color: '#06b6d4',
    desc: 'Qui suis-je ?',
  },
  timeline: {
    title: 'Mon Parcours',
    icon: 'calendar',
    badge: '📅',
    color: '#a855f7',
    desc: 'Expériences et formations',
  }
}

const currentProject = computed(() => {
  return props.selectedProject ? projects[props.selectedProject] : projects.monopoly
})

const currentBook = computed(() => {
  return props.selectedBook ? books[props.selectedBook] : books.stack
})
const cameraRef = ref(null)
const controlsRef = ref(null)

// --- STATE & SETTINGS ---
const activeElement = ref(null) // 'laptop', 'phone', 'books', 'switch', or null
const isHovered = ref(false)
const animating = ref(false)

// --- TOOLTIP INTERACTIF (style jeu vidéo) ---
const hoverTooltip = ref({ visible: false, text: '', x: 0, y: 0 })
const TOOLTIP_LABELS = {
  laptop: 'Mon Espace de Travail',
  phone: 'Me Contacter',
  drawer: 'Mes Projets',
  switch: 'Changer l\'éclairage',
  usb: 'Télécharger le CV',
  rubik: 'Easter Egg',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  book_timeline: 'Mon Parcours',
  book_stack: 'Stack & Skills',
  book_about: 'À Propos',
  folder_monopoly: 'Monopoly Madagascar',
  folder_cms: 'CMS Propriétaire',
  folder_portfolio: 'Portfolio Bilingue',
  folder_movie: 'Perfect-Movie',
  folder_soccer: 'Soccer Interculturel'
}

const showPhoneContent = ref(false)
const showBookContent = ref(false)
const showFolderContent = ref(false)
const showDownloadScreen = ref(false)
const downloadPercent = ref(0)

// --- FORMULAIRE DE CONTACT ---
const contactForm = ref({ name: '', email: '', message: '' })
const contactStatus = ref('idle') // 'idle' | 'sending' | 'success' | 'error'

async function submitContact() {
  contactStatus.value = 'sending'
  try {
    const res = await fetch('https://formsubmit.co/ajax/anjahnyonyliantsoa@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: contactForm.value.name,
        email: contactForm.value.email,
        message: contactForm.value.message,
        _subject: `Portfolio 3D — Message de ${contactForm.value.name}`,
      })
    })
    if (res.ok) {
      contactStatus.value = 'success'
      contactForm.value = { name: '', email: '', message: '' }
      setTimeout(() => { contactStatus.value = 'idle' }, 8000)
    } else {
      contactStatus.value = 'error'
    }
  } catch {
    contactStatus.value = 'error'
  }
}

// 🪄 Passe à 'true' pour faire apparaître les panneaux de configuration
// 🔧 FLAG POUR AFFICHER/CACHER LE BOUTON DE CALIBRATION EN PRODUCTION
const ENABLE_CALIBRATION_UI = true
const calibrationMode = ref(false)
const showLightCalibration = ref(false)
const showCameraCalibration = ref(false)
const showMeshNames = ref(false)
const hoveredMeshName = ref('')

// 📱 Positions des labels mobiles (calibrables)
const showLabelCalibration = ref(false)
const mobileLabels = ref([
  { id: 'intro',    name: 'INTRO',     x: 1.46, y: 1.97, z: 0.1 },
  { id: 'phone',    name: 'CONTACT',   x: 0.81, y: 1.59, z: 0.46 },
  { id: 'books',    name: 'PARCOURS',  x: 0.53, y: 2.77, z: -0.24 },
  { id: 'folder',   name: 'PROJETS',   x: 0.69, y: 0.99, z: 0.9 },
  { id: 'usb',      name: 'CV',        x: 1.88, y: 1.59, z: 0.39 },
  { id: 'socials',  name: 'SOCIALS',   x: 0.5,  y: 1.79, z: 0.23 },
  { id: 'rubik',    name: 'RUBIK',     x: 2.16, y: 1.64, z: 0.36 },
  { id: 'darkmode', name: 'DARK MODE', x: 2.72, y: 2.99, z: -0.53 },
])

// 📱 Clic sur un label mobile
const onLabelClick = (labelId) => {
  if (animating.value) return
  switch (labelId) {
    case 'intro':
      emit('mobile-activate', 'laptop')
      zoomTo('laptop')
      break
    case 'phone':
      zoomTo('phone')
      break
    case 'books':
      zoomTo('bookshelf')
      break
    case 'folder':
      // Ouvrir le drawer puis zoomer
      {
        let rootScene = cameraRef.value
        while (rootScene?.parent) rootScene = rootScene.parent
        if (rootScene) {
          rootScene.traverse((child) => {
            if (child.name && child.name.toLowerCase().includes('drawer_bottom') && !child.userData?.isOpen) {
              toggleDrawer(child)
            }
          })
        }
        setTimeout(() => zoomTo('drawer'), 400)
      }
      break
    case 'usb':
      // Trouver et animer la clé USB
      {
        let rootScene = cameraRef.value
        while (rootScene?.parent) rootScene = rootScene.parent
        if (rootScene) {
          rootScene.traverse((child) => {
            if (child.name && (child.name.toLowerCase().includes('cv_usb') || child.name.toLowerCase().includes('usb'))) {
              const data = getInteractiveData(child)
              if (data && data.id === 'usb') animateUSBPlug(data.group)
            }
          })
        }
      }
      break
    case 'socials':
      zoomTo('socials')
      nextTick(() => levitateSocialCards(true))
      break
    case 'darkmode':
      toggleLight()
      break
    case 'rubik':
      // Pas d'action pour l'instant
      break
  }
}

const copyLabelPositions = () => {
  const out = mobileLabels.value.map(l => `  { id: '${l.id}', name: '${l.name}', x: ${l.x}, y: ${l.y}, z: ${l.z} },`).join('\n')
  navigator.clipboard.writeText(`[\n${out}\n]`)
  alert('Positions copiées !')
}

// --- 📷 CALIBRATION CAMÉRA ---
const defaultCamPos = ref({ x: 1.79, y: 2.26, z: 2.58 })
const defaultLookAt = ref({ x: 1.31, y: 1.62, z: 0.06 })

// 📱 Position caméra mobile (look-around)
const mobileCamPos = ref({ x: 0.3, y: 1.99, z: 4 })
const mobileLookAtInit = ref({ x: 0.86, y: 1.83, z: 1.78 })
const showMobileCamCalibration = ref(false)

const applyMobileCamCalibration = () => {
  initMobileLookAngles(true)
}

const copyMobileCamPositions = () => {
  const txt = `mobileCamPos: { x: ${mobileCamPos.value.x}, y: ${mobileCamPos.value.y}, z: ${mobileCamPos.value.z} }\nmobileLookAtInit: { x: ${mobileLookAtInit.value.x}, y: ${mobileLookAtInit.value.y}, z: ${mobileLookAtInit.value.z} }`
  navigator.clipboard.writeText(txt)
  alert('Positions cam mobile copiées !')
}

// 🃏 Calibration caméra socials
const showSocialsCamCalibration = ref(false)

const applySocialsCamCalibration = () => {
  if (cameraRef.value && activeElement.value === 'socials') {
    const s = settings.value.socials
    cameraRef.value.position.set(s.camX, s.camY, s.camZ)
    cameraRef.value.lookAt(s.lookX, s.lookY, s.lookZ)
  }
}

const copySocialsCamPositions = () => {
  const s = settings.value.socials
  const txt = `socials: { camX: ${s.camX}, camY: ${s.camY}, camZ: ${s.camZ}, lookX: ${s.lookX}, lookY: ${s.lookY}, lookZ: ${s.lookZ} }`
  navigator.clipboard.writeText(txt)
  alert('Positions socials copiées !')
}

// 📚 Calibration caméra bookshelf
const showBookshelfCamCalibration = ref(false)

const applyBookshelfCamCalibration = () => {
  if (cameraRef.value && activeElement.value === 'bookshelf') {
    const s = settings.value.bookshelf
    cameraRef.value.position.set(s.camX, s.camY, s.camZ)
    cameraRef.value.lookAt(s.lookX, s.lookY, s.lookZ)
  }
}

const copyBookshelfCamPositions = () => {
  const s = settings.value.bookshelf
  const txt = `bookshelf: { camX: ${s.camX}, camY: ${s.camY}, camZ: ${s.camZ}, lookX: ${s.lookX}, lookY: ${s.lookY}, lookZ: ${s.lookZ} }`
  navigator.clipboard.writeText(txt)
  alert('Positions bookshelf copiées !')
}

// 📦 Calibration caméra drawer
const showDrawerCamCalibration = ref(false)

const applyDrawerCamCalibration = () => {
  if (cameraRef.value && activeElement.value === 'drawer') {
    const d = settings.value.drawer
    cameraRef.value.position.set(d.camX, d.camY, d.camZ)
    cameraRef.value.lookAt(d.lookX, d.lookY, d.lookZ)
  }
}

const copyDrawerCamPositions = () => {
  const d = settings.value.drawer
  const txt = `drawer: { camX: ${d.camX}, camY: ${d.camY}, camZ: ${d.camZ}, lookX: ${d.lookX}, lookY: ${d.lookY}, lookZ: ${d.lookZ} }`
  navigator.clipboard.writeText(txt)
  alert('Positions drawer copiées !')
}

const orbitLimits = ref({
  minDistance: 1,
  maxDistance: 4.89,
  minPolarDeg: 63,    // Haut : vue isométrique (ne pas voir au-dessus des murs)
  maxPolarDeg: 97,    // Bas : vue quasi-horizontale (ne pas passer sous le sol)
  minAzimuthDeg: -10, // Gauche : limite mur gauche
  maxAzimuthDeg: 90   // Droite : limite mur droite
})

const liveCamPos = ref({ x: '...', y: '...', z: '...' })
const liveCamTarget = ref({ x: '...', y: '...', z: '...' })
const liveAngles = ref({ polar: '...', azimuth: '...', distance: '...' })
const cameraCodeOutput = ref('')

const updateLiveCamReadout = () => {
  if (cameraRef.value) {
    liveCamPos.value = {
      x: cameraRef.value.position.x.toFixed(2),
      y: cameraRef.value.position.y.toFixed(2),
      z: cameraRef.value.position.z.toFixed(2)
    }
  }
  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef
  if (controls?.target) {
    liveCamTarget.value = {
      x: controls.target.x.toFixed(2),
      y: controls.target.y.toFixed(2),
      z: controls.target.z.toFixed(2)
    }
    // Compute live polar & azimuth angles
    const dx = cameraRef.value.position.x - controls.target.x
    const dy = cameraRef.value.position.y - controls.target.y
    const dz = cameraRef.value.position.z - controls.target.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const polar = Math.acos(Math.min(Math.max(dy / dist, -1), 1)) * (180 / Math.PI)
    const azimuth = Math.atan2(dx, dz) * (180 / Math.PI)
    liveAngles.value = {
      polar: polar.toFixed(1),
      azimuth: azimuth.toFixed(1),
      distance: dist.toFixed(2)
    }
  }
}

const captureCurrentView = () => {
  if (!cameraRef.value) return
  defaultCamPos.value.x = Number(cameraRef.value.position.x.toFixed(2))
  defaultCamPos.value.y = Number(cameraRef.value.position.y.toFixed(2))
  defaultCamPos.value.z = Number(cameraRef.value.position.z.toFixed(2))

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef
  if (controls?.target) {
    defaultLookAt.value.x = Number(controls.target.x.toFixed(2))
    defaultLookAt.value.y = Number(controls.target.y.toFixed(2))
    defaultLookAt.value.z = Number(controls.target.z.toFixed(2))
  }
}

const testHomePosition = () => {
  if (animating.value || activeElement.value) return
  animating.value = true

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef
  const lookAtProxy = {
    x: controls?.target?.x ?? 0,
    y: controls?.target?.y ?? 0,
    z: controls?.target?.z ?? 0
  }

  gsap.to(cameraRef.value.position, {
    x: defaultCamPos.value.x,
    y: defaultCamPos.value.y,
    z: defaultCamPos.value.z,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
    }
  })

  gsap.to(lookAtProxy, {
    x: defaultLookAt.value.x,
    y: defaultLookAt.value.y,
    z: defaultLookAt.value.z,
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      if (controls?.target) {
        controls.target.set(defaultLookAt.value.x, defaultLookAt.value.y, defaultLookAt.value.z)
      }
      cameraRef.value.lookAt(defaultLookAt.value.x, defaultLookAt.value.y, defaultLookAt.value.z)
      animating.value = false
    }
  })
}

const copyCameraCode = () => {
  const code = `// 📷 Position caméra calibrée
const defaultCamPos = { x: ${defaultCamPos.value.x}, y: ${defaultCamPos.value.y}, z: ${defaultCamPos.value.z} }
const defaultLookAt = { x: ${defaultLookAt.value.x}, y: ${defaultLookAt.value.y}, z: ${defaultLookAt.value.z} }
// Orbit limits
minDistance: ${orbitLimits.value.minDistance}
maxDistance: ${orbitLimits.value.maxDistance}
minPolar: ${orbitLimits.value.minPolarDeg}° | maxPolar: ${orbitLimits.value.maxPolarDeg}°
minAzimuth: ${orbitLimits.value.minAzimuthDeg}° | maxAzimuth: ${orbitLimits.value.maxAzimuthDeg}°`
  cameraCodeOutput.value = code
  navigator.clipboard?.writeText(code)
}

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
    }
  })

  if (phoneGroup && !phoneGroup.userData.originalPos) {
    phoneGroup.userData.originalPos = phoneGroup.position.clone()
    phoneGroup.userData.originalRot = phoneGroup.rotation.clone()
  }

  return phoneGroup
}

// --- WATCHERS POUR CALIBRATION LIVE ---
watch(() => settings.value.usb, (newVal) => {
  if (activeUSB && activeElement.value === 'usb') {
    activeUSB.position.set(newVal.posX, newVal.posY, newVal.posZ)
    activeUSB.rotation.set(
      newVal.rotX * Math.PI / 180,
      newVal.rotY * Math.PI / 180,
      newVal.rotZ * Math.PI / 180
    )
  }
}, { deep: true })

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

// -- GROUPE LIVRES --
let activeBookBase = null
let activeBookCover = null
const bookAnimConfig = ref({
  targetPosX: 1,
  targetPosY: 1.723,
  targetPosZ: 0.76,
  baseRotX: 0,
  baseRotY: 0,
  baseRotZ: 55,
  coverRotX: 0,
  coverRotY: 0,
  coverRotZ: 160
})

const updateBookAnim = () => {
  if (activeBookBase && activeBookBase.userData.originalPos && activeElement.value === 'books') {
    gsap.killTweensOf(activeBookBase.position)
    gsap.killTweensOf(activeBookBase.rotation)
    activeBookBase.position.x = bookAnimConfig.value.targetPosX
    activeBookBase.position.y = bookAnimConfig.value.targetPosY
    activeBookBase.position.z = bookAnimConfig.value.targetPosZ
    activeBookBase.rotation.x = activeBookBase.userData.originalRot.x + (bookAnimConfig.value.baseRotX * Math.PI / 180)
    activeBookBase.rotation.y = activeBookBase.userData.originalRot.y + (bookAnimConfig.value.baseRotY * Math.PI / 180)
    activeBookBase.rotation.z = activeBookBase.userData.originalRot.z + (bookAnimConfig.value.baseRotZ * Math.PI / 180)
  }

  if (activeBookCover && activeBookCover.userData.originalRot && activeElement.value === 'books') {
    gsap.killTweensOf(activeBookCover.rotation)
    activeBookCover.rotation.x = activeBookCover.userData.originalRot.x + (bookAnimConfig.value.coverRotX * Math.PI / 180)
    activeBookCover.rotation.y = activeBookCover.userData.originalRot.y + (bookAnimConfig.value.coverRotY * Math.PI / 180)
    activeBookCover.rotation.z = activeBookCover.userData.originalRot.z + (bookAnimConfig.value.coverRotZ * Math.PI / 180)
  }
}

const updateFolderAnim = () => {
  if (activeFolderBase && activeFolderBase.userData.originalPos && activeElement.value === 'folder') {
    gsap.killTweensOf(activeFolderBase.position)
    gsap.killTweensOf(activeFolderBase.rotation)
    activeFolderBase.position.x = folderAnimConfig.value.targetPosX
    activeFolderBase.position.y = folderAnimConfig.value.targetPosY
    activeFolderBase.position.z = folderAnimConfig.value.targetPosZ
    activeFolderBase.rotation.x = activeFolderBase.userData.originalRot.x + (folderAnimConfig.value.baseRotX * Math.PI / 180)
    activeFolderBase.rotation.y = activeFolderBase.userData.originalRot.y + (folderAnimConfig.value.baseRotY * Math.PI / 180)
    activeFolderBase.rotation.z = activeFolderBase.userData.originalRot.z + (folderAnimConfig.value.baseRotZ * Math.PI / 180)
  }

  if (activeFolderCover && activeFolderCover.userData.originalRot && activeElement.value === 'folder') {
    gsap.killTweensOf(activeFolderCover.rotation)
    activeFolderCover.rotation.x = activeFolderCover.userData.originalRot.x + (folderAnimConfig.value.coverRotX * Math.PI / 180)
    activeFolderCover.rotation.y = activeFolderCover.userData.originalRot.y + (folderAnimConfig.value.coverRotY * Math.PI / 180)
    activeFolderCover.rotation.z = activeFolderCover.userData.originalRot.z + (folderAnimConfig.value.coverRotZ * Math.PI / 180)
  }
}

let activeFolderBase = null
let activeFolderCover = null
const folderAnimConfig = ref({
  targetPosX: 0.74,
  targetPosY: 1,
  targetPosZ: 0.2,
  baseRotX: -90,
  baseRotY: -60,
  baseRotZ: -90,
  coverRotX: 180, // Selon l'orientation du hinge, modifie l'axe
  coverRotY: 0,
  coverRotZ: 0
})

// --- GESTION DE LA LUMIÈRE (Interrupteur) ---
const isDarkMode = ref(false)

// Thème dynamique pour les overlays (clair/sombre)
const ot = computed(() => isDarkMode.value ? {
  bg: '#0a0a0f', text: '#ffffff', textMuted: 'rgba(255,255,255,0.5)', textFaint: 'rgba(255,255,255,0.3)',
  card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', bar: 'rgba(255,255,255,0.05)',
} : {
  bg: '#ffffff', text: '#1a1a2e', textMuted: 'rgba(0,0,0,0.55)', textFaint: 'rgba(0,0,0,0.3)',
  card: 'rgba(0,0,0,0.03)', border: 'rgba(0,0,0,0.08)', bar: 'rgba(0,0,0,0.06)',
})
const lightState = ref({
  ambient: 0.6,      // Remplacez 0.7 par votre "Ambiance (Jour)"
  window: 2,       // Remplacez 2.5 par votre "Soleil (Intensité)"
  desk: 0,
  nightReflect: 0,
  envIntensity: 0.1    // Remplacez 1 par votre "Environnement GLOBAL"
})

const lightPos = ref({
  // Remplacez les valeurs de x, y, z et frustum ici :
  sun: { x: -2.44, y: 3.7, z: 2.1, frustum: 10 },

  // Remplacez les valeurs x, y, z de la cible ici :
  sunTarget: { x: 13.5, y: -2, z: 0 },

  godRay: { x: -2.3, y: 3.5, z: 1.7, rotX: 90, rotY: -30, rotZ: 90, opacity: 0.15 },
  desk: { x: 2, y: 3, z: 2 },
})

const godRayUniforms = shallowReactive({
  uOpacity: { value: lightPos.value.godRay.opacity }
})

watch(() => lightPos.value.godRay.opacity, (newOp) => {
  godRayUniforms.uOpacity.value = newOp
})

const updateGodRayOpacity = () => {
  // Optionnel si le watcher est en place
}

// 📷 Forcer le target d'OrbitControls au chargement initial
watch(controlsRef, (newRef) => {
  if (newRef) {
    nextTick(() => {
      const controls = newRef?.value ?? newRef?.instance ?? newRef
      if (controls?.target) {
        controls.target.set(defaultLookAt.value.x, defaultLookAt.value.y, defaultLookAt.value.z)
        controls.update?.()
      }
    })
  }
}, { immediate: true })

// 📱 CONTRÔLE TACTILE MOBILE — Mode "look-around" (caméra fixe, regard tourne)
const mobileLookAt = ref(new THREE.Vector3(defaultLookAt.value.x, defaultLookAt.value.y, defaultLookAt.value.z))
const mobileTouchState = ref({ active: false, lastX: 0, lastY: 0, pinchDist: 0 })
const MOBILE_SENSITIVITY = 0.004
const MOBILE_ZOOM_SPEED = 0.008
const MOBILE_LOOK_RADIUS = 2.5 // Distance entre caméra et point de regard
// Angles sphériques pour le regard
const mobileLookAngles = ref({ theta: 0, phi: Math.PI / 2 })

// Initialiser les angles depuis la position mobile
// forcePosition=true : premier chargement, on place la caméra manuellement
// forcePosition=false : retour d'animation, on lit la direction réelle de la caméra
const initMobileLookAngles = (forcePosition = false) => {
  if (!cameraRef.value) return
  if (forcePosition) {
    // Premier init : placer la caméra et calculer la direction depuis les settings
    cameraRef.value.position.set(mobileCamPos.value.x, mobileCamPos.value.y, mobileCamPos.value.z)
    const cam = new THREE.Vector3(mobileCamPos.value.x, mobileCamPos.value.y, mobileCamPos.value.z)
    const target = new THREE.Vector3(mobileLookAtInit.value.x, mobileLookAtInit.value.y, mobileLookAtInit.value.z)
    const dir = target.clone().sub(cam).normalize()
    mobileLookAngles.value.theta = Math.atan2(dir.x, dir.z)
    mobileLookAngles.value.phi = Math.acos(Math.max(-1, Math.min(1, dir.y)))
  } else {
    // Retour d'animation : lire la direction réelle de la caméra (après GSAP)
    const dir = new THREE.Vector3()
    cameraRef.value.getWorldDirection(dir)
    mobileLookAngles.value.theta = Math.atan2(dir.x, dir.z)
    mobileLookAngles.value.phi = Math.acos(Math.max(-1, Math.min(1, dir.y)))
  }
  // Mettre à jour mobileLookAt depuis ces angles
  const cam = cameraRef.value.position
  const r = MOBILE_LOOK_RADIUS
  const { theta, phi } = mobileLookAngles.value
  mobileLookAt.value.set(
    cam.x + r * Math.sin(phi) * Math.sin(theta),
    cam.y + r * Math.cos(phi),
    cam.z + r * Math.sin(phi) * Math.cos(theta)
  )
}

const updateMobileLookAt = () => {
  if (!cameraRef.value) return
  const cam = cameraRef.value.position
  const r = MOBILE_LOOK_RADIUS
  const { theta, phi } = mobileLookAngles.value
  mobileLookAt.value.set(
    cam.x + r * Math.sin(phi) * Math.sin(theta),
    cam.y + r * Math.cos(phi),
    cam.z + r * Math.sin(phi) * Math.cos(theta)
  )
  cameraRef.value.lookAt(mobileLookAt.value)
}

const getPinchDist = (touches) => {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

const onMobileTouchStart = (e) => {
  if (!props.mobileMode || animating.value || activeElement.value) return
  if (e.touches.length === 1) {
    mobileTouchState.value = { active: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY, pinchDist: 0 }
  } else if (e.touches.length === 2) {
    mobileTouchState.value.pinchDist = getPinchDist(e.touches)
  }
}

const onMobileTouchMove = (e) => {
  if (!props.mobileMode || animating.value || activeElement.value) return
  e.preventDefault()

  if (e.touches.length === 1 && mobileTouchState.value.active) {
    const dx = e.touches[0].clientX - mobileTouchState.value.lastX
    const dy = e.touches[0].clientY - mobileTouchState.value.lastY
    mobileTouchState.value.lastX = e.touches[0].clientX
    mobileTouchState.value.lastY = e.touches[0].clientY

    // Swipe intuitif : swipe gauche = regarder à gauche, swipe haut = regarder en haut
    mobileLookAngles.value.theta += dx * MOBILE_SENSITIVITY
    mobileLookAngles.value.phi -= dy * MOBILE_SENSITIVITY
    // Limiter phi pour ne pas retourner la caméra
    mobileLookAngles.value.phi = Math.max(0.3, Math.min(Math.PI - 0.3, mobileLookAngles.value.phi))

    updateMobileLookAt()
  } else if (e.touches.length === 2 && mobileTouchState.value.pinchDist > 0) {
    const newDist = getPinchDist(e.touches)
    const delta = newDist - mobileTouchState.value.pinchDist
    mobileTouchState.value.pinchDist = newDist

    // Zoom = avancer/reculer la caméra dans la direction du regard
    if (cameraRef.value) {
      const dir = mobileLookAt.value.clone().sub(cameraRef.value.position).normalize()
      cameraRef.value.position.addScaledVector(dir, delta * MOBILE_ZOOM_SPEED)
      updateMobileLookAt()
    }
  }
}

const onMobileTouchEnd = () => {
  mobileTouchState.value.active = false
  mobileTouchState.value.pinchDist = 0
}

// Attacher les touch events au canvas quand il est prêt
let mobileCanvasEl = null
watch(() => [cameraRef.value, props.mobileMode], ([cam, mobile]) => {
  if (cam && mobile) {
    nextTick(() => {
      initMobileLookAngles(true)
      // Trouver le canvas DOM element
      const sceneDiv = document.querySelector('.relative.h-screen')
      mobileCanvasEl = sceneDiv?.querySelector('canvas')
      if (mobileCanvasEl) {
        mobileCanvasEl.addEventListener('touchstart', onMobileTouchStart, { passive: false })
        mobileCanvasEl.addEventListener('touchmove', onMobileTouchMove, { passive: false })
        mobileCanvasEl.addEventListener('touchend', onMobileTouchEnd)
      }
    })
  }
}, { immediate: true })

onUnmounted(() => {
  if (mobileCanvasEl) {
    mobileCanvasEl.removeEventListener('touchstart', onMobileTouchStart)
    mobileCanvasEl.removeEventListener('touchmove', onMobileTouchMove)
    mobileCanvasEl.removeEventListener('touchend', onMobileTouchEnd)
  }
})

const toggleLight = () => {
  if (animating.value) return
  isDarkMode.value = !isDarkMode.value

  emit('theme-toggled', isDarkMode.value)

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
      envIntensity: 0.1, // Retour à l'environnement initial (0 et non 1)
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

const sunLightRef = ref(null)

const updateSunTarget = () => {
  const light = sunLightRef.value?.instance || sunLightRef.value
  if (light && light.target) {
    light.target.updateMatrixWorld()
  }
}

watch(() => lightPos.value.sunTarget, () => {
  updateSunTarget()
}, { deep: true, immediate: true })

const updateEnvIntensity = () => {
  let sceneRoot = cameraRef.value
  while (sceneRoot && !sceneRoot.isScene && sceneRoot.parent) {
    sceneRoot = sceneRoot.parent
  }
  if (sceneRoot?.isScene && sceneRoot.environmentIntensity !== undefined) {
    sceneRoot.environmentIntensity = lightState.value.envIntensity
  }
}

// On surveille l'apparition de la lumière dans la scène
watch(sunLightRef, (nouveauSpotLight) => {
  if (nouveauSpotLight) {
    // Un léger délai garantit que Three.js a bien attaché la cible à la scène
    setTimeout(() => {
      updateSunTarget()
      updateEnvIntensity()
    }, 50)
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
const LAPTOP_PARTS = ['laptop_bottom', 'laptop_keybord', 'laptop_cover', 'screen', 'Plane006_1', 'Plane006_2', 'Plane002', 'Plane003', 'Plane004'] // Inclus anciens et nouveaux noms au cas où
const PHONE_PREFIX = 'Plane038_'
const BOOK_PARTS = ['book', 'book001', 'book002', 'book003', 'book_base', 'book_cover', 'cube006', 'cube006_1', 'cube003', 'cube003_1', 'cube', 'cube_1']
const LIGHT_SWITCH = ['light_switch', 'light_switch_1']

// Récupère le nom du mesh réellement touché par le rayon
const getHitMeshName = (event) => {
  return event?.intersection?.object?.name || event?.object?.name || ''
}

// L'ancien isInteractive a été fusionné dans getInteractiveData plus bas

// Gérer l'ouverture/fermeture du tiroir (sans zoomer)
const toggleDrawer = (drawerMesh) => {
  if (animating.value) return

  // Initialisation de l'état
  if (drawerMesh.userData.isOpen === undefined) {
    drawerMesh.userData.originalPos = drawerMesh.position.clone()
    drawerMesh.userData.isOpen = false
  }

  const isOpen = drawerMesh.userData.isOpen

  // Si le bureau est orienté de face, le tiroir s'ouvre généralement sur l'axe X ou Z.
  // Modifie 'z' ci-dessous en 'x' ou 'y' selon comment ton bureau est orienté dans ThreeJS !
  const offset = isOpen ? 0 : 0.4

  gsap.to(drawerMesh.position, {
    z: drawerMesh.userData.originalPos.z + offset, // << CHANGE LE 'z' ICI par 'x' ou '-x' si ça sort du mauvais côté !
    duration: 0.8,
    ease: 'power2.inOut'
  })

  drawerMesh.userData.isOpen = !isOpen
  emit('drawer-state', drawerMesh.userData.isOpen)
}

// 📥 À la fin du chargement du modèle, configurer les ombres
const onModelLoaded = (gltf) => {
  const modelToTraverse = gltf?.scene || gltf
  if (modelToTraverse?.traverse) {
    modelToTraverse.traverse((node) => {
      if (node.isMesh) {
        const name = node.name ? node.name.toLowerCase() : ''

        // 1. LA VITRE : On la rend TOTALEMENT INVISIBLE pour le test
        if (
          name.includes('glass') ||
          name.includes('vitre') ||
          (name.includes('window') && !name.includes('frame'))
        ) {
          node.visible = false // Cache complètement l'objet
          node.castShadow = false
        }
        // 2. LES DÉCHETS BLENDER : On cache les restes booléens
        else if (name.includes('cube') || name.includes('boolean')) {
          node.visible = false
          node.castShadow = false
        }
        // 3. TOUT LE RESTE (Murs, meubles) : Projettent et reçoivent l'ombre
        else {
          node.visible = true
          node.castShadow = true
          node.receiveShadow = true

          // IMPORTANT : On s'assure que l'ombre est calculée normalement (FrontSide)
          if (node.material) {
            node.material.shadowSide = 0
          }
        }
      }
    })
  }
  updateEnvIntensity()
}

// 🔍 Clic sur un objet
// 🔍 Fonction unifiée pour identifier un groupe interactif complet depuis n'importe quel mesh enfant
const getInteractiveData = (mesh) => {
  if (!mesh || !mesh.name) return null
  const meshName = mesh.name.toLowerCase()

  // --- NOUVEAUX OBJETS (PRIORITÉ DIRECTE) ---
  if (meshName.includes('_card') && (meshName.includes('github') || meshName.includes('linkedin') || meshName.includes('facebook'))) {
    // Remonter au parent qui contient '_card' pour avoir le groupe complet
    let group = mesh
    while (group.parent && group.parent.name !== 'Scene') {
      if (group.parent.name.toLowerCase().includes('_card')) {
        group = group.parent
      } else {
        break
      }
    }
    const cardName = group.name.toLowerCase()
    let id = 'github', label = 'GitHub', url = 'https://github.com/AnjahNyOny'
    if (cardName.includes('linkedin')) { id = 'linkedin'; label = 'LinkedIn'; url = 'https://linkedin.com/in/rakotovao-liantsoa' }
    else if (cardName.includes('facebook')) { id = 'facebook'; label = 'Facebook'; url = 'https://facebook.com/anjahnyony.rakotovao' }
    return { id, label, type: 'social', isSocial: true, url, group }
  }
  if (meshName.includes('cv_usb') || meshName.includes('usb')) {
    // On remonte au parent le plus haut qui contient 'usb' pour tout emmener (tête + corps)
    let group = mesh
    while (group.parent && group.parent.name !== 'Scene') {
      if (group.parent.name.toLowerCase().includes('usb') || group.parent.type === 'Group') {
        group = group.parent
      } else {
        break
      }
    }
    return { id: 'usb', label: 'Mon CV (USB)', type: 'usb', group: group }
  }
  if (meshName.includes('rubik')) {
    let group = mesh
    // On remonte jusqu'au parent le plus haut qui contient 'rubik' pour tout emmener (cage + pièces)
    while (group.parent && group.parent.name !== 'Scene' && (group.parent.name.toLowerCase().includes('rubik') || group.parent.type === 'Group')) {
      group = group.parent
      if (group.name.toLowerCase().includes('rubik_parent') || group.name.toLowerCase() === 'rubik') break
    }
    return { id: 'rubik', label: 'Rubik', type: 'rubik', group: group }
  }

  // --- LOGIQUE EXISTANTE (REMONTEE DES PARENTS) ---
  let node = mesh
  let hitType = null

  // 1. Déterminer la catégorie en remontant l'arbre (bubble up)
  while (node && node.type !== 'Scene' && node.name !== 'Scene') {
    const name = node.name.toLowerCase()

    // --- SOCIAL CARDS (gérées en priorité plus haut) ---
    if (name.includes('_card')) {
      if (name.includes('github') || name.includes('linkedin') || name.includes('facebook')) {
        return getInteractiveData(node)
      }
      return null
    }

    if (name.includes('shelf') || name.includes('book_shelf')) {
      // Sur mobile, le shelf est cliquable pour le close-up livres
      if (!hitType) hitType = 'bookshelf'
    } else if (!hitType) {
      if (name.includes('laptop') || name.includes('macbook') || LAPTOP_PARTS.some(p => name.includes(p.toLowerCase()))) hitType = 'laptop'
      else if (name.includes('phone') || name.startsWith(PHONE_PREFIX.toLowerCase())) hitType = 'phone'
      else if (name.includes('drawer_bottom')) hitType = 'drawer'
      else if (name.includes('folder')) hitType = 'folder'
      else if (LIGHT_SWITCH.some(p => name.includes(p.toLowerCase())) || name.includes('light_switch')) hitType = 'switch'
      else if ((BOOK_PARTS.some(p => name.includes(p.toLowerCase())) || name.includes('book'))) hitType = 'book'
      else if (name.includes('usb')) hitType = 'usb'
      else if (name.includes('rubik')) hitType = 'rubik'
    }
    node = node.parent
  }

  if (!hitType) return null

  // 2. Trouver le groupe parent racine de l'objet entier qui englobe toutes ses sous-parties
  if (hitType === 'phone') return { type: 'phone', group: getPhoneGroup() }

  if (hitType === 'laptop' || hitType === 'switch') {
    let rootScene = mesh
    while (rootScene && rootScene.parent) rootScene = rootScene.parent // Remonter au sommet
    
    let fragments = []
    rootScene.traverse((child) => {
      const cname = child.name ? child.name.toLowerCase() : ''
      if (hitType === 'laptop' && (cname.includes('laptop') || cname.includes('macbook') || LAPTOP_PARTS.some(p => cname.includes(p.toLowerCase())))) {
        fragments.push(child)
      }
      if (hitType === 'switch' && (LIGHT_SWITCH.some(p => cname.includes(p.toLowerCase())) || cname.includes('light_switch'))) {
         fragments.push(child)
      }
    })
    return { type: hitType, group: fragments }
  }

  let root = mesh
  if (hitType === 'drawer') {
    while (root.parent && root.parent.name.toLowerCase().includes('drawer_bottom')) root = root.parent
  } else if (hitType === 'folder') {
     while (root.parent && root.parent.name.toLowerCase().includes('folder')) root = root.parent
  } else {
    while (root.parent && root.parent.type === 'Group' && root.parent.name !== 'Scene') {
      root = root.parent
    }
  }

  return { type: hitType, group: root }
}

// 🔍 Clic sur un objet
const onModelClick = (event) => {
  if (animating.value) return

  const data = getInteractiveData(event.object || event.intersection?.object)

  // 📱 En mobile dans le drawer, autoriser le clic sur les dossiers
  if (activeElement.value !== null) {
    if (props.mobileMode && activeElement.value === 'drawer' && data && data.type === 'folder') {
      // On continue vers la logique folder ci-dessous
    } else if (props.mobileMode && activeElement.value === 'bookshelf' && data && data.type === 'book') {
      // On continue vers la logique book ci-dessous
    } else if (props.mobileMode && activeElement.value === 'socials' && data && data.isSocial) {
      // On continue vers la logique social ci-dessous
    } else {
      emit('background-click')
      return
    }
  }

  if (!data) return

  // --- GESTION DES CLICS ---
  if (data.isSocial && data.url) {
    // 📱 Mobile : premier clic = close-up + lévitation, deuxième clic = ouvrir lien
    if (props.mobileMode && activeElement.value !== 'socials') {
      zoomTo('socials')
      // Faire léviter toutes les social cards
      nextTick(() => levitateSocialCards(true))
      return
    }
    window.open(data.url, '_blank')
    return
  }

  if (data.id === 'usb') {
    animateUSBPlug(data.group)
    return
  }

  const { type, group } = data

  if (type === 'laptop') {
    zoomTo('laptop')
  } else if (type === 'phone') {
    zoomTo('phone')
  } else if (type === 'drawer') {
    toggleDrawer(group)
    // 📱 En mobile, zoomer dans le tiroir quand il s'ouvre
    if (props.mobileMode && group.userData?.isOpen) {
      setTimeout(() => zoomTo('drawer'), 400)
    }
  } else if (type === 'folder') {
    // 📱 Garder activeElement='drawer' pour que zoomTo sache d'où on vient (transition fluide)
    activeFolderBase = group
    if (!activeFolderBase.userData.originalPos) {
      activeFolderBase.userData.originalPos = activeFolderBase.position.clone()
      activeFolderBase.userData.originalRot = activeFolderBase.rotation.clone()
    }

    let cover = group.children ? group.children.find(c => c.name.toLowerCase().includes('cover')) : null
    if (!cover && event.object.name.toLowerCase().includes('cover')) cover = event.object

    if (cover) {
      activeFolderCover = cover
      if (!activeFolderCover.userData.originalRot) {
        activeFolderCover.userData.originalRot = activeFolderCover.rotation.clone()
      }
    }

    const match = (event.object?.name || group.name).match(/folder_([a-zA-Z0-9]+)/i) || group.name.match(/folder_([a-zA-Z0-9]+)/i)
    if (match && match[1]) emit('select-project', match[1].toLowerCase())

    zoomTo('folder')
  } else if (type === 'bookshelf') {
    // 📱 Close-up sur l'étagère de livres
    if (props.mobileMode) {
      zoomTo('bookshelf')
    }
  } else if (type === 'book') {
    // 📱 Sur mobile, si pas en close-up bookshelf → déclencher le close-up d'abord
    if (props.mobileMode && activeElement.value !== 'bookshelf') {
      zoomTo('bookshelf')
      return
    }
    // 📱 Garder activeElement='bookshelf' pour que zoomTo sache d'où on vient (transition fluide)
    activeBookBase = group
    if (!activeBookBase.userData.originalPos) {
      activeBookBase.userData.originalPos = activeBookBase.position.clone()
      activeBookBase.userData.originalRot = activeBookBase.rotation.clone()
    }

    let cover = group.children ? group.children.find(c => c.name.toLowerCase().includes('cover')) : null
    if (!cover && event.object.name.toLowerCase().includes('cover')) cover = event.object

    if (cover) {
      activeBookCover = cover
      if (!activeBookCover.userData.originalRot) {
        activeBookCover.userData.originalRot = activeBookCover.rotation.clone()
      }
    }

    const match = group.name.match(/book_([^_]+)/i) || (event.object?.name || '').match(/book_([^_]+)/i)
    if (match && match[1]) emit('select-book', match[1].toLowerCase())

    zoomTo('books')
  } else if (type === 'switch') {
    toggleLight()
  } else if (type === 'usb') {
    animateUSBPlug(group)
  } else if (type === 'github') {
    window.open('https://github.com/AnjahNyOny', '_blank')
  } else if (type === 'linkedin') {
    window.open('https://linkedin.com/in/anjahnyony', '_blank')
  }
}

let currentHoveredGroup = null
let currentHoveredType = null
let menuPreviewActive = false

const highlightGroup = (groupOrArray, isHovering) => {
  if (!groupOrArray) return 

  const isArray = Array.isArray(groupOrArray)
  const canScale = isArray ? false : !groupOrArray.name.toLowerCase().includes('drawer')
  const elements = isArray ? groupOrArray : [groupOrArray]

  // Lévitation pour les cartes sociales
  const isSocialCard = !isArray && groupOrArray.name && groupOrArray.name.toLowerCase().includes('_card')

  if (isHovering && !animating.value) { // On n'illumine que s'il n'y a pas d'animation en cours
    if (isSocialCard) {
      if (!groupOrArray.userData.originalPos) {
        groupOrArray.userData.originalPos = groupOrArray.position.clone()
      }
      gsap.to(groupOrArray.position, {
        y: groupOrArray.userData.originalPos.y + 0.01,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    if (canScale && !isArray && currentHoveredType !== 'usb' && currentHoveredType !== 'rubik') {
      const group = groupOrArray
      if (!group.userData.originalScale) {
        group.userData.originalScale = group.scale.clone()
      }
      gsap.to(group.scale, { 
        x: group.userData.originalScale.x * 1.02, 
        y: group.userData.originalScale.y * 1.02, 
        z: group.userData.originalScale.z * 1.02, 
        duration: 0.2, 
        ease: 'power2.out' 
      })
    }

    elements.forEach(element => {
      element.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!child.userData.hasClonedMaterial) {
             if (Array.isArray(child.material)) {
                 child.material = child.material.map(m => m.clone())
             } else {
                 child.material = child.material.clone()
             }
             child.userData.hasClonedMaterial = true
          }
          
          let mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach(mat => {
              if (mat.emissive) {
                  if (!mat.userData) mat.userData = {}
                  if (!mat.userData.originalEmissive) {
                      mat.userData.originalEmissive = mat.emissive.clone()
                  }
                  // Ajoute une lueur blanche/grise
                  gsap.to(mat.emissive, { r: 0.15, g: 0.15, b: 0.15, duration: 0.2 })
              }
          })
        }
      })
    })
  } else if (!isHovering) {
    // Restaurer
    if (isSocialCard && groupOrArray.userData.originalPos) {
      gsap.to(groupOrArray.position, {
        y: groupOrArray.userData.originalPos.y,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    if (canScale && !isArray && groupOrArray.userData.originalScale) {
      const group = groupOrArray
      gsap.to(group.scale, { 
        x: group.userData.originalScale.x, 
        y: group.userData.originalScale.y, 
        z: group.userData.originalScale.z, 
        duration: 0.2, 
        ease: 'power2.out' 
      })
    }
    
    elements.forEach(element => {
      element.traverse((child) => {
        if (child.isMesh && child.material) {
          let mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach(mat => {
              if (mat.emissive && mat.userData?.originalEmissive) {
                  gsap.to(mat.emissive, { 
                    r: mat.userData.originalEmissive.r, 
                    g: mat.userData.originalEmissive.g, 
                    b: mat.userData.originalEmissive.b, 
                    duration: 0.2 
                  })
              }
          })
        }
      })
    })
  }
}

// Mouvement sur le modèle — détecte le mesh survolé en continu
const onPointerMove = (event) => {
  // Ne pas interférer avec le hover déclenché depuis le menu
  if (menuPreviewActive) return

  if (animating.value || activeElement.value !== null) {
    if (isHovered.value) {
      isHovered.value = false
      document.body.style.cursor = 'auto'
    }
    if (currentHoveredGroup) {
      highlightGroup(currentHoveredGroup, false)
      currentHoveredGroup = null
      currentHoveredType = null
    }
    return 
  }

  const data = getInteractiveData(event.object || event.intersection?.object)
  hoveredMeshName.value = data ? data.type : ''

  // Mise à jour position souris pour le tooltip
  const pointerEvent = event.event || event
  if (pointerEvent.clientX !== undefined) {
    hoverTooltip.value.x = pointerEvent.clientX
    hoverTooltip.value.y = pointerEvent.clientY
  }

  if (data) {
    if (!isHovered.value) {
      isHovered.value = true
      document.body.style.cursor = 'pointer'
    }

    const { type, group, id, isSocial } = data
    // Tooltip label — spécifique pour livres et dossiers
    let tooltipKey = isSocial ? id : type
    if (type === 'book' || type === 'folder') {
      const groupName = (group?.name || '').toLowerCase()
      const match = groupName.match(new RegExp(`${type}_([a-z]+)`))
      if (match) tooltipKey = `${type}_${match[1]}`
    }
    hoverTooltip.value.text = TOOLTIP_LABELS[tooltipKey] || ''
    hoverTooltip.value.visible = !!hoverTooltip.value.text

    if (currentHoveredType !== type || (type !== 'laptop' && type !== 'switch' && currentHoveredGroup !== group)) {
      if (currentHoveredGroup) {
        highlightGroup(currentHoveredGroup, false)
      }

      currentHoveredGroup = group
      currentHoveredType = type
      highlightGroup(currentHoveredGroup, true)
    }
  } else {
    // Plus rien n'est survolé (ou un élément est en mode "ouvert")
    hoverTooltip.value.visible = false
    if (isHovered.value) {
      isHovered.value = false
      document.body.style.cursor = 'auto'
      
      if (currentHoveredGroup) {
        highlightGroup(currentHoveredGroup, false)
        currentHoveredGroup = null
        currentHoveredType = null
      }
    }
  }
}

// Sortie complète du modèle
const onPointerOut = () => {
  // Ne pas interférer avec le hover déclenché depuis le menu
  if (menuPreviewActive) return

  hoveredMeshName.value = ''
  isHovered.value = false
  hoverTooltip.value.visible = false
  document.body.style.cursor = 'auto'
  
  if (currentHoveredGroup) {
    highlightGroup(currentHoveredGroup, false)
    currentHoveredGroup = null
    currentHoveredType = null
  }
}

// 📱 Lévitation des social cards
// Ordre front → back : la première reste en place, chaque suivante monte d'un cran de plus
const SOCIAL_CARD_ORDER = ['linkedin', 'github', 'facebook'] // front → back
const SOCIAL_CARD_STEP = 0.12 // écart Y entre chaque carte

const levitateSocialCards = (up) => {
  let rootScene = cameraRef.value
  while (rootScene?.parent) rootScene = rootScene.parent
  if (!rootScene) return

  // Collecter les cards individuelles
  const cards = []
  rootScene.traverse((child) => {
    if (!child.name) return
    const name = child.name.toLowerCase()
    if (!name.includes('_card')) return
    const matchIdx = SOCIAL_CARD_ORDER.findIndex(c => name.includes(c))
    if (matchIdx === -1) return
    if (cards.some(c => c.mesh === child)) return
    if (!child.userData.originalPos) child.userData.originalPos = child.position.clone()
    cards.push({ mesh: child, order: matchIdx })
  })

  cards.forEach(({ mesh, order }) => {
    if (up) {
      const FIRST_OFFSET = 0.04
      const offset = FIRST_OFFSET + order * SOCIAL_CARD_STEP
      gsap.to(mesh.position, {
        y: mesh.userData.originalPos.y + offset,
        duration: 0.8, ease: 'power2.out', delay: order * 0.08
      })
    } else {
      gsap.to(mesh.position, {
        y: mesh.userData.originalPos.y,
        duration: 0.5, ease: 'power2.inOut'
      })
    }
  })
}

// 📚 Sélection d'un livre depuis le menu bookshelf mobile
const selectBookFromShelf = (bookId) => {
  emit('select-book', bookId)
  activeElement.value = null
  animating.value = false
  nextTick(() => {
    activateItemByName('books', bookId)
  })
}

// 📦 Sélection d'un projet depuis le menu drawer mobile
const selectProjectFromDrawer = (projectId) => {
  emit('select-project', projectId)
  // Réinitialiser l'état du drawer d'abord
  activeElement.value = null
  animating.value = false
  // Puis activer le dossier correspondant
  nextTick(() => {
    activateItemByName('folder', projectId)
  })
}

// Clic dans le vide
const onPointerMissed = () => {
  if (activeElement.value && !animating.value) {
    emit('background-click')
  }
}

// Simule un clic sur un élément 3D depuis le menu
const activateItemByName = (type, id) => {
  let rootScene = cameraRef.value
  if (!rootScene) return
  while (rootScene.parent) {
    rootScene = rootScene.parent
  }

  if (type === 'drawer') {
    // Trouve précisément le tiroir du bas
    const drawer = rootScene.children.find(child => child.name && child.name.toLowerCase().includes('drawer_bottom'))
    if (drawer) {
      toggleDrawer(drawer)
    } else {
      // Traverse au cas où
      let found = null
      rootScene.traverse((child) => {
        if (!found && child.name && child.name.toLowerCase().includes('drawer_bottom')) {
          found = child
        }
      })
      if (found) toggleDrawer(found)
    }
    return
  }

  if (type === 'folder') {
    // S'assurer que le tiroir est ouvert en arrière-plan pour les coordonnées locales
    let drawer = null
    rootScene.traverse((child) => {
      if (!drawer && child.name && child.name.toLowerCase().includes('drawer_bottom')) {
        drawer = child
      }
    })
    if (drawer) {
      if (drawer.userData.isOpen === undefined) {
        drawer.userData.originalPos = drawer.position.clone()
        drawer.userData.isOpen = false
      }
      if (!drawer.userData.isOpen) {
        toggleDrawer(drawer)
      }
    }

    const baseName = `folder_${id}`
    const coverName = `folder_${id}_cover`

    let base = null
    let cover = null

    rootScene.traverse((child) => {
      // On cherche exactement "folder_nom" ou on tolère s'il a ".001"
      if (!base && child.name && child.name.toLowerCase().startsWith(baseName.toLowerCase()) && !child.name.toLowerCase().includes('cover') && !child.name.toLowerCase().includes('paper')) {
        base = child
      }
      if (!cover && child.name && child.name.toLowerCase().startsWith(coverName.toLowerCase())) cover = child
    })

    if (base) {
      // Remonter jusqu'à la racine du groupe dossier (même logique que onModelClick)
      while (base.parent && base.parent.name.toLowerCase().includes('folder')) {
        base = base.parent
      }

      activeFolderBase = base
      if (!activeFolderBase.userData.originalPos) {
        activeFolderBase.userData.originalPos = activeFolderBase.position.clone()
        activeFolderBase.userData.originalRot = activeFolderBase.rotation.clone()
      }
    }

    if (cover) {
      activeFolderCover = cover
      if (!activeFolderCover.userData.originalRot) {
        activeFolderCover.userData.originalRot = activeFolderCover.rotation.clone()
      }
    }

    zoomTo('folder')
  } else if (type === 'books') {
    const baseName = `book_${id}`
    let baseObj = null

    rootScene.traverse((child) => {
      if (child.name === baseName) baseObj = child
    })

    if (baseObj) {
      let baseGroup = baseObj
      while (baseGroup.parent && baseGroup.parent.type === 'Group' && baseGroup.parent.name !== 'Scene') {
        baseGroup = baseGroup.parent
      }

      activeBookBase = baseGroup
      if (!activeBookBase.userData.originalPos) {
        activeBookBase.userData.originalPos = activeBookBase.position.clone()
        activeBookBase.userData.originalRot = activeBookBase.rotation.clone()
      }

      let cover = baseGroup.children ? baseGroup.children.find(c => c.name.toLowerCase().includes('cover')) : null
      if (cover) {
        activeBookCover = cover
        if (!activeBookCover.userData.originalRot) {
          activeBookCover.userData.originalRot = activeBookCover.rotation.clone()
        }
      }
    }

    zoomTo('books')
  }
}

const zoomTo = (target) => {
  if (animating.value) return
  animating.value = true
  const prevActiveElement = activeElement.value
  activeElement.value = target
  showPhoneContent.value = false
  showBookContent.value = false
  showFolderContent.value = false

  const setting = settings.value[target]
  if (!setting) return

  isHovered.value = false
  document.body.style.cursor = 'auto'
  
  if (currentHoveredGroup) {
    highlightGroup(currentHoveredGroup, false)
    currentHoveredGroup = null
    currentHoveredType = null
  }

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  // 📱 Sur mobile, déterminer le lookAt de départ depuis la direction réelle de la caméra
  let lookAtProxy
  if (props.mobileMode && cameraRef.value) {
    const camPos = cameraRef.value.position
    const targetPt = new THREE.Vector3(setting.lookX, setting.lookY, setting.lookZ)
    const targetDist = camPos.distanceTo(targetPt)
    // Lire la vraie direction de la caméra (pas un setting potentiellement décalé)
    const dir = new THREE.Vector3()
    cameraRef.value.getWorldDirection(dir)
    const projected = camPos.clone().addScaledVector(dir, targetDist)
    lookAtProxy = { x: projected.x, y: projected.y, z: projected.z }
  } else {
    lookAtProxy = { x: controls?.target?.x ?? 0, y: controls?.target?.y ?? 0, z: controls?.target?.z ?? 0 }
  }

  if (target === 'phone') {
    const pg = getPhoneGroup()
    if (pg && pg.userData.originalPos) {
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
          showPhoneContent.value = true
        }
      })
    }
  }

  // Animation GSAP de l'objet Livre (Base + Couverture)
  if (target === 'books') {
    if (activeBookBase && activeBookBase.userData.originalPos) {
      gsap.to(activeBookBase.position, {
        x: bookAnimConfig.value.targetPosX,
        y: bookAnimConfig.value.targetPosY,
        z: bookAnimConfig.value.targetPosZ,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      gsap.to(activeBookBase.rotation, {
        x: activeBookBase.userData.originalRot.x + (bookAnimConfig.value.baseRotX * Math.PI / 180),
        y: activeBookBase.userData.originalRot.y + (bookAnimConfig.value.baseRotY * Math.PI / 180),
        z: activeBookBase.userData.originalRot.z + (bookAnimConfig.value.baseRotZ * Math.PI / 180),
        duration: 1.5,
        ease: 'power2.inOut'
      })
    }

    if (activeBookCover && activeBookCover.userData.originalRot) {
      gsap.to(activeBookCover.rotation, {
        x: activeBookCover.userData.originalRot.x + (bookAnimConfig.value.coverRotX * Math.PI / 180),
        y: activeBookCover.userData.originalRot.y + (bookAnimConfig.value.coverRotY * Math.PI / 180),
        z: activeBookCover.userData.originalRot.z + (bookAnimConfig.value.coverRotZ * Math.PI / 180),
        duration: 1.2,
        delay: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          showBookContent.value = true
        }
      })
    } else {
      setTimeout(() => showBookContent.value = true, 1700)
    }
  }

  // Animation GSAP de l'objet Dossier (Manila Folder)
  if (target === 'folder') {
    if (activeFolderBase && activeFolderBase.userData.originalPos) {
      gsap.to(activeFolderBase.position, {
        x: folderAnimConfig.value.targetPosX,
        y: folderAnimConfig.value.targetPosY,
        z: folderAnimConfig.value.targetPosZ,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      gsap.to(activeFolderBase.rotation, {
        x: activeFolderBase.userData.originalRot.x + (folderAnimConfig.value.baseRotX * Math.PI / 180),
        y: activeFolderBase.userData.originalRot.y + (folderAnimConfig.value.baseRotY * Math.PI / 180),
        z: activeFolderBase.userData.originalRot.z + (folderAnimConfig.value.baseRotZ * Math.PI / 180),
        duration: 1.5,
        ease: 'power2.inOut'
      })
    }

    if (activeFolderCover && activeFolderCover.userData.originalRot) {
      gsap.to(activeFolderCover.rotation, {
        x: activeFolderCover.userData.originalRot.x + (folderAnimConfig.value.coverRotX * Math.PI / 180),
        y: activeFolderCover.userData.originalRot.y + (folderAnimConfig.value.coverRotY * Math.PI / 180),
        z: activeFolderCover.userData.originalRot.z + (folderAnimConfig.value.coverRotZ * Math.PI / 180),
        duration: 1.2,
        delay: 0.2, // Ouvre le dossier presque tout de suite
        ease: 'power2.inOut',
        onComplete: () => {
          showFolderContent.value = true
        }
      })
    } else {
      setTimeout(() => showFolderContent.value = true, 1200)
    }
  }

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

  // 📱 Sur mobile, quitter les socials → redescendre les cards
  if (props.mobileMode && activeElement.value === 'socials') {
    levitateSocialCards(false)
  }

  // 📱 Sur mobile, quitter le drawer → refermer le tiroir
  if (props.mobileMode && activeElement.value === 'drawer') {
    let rootScene = cameraRef.value
    while (rootScene?.parent) rootScene = rootScene.parent
    if (rootScene) {
      rootScene.traverse((child) => {
        if (child.name && child.name.toLowerCase().includes('drawer_bottom') && child.userData?.isOpen) {
          toggleDrawer(child)
        }
      })
    }
  }

  // 📱 Sur mobile, quitter un livre → retour au bookshelf
  if (props.mobileMode && activeElement.value === 'books') {
    if (activeBookBase && activeBookBase.userData.originalPos) {
      showBookContent.value = false
      gsap.killTweensOf(activeBookBase.position)
      gsap.killTweensOf(activeBookBase.rotation)
      gsap.to(activeBookBase.position, { x: activeBookBase.userData.originalPos.x, y: activeBookBase.userData.originalPos.y, z: activeBookBase.userData.originalPos.z, duration: 1, ease: 'power2.inOut' })
      gsap.to(activeBookBase.rotation, { x: activeBookBase.userData.originalRot.x, y: activeBookBase.userData.originalRot.y, z: activeBookBase.userData.originalRot.z, duration: 1, ease: 'power2.inOut' })
    }
    if (activeBookCover && activeBookCover.userData.originalRot) {
      gsap.killTweensOf(activeBookCover.rotation)
      gsap.to(activeBookCover.rotation, { x: activeBookCover.userData.originalRot.x, y: activeBookCover.userData.originalRot.y, z: activeBookCover.userData.originalRot.z, duration: 1, ease: 'power2.inOut' })
    }
    // Garder activeElement = 'books' pour que zoomTo sache d'où on vient
    animating.value = false
    zoomTo('bookshelf')
    return
  }

  // 📱 Sur mobile, quitter un folder → retour au drawer
  if (props.mobileMode && activeElement.value === 'folder') {
    // Restaurer le dossier d'abord
    if (activeFolderBase && activeFolderBase.userData.originalPos) {
      showFolderContent.value = false
      gsap.killTweensOf(activeFolderBase.position)
      gsap.killTweensOf(activeFolderBase.rotation)
      gsap.to(activeFolderBase.position, { x: activeFolderBase.userData.originalPos.x, y: activeFolderBase.userData.originalPos.y, z: activeFolderBase.userData.originalPos.z, duration: 1, ease: 'power2.inOut' })
      gsap.to(activeFolderBase.rotation, { x: activeFolderBase.userData.originalRot.x, y: activeFolderBase.userData.originalRot.y, z: activeFolderBase.userData.originalRot.z, duration: 1, ease: 'power2.inOut' })
    }
    if (activeFolderCover && activeFolderCover.userData.originalRot) {
      gsap.killTweensOf(activeFolderCover.rotation)
      gsap.to(activeFolderCover.rotation, { x: activeFolderCover.userData.originalRot.x, y: activeFolderCover.userData.originalRot.y, z: activeFolderCover.userData.originalRot.z, duration: 1, ease: 'power2.inOut' })
    }
    // Garder activeElement = 'folder' pour que zoomTo sache d'où on vient
    animating.value = false
    zoomTo('drawer')
    return
  }

  animating.value = true
  // 📱 Capturer le setting de l'élément actif AVANT de le réinitialiser
  const prevElement = activeElement.value
  const prevSetting = prevElement ? settings.value[prevElement] : null
  activeElement.value = null

  if (phoneGroup && phoneGroup.userData.originalPos) {
    showPhoneContent.value = false
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

  // --- RESTAURER LA SCÈNE (Livre) ---
  if (activeBookBase && activeBookBase.userData.originalPos) {
    showBookContent.value = false // Cacher le texte
    gsap.killTweensOf(activeBookBase.position)
    gsap.killTweensOf(activeBookBase.rotation)
    gsap.to(activeBookBase.position, {
      x: activeBookBase.userData.originalPos.x,
      y: activeBookBase.userData.originalPos.y,
      z: activeBookBase.userData.originalPos.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
    gsap.to(activeBookBase.rotation, {
      x: activeBookBase.userData.originalRot.x,
      y: activeBookBase.userData.originalRot.y,
      z: activeBookBase.userData.originalRot.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }

  if (activeBookCover && activeBookCover.userData.originalRot) {
    gsap.killTweensOf(activeBookCover.rotation)
    gsap.to(activeBookCover.rotation, {
      x: activeBookCover.userData.originalRot.x,
      y: activeBookCover.userData.originalRot.y,
      z: activeBookCover.userData.originalRot.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }

  // --- RESTAURER LA SCÈNE (Dossier Manila) ---
  if (activeFolderBase && activeFolderBase.userData.originalPos) {
    showFolderContent.value = false
    gsap.killTweensOf(activeFolderBase.position)
    gsap.killTweensOf(activeFolderBase.rotation)
    gsap.to(activeFolderBase.position, {
      x: activeFolderBase.userData.originalPos.x,
      y: activeFolderBase.userData.originalPos.y,
      z: activeFolderBase.userData.originalPos.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
    gsap.to(activeFolderBase.rotation, {
      x: activeFolderBase.userData.originalRot.x,
      y: activeFolderBase.userData.originalRot.y,
      z: activeFolderBase.userData.originalRot.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }

  if (activeFolderCover && activeFolderCover.userData.originalRot) {
    showFolderContent.value = false
    gsap.killTweensOf(activeFolderCover.rotation)
    gsap.to(activeFolderCover.rotation, {
      x: activeFolderCover.userData.originalRot.x,
      y: activeFolderCover.userData.originalRot.y,
      z: activeFolderCover.userData.originalRot.z,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  const resetTarget = { x: defaultLookAt.value.x, y: defaultLookAt.value.y, z: defaultLookAt.value.z }
  // 📱 Sur mobile, partir de la direction réelle de la caméra
  let lookAtProxy
  if (props.mobileMode && cameraRef.value) {
    const camPos = cameraRef.value.position
    const lookTarget = new THREE.Vector3(mobileLookAtInit.value.x, mobileLookAtInit.value.y, mobileLookAtInit.value.z)
    const targetDist = camPos.distanceTo(lookTarget)
    const dir = new THREE.Vector3()
    cameraRef.value.getWorldDirection(dir)
    const projected = camPos.clone().addScaledVector(dir, targetDist)
    lookAtProxy = { x: projected.x, y: projected.y, z: projected.z }
  } else {
    lookAtProxy = { x: controls?.target?.x ?? 0, y: controls?.target?.y ?? 0, z: controls?.target?.z ?? 0 }
  }

  const camTarget = props.mobileMode ? mobileCamPos.value : defaultCamPos.value
  const lookTarget = props.mobileMode ? mobileLookAtInit.value : resetTarget

  gsap.to(cameraRef.value.position, {
    x: camTarget.x, y: camTarget.y, z: camTarget.z,
    duration: 1.5, ease: "power2.inOut",
    onUpdate: () => {
      cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
    },
    onComplete: () => {
      // 🟢 Mettre à jour la target du contrôleur QUE sur Desktop
      if (controls && !props.mobileMode) {
        controls.target.set(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
      }
    }
  })

  gsap.to(lookAtProxy, {
    x: lookTarget.x, y: lookTarget.y, z: lookTarget.z,
    duration: 1.5, ease: "power2.inOut",
    onComplete: () => {
      animating.value = false
      // 📱 Réinitialiser le look-around mobile
      if (props.mobileMode) initMobileLookAngles()
    }
  })
}

// --- ANIMATION USB PLUG ---
let activeUSB = null
const animateUSBPlug = (group) => {
  if (animating.value) return
  
  // On ne bloque PAS animating ici pour éviter les soft-locks
  // Mais on empêche les clics multiples
  activeUSB = group
  
  if (!activeUSB.userData.originalPos) {
    activeUSB.userData.originalPos = activeUSB.position.clone()
    activeUSB.userData.originalRot = activeUSB.rotation.clone()
  }

  // 1. Déclenchement visuel immédiat
  showDownloadScreen.value = true
  downloadPercent.value = 0
  
  // 2. Zoom vers l'écran (On utilise les réglages laptop pour être sûr de bien voir)
  zoomTo('usb')
  
  const config = settings.value.usb
  
  // 3. Timeline d'animation
  const tl = gsap.timeline({
    onComplete: () => {
      // Démarrage du faux téléchargement
      gsap.to(downloadPercent, {
        value: 100,
        duration: 4,
        roundProps: "value",
        onUpdate: () => {
          // On s'assure que l'écran est bien visible
          if (!showDownloadScreen.value) showDownloadScreen.value = true
        },
        onComplete: () => {
          // Téléchargement réel
          const link = document.createElement('a')
          link.href = '/CV-ANJAH.pdf'
          link.download = 'CV_Anjah_Rakotovao.pdf'
          link.click()
          
          // Pause et feedback final
          setTimeout(() => {
            showDownloadScreen.value = false
            resetZoom()
            
            // Retour de la clé à sa place
            gsap.to(activeUSB.position, {
              x: activeUSB.userData.originalPos.x,
              y: activeUSB.userData.originalPos.y,
              z: activeUSB.userData.originalPos.z,
              duration: 1.5,
              ease: 'power2.inOut'
            })
            gsap.to(activeUSB.rotation, {
              x: activeUSB.userData.originalRot.x,
              y: activeUSB.userData.originalRot.y,
              z: activeUSB.userData.originalRot.z,
              duration: 1.5,
              ease: 'power2.inOut'
            })
          }, 2500)
        }
      })
    }
  })

  // Animation physique de la clé
  tl.to(activeUSB.position, {
    x: config.posX,
    y: config.posY,
    z: config.posZ,
    duration: 1,
    ease: 'power2.inOut'
  })
}
const previewItem = (item) => {
  if (animating.value || activeElement.value !== null) return

  const clearHover = () => {
    if (currentHoveredGroup) {
      highlightGroup(currentHoveredGroup, false)
      currentHoveredGroup = null
      currentHoveredType = null
    }
    hoveredMeshName.value = ''
    menuPreviewActive = false
  }

  if (!item || item.action === 'intro') {
    clearHover()
    return
  }

  menuPreviewActive = true

  const { action, id, book } = item
  let rootScene = cameraRef.value
  if (!rootScene) return
  while (rootScene.parent) {
    rootScene = rootScene.parent
  }

  let lookupType = null
  if (action === 'drawer' || action === 'folder') lookupType = action
  else if (action === 'phone') lookupType = 'phone'
  else if (action === 'books') lookupType = 'book'
  else if (action === 'toggle-light') lookupType = 'switch'
  else if (action === 'social') lookupType = 'social'

  if (!lookupType) return clearHover()

  let foundMesh = null
  rootScene.traverse((child) => {
    if (foundMesh) return
    const name = child.name ? child.name.toLowerCase() : ''
    
    if (lookupType === 'phone' && name.startsWith(PHONE_PREFIX.toLowerCase())) foundMesh = child
    else if (lookupType === 'drawer' && name.includes('drawer_bottom')) foundMesh = child
    else if (lookupType === 'folder' && id && name.startsWith(`folder_${id}`.toLowerCase()) && !name.includes('cover') && !name.includes('paper')) foundMesh = child
    else if (lookupType === 'folder' && !id && name.includes('folder')) foundMesh = child
    else if (lookupType === 'switch' && LIGHT_SWITCH.some(p => name.includes(p.toLowerCase()))) foundMesh = child
    else if (lookupType === 'book' && book && name === `book_${book}`) foundMesh = child
    else if (lookupType === 'book' && !book && (BOOK_PARTS.some(p => name.includes(p.toLowerCase())) || name.includes('book'))) {
      if (!name.includes('shelf') && !name.includes('book_shelf')) foundMesh = child
    }
    else if (lookupType === 'social' && item.socialId && name.includes(item.socialId)) foundMesh = child
  })

  // getInteractiveData requires ANY mesh of that type to fetch the full array/group logic!
  const data = foundMesh ? getInteractiveData(foundMesh) : null
  hoveredMeshName.value = data ? data.type : ''

  if (data) {
    const { type, group } = data
    if (currentHoveredType !== type || (type !== 'laptop' && type !== 'switch' && currentHoveredGroup !== group)) {
      if (currentHoveredGroup) highlightGroup(currentHoveredGroup, false)
      currentHoveredGroup = group
      currentHoveredType = type
      highlightGroup(currentHoveredGroup, true)
    }
  } else {
    clearHover()
  }
}

// 🎮 Expose les actions pour le menu
defineExpose({
  zoomTo,
  resetZoom,
  toggleLight,
  activeElement,
  activateItemByName,
  previewItem
})
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

/* TOOLTIP INTERACTIF */
.hover-tooltip {
  position: fixed;
  z-index: 200;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px 6px 10px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  transform: translate(16px, -50%);
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.tooltip-indicator {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
}

.tooltip-text {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
}

.tooltip-fade-enter-active {
  transition: all 0.15s ease-out;
}

.tooltip-fade-leave-active {
  transition: all 0.1s ease-in;
}

.tooltip-fade-enter-from {
  opacity: 0;
  transform: translate(10px, -50%);
}

.tooltip-fade-leave-to {
  opacity: 0;
}

/* 📱 LABELS FLOTTANTS MOBILE */
.mobile-label {
  font-family: 'Inter Variable', 'Inter', -apple-system, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 3px;
  white-space: nowrap;
  user-select: none;
  animation: label-pulse 2.5s ease-in-out infinite;
}

.mobile-label--clickable {
  pointer-events: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mobile-label--clickable:active {
  transform: scale(0.93);
  background: rgba(255, 255, 255, 0.15);
}

.mobile-label::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.6);
}

@keyframes label-pulse {
  0%, 100% { opacity: 0.85; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
}
</style>