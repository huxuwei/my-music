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
                probeType:this.probeType,
                click:true
            })
            this.scroll.on('scroll',(pos)=>{
                this.$emit('scroll',pos)
            })
        },
        refresh(){
            this.scroll && this.scroll.refresh();
            console.log('refresh',this.data);
            
        }
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
