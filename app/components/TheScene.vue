<template>
  <div class="relative h-screen w-full bg-zinc-950 overflow-hidden">
    
    <Transition name="fade">
      <div v-if="isZoomed" class="absolute top-10 right-10 z-[100] flex flex-col gap-4 pointer-events-auto">
        <div class="bg-black/90 p-4 rounded-lg text-white border border-white/20 text-sm">
          <p class="font-bold text-yellow-400 mb-2">🛠 CALIBRAGE CAMÉRA</p>
          <p>1. Place la caméra parfaitement avec la souris.</p>
          <p>2. Clique sur le bouton bleu.</p>
          <p>3. Ouvre la console (F12).</p>
        </div>
        
        <button 
          @click.stop="logCameraPos"
          class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
        >
          📸 NOTER LA CAMÉRA (F12)
        </button>
        
        <button 
          @click.stop="resetZoom"
          class="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
        >
          ← Retour au bureau
        </button>
      </div>
    </Transition>

    <TresCanvas clear-color="#09090b" shadow window-size>
      <TresPerspectiveCamera 
        ref="cameraRef" 
        :position="[2, 1.5, 2]" 
        :look-at="[0, 1, 0]" 
      />
      
      <OrbitControls ref="controlsRef" />

      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[5, 8, 4]" :intensity="2" cast-shadow />
      
      <Suspense>
        <Environment preset="city" background />
      </Suspense>

      <Suspense>
        <GLTFModel 
          path="/models/room_v1.glb" 
          draco 
          @click="zoomToLaptop"
        />
      </Suspense>

      <TresGroup 
        v-if="isZoomed" 
        :position="[0.29, 0.80, -0.68]" 
        :rotation-y="0.00"
      >
        <Html
          transform
          wrapper-class="ecran-virtuel"
          :rotation-x="-0.34"
          :rotation-z="0.00"
          :scale="0.012"
        >
          <iframe 
            src="http://anjahnyony.com" 
            class="w-[1024px] h-[640px] border-none bg-white rounded-md pointer-events-auto"
            style="backface-visibility: hidden;"
          ></iframe>
        </Html>
      </TresGroup>

    </TresCanvas>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OrbitControls, GLTFModel, Environment, Html } from '@tresjs/cientos'
import gsap from 'gsap'

const cameraRef = ref(null)
const controlsRef = ref(null)
const isZoomed = ref(false)

// La fonction sécurisée pour noter la caméra sans planter
const logCameraPos = () => {
  if (!cameraRef.value) return
  
  const camPos = cameraRef.value.position
  
  // Sécurisation de la cible (target) selon la version de TresJS
  let targetPos = { x: 0, y: 0, z: 0 }
  if (controlsRef.value) {
    if (controlsRef.value.target) targetPos = controlsRef.value.target
    else if (controlsRef.value.value?.target) targetPos = controlsRef.value.value.target
    else if (controlsRef.value.instance?.target) targetPos = controlsRef.value.instance.target
  }

  console.log("====================================")
  console.log("📍 cameraTargetPos (Remplace la ligne 107) :")
  console.log(`{ x: ${camPos.x.toFixed(2)}, y: ${camPos.y.toFixed(2)}, z: ${camPos.z.toFixed(2)} }`)
  console.log("------------------------------------")
  console.log("🎯 lookAtPos (Remplace la ligne 108) :")
  console.log(`{ x: ${targetPos.x.toFixed(2)}, y: ${targetPos.y.toFixed(2)}, z: ${targetPos.z.toFixed(2)} }`)
  console.log("====================================")
  
  alert("Les coordonnées sont dans ta console (F12) ! Copie-les et donne-les-moi.")
}

//  📍 cameraTargetPos (Remplace la ligne 107) :
// TheScene.vue:35 { x: 0.00, y: 1.21, z: 0.39 }
// TheScene.vue:36 ------------------------------------
// TheScene.vue:37 🎯 lookAtPos (Remplace la ligne 108) :
// TheScene.vue:38 { x: 0.02, y: 0.66, z: -0.48 }


const zoomToLaptop = () => {
  if (isZoomed.value || !cameraRef.value) return

  // Valeurs temporaires (vont sûrement plonger dans le sol pour le moment)
  const cameraTargetPos = { x: 0.0, y: 1.21, z: 0.39 } 
  const lookAtPos = { x: 0.02, y: 0.66, z: -0.48 } 

  // Trouver le vrai objet OrbitControls (la structure de la ref varie selon la version)
  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  // Debug: voir ce qu'on a réellement
  console.log('🔍 controlsRef.value:', rawRef)
  console.log('🔍 controls résolu:', controls)
  console.log('🔍 controls.target:', controls?.target)

  // Animer le lookAt avec un objet proxy si on ne trouve pas le target
  const lookAtProxy = { x: controls?.target?.x ?? 0, y: controls?.target?.y ?? 0, z: controls?.target?.z ?? 0 }

  // L'animation principale de la caméra
  gsap.to(cameraRef.value.position, {
    x: cameraTargetPos.x, y: cameraTargetPos.y, z: cameraTargetPos.z,
    duration: 1.5, ease: "power2.inOut",
    onUpdate: () => {
      // Forcer la caméra à regarder la cible à chaque frame
      if (controls?.target) {
        controls.target.set(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
        controls.update()
      } else {
        cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
      }
    },
    onComplete: () => {
      // Désactiver les contrôles et afficher le bouton
      if (controls) controls.enabled = false
      isZoomed.value = true
    }
  })

  // Animer le proxy du lookAt en parallèle
  gsap.to(lookAtProxy, {
    x: lookAtPos.x, y: lookAtPos.y, z: lookAtPos.z,
    duration: 1.5, ease: "power2.inOut"
  })
}

const resetZoom = () => {
  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  // Réactiver les contrôles
  if (controls) controls.enabled = true

  const resetTarget = { x: 0, y: 1, z: 0 }
  const lookAtProxy = { 
    x: controls?.target?.x ?? 0, 
    y: controls?.target?.y ?? 0, 
    z: controls?.target?.z ?? 0 
  }

  gsap.to(cameraRef.value.position, {
    x: 2, y: 1.5, z: 2,
    duration: 1.5, ease: "power2.inOut",
    onUpdate: () => {
      if (controls?.target) {
        controls.target.set(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
        controls.update()
      } else {
        cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
      }
    }
  })

  gsap.to(lookAtProxy, {
    x: resetTarget.x, y: resetTarget.y, z: resetTarget.z,
    duration: 1.5, ease: "power2.inOut"
  })

  isZoomed.value = false
}
</script>