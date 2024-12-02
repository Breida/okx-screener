<script setup lang="ts">

import { computed, PropType } from 'vue'
import { Ticker } from 'src/models/Ticker'
import { getFormattedBigNumber } from '../../utils/formatter'
import { useTickerStore } from 'components/ticker-detail/store'

const tickerStore = useTickerStore()

const props = defineProps({
  ticker: {
    type: Object as PropType<Ticker>,
    required: true
  }
})

const setTicker = () => {
  tickerStore.ticker = props.ticker
}

const activeTicker = computed(() => {
  return tickerStore.ticker?.symbol === props.ticker?.symbol && tickerStore.ticker?.exchange === props.ticker?.exchange
})

</script>

<template>
<div class="tickers-table-row" :class="activeTicker ? 'tickers-table-row-active' : ''" @click="setTicker">
  <div class="tickers-table-grid">
    <div>{{ ticker.coin }}</div>
    <div class="text-center" :class="ticker.changePercent >= 0 ? 'text-positive' : 'text-negative'">
      <span v-if="ticker.changePercent > 0">+</span>
      {{ ticker.changePercent?.toFixed(2) }}%
    </div>
    <div class="text-center">{{ getFormattedBigNumber(ticker.quoteVolume) }}</div>
    <div class="text-center">{{ ticker.founding?.toFixed(2) }}</div>
    <div class="text-center">{{ ticker.NART_1m?.toFixed(2) }}</div>
    <div class="text-center">{{ ticker.NART_5m?.toFixed(2) }}</div>
  </div>
</div>
</template>

<style lang="sass">
.tickers-table-row
  background: $dark
  padding: 8px
  border-radius: 4px
  margin-bottom: 8px
  cursor: pointer
  transition: .5s all

  &:hover
    background: rgba(255,255,255,.1)

.tickers-table-row-active
  border: 1px solid $primary
  box-shadow: inset 2px 2px 20px 0 hsla(0,0%,100%,0.2)
</style>
