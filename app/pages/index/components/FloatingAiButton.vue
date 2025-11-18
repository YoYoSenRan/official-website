<template>
  <div class="ai-fab">
    <a :href="href" target="_blank" rel="noopener noreferrer" class="ai-fab__btn">
      <span class="ai-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="36" height="36">
          <circle cx="32" cy="32" r="30" fill="url(#g)" />
          <defs>
            <radialGradient id="g" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#e0f2fe" />
              <stop offset="60%" stop-color="#93c5fd" />
              <stop offset="100%" stop-color="#3b82f6" />
            </radialGradient>
          </defs>
          <rect x="16" y="20" width="32" height="26" rx="13" fill="#fff" />
          <circle cx="26" cy="33" r="6" fill="#0ea5e9" />
          <circle cx="38" cy="33" r="6" fill="#0ea5e9" />
          <rect x="24" y="41" width="16" height="3" rx="1.5" fill="#60a5fa" />
        </svg>
      </span>
      <span class="ai-fab__ai">AI</span>
      <span class="ai-fab__text">{{ label }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ href?: string; label?: string }>(), {
  href: "https://www.perplexity.ai/",
  label: "智能助理",
})
const { href, label } = props
</script>

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
  padding: 2px;
  padding-bottom: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  color: #108cf0;
  width: 68px;
  border-radius: 9999px;
  text-decoration: none;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
}
.ai-fab__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, #e0f2fe 0%, #93c5fd 60%, #3b82f6 100%);
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
    width: 60px;
    height: 260px;
    padding: 10px 6px;
  }
  .ai-fab__icon {
    width: 56px;
    height: 56px;
  }
  .ai-fab__text {
    font-size: 14px;
  }
}
</style>
