<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import { useMenuStore } from '~/store/menu'
import { buildFullUrl } from '~/utils/utils'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import { ref, watch, computed, onMounted } from 'vue'
import { blockItem, headerArticlePageList } from '~/api'
import bg from '~/assets/images/bg-2.png'
import dayjs from 'dayjs'

const router = useRouter()
const menuStore = useMenuStore()
const activeTab = ref(0)
const newsList = ref<any[]>([])
const newsData = ref<any[]>([])
const isLoading = ref(false)
const swiperInstance = ref<any>(null)

/**
 * 从menuStore映射tabs数据
 */
const tabs = computed(() => {
  return menuStore.news.map((item: any) => ({
    label: item.name || item.title,
    value: item.id,
  }))
})

/**
 * 格式化日期为 YYYY.MM 格式
 */
function formatDateForList(dateString: string) {
  return dayjs(dateString).format('YYYY.MM')
}

/**
 * 格式化日期为 DD 格式
 */
function formatDateDay(dateString: string) {
  return dayjs(dateString).format('DD')
}

/**
 * 获取轮播图数据
 * 使用block-item接口，alias参数为xinwenzhongxin
 */
async function fetchCarouselData() {
  try {
    const response = await blockItem({ block: 'xinwenzhongxin' })
    if (response && Array.isArray(response)) {
      // 转换轮播数据格式
      newsData.value = response.slice(0, 6).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        image: buildFullUrl(item.image),
        date: formatDateForList(item.publishDate || item.created),
        day: formatDateDay(item.publishDate || item.created),
      }))
    }
  }
  catch (error) {
    console.error('Failed to fetch carousel data:', error)
    newsData.value = []
  }
}

/**
 * 获取新闻列表数据并转换格式
 */
async function fetchNewsData() {
  // 如果tabs还没有数据，先等待
  if (tabs.value.length === 0 || activeTab.value >= tabs.value.length) {
    return
  }

  const currentTab = tabs.value[activeTab.value]
  if (!currentTab) {
    return
  }

  isLoading.value = true
  try {
    const response = await headerArticlePageList({
      subChannelId: currentTab.value,
      page: 0,
      pageSize: 6,
    })

    if (response && typeof response === 'object') {
      const resData = response as any
      const articles = (resData.content || []).slice(0, 6)

      // 转换数据格式
      const formattedArticles = articles.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        image: buildFullUrl(item.image),
        date: formatDateForList(item.publishDate || item.created),
        day: formatDateDay(item.publishDate || item.created),
      }))

      // 设置列表数据
      newsList.value = formattedArticles
    }
  }
  catch (error) {
    console.error('Failed to fetch news data:', error)
    newsList.value = []
  }
  finally {
    isLoading.value = false
  }
}

/**
 * 监听 tab 切换
 */
function handleTabChange(index: number) {
  if (activeTab.value === index)
    return

  activeTab.value = index
  fetchNewsData()
}

/**
 * 监听tabs变化，当menuStore的news数据变化时自动加载
 */
watch(
  () => tabs.value,
  (newTabs) => {
    if (newTabs.length > 0 && newsList.value.length === 0) {
      fetchNewsData()
    }
  },
  { deep: true },
)

/**
 * 监听newsData变化，当轮播数据更新时手动刷新Swiper
 */
watch(
  () => newsData.value,
  () => {
    if (swiperInstance.value) {
      swiperInstance.value.update()
    }
  },
  { deep: true },
)

/**
 * 跳转到新闻列表页面
 */
function handleViewMore() {
  if (tabs.value.length === 0 || activeTab.value >= tabs.value.length) {
    return
  }

  const currentTab = tabs.value[activeTab.value]
  if (!currentTab) {
    return
  }

  router.push({
    path: '/xwzx',
    query: { id: currentTab.value },
  })
}

/**
 * 跳转到新闻详情页
 */
function goToDetail(id: string) {
  router.push({
    path: `/news/detail/${id}`,
  })
}

onMounted(() => {
  menuStore.init()
  fetchCarouselData()
  fetchNewsData()
})

const modules = [Autoplay, Pagination]
</script>

<template>
  <div class="index-news-wrapper">
    <img :src="bg" class="index-news-wrapper__bg">
    <div class="index-news">
      <div class="index-news__top">
        <div class="index-news__top--left">
          <div class="index-news__title-section">
            <p class="index-news__title-en">
              CORPORATE
            </p>
            <h2 class="index-news__title-cn">
              新闻中心
            </h2>
          </div>
        </div>
        <div class="index-news__top--right">
          <div class="index-news__tabs">
            <div
              v-for="(tab, index) in tabs"
              :key="index"
              class="index-news__tab-item"
              :class="{ 'index-news__tab-item--active': activeTab === index }"
              @click="handleTabChange(index)"
            >
              {{ tab.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="index-news__bottom">
        <div class="index-news__bottom--left">
          <Swiper
            :modules="modules"
            :slides-per-view="1"
            :loop="true"
            effect="slide"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :pagination="{ clickable: true }"
            class="index-news__swiper"
            @swiper="(swiper) => (swiperInstance = swiper)"
          >
            <SwiperSlide v-for="news in newsData" :key="news.id">
              <div class="index-news__slide" @click="goToDetail(news.id)">
                <img :src="news.image" :alt="news.title" class="index-news__slide-image">
                <div class="index-news__slide-date">
                  <div class="index-news__date-year-month">
                    {{ news.date }}
                  </div>
                  <div class="index-news__date-day">
                    {{ news.day }}
                  </div>
                </div>
                <div class="index-news__slide-title">
                  {{ news.title }}
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="index-news__bottom--right">
          <div class="index-news__list">
            <div v-for="(item, index) in newsList" :key="`${activeTab}-${index}`" class="index-news__list-item" @click="goToDetail(item.id)">
              <div class="index-news__list-item-date">
                <div class="index-news__list-date-text">
                  {{ item.date }}
                </div>
                <div class="index-news__list-date-day">
                  {{ item.day }}
                </div>
              </div>
              <div class="index-news__list-item-content">
                <h3 class="index-news__list-item-title">
                  {{ item.title }}
                </h3>
                <p class="index-news__list-item-description">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
          <div class="index-news__view-more">
            <a href="javascript:void(0)" class="index-news__view-more-btn" @click="handleViewMore">查看更多</a>
          </div>
        </div>
        <Transition name="loading-modal">
          <div v-if="isLoading" class="index-news__loading-overlay">
            <div class="index-news__loading-placeholder">
              <div class="index-news__loading-spinner" />
              <span class="index-news__loading-text">正在加载中...</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

// 最外层容器
.index-news-wrapper {
  width: 100%;
  height: 700px;
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  background-color: #fff;
  &__bg {
    left: 0;
    width: 100%;
    bottom: -500px;
    height: 100%;
    position: absolute;
    object-fit: fill;
    pointer-events: none;
  }
}

// 块容器 - 主容器
.index-news {
  gap: 20px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding: 80px 160px;
  flex-direction: column;

  // 顶部区域
  .index-news__top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    // 顶部左侧 - 标题部分
    .index-news__top--left {
      .index-news__title-section {
        display: flex;
        flex-direction: column;

        // 英文标题 - 短规则
        .index-news__title-en {
          color: #e5e5e5;
          font-size: 27px;
          font-weight: bold;
          line-height: 0;
          margin-bottom: 13px;
        }

        // 中文标题 - 短规则
        .index-news__title-cn {
          color: #1f2937;
          font-size: 32px;
          font-weight: bold;
        }
      }
    }

    // 顶部右侧 - 标签页部分
    .index-news__top--right {
      .index-news__tabs {
        gap: 27px;
        display: flex;

        // 标签项 - 中等规则
        .index-news__tab-item {
          color: #1f2937;
          cursor: pointer;
          padding: 7px;
          font-size: 20px;
          font-size: 22px;
          transition: color 0.3s ease;
          font-weight: 500;

          &:hover,
          &.index-news__tab-item--active {
            color: #108cf0;
          }
        }
      }
    }
  }

  // 底部区域
  .index-news__bottom {
    gap: 40px;
    display: flex;
    position: relative;

    // 底部左侧 - 轮播图
    .index-news__bottom--left {
      width: 600px;
      height: 427px;
      position: relative;

      // 轮播容器 - 中等规则
      .index-news__swiper {
        height: 100%;
        overflow: hidden;

        // Swiper 分页符号 - 短规则
        :deep(.swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          opacity: 1;
          background-color: rgba(255, 255, 255, 0.6);
        }

        // Swiper 分页活跃状态 - 短规则
        :deep(.swiper-pagination-bullet-active) {
          opacity: 1;
          background-color: #108cf0;
        }

        // Swiper 分页容器 - 短规则
        :deep(.swiper-pagination) {
          left: auto;
          right: 27px;
          width: fit-content;
          bottom: 24px;
        }

        // 轮播项 - 短规则
        :deep(.swiper-slide) {
          position: relative;
        }

        // 幻灯片内容容器 - 短规则
        .index-news__slide {
          width: 100%;
          height: 100%;
          position: relative;
        }

        // 图片元素 - 短规则
        .index-news__slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        // 日期容器 - 中等规则
        .index-news__slide-date {
          top: 27px;
          right: 27px;
          z-index: 10;
          position: absolute;
          text-align: right;

          // 年月文本 - 短规则
          .index-news__date-year-month {
            color: #fff;
            font-size: 19px;
            font-weight: 500;
          }

          // 日期数字 - 短规则
          .index-news__date-day {
            color: #fff;
            font-size: 43px;
            font-weight: bold;
            line-height: 1;
          }
        }

        // 标题文本 - 中等规则
        .index-news__slide-title {
          left: 0;
          color: #fff;
          right: 0;
          width: 100%;
          bottom: 0;
          height: 65px;
          display: -webkit-box;
          z-index: 10;
          overflow: hidden;
          position: absolute;
          font-size: 20px;
          background: linear-gradient(to bottom, transparent, #000);
          line-clamp: 1;
          font-weight: 500;
          line-height: 60px;
          padding-left: 30px;
          padding-right: 180px;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }

    // 底部右侧 - 新闻列表
    .index-news__bottom--right {
      flex: 1;
      height: 427px;
      display: flex;
      position: relative;
      flex-direction: column;

      // 新闻列表容器 - 中等规则
      .index-news__list {
        gap: 64px;
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;

        // 列表项 - 中等规则
        .index-news__list-item {
          gap: 21px;
          cursor: pointer;
          display: flex;
          transition: all 0.3s ease;
          align-items: center;
          border-radius: 5px;

          &:hover {
            .index-news__list-item-content {
              .index-news__list-item-title {
                color: #108cf0;
              }
            }
          }

          // 日期框 - 较长规则
          .index-news__list-item-date {
            width: 80px;
            border: 1px solid #e5e7eb;
            height: 100px;
            height: 15 0px;
            display: flex;
            text-align: center;
            align-items: center;
            flex-shrink: 0;
            flex-direction: column;
            justify-content: center;

            // 日期文本 - 短规则
            .index-news__list-date-text {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 5px;
            }

            // 日期数字 - 短规则
            .index-news__list-date-day {
              color: #1f2937;
              font-size: 28px;
              font-weight: bold;
            }
          }

          // 内容容器 - 短规则
          .index-news__list-item-content {
            flex: 1;
            min-width: 0;

            // 标题 - 中等规则
            .index-news__list-item-title {
              color: #1f2937;
              margin: 0 0 11px 0;
              display: -webkit-box;
              overflow: hidden;
              font-size: 19px;
              line-clamp: 1;
              transition: all 0.3s ease;
              font-weight: 600;
              line-height: 1.4;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }

            // 描述 - 中等规则
            .index-news__list-item-description {
              color: #9ca3af;
              margin: 0;
              display: -webkit-box;
              overflow: hidden;
              font-size: 16px;
              line-clamp: 2;
              line-height: 1.4;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }

      // 查看更多区域 - 短规则
      .index-news__view-more {
        left: 0;
        bottom: -40px;
        display: flex;
        position: absolute;
        margin-top: auto;

        // 查看更多按钮 - 中等规则
        .index-news__view-more-btn {
          color: #108cf0;
          font-size: 19px;
          transition: all 0.3s ease;
          font-weight: 500;
          text-decoration: none;

          &:hover {
            color: #0872b8;
            text-decoration: underline;
          }
        }
      }
    }
  }

  // 加载中覆盖层 - 中等规则
  .index-news__loading-overlay {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 100;
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);

    // 加载占位符容器 - 中等规则
    .index-news__loading-placeholder {
      gap: 16px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      // 加载旋转器 - 短规则
      .index-news__loading-spinner {
        width: 54px;
        border: 4px solid #e5e7eb;
        height: 54px;
        animation: spin 1s linear infinite;
        border-radius: 50%;
        border-top-color: #108cf0;
      }

      // 加载文本 - 短规则
      .index-news__loading-text {
        color: #4b5563;
        font-size: 21px;
        font-weight: 500;
      }
    }
  }
}
</style>
