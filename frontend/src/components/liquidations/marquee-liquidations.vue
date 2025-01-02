<script setup lang="ts">
import { PropType } from 'vue'
import { Liquidation } from 'src/models/Liquidation'

defineProps({
  liquidations: {
    type: Array as PropType<Liquidation[]>,
    required: true
  }
})
</script>

<template>
  <div class="marquee-container">
    <div class="marquee-content">
      <span
        v-for="liquidation in liquidations"
        :key="liquidation.id"
        :class="{
          'text-green': liquidation.side === 'LONG',
          'text-red': liquidation.side === 'SHORT'
        }"
      >
        {{ liquidation.symbol }} {{ liquidation.side }} ${{ liquidation.size }} at ${{ liquidation.price }} |
      </span>
    </div>
  </div>
</template>

<style scoped lang="sass">
.marquee-container
  overflow: hidden
  white-space: nowrap
  position: relative
  flex: 1
  margin-left: 20px

.marquee-content
  display: inline-block
  padding-left: 100%
  animation: marquee 15s linear infinite
  white-space: nowrap

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
