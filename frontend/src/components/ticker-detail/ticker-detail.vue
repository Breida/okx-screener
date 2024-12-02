<script setup lang="ts">
import { useTickerStore } from 'components/ticker-detail/store'
import { getFormattedBigNumber } from '../../utils/formatter'
import OkxFuturesMiniChart from 'components/charts/okx-futures-mini-chart.vue'
import LiquidationsData from 'components/liquidations/liquidations-data.vue'

const store = useTickerStore()
</script>

<template>
<div v-if="store.ticker" class="ticker-detail">
  <div class="ticker-detail-header">

    <div class="flex">
      <div class="text-h4 fw-900">{{ store.ticker?.coin }}</div>
      <div class="q-ml-md">
        <div class="text-subtitle1 q-mt-xs">
          <span class="fw-900">{{ store.ticker?.price }}</span>
          <small class="q-ml-xs">USDT</small>
        </div>
        <div>Volume: <span class="fw-900">{{ getFormattedBigNumber(store.ticker?.quoteVolume) }}</span></div>
      </div>
    </div>

    <div class="q-pt-sm q-ml-lg">
      <div>24h change</div>
      <div class="text-subtitle1 fw-900" :class="store.ticker?.changePercent > 0 ? 'text-positive' : 'text-negative'">
        <span v-if="store.ticker?.changePercent > 0">+ </span>
        {{ store.ticker?.changePercent?.toFixed(2) }}%
      </div>
    </div>

    <div class="q-pt-sm">
      <div>FR</div>
      <div class="text-subtitle1 fw-900">
        {{ store.ticker?.founding?.toFixed(2) }}
      </div>
    </div>

    <div class="q-pt-sm">
      <div>NATR 1m</div>
      <div class="text-subtitle1 fw-900">
        {{ store.ticker?.NART_1m?.toFixed(2) }}
      </div>
    </div>

    <div class="q-pt-sm">
      <div>NATR 5m</div>
      <div class="text-subtitle1 fw-900">
        {{ store.ticker?.NART_5m?.toFixed(2) }}
      </div>
    </div>

    <div class="q-pt-sm">
      <liquidations-data />
    </div>

  </div>

  <div id="ticker-detail-charts" class="row q-col-gutter-md">
      <okx-futures-mini-chart interval="5m" class="col-12" :index="1" :ticker="store.ticker" is-main-chart/>
      <okx-futures-mini-chart interval="1H" class="col-6" :index="2" :ticker="store.ticker" />
      <okx-futures-mini-chart interval="4H" class="col-6" :index="4" :ticker="store.ticker" />
  </div>
</div>
</template>

<style lang="sass">
.ticker-detail-header
  display: grid
  grid-template-columns: 300px 130px 70px 70px 90px 370px
  align-items: center

#ticker-detail-charts
  //display: grid
  //grid-template-columns: 1fr 1fr
  //grid-gap: 16px
  margin-top: 16px

</style>
