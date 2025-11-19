<script setup lang="ts">
import { buildFullUrl } from '~/utils/utils'
import { ref, onMounted } from 'vue'
import { rotatingBanner } from '~/api'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Autoplay, Pagination]

const banners = ref<any[]>([])

/**
 * 获取轮播图数据
 */
async function fetchBanners(params?: any) {
  const data = await rotatingBanner({ alias: 'shouyelunbotu', ...params })
  banners.value = (data || []).map((item: any) => {
    return {
      ...item,
      imageUrl: buildFullUrl(item.imageUrl),
    }
  })
}

async function refresh(params?: any) {
  await fetchBanners(params)
}

onMounted(() => {
  fetchBanners()
})

defineExpose({
  refresh,
})
</script>

<template>
  <div class="index-banner">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :loop="true"
      effect="slide"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      class="index-banner__swiper"
    >
      <SwiperSlide v-for="(item, index) in banners" :key="item.id || index">
        <div class="index-banner__image-wrapper">
          <img :src="item.imageUrl" :alt="`banner-${index}`" class="index-banner__image">
          <div class="index-banner__overlay" />
        </div>
        <div class="index-banner__content">
          <div class="index-banner__label">
            {{ item.topText }}
          </div>
          <h2 class="index-banner__title">
            {{ item.title }}
          </h2>
          <p class="index-banner__description">
            {{ item.bottomText }}
          </p>
        </div>
      </SwiperSlide>
    </Swiper>
    <div class="index-banner__scroll-indicator">
      <div class="mouse" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes slideInContent {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

@keyframes kenBurns {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes scrollDown {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

.index-banner {
  width: 100%;
  height: 100vh; /* Full viewport height for impact */
  overflow: hidden;
  position: relative;
  max-height: 800px;
  min-height: 600px;

  .index-banner__swiper {
    width: 100%;
    height: 100%;

    .index-banner__image-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    .index-banner__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 8s ease;
      background-color: #ddd;
    }

    .index-banner__overlay {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
      pointer-events: none;
    }

    /* Ken Burns Effect on Active Slide */
    :deep(.swiper-slide-active) .index-banner__image {
      animation: kenBurns 8s ease-out forwards;
    }

    :deep(.swiper-pagination-bullet) {
      width: 40px;
      height: 4px;
      margin: 8px 0;
      opacity: 0.6;
      transform: translateY(0); /* Added to satisfy rule if needed, or just reorder */
      gap: 6px;
      transition: all 0.3s ease;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 0.6);
    }

    :deep(.swiper-pagination-bullet-active) {
      width: 60px; /* Active bullet is longer */
      opacity: 1;
      background-color: #108cf0;
    }

    .index-banner__content {
      top: 50%;
      left: 0;
      color: #fff;
      opacity: 0;
      padding: 0 80px; /* Increased padding */
      z-index: 10;
      position: absolute;
      animation: slideInContent 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; /* Smoother easing */
      max-width: 800px; /* Wider content area */
      transform: translateY(-50%);

      .index-banner__label {
        opacity: 0.9;
        font-size: 24px; /* Larger label */
        color: #108cf0; /* Accent color */
        font-weight: 600;
        margin-bottom: 16px;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .index-banner__title {
        font-size: 72px; /* Larger title */
        border-top: none; /* Removed border for cleaner look */
        margin-top: 0;
        font-weight: 800;
        line-height: 1.1;
        padding-top: 0;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        white-space: pre-wrap; /* Allow wrapping if needed */
        margin-bottom: 24px;
        letter-spacing: -1px;
      }

      .index-banner__description {
        margin: 0;
        opacity: 0.9;
        font-size: 24px;
        max-width: 600px;
        font-weight: 400;
        line-height: 1.6;
        letter-spacing: 0.5px;
      }
    }

    :deep(.swiper-pagination) {
      gap: 6px;
      top: auto;
      bottom: 60px; /* Move pagination to bottom left */
      left: 80px;
      right: auto;
      width: auto;
      height: fit-content;
      display: flex;
      transform: none;
      margin-top: 0;
      align-items: flex-start;
    }
  }

  .index-banner__scroll-indicator {
    left: 50%;
    bottom: 30px;
    display: flex;
    opacity: 0.8;
    z-index: 20;
    position: absolute;
    transform: translateX(-50%);
    align-items: center;
    flex-direction: column;

    .mouse {
      width: 26px;
      border: 2px solid #fff;
      height: 42px;
      position: relative;
      border-radius: 20px;

      &::before {
        top: 8px;
        left: 50%;
        width: 4px;
        height: 8px;
        content: '';
        position: absolute;
        animation: scrollDown 1.5s infinite;
        transform: translateX(-50%);
        border-radius: 2px;
        background-color: #fff;
      }
    }
  }
}
</style>
