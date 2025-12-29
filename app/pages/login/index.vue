<template>
  <div class="login-page">
    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">
          欢迎登录
        </h1>
        <p class="login-subtitle">
          请输入您的账号信息
        </p>
      </header>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-field">
          <label for="username" class="form-label">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            class="form-input"
            autocomplete="username"
            :disabled="isLoading"
          >
        </div>

        <div class="form-field">
          <label for="password" class="form-label">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
            autocomplete="current-password"
            :disabled="isLoading"
          >
        </div>

        <p v-show="errorMessage" class="error-message" role="alert" aria-live="polite">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
          :class="{ 'is-loading': isLoading }"
        >
          <span class="login-button__text">
            {{ isLoading ? '登录中...' : '登录' }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

defineOptions({
  name: 'login-page',
})

// 页面元信息
definePageMeta({
  layout: false,
})

// 依赖注入
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

<style lang="scss">
.login-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #1f2937;
  background: linear-gradient(160deg, #f5f7ff 0%, #eef2ff 45%, #f8f5ff 100%);
  overflow: auto;

  .login-card {
    width: min(100%, 420px);
    padding: 40px 36px;
    background-color: #fff;
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.7);
    box-shadow: 0 22px 50px -30px rgba(17, 24, 39, 0.45);
  }

  .login-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .login-title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
  }

  .login-subtitle {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    height: 48px;
    padding: 12px 14px;
    font-size: 15px;
    color: #1f2937;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
      background-color: #fff;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .error-message {
    margin: 0;
    padding: 12px 14px;
    font-size: 14px;
    color: #b91c1c;
    background-color: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
  }

  .login-button {
    position: relative;
    height: 48px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #667eea 0%, #6b5bd6 50%, #764ba2 100%);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    box-shadow: 0 12px 24px -14px rgba(76, 81, 191, 0.7);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 16px 28px -16px rgba(76, 81, 191, 0.8);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &.is-loading::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 18px;
      width: 16px;
      height: 16px;
      margin-top: -8px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: login-spin 0.6s linear infinite;
    }
  }

  .login-button__text {
    display: inline-block;
  }

  @keyframes login-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    padding: 32px 16px;

    .login-card {
      padding: 32px 22px;
      border-radius: 14px;
    }

    .login-title {
      font-size: 24px;
    }
  }
}
</style>
