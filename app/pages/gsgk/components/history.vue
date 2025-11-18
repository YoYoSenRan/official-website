<script setup lang="ts">
import { developmentHistory } from '~/api/index'
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import image from '~/assets/images/swiper/swiper-2.jpg'
import historyBg from '~/assets/images/history-bg.webp'

const year = ref('2024')
const isLoading = ref(false)
const allData = ref<any[]>([])
const timelineRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLElement | null>(null)
const timelineSpacer = ref(0)
const SCROLL_THROTTLE_DELAY = 250
let wheelLocked = false
let wheelUnlockTimer: ReturnType<typeof setTimeout> | null = null
const DETAIL_AUTO_INTERVAL = 4000
const DETAILS_WHEEL_THROTTLE = 300
const activeDetailIndex = ref(0)
let detailAutoTimer: ReturnType<typeof setInterval> | null = null
let detailWheelLocked = false
let detailWheelTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 统一从接口响应中提取年份信息；优先使用 normalizeHistoryData 写入的 normalizedYear。
 */
function resolveYearFromItem(item: Record<string, any>): string {
  if (item?.normalizedYear)
    return item.normalizedYear
  return extractYear(item?.date || '')
}

/**
 * 从title中提取年份 (e.g. "2024年6月" -> "2024", "2024" -> "2024")
 */
function extractYear(date: string): string {
  const match = date.match(/(\d{4})/)
  return match?.[1] ?? ''
}

/**
 * 计算years列表 - 从数据中提取所有年份并去重
 */
const years = computed(() => {
  const yearSet = new Set<string>()
  allData.value.forEach((item) => {
    const extractedYear = resolveYearFromItem(item)
    if (extractedYear)
      yearSet.add(extractedYear)
  })
  // 按年份倒序排列
  return Array.from(yearSet).sort().reverse()
})

/**
 * 根据选中年份过滤数据
 */
const currentData = computed(() => {
  return allData.value.filter(item => resolveYearFromItem(item) === year.value)
})

const activeDetail = computed(() => currentData.value[activeDetailIndex.value] ?? null)

const activeDetailImage = computed(() => {
  if (!activeDetail.value)
    return image
  return activeDetail.value.imageUrl || activeDetail.value.image || image
})

const isDetailsCentered = computed(() => currentData.value.length <= 2)

/**
 * 将后端返回的 { [year]: Event[] } 结构转成数组，便于现有渲染逻辑复用
 */
function normalizeHistoryData(rawData: unknown) {
  if (!rawData)
    return []

  if (Array.isArray(rawData))
    return rawData

  if (typeof rawData === 'object') {
    const normalized: any[] = []
    Object.entries(rawData as Record<string, any>).forEach(([yearKey, items]) => {
      if (!Array.isArray(items))
        return
      items.forEach((item) => {
        normalized.push({
          ...item,
          normalizedYear: yearKey,
        })
      })
    })
    return normalized
  }

  return []
}

/**
 * 获取发展历程数据
 */
async function fetchHistoryData() {
  try {
    isLoading.value = true
    // 调用 articlePageListByAlias 接口获取发展历程数据
    const response = await developmentHistory({
      alias: 'fazhanlicheng',
    })
    allData.value = normalizeHistoryData(response)
    // 如果有数据，自动设置为最新的年份
    if (years.value.length > 0 && !years.value.includes(year.value)) {
      const latestYear = years.value[0]
      if (latestYear) {
        year.value = latestYear
      }
    }
    // 初始化后滚动到活跃年份并重算上下占位
    setTimeout(() => {
      updateTimelineSpacer()
      scrollToActiveYear()
    }, 100)
  }
  catch (error) {
    console.error('获取发展历程数据失败:', error)
    allData.value = []
  }
  finally {
    isLoading.value = false
  }
}

/**
 * 处理年份点击事件
 */
function handleYearClick(selectedYear: string) {
  if (selectedYear === year.value)
    return
  year.value = selectedYear
}

/**
 * 鼠标滚轮切换年份，并控制滚动节奏保持良好手感
 */
function handleTimelineWheel(event: WheelEvent) {
  if (!years.value.length)
    return

  event.preventDefault()

  if (wheelLocked)
    return

  const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
  if (!direction)
    return

  const currentIndex = years.value.indexOf(year.value)
  if (currentIndex === -1) {
    const firstYear = years.value[0]
    if (firstYear)
      year.value = firstYear
    return
  }

  const nextIndex = currentIndex + direction
  if (nextIndex < 0 || nextIndex >= years.value.length)
    return

  const nextYear = years.value[nextIndex]
  if (nextYear)
    year.value = nextYear
  wheelLocked = true
  if (wheelUnlockTimer)
    clearTimeout(wheelUnlockTimer)
  wheelUnlockTimer = setTimeout(() => {
    wheelLocked = false
  }, SCROLL_THROTTLE_DELAY)
}

/**
 * 自动滚动到选中的年份
 */
function scrollToActiveYear() {
  if (!timelineRef.value)
    return

  const activeElement = timelineRef.value.querySelector('.history__year--active')
  if (activeElement) {
    const container = timelineRef.value
    const elementRect = activeElement.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // 计算偏移量，使选中的年份居中显示
    const offset = elementRect.top - containerRect.top - containerRect.height / 2 + elementRect.height / 2
    container.scrollBy({
      top: offset,
      behavior: 'smooth',
    })
  }
}

function handleDetailsWheel(event: WheelEvent) {
  if (currentData.value.length <= 1)
    return

  event.preventDefault()
  if (detailWheelLocked)
    return
  const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
  if (!direction)
    return

  changeActiveDetail(direction)
  restartDetailAutoScroll()
  detailWheelLocked = true
  if (detailWheelTimer)
    clearTimeout(detailWheelTimer)
  detailWheelTimer = setTimeout(() => {
    detailWheelLocked = false
  }, DETAILS_WHEEL_THROTTLE)
}

function changeActiveDetail(step: number) {
  const total = currentData.value.length
  if (total <= 1)
    return
  const next = (activeDetailIndex.value + step + total) % total
  activeDetailIndex.value = next
}

function scrollDetailsToActive(behavior: ScrollBehavior = 'smooth') {
  if (!detailsRef.value)
    return
  const container = detailsRef.value
  if (container.scrollHeight <= container.clientHeight + 1)
    return

  const items = detailsRef.value.querySelectorAll('.history__details-item')
  const target = items[activeDetailIndex.value] as HTMLElement | undefined
  if (!target)
    return

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const offset = targetRect.top - containerRect.top - containerRect.height / 2 + targetRect.height / 2
  container.scrollBy({
    top: offset,
    behavior,
  })
}

function startDetailAutoScroll() {
  stopDetailAutoScroll()
  if (currentData.value.length <= 1)
    return
  detailAutoTimer = setInterval(() => {
    changeActiveDetail(1)
  }, DETAIL_AUTO_INTERVAL)
}

function stopDetailAutoScroll() {
  if (detailAutoTimer)
    clearInterval(detailAutoTimer)
  detailAutoTimer = null
}

function restartDetailAutoScroll() {
  stopDetailAutoScroll()
  startDetailAutoScroll()
}

/**
 * 计算时间线顶部和底部的占位高度，确保首尾年份也能居中对齐
 */
function updateTimelineSpacer() {
  if (!timelineRef.value) {
    timelineSpacer.value = 0
    return
  }

  const containerHeight = timelineRef.value.clientHeight
  const sampleYearEl = timelineRef.value.querySelector('.history__year') as HTMLElement | null
  const sampleHeight = sampleYearEl ? sampleYearEl.offsetHeight : 0
  // margin 在 CSS 中设置为 15px 上下，这里约等于 30px
  const estimatedTotalHeight = sampleHeight + 30
  const computedSpacer = Math.max((containerHeight - estimatedTotalHeight) / 2, 0)
  timelineSpacer.value = computedSpacer
}

// 使用 watch 监听年份变化
watch(
  () => year.value,
  () => {
    // 使用 nextTick 确保 DOM 已更新
    setTimeout(scrollToActiveYear, 0)
  },
)

watch(
  years,
  () => {
    setTimeout(updateTimelineSpacer, 0)
  },
)

watch(
  currentData,
  (list) => {
    activeDetailIndex.value = 0
    stopDetailAutoScroll()
    setTimeout(() => {
      scrollDetailsToActive('auto')
    }, 0)
    if (list.length > 0)
      startDetailAutoScroll()
  },
  { immediate: true },
)

watch(
  () => activeDetailIndex.value,
  () => {
    setTimeout(() => scrollDetailsToActive(), 0)
  },
)

// 初始化 - 获取所有数据
fetchHistoryData()

onMounted(() => {
  updateTimelineSpacer()
  window.addEventListener('resize', updateTimelineSpacer)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTimelineSpacer)
  if (wheelUnlockTimer)
    clearTimeout(wheelUnlockTimer)
  if (detailWheelTimer)
    clearTimeout(detailWheelTimer)
  stopDetailAutoScroll()
})
</script>

<template>
  <div class="history" :style="{ backgroundImage: `url(${historyBg})` }" data-anchor="fzlc">
    <div class="history__header">
      <div class="history__title-wrapper">
        <h2 class="history__title">
          发展历程
        </h2>
      </div>
    </div>
    <div class="history__content">
      <!-- 左侧时间列表 -->
      <div class="history__left">
        <div class="history__timeline-list">
          <div class="history__year-indicator" />
          <div ref="timelineRef" class="history__timeline-wrapper" @wheel.prevent="handleTimelineWheel">
            <div class="history__timeline-inner" :style="{ paddingTop: `${timelineSpacer}px`, paddingBottom: `${timelineSpacer}px` }">
              <div v-for="(item, index) in years" :key="index" class="history__year-wrapper">
                <div class="history__year" :class="{ 'history__year--active': item === year }" @click="handleYearClick(item)">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容展示 -->
      <div class="history__right">
        <div class="history__details">
          <div class="history__details-content">
            <div class="history__details-pointer" />
            <div
              ref="detailsRef"
              class="history__details-list"
              :class="{ 'history__details-list--centered': isDetailsCentered }"
              @wheel.prevent="handleDetailsWheel"
            >
              <div
                v-for="(item, index) in currentData"
                :key="item.id"
                class="history__details-item"
                :class="{ 'history__details-item--active': index === activeDetailIndex }"
              >
                <div class="history__details-indicator-wrapper">
                  <div v-if="index === activeDetailIndex" class="history__details-indicator" />
                </div>
                <div class="history__details-text">
                  <span class="history__details-title">{{ item.title || item.date }}</span>
                  <span class="history__details-desc" v-html="item.description" />
                </div>
              </div>
            </div>
          </div>
          <div class="history__details-image">
            <img :src="activeDetailImage" :alt="activeDetail?.title || year" loading="lazy">
          </div>
        </div>
        <!-- 加载状态 -->
        <Transition name="loading-modal">
          <div v-if="isLoading" class="history__loading-overlay">
            <div class="history__loading-placeholder">
              <div class="history__loading-spinner" />
              <span class="history__loading-text">正在加载中...</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/css/variables.scss';

// Loading spinner animation
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Loading modal transition
.loading-modal-enter-active,
.loading-modal-leave-active {
  transition: all 0.3s ease;
}

.loading-modal-enter-from,
.loading-modal-leave-to {
  opacity: 0;
}

/**
 * 发展历程组件 - BEM 命名规范
 */
.history {
  gap: 30px;
  width: 100%;
  display: flex;
  padding: 60px 250px;
  position: relative;
  flex-direction: column;
  background-size: cover;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center top;

  /* ============ 头部样式 ============ */
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__title {
    color: #1f2937;
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }

  /* ============ 内容布局 ============ */
  &__content {
    height: 350px;
    display: flex;
    overflow: hidden;
    margin-top: 30px;
  }

  /* ============ 左侧时间线 ============ */
  &__left {
    flex: 0 0 150px;
    display: flex;
    position: relative;
    border-right: 1px solid $primary-color;
  }

  &__timeline-list {
    width: 100%;
    display: flex;
    position: relative;
    align-items: center;
  }

  &__timeline-wrapper {
    width: 100%;
    height: 100%;
    padding: 30px 0;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  &__timeline-inner {
    display: flex;
    position: relative;
    flex-direction: column;
  }

  &__timeline-indicator {
    top: 50%;
    right: 50px;
    width: 0;
    height: 0;
    z-index: 10;
    position: absolute;
    border-top: 10px solid transparent;
    transition: transform 0.3s ease;
    border-right: 16px solid $primary-color;
    border-bottom: 10px solid transparent;
  }

  &__year-wrapper {
    gap: 10px;
    display: flex;
    align-items: center;
  }

  &__year-indicator {
    top: 50%;
    right: 16px;
    width: 0;
    height: 0;
    z-index: 5;
    position: absolute;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-right: 12px solid $primary-color;
    border-bottom: 8px solid transparent;
    pointer-events: none;
  }

  &__year {
    color: inherit;
    width: 80px;
    border: none;
    cursor: pointer;
    margin: 15px 0;
    display: flex;
    padding: 0;
    font-size: 20px;
    background: none;
    text-align: center;
    align-items: center;
    justify-content: center;

    &--active {
      font-size: 26px;
      font-weight: bold;
    }
  }

  /* ============ 右侧内容 ============ */
  &__right {
    flex: 1;
    display: flex;
    padding: 60px;
    position: relative;
    flex-direction: column;
    justify-content: center;
  }

  &__details {
    gap: 40px;
    display: flex;
    animation: fadeIn $transition-normal ease-in-out;
    align-items: center;
    justify-content: space-between;
  }

  &__details-content {
    flex: 1;
    height: 280px;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  &__details-pointer {
    top: 50%;
    left: -24px;
    width: 0;
    height: 0;
    z-index: 3;
    position: absolute;
    transform: translateY(-50%);
    border-top: 10px solid transparent;
    border-left: 16px solid $primary-color;
    border-bottom: 10px solid transparent;
    pointer-events: none;
  }

  &__details-list {
    gap: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 10px 0;
    overflow-y: auto;
    flex-direction: column;
    justify-content: flex-start;
    scroll-behavior: smooth;

    &--centered {
      justify-content: center;
    }
  }

  &__details-item {
    gap: 20px;
    display: flex;
    padding: 16px 10px;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
    align-items: center;

    &--active {
      opacity: 1;
      transform: scale(1.02);

      .history__details-title {
        color: $primary-color;
      }
    }

    &:not(&--active) {
      opacity: 0.7;
    }
  }

  &__details-indicator-wrapper {
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__details-indicator {
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-left: 16px solid $primary-color;
    border-bottom: 10px solid transparent;
  }

  &__details-text {
    gap: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__details-date {
    color: #999;
    font-size: 12px;
    font-weight: 500;
  }

  &__details-title {
    color: #333;
    font-size: 18px;
    transition: color 0.3s ease;
    font-weight: bold;
  }

  &__details-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.8;
  }

  &__details-image {
    flex: 0 0 350px;
    width: 350px;
    height: 240px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-radius: 12px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* ============ 加载状态 ============ */
  &__loading-overlay {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 100;
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &__loading-placeholder {
    gap: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  &__loading-spinner {
    width: 40px;
    border: 3px solid #e5e7eb;
    height: 40px;
    animation: spin 1s linear infinite;
    border-radius: 50%;
    border-top-color: $primary-color;
  }

  &__loading-text {
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
  }
}

/* ============ 动画 ============ */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
