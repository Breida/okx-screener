<script setup lang="ts">

import { tableSortType, useTableStore } from 'components/tickers-table/store'

const store = useTableStore()
const columns: { name: string, field: tableSortType, sortable: boolean }[] = [
  { name: 'Symbol', field: 'symbol', sortable: false },
  { name: '24h', field: 'changePercent', sortable: true },
  { name: 'Vol 24h', field: 'quoteVolume', sortable: true },
  { name: 'FR', field: 'founding', sortable: true },
  { name: 'NATR 1m', field: 'NART_1m', sortable: true },
  { name: 'NATR 5m', field: 'NART_5m', sortable: true }
]

const setSortColumn = (col: tableSortType) => {
  if (store.sortColumn === col && store.sortDirection === 'up') {
    store.sortColumn = col
    store.sortDirection = 'down'
  } else if (store.sortColumn !== col) {
    store.sortColumn = col
    store.sortDirection = 'up'
  } else if (store.sortColumn === col && store.sortDirection === 'down') {
    store.sortColumn = 'default'
    store.sortDirection = 'none'
  }
}
</script>

<template>
<div class="tickers-table-header">
  <div class="tickers-table-grid">
    <div
      v-for="column in columns"
      :key="column.name"
      class="tickers-table-header-column-title text-center flex no-wrap justify-center"
      :class="column.sortable ? 'cursor-pointer' : ''"
      @click="setSortColumn(column.field)"
    >
      <div>{{ column.name }}</div>
      <div v-if="column.sortable">
        <q-icon
          v-if="store.sortColumn === column.field"
          name="arrow_upward"
          class="q-pl-xs"
          size="16px"
          :color="store.sortDirection === 'none' ? 'sort' : store.sortDirection === 'down' ? 'negative' : 'positive'"
          style="transition: .5s all"
          :style="store.sortDirection === 'down' ? 'transform: rotateX(180deg)' : ''"
        />
        <q-icon
          v-else
          name="sort"
          class="q-pl-xs"
          size="16px"
        />
      </div>
    </div>
  </div>
</div>
</template>

<style lang="sass">
.tickers-table-header-column-title
  font-weight: 700
  font-size: 11px
</style>
