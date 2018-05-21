<template>
    <div class="search">
        <div class="search-box-wrapper" >
            <search-box placeholder="搜索歌曲" 
            @query='queryChange' ref="searchBox"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li class="item" v-for="item in hotkeys" 
                        :key='item.n' @click="addquery(item.k)" >
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest  ref="suggest" :query="query"></suggest>
        </div>
    </div>
</template>

<script>
import searchBox from "base/search-box/search-box";
import { getHotkey } from "api/search.js";
import suggest from "components/suggest/suggest";
import scroll from "base/scroll/scroll";
export default {
    data(){
        return {
            hotkeys: [], //热门搜索
            query: ''   //搜索内容
        }
    },
    created(){
        this._getHotkey()
    },
    methods:{
        //请求热搜列表
        _getHotkey(){
            getHotkey().then(res=>{
                if (res.code === 0) {
                    this.hotkeys = res.data.hotkey.splice(0,11)
                }
            })
        },
        //将热搜内容添加到搜素框
        addquery(query){
            this.$refs.searchBox.setquery(query)
        },
        //输入框组件内容被改变时
        queryChange(newq){
            this.query = newq
        }
    },
    components:{
        searchBox,
        suggest,
        scroll
    }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

