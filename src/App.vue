<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  created() {
    console.log(process.env.NODE_ENV)
  }
}
</script>
<style lang="less">
#app {
  height: 100%;
  min-width: 1300px;
}
@media screen and (max-width: 750px) {
  #app {
  height: 100%;
  min-width: 750px;
}
}
</style>
