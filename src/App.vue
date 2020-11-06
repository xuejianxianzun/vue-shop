<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppAside from '@/components/AppAside.vue'
import AppMain from '@/components/AppMain.vue'

@Component({
  components: {
    AppAside,
    AppMain
  }
})
export default class App extends Vue {}
</script>
<style lang="less">
#app {
  height: 100%;
}
</style>
