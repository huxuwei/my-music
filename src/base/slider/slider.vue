<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
          <span class="dot" v-for="(item,index) in imgLeg" :key="index"
          :class="{'active' : index===now}"></span>
      </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props:{
        loop:{
            type: Boolean,
            default: true
        },
        autoPlay:{
            type: Boolean,
            default: true
        },
        interval:{
            type: Number,
            default: 3000
        }
    },
    data(){
        return {
            imgLeg: [],
            now: 0
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.init()
            this.scrollInit()
            if(this.autoPlay){
                this.autoP() 
            }
            
            window.addEventListener('resize',()=>{
                this.init(true)
            })
        })
    },
    activated(){
        //activated 时 重新添加定时器
        if(this.autoPlay){
           this.autoP() 
        }
    },
    deactivated(){
        console.log('deactivated');
        //移除时清理定时器
        clearTimeout(this.timer)
    },
    destoryed(){
        console.log('destroy');
    },
    methods: {
        init(resize){
            let sliderWidth = this.$refs.slider.clientWidth;
            let child = this.$refs.sliderGroup.children;
            // console.log(11111,child.length);
            if(!resize){
                this.imgLeg = new Array(child.length);
            }
            
            let width = 0;
            // console.log(sliderWidth);
            
            for (let i = 0,leg =child.length; i < leg; i++) {
                let item = child[i];
                item.classList.add('slider-item');
                item.style.width = sliderWidth + 'px';
                width += sliderWidth
            }
            // better-scroll 循环播放时会在前后复制两个
            if (this.loop && !resize) {
                width += sliderWidth * 2;
            }
            this.$refs.sliderGroup.style.width =width +'px';
        },
        scrollInit(){
            //初始化scroll
            this.slider = new BScroll(this.$refs.slider,{
                scrollX: true,
                scrollY: false,
                momentum: true,
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
                click:true
            })
            //当一次滑动结束后，将页面的信息(页面数)赋值now
            this.slider.on('scrollEnd',()=>{
                this.now =this.slider.getCurrentPage().pageX
                if (this.loop) {
                    this.autoP()
                }
            })
            //滑动前清理定时器
            this.slider.on('beforeScrollStart',()=>{
                if (this.timer) {
                    clearTimeout(this.timer)
                }
            })
        },
        autoP(){
            this.timer = setTimeout(() => {
                console.log(222222222);
                //下一页面
                this.slider.next(1000)
            }, this.interval);
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
