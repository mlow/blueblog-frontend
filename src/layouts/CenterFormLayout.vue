<template>
  <div class="paper container">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-control {
  margin: 1.5rem;
}
</style>
