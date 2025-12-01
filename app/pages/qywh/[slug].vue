<script setup lang="ts">
import { corporateCulture } from '~/api'
import { ref, watch, onMounted } from 'vue'
import image from '~/assets/images/news-bg.png'

definePageMeta({
  layout: 'others',
  key: route => route.fullPath,
})

interface CorporateCultureData {
  id: string
  title: string
  topText: string
  bottomText: string
  imageUrl: string | null
}

const route = useRoute()
const pageData = ref<CorporateCultureData | null>(null)
const isLoading = ref(false)

const currentTitle = computed(() => {
  const alias = route.params.slug as string
  switch (alias) {
    case 'jituangongsi':
      return '集团公司'
    case 'sichuanggongsi':
      return '四川公司'
    case 'ludinggongsi':
      return '泸定公司'
    default:
      return '企业文化'
  }
})

async function fetchData() {
  const alias = route.params.slug as string

  if (!alias)
    return

  isLoading.value = true

  try {
    const response = await corporateCulture({ alias })

    if (response) {
      pageData.value = {
        id: response.id,
        title: response.title,
        topText: response.topText,
        bottomText: response.bottomText,
        imageUrl: response.imageUrl,
      }
    }
  }
  catch (error) {
    console.error('Failed to fetch corporate culture:', error)
    pageData.value = null
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="view-container">
    <Description :text="currentTitle" :image="image" />
    <div class="detail-wrapper">
      <div class="detail-content">
        <!-- 顶部标题区域 -->
        <div class="detail__top">
          <div class="detail__top--left">
            <div class="detail__title-section">
              <p class="detail__title-en">
                CORPORATE CULTURE
              </p>
              <h2 class="detail__title-cn">
                {{ currentTitle }}
              </h2>
            </div>
          </div>
        </div>

        <div v-if="pageData" class="content-area">
          <!-- 标题 -->
          <h1 class="main-title">
            {{ pageData.title }}
          </h1>

          <!-- 顶部文本 -->
          <div v-if="pageData.topText" class="top-text">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="pageData.topText" />
          </div>

          <!-- 图片 -->
          <div v-if="pageData.imageUrl" class="main-image">
            <img :src="pageData.imageUrl" :alt="pageData.title">
          </div>

          <!-- 底部文本 (正文) -->
          <div v-if="pageData.bottomText" class="bottom-text">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="pageData.bottomText" />
          </div>
        </div>

        <div v-else-if="!isLoading" class="no-data">
          暂无内容
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-container {
  width: 100%;
  background-color: #fff;
}

.detail-wrapper {
  width: 100%;
  display: flex;
  align-items: flex-start;
  background-color: #fff;
}

.detail-content {
  gap: 40px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding: 80px 250px;
  flex-direction: column;

  .detail__top {
    width: 100%;
    display: flex;
    align-items: center;

    .detail__top--left {
      display: flex;
      text-align: left;
      align-items: flex-start;
      flex-direction: column;

      .detail__title-en {
        color: #e5e5e5;
        font-size: 27px;
        font-weight: bold;
        line-height: 0;
        margin-bottom: 13px;
      }

      .detail__title-cn {
        color: #1f2937;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }

  .content-area {
    gap: 24px;
    width: 100%;
    display: flex;
    flex-direction: column;

    .main-title {
      color: #1f2937;
      font-size: 28px;
      text-align: center;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .top-text,
    .bottom-text {
      color: #374151;
      font-size: 16px;
      line-height: 1.8;

      :deep(p) {
        margin-bottom: 1em;
      }
    }

    .main-image {
      width: 100%;
      margin: 20px 0;

      img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }
    }
  }

  .no-data {
    color: #9ca3af;
    padding: 40px;
    text-align: center;
  }
}
</style>
