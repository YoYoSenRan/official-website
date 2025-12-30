/**
 * 认证中间件调试版本
 * 添加详细日志来诊断登录状态丢失的问题
 */
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to) => {
  console.log('🔍 [Auth Middleware] 开始执行', {
    path: to.path,
    isServer: import.meta.server,
    isClient: import.meta.client,
  })

  // 白名单：登录页面无需验证
  const publicPages = ['/login']
  const isPublicPage = publicPages.some(page => to.path.startsWith(page))

  if (isPublicPage) {
    console.log('✅ [Auth Middleware] 公开页面，跳过检查')
    return
  }

  // SSR 阶段跳过认证检查（sessionStorage 仅客户端可用）
  if (import.meta.server) {
    console.log('⏭️ [Auth Middleware] 服务端渲染，跳过检查')
    return
  }

  // 客户端检查 sessionStorage
  console.log('📦 [Auth Middleware] sessionStorage 内容:', {
    accessToken: sessionStorage.getItem('auth_access_token')?.substring(0, 20) + '...',
    hasRefreshToken: !!sessionStorage.getItem('auth_refresh_token'),
    hasUserInfo: !!sessionStorage.getItem('auth_user_info'),
    expiresAt: sessionStorage.getItem('auth_expires_at'),
    isExpired: sessionStorage.getItem('auth_expires_at')
      ? Date.now() > Number(sessionStorage.getItem('auth_expires_at'))
      : 'N/A',
  })

  // 获取认证状态
  const authStore = useAuthStore()

  console.log('🏪 [Auth Middleware] Store 状态（调用 checkAuth 前）:', {
    hasUser: !!authStore.user,
    hasAccessToken: !!authStore.accessToken,
    user: authStore.user,
  })

  // 检查并恢复登录状态（从 sessionStorage）
  authStore.checkAuth()

  console.log('🏪 [Auth Middleware] Store 状态（调用 checkAuth 后）:', {
    hasUser: !!authStore.user,
    hasAccessToken: !!authStore.accessToken,
    user: authStore.user,
    isLoggedIn: authStore.isLoggedIn,
  })

  // 验证登录状态
  if (!authStore.isLoggedIn) {
    console.warn('⚠️ [Auth Middleware] 未登录，重定向到登录页')
    // 未登录,重定向到登录页面，并记录原目标路径
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  console.log('✅ [Auth Middleware] 已登录，允许访问')
})
