<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-transparent text-white" bordered>
      <q-toolbar>
        <q-btn dense flat icon="menu" @click="toggleLeftDrawer" />

<!--        <q-img :src="logoSrc" class="app-logo"/>-->

<!--        <q-toolbar-title class="text-uppercase fw-900 text-primary">-->
<!--          COINSCANRRC-->
<!--        </q-toolbar-title>-->
        <q-toolbar-title class="text-uppercase fw-900 text-primary">
          Screener
        </q-toolbar-title>

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
import { ref } from 'vue'
import LeftDrawer from 'components/left-drawer.vue'
import logo from 'src/assets/logo.svg'

export default {
  components: { LeftDrawer },
  setup () {
    const logoSrc = logo
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      logoSrc,
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
