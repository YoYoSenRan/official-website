<template>
  <div class="dev-container">
    <div class="dev-card">
      <h1 class="dev-title-cn">正在开发</h1>
      <p class="dev-title-en">Under Development</p>
      <p class="dev-desc">该页面正在建设中，敬请期待。</p>
      <a href="/" class="dev-back">返回首页</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.dev-container {
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.dev-card {
  text-align: center;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}
.dev-title-cn {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
}
.dev-title-en {
  margin: 8px 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #9ca3af;
}
.dev-desc {
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #6b7280;
}
.dev-back {
  display: inline-block;
  padding: 10px 16px;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  background: #108cf0;
}
</style>