<template>
  <div 
    class="relative h-screen w-full bg-zinc-950 overflow-hidden"
    :class="{ 
      'pointer-events-none': isZoomed,
      'cursor-pointer': isHovered && !isZoomed 
    }"
  >
    
    <Transition name="fade">
      <button 
        v-if="isZoomed"
        @click.stop="resetZoom"
        class="absolute top-10 right-10 z-[100] bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all pointer-events-auto"
      >
        ← Retour au bureau
      </button>
    </Transition>

    <TresCanvas clear-color="#09090b" shadow window-size>
      <TresPerspectiveCamera 
        ref="cameraRef" 
        :position="[7, 7, 7]" 
        :look-at="[0, 1, 0]" 
      />
      
      <OrbitControls ref="controlsRef" :enabled="!isZoomed" />

      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[5, 8, 4]" :intensity="2" cast-shadow />
      
      <Suspense>
        <Environment preset="city" />
      </Suspense>

      <Suspense>
        <GLTFModel 
          path="/models/bureau_v1.glb" 
          draco 
          @click="zoomToLaptop"
          @pointer-enter="isHovered = true"
          @pointer-leave="isHovered = false"
        />
      </Suspense>

      <TresGroup 
        v-if="isZoomed" 
        :position="[1.16, 2.38, -0.50]" 
        :rotation-y="1.58"
      >
        <Html
          transform
          wrapper-class="ecran-virtuel"
          :rotation-x="-0.35"
          :rotation-z="0.00"
          :scale="0.042"
        >
          <iframe 
            src="http://anjahnyony.com" 
            class="w-[1024px] h-[640px] border-none bg-white rounded-md pointer-events-auto"
          ></iframe>
        </Html>
      </TresGroup>

      <ContactShadows :opacity="0.3" :blur="3" :far="10" />
    </TresCanvas>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { OrbitControls, GLTFModel, Environment, ContactShadows, Html } from '@tresjs/cientos'
import gsap from 'gsap'

const cameraRef = ref(null)
const controlsRef = ref(null)

const isZoomed = ref(false)
const isHovered = ref(false)

const zoomToLaptop = () => {
  if (isZoomed.value || !cameraRef.value) return

  const cameraTargetPos = { x: 3.09, y: 3.95, z: -0.73 } 
  const lookAtPos = { x: 0, y: 3.2, z: 0 } 

  const controls = controlsRef.value?.value || controlsRef.value

  isHovered.value = false

  gsap.to(cameraRef.value.position, {
    x: cameraTargetPos.x, y: cameraTargetPos.y, z: cameraTargetPos.z,
    duration: 1.5, ease: "power2.inOut",
    onComplete: () => {
      // Désactiver les contrôles et verrouiller seulement APRÈS l'animation
      if (controls) controls.enabled = false
      isZoomed.value = true
    }
  })

  if (controls && controls.target) {
    gsap.to(controls.target, {
      x: lookAtPos.x, y: lookAtPos.y, z: lookAtPos.z,
      duration: 1.5, ease: "power2.inOut"
    })
  }
}

const resetZoom = () => {
  const controls = controlsRef.value?.value || controlsRef.value

  // Réactiver les contrôles avant l'animation de retour
  if (controls) controls.enabled = true

  gsap.to(cameraRef.value.position, {
    x: 7, y: 7, z: 7,
    duration: 1.5, ease: "power2.inOut"
  })

  if (controls && controls.target) {
    gsap.to(controls.target, {
      x: 0, y: 1, z: 0,
      duration: 1.5, ease: "power2.inOut"
    })
  }

  isZoomed.value = false
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