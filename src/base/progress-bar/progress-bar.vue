<template>
  <div class="progress-bar">
      <div class="bar-inner" ref="progresswrap">
            <div class="progress" ref="progress" ></div>
            <progress-box :progress='width' :maxWidth='maxWidth' 
            @chang='change' @move='move'
             ref="box"></progress-box>
      </div>
  </div>
</template>

<script>
import progressBox from "base/progress-box/progress-box";
import { mapGetters, mapMutations } from 'vuex';
export default {
    props:{
        percentage:{
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            width: 0,   //当前长度
            maxWidth: 0, // 拖动最大长度
            isMove: false   //是否在拖动
        }
    },
    watch:{
        //根据比例设置进度长度
        percentage(){
            //move时不改变
            if (this.isMove) {
                return
            }
            let progresswrap = this.$refs.progresswrap
            let progress = this.$refs.progress
            this.maxWidth=progresswrap.clientWidth - this.GrogressBoxWidth
            let width = this.percentage*this.maxWidth
            progress.style['width']=`${width}px`
            this.width = width
        }
    },
    methods:{
        //进度长拖动完毕，提交事件，并传递歌曲改变到的时间
        change(width){
            this.width = width;
            let percent = width/this.maxWidth;
            
            this.$emit('change',percent);
            this.isMove= false;
        },
        //进度长正在拖动
        move(width){
            // this.width = width
            this.isMove= true
            this.$refs.progress.style['width']=`${width}px`
        },

    },
    computed: {
        // 拖动按钮的宽度
        GrogressBoxWidth() {
                return   this.$refs.box.$el.clientWidth
        },
        ...mapGetters([
            'playSong'
        ])
    },
    components:{
        progressBox
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
        // width: 1px
        // opacity 0
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>