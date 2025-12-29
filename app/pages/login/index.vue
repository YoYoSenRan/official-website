<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

// 页面元信息
definePageMeta({
  layout: 'others',
})

// 认证 Store
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// 表单数据
const form = reactive({
  username: '',
  password: '',
})

// 加载状态
const isLoading = ref(false)

// 错误信息
const errorMessage = ref('')

/**
 * 处理登录
 */
async function handleLogin() {
  // 验证表单
  if (!form.username.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  if (!form.password.trim()) {
    errorMessage.value = '请输入密码'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const success = await authStore.login(form.username, form.password)

    if (success) {
      // 登录成功，跳转到原目标页面或首页
      const redirectTo = (route.query.redirect as string) || '/'
      router.push(redirectTo)
    }
    else {
      errorMessage.value = '登录失败，请重试'
    }
  }
  catch (error) {
    console.error('登录错误:', error)
    errorMessage.value = '登录失败，请稍后重试'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 标题 -->
      <div class="login-header">
        <h1 class="login-title">
          欢迎登录
        </h1>
        <p class="login-subtitle">
          请输入您的账号信息
        </p>
      </div>

      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 用户名 -->
        <div class="form-field">
          <label for="username" class="form-label">用户名</label>
          <div class="input-wrapper">
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              class="form-input"
              :disabled="isLoading"
            >
          </div>
        </div>

        <!-- 密码 -->
        <div class="form-field">
          <label for="password" class="form-label">密码</label>
          <div class="input-wrapper">
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              class="form-input"
              :disabled="isLoading"
            >
          </div>
        </div>

        <!-- 错误信息 -->
        <transition name="fade">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </transition>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
          :class="{ 'is-loading': isLoading }"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  align-items: center;
  justify-content: center;
  position: relative;

  // 背景装饰
  &::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    opacity: 0.1;
    z-index: 0;
    position: absolute;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}

.login-card {
  width: 100%;
  padding: 48px 40px;
  z-index: 1;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  background-color: #fff;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-title {
    color: #1f2937;
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
  }

  .login-subtitle {
    color: #6b7280;
    margin: 0;
    font-size: 14px;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 表单字段
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .form-label {
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }
}

// 输入框包装器
.input-wrapper {
  position: relative;
}

// 输入框样式
.form-input {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  font-size: 15px;
  color: #1f2937;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fff;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

// 错误信息
.error-message {
  color: #ef4444;
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 8px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

// 登录按钮
.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.is-loading {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 20px;
      width: 16px;
      height: 16px;
      margin-top: -8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }
}

// 旋转动画
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
