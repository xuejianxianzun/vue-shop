<template>
  <div class="home">
    home
    <br />
    <el-button @click="logout">logout</el-button>
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
