<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, PropType, Ref, ref, watch } from 'vue'
import { Ticker } from 'src/models/Ticker'
import {
  createChart,
  CrosshairMode,
  IChartApi,
  UTCTimestamp,
  ISeriesApi,
  IPriceLine,
  LineStyle
} from 'lightweight-charts'
import { dayjs } from 'src/boot/day'
import { RestClient, WebsocketClient } from 'okx-api'
import { getFormattedBigNumber } from 'src/utils/formatter'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let wsClient
const pivotLines: Array<IPriceLine | undefined> = []
const orderLines: Array<IPriceLine | undefined> = []

const props = defineProps({
  ticker: {
    type: Object as PropType<Ticker>,
    required: true
  },
  interval: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isMainChart: {
    type: Boolean,
    default: false
  }
})

const timeFormat = computed(() => {
  if (chartInterval.value === '5m' || chartInterval.value === '15m') {
    return 'HH:mm'
  }
  if (chartInterval.value === '30m' || chartInterval.value === '1H' || chartInterval.value === '4H') {
    return 'DD.MM.YY'
  }
  return 'DD.MM.YY'
})
const fullScreenerMode = ref(false)
const showPivots = ref(true)
const showOrders = ref(false)
const ordersRange = ref(1_000_000)
const chartInterval = ref('')
const chart: Ref<IChartApi | null> = ref(null)
const candleSeries: Ref<ISeriesApi<'Candlestick'> | null> = ref(null)
const volumeSeries: Ref<ISeriesApi<'Histogram'> | null> = ref(null)
const chartIntervalOptions = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W']

const createMiniChart = async () => {
  const element = document.getElementById(`mini-chart${props.index}`)
  if (!element) return null

  chart.value = createChart(element, {
    width: element.offsetWidth,
    height: element.offsetHeight,
    layout: {
      backgroundColor: 'transparent',
      textColor: 'rgba(255, 255, 255, 0.9)'
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: {
        visible: true,
        labelVisible: false
      },
      horzLine: {
        visible: true
      }
    },
    grid: {
      vertLines: {
        color: '#1e222d'
      },
      horzLines: {
        color: '#1e222d'
      }
    },
    rightPriceScale: {
      visible: true
    },
    timeScale: {
      visible: true,
      tickMarkFormatter: (time: UTCTimestamp) => {
        return dayjs(time).format(timeFormat.value)
      }
    },
    localization: {
      locale: 'en',
      priceFormatter: function (price: number) {
        return parseFloat(price.toString()).toFixed(props.ticker?.price.toString().split('.')[1]?.length)
      },
      timeFormatter: function (time: UTCTimestamp) {
        return dayjs(time).format(timeFormat.value)
      },
      dateFormat: 'DD.MM.YYYY'
    }
  })
  candleSeries.value = chart.value.addCandlestickSeries({
    upColor: '#0ecb81',
    downColor: '#f6465d',
    borderDownColor: '#f6465d',
    borderUpColor: '#0ecb81',
    wickDownColor: '#f6465d',
    wickUpColor: '#0ecb81'
  })
  volumeSeries.value = chart.value.addHistogramSeries({
    color: '#26a69a',
    priceFormat: {
      formatter: function () { return '' }
    },
    title: '',
    lastValueVisible: false,
    priceScaleId: '',
    scaleMargins: {
      top: 0.95,
      bottom: 0
    }
  })
}

const getCandles = async () => {
  const restClient = new RestClient()
  const result = await restClient.getCandles(props.ticker?.symbol, chartInterval.value, { limit: '1000' })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const candleData = []
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const volumeData = []

  result.forEach(item => {
    const candle = {
      time: parseInt(item[0]), open: parseFloat(item[1]), high: parseFloat(item[2]), low: parseFloat(item[3]), close: parseFloat(item[4])
    }
    const vol = {
      time: parseInt(item[0]), value: parseFloat(item[7]), color: 'rgba(0, 150, 136, 0.2)'
    }
    candleData.push(candle)
    volumeData.push(vol)
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  candleData.reverse()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  volumeData.reverse()

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    candleData,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    volumeData
  }
}

const candleStream = () => {
  let channel = ''
  if (chartInterval.value === '5m') channel = 'candle5m'
  if (chartInterval.value === '1m') channel = 'candle1m'
  if (chartInterval.value === '15m') channel = 'candle15m'
  if (chartInterval.value === '30m') channel = 'candle30m'
  if (chartInterval.value === '1H') channel = 'candle1H'
  if (chartInterval.value === '4H') channel = 'candle4H'
  if (chartInterval.value === '1D') channel = 'candle1D'
  if (chartInterval.value === '1W') channel = 'candle1W'
  wsClient = new WebsocketClient({ market: 'prod' })
  wsClient.subscribe({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    channel,
    instId: props.ticker.symbol
  })

  wsClient.on('update', (event) => {
    setTimeout(() => {
      const eventData = event.data[0] || []
      const candle = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        time: parseInt(eventData[0]), open: eventData[1], high: eventData[2], low: eventData[3], close: eventData[4]
      }

      const volume = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        time: parseInt(eventData[0]), value: eventData[7], color: 'rgba(0, 150, 136, 0.2)'
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      candleSeries.value?.update(candle)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      volumeSeries.value?.update(volume)
    })
  })
}

const setChartCandlesData = async () => {
  const klines = await getCandles()
  const candles = klines ? klines.candleData : []
  const volumes = klines ? klines.volumeData : []
  candles.pop()
  volumes.pop()
  if (candleSeries.value && volumeSeries.value) {
    candleSeries.value?.setData(candles)
    volumeSeries.value?.setData(volumes)
    candleStream()
  }
}

const setChartInterval = async (interval: string) => {
  chartInterval.value = interval
  chart.value?.remove()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (wsClient) {
    wsClient.closeAll()
  }
  await createMiniChart()
  await setChartCandlesData()
}

const createOrderLines = async () => {
  setInterval(async () => {
    const { asks, bids } = await getOrders()

    if (asks?.length && bids?.length) {
      orderLines.forEach(line => {
        if (line) candleSeries.value?.removePriceLine(line)
      })

      if (!showOrders.value) return

      asks.forEach(i => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const sum = i[0] * i[1]
        if (sum >= ordersRange.value) {
          const priceLine = candleSeries.value?.createPriceLine({
            lineVisible: true,
            price: parseFloat(i[0]),
            color: parseFloat(i[0]) > props.ticker?.price ? '#f4465d' : '#2862ff',
            lineWidth: 1,
            axisLabelVisible: true,
            lineStyle: LineStyle.Solid,
            title: getFormattedBigNumber(sum)
          })
          orderLines.push(priceLine)
        }
      })

      bids.forEach(i => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const sum = i[0] * i[1]
        if (sum >= ordersRange.value) {
          const priceLine = candleSeries.value?.createPriceLine({
            lineVisible: true,
            price: parseFloat(i[0]),
            color: parseFloat(i[0]) > props.ticker?.price ? '#f4465d' : '#2862ff',
            lineWidth: 1,
            axisLabelVisible: true,
            lineStyle: LineStyle.Solid,
            title: getFormattedBigNumber(sum)
          })
          orderLines.push(priceLine)
        }
      })
    }
  }, 3000)
}

const getOrders = async () => {
  const restClient = new RestClient()
  const result = await restClient.getFullOrderBook({ instId: props.ticker?.symbol, sz: '5000' })
  if (result[0]) {
    return {
      asks: result[0].asks,
      bids: result[0].bids
    }
  }

  return {
    asks: [],
    bids: []
  }
}

const createPivotLines = () => {
  setInterval(() => {
    pivotLines.forEach((line: IPriceLine | undefined) => {
      if (line) candleSeries.value?.removePriceLine(line)
    })
    const points = chartInterval.value === '1m' ? props.ticker?.points1min || [] : props.ticker?.points5min || []
    if (props.isMainChart && showPivots.value) {
      points.forEach((level, index) => {
        const priceLine = candleSeries.value?.createPriceLine({
          price: parseFloat(level),
          lineVisible: true,
          color: 'rgba(255,255,255,.5)',
          lineWidth: 1,
          axisLabelVisible: true,
          lineStyle: LineStyle.Solid,
          title: ''
        })
        pivotLines.push(priceLine)
      })
    }
  }, 2000)
}

watch(fullScreenerMode, async (val) => {
  if (!val) {
    chart.value?.remove()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (wsClient) {
      wsClient.closeAll()
    }
    await createMiniChart()
    await setChartCandlesData()
  }
})

const tickerSymbol = computed(() => {
  return props.ticker?.symbol
})
watch(tickerSymbol, async (val) => {
  chart.value?.remove()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (wsClient) {
    wsClient.closeAll()
  }
  await createMiniChart()
  await setChartCandlesData()
  createPivotLines()
})

onMounted(async () => {
  setTimeout(async () => {
    chartInterval.value = props.interval

    await createMiniChart()
    await setChartCandlesData()

    if (props.isMainChart) {
      createPivotLines()
      await createOrderLines()
    }

    const ro = new ResizeObserver(() => {
      const element = document.getElementById(`mini-chart${props.index}`)
      if (element) {
        if (chart.value) chart.value.resize(element.offsetWidth, element.offsetHeight)
      }
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ro.observe(document.getElementById(`mini-chart${props.index}`))
  }, 1000)
})

onBeforeUnmount(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (wsClient) {
    wsClient.closeAll()
  }
})
</script>

<template>
  <div class="okx-futures-mini-chart">
    <div
        :id="`mini-chart${index}`"
        :style="fullScreenerMode ? 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; background: #000000' : 'position: relative; right: auto; height: calc(50vh - 92px); max-width: 100%'"
        class="relative-position"
        :class="fullScreenerMode ? 'bg-dark' : ''"
    >
      <!--    Chart interval & Full screen & TradingView chart-->
      <div
          class="flex absolute-top-left justify-between full-width items-center"
          style="z-index: 1000; left: 3px; top: 3px"
      >
        <div class="flex items-center">
          <q-btn
              v-for="interval in chartIntervalOptions"
              :key="interval"
              :label="interval"
              :color="interval === chartInterval ? 'primary' : 'info'"
              size="sm"
              dense no-caps
              class="q-px-xs q-ml-xs"
              @click="setChartInterval(interval)"
          />

          <q-btn
              v-if="isMainChart"
              :label="fullScreenerMode ? 'Сollapse' : 'Fullscreen'"
              :icon="fullScreenerMode ? 'fullscreen_exit' : 'fullscreen'"
              color="primary"
              size="sm"
              dense no-caps
              class="q-px-xs q-ml-md"
              @click="fullScreenerMode = !fullScreenerMode"
          />

          <q-checkbox
              v-if="isMainChart"
              label="Pivots"
              dense
              class="q-ml-md"
              v-model="showPivots"
          />
        </div>

        <div v-if="isMainChart" class="q-pt-sm" style="width: 300px; margin-right: 90px">
          <div>
            <q-checkbox
                v-model="showOrders"
                dense
                size="sm"
                color="primary"
            >
              <template v-slot:default>
                <div class="q-ml-xs">Orders from: <span class="text-bold">{{
                    getFormattedBigNumber(ordersRange)
                  }}</span></div>
              </template>
            </q-checkbox>
          </div>

          <q-slider
              color="primary"
              dense
              v-model="ordersRange"
              :disable="!showOrders"
              :step="50_000"
              :min="50_000"
              :max="50_000_000"
              thumb-size="20px"
              thumb-color="primary"
              track-color="dark"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<style lang="sass">
.okx-futures-mini-chart
  border: 1px solid rgba(255, 255, 255, .2)
</style>
