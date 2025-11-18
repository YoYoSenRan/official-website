<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import image1 from '~/assets/images/swiper/swiper-1.jpg'
import image2 from '~/assets/images/swiper/swiper-2.jpg'
import image3 from '~/assets/images/swiper/swiper-3.jpg'
import overviewBg from '~/assets/images/overview-top-bg.webp'

// 数据定义
interface OverviewItem {
  title: string
  description: string
  image: string
}

const overviewItems: OverviewItem[] = [
  {
    title: '地理位置',
    description: '坐落于红军长征"不朽定桥"垂直史的红城泸定；位于甘孜州白治州大渡河下流中游，坝址下游港定县城2.5公里。',
    image: image1,
  },
  {
    title: '重要意义',
    description: '作为重要的水电枢纽工程，在防洪、发电、灌溉等方面具有重要战略意义。',
    image: image2,
  },
  {
    title: '技术规格',
    description: '采用最先进的水利发电技术，设计装机容量920MW，是国内重要的清洁能源基地。',
    image: image3,
  },
]

const currentIndex = ref(0)
let autoPlayTimer: NodeJS.Timeout | null = null

/**
 * 设置当前显示的索引
 */
function setCurrentIndex(index: number) {
  currentIndex.value = index
  resetAutoPlay()
}

/**
 * 自动轮播逻辑
 */
function startAutoPlay() {
  autoPlayTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % overviewItems.length
  }, 5000)
}

/**
 * 停止并重新开始自动播放
 */
function resetAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
  startAutoPlay()
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
})
</script>

<template>
  <section class="overview" data-anchor="gsjj">
    <div class="overview__container">
      <!-- 上面部分：左图右文+指标 -->
      <div class="overview__top">
        <!-- 背景图 -->
        <img :src="overviewBg" alt="背景" class="overview__top-bg">
        <div class="overview__wrapper">
          <!-- 左侧图片 -->
          <div class="overview__image">
            <img src="@/assets/images/swiper/swiper-1.jpg" alt="公司介绍">
          </div>

          <!-- 右侧内容 -->
          <div class="overview__content">
            <!-- 标题和描述 -->
            <div class="overview__text">
              <h2 class="overview__title">
                公司介绍
              </h2>
              <p class="overview__description">
                四川华电泸定水电有限公司（以下简称公司）于2006年6月注册成立，由华电国际电力股份有限公司全资设立，负责泸定水电站的投资、建设和运营。
              </p>
            </div>

            <!-- 数据指标 -->
            <div class="overview__metrics">
              <div class="overview__metric">
                <div class="overview__metric-value">
                  920
                </div>
                <div class="overview__metric-label">
                  MW总装机容量
                </div>
              </div>
              <div class="overview__metric">
                <div class="overview__metric-value">
                  37.8
                </div>
                <div class="overview__metric-label">
                  亿KW.h年发电量
                </div>
              </div>
              <div class="overview__metric">
                <div class="overview__metric-value">
                  2012
                </div>
                <div class="overview__metric-label">
                  年全面投产
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下面部分：卡片展示 -->
      <div class="overview__bottom">
        <!-- 卡片容器 -->
        <div class="overview__cards-wrapper">
          <div class="overview__cards">
            <!-- 内容卡片 -->
            <div
              v-for="(item, index) in overviewItems"
              :key="index"
              class="overview__card"
              :class="{ 'overview__card--active': currentIndex === index }"
              @mouseenter="setCurrentIndex(index)"
            >
              <div class="overview__card-top">
                <span class="overview__card-top-number">0{{ index + 1 }}</span>
                <span class="overview__card-top-title">{{ item.title }}</span>
              </div>
              <div class="overview__card-bottom">
                <div class="overview__card-content">
                  <span class="overview__card-content-number">0{{ index + 1 }}</span>
                  <span class="overview__card-content-title">{{ item.title }}</span>
                  <span class="overview__card-content-description">{{ item.description }}</span>
                </div>
                <div class="overview__card-image">
                  <img :src="`${item.image}`" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 公司介绍区块样式 - BEM命名规范 */
.overview {
  width: 100%;
  position: relative;
  background-color: #ffffff;
  scroll-margin-top: 60px;

  /* ============ 上部分样式 ============ */
  &__top {
    padding: 60px 250px;
    position: relative;
  }

  /* 背景图 */
  &__top-bg {
    top: 230px;
    right: 0;
    width: 60%;
    height: auto;
    z-index: 0;
    position: absolute;
    pointer-events: none;
  }

  /* 包装器：两列式布局容器 */
  &__wrapper {
    gap: 60px;
    display: flex;
    z-index: 1;
    position: relative;
    align-items: flex-start;
  }

  /* 左侧图片区域 */
  &__image {
    flex: 0 0 35%;
    position: relative;
    min-width: 0;

    &::before {
      top: -30px;
      right: -30px;
      width: 100px;
      height: 15px;
      content: '';
      position: absolute;
      background: linear-gradient(to left, #0066ff, rgba(0, 102, 255, 0));
      pointer-events: none;
    }

    &::after {
      top: -30px;
      right: -30px;
      width: 15px;
      height: 100px;
      content: '';
      position: absolute;
      background: linear-gradient(to bottom, #0066ff, rgba(0, 102, 255, 0));
      pointer-events: none;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  /* 右侧内容区域 */
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* 文字区域 */
  &__text {
    margin-bottom: 40px;
  }

  /* 区块标题 */
  &__title {
    color: #333;
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: bold;
  }

  /* 描述文本 */
  &__description {
    color: #666;
    margin: 0;
    font-size: 14px;
    line-height: 1.8;
  }

  /* ============ 数据指标样式 ============ */

  /* 数据指标容器 */
  &__metrics {
    gap: 30px;
    display: flex;
    justify-content: space-between;
  }

  /* 单个指标项 */
  &__metric {
    flex: 1;
    text-align: center;
  }

  /* 指标数值 */
  &__metric-value {
    color: #0066ff;
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  /* 指标标签 */
  &__metric-label {
    color: #999;
    font-size: 12px;
    line-height: 1.6;
  }

  /* ============ 下部分样式 ============ */

  &__bottom {
    padding: 0 100px;
    position: relative;

    &::before {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      z-index: 1;
      position: absolute;
      pointer-events: none;
      background-color: rgba(0, 102, 255, 0.4);
    }
  }

  /* 卡片包装器 */
  &__cards-wrapper {
    gap: 40px;
    margin: 0 -100px;
    display: flex;
    padding: 0 100px;
    overflow: hidden;
    position: relative;
    background: url('@/assets/images/swiper/swiper-1.jpg') center / cover no-repeat;
    align-items: center;
    justify-content: space-between;
    background-attachment: fixed;
  }

  /* 卡片容器 */
  &__cards {
    flex: 1;
    display: grid;
    border-left: 1px solid #ffffff;
    border-right: 1px solid #ffffff;
    grid-template-columns: repeat(3, 1fr);
  }

  /* 内容卡片 */
  &__card {
    cursor: pointer;
    height: 400px;
    z-index: 2;
    background: rgba(0, 102, 255, 0.15);
    transition: all 0.3s ease;
    border-left: 1px solid #ffffff;
    border-right: 1px solid #ffffff;

    &:first-child,
    &:last-child {
      border-left: none;
      border-right: none;
    }

    &:hover {
      background: rgba(0, 102, 255, 0.25);
    }

    /* 卡片激活态修饰符 */
    &--active {
      transform: translateY(-100%);
    }
  }

  /* 卡片顶部 */
  &__card-top {
    height: 100%;
    display: flex;
    padding: 30px;
    position: relative;
    flex-direction: column;
    justify-content: center;
  }

  /* 卡片顶部数字 */
  &__card-top-number {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 60px;
  }

  /* 卡片顶部标题 */
  &__card-top-title {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }

  /* 卡片底部 */
  &__card-bottom {
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
  }

  /* 卡片内容区 */
  &__card-content {
    height: 50%;
    display: flex;
    padding: 30px;
    flex-direction: column;
    justify-content: center;
    background-color: $primary-color;
  }

  /* 卡片内容数字 */
  &__card-content-number {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  /* 卡片内容标题 */
  &__card-content-title {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  /* 卡片内容描述 */
  &__card-content-description {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }

  /* 卡片图片区 */
  &__card-image {
    height: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* ============ 动画 ============ */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
