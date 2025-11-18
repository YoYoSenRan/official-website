import { defineStore } from 'pinia'
import { headerMuneList } from '~/api'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    news: [] as any[],
  }),

  getters: {},

  actions: {
    init() {
      this.fetchNewsList()
    },

    async fetchNewsList(params?: any) {
      this.news = await headerMuneList({ alias: 'xinwenzhongxin', ...params })
    },
  },
})
