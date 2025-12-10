<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      if (to.path === '/xxyd' || to.path === '/xxyd/') {
        return navigateTo('/xxyd/hydt')
      }
    },
  ],
})
</script>

<template>
  <div>Redirecting...</div>
</template>
