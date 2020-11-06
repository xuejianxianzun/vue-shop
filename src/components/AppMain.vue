<template>
  <section class="appMain">
    <MainHeader></MainHeader>
    <router-view></router-view>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MainHeader from '@/components/MainHeader.vue'

@Component({
  components: {
    MainHeader
  }
})
export default class AppMain extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped lang="less">
.appMain{
  background: #eee;
  width: 100%;
}
</style>
