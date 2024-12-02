import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

export type tableTickersType = 'OKX-Futures' | 'OKX-Spot'
export type tableSortType = 'default' | 'symbol' | 'changePercent' | 'quoteVolume' | 'founding' | 'NART_1m' | 'NART_5m'
export type tableSortDirectionType = 'none' | 'up' | 'down'

export const useTableStore = defineStore('tableStore', () => {
  const tickersType: Ref<tableTickersType> = ref('OKX-Futures')
  const sortColumn: Ref<tableSortType> = ref('default')
  const sortDirection: Ref<tableSortDirectionType> = ref('none')
  const searchText = ref('')

  return {
    tickersType,
    sortColumn,
    sortDirection,
    searchText
  }
})
