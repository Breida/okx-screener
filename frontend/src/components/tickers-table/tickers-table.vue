<script setup lang="ts">
import { useTableStore } from 'components/tickers-table/store'
import TickersTableHeader from 'components/tickers-table/tickers-table-header.vue'
import TickersTableContent from 'components/tickers-table/tickers-table-content.vue'

const store = useTableStore()
const tickerTypeOptions = ['OKX-Futures', 'OKX-Spot']
</script>

<template>
<div class="tickers-table q-pa-md">
  <div class="row q-col-gutter-md">
    <div class="col-6">
      <q-select
        label="Exchange"
        dense
        outlined
        v-model="store.tickersType"
        :options="tickerTypeOptions"
      />
    </div>

    <div class="col-6">
      <q-input
        label="Search"
        dense
        outlined
        v-model="store.searchText"
      />
    </div>
  </div>

  <tickers-table-header class="q-mt-md q-px-sm"/>
  <tickers-table-content class="q-mt-sm"/>
</div>
</template>

<style lang="sass">
.tickers-table-grid
  display: grid
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr
  grid-gap: 10px
  align-items: center
</style>
