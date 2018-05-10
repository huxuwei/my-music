import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  state: {
    songList: []
  },
  mutations: {
    showSongList(state, list) {
      state.songList = list
    }
  }
}