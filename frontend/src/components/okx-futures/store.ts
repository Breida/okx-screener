import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Ticker } from 'src/models/Ticker'
import axios from 'axios'
import config from 'src/config'

export const useOKXFuturesStore = defineStore('OKXFuturesStore', () => {
  const tickers: Ref<Ticker[]> = ref([])

  const init = async () => {
    tickers.value = await getTickers()
  }

  const getTickers = async () => {
    return axios
      .get(config.okxServerUrl + '/api/v1/okx-futures-tickers')
      .then(res => res.data.filter((i: Ticker) => i.symbol.includes('USDT')))
      .catch(err => {
        console.log(err)
        return []
      })
  }

  return {
    tickers,

    init
  }
})
