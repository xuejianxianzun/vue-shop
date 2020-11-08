<template>
  <div class="cateWrap">
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="getParentCateList"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <div class="cateContentWrap">
        <!-- 分类表格 -->
        <el-table
          class="cateTable mainTable"
          :data="cateList"
          row-key="cat_id"
          v-loading="loading"
          border
          :tree-props="{ children: 'children' }"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column prop="cat_name" label="名称"></el-table-column>
          <el-table-column prop="cat_deleted" width="200" label="是否有效">
            <template v-slot="data">
              <el-icon :class="getActiveClass(data.row.cat_deleted)"></el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="cat_level" width="200" label="级别">
            <template v-slot="data2">
              <el-tag v-if="data2.row.cat_level === 0">一级</el-tag>
              <el-tag v-if="data2.row.cat_level === 1" type="success"
                >二级</el-tag
              >
              <el-tag v-if="data2.row.cat_level === 2" type="warning"
                >三级</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template v-slot="data3">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="readyEditCate(data3.row)"
                >编辑</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="readyDeleteCate(data3.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分类页码 -->
        <div class="paginationWrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryCateParams.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryCateParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="showEditDialog" width="40%">
      <div>
        <el-form
          label-width="80px"
          :rules="editCateRule"
          :model="editCateData"
          ref="editForm"
          @submit.native.prevent
        >
          <el-form-item label="分类名称" prop="name">
            <el-input
              v-model="editCateData.name"
              @keydown.native.enter="readySubmitEdit"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="readySubmitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="showAddDialog"
      width="40%"
      @close="resetAdd"
    >
      <div>
        <el-form
          label-width="80px"
          :rules="addCateRule"
          :model="addCateData"
          ref="addForm"
          @submit.native.prevent
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addCateData.name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="chooseCate"
              :options="parentCateList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                checkStrictly: true
              }"
              clearable
              ref="chooseRef"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAdd">取 消</el-button>
        <el-button type="primary" @click="readySubmitAdd">确 定</el-button>
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
  addCate = false
  cateList = []

  queryCateParams = {
    type: '3',
    pagenum: 1,
    pagesize: 10
  }

  total = 0

  loading = true

  created() {
    this.getCateList()
  }

  async getCateList() {
    const data = await this.$httpGet('categories', this.queryCateParams)
    this.loading = false
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.cateList = data.data.result
    this.total = data.data.total
  }

  // 设置有效状态的图标和样式
  activeClass = ['el-icon-success', 'green']
  invalidClass = ['el-icon-error', 'gray']
  getActiveClass(bool: boolean) {
    return bool ? this.invalidClass : this.activeClass
  }

  // 不能为空的规则
  noEmpty = [{ required: true, message: '请输入分类名称', trigger: 'blur' }]

  // 修改分类名称
  editCateData = {
    name: '',
    id: 0
  }

  showEditDialog = false

  editCateRule = {
    name: this.noEmpty
  }

  readyEditCate(cateData) {
    this.editCateData.name = cateData.cat_name
    this.editCateData.id = cateData.cat_id
    this.showEditDialog = true
  }

  async readySubmitEdit() {
    const r = await this.$refs.editForm.validate().catch((err) => err)
    if (!r) {
      return this.$message.error('表单验证未通过')
    }

    const { data: res } = await this.axios.put(
      `categories/${this.editCateData.id}`,
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        cat_name: this.editCateData.name
      }
    )
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }

    this.$message.success(res.meta.msg)
    this.showEditDialog = false
    this.getCateList()
  }

  // 删除分类
  async readyDeleteCate(cateData) {
    const result = await this.$messageBox
      .confirm('你是否要删除这个分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .catch((err) => err)

    if (result !== 'confirm') return

    const { data: res } = await this.axios.delete(
      `categories/${cateData.cat_id}`
    )

    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }

    this.$message.success(res.meta.msg)
    this.getCateList()
  }

  // 添加分类

  showAddDialog = false

  parentCateList = []

  async getParentCateList() {
    const data = await this.$httpGet('categories', {
      type: '2'
    })
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.parentCateList = data.data
    this.showAddDialog = true
  }

  addCateData = {
    name: ''
  }

  chooseCate = []

  addCateRule = {
    name: this.noEmpty
  }

  async readySubmitAdd() {
    const r = await this.$refs.addForm.validate().catch((err) => err)
    if (!r) {
      return this.$message.error('表单验证未通过')
    }

    let pId = 0
    if (this.chooseCate.length > 0) {
      pId = this.chooseCate[this.chooseCate.length - 1]
    }

    const params = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      cat_pid: pId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      cat_name: this.addCateData.name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      cat_level: this.chooseCate.length
    }

    const { data: res } = await this.axios.post('categories', params)
    if (res.meta.status !== 201) {
      return this.$message.error(res.meta.msg)
    }

    this.$message.success(res.meta.msg)
    this.getCateList()
    this.resetAdd()
  }

  resetAdd() {
    this.showAddDialog = false
    this.chooseCate = []
    this.$refs.addForm.resetFields()
  }

  // 页码事件
  handleSizeChange(val: number) {
    this.queryCateParams.pagesize = val
    this.getCateList()
  }

  handleCurrentChange(val: number) {
    this.queryCateParams.pagenum = val
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cateTable {
  .green {
    color: #59ca59;
  }
  .gray {
    color: #ccc;
  }
}
</style>
