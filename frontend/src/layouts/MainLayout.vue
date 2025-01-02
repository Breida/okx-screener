<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-transparent text-white" bordered>
      <q-toolbar>
        <q-btn dense flat icon="menu" @click="toggleLeftDrawer" />

        <!--        <q-img :src="logoSrc" class="app-logo"/>-->

        <!--        <q-toolbar-title class="text-uppercase fw-900 text-primary">-->
        <!--          COINSCANRRC-->
        <!--        </q-toolbar-title>-->
        <q-toolbar-title class="text-uppercase fw-900 text-primary" style="min-width: 240px;">
          Okx Screener |
        </q-toolbar-title>

          <MarqueeLiquidations :liquidations="liquidations"/>

      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :width="550" class="q-drawer">
      <!-- drawer content -->
      <left-drawer />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import LeftDrawer from 'components/left-drawer.vue'
import logo from 'src/assets/logo.svg'
import { useLiquidationsStore } from 'src/components/liquidations/store'
import MarqueeLiquidations from 'src/components/liquidations/marquee-liquidations.vue'

export default {
  components: { LeftDrawer, MarqueeLiquidations },
  setup () {
    const logoSrc = logo
    const leftDrawerOpen = ref(false)
    const liquidationsStore = useLiquidationsStore()
    const intervalId = ref(null)

    onMounted(async () => {
      await liquidationsStore.loadLiquidations('', Date.now() - 60000)

      intervalId.value = setInterval(() => {
        liquidationsStore.loadLiquidations('', Date.now() - 60000)
      }, 60000)
    })

    onUnmounted(() => {
      if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
      }
    })

    const liquidations = computed(() => liquidationsStore.liquidations.filter(x => x.price * x.size > 10))

    return {
      leftDrawerOpen,
      logoSrc,
      liquidations,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style lang="sass">
.q-drawer
  background: transparent !important

.app-logo
  width: 40px
  margin-left: 10px
</style>
