<template>
  <div class="appAsideWrap" :class="isCollapse ? 'short' : 'long'">
    <div class="cossWrap">
      <div @click="changeCollapse" class="collapseBtn">
        <i :class="getCollapseIcon"></i>
      </div>
    </div>
    <el-menu
      class="el-menu-app-aside"
      background-color="#343c4b"
      text-color="#fff"
      active-text-color="#409EFF"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <el-submenu
        v-for="menu in $store.state.menuList"
        :key="menu.id"
        :index="'/' + menu.path"
      >
        <template slot="title">
          <i :class="iconList[menu.id]"></i>
          <span>{{ menu.authName }}</span>
        </template>
        <el-menu-item
          v-for="m2 in menu.children"
          :key="m2.id"
          :index="'/' + m2.path"
        >
          <i class="el-icon-menu"></i>
          <span>{{ m2.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as type from '../store/type'
@Component
export default class AppAside extends Vue {
  iconList = {
    125: 'iconfont icon-user',
    103: 'iconfont icon-tijikongjian',
    101: 'iconfont icon-shangpin',
    102: 'iconfont icon-danju',
    145: 'iconfont icon-user icon-baobiao'
  }

  isCollapse = false

  created() {
    this.getMenuList()
  }

  async getMenuList() {
    const { data: res } = await this.axios.get('menus')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    this.$store.commit(type.setMenuList, res.data)
  }

  changeCollapse() {
    this.isCollapse = !this.isCollapse
  }

  get getCollapseIcon() {
    return this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
  }

  get activePath() {
    return this.$route.path
  }
}
</script>

<style lang="less" scoped>
.appAsideWrap {
  color: #fff;
  &.short {
    width: 64px;
  }
  &.long {
    width: 200px;
  }
  .iconfont {
    margin-right: 10px;
    font-size: 20px;
  }

  .el-menu {
    border: none;
    border-right: none;
  }

  .collapseBtn {
    width: 100%;
    height: 40px;
    background: #475165;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 20px;
    }
  }
}
</style>

<style lang="less"></style>
