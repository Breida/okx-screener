<script setup lang="ts">

import TickersTable from 'components/tickers-table/tickers-table.vue'
import AlertsList from 'components/alerts/alerts-list.vue'
</script>

<template>
<div class="left-drawer">
  <alerts-list class="q-mt-sm"/>
  <tickers-table />
</div>
</template>

<style scoped>

</style>
