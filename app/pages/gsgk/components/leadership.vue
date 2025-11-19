<script setup lang="ts">
import ldbz from '~/assets/images/ldbz.png'
// 此组件无需任何逻辑
// 只需设置 data-anchor 属性，useAnchorNavigation 会自动找到这个元素
</script>

<template>
  <section class="section section-ldbz" data-anchor="ldbz">
    <div class="section__container">
      <div class="section__header">
        <div class="section__title-group">
          <p class="section__title-en">
            Leadership Team
          </p>
          <h2 class="section__title-cn">
            领导班子
          </h2>
        </div>
      </div>
      <div class="section__content">
        <img :src="ldbz" alt="领导班子">
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 领导班子区块样式 */
.section {
  width: 100%;
  display: flex;
  padding: 80px 200px;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  scroll-margin-top: 60px;

  &__container {
    gap: 32px;
    width: 100%;
    display: flex;
    max-width: 1200px;
    flex-direction: column;
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
    font-weight: bold;
    line-height: 1.2;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  &__title-cn {
    color: #333;
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: bold;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: auto;
      display: block;
      max-width: 100%;
    }
  }
}

/* 响应式设计 */
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
