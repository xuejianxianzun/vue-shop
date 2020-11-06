<template>
  <div class="about">about
    <br>
    <router-link :to="{path:'/about/11'}">11111</router-link>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class About extends Vue {}
</script>
