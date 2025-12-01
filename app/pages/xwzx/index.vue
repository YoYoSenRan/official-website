<script setup lang="ts">
import { removeHtmlEntities } from '~/utils/utils'
import { headerMuneList, headerArticlePageList } from '~/api'
import Tabs from './components/tabs.vue'
import dayjs from 'dayjs'
import image from '~/assets/images/news-bg.png'

definePageMeta({
  layout: 'others',
})

const route = useRoute()
const router = useRouter()

const id = ref('')
const categorys = ref<{ title: string, value: string }[]>([])

/** 当前页码 */
const currentPage = ref(1)

/** 每页条数 */
const pageSize = ref(10)

/** 总条数 */
const total = ref(0)

/** 新闻列表 */
const newsList = ref<any[]>([])

/** 加载状态 */
const isLoading = ref(false)

// ==================== 计算属性 ====================

/**
 * 计算总页数
 */
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

function formatDateForList(dateString: string) {
  return dayjs(dateString).format('YYYY.MM')
}

function formatDateDay(dateString: string) {
  return dayjs(dateString).format('DD')
}

watch(
  () => route.query.id,
  (value) => {
    if (value && id.value !== value) {
      id.value = value as string
    }
    else if (!value && categorys.value.length > 0) {
      const firstCategory = categorys.value[0]
      if (firstCategory)
        id.value = firstCategory.value
    }
  },
  { immediate: true },
)

const skipNextWatch = ref(false)

async function loadCategoryList() {
  try {
    const response = await headerMuneList({
      alias: 'xinwenzhongxin',
      isIncludeChildren: false,
      isIncludeSelf: false,
    })
    const list = Array.isArray(response) ? response : []
    categorys.value = list.map((item: any) => ({
      title: item.name || item.title,
      value: String(item.id),
    }))
    if (categorys.value.length > 0) {
      const firstCategory = categorys.value[0]
      if (!firstCategory)
        return
      skipNextWatch.value = true
      id.value = firstCategory.value
      handleTabChange()
    }
  }
  catch {
    categorys.value = []
  }
}

watch(
  () => id.value,
  (value) => {
    if (!value)
      return
    if (skipNextWatch.value) {
      skipNextWatch.value = false
      return
    }
    handleTabChange()
  },
)

// ==================== 方法 ====================

/**
 * 加载新闻列表
 * @param page - 页码（可选，默认使用当前页码）
 * @param size - 每页条数（可选，默认使用当前每页条数）
 */
async function loadNews(page: number = currentPage.value, size: number = pageSize.value) {
  isLoading.value = true

  try {
    const response = await headerArticlePageList({
      subChannelId: id.value,
      page: page - 1,
      pageSize: size,
    })

    if (response && typeof response === 'object') {
      const resData = response as any

      if (resData.content && Array.isArray(resData.content)) {
        newsList.value = resData.content.map((item: any) => ({
          id: item.id,
          title: removeHtmlEntities(item.title),
          description: removeHtmlEntities(item.description || ''),
          image: item.image,
          date: formatDateForList(item.publishDate || item.created),
          day: formatDateDay(item.publishDate || item.created),
        }))
        total.value = Number.parseInt(resData.totalElements) || 0
      }
      else if (Array.isArray(response)) {
        newsList.value = response.map((item: any) => ({
          ...item,
          title: removeHtmlEntities(item.title),
          description: removeHtmlEntities(item.description || ''),
        }))
        total.value = response.length
      }
    }
    else if (Array.isArray(response)) {
      newsList.value = response.map((item: any) => ({
        ...item,
        title: removeHtmlEntities(item.title),
        description: removeHtmlEntities(item.description || ''),
      }))
      total.value = response.length
    }
  }
  catch {
    newsList.value = []
    total.value = 0
  }
  finally {
    isLoading.value = false
  }
}

/**
 * 处理分页改变
 */
function handlePaginationChange(params: { page: number, pageSize: number }) {
  currentPage.value = params.page
  pageSize.value = params.pageSize
  loadNews(params.page, params.pageSize)
}

function onNewsClick(value: any) {
  router.push({
    path: `/news/detail/${value.id}`,
  })
}

function handleTabChange() {
  currentPage.value = 1
  loadNews(1, pageSize.value)
}

function onCategoryChange(value: string) {
  router.push({
    path: '/xwzx',
    query: { id: value },
  })
}

/**
 * 组件挂载时加载初始数据
 */
onMounted(() => {
  loadCategoryList()
})
</script>

<template>
  <div class="xwzx-page">
    <!-- 页面标题 -->
    <Description text="新闻中心" :image="image" />

    <!-- 分类标签 -->
    <Tabs v-model="id" :list="categorys" @change="onCategoryChange" />

    <div class="px-[250px]">
      <News :list="newsList" :col="2" @click="onNewsClick" />
    </div>

    <!-- 分页组件 -->
    <Pagination v-model="currentPage" :total-pages="totalPages" :total="total" :page-size="pageSize" show-jump show-page-size show-stats @change="handlePaginationChange" />
  </div>
</template>

<style scoped lang="scss">
/* 页面容器 */
.xwzx-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}

/* 内容区域 */
.xwzx-content {
  gap: 40px;
  width: 100%;
  display: flex;
  padding: 60px 100px;
  flex-direction: column;
  background-color: #fafafa;

  /* 加载状态 */
  .xwzx-loading {
    color: #6b7280;
    padding: 60px 20px;
    font-size: 18px;
    text-align: center;
  }

  /* 新闻列表 */
  .news-list {
    gap: 24px;
    display: flex;
    flex-direction: column;
  }

  /* 新闻项 */
  .news-item {
    gap: 24px;
    cursor: pointer;
    display: flex;
    padding: 20px;
    transition: all 300ms ease-in-out;
    align-items: flex-start;
    border-radius: 8px;
    background-color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);

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
      gap: 4px;
      display: flex;
      padding: 12px;
      min-width: 60px;
      text-align: center;
      align-items: center;
      flex-shrink: 0;
      border-radius: 6px;
      flex-direction: column;
      background-color: #f0f6ff;
    }

    /* 年月 */
    &__year-month {
      color: #108cf0;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* 日 */
    &__day {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
    }

    /* 内容区域 */
    &__content {
      gap: 8px;
      flex: 1;
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    /* 标题 */
    &__title {
      color: #1f2937;
      margin: 0;
      font-size: 16px;
      transition: color 300ms ease-in-out;
      word-break: break-word;
      font-weight: 600;
      line-height: 1.6;
    }

    /* 描述 */
    &__description {
      color: #6b7280;
      margin: 0;
      display: -webkit-box;
      overflow: hidden;
      font-size: 14px;
      line-clamp: 2;
      line-height: 1.6;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    /* 箭头 */
    &__arrow {
      color: #e5e7eb;
      font-size: 20px;
      transition: all 300ms ease-in-out;
      flex-shrink: 0;
    }
  }

  /* 空状态 */
  .news-empty {
    color: #6b7280;
    padding: 80px 20px;
    font-size: 18px;
    text-align: center;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .xwzx-content {
    padding: 40px 60px;
  }
}

@media (max-width: 768px) {
  .xwzx-content {
    gap: 30px;
    padding: 30px 20px;

    .news-item {
      gap: 16px;
      padding: 16px;
      flex-direction: column;

      &__date {
        width: 100%;
        padding: 8px 12px;
        min-width: auto;
        flex-direction: row;
        justify-content: space-between;
      }

      &__year-month {
        font-size: 12px;
      }

      &__day {
        font-size: 16px;
      }

      &__title {
        font-size: 14px;
      }

      &__description {
        font-size: 12px;
        line-clamp: 1;
        -webkit-line-clamp: 1;
      }

      &__arrow {
        display: none;
      }
    }

    .news-empty {
      padding: 60px 20px;
    }
  }
}
</style>
