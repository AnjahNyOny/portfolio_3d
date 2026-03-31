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
        class="absolute top-10 left-10 z-[100] bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all pointer-events-auto"
      >
        ← Retour au bureau
      </button>
    </Transition>

    <TresCanvas clear-color="#09090b" shadow window-size>
      <TresPerspectiveCamera 
        ref="cameraRef" 
        :position="[3, 2, 3]" 
        :look-at="[0, 1, 0]" 
      />
      
      <OrbitControls 
        ref="controlsRef" 
        :enabled="!isZoomed"
        :enable-pan="false"
        :min-distance="1" 
        :max-distance="8" 
        :max-polar-angle="Math.PI / 2 - 0.05"
      />

      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[5, 8, 4]" :intensity="2" cast-shadow />
      
      <Suspense>
        <Environment preset="city" />
      </Suspense>

      <Suspense>
        <GLTFModel 
          path="/models/room_v3.glb" 
          draco 
          @click="zoomToLaptop"
          @pointer-enter="isHovered = true"
          @pointer-leave="isHovered = false"
        />
      </Suspense>

      <TresGroup 
        v-if="isZoomed" 
        :position="[1.54, 1.65, 0.24]" 
        :rotation-y="0.03"
      >
        <Html
          transform
          wrapper-class="ecran-virtuel"
          :rotation-x="-0.33"
          :rotation-z="0.00"
          :scale="0.0114"
        >
          <iframe 
            src="http://anjahnyony.com" 
            class="w-[1024px] h-[830px] border-none bg-white rounded-md pointer-events-auto"
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
const isHovered = ref(false)

const zoomToLaptop = () => {
  if (isZoomed.value || !cameraRef.value) return

  // Coordonnées finales de la caméra et de sa cible
  const cameraTargetPos = { x: 1.54, y: 1.81, z: 0.90 } 
  const lookAtPos = { x: 1.54, y: 1.65, z: 0.24 } 

  isHovered.value = false

  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  const lookAtProxy = { x: controls?.target?.x ?? 0, y: controls?.target?.y ?? 0, z: controls?.target?.z ?? 0 }

  gsap.to(cameraRef.value.position, {
    x: cameraTargetPos.x, y: cameraTargetPos.y, z: cameraTargetPos.z,
    duration: 1.5, ease: "power2.inOut",
    onUpdate: () => {
      if (controls?.target) {
        controls.target.set(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
        controls.update()
      } else {
        cameraRef.value.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z)
      }
    },
    onComplete: () => {
      if (controls) controls.enabled = false
      isZoomed.value = true
    }
  })

  gsap.to(lookAtProxy, {
    x: lookAtPos.x, y: lookAtPos.y, z: lookAtPos.z,
    duration: 1.5, ease: "power2.inOut"
  })
}

const resetZoom = () => {
  const rawRef = controlsRef.value
  const controls = rawRef?.value ?? rawRef?.instance ?? rawRef

  if (controls) controls.enabled = true

  const resetTarget = { x: 0, y: 1, z: 0 }
  const lookAtProxy = { 
    x: controls?.target?.x ?? 0, 
    y: controls?.target?.y ?? 0, 
    z: controls?.target?.z ?? 0 
  }

  gsap.to(cameraRef.value.position, {
    x: 3, y: 2, z: 3,
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