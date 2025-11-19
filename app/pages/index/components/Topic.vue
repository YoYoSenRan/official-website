<script setup lang="ts">
import { Autoplay } from 'swiper/modules'
import { blockItem } from '~/api'
import { buildFullUrl } from '~/utils/utils'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { ref, computed, onMounted } from 'vue'
import 'swiper/css'

const topicList = ref<any[]>([])
const isLoading = ref(false)
const slidesPerView = computed(() => {
  const len = topicList.value.length
  return Math.min(4, Math.max(1, len))
})
const swiperModules = [Autoplay]
const shouldAutoplay = computed(() => topicList.value.length > 4)
const autoplayOptions = computed(() => (shouldAutoplay.value ? { delay: 3000, disableOnInteraction: false } : false))
const loopEnabled = computed(() => shouldAutoplay.value)
const swiperKey = computed(() => `${shouldAutoplay.value ? 'auto' : 'static'}-${topicList.value.length}`)

/**
 * 获取专题聚焦数据
 */
async function fetchTopicData() {
  isLoading.value = true

  try {
    const response = await blockItem({ block: 'zhuantijujiao' })
    // 处理返回的数据，拼接图片完整URL
    topicList.value = (response || []).map((item: any) => ({
      ...item,
      image: buildFullUrl(item.image),
    }))
  }
  catch (error) {
    console.error('Failed to fetch topic data:', error)
    topicList.value = []
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTopicData()
})
</script>

<template>
  <div class="index-topic-wrapper">
    <div class="index-topic">
      <div class="index-topic__top" data-aos="fade-up">
        <div class="index-topic__top--left">
          <div class="index-topic__title-section">
            <p class="index-topic__title-en">
              Special Focus
            </p>
            <h2 class="index-topic__title-cn">
              专题聚焦
            </h2>
          </div>
        </div>
        <div class="index-topic__top--right" />
      </div>
      <div class="index-topic__bottom" data-aos="fade-up" data-aos-delay="200">
        <Swiper
          :key="swiperKey"
          :modules="swiperModules"
          direction="horizontal"
          :slides-per-view="slidesPerView"
          :space-between="10"
          :loop="loopEnabled"
          :autoplay="autoplayOptions"
          class="index-topic__swiper"
        >
          <SwiperSlide v-for="item in topicList" :key="item.id">
            <div class="index-topic__slide">
              <img :src="item.image" :alt="item.name || 'topic-item'">
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 最外层容器
.index-topic-wrapper {
  width: 100%;
  height: 420px;
  display: flex;
  background: #efefef;
  padding-top: 60px;
}

// 块容器 - 主容器
.index-topic {
  gap: 15px;
  width: 100%;
  display: flex;
  padding: 0 160px;
  flex-direction: column;

  // 顶部区域
  .index-topic__top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    // 顶部左侧 - 标题部分
    .index-topic__top--left {
      .index-topic__title-section {
        display: flex;
        flex-direction: column;

        // 英文标题 - 短规则
        .index-topic__title-en {
          color: #d8d8d8;
          font-size: 27px;
          font-weight: bold;
          line-height: 0;
          margin-bottom: 13px;
        }

        // 中文标题 - 短规则
        .index-topic__title-cn {
          color: #1f2937;
          font-size: 32px;
          font-weight: bold;
        }
      }
    }
  }

  .index-topic__bottom {
    position: relative;
    margin-top: 50px;
    .index-topic__swiper {
      width: 100%;
      height: 122px;
    }
    .index-topic__slide {
      width: 100%;
      cursor: pointer;
      height: 122px;
      overflow: hidden;
      border-radius: 8px; /* Rounded corners */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease; /* Smooth zoom */
      }

      &:hover img {
        transform: scale(1.1); /* Zoom effect */
      }
    }
  }
}
</style>
