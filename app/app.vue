<script setup lang="ts">
import { useMenuStore } from '~/store/menu'

const menuStore = useMenuStore()

onMounted(() => {
  menuStore.init()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="var(--color-brand)" :height="2" />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style lang="scss" scoped>
:global(body) {
  color: $text-color;
  font-family: $font-family-base;
  background-color: $background-color;
}
</style>
