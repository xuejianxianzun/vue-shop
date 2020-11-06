<template>
  <div class="about">
    {{$route.params.id}}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class AboutDetails extends Vue {}
</script>
