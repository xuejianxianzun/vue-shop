<template>
  <section class="mainHeaderWrap">
    <header>1111111</header>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MainHeader extends Vue {
  @Prop() private msg!: string
}
</script>

<style scoped lang="less">
.mainHeaderWrap {
  background: #acc;
  width: 100%;
  min-height: 60px;
}
</style>
