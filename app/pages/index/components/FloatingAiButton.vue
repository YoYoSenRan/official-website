<script setup lang="ts">
import aiIcon from '~/assets/images/ai.png'

const props = withDefaults(defineProps<{ href?: string, label?: string }>(), {
  href: 'https://www.perplexity.ai/',
  label: '智能助理',
})
const { href, label } = props
</script>

<template>
  <div class="ai-fab">
    <a :href="href" target="_blank" rel="noopener noreferrer" class="ai-fab__btn">
      <span class="ai-fab__icon" aria-hidden="true">
        <img :src="aiIcon" alt="AI 助理">
      </span>
      <span class="ai-fab__ai">AI</span>
      <span class="ai-fab__text">{{ label }}</span>
    </a>
  </div>
</template>

<style scoped lang="scss">
.ai-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
}
.ai-fab__btn {
  position: relative;
  gap: 6px;
  padding: 4px;
  padding-bottom: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  color: #108cf0;
  border-radius: 9999px;
  text-decoration: none;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
}
.ai-fab__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.ai-fab__text {
  margin-top: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 6px;
  line-height: 1;
  writing-mode: vertical-rl;
  text-orientation: upright;
  white-space: nowrap;
  display: inline-block;
  background: linear-gradient(180deg, #0b8ee0 5%, #0b8ee0 45%, #14d6b5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ai-fab__ai {
  writing-mode: horizontal-tb;
  text-orientation: initial;
  white-space: nowrap;
  direction: ltr;
  color: #0b8ee0;
  font-weight: 800;
  margin-bottom: -6px;
}
@media (max-width: 768px) {
  .ai-fab {
    right: 10px;
    bottom: 16px;
  }
  .ai-fab__btn {
    width: 80px;
    padding: 10px 6px 26px;
  }
  .ai-fab__icon {
    width: 70px;
    height: 70px;
  }
  .ai-fab__text {
    font-size: 14px;
  }
}
</style>
