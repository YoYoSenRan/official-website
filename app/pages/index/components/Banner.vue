<script setup lang="ts">
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onMounted, ref } from 'vue'
import { rotatingBanner } from '~/api'
import { buildFullUrl } from '~/utils/utils'
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
        <img :src="item.imageUrl" :alt="`banner-${index}`" class="index-banner__image">
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

.index-banner {
  width: 100%;
  height: 490px;
  overflow: hidden;

  .index-banner__swiper {
    width: 100%;
    height: 100%;

    .index-banner__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: #ddd;
    }

    :deep(.swiper-pagination-bullet) {
      width: 40px;
      height: 4px;
      gap: 6px;
      margin: 8px 0;
      opacity: 1;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    :deep(.swiper-pagination-bullet-active) {
      opacity: 1;
      background-color: #108cf0;
    }

    .index-banner__content {
      left: 0;
      top: 50%;
      z-index: 10;
      color: #fff;
      opacity: 0;
      padding: 0 60px;
      max-width: 600px;
      position: absolute;
      transform: translateY(-50%);
      animation: slideInContent 0.8s ease-out 0.3s forwards;

      .index-banner__label {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: 500;
        opacity: 0.9;
        letter-spacing: 0.5px;
      }

      .index-banner__title {
        margin-top: 0;
        margin-bottom: 16px;
        padding-top: 2px;
        font-size: 56px;
        font-weight: bold;
        line-height: 1.3;
        white-space: nowrap;
        border-top: 2px solid #fff;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      .index-banner__description {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        opacity: 0.95;
        letter-spacing: 0.5px;
      }
    }

    :deep(.swiper-pagination) {
      gap: 6px;
      top: 50%;
      left: 60px;
      right: auto;
      width: auto;
      display: flex;
      height: fit-content;
      margin-top: 130px;
      align-items: flex-start;
      transform: translateY(-50%);
    }
  }
}
</style>
