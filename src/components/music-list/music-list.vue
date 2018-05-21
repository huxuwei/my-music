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
            <div class="song-list-wrapper">
                <song-list :songs='song' v-if='song.length'
                @playing='play'></song-list>
                <loading v-if='!song.length'></loading>
            </div>
        </scroll>
        
    </div>
</template>

<script>
import songList from "base/song-list/song-list";
import { getSongList } from "api/recommend.js";
import { getSongPlay,filter } from "api/song.js";
import scroll from "base/scroll/scroll";
import { mapMutations,mapActions,mapState } from "vuex";
import { creatSong } from "common/js/song.js";
import loading from "base/loading/loading";
const MAXTOP = 40;
export default {
    mounted(){
        this.$nextTick(()=>{
             this.getSongs();
            this.setTop();
            // this.get();
            //layer 偏移Y向上的最小值
            this.minTranslateY =  -this.bgHeight + MAXTOP;
            // console.log(this.songListInfo);
            
             this.$refs.bg.style.backgroundImage=`url(${this.songListInfo.imgurl})`
        })
       
    },
    props:{
        bgImg:{
            type: String,
            
        },
    },
    data(){
        return {
            song:[],
            title1:'',
            scrollY:0
        }
    },
    computed:{
        title(){
            return this.songListInfo.dissname || this.title1
        },
        ...mapState([
            'songListInfo'
        ])
    },
    components:{
        songList,
        scroll,
        loading,
    },
    methods:{
        //根据id获取歌单的详情
        async getSongs(){
            let dissid = this.$route.params.id
            let data1 =await  getSongList(dissid)
            let {dissname,songlist,logo,songids} = data1.cdlist[0];
            //如果手动刷新，就重新设置标题和背景
            if (!this.songListInfo.dissname) {
                this.title1 = dissname;
                this.$refs.bg.style.backgroundImage=`url(${logo})`;
            }
            
            // let obj = filter(songlist)
            let data2 =await getSongPlay(songlist)
            let songUrlList= data2.urlMid.data.midurlinfo
            
            // this.song =songlist
           

            //创建song实例
            songlist.forEach((item,index) => {
                if (!songUrlList[index].purl) {
                    return
                }
                this.song.push(creatSong(item,songUrlList[index]))
            });
           
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
        },
        //播放
        play(item,index){
            this.setPlay({
                list: this.song,
                index,
            })
        },
        ...mapActions([
            'setPlay'
        ]),
    },
    watch: {
        scrollY(newY){

            if (newY > this.minTranslateY) {
                this.$refs.layer.style['transform'] = `translate3d(0,${newY}px,0)`
                this.$refs.bg.style['zIndex'] = '0'
                this.$refs.bg.style['paddingTop']='70%'
                this.$refs.bg.style['height'] =`0`
            }else{
                 //向上且到达最高点时，图片高度 为10 ，并去掉宽高比
                this.$refs.bg.style['zIndex'] = '10'
                this.$refs.bg.style['paddingTop']='0'
                this.$refs.bg.style['height'] =`${MAXTOP}px`
            }
           //向下时放大图片
            if (newY > 0 ) {
                 let scale = newY / this.bgHeight;
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

