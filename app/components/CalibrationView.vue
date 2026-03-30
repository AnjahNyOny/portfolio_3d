<!-- <template>
  <div 
    class="relative h-screen w-full bg-zinc-950 overflow-hidden"
    :class="{ 'cursor-pointer': isHovered }"
  >
    
    <Transition name="fade">
      <button 
        v-if="isZoomed"
        @click.stop="resetZoom"
        class="absolute top-10 left-10 z-[100] bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
      >
        ← Retour au bureau
      </button>
    </Transition>

    <div 
      v-if="isZoomed" 
      @pointer-down.stop
      class="absolute top-10 right-10 z-[100] bg-black/80 text-white p-4 rounded-lg flex flex-col gap-2 w-72 text-sm font-mono backdrop-blur-md border border-white/20 shadow-2xl"
    >
      <p class="font-bold text-center mb-2 border-b border-white/20 pb-2">CALIBRAGE ÉCRAN</p>
      
      <label class="flex flex-col">Pos X : {{ posX.toFixed(2) }}
        <input type="range" v-model.number="posX" min="-5" max="5" step="0.01">
      </label>
      <label class="flex flex-col">Pos Y : {{ posY.toFixed(2) }}
        <input type="range" v-model.number="posY" min="0" max="5" step="0.01">
      </label>
      <label class="flex flex-col">Pos Z : {{ posZ.toFixed(2) }}
        <input type="range" v-model.number="posZ" min="-5" max="5" step="0.01">
      </label>
      
      <div class="h-px bg-white/20 my-2"></div>
      
      <label class="flex flex-col">Rot X (Inclinaison) : {{ rotX.toFixed(2) }}
        <input type="range" v-model.number="rotX" min="-3.14" max="3.14" step="0.01">
      </label>
      <label class="flex flex-col">Rot Y (Orientation) : {{ rotY.toFixed(2) }}
        <input type="range" v-model.number="rotY" min="-3.14" max="3.14" step="0.01">
      </label>
      <label class="flex flex-col">Rot Z (Roulis) : {{ rotZ.toFixed(2) }}
        <input type="range" v-model.number="rotZ" min="-3.14" max="3.14" step="0.01">
      </label>

      <div class="h-px bg-white/20 my-2"></div>

      <label class="flex flex-col">Scale (Taille) : {{ scaleVal.toFixed(3) }}
        <input type="range" v-model.number="scaleVal" min="0.01" max="0.5" step="0.001">
      </label>
    </div>

    <TresCanvas clear-color="#09090b" shadow window-size>
      <TresPerspectiveCamera 
        ref="cameraRef" 
        :position="[7, 7, 7]" 
        :look-at="[0, 1, 0]" 
      />
      
      <OrbitControls ref="controlsRef" />

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
        :position="[posX, posY, posZ]" 
        :rotation-y="rotY"
      >
        <Html
          transform
          wrapper-class="ecran-virtuel"
          :rotation-x="rotX"
          :rotation-z="rotZ"
          :scale="scaleVal"
        >
          <iframe 
            src="http://localhost:3000" 
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

// Variables de calibrage initialisées
const posX = ref(0)
const posY = ref(3.2)
const posZ = ref(0)
const rotX = ref(-0.2)
const rotY = ref(-1.57) 
const rotZ = ref(0)
const scaleVal = ref(0.08)

const zoomToLaptop = () => {
  if (isZoomed.value || !cameraRef.value) return

  const cameraTargetPos = { x: 3.09, y: 3.95, z: -0.73 } 
  const lookAtPos = { x: 0, y: 3.2, z: 0 } 

  gsap.to(cameraRef.value.position, {
    x: cameraTargetPos.x, y: cameraTargetPos.y, z: cameraTargetPos.z,
    duration: 1.5, ease: "power2.inOut"
  })

  const controls = controlsRef.value?.value || controlsRef.value
  if (controls && controls.target) {
    gsap.to(controls.target, {
      x: lookAtPos.x, y: lookAtPos.y, z: lookAtPos.z,
      duration: 1.5, ease: "power2.inOut"
    })
  }

  isZoomed.value = true
  isHovered.value = false
}

const resetZoom = () => {
  gsap.to(cameraRef.value.position, {
    x: 7, y: 7, z: 7,
    duration: 1.5, ease: "power2.inOut"
  })

  const controls = controlsRef.value?.value || controlsRef.value
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
</style> -->