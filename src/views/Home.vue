<template>
  <div class="homeWrap">
    <el-container>
      <el-header>
        <AppHeader></AppHeader>
      </el-header>
      <el-container>
        <el-aside> <AppAside></AppAside> </el-aside>
        <el-main>
          <Breadcrumb v-if="$route.path !== '/'" class="breadcrumbComponent"></Breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AppHeader from '@/components/AppHeader.vue'
const AppAside = () => import('@/components/AppAside.vue')
const Breadcrumb = () => import('@/components/Breadcrumb.vue')

@Component({
  components: {
    AppHeader,
    AppAside,
    Breadcrumb
  }
})
export default class Home extends Vue {}
</script>

<style lang="less" scoped>
.homeWrap {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background: #363d40;
    }
    .el-aside {
      background: #343c4b;
      height: 100%;
      width: auto !important;
    }
    .el-main {
      background: #EAEDF1;
      height: 100%;
    }
  }
}
.breadcrumbComponent{
  margin-bottom: 15px;
}
</style>
