/**
 * 全局认证中间件
 * 职责：拦截所有路由访问，未登录用户重定向到登录页面
 *
 * 文件名以 .global.ts 结尾，Nuxt 会自动将其注册为全局中间件
 *
 * 注意：由于使用 sessionStorage 存储认证信息（仅客户端可用），
 * 此中间件只在客户端执行认证检查
 */
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to) => {
  // 白名单：登录页面无需验证
  const publicPages = ['/login']
  const isPublicPage = publicPages.some(page => to.path.startsWith(page))

  if (isPublicPage) {
    return
  }

  // SSR 阶段跳过认证检查（sessionStorage 仅客户端可用）
  if (import.meta.server) {
    return
  }

  // 获取认证状态
  const authStore = useAuthStore()

  // 检查并恢复登录状态（从 sessionStorage）
  authStore.checkAuth()

  // 验证登录状态
  if (!authStore.isLoggedIn) {
    // 未登录，重定向到登录页面，并记录原目标路径
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
