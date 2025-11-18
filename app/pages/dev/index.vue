<script setup lang="ts"></script>

<template>
  <div class="dev-container">
    <div class="dev-card">
      <h1 class="dev-title-cn">
        正在开发
      </h1>
      <p class="dev-title-en">
        Under Development
      </p>
      <p class="dev-desc">
        该页面正在建设中，敬请期待。
      </p>
      <a href="/" class="dev-back">返回首页</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dev-container {
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: center;
}
.dev-card {
  border: 1px solid #e5e7eb;
  padding: 40px 60px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  border-radius: 12px;
}
.dev-title-cn {
  color: #1f2937;
  margin: 0;
  font-size: 32px;
  font-weight: 800;
}
.dev-title-en {
  color: #9ca3af;
  margin: 8px 0 16px 0;
  font-size: 20px;
  font-weight: 600;
}
.dev-desc {
  color: #6b7280;
  margin: 0 0 24px 0;
  font-size: 16px;
}
.dev-back {
  color: #fff;
  display: inline-block;
  padding: 10px 16px;
  background: #108cf0;
  border-radius: 8px;
  text-decoration: none;
}
</style>
