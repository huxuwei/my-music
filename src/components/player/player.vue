<template>
  <div class="player" v-show="playList.length">
      <div class="normal-player" v-show="!isMini">
          <div class="background">
              <img :src="playSong.image" alt="">
          </div>
          <div class="top">
             <div class="back" @click="back">
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="playSong.name"></h1>
            <h2 class="subtitle" v-html="playSong.singer"></h2>
          </div>
          <div class="middle">
            <div class="middle-l">
              <div class="cd-wrapper">
                <div class="cd">
                  <img :src="playSong.image" alt="" class="image" @click="changeCurrentTime(50)">
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="progress-wrapper">
              
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar :percentage='percentage'
                  @change='changeCurrentTime'></progress-bar>
                </div>
                <span class="time time-r">{{format(time)}}</span>
            </div>
            
            <div class="operators">
              <div class="icon i-left" >
                <i :class="iconMode" @click="changeMode"></i>
              </div>
              <div class="icon i-left" >
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" >
                <i @click="togglePlaying" :class="playIcon"></i>
              </div>
              <div class="icon i-right" >
                <i @click="next" class="icon-next"></i>
              </div>
              <!-- <div class="icon i-right">
                <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
              </div> -->
            </div>
          </div>
      </div>
      <div class="mini-player" v-show="isMini" @click="showNormal">
          <div class="icon">
            <img  width="40" height="40" :src="playSong.image">
          </div>
          <div class="text">
            <h2 class="name" v-html="playSong.name"></h2>
            <p class="desc" v-html="playSong.singer"></p>
          </div>
          <div class="control">
            <!-- <progress-circle :radius="radius" :percent="percent"> -->
              <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
            <!-- </progress-circle> -->
          </div>
          <div class="control" @click.stop="showPlaylist">
            <i class="icon-playlist"></i>
          </div>
      </div>
      <audio :src="playSong.url" autoplay ref="audio"
      @canplay='loaded' @timeupdate="updateTime"   @ended='next' ></audio>
  </div>
</template>

<script>
import { mapGetters,mapState, mapMutations } from "vuex";
import { playMode } from "common/js/config.js";
import { random } from "common/js/util.js";
import  progressBar  from "base/progress-bar/progress-bar";
export default {
    data(){
      return {
        currentTime:''
      }
    },
    methods:{
      back(){
        this.setIsMini(true)
      },
      showNormal(){
        this.setIsMini(false)
      },
      //上一首
      prev(){
        let index = this.playIndex -1
        if (index < 0) {
          index = this.playList.length -1
        }
        this.setPlayIndex(index)
        this.setPlaying(true)
      },
      //下一首
      next(){
        if (this.playIndex === 0) {
          this.$refs.audio.load()
        }
        let index = this.playIndex + 1
        if (index > this.playList.length -1) {
          index = 0
        }
        
        
        this.setPlayIndex(index)
        this.setPlaying(true)
      },
      //暂停，播放切换
      togglePlaying(){
        let audio = this.$refs.audio
        this.setPlaying(!this.playing)
        if (this.playing) {
          audio.play()
        }else{
          audio.pause()
        }
      },
      updateTime(){
        let audio  = this.$refs.audio
        this.currentTime = audio.currentTime
      },
      //改变播放模式
      changeMode(){
        this.setMode((this.mode+1)%3)
      },
      //grogress移动结束后改变播放时间
      changeCurrentTime(percent){
        // console.log(time);
        let time =  this.playSong.duration * percent
        this.$refs.audio.currentTime = time
      },
      loaded(){
        // this.$refs.audio.play()
         
      },
      
      //处理时间格式
      format(time){
         time = time || 0
        let min = time / 60 | 0
        let sec = time % 60
        return `${min}:${this._add0(sec)}`
      },
      _add0(num){
        // console.log(num.toString());
        num = num.toString().split('.')[0]
        if (num.toString().length < 2) {
          return `0${num}`
        }else{
          return num
        }
        
      },
      ...mapMutations({
          setIsMini: 'set_isMini',
          setPlaying:'set_playing',
          setPlayIndex:'set_playIndex',
          setMode: 'set_mode',
          setPlayList: 'set_playList',
          // setCurrentTime:'set_currentTime'
         }),
    },
    computed:{
      //歌曲的总时间
      time (){
        return this.playSong.duration
      },
      percentage(){
        return this.currentTime / this.time
      },
      playIcon(){
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      iconMode(){
        switch (this.mode) {
          case playMode.sque:
              return 'icon-sequence'
          case playMode.loop:
              return 'icon-loop'
          case playMode.random:
              return 'icon-random'
          default:
          return ''
        }
      },
        ...mapState([
            'isMini',
            'playing',
            'playList',
            'squeList',
            'playIndex',
            'mode',
        ]),
        ...mapGetters([
          'playSong'
        ]),
         
    },
    watch:{
      //模式改变
      mode(){
        let audio = this.$refs.audio;
        switch (this.mode) {
          case playMode.random:
          console.log('random');
              this.setPlayList(random(this.squeList))
              audio.loop = false
              // audio.currentTime =2
              break 
          case playMode.loop:
              audio.loop = true
              break 
          case playMode.sque:
          console.log('sque');
              this.setPlayList(this.squeList)
              audio.loop = false
              break
          default:
          // return ''
        }
      },
      currentTime(){
        // this.$refs.audio.currentTime = this.currentTime
      }
      // playSong(){
       
      // }
    },
    mounted(){
      // this.$refs.audio.play()
    },
    components:{
      progressBar
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          // position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
