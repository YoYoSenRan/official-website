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
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  position: fixed;
}
.ai-fab__btn {
  gap: 6px;
  color: #108cf0;
  display: inline-flex;
  padding: 4px;
  position: relative;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  align-items: center;
  border-radius: 9999px;
  flex-direction: column;
  padding-bottom: 12px;
  justify-content: flex-start;
  text-decoration: none;
}
.ai-fab__icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  border-radius: 50%;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.ai-fab__text {
  color: transparent;
  display: inline-block;
  font-size: 16px;
  background: linear-gradient(180deg, #0b8ee0 5%, #0b8ee0 45%, #14d6b5 100%);
  margin-top: 0;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  writing-mode: vertical-rl;
  letter-spacing: 6px;
  background-clip: text;
  text-orientation: upright;
  -webkit-background-clip: text;
}
.ai-fab__ai {
  color: #0b8ee0;
  direction: ltr;
  font-weight: 800;
  white-space: nowrap;
  writing-mode: horizontal-tb;
  margin-bottom: -6px;
  text-orientation: initial;
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
