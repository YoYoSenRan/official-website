<script setup lang="ts"></script>

<template>
  <div class="layouts-container">
    <Header />
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layouts-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
</style>
