<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getProductionTotalData, getProductionTotalDataStat } from '~/api/production'
import dayjs from 'dayjs'

const now = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null
const labels = ref<string[]>([])
const series = ref<number[]>([])
const yAxisName = ref('')

const tabs = [
  { label: '日电量', type: 1 },
  { label: '月电量', type: 2 },
  { label: '年电量', type: 3 },
  { label: '实时负荷', type: 4 },
  { label: '水库水位', type: 5 },
  { label: '入库流量', type: 6 },
]
const currentTab = ref(1)

const metrics = ref({
  inboundTraffic: '0M',
  monthTotal: '0亿kWh',
  dayTotal: '0万kWh',
  reservoirWaterLevel: '0M',
  totalPower: '0MW',
  yearTotal: '0亿kWh',
  runData: '0',
})

function splitValueUnit(str: string) {
  if (!str)
    return { value: '-', unit: '' }
  // Avoid regex backtracking issue by using non-greedy or clearer separation
  // Simple approach: extract leading float number
  const floatVal = Number.parseFloat(str)
  if (Number.isNaN(floatVal))
    return { value: str, unit: '' }
  const value = String(floatVal)
  const unit = str.substring(value.length).trim()
  return { value, unit }
}

const parsedMetrics = computed(() => {
  const m = metrics.value
  return {
    inboundTraffic: splitValueUnit(m.inboundTraffic),
    monthTotal: splitValueUnit(m.monthTotal),
    dayTotal: splitValueUnit(m.dayTotal),
    reservoirWaterLevel: splitValueUnit(m.reservoirWaterLevel),
    totalPower: splitValueUnit(m.totalPower),
    yearTotal: splitValueUnit(m.yearTotal),
    runData: splitValueUnit(m.runData),
  }
})

async function handleTabChange(type: number) {
  if (currentTab.value === type)
    return
  currentTab.value = type
  await fetchChartData(type)
}

async function fetchChartData(type: number) {
  try {
    const res = await getProductionTotalDataStat({ dataType: type })
    if (res) {
      labels.value = (res.data || []).map((p: any) => p.label)
      series.value = (res.data || []).map((p: any) => Number(p.value))
      yAxisName.value = res.yAxisName
    }
  }
  catch (e) {
    console.error('Failed to fetch chart data:', e)
  }
}

async function fetchMetrics() {
  try {
    const res = await getProductionTotalData()
    if (res) {
      metrics.value = res
    }
  }
  catch (e) {
    console.error('Failed to fetch metrics:', e)
  }
}

const option = computed(() => ({
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: labels.value,
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280' },
  },
  yAxis: {
    type: 'value',
    name: yAxisName.value,
    axisLine: { show: true, lineStyle: { color: '#d8d8d8' } },
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLabel: { color: '#6b7280' },
  },
  tooltip: { trigger: 'axis' },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 3, color: '#108cf0' },
      data: series.value,
    },
  ],
}))

function updateCurrentTime() {
  now.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)

  fetchChartData(currentTab.value)
  fetchMetrics()
})

onBeforeUnmount(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
})
</script>

<template>
  <div class="generate">
    <div class="generate__layout">
      <div class="generate__top" data-aos="fade-up">
        <div class="generate__top-left">
          <div class="generate__title-group">
            <p class="generate__title-en">
              Generate Data
            </p>
            <h2 class="generate__title-cn">
              生产数据
            </h2>
          </div>
        </div>
      </div>
      <div class="generate__body" data-aos="fade-up" data-aos-delay="200">
        <div class="generate__body-left">
          <div class="generate__tabs">
            <button
              v-for="tab in tabs"
              :key="tab.type"
              class="generate__tab"
              :class="{ 'is-active': currentTab === tab.type }"
              @click="handleTabChange(tab.type)"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="generate__chart">
            <ClientOnly>
              <VChart :option="option" autoresize class="generate__chart-canvas" />
            </ClientOnly>
          </div>
        </div>
        <div class="generate__body-right">
          <div class="generate__metric-group">
            <div class="generate__metric-label">
              安全运行:
            </div>
            <div class="generate__metric-status">
              <div class="generate__safe-days">
                {{ parsedMetrics.runData.value }}
              </div>
              <div class="generate__timestamp">
                {{ now }}
              </div>
            </div>
          </div>
          <!-- 指标数据采用分组网格布局，以满足列间距与垂直间距要求 -->
          <div class="generate__metric-rows">
            <div class="generate__metric-row generate__metric-row--three">
              <div class="generate__metric">
                <div class="generate__metric-value">
                  <span class="generate__metric-number">
                    {{ parsedMetrics.inboundTraffic.value }}
                  </span>
                  <span class="generate__metric-unit">
                    {{ parsedMetrics.inboundTraffic.unit }}
                  </span>
                </div>
                <div class="generate__metric-sub">
                  入库流量
                </div>
              </div>
              <div class="generate__metric">
                <div class="generate__metric-value">
                  <span class="generate__metric-number">
                    {{ parsedMetrics.totalPower.value }}
                  </span>
                  <span class="generate__metric-unit">
                    {{ parsedMetrics.totalPower.unit }}
                  </span>
                </div>
                <div class="generate__metric-sub">
                  总有功
                </div>
              </div>
              <div class="generate__metric">
                <div class="generate__metric-value">
                  <span class="generate__metric-number">
                    {{ parsedMetrics.reservoirWaterLevel.value }}
                  </span>
                  <span class="generate__metric-unit">
                    {{ parsedMetrics.reservoirWaterLevel.unit }}
                  </span>
                </div>
                <div class="generate__metric-sub">
                  水库水位
                </div>
              </div>
            </div>
            <div class="generate__metric-row generate__metric-row--three">
              <div class="generate__metric">
                <div class="generate__metric-value">
                  <span class="generate__metric-number">
                    {{ parsedMetrics.yearTotal.value }}
                  </span>
                  <span class="generate__metric-unit">
                    {{ parsedMetrics.yearTotal.unit }}
                  </span>
                </div>
                <div class="generate__metric-sub">
                  年累
                </div>
              </div>
              <div class="generate__metric">
                <div class="generate__metric-value">
                  <span class="generate__metric-number">
                    {{ parsedMetrics.monthTotal.value }}
                  </span>
                  <span class="generate__metric-unit">
                    {{ parsedMetrics.monthTotal.unit }}
                  </span>
                </div>
                <div class="generate__metric-sub">
                  月累
                </div>
              </div>
              <div class="generate__metric">
                <div class="generate__metric-value">
                  <span class="generate__metric-number">
                    {{ parsedMetrics.dayTotal.value }}
                  </span>
                  <span class="generate__metric-unit">
                    {{ parsedMetrics.dayTotal.unit }}
                  </span>
                </div>
                <div class="generate__metric-sub">
                  日累
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.generate {
  width: 100%;
  height: 480px;
  display: flex;
  background: #efefef url('~/assets/images/yzj.png') no-repeat center / cover;
  padding-bottom: 45px;

  &__layout {
    gap: 20px;
    width: 100%;
    display: flex;
    padding: 40px 160px;
    overflow: hidden;
    flex-direction: column;
  }

  &__top {
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
    font-size: 27px;
    font-weight: bold;
    line-height: 1.2;
    margin-bottom: 13px;
  }

  &__title-cn {
    color: #1f2937;
    font-size: 32px;
    font-weight: bold;
    line-height: 1.2;
  }

  &__timestamp {
    color: #9ca3af;
  }

  &__body {
    gap: 40px;
    height: 427px;
    display: flex;
    align-items: stretch;
  }

  &__body-left {
    width: 600px;
    height: 100%;
  }

  &__tabs {
    gap: 10px;
    display: flex;
    margin-bottom: 10px;
  }

  &__tab {
    color: #128cf0;
    border: 1px solid #128cf0;
    cursor: pointer;
    height: 32px; /* Slightly taller */
    display: inline-flex;
    padding: 0 16px; /* More padding */
    font-size: 14px; /* Slightly smaller font for cleaner look */
    background: #ffffff;
    box-sizing: border-box;
    align-items: center;
    border-radius: 20px; /* Pill shape */
    transition: all 0.3s ease; /* Smooth transition */
    font-weight: 500;
    justify-content: center;

    &--active,
    &.is-active,
    &.active,
    &:hover {
      color: #ffffff;
      background: #128cf0;
      box-shadow: 0 4px 6px rgba(18, 140, 240, 0.2); /* Shadow on active/hover */
      border-color: #128cf0;
    }
  }

  &__chart {
    width: 100%;
    height: calc(100% - 44px);
    overflow: hidden;

    &-canvas {
      width: 100%;
      height: 100%;
    }
  }

  &__body-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__metric-group {
    gap: 10px;
    display: flex;
    align-items: flex-start;
    margin-bottom: 18px;
    flex-direction: column;
  }

  &__metric-label {
    color: #6b7280;
  }

  /* 指标区域采用网格布局，控制列间距和垂直间距 */
  &__metric-rows {
    display: grid;
    row-gap: 12px;
  }

  &__metric-row {
    width: 100%;
    display: grid;

    &--two {
      column-gap: 18px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &--three {
      column-gap: 12px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__metric {
    /* 指标格子上下排布并居中，形成独立白色卡片 */
    gap: 6px;
    display: flex;
    padding: 12px 8px;
    background: #ffffff;
    min-height: 86px;
    text-align: center;
    align-items: center;
    border-radius: 8px; /* Rounded corners */
    transition: all 0.3s ease; /* Smooth hover */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow */
    flex-direction: column;
    justify-content: center;

    &:hover {
      transform: translateY(-3px); /* Lift effect */
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Deeper shadow */
    }
  }

  &__metric-value {
    gap: 4px;
    display: flex;
    align-items: flex-end;
  }

  &__metric-number {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
  }

  &__metric-unit {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4;
  }

  &__metric-sub {
    color: #6b7280;
    font-size: 16px;
  }

  &__metric-status {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__safe-days {
    font-size: 36px;
    font-weight: 700;
  }
}
</style>
