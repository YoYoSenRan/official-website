import { Http } from '~/utils/http'

/**
 * 首页轮播图文章列表
 * @returns 轮播图数据列表
 */
export function rotatingBanner(params?: any) {
  return Http.Get<any>('/article/rotatingBanner', { params })
}

/**
 * 根据上级菜单别名查询子菜单列表
 * @returns 菜单列表
 */
export function headerMuneList(params?: any) {
  return Http.Get<any>('/article/headerMuneList', { params })
}

/**
 * 根据上级菜单id查询文章分页列表
 * @returns 文章分页列表
 */
export function headerArticlePageList(params?: any) {
  return Http.Get<any>('/article/headerArticlePageList', { params })
}

/**
 * 文章详情接口
 * @returns 文章详情接口
 */
export function articleDetail(id: string) {
  return Http.Get<any>(`/article/${id}`)
}

/**
 * 首页区块内容
 * @returns 首页区块内容
 */
export function blockItem(params?: any) {
  return Http.Get<any>('/block-item', { params })
}

/**
 * 首页底部链接列表
 * @returns 首页底部链接列表
 */
export function articlePageListByAlias(params?: any) {
  return Http.Get<any>('/article/articlePageListByAlias', { params })
}

/**
 * 文章搜索
 * @returns 文章搜索
 */
export function articleSearch(params?: any) {
  return Http.Get<any>('/article/es', { params })
}

/**
 * 发展历程
 * @returns 发展历程
 */
export function developmentHistory(params?: any) {
  return Http.Get<any>('/article/developmentHistory', { params })
}
