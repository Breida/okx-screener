<script setup lang="ts">
import { ref, onMounted, watch, PropType } from 'vue'
import { Liquidation } from 'src/models/Liquidation'

const props = defineProps({
  liquidations: {
    type: Array as PropType<Liquidation[]>,
    required: true
  }
})

const marqueeContentRef = ref<HTMLElement | null>(null)

const calculateAnimationDuration = () => {
  if (marqueeContentRef.value) {
    const liquidationCount = props.liquidations.length
    const baseSpeedPerItem = 4
    const minDuration = 20
    const duration = Math.max(minDuration, liquidationCount * baseSpeedPerItem)

    marqueeContentRef.value.style.animationDuration = `${duration}s`
    console.log(`Duration: ${duration}s`)
  }
}

const formatSize = (size: number): number => {
  if (size >= 1000) {
    const formattedSize = (size / 1000)
    return formattedSize
  }
  return size
}

onMounted(() => {
  calculateAnimationDuration()
})

watch(() => props.liquidations, () => {
  calculateAnimationDuration()
})

</script>

<template>
  <div class="marquee-container">
    <div class="marquee-content" ref="marqueeContentRef">
      <span
        v-for="liquidation in liquidations"
        :key="liquidation.id"
        :class="{
          'text-green': liquidation.side === 'LONG',
          'text-red': liquidation.side === 'SHORT',
        }"
      >
         {{ liquidation.symbol }} {{ liquidation.side }} ${{ `${Math.trunc(formatSize(liquidation.size * liquidation.price))}k` }} at ${{ liquidation.price }}  |
      </span>
    </div>
  </div>
</template>

<style scoped lang="sass">
.marquee-container
  overflow: hidden
  white-space: nowrap
  position: relative
  flex: 6
  font-size: 18px
  margin-left: 20px

.marquee-content
  display: inline-block
  white-space: nowrap
  padding-left: 100%
  animation: marquee linear infinite

.text-green
  color: green

.text-red
  color: red

@keyframes marquee
  from
    transform: translateX(100%)
  to
    transform: translateX(-100%)
</style>
