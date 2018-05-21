<template>
    <div class="recommend">
        <scroll class="recommend-content" :data='SongList' ref="scroll"
        :scrollX='true'>
          <div>
            <div class="slider-wrapper" v-if="recommendList.length">
                <slider>
                    <div v-for="item in recommendList" :key='item.dissid'>
                    <a :href="item.linkUrl">
                        <img @load="imgLoad" :src="item.picUrl" alt="">
                    </a>
                </div>
                </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                    <li v-for="item in SongList" :key="item.dissid" class="item"
                    @click="Songlist(item)">
                        <div class="icon">
                            <img width="60" height="60" v-lazy="item.imgurl" alt="">
                        </div>
                        <div class="text">
                            <h2 class="name">{{item.dissname}}</h2>
                            <p class="desc">{{item.creator.name}}</p>
                        </div>
                    </li>
                </ul>
            </div>
          </div>  
          <div class="loading-container" v-show="!SongList.length">
              <loading></loading>
          </div>
        </scroll>
        <router-view name='songlist'></router-view>
    </div>
</template>

<script>
import { getTopList, getList } from "api/recommend.js";
import { CodeOk } from "api/config.js";
import slider from "base/slider/slider";
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      recommendList: [],
      SongList: [],
      isimgLoad: true
    };
  },
  created() {
    this.getRecommend(), this.getSongList();
  },
  methods: {
    ...mapMutations({
        setSongListInfo: 'set_songListInfo'
    }),
    //获取轮播图数据
    getRecommend() {
      getTopList().then(res => {
        if (res.code === CodeOk) {
          this.recommendList = res.data.slider;
        }
      });
    },
    //获取推荐列表
    getSongList() {
      getList().then(res => {
        if (res.code === CodeOk) {
          this.SongList = res.data.list;
        }
      });
    },
    //如果图片加载完成，重新加载scroll
    imgLoad() {
      if (this.isimgLoad) {
        this.$refs.scroll.refresh();
        this.isimgLoad = false;
      }
    },
    Songlist(item){
        this.$router.push({
            path: `/recommend/${item.dissid}`
        })
        this.setSongListInfo(item)
        
    },
    
  },
  components: {
    slider,
    scroll,
    loading
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';

.recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .recommend-content {
        height: 100%;
        overflow: hidden;

        .slider-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }

        .recommend-list {
            .list-title {
                height: 65px;
                line-height: 65px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-theme;
            }

            .item {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                padding: 0 20px 20px 20px;

                .icon {
                    flex: 0 0 60px;
                    width: 60px;
                    padding-right: 20px;
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 20px;
                    overflow: hidden;
                    font-size: $font-size-medium;

                    .name {
                        margin-bottom: 10px;
                        color: $color-text;
                    }

                    .desc {
                        color: $color-text-d;
                    }
                }
            }
        }

        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>

