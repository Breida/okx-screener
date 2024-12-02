import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Ticker } from 'src/models/Ticker'

export const useTickerStore = defineStore('tickerStore', () => {
  const ticker: Ref<Ticker | null> = ref(null)

  return {
    ticker
  }
})
