import Vue from 'vue'
import Vuex from 'vuex'
import { playMode } from "common/js/config.js";
import { stat } from 'fs';
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    songList: [],
    // tuiaji
    mode: playMode.sque, //播放模式
    isMini: false, // 是否显示mini播发器
    playing: false, // 是否播放
    playList: [], // 播放列表
    playIndex: -1, // 播放歌曲的索引
    squeList: [],  //顺序列表
    currentTime:0,  //当前播放歌曲播放到的时间 
    songListInfo:{}
  },
  getters: {
    playSong: (state) => {
      return state.playList[state.playIndex] || {}
    }
  },
  mutations: {
    showSongList(state, list) {
      state.songList = list
    },
    set_songListInfo (state, info){
      state.songListInfo = {...info};
    },
    set_isMini(state, bool) {
      state.isMini = bool
    },
    set_playing(state, bool) {
      state.playing = bool
    },
    set_playList(state, list) {
      state.playList = list
    },
    set_squeList(state,list){
      state.squeList = list
    },
    set_playIndex(state, index) {
      state.playIndex = index
    },
    set_mode(state,index){
      // console.log(state.mode,index);
      
      state.mode = index
    },
    set_currentTime(state,time){
      state.currentTime =time
    }
  },
  actions: {
    setPlay({ commit }, { list, index }) {
      // commit('set_isMini', true)
      commit('set_playing', true)
      commit('set_playList', list)
      commit('set_squeList',list)
      commit('set_playIndex', index)
    },
    addSong({commit ,state},item){
      console.log(item);
      
      commit('set_playing', true)
      commit('set_playList', [item,...state.playList])
      commit('set_squeList', [item, ...state.squeList])
      commit('set_playIndex', 0)
    }
  }
})

export default store