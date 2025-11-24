import { Http } from '~/utils/http'

/**
 * 生产数据统计（折线图）
 * @param params { dataType: number } 1-日电量 2-月 3-年 4-实时负荷 5-水库水位 6-入库流量
 */
export function getProductionTotalDataStat(params: { dataType: number }) {
  return Http.Get<any>('/production/totalDataStat', { params })
}

/**
 * 生产数据统计 (指标)
 */
export function getProductionTotalData() {
  return Http.Get<any>('/production/totalData')
}
