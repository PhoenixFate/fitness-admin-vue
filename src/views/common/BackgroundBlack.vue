<template>
  <div class="background-black"></div>
</template>

<script>
export default {
  name: 'BackgroundBlack'
}
</script>

<style scoped lang="scss">
.background-black {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.26);
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 2000;
}
</style>
