<template>
  <div class="progress-box" ref="wrapper"
  @touchstart='start' @touchmove='move' @touchend='end'  >
      <div class="btn"></div>
  </div>
</template>

<script>
export default {
    props:{
        progress:{
            type: Number,
            default : 0
        },
        maxWidth:{
            type:Number,
            default: 0
        }
    },
    data(){
        return {
            isMove: false
        }
    },
    watch:{
        progress(){
            if (this.isMove) {
                return
            }
            this.$refs.wrapper.style['transform'] = `translateX(${this.progress}px)`
        }
    },
    methods:{
        start(e){
            this.isMove = true
            this.startX =  e.changedTouches[0].pageX
        },
        move(e){
        //    console.log(e);
           
          let disX = e.changedTouches[0].pageX - this.startX;
        //    console.log(disX);
            
           this.translateX = this.progress + disX;
            this.translateX = Math.max(this.translateX,0);
            this.translateX = Math.min(this.translateX,this.maxWidth);

            this.$refs.wrapper.style['transform'] = `translateX(${this.translateX}px)`
            this.$emit('move',this.translateX)
        },
        end(){
            this.$emit('chang',this.translateX)
            this.isMove = false
        }
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/variable"
    .progress-box
        position: absolute
        left: 0px
        top: -6px
        width: 13px
        height: 13px
        .btn
            position absolute
            width: 10px
            height: 10px
            border-radius: 50%
            border: 3px solid  #fff
            // box-sizing border-box
            background-color: $color-theme
</style>
