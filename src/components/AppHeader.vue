<template>
  <section class="appHeader">
    <div class="left">
      <div class="logoImg"><img src="../assets/avatar.jpg" alt="" /></div>
      <h1 class="title">电商后台管理系统</h1>
    </div>
    <div class="right">
      <div class="logoutWrap">
        <el-button @click="logout" type="info">退出</el-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as type from '../store/type'

@Component
export default class AppHeader extends Vue {
  logout() {
    this.$store.commit(type.clearToken)
    this.$router.push('/login')
  }
}
</script>

<style scoped lang="less">
@headerHeight: 60px;
.appHeader {
  color: #fff;
  display: flex;
  width: 100%;
  max-height: @headerHeight;
  justify-content: space-between;
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .logoImg {
      width: 60px;
      border-radius: 50%;
      height: @headerHeight;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      margin-right: 16px;
    }
    .title {
      font-size: 22px;
      font-weight: normal;
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .logoutWrap {
    }
  }
}
</style>
