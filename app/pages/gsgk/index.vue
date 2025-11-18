<script setup lang="ts">
import { useAnchorNavigation } from '~/composables/useAnchorNavigation'
import Tabs from './components/tabs.vue'
import hdbg from '~/assets/images/hd-bg.png'
import History from './components/history.vue'
import Overview from './components/overview.vue'
import Structure from './components/structure.vue'
import Leadership from './components/leadership.vue'

definePageMeta({
  layout: 'others',
})

/**
 * 锚点列表配置
 * 每个锚点对应一个区块，title用于显示在tab中，id用于标识和滚动
 */
const anchors = [
  { id: 'gsjj', title: '公司简介' },
  { id: 'ldbz', title: '领导班子' },
  { id: 'zzjg', title: '组织机构' },
  { id: 'fzlc', title: '发展历程' },
]

// 使用锚点导航composable
// 返回值：
// - activeAnchor: 当前激活的锚点id (响应式)
// - scrollToAnchor: 滚动到指定锚点的函数（传入anchorId）
const { activeAnchor, scrollToAnchor } = useAnchorNavigation()
</script>

<template>
  <div class="gsgk-page">
    <Description text="四川华电泸定水电有限公司" :image="hdbg" />

    <Tabs :anchors="anchors" :active-anchor="activeAnchor" @change="scrollToAnchor" />

    <!-- 主容器 -->
    <div class="page-content">
      <Overview />
      <Leadership />
      <Structure />
      <History />
    </div>
  </div>
</template>

<style scoped lang="scss">
.gsgk-page {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 页面主容器 */
.page-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
