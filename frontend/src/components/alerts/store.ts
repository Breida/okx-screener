import { defineStore } from 'pinia'
import axios from 'axios'
import config from 'src/config'
import { NewsInfo } from 'src/models/NewsInfo'

export const useNewsStore = defineStore('newsStore', {
  state: () => ({
    newsList: [] as NewsInfo[]
  }),
  actions: {
    async fetchNews () {
      try {
        const response = await axios.get<NewsInfo[]>(`${config.okxServerUrl}/api/v1/analyzed-news?last=3`)
        this.newsList = response.data.slice(0, 3)
      } catch (error) {
        console.error('Error fetching news:', error)
      }
    },
    startNewsUpdate () {
      this.fetchNews()
      setInterval(this.fetchNews, 60000)
    }
  }
})
