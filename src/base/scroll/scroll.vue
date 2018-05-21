<template>
  <div  ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
    props:{
        probeType:{
            type: Number,
            default: 1
        },
        data:{
            type: Array,
            default:[]
        },
        pullUpLoad:{
            type:[Object,Boolean],
            default: false
        },
        scrollX:{
            type: Boolean,
            default: false
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.init()
        })
    },
    methods:{
        init(){
            if (!this.$refs.wrapper) {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                freeScroll:true,
                probeType:this.probeType,
                click:true,
                pullUpLoad:this.pullUpLoad
            })
            // 监听滚动事件
            this.scroll.on('scroll',(pos)=>{
                this.$emit('scroll',pos)
            })

            if (this.pullUpLoad) {
                this.scroll.on('pullingUp',()=>{
                    this.$emit('pullingUp')
                })
            }
        },
        refresh(){
            this.scroll && this.scroll.refresh();
            console.log('refresh',this.data);
        },
        //下拉加载数据加载完毕需要调用这个方法
        finishPullUp(){
            this.scroll && this.scroll.finishPullUp()
            // console.log('finishPullUp');
            
        }
        // scrollEnd(){
        //     this.scroll && this.scroll.scrollEnd()
        // }
    },
    watch:{
        data(){
            this.refresh()
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>
