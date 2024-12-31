<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import config from "src/config"

interface Analysis {
  isValid: boolean;
  impact: 'positive' | 'negative';
  importance: number;
  summary: string;
}

interface NewsInfo {
  id: string;
  text: string;
  originalPostUrl: string;
  analysis: Analysis;
  date: number;
}

const newsList = ref<NewsInfo[]>([])

// Fetch the latest news on component mount
const fetchNews = async () => {
  try {
    const response = await axios.get<NewsInfo[]>(`${config.okxServerUrl}/api/v1/analyzed-news?last=3`)
    newsList.value = response.data.slice(0, 3)
  } catch (error) {
    console.error('Error fetching news:', error)
  }
}

onMounted(fetchNews)
</script>

<template>
  <div class="alerts-list q-px-md">
    <div class="fw-900">AI NEWS ANALYST</div>
    <q-scroll-area class="alerts-list-scroll-area q-mt-sm">
      <div v-if="newsList.length === 0">No news available.</div>
      <q-card v-for="news in newsList" :key="news.id" bordered flat class="q-mb-md">
        <q-card-section>
          <div class="q-mt-sm text-bold">
            📰 {{ news.analysis.summary }}
          </div>
          <div class="q-mt-sm">
            📊 Importance: {{ news.analysis.importance }} / 3
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
</style>
