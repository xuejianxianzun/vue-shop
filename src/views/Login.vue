<template>
  <div class="loginContainer">
    <div class="loginBox">
      <div class="avatar">
        <img src="../assets/avatar.jpg" alt="" />
      </div>
      <div class="formBox">
        <el-form ref="loginForm" :model="formData" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              prefix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>
          <el-form-item class="btnsWrap">
            <el-button type="primary" @click="submit">登陆</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Login extends Vue {
  formData = {
    username: 'admin',
    password: '123456'
  }

  rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        min: 4,
        max: 20,
        message: '用户名长度在 4 - 20 个字符之间',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        min: 6,
        max: 20,
        message: '密码长度在 6 - 20 个字符之间',
        trigger: 'blur'
      }
    ]
  }

  submit() {
    this.$refs.loginForm.validate(async (result: boolean) => {
      if (!result) {
        return
      }
      const { data } = await this.axios.post('login', this.formData)
      if (data.meta.status === 200) {
        this.$message.success('登录成功')
        window.sessionStorage.setItem(
          process.env.VUE_APP_TOKEN_STORE,
          data.data.token
        )
        this.$router.push({
          path: '/'
        })
      } else {
        if (data.meta.msg) {
          this.$message.error(data.meta.msg)
        } else {
          this.$message.error('登录失败')
        }
      }
    })
  }

  reset() {
    this.$refs.loginForm.resetFields()
  }
}
</script>

<style lang="less" scoped>
.loginContainer {
  background: #2b4b6b;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  .loginBox {
    background: #fff;
    width: 450px;
    height: 300px;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      padding: 8px;
      background: #fff;
      border: 1px solid #ddd;
      overflow: hidden;
      left: 50%;
      transform: translate(-50%);
      top: -60px;
      box-shadow: 0 0 10px #fff;
      box-sizing: border-box;
      position: absolute;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .formBox {
      width: 90%;
      padding-left: 5%;
      margin-top: 110px;
      .btnsWrap {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
