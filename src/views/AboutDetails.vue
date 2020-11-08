<template>
  <div class="rolesWrap">
    {{ $route.path }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Roles extends Vue {}
</script>

<style lang="less" scoped></style>
