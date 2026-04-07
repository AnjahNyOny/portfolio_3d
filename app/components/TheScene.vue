<template>
  <div 
    class="relative h-screen w-full bg-zinc-950 overflow-hidden"
  >
    
    <!-- 🔧 TOGGLE CALIBRATION MODE (toujours visible, coin bas-droite) -->
    <button 
      @click="calibrationMode = !calibrationMode" 
      class="absolute bottom-4 right-4 z-[100] p-2 rounded-lg text-xs font-bold border-2 transition-all pointer-events-auto shadow-lg"
      :class="calibrationMode ? 'bg-green-600/90 hover:bg-green-500 border-green-400 text-white' : 'bg-zinc-800/70 hover:bg-zinc-700 border-zinc-600 text-zinc-400'"
    >
      {{ calibrationMode ? '🔓 Calibration ON' : '🔒 Calibration OFF' }}
    </button>

    <!-- 💡 BOUTON POUR AFFICHER LA CALIBRATION LUMIÈRE -->
    <button v-if="calibrationMode && !showLightCalibration" @click="showLightCalibration = true" class="absolute top-10 left-10 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-zinc-600">
      💡 Régler Lumières
    </button>

    <!-- 📷 BOUTON POUR AFFICHER LA CALIBRATION CAMÉRA -->
    <button v-if="calibrationMode && !showCameraCalibration" @click="showCameraCalibration = true" class="absolute top-10 left-52 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border border-cyan-600">
      📷 Régler Caméra
    </button>

    <!-- 🔍 BOUTON DEBUG MESHS -->
    <button v-if="calibrationMode" @click="showMeshNames = !showMeshNames" class="absolute top-20 left-10 z-[100] bg-zinc-800/90 hover:bg-zinc-700 text-white p-2 rounded text-xs font-bold border" :class="showMeshNames ? 'border-green-500 text-green-400' : 'border-zinc-600'">
      {{ showMeshNames ? '👁️ Cacher Noms Meshs' : '🔍 Afficher Noms Meshs' }}
    </button>

    <!-- 🟢 OVERLAY NOM MESH COURANT -->
    <div v-if="showMeshNames && hoveredMeshName" class="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-black/90 text-green-400 p-4 rounded-lg border-2 border-green-500 font-mono text-lg shadow-[0_0_15px_rgba(34,197,94,0.5)] pointer-events-none transition-all">
      Mesh survolé : <span class="font-bold text-white">{{ hoveredMeshName }}</span>
    </div>

    <!-- 🛠️ INTERFACE DE CALIBRATION LUMIÈRES -->
    <div v-if="calibrationMode && showLightCalibration" class="absolute top-10 left-10 z-[100] bg-zinc-800/90 text-white p-4 rounded text-xs w-[250px] max-h-[80vh] overflow-y-auto pointer-events-auto shadow-2xl">
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
        Environnement GLOBAL: <input type="number" step="0.1" v-model.number="lightState.envIntensity" class="w-full bg-black/50 p-1 mb-1" @input="updateEnvIntensity" />
        
        <label class="block font-bold text-red-500 mt-2">🎯 Cible du Soleil (Où il pointe)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.x" class="w-full bg-black/50 p-1 mb-1" @input="updateSunTarget" />
        y: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.y" class="w-full bg-black/50 p-1 mb-1" @input="updateSunTarget" />
        z: <input type="number" step="0.5" v-model.number="lightPos.sunTarget.z" class="w-full bg-black/50 p-1 mb-1" @input="updateSunTarget" />

        <label class="block font-bold text-yellow-300 mt-2">✨ God Ray (Rayon volumétrique)</label>
        x: <input type="number" step="0.1" v-model.number="lightPos.godRay.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.1" v-model.number="lightPos.godRay.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.1" v-model.number="lightPos.godRay.z" class="w-full bg-black/50 p-1 mb-1" />
        rotX (deg): <input type="number" step="5" v-model.number="lightPos.godRay.rotX" class="w-full bg-black/50 p-1 mb-1" />
        rotY (deg): <input type="number" step="5" v-model.number="lightPos.godRay.rotY" class="w-full bg-black/50 p-1 mb-1" />
        rotZ (deg): <input type="number" step="5" v-model.number="lightPos.godRay.rotZ" class="w-full bg-black/50 p-1 mb-1" />
        Opacité: <input type="number" step="0.05" v-model.number="lightPos.godRay.opacity" class="w-full bg-black/50 p-1 mb-1" @input="updateGodRayOpacity" />
      </div>
      <div>
        <label class="block font-bold text-blue-400">🌙 Lampe Bureau (Nuit)</label>
        x: <input type="number" step="0.5" v-model.number="lightPos.desk.x" class="w-full bg-black/50 p-1 mb-1" />
        y: <input type="number" step="0.5" v-model.number="lightPos.desk.y" class="w-full bg-black/50 p-1 mb-1" />
        z: <input type="number" step="0.5" v-model.number="lightPos.desk.z" class="w-full bg-black/50 p-1 mb-1" />
        Lampe (Intensité): <input type="number" step="1" v-model.number="lightState.desk" class="w-full bg-black/50 p-1 mb-1" />
      </div>
    </div>

    <!-- 📷 INTERFACE DE CALIBRATION CAMÉRA -->
    <div v-if="calibrationMode && showCameraCalibration" class="absolute top-10 left-[280px] z-[100] bg-zinc-900/95 text-white p-4 rounded-lg text-xs w-[280px] max-h-[85vh] overflow-y-auto pointer-events-auto shadow-2xl border border-cyan-700/50">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-cyan-400 text-sm">📷 Calibration Caméra</h3>
        <button @click="showCameraCalibration = false" class="text-red-400 font-bold px-2 hover:bg-zinc-700 rounded">X</button>
      </div>

      <!-- LIVE READOUT -->
      <div class="mb-3 p-2 bg-black/60 rounded border border-zinc-700">
        <label class="block font-bold text-green-400 mb-1">🔴 Position actuelle (LIVE)</label>
        <div class="font-mono text-[10px] text-green-300 space-y-0.5">
          <div>Cam: x={{ liveCamPos.x }} y={{ liveCamPos.y }} z={{ liveCamPos.z }}</div>
          <div>Target: x={{ liveCamTarget.x }} y={{ liveCamTarget.y }} z={{ liveCamTarget.z }}</div>
          <div class="text-yellow-300 mt-1">Polar: {{ liveAngles.polar }}° | Azimuth: {{ liveAngles.azimuth }}° | Dist: {{ liveAngles.distance }}</div>
        </div>
      </div>

      <!-- POSITION PAR DÉFAUT (HOME) -->
      <div class="mb-3 border-b border-zinc-600 pb-3">
        <label class="block font-bold text-cyan-300 mb-1">🏠 Position d'accueil (Home)</label>
        <div class="mb-2">
          <label class="block text-zinc-400">Caméra Position</label>
          x: <input type="number" step="0.1" v-model.number="defaultCamPos.x" class="w-full bg-black/50 p-1 mb-1 rounded" />
          y: <input type="number" step="0.1" v-model.number="defaultCamPos.y" class="w-full bg-black/50 p-1 mb-1 rounded" />
          z: <input type="number" step="0.1" v-model.number="defaultCamPos.z" class="w-full bg-black/50 p-1 mb-1 rounded" />
        </div>
        <div class="mb-2">
          <label class="block text-zinc-400">LookAt (Cible)</label>
          x: <input type="number" step="0.1" v-model.number="defaultLookAt.x" class="w-full bg-black/50 p-1 mb-1 rounded" />
          y: <input type="number" step="0.1" v-model.number="defaultLookAt.y" class="w-full bg-black/50 p-1 mb-1 rounded" />
          z: <input type="number" step="0.1" v-model.number="defaultLookAt.z" class="w-full bg-black/50 p-1 mb-1 rounded" />
        </div>
      </div>

      <!-- ORBIT CONSTRAINTS -->
      <div class="mb-3 border-b border-zinc-600 pb-3">
        <label class="block font-bold text-yellow-300 mb-2">🔒 Limites Orbit Controls</label>
        
        <!-- ZOOM (DISTANCE) -->
        <div class="mb-3 p-2 bg-black/40 rounded">
          <label class="block font-bold text-blue-300 text-[11px] mb-1">🔍 Zoom (Distance)</label>
          <p class="text-zinc-500 text-[9px] mb-1 italic">Combien l'utilisateur peut zoomer/dézoomer. Plus petit = plus proche du bureau, plus grand = plus de recul.</p>
          <div class="grid grid-cols-2 gap-1">
            <div>
              <label class="block text-zinc-400 text-[10px]">Min (zoom max)</label>
              <input type="range" min="0.5" max="5" step="0.1" v-model.number="orbitLimits.minDistance" class="w-full" />
              <input type="number" step="0.1" v-model.number="orbitLimits.minDistance" class="w-full bg-black/50 p-1 rounded text-center" />
            </div>
            <div>
              <label class="block text-zinc-400 text-[10px]">Max (dézoom max)</label>
              <input type="range" min="2" max="15" step="0.5" v-model.number="orbitLimits.maxDistance" class="w-full" />
              <input type="number" step="0.5" v-model.number="orbitLimits.maxDistance" class="w-full bg-black/50 p-1 rounded text-center" />
            </div>
          </div>
        </div>

        <!-- POLAR (VERTICAL) -->
        <div class="mb-3 p-2 bg-black/40 rounded">
          <label class="block font-bold text-orange-300 text-[11px] mb-1">📐 Angle Polaire (Haut ↕ Bas)</label>
          <p class="text-zinc-500 text-[9px] mb-1 italic">Contrôle la hauteur de la vue. 0° = plongée au-dessus. 90° = vue horizontale. 180° = vue d'en bas.</p>
          <div class="font-mono text-[9px] text-zinc-600 mb-2 leading-tight whitespace-pre">  0° = 🔽 Vue plafond (plongée)
 45° = ↘ Vue 3/4 plongeante
 60° = ↗ Vue isométrique ← actuel min
 79° = → Vue quasi-horizontale ← actuel max
 90° = → Pile horizontale
180° = 🔼 Vue sol (contre-plongée)</div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-orange-400 text-[10px] w-8">Min</span>
            <input type="range" min="0" max="90" step="1" v-model.number="orbitLimits.minPolarDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.minPolarDeg" class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-orange-400 text-[10px] w-8">Max</span>
            <input type="range" min="0" max="90" step="1" v-model.number="orbitLimits.maxPolarDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.maxPolarDeg" class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="text-green-400 text-[10px] mt-1 font-mono">👁️ Actuel : {{ liveAngles.polar }}°</div>
        </div>

        <!-- AZIMUTH (HORIZONTAL) -->
        <div class="mb-2 p-2 bg-black/40 rounded">
          <label class="block font-bold text-pink-300 text-[11px] mb-1">🧭 Angle Azimut (Gauche ↔ Droite)</label>
          <p class="text-zinc-500 text-[9px] mb-1 italic">Contrôle la rotation horizontale autour de la pièce. Permet de limiter pour ne pas voir derrière les murs.</p>
          <div class="font-mono text-[9px] text-zinc-600 mb-2 leading-tight whitespace-pre">-90° = ← Mur de gauche
  0° = ↑ Face (devant le bureau)
 +90° = → Mur de droite
+180° = ↓ Derrière (mur du fond)</div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-pink-400 text-[10px] w-8">Min</span>
            <input type="range" min="-180" max="0" step="1" v-model.number="orbitLimits.minAzimuthDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.minAzimuthDeg" class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-pink-400 text-[10px] w-8">Max</span>
            <input type="range" min="0" max="180" step="1" v-model.number="orbitLimits.maxAzimuthDeg" class="flex-1" />
            <input type="number" step="1" v-model.number="orbitLimits.maxAzimuthDeg" class="w-14 bg-black/50 p-1 rounded text-center" />
            <span class="text-zinc-500 text-[9px]">°</span>
          </div>
          <div class="text-green-400 text-[10px] mt-1 font-mono">👁️ Actuel : {{ liveAngles.azimuth }}°</div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="space-y-2">
        <button @click="captureCurrentView" class="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors p-2 rounded font-bold text-white shadow-lg">
          📸 Capturer la vue actuelle → Home
        </button>
        <button @click="testHomePosition" class="w-full bg-green-600 hover:bg-green-500 transition-colors p-2 rounded font-bold text-white shadow-lg">
          ▶️ Tester (Aller à Home)
        </button>
        <button @click="copyCameraCode" class="w-full bg-purple-600 hover:bg-purple-500 transition-colors p-2 rounded font-bold text-white shadow-lg">
          📋 Copier le code
        </button>
      </div>

      <!-- CODE OUTPUT -->
      <div v-if="cameraCodeOutput" class="mt-3 p-2 bg-black/80 rounded border border-purple-500 font-mono text-[10px] text-purple-300 whitespace-pre-wrap">
        {{ cameraCodeOutput }}
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

      <!-- SECTON LIVRE 3D -->
      <div v-if="activeElement === 'books'" class="mt-4 border-t border-zinc-600 pt-2 max-h-[300px] overflow-y-auto">
        <h3 class="font-bold text-blue-400 mb-2">📚 Animation Livre 3D</h3>
        <h4 class="font-bold text-xs text-zinc-300">Position Finale (Absolue)</h4>
        Pos Cible X: <input type="number" step="0.1" v-model.number="bookAnimConfig.targetPosX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Pos Cible Y: <input type="number" step="0.1" v-model.number="bookAnimConfig.targetPosY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Pos Cible Z: <input type="number" step="0.1" v-model.number="bookAnimConfig.targetPosZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Rot Globale X: <input type="number" step="5" v-model.number="bookAnimConfig.baseRotX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Rot Globale Y: <input type="number" step="5" v-model.number="bookAnimConfig.baseRotY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Rot Globale Z: <input type="number" step="5" v-model.number="bookAnimConfig.baseRotZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />

        <h4 class="font-bold text-xs text-pink-300 mt-2">Ouverture (Couverture)</h4>
        Ouvrir Axe X: <input type="number" step="5" v-model.number="bookAnimConfig.coverRotX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Ouvrir Axe Y: <input type="number" step="5" v-model.number="bookAnimConfig.coverRotY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
        Ouvrir Axe Z: <input type="number" step="5" v-model.number="bookAnimConfig.coverRotZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateBookAnim" />
      </div>

      <!-- SECTON DOSSIER 3D -->
      <div v-if="activeElement === 'folder'" class="mt-4 border-t border-zinc-600 pt-2 max-h-[300px] overflow-y-auto">
        <h3 class="font-bold text-yellow-400 mb-2">📁 Animation Dossier 3D</h3>
        <h4 class="font-bold text-xs text-zinc-300">Position Finale (Absolue)</h4>
        Pos Cible X: <input type="number" step="0.1" v-model.number="folderAnimConfig.targetPosX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Pos Cible Y: <input type="number" step="0.1" v-model.number="folderAnimConfig.targetPosY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Pos Cible Z: <input type="number" step="0.1" v-model.number="folderAnimConfig.targetPosZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Rot Globale X: <input type="number" step="5" v-model.number="folderAnimConfig.baseRotX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Rot Globale Y: <input type="number" step="5" v-model.number="folderAnimConfig.baseRotY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Rot Globale Z: <input type="number" step="5" v-model.number="folderAnimConfig.baseRotZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />

        <h4 class="font-bold text-xs text-pink-300 mt-2">Ouverture (Couverture)</h4>
        Ouvrir Axe X: <input type="number" step="5" v-model.number="folderAnimConfig.coverRotX" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Ouvrir Axe Y: <input type="number" step="5" v-model.number="folderAnimConfig.coverRotY" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
        Ouvrir Axe Z: <input type="number" step="5" v-model.number="folderAnimConfig.coverRotZ" class="w-full bg-black/50 text-white p-1 mb-1 focus:outline-none" @input="updateFolderAnim" />
      </div>
    </div>
    <TresCanvas :clear-color="isDarkMode ? '#050505' : '#e0f2fe'" shadows window-size>
      <TresPerspectiveCamera 
        ref="cameraRef" 
        :position="[1.79, 2.26, 2.58]" 
        :look-at="[1.31, 1.62, 0.06]" 
      />
      
      <OrbitControls 
        ref="controlsRef" 
        :enabled="!animating && !activeElement"
        :enable-pan="calibrationMode"
        :min-distance="orbitLimits.minDistance" 
        :max-distance="(calibrationMode || activeElement) ? 50 : orbitLimits.maxDistance" 
        :min-polar-angle="(calibrationMode || activeElement) ? 0 : (orbitLimits.minPolarDeg * Math.PI / 180)"
        :max-polar-angle="(calibrationMode || activeElement) ? Math.PI : (orbitLimits.maxPolarDeg * Math.PI / 180)"
        :min-azimuth-angle="(calibrationMode || activeElement) ? -Infinity : (orbitLimits.minAzimuthDeg * Math.PI / 180)"
        :max-azimuth-angle="(calibrationMode || activeElement) ? Infinity : (orbitLimits.maxAzimuthDeg * Math.PI / 180)"
        @change="updateLiveCamReadout"
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
      <!-- On passe d'une DirectionalLight à une SpotLight pour éviter que la lumière ne passe par-dessus les murs sans plafond ! -->
      <TresSpotLight 
        ref="sunLightRef"
        :position="[lightPos.sun.x, lightPos.sun.y, lightPos.sun.z]" 
        :intensity="lightState.window" 
        :angle="Math.PI / 6" :penumbra="0.3"
        :decay="0"
        :distance="100"
        color="#fff0dd"
        cast-shadow
        :shadow-mapSize-width="4096"
        :shadow-mapSize-height="4096"
        :shadow-bias="-0.0005"
        :shadow-normalBias="0.05" >
        <TresObject3D attach="target" :position="[lightPos.sunTarget.x, lightPos.sunTarget.y, lightPos.sunTarget.z]" />
      </TresSpotLight>

      <!-- ✨ FAUX RAYONS VOLUMÉTRIQUES (GOD RAYS) DE LA FENÊTRE -->
      <!-- On l'enveloppe dans un Groupe pour pouvoir définir l'origine de rotation (pivot) tout en haut, façon lampe torche ! -->
      <TresGroup
        v-if="!isDarkMode" 
        :position="[lightPos.godRay.x, lightPos.godRay.y, lightPos.godRay.z]" 
        :rotation="[lightPos.godRay.rotX * (Math.PI / 180), lightPos.godRay.rotY * (Math.PI / 180), lightPos.godRay.rotZ * (Math.PI / 180)]"
      >
        <!-- AIDES VISUELLES : Axes X (Rouge), Y (Vert), Z (Bleu) pour guider la visée au point de départ -->
        <TresAxesHelper v-if="calibrationMode" :args="[5]" />

        <!-- Le mesh est décalé vers le bas (y: -7.5 car longueur 15) pour pivoter depuis sa base -->
        <!-- La rotation Math.PI/4 (45°) convertit sa forme de losange par défaut en forme carrée ! -->
        <TresMesh :position="[0, -7.5, 0]" :rotation="[0, Math.PI / 4, 0]">
          <!-- Cylindre à 4 faces = Pyramide évasée pour la fenêtre -->
          <TresCylinderGeometry :args="[0.4, 3.0, 15, 4, 1, true]" />
          <TresShaderMaterial 
            :transparent="true"
            :depthWrite="false"
            :blending="2"
            :side="2"
            :uniforms="godRayUniforms"
            :vertexShader="`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `"
            :fragmentShader="`
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
            `"
          />
        </TresMesh>
      </TresGroup>
      
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
          path="/models/room_v12.glb" 
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
          
          <!-- MODE INTRO -->
          <div v-if="showIntro" 
               :style="{ width: settings.laptop.width + 'px', height: settings.laptop.height + 'px', backfaceVisibility: 'hidden' }"
               class="bg-zinc-950 rounded-md pointer-events-auto shadow-[0_0_10px_rgba(255,255,255,0.1)] overflow-hidden flex items-center justify-center">
            <div class="p-12 max-w-2xl text-center">
              <!-- Ligne décorative -->
              <div class="flex items-center justify-center gap-4 mb-8">
                <div class="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
                <span class="text-white/30 text-xs tracking-[0.3em] uppercase font-light">Portfolio</span>
                <div class="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
              </div>

              <!-- Nom -->
              <h1 class="text-5xl font-black text-white tracking-wide mb-3">
                ANJAH NY ONY
              </h1>
              
              <!-- Titre -->
              <p class="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
                Développeur Web Fullstack
              </p>
              
              <!-- Description -->
              <p class="text-white/60 leading-relaxed text-sm mb-8">
                Passionné par l’innovation numérique, je conçois des solutions web modernes, fluides et performantes. De la conception de bases de données à la création d’interfaces intuitives, je transforme des idées complexes en outils fonctionnels. Ce site et son CMS ont été entièrement bâtis par mes soins.
              </p>

              <!-- Badges -->
              <div class="flex flex-wrap justify-center gap-2 mb-8">
                <span class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">Développeur Full-Stack Junior</span>
                <span class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">Spécialiste Vue.js & Node.js</span>
                <span class="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">Recherche 1er Emploi à Québec</span>
                <span class="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400">Permis de Travail Ouvert 🇨🇦</span>
              </div>

              <!-- Localisation -->
              <div class="flex items-center justify-center gap-2 text-white/30 text-xs">
                <span>📍</span>
                <span>Saint-Anselme, Québec, Canada</span>
              </div>
            </div>
          </div>

          <!-- MODE SITE WEB -->
          <iframe v-else src="https://anjahnyony.com" 
                  :style="{ width: settings.laptop.width + 'px', height: settings.laptop.height + 'px', backfaceVisibility: 'hidden' }"
                  class="border-none bg-white rounded-md pointer-events-auto shadow-[0_0_10px_rgba(255,255,255,0.1)]"></iframe>
        </Html>
      </TresGroup>

      <!-- ECRAN TELEPHONE -->
      <TresGroup 
        v-if="activeElement === 'phone'" 
        :position="[settings.phone.htmlPosX, settings.phone.htmlPosY, settings.phone.htmlPosZ]" 
      >
        <Html key="html-phone" transform wrapper-class="ecran-phone" 
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

      <!-- CONTENU DES LIVRES -->
      <TresGroup 
        v-if="activeElement === 'books'" 
        :position="[settings.books.htmlPosX, settings.books.htmlPosY, settings.books.htmlPosZ]" 
      >
        <Html key="html-books" transform wrapper-class="livre-content" 
              :rotation-x="settings.books.htmlRotX" 
              :rotation-y="settings.books.htmlRotY" 
              :rotation-z="settings.books.htmlRotZ" 
              :scale="settings.books.scale">
          <Transition 
            enter-active-class="transition-opacity duration-1000" 
            enter-from-class="opacity-0" 
            leave-active-class="transition-opacity duration-300" 
            leave-to-class="opacity-0"
          >
            <div v-show="showBookContent" :style="{ width: settings.books.width + 'px', height: settings.books.height + 'px' }"
                 class="relative bg-[#f4ecd8] border-2 border-[#d0c0a0] rounded-r-lg shadow-[inset_10px_0_20px_rgba(0,0,0,0.1)] p-8 pointer-events-auto overflow-y-auto text-[#403020] font-serif">
              
              <!-- LIVRE : STACK & SKILLS -->
              <template v-if="selectedBook === 'stack'">
                <h2 class="text-3xl font-bold mb-6 text-center border-b-2 border-[#d0c0a0] pb-4">⚡ Stack & Skills</h2>
                <div class="space-y-5">
                  <div class="mb-4">
                    <h3 class="text-lg font-bold text-[#8b6914] mb-2">Frontend</h3>
                    <div class="space-y-2">
                      <div v-for="skill in ['Vue.js / Nuxt', 'TresJS / Three.js', 'GSAP Animations', 'TailwindCSS', 'HTML5 / CSS3']" :key="skill" class="flex items-center gap-2">
                        <span class="text-green-700">✦</span>
                        <span class="font-medium">{{ skill }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <h3 class="text-lg font-bold text-[#8b6914] mb-2">Backend</h3>
                    <div class="space-y-2">
                      <div v-for="skill in ['Node.js / Express', 'MongoDB', 'Firebase', 'REST APIs', 'Socket.io']" :key="skill" class="flex items-center gap-2">
                        <span class="text-blue-700">✦</span>
                        <span class="font-medium">{{ skill }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <h3 class="text-lg font-bold text-[#8b6914] mb-2">Outils & Déploiement</h3>
                    <div class="space-y-2">
                      <div v-for="skill in ['Git / GitHub', 'Blender (3D)', 'Figma', 'Vercel / Netlify']" :key="skill" class="flex items-center gap-2">
                        <span class="text-purple-700">✦</span>
                        <span class="font-medium">{{ skill }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- LIVRE : À PROPOS -->
              <template v-else>
                <h2 class="text-3xl font-bold mb-6 text-center border-b-2 border-[#d0c0a0] pb-4">📖 Mon Parcours</h2>
                <div class="space-y-6">
                  <div class="mb-4">
                    <h3 class="text-xl font-bold">2026 — Développeur Fullstack</h3>
                    <p class="opacity-80 italic">Création d'expériences 3D interactives avec Nuxt et TresJS, maîtrisant les ombres et les animations complexes.</p>
                  </div>
                  <div class="mb-4">
                    <h3 class="text-xl font-bold">Portfolio 3D Interactif</h3>
                    <p class="opacity-80 italic">Ce projet même — une scène de bureau immersive où chaque objet raconte une partie de mon histoire.</p>
                  </div>
                  <div class="mb-4">
                    <h3 class="text-xl font-bold">Passionné & Curieux</h3>
                    <p class="opacity-80 italic">Basé au Québec, je transforme les idées en expériences web mémorables. Fan de jeux de société, de cinéma et de code propre.</p>
                  </div>
                </div>
              </template>

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
        </Html>
      </TresGroup>
      <!-- CONTENU DES DOSSIERS (Projets) -->
      <TresGroup 
        v-if="activeElement === 'folder'" 
        :position="[settings.folder.htmlPosX, settings.folder.htmlPosY, settings.folder.htmlPosZ]" 
      >
        <Html key="html-folder" transform wrapper-class="folder-content" 
              :rotation-x="settings.folder.htmlRotX" 
              :rotation-y="settings.folder.htmlRotY" 
              :rotation-z="settings.folder.htmlRotZ" 
              :scale="settings.folder.scale">
          <Transition 
            enter-active-class="transition-opacity duration-1000" 
            enter-from-class="opacity-0" 
            leave-active-class="transition-opacity duration-300" 
            leave-to-class="opacity-0"
          >
            <div v-show="showFolderContent" :style="{ width: settings.folder.width + 'px', height: settings.folder.height + 'px' }"
                 class="relative bg-white border border-gray-200 shadow-md pointer-events-auto overflow-y-auto text-gray-800">
              
              <!-- EN-TÊTE PROJET -->
              <div class="sticky top-0 z-10 px-8 pt-6 pb-4 bg-white border-b border-gray-100">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-3xl">{{ currentProject.badge }}</span>
                  <div>
                    <h2 class="text-2xl font-bold" :style="{ color: currentProject.color }">{{ currentProject.title }}</h2>
                    <p class="text-sm text-gray-500 italic">{{ currentProject.tagline }}</p>
                  </div>
                </div>
              </div>

              <div class="px-8 py-6 space-y-6">
                <!-- DESCRIPTION -->
                <p class="text-gray-600 leading-relaxed">{{ currentProject.description }}</p>

                <!-- FEATURES -->
                <div class="space-y-3">
                  <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400">Fonctionnalités clés</h3>
                  <div v-for="feat in currentProject.features" :key="feat.title" 
                       class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span class="text-xl flex-shrink-0">{{ feat.icon }}</span>
                    <div>
                      <h4 class="font-bold text-gray-800 text-sm">{{ feat.title }}</h4>
                      <p class="text-gray-500 text-xs leading-relaxed">{{ feat.desc }}</p>
                    </div>
                  </div>
                </div>

                <!-- STACK -->
                <div>
                  <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Technologies</h3>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tech in currentProject.stack" :key="tech"
                          class="px-3 py-1 rounded-full text-xs font-semibold border"
                          :style="{ color: currentProject.color, borderColor: currentProject.color + '40', backgroundColor: currentProject.color + '10' }">
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
import { ref, watch, shallowReactive, onMounted, nextTick, computed } from 'vue'
import { OrbitControls, GLTFModel, Environment, Html } from '@tresjs/cientos'
import gsap from 'gsap'

import TheBooksTimeline from './TheBooksTimeline.vue'

const props = defineProps({
  selectedProject: { type: String, default: null },
  selectedBook: { type: String, default: null },
  showIntro: { type: Boolean, default: false }
})

// --- DONNÉES DES PROJETS ---
const projects = {
  monopoly: {
    title: 'Monopoly Madagascar',
    badge: '🎲',
    color: '#e74c3c',
    tagline: 'Réinvention numérique et immersive du célèbre jeu de société',
    description: 'Transportée au cœur de Madagascar. Investissez, négociez et bâtissez votre empire en Ariary dans cette expérience multijoueur haut de gamme.',
    features: [
      { icon: '🔄', title: 'Multijoueur Temps Réel', desc: 'Synchronisation fluide des joueurs via une architecture API robuste.' },
      { icon: '✨', title: 'Design Premium', desc: 'Interface responsive utilisant le Glassmorphism et des animations GSAP.' },
      { icon: '💰', title: 'Système Économique', desc: 'Gestion des transactions en Ariary, enchères, hypothèques et constructions.' },
      { icon: '🦎', title: 'Personnalisation', desc: 'Plus de 80 pions animaux endémiques de Madagascar.' },
    ],
    stack: ['Vue.js', 'Node.js', 'GSAP', 'Socket.io'],
  },
  cms: {
    title: 'CMS Propriétaire',
    badge: '📝',
    color: '#3498db',
    tagline: 'Panneau de contrôle robuste pour une autonomie totale',
    description: 'Un système de gestion de contenu développé avec Node.js, offrant un contrôle complet sur le contenu du site.',
    features: [
      { icon: '📄', title: 'Gestion de Contenu', desc: 'Édition en direct des sections du site avec mode aperçu.' },
      { icon: '📁', title: 'Bibliothèque de Médias', desc: 'Système de téléchargement drag-and-drop et gestion du stockage serveur.' },
      { icon: '📬', title: 'Messagerie Intégrée', desc: 'Centralisation des demandes clients via une boîte de réception connectée.' },
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'EJS'],
  },
  portfolio: {
    title: 'Portfolio & Site Vitrine',
    badge: '🌐',
    color: '#2ecc71',
    tagline: 'Site moderne optimisé pour l\'UX et le SEO',
    description: 'Un site bilingue bâti avec Vue.js, pensé pour une expérience utilisateur irréprochable.',
    features: [
      { icon: '🧭', title: 'Navigation Dynamique', desc: 'Barre de navigation et section Hero percutante.' },
      { icon: '🌍', title: 'Bilinguisme', desc: 'Français/Anglais avec détection automatique de la langue.' },
      { icon: '📱', title: 'Mobile First', desc: 'Design adaptatif pour tous les appareils.' },
    ],
    stack: ['Vue.js', 'Nuxt', 'i18n', 'TailwindCSS'],
  },
  movie: {
    title: 'Perfect-Movie',
    badge: '🎬',
    color: '#9b59b6',
    tagline: 'Ne perdez plus jamais un film de vue',
    description: 'Avez-vous déjà vu un extrait sur TikTok et oublié le nom du film ? Perfect-Movie est la solution. Créez votre liste, regardez la bande-annonce, et notez vos films.',
    features: [
      { icon: '🔍', title: 'Recherche', desc: 'Trouvez n\'importe quel film et ajoutez-le à votre liste.' },
      { icon: '🎥', title: 'Bandes-annonces', desc: 'Visionnez la bande-annonce directement dans l\'app.' },
      { icon: '⭐', title: 'Notes & Avis', desc: 'Marquez comme terminé, notez et commentez.' },
    ],
    stack: ['Vue.js', 'TMDb API', 'Firebase'],
  },
  soccer: {
    title: 'Club de Soccer',
    badge: '⚽',
    color: '#f39c12',
    tagline: 'Vitrine pour un club de soccer',
    description: 'Un site web pour faire découvrir le club, ses joueurs, ses résultats et sa philosophie.',
    features: [
      { icon: '👥', title: 'Présentation', desc: 'L\'équipe, le staff et la philosophie du club.' },
      { icon: '📅', title: 'Calendrier', desc: 'Matchs à venir et résultats passés.' },
      { icon: '📸', title: 'Galerie', desc: 'Photos et moments forts du club.' },
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
}

// --- DONNÉES DES LIVRES ---
const books = {
  stack: {
    title: 'Stack & Skills',
    icon: '⚡',
  },
  about: {
    title: 'À propos de moi',
    icon: '📖',
  },
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

const showPhoneContent = ref(false)
const showBookContent = ref(false)
const showFolderContent = ref(false)

// 🪄 Passe à 'true' pour faire apparaître les panneaux de configuration
const calibrationMode = ref(false) 
const showLightCalibration = ref(false)
const showCameraCalibration = ref(false)
const showMeshNames = ref(false)
const hoveredMeshName = ref('')

// --- 📷 CALIBRATION CAMÉRA ---
const defaultCamPos = ref({ x: 1.79, y: 2.26, z: 2.58 })
const defaultLookAt = ref({ x: 1.31, y: 1.62, z: 0.06 })

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
const lightState = ref({
  ambient: 0.6,      // Remplacez 0.7 par votre "Ambiance (Jour)"
  window: 2,       // Remplacez 2.5 par votre "Soleil (Intensité)"
  desk: 0,
  nightReflect: 0,
  envIntensity: 0    // Remplacez 1 par votre "Environnement GLOBAL"
})

const lightPos = ref({
  // Remplacez les valeurs de x, y, z et frustum ici :
  sun: { x: -2.44, y: 3.7, z: 2.1, frustum: 10 }, 
  
  // Remplacez les valeurs x, y, z de la cible ici :
  sunTarget: { x: 13.5, y: -2, z: 0 },
  
  godRay: { x: -2.3, y: 3.5, z: 1.7, rotX: 90, rotY: -30, rotZ: 90, opacity: 0.15 },
  desk: { x: 1.5, y: 2.5, z: 0.5 },
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
    lookX: 1.25, lookY: 1.73, lookZ: 0.55,
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
  folder: {
    camX: 1.84, camY: 2.03, camZ: 1.64, 
    lookX: 1, lookY: 1.68, lookZ: 0.45,
    htmlPosX: 1.5, htmlPosY: 1.882, htmlPosZ: 1.121,
    htmlRotX: 0, htmlRotY: 0.55, htmlRotZ: 0,
    scale: 0.014,
    width: 800,
    height: 1200
  }
})

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

// Helper pour vérifier si on clique sur un élément interactif
const isInteractive = (meshName) => {
  if (!meshName) return false
  const name = meshName.toLowerCase()
  
  const isLaptop = LAPTOP_PARTS.some(p => name.includes(p.toLowerCase()))
  const isPhone = name.startsWith(PHONE_PREFIX.toLowerCase())
  const isBook = BOOK_PARTS.some(p => name.includes(p.toLowerCase())) || name.includes('book')
  const isSwitch = LIGHT_SWITCH.some(p => name.includes(p.toLowerCase())) || name.includes('light_switch')
  const isDrawer = name.includes('drawer')
  const isFolder = name.includes('folder')

  return isLaptop || isPhone || isBook || isSwitch || isDrawer || isFolder
}

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
const onModelClick = (event) => {
  if (animating.value || activeElement.value) return

  const meshName = getHitMeshName(event)
  if (!meshName) return
  const name = meshName.toLowerCase()
  
  const isLaptop = LAPTOP_PARTS.some(p => name.includes(p.toLowerCase()))
  const isPhone = name.startsWith(PHONE_PREFIX.toLowerCase())
  const isBook = BOOK_PARTS.some(p => name.includes(p.toLowerCase())) || name.includes('book')
  const isSwitch = LIGHT_SWITCH.some(p => name.includes(p.toLowerCase())) || name.includes('light_switch')
  const isDrawer = name.includes('drawer')
  const isFolder = name.includes('folder')

  if (isLaptop) {
    zoomTo('laptop')
  } else if (isPhone) {
    zoomTo('phone')
  } else if (isDrawer) {
    let topDrawer = event.object
    if (topDrawer.parent && topDrawer.parent.name.toLowerCase().includes('drawer')) {
      topDrawer = topDrawer.parent
    }
    toggleDrawer(topDrawer)
  } else if (isFolder) {
    let base = event.object
    // Remonter jusqu'à la base du dossier (tant que le parent s'appelle aussi folder)
    while (base.parent && base.parent.name.toLowerCase().includes('folder')) {
      base = base.parent
    }

    if (base) {
      activeFolderBase = base
      if (!activeFolderBase.userData.originalPos) {
        activeFolderBase.userData.originalPos = activeFolderBase.position.clone()
        activeFolderBase.userData.originalRot = activeFolderBase.rotation.clone()
      }
    }
    
    let cover = base.children ? base.children.find(c => c.name.toLowerCase().includes('cover')) : null
    if (!cover && name.includes('cover')) {
       cover = event.object
    }

    if (cover) {
      activeFolderCover = cover
      if (!activeFolderCover.userData.originalRot) {
        activeFolderCover.userData.originalRot = activeFolderCover.rotation.clone()
      }
    }
    zoomTo('folder')
  } else if (isBook) {
    let base = event.object
    
    // Remonter jusqu'à la base du livre (groupe parent)
    while (base.parent && base.parent.type === 'Group' && base.parent.name !== 'Scene') {
      base = base.parent
    }

    if (base) {
      activeBookBase = base
      if (!activeBookBase.userData.originalPos) {
        activeBookBase.userData.originalPos = activeBookBase.position.clone()
        activeBookBase.userData.originalRot = activeBookBase.rotation.clone()
      }
    }
    
    // Trouver le cover parmi les enfants. Si l'objet contient "cover" dans son nom
    let cover = base.children ? base.children.find(c => c.name.toLowerCase().includes('cover')) : null
    
    // Fallback direct si on a cliqué sur la couv' mais sans hiérarchie enfant
    if (!cover && name.includes('cover')) {
       cover = event.object
    }

    if (cover) {
      activeBookCover = cover
      if (!activeBookCover.userData.originalRot) {
        activeBookCover.userData.originalRot = activeBookCover.rotation.clone()
      }
    }
    zoomTo('books')
  } else if (isSwitch) {
    toggleLight()
  }
}

// Mouvement sur le modèle — détecte le mesh survolé en continu
const onPointerMove = (event) => {
  const meshName = getHitMeshName(event)
  hoveredMeshName.value = meshName || ''
  
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
  hoveredMeshName.value = ''
  isHovered.value = false
  document.body.style.cursor = 'auto'
}

const zoomTo = (target) => {
  if (animating.value) return
  animating.value = true
  activeElement.value = target
  showPhoneContent.value = false
  showBookContent.value = false
  showFolderContent.value = false

  const setting = settings.value[target]
  if (!setting) return

  isHovered.value = false
  document.body.style.cursor = 'auto'

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  const lookAtProxy = { x: controls?.target?.x ?? 0, y: controls?.target?.y ?? 0, z: controls?.target?.z ?? 0 }

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
  animating.value = true
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
  const lookAtProxy = { 
    x: controls?.target?.x ?? 0, 
    y: controls?.target?.y ?? 0, 
    z: controls?.target?.z ?? 0 
  }

  gsap.to(cameraRef.value.position, {
    x: defaultCamPos.value.x, y: defaultCamPos.value.y, z: defaultCamPos.value.z,
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

// 🎮 Expose les actions pour le menu externe
defineExpose({
  zoomTo,
  resetZoom,
  toggleLight,
  activeElement,
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
</style>