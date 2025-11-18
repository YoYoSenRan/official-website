<script setup lang="ts">
/**
 * 新闻项目数据接口
 */
interface NewsItem {
  id?: string
  date: string
  day?: number
  title: string
  description: string
}

/**
 * Props 定义
 */
interface Props {
  /** 新闻列表数据 */
  list?: NewsItem[]
  /** 每行显示的列数，默认为 1 */
  col?: number
}

/**
 * Emits 定义
 */
interface Emits {
  /** 新闻项点击事件 */
  (e: 'click', item: NewsItem): void
}

// ==================== Props 与 Emits ====================

/** Props 定义 */
withDefaults(defineProps<Props>(), {
  list: () => [],
  col: 1,
})

/** Emits 定义 */
const emit = defineEmits<Emits>()

// ==================== 方法 ====================

/**
 * 处理新闻项点击事件
 * @param item - 被点击的新闻项
 */
function handleClick(item: NewsItem) {
  emit('click', item)
}
</script>

<template>
  <div class="news-list" :style="{ '--col': col } as any">
    <div v-for="item in list" :key="item.id" class="news-item" @click="handleClick(item)">
      <!-- 日期区域 -->
      <div class="news-item__date">
        <span class="news-item__year-month">{{ item.date }}</span>
        <span v-if="item.day" class="news-item__day">{{ item.day }}</span>
      </div>

      <!-- 内容区域 -->
      <div class="news-item__content">
        <h3 class="news-item__title">
          {{ item.title }}
        </h3>
        <p class="news-item__description">
          {{ item.description }}
        </p>
      </div>

      <!-- 箭头图标 -->
      <span class="news-item__arrow">→</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 新闻列表容器 */
.news-list {
  width: 100%;
  display: grid;
  overflow: hidden;
  column-gap: 15px;
  grid-template-columns: repeat(var(--col, 1), 1fr);

  /* 单列布局 */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

/* 新闻项容器 */
.news-item {
  gap: 1rem;
  cursor: pointer;
  display: flex;
  padding: 30px 0;
  overflow: hidden;
  transition: all 300ms ease-in-out;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0;
  background-color: transparent;

  /* 悬停效果 */
  &:hover {
    transform: none;
    box-shadow: none;

    .news-item__title {
      color: #108cf0;
    }

    .news-item__arrow {
      color: #108cf0;
      transform: translateX(4px);
    }
  }

  /* 日期区域 */
  &__date {
    gap: 0.25rem;
    width: 80px;
    border: 1px solid #e5e7eb;
    height: 80px;
    display: flex;
    padding: 0;
    text-align: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 0.25rem;
    flex-direction: column;
    justify-content: center;
    background-color: transparent;
  }

  /* 年月 */
  &__year-month {
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: normal;
  }

  /* 日期数字 */
  &__day {
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* 内容区域 */
  &__content {
    gap: 0.5rem;
    flex: 1;
    display: flex;
    min-width: 0;
    flex-direction: column;
  }

  /* 标题 */
  &__title {
    color: #1f2937;
    margin: 0;
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.875rem;
    line-clamp: 1;
    transition: color 300ms ease-in-out;
    word-break: break-word;
    font-weight: 600;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  /* 描述文本 */
  &__description {
    color: #9ca3af;
    margin: 0;
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.75rem;
    line-clamp: 2;
    line-height: 1.4;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  /* 箭头图标 */
  &__arrow {
    color: transparent;
    font-size: 1.125rem;
    transition: all 300ms ease-in-out;
    flex-shrink: 0;
  }
}
</style>
