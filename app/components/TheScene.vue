<template>
  <TresCanvas clear-color="#09090b" window-size>
    <TresPerspectiveCamera :position="[5, 5, 5]" :look-at="[0, 1, 0]" />
    <OrbitControls />
    <TresAmbientLight :intensity="0.5" />
    <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" />

    <Suspense>
      <GLTFModel path="/models/duck.glb" />
    </Suspense>
  </TresCanvas>
</template>

<script setup>
import { OrbitControls, GLTFModel } from '@tresjs/cientos'
</script>