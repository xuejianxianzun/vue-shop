<template>
  <div class="homeWrap">
    <el-container>
      <el-header></el-header>
      <el-container>
        <el-aside width="260px"></el-aside>
        <el-main>
          <br />
          <el-button @click="logout">logout</el-button>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Home extends Vue {
  logout() {
    window.sessionStorage.removeItem(process.env.VUE_APP_TOKEN_STORE)
    this.$router.push('/login')
  }
}
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
    }
    .el-main {
      height: 100%;
    }
  }
}
</style>
