<template>
    <div class="song-list">
        <ul v-if="songs.length">
            <li v-for="item in songs" :key='item.songid' class="item">
                <div class="content">
                    <h2 class="name">{{item.songname}}</h2>
                    <p class="desc">{{getDesc(item)}}</p>
                </div>
                
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  mounted() {},
  props: {
    songs: {
      type: Array
    }
  },
  methods: {
    getDesc(item) {
      return `${item.singer[0].name}.${item.songname}`;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.song-list {
    // background: $color-background;
    .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: $font-size-medium;

        .rank {
            flex: 0 0 25px;
            width: 25px;
            margin-right: 30px;
            text-align: center;

            .icon {
                display: inline-block;
                width: 25px;
                height: 24px;
                background-size: 25px 24px;

                &.icon0 {
                    // bg-image('first')
                }

                &.icon1 {
                    // bg-image('second')
                }

                &.icon2 {
                    // bg-image('third')
                }
            }

            .text {
                color: $color-theme;
                font-size: $font-size-large;
            }
        }

        .content {
            flex: 1;
            line-height: 20px;
            overflow: hidden;

            .name {
                no-wrap();
                color: $color-text;
            }

            .desc {
                no-wrap();
                margin-top: 4px;
                color: $color-text-d;
            }
        }
    }
}
</style>

