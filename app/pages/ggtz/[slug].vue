<script setup lang="ts">
import { decodeHtmlEntities } from '~/utils/utils'
import { headerMuneList, headerArticlePageList } from '~/api'
import Tabs from './components/tabs.vue'
import dayjs from 'dayjs'
import image from '~/assets/images/news-bg.png'

definePageMeta({
  layout: 'others',
  key: route => route.fullPath,
})

const route = useRoute()
const router = useRouter()

/** 当前 Slug */
const currentSlug = computed(() => route.params.slug as string || 'cwgk')

/** 当前分类 ID */
const currentId = ref('')

/** 分类列表 */
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

/** 计算总页数 */
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 中文标题 到 Slug 的映射
const TITLE_TO_SLUG: Record<string, string> = {
  厂务公开: 'cwgk',
  党务公开: 'dwgk',
  日常通知: 'rctz',
}

// 硬编码 ID 作为备选 (来自 Header 组件)
const FALLBACK_IDS: Record<string, string> = {
  cwgk: '83926063743477764',
  dwgk: '83926063751342083',
  rctz: '84952483787808770',
}

function formatDateForList(dateString: string) {
  return dayjs(dateString).format('YYYY.MM')
}

function formatDateDay(dateString: string) {
  return dayjs(dateString).format('DD')
}

/** 加载分类列表 */
async function loadCategoryList() {
  try {
    // 尝试获取分类列表，假设别名为 gonggaotongzhi
    const response = await headerMuneList({
      alias: 'gonggaotongzhi',
      isIncludeChildren: false,
      isIncludeSelf: false,
    })
    const list = Array.isArray(response) ? response : []

    if (list.length > 0) {
      categorys.value = list.map((item: any) => {
        const title = item.name || item.title
        // 如果API返回的分类在我们定义的映射中，使用映射的 slug，否则忽略或生成一个临时的
        // 这里我们只保留映射中存在的分类，以确保路由匹配
        const slug = TITLE_TO_SLUG[title]
        return slug ? { title, value: slug, id: String(item.id) } : null
      }).filter((item): item is { title: string, value: string, id: string } => item !== null)
    }

    // 如果 API 没返回数据或者没有匹配到，使用默认列表
    if (categorys.value.length === 0) {
      categorys.value = [
        { title: '厂务公开', value: 'cwgk' },
        { title: '党务公开', value: 'dwgk' },
        { title: '日常通知', value: 'rctz' },
      ]
    }

    updateCurrentId()
  }
  catch {
    // 失败时使用默认列表
    categorys.value = [
      { title: '厂务公开', value: 'cwgk' },
      { title: '党务公开', value: 'dwgk' },
      { title: '日常通知', value: 'rctz' },
    ]
    updateCurrentId()
  }
}

/** 根据当前 slug 更新 ID 并加载数据 */
function updateCurrentId() {
  const slug = currentSlug.value

  // 尝试从 categorys 中找到对应的 ID (如果 API 成功)
  const category = categorys.value.find(c => c.value === slug)

  if (category && (category as any).id) {
    currentId.value = (category as any).id
  }
  else {
    // 使用硬编码 ID
    currentId.value = FALLBACK_IDS[slug] || ''
  }

  if (currentId.value) {
    // 重置页码并加载
    currentPage.value = 1
    loadNews()
  }
}

/** 加载新闻列表 */
async function loadNews(page: number = currentPage.value, size: number = pageSize.value) {
  if (!currentId.value)
    return

  isLoading.value = true

  try {
    const response = await headerArticlePageList({
      subChannelId: currentId.value,
      page: page - 1,
      pageSize: size,
    })

    if (response && typeof response === 'object') {
      const resData = response as any

      if (resData.content && Array.isArray(resData.content)) {
        newsList.value = resData.content.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: decodeHtmlEntities(item.description || ''),
          image: item.image,
          date: formatDateForList(item.publishDate || item.created),
          day: formatDateDay(item.publishDate || item.created),
        }))
        total.value = Number.parseInt(resData.totalElements) || 0
      }
      else if (Array.isArray(response)) {
        newsList.value = response.map((item: any) => ({
          ...item,
          description: decodeHtmlEntities(item.description || ''),
        }))
        total.value = response.length
      }
    }
    else if (Array.isArray(response)) {
      newsList.value = response.map((item: any) => ({
        ...item,
        description: decodeHtmlEntities(item.description || ''),
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

/** 处理 Tab 切换 */
function onTabChange(slug: string) {
  router.push(`/ggtz/${slug}`)
}

/** 处理分页改变 */
function handlePaginationChange(params: { page: number, pageSize: number }) {
  currentPage.value = params.page
  pageSize.value = params.pageSize
  loadNews(params.page, params.pageSize)
}

/** 处理新闻点击 */
function onNewsClick(value: any) {
  router.push({
    path: `/news/detail/${value.id}`,
  })
}

onMounted(() => {
  loadCategoryList()
})
</script>

<template>
  <div class="ggtz-page">
    <!-- 页面标题 -->
    <Description text="公告通知" :image="image" />

    <!-- 分类标签 -->
    <Tabs
      :model-value="currentSlug"
      :list="categorys"
      @change="onTabChange"
    />

    <!-- 内容区域 -->
    <div class="px-[250px]">
      <!-- 加载中 -->
      <div v-if="isLoading" class="loading-state">
        加载中...
      </div>

      <!-- 列表内容 -->
      <News v-else-if="newsList.length > 0" :list="newsList" :col="2" @click="onNewsClick" />

      <!-- 无数据 -->
      <div v-else class="empty-state">
        暂无相关通知
      </div>
    </div>

    <!-- 分页器 -->
    <Pagination
      v-if="newsList.length > 0"
      v-model="currentPage"
      :total-pages="totalPages"
      :total="total"
      :page-size="pageSize"
      show-jump
      show-page-size
      show-stats
      @change="handlePaginationChange"
    />
  </div>
</template>

<style scoped lang="scss">
.ggtz-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}

.loading-state,
.empty-state {
  color: #999;
  padding: 60px 0;
  font-size: 16px;
  text-align: center;
}
</style>
