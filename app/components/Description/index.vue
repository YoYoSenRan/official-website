<script setup lang="ts">
import { withDefaults } from 'vue'

/**
 * 描述组件的属性接口
 */
interface Props {
  text?: string
  image?: string
}

/**
 * 定义组件属性及默认值
 */
withDefaults(defineProps<Props>(), {
  text: '四川华电泸定水电有限公司',
  image: undefined,
})
</script>

<template>
  <div class="description" :style="{ backgroundImage: image ? `url(${image})` : 'none' }">
    <h1 class="description-text">
      {{ text }}
    </h1>
  </div>
</template>

<style scoped lang="scss">
/**
 * 描述组件样式 - 带背景图的标题展示区域
 */
.description {
  width: 100%;
  height: 250px;
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  background-size: 100% 100%;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;

  /* 遮罩层 */
  &::before {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    z-index: 1;
    position: absolute;
    // background-color: rgba(0, 0, 0, 0.3);
  }

  /* 标题文字 */
  &-text {
    top: 80px;
    left: 160px;
    color: white;
    margin: 0;
    z-index: 2;
    position: absolute;
    font-size: 32px;
    font-weight: bold;
    line-height: 1.4;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    height: 200px;

    &-text {
      font-size: 24px;
    }
  }
}
</style>
