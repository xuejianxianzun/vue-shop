<template>
  <div id="app">
    <AppAside></AppAside>
    <AppMain></AppMain>
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
<style lang="less" scoped>
#app {
  display: flex;
}
</style>
