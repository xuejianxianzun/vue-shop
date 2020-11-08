<template>
  <div class="rolesWrap">
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleShow = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <div class="roleTableWrap" v-if="rolesList.length > 0">
        <el-table
          style="width: 100%"
          border
          class="mainTable"
          :data="rolesList"
        >
          <!-- 权限列表 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="level1 in scope.row.children"
                :key="level1.id"
                class="roleRightsRow"
              >
                <el-col :span="4" class="col1">
                  <el-tag
                    type="danger"
                    closable
                    @close="deleteRightConfirm(scope.row, level1.id)"
                    >{{ level1.authName }}</el-tag
                  >
                  <el-icon class="el-icon-caret-right"></el-icon>
                </el-col>
                <el-col :span="19" class="col2">
                  <el-row
                    v-for="level2 in level1.children"
                    :key="level2.id"
                    class="row2"
                  >
                    <el-col :span="6" class="row2-col1">
                      <el-tag
                        type="success"
                        closable
                        @close="deleteRightConfirm(scope.row, level2.id)"
                        >{{ level2.authName }}</el-tag
                      >
                      <el-icon class="el-icon-caret-right"></el-icon>
                    </el-col>
                    <el-col :span="18" class="level3">
                      <el-tag
                        v-for="level3 in level2.children"
                        :key="level3.id"
                        closable
                        @close="deleteRightConfirm(scope.row, level3.id)"
                        type="warning"
                        >{{ level3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="70" type="index">
          </el-table-column>
          <el-table-column label="角色名称" prop="roleName"> </el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope2">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="readyEditRole(scope2.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteRoleConfirm(scope2.row)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRights(scope2.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleShow"
      width="40%"
      @close="cancelAddRole"
    >
      <div class="addRoleFormWrap">
        <el-form
          :model="addRoleData"
          ref="addRoleForm"
          label-width="80px"
          :rules="addRoleRules"
          @keydown.native.enter="submitAddRole"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addRoleData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="showEditRole"
      width="40%"
      @close="cancelEditRole"
    >
      <div class="editRoleFormWrap">
        <el-form
          :model="editRoleData"
          ref="editRoleForm"
          label-width="80px"
          :rules="addRoleRules"
          @keydown.native.enter="submitEditRole"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editRoleData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditRole = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRightsDialog"
      width="40%"
      @close="showSetRightsDialog = false"
    >
      <div class="setRightsWrap">
        <el-tree
          :props="treeProps"
          :data="rightTreeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultCheckKeys"
          default-expand-all
          ref="rgihtsTree"
        >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitSetRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Roles extends Vue {
  rolesList = []

  created() {
    this.getRolesList()
  }

  async getRolesList() {
    const { data: res } = await this.axios.get('roles')
    if (res.meta.status !== 200) {
      return this.$message.error('获取角色列表出错')
    }
    this.rolesList = res.data
  }

  // 添加角色
  addRoleData = { roleName: '', roleDesc: '' }
  addRoleShow = false

  addRoleRules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
  }

  cancelAddRole() {
    this.$refs.addRoleForm.resetFields()
    this.addRoleShow = false
  }

  async submitAddRole() {
    const r = await this.$refs.addRoleForm.validate().catch((err) => err)
    if (!r) {
      return this.$message.error('表单验证未通过')
    }
    const { data: res } = await this.axios.post('roles', this.addRoleData)
    if (res.meta.status === 201) {
      this.$message.success('添加角色成功')
      this.addRoleShow = false
      this.getRolesList()
    } else {
      return this.$message.error('添加角色失败')
    }
  }

  // 编辑角色
  showEditRole = false
  editRoleData = {}

  async readyEditRole(data) {
    const { data: res } = await this.axios.get(`roles/${data.id}`)
    if (res.meta.status !== 200) {
      return this.$message.error('获取角色数据失败')
    }

    this.editRoleData = Object.assign({}, res.data)
    this.showEditRole = true
  }

  cancelEditRole() {
    this.$refs.editRoleForm.resetFields()
    this.showEditRole = false
  }

  async submitEditRole() {
    const r = await this.$refs.editRoleForm.validate().catch((err) => err)
    if (!r) {
      return this.$message.error('表单验证未通过')
    }
    const { data: res } = await this.axios.put(
      `roles/${this.editRoleData.roleId}`,
      this.editRoleData
    )
    if (res.meta.status === 200) {
      this.$message.success('编辑角色成功')
      this.showEditRole = false
      this.getRolesList()
    } else {
      return this.$message.error('编辑角色失败')
    }
  }

  // 删除角色
  deleteRoleConfirm(data) {
    this.$messageBox
      .confirm('是否要删除此角色？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.deleteRole(data)
      })
      .catch((err) => err)
  }

  async deleteRole(data) {
    const { data: res } = await this.axios.delete(`roles/${data.id}`)
    if (res.meta.status === 200) {
      this.$message.success('删除角色成功')
      this.getRolesList()
    } else {
      return this.$message.error('删除角色失败')
    }
  }

  // 删除权限
  async deleteRightConfirm(row, rightId) {
    const result = await this.$messageBox
      .confirm('是否要删除此权限？', '删除权限', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .catch((err) => err)
    if (result === 'confirm') {
      this.deleteRight(row, rightId)
    }
  }

  async deleteRight(row, rightId) {
    const { data: res } = await this.axios.delete(
      `roles/${row.id}/rights/${rightId}`
    )
    if (res.meta.status === 200) {
      this.$message.success(res.meta.msg)
      // this.getRolesList()
      // 更新局部数据，防止修改整个数据导致重绘表格
      row.children = res.data
    } else {
      return this.$message.error(res.meta.msg)
    }
  }

  // 分配权限
  showSetRightsDialog = false
  rightTreeData = []
  defaultCheckKeys: number[] = []
  editRightRoleId = '0' // 当前在编辑哪个用户的权限，记录他的 id

  treeProps = {
    label: 'authName',
    children: 'children'
  }

  async getRightsTree() {
    return new Promise(async (resolve, reject) => {
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status === 200) {
        resolve(res.data)
      } else {
        this.$message.error(res.meta.msg)
        reject(res.meta.msg)
      }
    })
  }

  getRightIds(node, arr) {
    if (!node.children) {
      arr.push(node.id)
      return
    }

    for (const children of node.children) {
      this.getRightIds(children, arr)
    }
  }

  async showSetRights(roleData) {
    // 获取这个角色的所有第三级权限
    this.defaultCheckKeys = []
    this.getRightIds(roleData, this.defaultCheckKeys)
    this.editRightRoleId = roleData.id
    // 获取整个权限树
    this.rightTreeData = await this.getRightsTree()
    this.showSetRightsDialog = true
  }

  async submitSetRight() {
    const allRightIds = [
      this.$refs.rgihtsTree.getCheckedKeys(),
      this.$refs.rgihtsTree.getHalfCheckedKeys()
    ]
    const { data: res } = await this.axios.post(
      `roles/${this.editRightRoleId}/rights`,
      {
        rids: allRightIds.join(',')
      }
    )
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    this.$message.success(res.meta.msg)
    this.showSetRightsDialog = false
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.rolesWrap {
  .el-tag {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .roleRightsRow {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    &:last-child {
      border: none;
    }
    .el-icon-caret-right {
      margin-left: 10px;
    }
  }
  .col2 {
    padding: 10px 0;
    .row2 {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      &:last-child {
        border: none;
      }
      display: flex;
      align-items: center;
    }
  }
  .level3 {
    .el-tag {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.rolesWrap {
  .el-table__expanded-cell,
  .el-table__expanded-cell[class*='cell'] {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>
