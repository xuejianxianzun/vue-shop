<template>
  <div id="app">
    <el-container>
      <el-header></el-header>
      <el-aside></el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
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
  min-height: 100vh;
}
</style>
