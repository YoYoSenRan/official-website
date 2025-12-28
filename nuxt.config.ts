import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    'v-gsap-nuxt',
    '@pinia/nuxt',
    'nuxt-echarts',
  ],

  echarts: {
    renderer: 'canvas',
    charts: ['LineChart'],
    components: ['GridComponent', 'TooltipComponent'],
  },

  css: ['~/assets/css/main.css'],

  // 配置不同环境的API地址
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://2444450wnth3.vicp.fun',
    },
  },
  ui: {
    fonts: false,
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/css/variables.scss" as *;
            @use "~/assets/css/mixins.scss" as *;
          `,
        },
      },
    },
  },

  pages: {
    pattern: ['**/*.vue', '!**/*.spec.*', '!components/**'],
  },

  postcss: {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 16, // 基准值：1rem = 16px
        propList: ['*'], // 哪些属性需要转换
        minPixelValue: 2, // 小于2px的值不转换（防止边框问题）
        mediaQuery: true, // 媒体查询里的px也转换
        selectorBlackList: [], // 哪些选择器不应用转换
      },
    },
  },

  components: {
    dirs: [
      {
        path: '~/components',
        extensions: ['.vue', '.ts'],
        pattern: '**/index.{vue,ts}',
        pathPrefix: false,
      },
    ],
  },

  // 配置 Nitro 服务器代理以解决开发环境跨域问题
  nitro: {
    // 开发环境代理配置
    devProxy: {
      '/api': {
        target: 'http://2444450wnth3.vicp.fun/api',
        changeOrigin: true,
        prependPath: true,
      },
    },
    // 生产环境代理配置 - 解决部署后的CORS问题
    routeRules: {
      '/api/**': {
        proxy: 'http://2444450wnth3.vicp.fun/api/**',
      },
      '/uploads/**': {
        proxy: 'http://2444450wnth3.vicp.fun/api/**',
      },
      // 动态路由设置为 SSR 模式（不预渲染，而是动态渲染）
      '/news/detail/**': {
        swr: 3600, // 一小时服务端缓存
      },
    },
    // 预渲染配置 - 用于 generate 命令
    prerender: {
      // 禁用自动链接爬取
      crawlLinks: false,
      // 只预渲染首页和不依赖 API 的页面
      routes: [
        '/', // 首页
      ],
      // 跳过需要 API 数据的页面（这些页面使用 SSR）
      ignore: ['/news', '/news/detail/**', '/gsgk', '/xwzx'],
    },
  },
})
