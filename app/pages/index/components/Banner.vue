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
      gap: 6px;
      width: 40px;
      height: 4px;
      margin: 8px 0;
      opacity: 1;
      transition: all 0.3s ease;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 0.6);
    }

    :deep(.swiper-pagination-bullet-active) {
      opacity: 1;
      background-color: #108cf0;
    }

    .index-banner__content {
      top: 50%;
      left: 0;
      color: #fff;
      opacity: 0;
      padding: 0 60px;
      z-index: 10;
      position: absolute;
      animation: slideInContent 0.8s ease-out 0.3s forwards;
      max-width: 600px;
      transform: translateY(-50%);

      .index-banner__label {
        opacity: 0.9;
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
      }

      .index-banner__title {
        font-size: 56px;
        border-top: 2px solid #fff;
        margin-top: 0;
        font-weight: bold;
        line-height: 1.3;
        padding-top: 2px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        white-space: nowrap;
        margin-bottom: 16px;
      }

      .index-banner__description {
        margin: 0;
        opacity: 0.95;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    }

    :deep(.swiper-pagination) {
      gap: 6px;
      top: 50%;
      left: 60px;
      right: auto;
      width: auto;
      height: fit-content;
      display: flex;
      transform: translateY(-50%);
      margin-top: 130px;
      align-items: flex-start;
    }
  }
}
</style>
