<script setup lang="ts">
import { useTableStore } from 'components/tickers-table/store'
import { useOKXFuturesStore } from 'components/okx-futures/store'
import { computed, ComputedRef, onMounted, watch } from 'vue'
import TickersTableRow from 'components/tickers-table/tickers-table-row.vue'
import { Ticker } from 'src/models/Ticker'
import { useTickerStore } from 'components/ticker-detail/store'
import { useOKXSpotStore } from 'components/okx-spot/store'

const tableStore = useTableStore()
const OKXFuturesStore = useOKXFuturesStore()
const OKXSpotStore = useOKXSpotStore()
const tickerStore = useTickerStore()
// eslint-disable-next-line no-undef
let reloader: string | number | NodeJS.Timeout | undefined

const tickers: ComputedRef<Ticker[]> = computed(() => {
  if (tableStore.tickersType === 'OKX-Futures') return OKXFuturesStore.tickers || []
  if (tableStore.tickersType === 'OKX-Spot') return OKXSpotStore.tickers || []
  return []
})

const tableTickersType = computed(() => {
  return tableStore.tickersType
})

const sortedTickers: ComputedRef<Ticker[]> = computed(() => {
  const localTickers = JSON.parse(JSON.stringify(tickers.value))
  if (tableStore.sortDirection !== 'none') {
    return localTickers
      .filter((i: Ticker) => i.coin.toLowerCase().includes(tableStore.searchText.toLowerCase()))
      .sort((a: Ticker, b: Ticker) => {
        if (tableStore.sortDirection === 'down' && tableStore.sortColumn !== 'default') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return a[tableStore.sortColumn] - b[tableStore.sortColumn]
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b[tableStore.sortColumn] - a[tableStore.sortColumn]
        }
      })
  }

  return localTickers
    .filter((i: Ticker) => i.coin.toLowerCase().includes(tableStore.searchText.toLowerCase()))
    .sort((a: Ticker, b: Ticker) => b.quoteVolume - a.quoteVolume)
})

const loadTickers = async () => {
  if (reloader) clearInterval(reloader)
  if (tableStore.tickersType === 'OKX-Futures') {
    reloader = setInterval(async () => {
      await OKXFuturesStore.init()
      if (!tickerStore.ticker) {
        tickerStore.ticker = OKXFuturesStore.tickers.find(i => i.coin === 'BTC') || null
      } else {
        tickerStore.ticker = OKXFuturesStore.tickers.find(i => i.coin === tickerStore.ticker?.coin) || null
      }
    }, 2000)
  }

  if (tableStore.tickersType === 'OKX-Spot') {
    reloader = setInterval(async () => {
      await OKXSpotStore.init()
      if (!tickerStore.ticker) {
        tickerStore.ticker = OKXSpotStore.tickers.find(i => i.coin === 'BTC') || null
      } else {
        tickerStore.ticker = OKXSpotStore.tickers.find(i => i.coin === tickerStore.ticker?.coin) || null
      }
    }, 2000)
  }
}

watch(tableTickersType, () => {
  loadTickers()
})

onMounted(async () => {
  await loadTickers()
})
</script>

<template>
<div class="tickers-table-content">
  <q-scroll-area style="height: calc(100vh - 380px)">
    <tickers-table-row
      v-for="ticker in sortedTickers"
      :key="ticker.symbol"
      :ticker="ticker"
    />
  </q-scroll-area>

</div>
</template>

<style scoped lang="sass">

</style>
