<script setup lang="ts">
import zzjg from '~/assets/images/zzjg.png'

// 此组件无需任何逻辑
// 只需设置 data-anchor 属性，useAnchorNavigation 会自动找到这个元素
</script>

<template>
  <section class="section section-zzjg" data-anchor="zzjg">
    <div class="section__container">
      <div class="section__header">
        <div class="section__title-group">
          <p class="section__title-en">
            Organizational Structure
          </p>
          <h2 class="section__title-cn">
            组织机构
          </h2>
        </div>
      </div>
      <div class="section__content">
        <img :src="zzjg" alt="组织机构图">
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 组织机构区块样式 */
.section {
  width: 100%;
  padding: 80px 200px;
  scroll-margin-top: 60px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  &__container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title-group {
    display: flex;
    flex-direction: column;
  }

  &__title-en {
    color: #d8d8d8;
    font-size: 24px;
    line-height: 1.2;
    font-weight: bold;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  &__title-cn {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 24px;
    font-weight: bold;
  }

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
  }
}

@media (max-width: 1024px) {
  .section {
    padding: 60px 40px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 40px 20px;

    &__title-en {
      font-size: 20px;
    }

    &__title-cn {
      font-size: 26px;
    }
  }
}
</style>
