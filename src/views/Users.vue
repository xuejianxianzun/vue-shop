<template>
  <div class="usersCon">
    <el-card class="box-card">
      <div class="searchWrap">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              placeholder="请输入用户名"
              v-model="query"
              clearable
              @clear="getUserList"
              @keydown.native.enter="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"
            ><el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            ></el-col
          >
        </el-row>
      </div>
      <div class="userListWrap" v-if="usersData.users">
        <div class="tableWrap">
          <el-table :data="usersData.users" border style="width: 100%" stripe>
            <el-table-column
              label="序号"
              type="index"
              width="70"
            ></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column
              prop="role_name"
              label="角色"
              width="160"
            ></el-table-column>
            <el-table-column prop="mg_state" label="状态" width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChange(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click.native="editUser(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click.native="editUser(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="small"
                    @click.native="editUser(scope.row.id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationWrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="usersData.total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 添加用户的弹出层 -->
    <el-dialog
      class="addUserDialog"
      title="添加用户"
      width="30%"
      :visible.sync="dialogVisible"
      @close="resetAddUserForm"
    >
      <div class="addUserFormWrap">
        <el-form
          label-width="80px"
          :model="addUserData"
          :rules="addUserRules"
          ref="addUserForm"
          status-icon
          @keydown.native.enter="addUserFormSubmit"
        >
          <el-form-item label="用户名" prop="username" required>
            <el-input v-model="addUserData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" required>
            <el-input v-model="addUserData.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" required>
            <el-input v-model="addUserData.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile" required>
            <el-input v-model="addUserData.mobile"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserFormCancel">取 消</el-button>
        <el-button type="primary" @click="addUserFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Users extends Vue {
  query = ''
  pagenum = 1
  pagesize = 10

  dialogVisible = false

  addUserData = {
    username: '',
    password: '',
    email: '',
    mobile: ''
  }

  addUserRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' },
      { validator: this.validateEmail, trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { min: 11, max: 15, message: '手机号最低为 11 位', trigger: 'blur' },
      { validator: this.checkPhone, trigger: 'blur' }
    ]
  }

  validateEmail(rule, value, callback) {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (!value) {
      return callback(new Error('邮箱不能为空'))
    }
    setTimeout(() => {
      if (mailReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱格式'))
      }
    }, 100)
  }

  checkPhone(rule, value, callback) {
    const phoneReg = /^1[34578]\d{9}$$/
    if (!value) {
      return callback(new Error('电话号码不能为空'))
    }
    setTimeout(() => {
      // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
      // 所以在前面加了一个+实现隐式转换
      if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (phoneReg.test(value)) {
          callback()
        } else {
          callback(new Error('电话号码格式不正确'))
        }
      }
    }, 100)
  }

  usersData:
    | {
        pagenum: number
        total: number
        users: {
          create_time: number
          email: string
          id: number
          mg_state: boolean
          mobile: string
          role_name: string
          username: string
        }[]
      }
    | {} = {}

  created() {
    this.getUserList()
  }

  async getUserList() {
    const { data: res } = await this.axios.get('users', {
      params: {
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }
    })

    if (res.meta.status !== 200) {
      return this.$message.error('获取用户列表失败')
    }

    this.usersData = Object.assign({}, res.data)
  }

  editUser(id: number) {
    console.log(id)
  }

  handleSizeChange(val: number) {
    this.pagesize = val
    this.getUserList()
  }

  handleCurrentChange(val: number) {
    this.pagenum = val
    this.getUserList()
  }

  async userStateChange(data) {
    console.log(data)
    const { data: res } = await this.axios.put(
      `users/${data.id}/state/${data.mg_state}`
    )
    if (res.meta.status === 200) {
      this.$message.success('修改状态成功')
    } else {
      this.$message.success('修改状态失败')
      // eslint-disable-next-line @typescript-eslint/camelcase
      data.mg_state = !data.mg_state
    }
  }

  resetAddUserForm() {
    this.$refs.addUserForm.resetFields()
  }

  addUserFormCancel() {
    this.resetAddUserForm()
    this.dialogVisible = false
  }

  addUserFormSubmit() {
    this.$refs.addUserForm.validate((valid) => {
      if (valid) {
        this.addUser()
      } else {
        this.$message.error('表单内容不正确')
        return false
      }
    })
  }

  async addUser() {
    const { data: res } = await this.axios.post('users', this.addUserData)
    console.log(res)

    if (res.meta.status !== 201) {
      return this.$message.error('添加用户失败 ' + res.meta.msg)
    }

    this.$message.success('添加用户成功')

    this.addUserFormCancel()

    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px #ccc;
}
.searchWrap {
  .el-input {
    margin-right: 14px;
  }
}
.userListWrap {
  margin-top: 20px;
  overflow: auto;
  .tableWrap {
    min-width: 1000px;
  }
  .paginationWrap {
    margin-top: 15px;
  }
}
.addUserDialog {
  width: 100%;
}
</style>
<style lang="less">
.usersCon .el-dialog__body {
  padding-bottom: 0;
}
</style>
