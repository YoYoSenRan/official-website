<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce } from '~/utils/utils'

import Banner from './components/Banner.vue'
import FloatingAiButton from './components/FloatingAiButton.vue'
import Generate from './components/Generate.vue'
import News from './components/News.vue'
import Staff from './components/Staff.vue'
import Topic from './components/Topic.vue'

const scrollRef = ref<HTMLElement | null>(null)

// Footer 实例引用
const footerRef = ref<any>(null)

const isFooter = ref(false)
const footerHeight = ref(0)

/**
 * 计算页面偏移量
 * 根据 isFooter 状态和 Footer 高度计算需要上移的距离
 */
const translateOffset = computed(() => {
  return isFooter.value ? `-${footerHeight.value}px` : '0'
})

function isAtBottom() {
  const el = scrollRef.value
  if (!el)
    return false
  return Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
}

function handleWheel(event: WheelEvent) {
  debounce(() => {
    const down = event.deltaY > 0
    if (down && isAtBottom()) {
      isFooter.value = true
    }
    else if (!down && isFooter.value) {
      isFooter.value = false
    }
  }, 100)
}

/**
 * 获取 Footer 高度
 */
function getFooterHeight() {
  if (footerRef.value?.$el) {
    footerHeight.value = footerRef.value.$el.offsetHeight
  }
}

/**
 * 挂载时绑定滚轮事件并获取 Footer 高度
 */
onMounted(() => {
  if (scrollRef.value) {
    scrollRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
  setTimeout(() => {
    getFooterHeight()
  }, 100)
})

/**
 * 卸载时移除滚轮事件
 */
onUnmounted(() => {
  if (scrollRef.value) {
    scrollRef.value.removeEventListener('wheel', handleWheel)
  }
})

/**
 * 监听窗口大小变化，重新计算 Footer 高度
 */
watch(
  () => window.innerHeight,
  () => {
    getFooterHeight()
  },
)
</script>

<template>
  <div class="index-container" :style="{ transform: `translateY(${translateOffset})` }">
    <div ref="scrollRef" class="snap-container">
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
        <Footer ref="footerRef" />
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
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);

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
