<script setup lang="ts">
import { onMounted } from 'vue'
import { useNewsStore } from 'components/alerts/store'
import '@fortawesome/fontawesome-free/css/all.min.css'

const newsStore = useNewsStore()

onMounted(() => {
  newsStore.startNewsUpdate()
})
</script>

<template>
  <div class="alerts-list q-px-md">
    <div class="fw-900">AI NEWS ANALYST</div>
    <q-scroll-area class="alerts-list-scroll-area q-mt-sm">
      <div v-if="newsStore.newsList.length === 0">No news available.</div>
      <q-card v-for="news in newsStore.newsList" :key="news.id" bordered flat class="q-mb-md">
        <q-card-section>
          <div class="q-mt-sm text-bold">
            📰 {{ news.analysis.summary }}
          </div>
          <div class="q-mt-sm">
            📊 Importance:
            <span>
              <i
                v-for="n in 3"
                :key="n"
                class="q-mx-xs"
                :class="{
                  'fa fa-star text-warning': n <= news.analysis.importance,
                  'fa fa-star-o text-grey': n > news.analysis.importance
                }"
              ></i>
            </span>
          </div>
          <div class="q-mt-sm">
            💡 Impact: <span :class="{'text-positive': news.analysis.impact === 'positive', 'text-negative': news.analysis.impact === 'negative'}">
              {{ news.analysis.impact.toUpperCase() }}
            </span>
          </div>
          <div class="q-mt-sm">
            🔗 <a :href="news.originalPostUrl" target="_blank" class="text-primary">Read more</a>
          </div>
        </q-card-section>
      </q-card>
    </q-scroll-area>
  </div>
</template>

<style lang="sass">
.alerts-list-scroll-area
  height: 180px
  overflow-y: auto

.text-positive
  color: green

.text-negative
  color: red

.text-warning
  color: gold

.text-grey
  color: lightgray
</style>
