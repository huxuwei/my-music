<template>
    <scroll class="suggest" :data='list' :pullUpLoad='pullUpLoad'
    @pullingUp="searchMore" ref="scroll">
        <ul class="suggest-list">
            <li class="suggest-item" 
            v-for="(item,index) in list" :key="index"
            @click="addOneSong(item)">
                <div class="icon">
                    <i :class="getIcon(item)"></i>
                </div>
                <div class="name">
                    <p class="text">
                       {{getListName(item)}}
                    </p>
                </div>
            </li>
            <loading v-show="isHasMore"></loading>
        </ul>
        <!-- <div v-show="!hasMore && !list.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div> -->
    </scroll>
</template>

<script>
import { search } from "api/search.js";
import scroll from "base/scroll/scroll";
import { getSongPlay,filter } from "api/song.js";
import {  creatSong} from "common/js/song.js";
import loading from "base/loading/loading";
import { mapActions } from 'vuex';
const TPYE_SINGER = 'singer'
const ONE_PAGENUM =20
export default {
    mounted(){
    },
    props:{
        query:{
            type: String,
            default: ''
        }
    },
    data(){
        return {
            //显示页码
            page: 1,
            list: [],
            isHasMore: true, //是否有更多
            pullUpLoad:{threshold:0,moreTxt:"加载更多"}
        }
    },
    methods:{
        async search() {
            let data1 =await search(this.query,this.page,true,ONE_PAGENUM)
        
             let res =await getSongPlay(data1.data.song.list)
             this.checkIsHasMore(data1.data)
             this.list = this.filterList(data1.data,res.urlMid.data)
        },
        //下拉刷新
        async searchMore(){
            // console.log('end');
            this.page ++
            let data1 =await search(this.query,this.page,false,ONE_PAGENUM)
            let res =await getSongPlay(data1.data.song.list)
            this.checkIsHasMore(data1.data)
             this.list = this.list.concat(this.filterList(data1.data,res.urlMid.data))
             this.$refs.scroll.finishPullUp()
        },

        //对歌手和歌曲数据进行合并
        filterList(data,res){
            let temp = []
            if (data.zhida&& data.zhida.singername) {
                temp.push({
                   ...data.zhida,
                    type: TPYE_SINGER
                })
            }
            if(res.midurlinfo && data.song.list){
                temp= temp.concat(this.getSongUrl(data.song.list,res.midurlinfo))
            }
            return temp
        },
        //合并歌曲信息和歌曲播放列表
         getSongUrl(list,midurlinfo){
            list = list.map((item,index) => {
               return creatSong(item,midurlinfo[index])
            });
            return list
        },
        //检测是否还有更多
        checkIsHasMore(data){
            const song = data.song
            //歌曲列表为空，或者已请求的大于总数
            if (!song.list || (song.curnum + ONE_PAGENUM* song.curpage)>song.totalnum ) {
                this.isHasMore = false
            }
        },
        //根据每项type显示对应的名称
        getListName(item){
            if (item.type === TPYE_SINGER) {
                return item.singername
            }else{
                return  `${item.name} - ${item.singer}`
            }
        },
        //根据每项type显示对应的图标
        getIcon(item){
            if (item.type === TPYE_SINGER) {
                return 'icon-mine'
            }else{
                return  'icon-music'
            }
        },
        addOneSong(item){
            console.log(111,item);
            this.addSong(item)
        },
        ...mapActions([
            'addSong'
        ])
    },
    watch:{
        //当搜索内容改变，就发请求
        query(){
            this.page = 1
            this.search()
        }
    },
    components: {
        scroll,
        loading
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

