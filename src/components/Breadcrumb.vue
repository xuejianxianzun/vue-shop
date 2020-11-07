<template>
  <div class="breadcrumbWrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="data in breadcrumbData" :key="data.path">
        <router-link :to="data.path" class="link">{{ data.title }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Breadcrumb extends Vue {
  get breadcrumbData() {
    return this.$route.meta.breadcrumb
  }
}
</script>

<style lang="less" scoped>
.link {
  cursor: pointer !important;
  &:hover {
    color: #409EFF!important;
  }
}
</style>
