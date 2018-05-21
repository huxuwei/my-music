<template>
  <div id="app" @click.prevent="fn">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header"
import Tab from "components/tab/tab";
import Player from "components/player/player";
export default {
  name: "App",
  components:{
    MHeader,
    Tab,
    Player
  },
  methods:{
    fn(){}
  }
}
</script>

<style>
</style>
