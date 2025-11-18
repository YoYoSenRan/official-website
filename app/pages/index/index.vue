<script setup lang="ts">
import Banner from './components/Banner.vue'
import FloatingAiButton from './components/FloatingAiButton.vue'
import Generate from './components/Generate.vue'
import News from './components/News.vue'
import Staff from './components/Staff.vue'
import Topic from './components/Topic.vue'
</script>

<template>
  <div class="index-container">
    <div class="snap-container">
      <section class="snap-section">
        <Banner />
      </section>
      <section class="snap-section">
        <News />
      </section>
      <section class="snap-section">
        <Generate />
      </section>
      <section class="snap-section">
        <Topic />
      </section>
      <section class="snap-section">
        <Staff />
      </section>
      <section class="snap-section">
        <Footer />
      </section>
    </div>
    <FloatingAiButton />
  </div>
</template>

<style scoped lang="scss">
// 主容器块
.index-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;

  .snap-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .snap-section {
    display: flex;
    justify-content: center;
  }
}
</style>
