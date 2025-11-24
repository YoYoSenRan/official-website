<script setup lang="ts">
import { useMenuStore } from '~/store/menu'
import { articleSearch } from '~/api'
import logo from '~/assets/images/logo.png'
import News from '~/components/News/index.vue'
import dayjs from 'dayjs'

// ==================== 基础设置 ====================
const menuStore = useMenuStore()
const staticMenu = useMenuData()
const menu = computed(() => {
  const baseMenu = [...(staticMenu.value || [])]
  const newsMenuIndex = baseMenu.findIndex(item => item.title === '新闻中心')

  if (newsMenuIndex !== -1 && menuStore.news && menuStore.news.length > 0 && baseMenu[newsMenuIndex]) {
    const newsMenuItem = baseMenu[newsMenuIndex]!
    newsMenuItem.child = menuStore.news.map((item: any) => ({
      title: item.name || item.title,
      route: `/xwzx?id=${item.id}`,
    }))

    if (newsMenuItem.child && newsMenuItem.child.length > 0) {
      newsMenuItem.route = newsMenuItem.child[0]!.route
    }
  }

  return baseMenu
})

onMounted(() => {
  menuStore.fetchNewsList({ isIncludeChildren: false, isIncludeSelf: false })
})

// ==================== 通知菜单功能 ====================

/** 通知菜单 - 状态 */
const showNotificationMenu = ref(false)
const activeNotificationTab = ref('all')

/** 通知菜单 - 模拟数据 */
const notificationsData = [
  { id: 1, type: 'all', category: '厂务公开', title: '公司工作流程优化通知', time: '2024-10-28' },
  { id: 2, type: 'all', category: '日常通知', title: '员工培训计划安排', time: '2024-10-27' },
  { id: 3, type: 'open', category: '厂务公开', title: '厂区升级改造计划', time: '2024-10-26' },
  { id: 4, type: 'party', category: '党务公开', title: '党建活动信息公开', time: '2024-10-25' },
]

/** 通知菜单 - 计算属性：tabs数据 */
const notificationTabs = computed(() => {
  const allCount = notificationsData.length
  const openCount = notificationsData.filter(item => item.type === 'open' || item.type === 'all').length
  const dailyCount = notificationsData.filter(item => item.type === 'daily' || item.type === 'all').length
  const partyCount = notificationsData.filter(item => item.type === 'party' || item.type === 'all').length

  return [
    { key: 'all', label: '全部', count: allCount },
    { key: 'open', label: '厂务公开', count: openCount },
    { key: 'daily', label: '日常通知', count: dailyCount },
    { key: 'party', label: '党务公开', count: partyCount },
  ]
})

/** 通知菜单 - 计算属性：过滤后的通知列表 */
const filteredNotifications = computed(() => {
  if (activeNotificationTab.value === 'all') {
    return notificationsData
  }
  return notificationsData.filter(item => item.type === activeNotificationTab.value)
})

/** 通知菜单 - 切换菜单显示 */
function toggleNotificationMenu() {
  showNotificationMenu.value = !showNotificationMenu.value
}

/** 通知菜单 - 查看更多通知 */
function handleViewMoreNotifications() {
  showNotificationMenu.value = false
  // 跳转到新闻中心的公告页面
  navigateTo('/xwzx?category=gsgg')
}

/** 通知菜单 - 全局点击监听，点击外部关闭菜单 */
watchEffect(() => {
  if (showNotificationMenu.value) {
    const handleDocumentClick = (event: MouseEvent) => {
      const msgElement = document.querySelector('.header__msg')
      if (msgElement && !msgElement.contains(event.target as Node)) {
        showNotificationMenu.value = false
      }
    }
    // 使用 nextTick 确保监听器不会立即捕获打开菜单的点击
    nextTick(() => {
      document.addEventListener('click', handleDocumentClick)
    })
    return () => document.removeEventListener('click', handleDocumentClick)
  }
})

// ==================== 搜索功能 ====================

/** 搜索 - 状态 */
const showSearchModal = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)

function formatDateForList(dateString: string) {
  return dayjs(dateString).format('MM.DD')
}

function formatDateDay(dateString: string) {
  return dayjs(dateString).format('DD')
}

/** 搜索 - 执行搜索 */
async function performSearch() {
  if (searchQuery.value.trim()) {
    isSearching.value = true

    try {
      const response = await articleSearch({ q: searchQuery.value })

      if (Array.isArray(response)) {
        searchResults.value = response.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || item.body,
          image: item.image,
          date: formatDateForList(item.publishDate || item.created),
          day: formatDateDay(item.publishDate || item.created),
        }))
      }
      else {
        searchResults.value = []
      }
    }
    catch (error) {
      console.error('搜索失败:', error)
      searchResults.value = []
    }
    finally {
      isSearching.value = false
    }
  }
  else {
    searchResults.value = []
  }
}

/** 搜索 - 处理新闻项点击 */
function handleNewsClick(newsItem: any) {
  // 根据新闻类型跳转到不同页面
  if (newsItem.type === 'article') {
    navigateTo(`/article/${newsItem.id}`)
  }
  else if (newsItem.type === 'news') {
    navigateTo(`/news/${newsItem.id}`)
  }
}

/** 搜索 - ESC 键关闭搜索窗口 */
watchEffect(() => {
  if (showSearchModal.value) {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        showSearchModal.value = false
      }
    }

    nextTick(() => {
      document.addEventListener('keydown', handleEscKey)
    })

    return () => document.removeEventListener('keydown', handleEscKey)
  }
})

// ==================== 其他功能 ====================

/** 返回首页 */
function goHome() {
  navigateTo('/')
}
</script>

<template>
  <div class="header">
    <div class="header__content">
      <div class="header__logo">
        <img class="logo" :src="logo" alt="logo" @click="goHome">
      </div>
      <div class="header__menu">
        <div v-for="item in menu" :key="item.title" class="header__menu__item">
          <NuxtLink :to="item.route" class="link">
            {{ item.title }}
          </NuxtLink>
          <div class="header__menu__item__child">
            <div v-for="child in item.child" :key="child.title" class="header__menu__item__child__item">
              <NuxtLink :to="child.route" class="child-link">
                {{ child.title }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧固定元素容器 -->
    <div class="header__right">
      <div class="header__msg" @click="toggleNotificationMenu">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8C18 4.67 15.31 2 12 2c-3.31 0-6 2.67-6 6v4l-3 3v2h18v-2l-3-3V8z" />
          <circle cx="12" cy="22" r="1" />
          <path d="M9.5 21h5" />
        </svg>
        <!-- 通知菜单下拉框 -->
        <Transition name="dropdown-fade">
          <div v-if="showNotificationMenu" class="notification-dropdown" @click.stop>
            <!-- 标题 -->
            <div class="notification-header">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8C18 4.67 15.31 2 12 2c-3.31 0-6 2.67-6 6v4l-3 3v2h18v-2l-3-3V8z" />
                <circle cx="12" cy="22" r="1" />
                <path d="M9.5 21h5" />
              </svg>
              公告通知
            </div>

            <!-- Tabs -->
            <div class="notification-tabs">
              <div
                v-for="tab in notificationTabs"
                :key="tab.key"
                class="notification-tab-item" :class="[{ active: activeNotificationTab === tab.key }]"
                @click="activeNotificationTab = tab.key"
              >
                <span class="tab-title">{{ tab.label }}</span>
                <span class="tab-count">({{ tab.count }})</span>
              </div>
            </div>

            <!-- 公告列表 -->
            <div class="notification-list">
              <div v-for="item in filteredNotifications" :key="item.id" class="notification-item">
                <div class="notification-item__title">
                  {{ item.title }}
                </div>
                <div class="notification-item__time">
                  {{ item.time }}
                </div>
              </div>
            </div>
            <!-- 更多按钮 -->
            <div class="notification-footer">
              <button class="notification-more-btn" @click="handleViewMoreNotifications">
                <span>查看更多</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <div class="header__search" @click="showSearchModal = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <div class="header__login">
        <svg class="login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span class="login-text">登录/注册</span>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <Transition name="modal-fade">
      <div v-if="showSearchModal" class="search-modal-overlay" @click="showSearchModal = false">
        <div class="search-modal" @click.stop>
          <!-- 关闭按钮 -->
          <button class="search-modal__close" @click="showSearchModal = false">
            ×
          </button>

          <!-- 搜索输入框 -->
          <div class="search-modal__input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input v-model="searchQuery" type="text" class="search-modal__input" placeholder="搜索新闻..." @input="performSearch">
          </div>

          <!-- 搜索结果列表 -->
          <div class="search-modal__results">
            <News v-if="searchResults.length > 0" :list="searchResults" :col="2" @click="handleNewsClick" />
            <div v-else class="search-modal__empty">
              {{ isSearching ? "搜索中..." : searchQuery ? "未找到相关新闻" : "请输入关键词搜索" }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 80px;
  display: flex;
  z-index: 1001;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  &__content {
    top: 0;
    left: 50%;
    width: 100%;
    height: 80px;
    display: flex;
    z-index: 1001;
    position: fixed;
    transform: translateX(-50%);
    align-items: center;
    background-color: #fff;
  }
  &__logo {
    overflow: hidden;
    margin-left: 160px;
    margin-right: 60px;
    .logo {
      cursor: pointer;
      height: 50px;
      object-fit: cover;
    }
  }
  &__menu {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    &__item {
      height: 100%;
      margin: 0 30px;
      display: flex;
      position: relative;
      align-items: center;
      .link {
        cursor: pointer;
        height: 100%;
        display: flex;
        position: relative;
        font-size: 20px;
        transition: all 0.3s ease;
        align-items: center;
        &:hover {
          color: $primary-color;
          font-weight: bold;
          &::after {
            width: 100%;
          }
        }
        &::after {
          left: 50%;
          width: 0;
          bottom: 0;
          height: 4px;
          content: '';
          position: absolute;
          transform: translateX(-50%);
          transition: width 0.3s ease;
          border-radius: 4px;
          background-color: $primary-color;
        }
      }
      &:hover &__child {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        visibility: visible;
      }
      &__child {
        top: 100%;
        left: 50%;
        width: 150%;
        opacity: 0;
        z-index: 100;
        position: absolute;
        transform: translateX(-50%) translateY(-10px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        visibility: hidden;
        background-color: #fff;
        &__item {
          width: 100%;
          display: flex;
          font-size: 20px;
          align-items: center;
          flex-direction: column;
          .child-link {
            width: 100%;
            cursor: pointer;
            margin: 5px 0;
            display: flex;
            padding: 5px 0;
            position: relative;
            font-size: 20px;
            transition: all 0.3s ease;
            align-items: center;
            justify-content: center;
            &:hover {
              color: #fff;
              background-color: $primary-color;
            }
          }
        }
      }
    }
  }
  &__right {
    gap: 30px;
    top: 0;
    right: 0;
    height: 80px;
    display: flex;
    z-index: 1002;
    position: fixed;
    align-items: center;
  }
  &__msg,
  &__search {
    width: 40px;
    cursor: pointer;
    height: 40px;
    display: flex;
    position: relative;
    transition: background-color 0.3s ease;
    align-items: center;
    border-radius: 50%;
    justify-content: center;
    &:hover {
      background-color: #f0f0f0;
    }
    .icon {
      color: #333;
      width: 22px;
      height: 22px;
    }
  }
  &__login {
    gap: 8px;
    cursor: pointer;
    height: 80px;
    display: flex;
    padding: 0 30px;
    transition: all 0.3s ease;
    align-items: center;
    background-color: $primary-color;
    &:hover {
      opacity: 0.9;
    }
    .login-icon {
      color: #fff;
      width: 24px;
      height: 24px;
    }
    .login-text {
      color: #fff;
      font-size: 16px;
    }
  }
}

/* 通知菜单样式 */
.notification-dropdown {
  top: 100%;
  left: 50%;
  width: 300px;
  display: flex;
  padding: 0;
  z-index: 1000;
  position: absolute;
  transform: translateX(-50%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  border-radius: 8px;
  flex-direction: column;
  background-color: #fff;

  .notification-header {
    gap: 5px;
    color: #333;
    display: flex;
    padding: 15px 15px 10px;
    font-size: 16px;
    align-items: center;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    .icon {
      color: #333;
      width: 20px;
      height: 20px;
    }
  }

  .notification-tabs {
    gap: 5px;
    margin: 0;
    display: flex;
    padding: 10px 15px;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;

    .notification-tab-item {
      gap: 3px;
      flex: 1;
      color: #666;
      cursor: pointer;
      display: inline-flex;
      padding: 5px 10px;
      font-size: 12px;
      transition: all 0.2s ease;
      align-items: center;
      border-radius: 6px;
      justify-content: center;

      &:hover {
        background-color: #f0f0f0;
      }

      &.active {
        color: $primary-color;
        font-weight: bold;
        background-color: #f0f0f0;
      }

      .tab-title {
        font-weight: bold;
      }

      .tab-count {
        color: #999;
        font-size: 11px;
      }

      &.active .tab-count {
        color: $primary-color;
      }
    }
  }

  .notification-list {
    gap: 0;
    display: flex;
    padding: 10px 0;
    max-height: 300px;
    overflow-y: auto;
    flex-direction: column;

    .notification-item {
      gap: 10px;
      cursor: pointer;
      display: flex;
      padding: 10px 15px;
      transition: background-color 0.2s ease;
      align-items: flex-start;
      border-bottom: 1px solid #f0f0f0;
      border-radius: 0;
      justify-content: space-between;
      background-color: transparent;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f9f9f9;
      }

      .notification-item__title {
        flex: 1;
        color: #333;
        font-size: 13px;
        font-weight: bold;
        line-height: 1.4;
      }

      .notification-item__time {
        color: #999;
        font-size: 11px;
        flex-shrink: 0;
        white-space: nowrap;
      }
    }
  }

  // 通知菜单页脚 - 查看更多按钮
  .notification-footer {
    display: flex;
    padding: 12px 15px;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02));
    border-top: 1px solid #eee;
    justify-content: center;

    .notification-more-btn {
      gap: 8px;
      color: $primary-color;
      border: none;
      cursor: pointer;
      display: flex;
      padding: 0;
      position: relative;
      font-size: 13px;
      transition: all 0.2s ease;
      align-items: center;
      font-weight: 600;
      background-color: transparent;

      &::after {
        left: 0;
        width: 0;
        bottom: -2px;
        height: 2px;
        content: '';
        position: absolute;
        transition: width 0.3s ease;
        background-color: $primary-color;
      }

      &:hover {
        opacity: 0.8;

        &::after {
          width: 100%;
        }

        .icon {
          transform: translateX(3px);
        }
      }

      .icon {
        color: $primary-color;
        width: 14px;
        height: 14px;
        transition: transform 0.3s ease;
      }
    }
  }
}

/* 下拉菜单过渡动画 */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 搜索弹窗样式 */
.search-modal-overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 2000;
  position: fixed;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.search-modal {
  width: 90%;
  display: flex;
  overflow: hidden;
  position: relative;
  max-width: 900px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: 85vh;
  border-radius: 12px;
  flex-direction: column;
  background-color: #fff;

  &__close {
    top: 15px;
    color: #999;
    right: 15px;
    width: 40px;
    border: none;
    cursor: pointer;
    height: 40px;
    display: flex;
    position: absolute;
    font-size: 28px;
    transition: color 0.2s ease;
    align-items: center;
    justify-content: center;
    background-color: transparent;

    &:hover {
      color: #333;
    }
  }

  &__input-wrapper {
    gap: 10px;
    display: flex;
    padding: 20px;
    align-items: center;
    border-bottom: 1px solid #eee;

    .search-icon {
      color: #999;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
  }

  &__input {
    flex: 1;
    color: #333;
    border: none;
    outline: none;
    font-size: 16px;
    font-family: inherit;

    &::placeholder {
      color: #ccc;
    }
  }

  &__results {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  &__empty {
    color: #999;
    height: 200px;
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: center;
  }
}

/* 搜索弹窗过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

.search-modal {
  will-change: opacity;
}
</style>
