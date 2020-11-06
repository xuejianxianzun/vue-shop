<template>
  <aside class="appAside">
    <router-link to="/">index</router-link>
    <br>
    <router-link to="/home">home</router-link>
    <br>
    <router-link to="/about">about</router-link>
  </aside>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class AppAside extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped lang="less">
.appAside{
  flex-basis: 320px;
  flex-shrink: 0;
  background: #bbb;
  height: 100vh;
}
</style>
