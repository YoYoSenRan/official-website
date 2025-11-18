import { defineMock } from '@alova/mock'
import Mock from 'mockjs'

export default defineMock(
  {
    '/api/news/list': (options: any) => {
      // 解析请求参数
      const query = options.queryString || ''
      const params = new URLSearchParams(query)
      const page = Number.parseInt(params.get('page') || '1')
      const pageSize = Number.parseInt(params.get('pageSize') || '10')

      // 生成100条新闻数据
      const allNews = Mock.mock({
        'list|100': [
          {
            id: () => Mock.Random.guid(),
            date: '@date(\'yyyy.MM\')',
            day: '@integer(1, 28)',
            title: '@ctitle(10, 30)',
            description: '@csentence(20, 50)',
          },
        ],
      }).list

      // 分页处理
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedData = allNews.slice(start, end)

      // 返回分页结果
      return {
        data: paginatedData,
        list: paginatedData,
        total: 100,
        page,
        pageSize,
        totalPages: Math.ceil(100 / pageSize),
      }
    },

    '/api/history/list': (options: any) => {
      const { year } = JSON.parse(options.body || '{}')
      const data = Mock.mock({
        'list|2': [
          {
            id: () => Mock.Random.guid(),
            date: `${year}年@pick(["1月", "3月", "6月", "9月", "12月"])`,
            title: '@ctitle(4, 8)',
            desc: '@csentence(15, 30)',
          },
        ],
      })
      return data.list
    },
  },
  true,
)
