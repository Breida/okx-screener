<script setup lang="ts">
import { useTickerStore } from 'components/ticker-detail/store'
import { computed, onMounted, ref, watch } from 'vue'
import { useLiquidationsStore } from 'components/liquidations/store'
import { getFormattedBigNumber } from 'src/utils/formatter'

const tickerStore = useTickerStore()
const liquidationStore = useLiquidationsStore()
const period = ref('1H')
const periods = ['1H', '4H', '24H']

const currentTickerSymbol = computed(() => tickerStore.ticker?.symbol?.replace('-SWAP', '').replace('-SPOT', ''))
const liquidationsUsdTotal = computed(() => {
  if (liquidationStore.getLiquidationsTotal.total) {
    return getFormattedBigNumber(liquidationStore.getLiquidationsTotal.total)
  }
  return 0
})

const longsPercent = computed(() => {
  return liquidationStore.getLiquidationsTotal.longs * 100 / liquidationStore.getLiquidationsTotal.total
})

const shortsPercent = computed(() => {
  return liquidationStore.getLiquidationsTotal.shorts * 100 / liquidationStore.getLiquidationsTotal.total
})

const getTime = (period: string) => {
  if (period === '4H') {
    return new Date().getTime() - 4 * 60 * 60 * 1000
  }
  if (period === '1H') {
    return new Date().getTime() - 1 * 60 * 60 * 1000
  }
  if (period === '24H') {
    return new Date().getTime() - 24 * 60 * 60 * 1000
  }
  return new Date().getTime()
}

const setPeriod = async (p: string) => {
  period.value = p
  if (currentTickerSymbol.value) {
    await liquidationStore.loadLiquidations(currentTickerSymbol.value, getTime(period.value))
  }
}

onMounted(async () => {
  if (currentTickerSymbol.value) {
    await liquidationStore.loadLiquidations(currentTickerSymbol.value, getTime(period.value))
  }
})

watch(currentTickerSymbol, async () => {
  await liquidationStore.loadLiquidations(currentTickerSymbol.value || '', getTime(period.value))
})
</script>

<template>
<div class="liquidations">
  <div class="">
    <span>Total liquidations: <span class="q-pa-xs fw-900 q-ml-xs">{{ liquidationsUsdTotal }}</span></span>
    <span class="text-positive q-pa-xs q-ml-xs text-bold">LONGS {{ longsPercent ? longsPercent.toFixed(2) : '0' }}%</span>
    <span class="text-negative q-pa-xs q-ml-xs text-bold">SHORTS {{ shortsPercent ? shortsPercent.toFixed(2) : '0' }}%</span>
  </div>

  <div class="flex items-center">
    <div class="q-pt-xs">Period: </div>
    <div class="flex q-mt-xs q-ml-md">
      <q-btn
        v-for="p in periods"
        :key="p"
        :label="p"
        padding="3px"
        size="sm"
        unelevated
        :color="p === period ? 'primary' : 'info'"
        class="liquidations-switcher-button q-mr-xs"
        @click="setPeriod(p)"
      />
    </div>
  </div>

</div>
</template>

<style lang="sass">
.liquidations-switcher-button
  padding: 1px 10px !important
</style>
