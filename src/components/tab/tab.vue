<template>
    <div class="tab">
        <router-link to="/recommend" tag='div' class="tab-item">
            <span class="tab-link">推荐</span>
        </router-link>
        <!-- <router-link to="/singer" tag='div' class="tab-item">
            <span class="tab-link">歌手</span>
        </router-link>
        <router-link to="/rank" tag='div' class="tab-item">
            <span class="tab-link">排行</span>
        </router-link> -->
        <router-link to="/search" tag='div' class="tab-item">
            <span class="tab-link">搜索</span>
        </router-link>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable'
// @import '../../common/stylus/mixin'
.tab
    display flex 
    justify-content space-around
    height 44px
    line-height 44px
    .tab-item
        .tab-link
            padding-bottom 3px
    .router-link-active
        .tab-link
            color $color-theme
            border-bottom 2px solid  $color-theme
</style>

