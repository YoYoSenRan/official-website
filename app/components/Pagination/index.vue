<script setup lang="ts">
/**
 * 分页组件Props接口
 * @property modelValue - 当前页码（从1开始）
 * @property totalPages - 总页数
 * @property total - 数据总条数（可选，用于显示统计信息）
 * @property pageSize - 每页显示条数（默认10）
 * @property showJump - 是否显示快速跳转功能（默认false）
 * @property showPageSize - 是否显示每页条数选择器（默认false）
 * @property showStats - 是否显示统计信息（默认false）
 * @property pageSizeOptions - 每页条数选项（默认[10, 20, 50, 100]）
 */
interface Props {
  modelValue: number
  totalPages: number
  total?: number
  pageSize?: number
  showJump?: boolean
  showPageSize?: boolean
  showStats?: boolean
  pageSizeOptions?: number[]
}

/**
 * 组件Emits接口
 * @event update:modelValue - 当前页码改变时触发
 * @event update:pageSize - 每页条数改变时触发
 * @event change - 页码改变时触发，携带页码和页码大小信息
 */
interface Emits {
  'update:modelValue': [value: number]
  'update:pageSize': [value: number]
  'change': [value: { page: number, pageSize: number }]
}

// 定义Props
const props = withDefaults(defineProps<Props>(), {
  total: 0,
  pageSize: 10,
  showJump: false,
  showPageSize: false,
  showStats: false,
  pageSizeOptions: () => [10, 20, 50, 100],
})

// 定义Emits
const emit = defineEmits<Emits>()

// 当前每页条数
const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val) => {
    emit('update:pageSize', val)
    // 直接读取 props.modelValue，避免 computed 互相引用触发 lint
    emit('change', { page: props.modelValue, pageSize: val })
  },
})

// 当前页码（与v-model同步）
const currentPage = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', { page: val, pageSize: currentPageSize.value })
  },
})

// 快速跳转的输入值
const jumpInput = ref('')

/**
 * 计算应该显示的分页按钮数组
 * 最多显示5个页码按钮（当前页前后各2页）
 */
const paginationItems = computed(() => {
  const maxButtons = 5
  const totalPagesNum = props.totalPages
  const currentPageNum = props.modelValue

  // 如果总页数小于等于最多按钮数，显示所有页码
  if (totalPagesNum <= maxButtons) {
    return Array.from({ length: totalPagesNum }, (_, i) => ({ page: i + 1 }))
  }

  // 计算开始页码和结束页码
  let startPage = currentPageNum - 2
  let endPage = currentPageNum + 2

  // 调整范围确保不超出总页数
  if (startPage < 1) {
    endPage += 1 - startPage
    startPage = 1
  }
  if (endPage > totalPagesNum) {
    startPage -= endPage - totalPagesNum
    startPage = Math.max(startPage, 1)
    endPage = totalPagesNum
  }

  // 生成页码数组
  const items = []
  for (let i = startPage; i <= endPage; i++) {
    items.push({ page: i })
  }

  return items
})

/**
 * 跳转到指定页码
 * @param page - 目标页码
 */
function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page
  }
}

/**
 * 处理上一页点击事件
 */
function handlePrevClick() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 处理下一页点击事件
 */
function handleNextClick() {
  if (currentPage.value < props.totalPages) {
    currentPage.value++
  }
}

/**
 * 处理快速跳转到指定页码
 */
function handleJumpPage() {
  const pageNum = Number.parseInt(jumpInput.value)
  if (pageNum && pageNum >= 1 && pageNum <= props.totalPages) {
    currentPage.value = pageNum
    jumpInput.value = ''
  }
}

/**
 * 处理每页条数改变
 */
function handlePageSizeChange() {
  // 当改变每页条数时，重新计算当前页码（防止超出范围）
  const newTotalPages = Math.ceil((props.total || 0) / currentPageSize.value)
  if (currentPage.value > newTotalPages && newTotalPages > 0) {
    currentPage.value = newTotalPages
  }
}
</script>

<template>
  <div class="pagination">
    <!-- 统计信息 - 最左侧 -->
    <div v-if="showStats" class="pagination__stats">
      <span>共 {{ total }} 项数据</span>
    </div>

    <!-- 每页条数选择器 -->
    <div v-if="showPageSize" class="pagination__size">
      <select v-model.number="currentPageSize" class="pagination__size-select" @change="handlePageSizeChange">
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }} 条/页
        </option>
      </select>
    </div>

    <!-- 分页按钮和页码信息 -->
    <div class="pagination__nav">
      <!-- 上一页按钮 -->
      <button :title="`第 ${modelValue - 1} 页`" class="pagination__btn pagination__btn--prev" :disabled="modelValue <= 1" @click="handlePrevClick">
        <span class="pagination__btn-icon">‹</span>
      </button>

      <!-- 页码按钮列表 -->
      <div class="pagination__pages">
        <!-- 第一页 -->
        <button v-if="paginationItems[0]?.page !== 1" class="pagination__page-btn" :class="[{ 'pagination__page-btn--active': modelValue === 1 }]" @click="goToPage(1)">
          1
        </button>

        <!-- 左侧省略号 -->
        <span v-if="(paginationItems[0]?.page || 0) > 2" class="pagination__ellipsis">...</span>

        <!-- 中间页码按钮 -->
        <button
          v-for="item in paginationItems"
          :key="item.page"
          class="pagination__page-btn" :class="[{ 'pagination__page-btn--active': modelValue === item.page }]"
          @click="goToPage(item.page)"
        >
          {{ item.page }}
        </button>

        <!-- 右侧省略号 -->
        <span v-if="(paginationItems[paginationItems.length - 1]?.page || 0) < totalPages - 1" class="pagination__ellipsis">...</span>

        <!-- 最后一页 -->
        <button
          v-if="paginationItems[paginationItems.length - 1]?.page !== totalPages && totalPages > 1"
          class="pagination__page-btn" :class="[{ 'pagination__page-btn--active': modelValue === totalPages }]"
          @click="goToPage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- 下一页按钮 -->
      <button :title="`第 ${modelValue + 1} 页`" class="pagination__btn pagination__btn--next" :disabled="modelValue >= totalPages" @click="handleNextClick">
        <span class="pagination__btn-icon">›</span>
      </button>
    </div>

    <!-- 快速跳转部分 - 最右侧 -->
    <div v-if="showJump" class="pagination__jump">
      <!-- 跳转文字 -->
      <span class="pagination__jump-label">跳转到</span>

      <!-- 输入框 -->
      <input v-model="jumpInput" type="number" class="pagination__jump-input" :min="1" :max="totalPages" @keyup.enter="handleJumpPage">

      <!-- 页码显示 -->
      <span class="pagination__jump-info">/ {{ totalPages }} 页</span>

      <!-- 跳转按钮 -->
      <button class="pagination__jump-btn" @click="handleJumpPage">
        跳转
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 分页容器样式 */
.pagination {
  gap: 16px;
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;

  /* 统计信息 */
  &__stats {
    color: #6b7280;
    padding: 0 8px;
    font-size: 14px;
    min-width: fit-content;
    white-space: nowrap;
  }

  /* 每页条数选择器容器 */
  &__size {
    display: flex;
    align-items: center;
  }

  /* 每页条数下拉选择 */
  &__size-select {
    color: #1f2937;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    height: 36px;
    outline: none;
    padding: 0 8px;
    font-size: 14px;
    transition: border-color 300ms ease-in-out;
    border-radius: 6px;
    background-color: white;

    &:hover {
      border-color: #108cf0;
    }

    &:focus {
      box-shadow: 0 0 0 2px rgba(16, 140, 240, 0.1);
      border-color: #108cf0;
    }
  }

  /* 分页导航容器 */
  &__nav {
    gap: 8px;
    display: flex;
    align-items: center;
  }

  /* 按钮基础样式 */
  &__btn {
    color: #1f2937;
    width: 36px;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    height: 36px;
    display: flex;
    font-size: 16px;
    transition: all 300ms ease-in-out;
    align-items: center;
    font-weight: 600;
    border-radius: 6px;
    justify-content: center;
    background-color: white;

    &:hover:not(:disabled) {
      color: #108cf0;
      border-color: #108cf0;
      background-color: rgba(16, 140, 240, 0.05);
    }

    /* 禁用状态 */
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      background-color: #f5f5f5;
    }
  }

  /* 按钮图标 */
  &__btn-icon {
    display: inline-block;
    line-height: 1;
  }

  /* 页码按钮容器 */
  &__pages {
    gap: 6px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  /* 单个页码按钮 */
  &__page-btn {
    color: #1f2937;
    width: 36px;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    height: 36px;
    display: flex;
    padding: 0;
    font-size: 14px;
    transition: all 300ms ease-in-out;
    align-items: center;
    font-weight: 500;
    border-radius: 6px;
    justify-content: center;
    background-color: white;

    &:hover {
      color: #108cf0;
      border-color: #108cf0;
      background-color: rgba(16, 140, 240, 0.05);
    }

    &--active {
      color: white;
      cursor: default;
      font-weight: 600;
      border-color: #108cf0;
      background-color: #108cf0;

      &:hover {
        color: white;
        border-color: #108cf0;
        background-color: #108cf0;
      }
    }
  }

  /* 省略号 */
  &__ellipsis {
    color: #9ca3af;
    padding: 0 4px;
    font-size: 14px;
    font-weight: 500;
  }

  /* 页码信息显示 */
  &__info {
    gap: 4px;
    color: #1f2937;
    display: flex;
    padding: 0 8px;
    font-size: 16px;
    min-width: fit-content;
    align-items: center;
    white-space: nowrap;
  }

  /* 当前页码 */
  &__current {
    color: #108cf0;
    min-width: 24px;
    text-align: center;
    font-weight: 600;
  }

  /* 分隔符 */
  &__separator {
    color: #e5e7eb;
  }

  /* 总页数 */
  &__total {
    color: #6b7280;
    min-width: 24px;
    text-align: center;
  }

  /* 快速跳转容器 */
  &__jump {
    gap: 8px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  /* 跳转标签文字 */
  &__jump-label {
    color: #1f2937;
    font-size: 14px;
    font-weight: 500;
  }

  /* 快速跳转输入框 */
  &__jump-input {
    width: 50px;
    border: 1px solid #e5e7eb;
    height: 36px;
    outline: none;
    padding: 0 8px;
    font-size: 14px;
    transition: border-color 300ms ease-in-out;
    border-radius: 6px;

    &:focus {
      box-shadow: 0 0 0 2px rgba(16, 140, 240, 0.1);
      border-color: #108cf0;
    }

    /* 隐藏数字输入框的上下箭头 */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }
  }

  /* 跳转信息显示（/ 10 页） */
  &__jump-info {
    color: #6b7280;
    font-size: 14px;
    min-width: fit-content;
  }

  /* 快速跳转按钮 */
  &__jump-btn {
    color: #108cf0;
    border: 1px solid #108cf0;
    cursor: pointer;
    height: 36px;
    padding: 0 12px;
    font-size: 14px;
    transition: all 300ms ease-in-out;
    font-weight: 600;
    white-space: nowrap;
    border-radius: 6px;
    background-color: white;

    &:hover {
      color: white;
      background-color: #108cf0;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .pagination {
    gap: 12px;
    padding: 16px;

    &__btn {
      width: 34px;
      height: 34px;
      font-size: 14px;
    }

    &__jump-input {
      width: 45px;
      height: 34px;
    }

    &__jump-btn {
      height: 34px;
      padding: 0 10px;
      font-size: 12px;
    }

    &__size-select {
      height: 34px;
      padding: 0 6px;
      font-size: 12px;
    }
  }
}

@media (max-width: 768px) {
  .pagination {
    gap: 8px;
    padding: 12px;
    justify-content: center;

    &__stats {
      order: 1;
      width: 100%;
      padding: 0;
      font-size: 12px;
      min-width: 100%;
      text-align: center;
    }

    &__size {
      order: 2;
    }

    &__nav {
      gap: 6px;
      order: 3;
    }

    &__jump {
      gap: 6px;
      order: 4;
      width: 100%;
      justify-content: center;
    }

    &__btn {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    &__size-select {
      height: 32px;
      padding: 0 6px;
      font-size: 12px;
    }

    &__jump-label {
      font-size: 12px;
    }

    &__jump-input {
      width: 40px;
      height: 32px;
      font-size: 12px;
    }

    &__jump-info {
      font-size: 12px;
    }

    &__jump-btn {
      height: 32px;
      padding: 0 8px;
      font-size: 12px;
    }

    &__info {
      gap: 2px;
      padding: 0 4px;
      font-size: 14px;
    }

    &__stats {
      font-size: 12px;
    }
  }
}
</style>
