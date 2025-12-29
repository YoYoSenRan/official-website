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
        <UFormField label="用户名" name="username" class="w-full">
          <UInput
            v-model="form.username"
            placeholder="请输入用户名"
            icon="i-lucide-user"
            size="lg"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>

        <!-- 密码 -->
        <UFormField label="密码" name="password" class="w-full">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>

        <!-- 错误信息 -->
        <Transition name="fade">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </Transition>

        <!-- 登录按钮 -->
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="isLoading"
          class="login-button"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </UButton>
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
  gap: 20px;
  display: flex;
  flex-direction: column;

  :deep(.field) {
    width: 100%;

    .label {
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
    }
  }

  :deep(input) {
    width: 100%;
  }
}

.error-message {
  color: #ef4444;
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 8px;
  background-color: rgba(239, 68, 68, 0.1);
}

.login-button {
  height: 48px;
  font-size: 16px;
  margin-top: 8px;
  font-weight: 600;
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
