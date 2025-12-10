<script setup lang="ts">
/**
 * 锚点数据接口
 * @property id - 锚点的唯一标识符
 * @property title - 锚点显示的标题
 */
interface Anchor {
  id: string
  title: string
}

/**
 * 组件props
 * @property anchors - 所有锚点的配置列表
 * @property activeAnchor - 当前激活的锚点id
 */
interface Props {
  anchors: Anchor[]
  activeAnchor: string
}

/**
 * 组件emits
 * @event change - 当用户点击tab时触发，传递被点击的锚点id
 */
interface Emits {
  change: [anchorId: string]
}

// 定义props和emits
defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * 处理tab点击事件
 * 触发change事件，将选中的锚点id传递给父组件
 * @param anchorId - 被点击的锚点id
 */
function handleTabClick(anchorId: string) {
  // 触发change事件，父组件接收并执行scrollToAnchor
  emit('change', anchorId)
}
</script>

<template>
  <nav class="anchor-nav">
    <div class="anchor-nav-container">
      <!-- 循环渲染每个锚点tab项 -->
      <button v-for="anchor in anchors" :key="anchor.id" class="anchor-tab" :class="{ active: activeAnchor === anchor.id }" @click="handleTabClick(anchor.id)">
        {{ anchor.title }}
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
/* 锚点导航栏样式 */
.anchor-nav {
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 5 5;
  margin-bottom: 40px;
  z-index: 10;
  position: sticky;
  // border-top: 1px solid #f0f0f0;
  // border-bottom: 1px solid #f0f0f0;
  background-color: white;
 
  .anchor-nav-container {
    gap: 60px;
    height: 20px;
    display: flex;
    align-items: center;
  }

  /* 锚点tab项样式 */
  .anchor-tab {
    color: #333333;
    border:none;
    cursor: pointer;
    height: 60px;
    display: inline-block;
    padding: 0;
    position: relative;
    font-size: 24px;
    font-weight: bold;
    background: none;
    transition: all 0.3s ease;
    white-space: nowrap;
    margin-right:-30px;
    &:hover {
      color: #0066ff;
    }

    /* 激活状态样式 */
    &.active {
      color: #0066ff;
      font-weight: 600;

      &::after {
        left: 0;
        width: 100%;
        bottom: 0;
        height: 3px;
        content: '';
        position: absolute;
        background: linear-gradient(90deg, #0066ff, #00a8ff);
        border-radius: 2px 2px 0 0;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .anchor-nav {
    .anchor-nav-container {
      gap: 0;
      height: 50px;
      overflow-x: auto;
      scroll-behavior: smooth;

      /* 隐藏滚动条 */
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .anchor-tab {
      height: 50px;
      padding: 0 16px;
      font-size: 14px;
    }
  }
}
</style>
