import { Http } from '~/utils/http'

// ==================== 认证相关接口 ====================

/**
 * 登录接口响应类型
 */
export interface LoginResponse {
  status: number
  result: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    refreshExpiresIn: number
    refreshAuthExpiresIn: string
    sessionTimeout: number
    remembered: boolean
  }
  message: string | null
  exception: string | null
}

/**
 * 登录接口
 * @param data 登录参数（用户名和加密后的密码）
 * @returns 登录响应，包含 Token 信息
 */
export function login(data: { username: string; password: string }) {
  return Http.Post<LoginResponse>('/auth/jwt/login', data)
}

// ==================== 文章相关接口 ====================

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

/**
 * 查看企业文化文章
 * @param alias 集团公司（jituangongsi）四川公司（sichuanggongsi）泸定公司（ludinggongsi）
 */
export function corporateCulture(params: { alias: string }) {
  return Http.Get<any>('/article/corporateCulture', { params })
}

/**
 * 根据文章ID获取二级菜单列表
 * @param articleId - 文章ID
 * @returns 二级菜单列表
 */
export function secendMenuById(params: { articleId: string }) {
  return Http.Get<any>('/article/secendMenuById', { params })
}

/**
 * 公司简介
 * @param alias 别名参数
 * @returns 公司简介信息
 */
export function companyProfile(params: { alias: string }) {
  return Http.Get<any>('/article/companyProfile', { params })
}


export function clientPublicKey() {
  return Http.Get<any>('/env/client-public-key')
}