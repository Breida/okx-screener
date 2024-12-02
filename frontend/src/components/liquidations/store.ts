import { defineStore } from 'pinia'
import { computed, ref, Ref } from 'vue'
import { Liquidation } from 'src/models/Liquidation'
import axios, { AxiosError } from 'axios'
import config from 'src/config'

export const useLiquidationsStore = defineStore('liquidationsStore', () => {
  const liquidations: Ref<Liquidation[]> = ref([])

  const loadLiquidations = async (symbol: string, timeFrom : number) => {
    liquidations.value = await axios
      .get(config.okxServerUrl + '/api/v1/liquidations', { params: { symbol, timeFrom } })
      .then(res => res.data)
      .catch((err: AxiosError) => {
        console.log(err.message)
      })
  }

  const getLiquidationsTotal = computed(() => {
    let total = 0
    let longs = 0
    let shorts = 0
    liquidations.value.forEach((i: Liquidation) => {
      total += i.size * parseFloat(i.price)
      if (i.side === 'LONG') longs += i.size * parseFloat(i.price)
      if (i.side === 'SHORT') shorts += i.size * parseFloat(i.price)
    })

    return {
      total, longs, shorts
    }
  })

  return {
    liquidations,
    getLiquidationsTotal,

    loadLiquidations
  }
})
