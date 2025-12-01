<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      if (to.path === '/ggtz' || to.path === '/ggtz/') {
        return navigateTo('/ggtz/cwgk')
      }
    },
  ],
})
</script>

<template>
  <div>Redirecting...</div>
</template>
