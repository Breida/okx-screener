<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Chart } from 'vue-tradingview-widgets'

const options = {
  symbol: 'BINANCE:BTCUSDT',
  theme: 'dark',
  interval: '1m'
}

</script>

<template>
<div class="tradingview-chart" >
    <chart :options="options" />
</div>
</template>

<style scoped lang="sass">

</style>
