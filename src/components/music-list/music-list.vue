<template>
    <div class="music-list" >
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" >{{title}}</h1>
        <div class="bg-image" ref="bg">
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll :data='song' class="list" ref="list" 
        @scroll="getPos" :probeType='3'>
            <div>
                <song-list :songs='song' v-if='song.length'></song-list>
            </div>
        </scroll>
    </div>
</template>

<script>
import songList from "base/song-list/song-list";
import { getSongList } from "api/recommend.js";
import scroll from "base/scroll/scroll";

const MAXTOP = 40;
export default {
    mounted(){
        // this.$nextTick(()=>{
            
        // })
        this.getSongs();
        this.setTop();
        //layer 偏移Y向上的最小值
        this.minTranslateY =  -this.bgHeight + MAXTOP;
    },
    props:{
        // title:{
        //     type: String,
        //     default: 'title'
        // },
        bgImg:{
            type: String
        },
        // song:{
        //     type: Array,
        //     default: []
        // }
    },
    data(){
        return {
            song:[],
            title:'',
            scrollY:0
        }
    },
    components:{
        songList,
        scroll
    },
    methods:{
        //根据id获取歌单的详情
        getSongs(){
            let dissid = this.$route.params.id
            getSongList(dissid).then(res=>{
                let {dissname,songlist,logo} = res.cdlist[0]
                // console.log(res.cdlist[0]);
                
                this.title = dissname
                this.song =songlist
                this.$refs.bg.style.backgroundImage=`url(${logo})`
                // console.log(this.song);
                
            })
        },
        back(){
            this.$router.push('/recommend')
        },
        //设置滚动区域的top
        setTop(){
            // console.log(this.$refs);
            this.bgHeight = this.$refs.bg.clientHeight
            this.$refs.list.$el.style.top = this.bgHeight+'px'
        },
        getPos(pos){
            // console.log(pos);
            // this.$refs.layer.style['transform'] =`translateY(${pos.y}px)` 
            this.scrollY = pos.y
            
        }
    },
    watch: {
        scrollY(newY){
            // let a =this.scrollY;
            // console.log(this.minTranslateY);
            let scale = newY / this.bgHeight;
            if (newY > this.minTranslateY) {
                this.$refs.layer.style['transform'] = `translate3d(0,${newY}px,0)`
                this.$refs.bg.style['zIndex'] = '0'
                this.$refs.bg.style['paddingTop']='70%'
                this.$refs.bg.style['height'] =`0`
            }else{
                this.$refs.bg.style['zIndex'] = '10'
                this.$refs.bg.style['paddingTop']='0'
                this.$refs.bg.style['height'] =`${MAXTOP}px`
            }
            
            if (newY > 0 ) {
                scale = 1 + scale
                this.$refs.bg.style['transform'] = `scale(${scale})`
                this.$refs.bg.style['zIndex'] = '10'
            }

            // `translateY(${this.scrollY}px)`
        }
    }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.2)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

