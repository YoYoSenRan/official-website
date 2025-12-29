/**
 * 认证状态管理 Store
 * 职责：管理登录状态和用户信息，使用 sessionStorage 持久化（仅客户端）
 *
 * 注意：sessionStorage 特性
 * - 关闭浏览器标签页后自动清除
 * - 仅在客户端可用，SSR 时需做兼容处理
 */
import { defineStore } from 'pinia'
import { clientPublicKey, login as loginApi } from '~/api'
import { sm2Encrypt } from '~/utils/crypto'

// 登录有效期：2 小时（毫秒）
const LOGIN_EXPIRES_IN = 2 * 60 * 60 * 1000

// sessionStorage 键名常量
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_INFO: 'auth_user_info',
  EXPIRES_AT: 'auth_expires_at', // 过期时间戳
} as const

// 用户信息类型定义
interface UserInfo {
  id: string
  username: string
  nickname?: string
}

// Store 状态类型定义
interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  refreshToken: string | null
}

/**
 * 安全读取 sessionStorage（兼容 SSR）
 */
function getStorageItem(key: string): string | null {
  if (import.meta.client) {
    return sessionStorage.getItem(key)
  }
  return null
}

/**
 * 安全写入 sessionStorage（兼容 SSR）
 */
function setStorageItem(key: string, value: string): void {
  if (import.meta.client) {
    sessionStorage.setItem(key, value)
  }
}

/**
 * 安全删除 sessionStorage（兼容 SSR）
 */
function removeStorageItem(key: string): void {
  if (import.meta.client) {
    sessionStorage.removeItem(key)
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    /**
     * 是否已登录
     * 检查 Token 存在且未过期
     */
    isLoggedIn(): boolean {
      const storedToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
      const expiresAt = getStorageItem(STORAGE_KEYS.EXPIRES_AT)

      // 检查是否过期
      if (expiresAt && Date.now() > Number(expiresAt)) {
        return false
      }

      return !!storedToken || !!this.user
    },
  },

  actions: {
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码（明文，会使用 SM2 加密）
     */
    async login(username: string, password: string): Promise<boolean> {
      try {
        // 获取服务端公钥
        const publicKeyResponse = await clientPublicKey()
        const publicKey = publicKeyResponse?.result || publicKeyResponse

        // 使用 SM2 加密密码（使用服务端返回的公钥）
        const encryptedPassword = sm2Encrypt(password, publicKey)

        // 调用登录接口
        const response = await loginApi({
          username,
          password: encryptedPassword,
        })

        // 判断登录是否成功
        if (response.status === 0 && response.result) {
          const { accessToken, refreshToken } = response.result

          // 保存 Token 到状态
          this.accessToken = accessToken
          this.refreshToken = refreshToken

          // 设置用户信息
          this.user = {
            id: username,
            username,
            nickname: username,
          }

          // 使用 sessionStorage 持久化 Token
          setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
          setStorageItem(STORAGE_KEYS.USER_INFO, JSON.stringify(this.user))

          // 存储过期时间戳（当前时间 + 2 小时）
          const expiresAt = Date.now() + LOGIN_EXPIRES_IN
          setStorageItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt))

          return true
        }

        console.error('登录失败:', response.message)
        return false
      }
      catch (error) {
        console.error('登录请求错误:', error)
        return false
      }
    },

    /**
     * 退出登录
     */
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null

      // 清除 sessionStorage
      removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
      removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
      removeStorageItem(STORAGE_KEYS.USER_INFO)
      removeStorageItem(STORAGE_KEYS.EXPIRES_AT)
    },

    /**
     * 检查并恢复登录状态（用于页面刷新后）
     * 如果登录已过期，自动清除登录信息
     */
    checkAuth() {
      const storedToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN)
      const storedUser = getStorageItem(STORAGE_KEYS.USER_INFO)
      const expiresAt = getStorageItem(STORAGE_KEYS.EXPIRES_AT)

      // 检查是否过期
      if (expiresAt && Date.now() > Number(expiresAt)) {
        // 登录已过期，清除所有认证信息
        this.logout()
        return
      }

      if (storedToken && !this.user) {
        // Token 存在但用户信息丢失，尝试恢复
        this.accessToken = storedToken
        this.refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN)

        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser)
          }
          catch {
            // JSON 解析失败，使用默认值
            this.user = {
              id: 'restored',
              username: 'user',
              nickname: 'user',
            }
          }
        }
        else {
          this.user = {
            id: 'restored',
            username: 'user',
            nickname: 'user',
          }
        }
      }
    },
  },
})
