<template>
  <div class="goodsParamsWrap">
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择分类 -->
      <el-row class="chooseCateWrap">
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="chooseCate"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name'
            }"
            clearable
            ref="chooseRef2"
            @change="cascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 参数和属性区域 -->
      <div class="tabsWrap">
        <el-tabs v-model="activeName" @tab-click="tabsClick">
          <!-- 动态参数 -->
          <el-tab-pane label="动态参数" name="async">
            <el-row>
              <el-col>
                <el-button
                  :disabled="chooseCate.length === 0"
                  type="primary"
                  @click="showAddAttriDialog = true"
                  >添加参数</el-button
                >
              </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table
              :data="attrList"
              border
              style="width: 100%"
              class="mainTable"
            >
              <el-table-column type="expand">
                <template slot-scope="scope1">
                  <el-tag
                    v-for="val in getValList(scope1.row.attr_vals)"
                    :key="val"
                    class="attrValTag"
                    closable
                    @close="deleteVal(scope1.row, val)"
                    disable-transitions
                    >{{ val }}</el-tag
                  >
                  <el-input
                    v-if="scope1.row.showInput"
                    v-model="scope1.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    class="saveTagInputEl"
                    @keyup.enter.native="handleInputConfirm(scope1.row)"
                    @blur="handleInputConfirm(scope1.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="mini"
                    @click="showTagInput(scope1.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="attr_id" label="序号"> </el-table-column>
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editAttr(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteAttr(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态属性 -->
          <el-tab-pane label="静态属性" name="static">
            <el-row>
              <el-col>
                <el-button
                  :disabled="chooseCate.length === 0"
                  type="primary"
                  @click="showAddAttriDialog = true"
                  >添加属性</el-button
                >
              </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table
              :data="attrList"
              border
              style="width: 100%"
              class="mainTable"
            >
              <el-table-column type="expand">
                <template slot-scope="scope1">
                  <el-tag
                    v-for="val in getValList(scope1.row.attr_vals)"
                    :key="val"
                    class="attrValTag"
                    closable
                    @close="deleteVal(scope1.row, val)"
                    disable-transitions
                    >{{ val }}</el-tag
                  >
                  <el-input
                    v-if="scope1.row.showInput"
                    v-model="scope1.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    class="saveTagInputEl"
                    @keyup.enter.native="handleInputConfirm(scope1.row)"
                    @blur="handleInputConfirm(scope1.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="mini"
                    @click="showTagInput(scope1.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="attr_id" label="序号"> </el-table-column>
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editAttr(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteAttr(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 添加参数的 dialog -->
    <el-dialog
      :visible.sync="showAddAttriDialog"
      width="50%"
      :title="activeName === 'static' ? '添加属性' : '添加参数'"
      @close="cancelAddAttr"
    >
      <el-form
        ref="addAttrForm"
        :model="addAttrData"
        label-width="80px"
        :rules="addAttrRule"
        @submit.native.prevent
      >
        <el-form-item
          :label="activeName === 'static' ? '属性名称' : '参数名称'"
          prop="name"
        >
          <el-input
            v-model="addAttrData.name"
            @keydown.native.enter="readySubmitAddAttr"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddAttr">取 消</el-button>
        <el-button type="primary" @click="readySubmitAddAttr">添 加</el-button>
      </span></el-dialog
    >

    <!-- 编辑参数名称的 dialog -->
    <el-dialog
      :visible.sync="showEditAttriDialog"
      width="50%"
      :title="activeName === 'static' ? '编辑属性' : '编辑参数'"
      @close="cancelEditAttr"
    >
      <el-form
        ref="editAttrForm"
        :model="editAttrData"
        label-width="80px"
        :rules="addAttrRule"
        @submit.native.prevent
      >
        <el-form-item
          :label="activeName === 'static' ? '属性名称' : '参数名称'"
          prop="name"
        >
          <el-input
            v-model="editAttrData.name"
            @keydown.native.enter="readySubmitEditAttr"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditAttr">取 消</el-button>
        <el-button type="primary" @click="readySubmitEditAttr">添 加</el-button>
      </span></el-dialog
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
type AttrData = {
  attr_id: number
  attr_name: string
  cat_id: number
  attr_sel: string
  attr_write: string
  attr_vals: string
}

@Component({
  components: {}
})
export default class GoodsParams extends Vue {
  chooseCate = []
  activeName: 'static' | 'async' = 'async'

  tabsClick(tab) {
    this.activeName = tab.name
  }

  @Watch('activeName')
  change() {
    this.getAttrList()
  }

  cateList = []

  created() {
    this.getCateList()
  }

  // 获取所有分类数据

  async getCateList() {
    const data = await this.$httpGet('categories')
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.cateList = data.data
  }

  // 获取参数数据
  cascaderChange() {
    this.getAttrList()
  }

  attrList = [] // 当前分类的属性数据

  // 当请求参数数据时，根据当前选项卡，判断获取静态属性还是动态参数
  getSel() {
    return this.activeName === 'static' ? 'only' : 'many'
  }

  async getAttrList() {
    if (this.chooseCate.length === 0) {
      return
    }
    const data = await this.$httpGet(
      `categories/${this.chooseCate[this.chooseCate.length - 1]}/attributes`,
      { sel: this.getSel() }
    )
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }

    // 添加用于控制“ new tag ” 按钮的数据
    for (const attrData of data.data) {
      attrData.showInput = false
      attrData.inputValue = ''
    }

    this.attrList = data.data
  }

  // 属性的标签 val 是字符串，用空格分割
  getValList(val: string) {
    const result = []
    const temp = val.split(',')
    for (const str of temp) {
      if (str !== '') {
        result.push(str)
      }
    }
    return result
  }

  // 编辑参数
  showEditAttriDialog = false
  editAttrData = {
    name: '',
    id: 0
  }

  async editAttr(attrData: AttrData) {
    const data = await this.$httpGet(
      `categories/${this.chooseCate[this.chooseCate.length - 1]}/attributes/${
        attrData.attr_id
      }`,
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        attr_sel: this.getSel()
      }
    )
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.editAttrData.name = data.data.attr_name
    this.editAttrData.id = data.data.attr_id
    this.showEditAttriDialog = true
  }

  cancelEditAttr() {
    this.$refs.editAttrForm.resetFields()
    this.showEditAttriDialog = false
  }

  // 更新属性的 val（增、删），以及更新属性的 name
  // eslint-disable-next-line @typescript-eslint/camelcase
  putAttr(cateid, attrid, attr_name, attr_sel, attr_vals = '') {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const params = { attr_name, attr_sel, attr_vals }
    return this.axios.put(`categories/${cateid}/attributes/${attrid}`, params)
  }

  async readySubmitEditAttr(attrData: AttrData) {
    const r = await this.$refs.editAttrForm.validate()
    if (!r) {
      return this.$message.error('表单验证失败')
    }
    const id = this.chooseCate[this.chooseCate.length - 1]

    const { data: res } = await this.putAttr(
      id,
      this.editAttrData.id,
      this.editAttrData.name,
      this.getSel()
    )

    if (res.meta.status === 200) {
      this.$message.success(res.meta.msg)
      this.cancelEditAttr()
      this.getAttrList()
    } else {
      this.$message.error(res.meta.msg)
    }
  }

  // 删除参数
  async deleteAttr(attrData: AttrData) {
    const result = await this.$messageBox
      .confirm('确定删除此项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .catch((err) => err)

    if (result !== 'confirm') return

    const id = this.chooseCate[this.chooseCate.length - 1]
    const { data: res } = await this.axios.delete(
      `categories/${id}/attributes/${attrData.attr_id}`
    )

    if (res.meta.status === 200) {
      this.$message.success(res.meta.msg)
      this.getAttrList()
    } else {
      this.$message.error(res.meta.msg)
    }
  }

  // 添加参数
  showAddAttriDialog = false

  noEmpty = [{ required: true, message: '请输入名称', trigger: 'blur' }]

  addAttrData = {
    name: ''
  }

  addAttrRule = {
    name: this.noEmpty
  }

  cancelAddAttr() {
    this.$refs.addAttrForm.resetFields()
    this.showAddAttriDialog = false
  }

  async readySubmitAddAttr() {
    const r = await this.$refs.addAttrForm.validate()
    if (!r) {
      return this.$message.error('表单验证失败')
    }
    const id = this.chooseCate[this.chooseCate.length - 1]
    const { data: res } = await this.axios.post(`categories/${id}/attributes`, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      attr_name: this.addAttrData.name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      attr_sel: this.getSel()
    })

    if (res.meta.status === 201) {
      this.$message.success(res.meta.msg)
      this.cancelAddAttr()
      this.getAttrList()
    } else {
      this.$message.error(res.meta.msg)
    }
  }

  // 删除参数的标签 val
  // 传递的是这个参数的所有数据，以及要删除的标签
  async deleteVal(attrData: AttrData, val: string) {
    // 从这个参数的标签里删除指定的标签，然后更新
    const temp = attrData.attr_vals.split(',')
    const r = []
    for (const str of temp) {
      if (str !== val) {
        r.push(str)
      }
    }
    const result = r.join(',')
    const id = this.chooseCate[this.chooseCate.length - 1]

    // eslint-disable-next-line @typescript-eslint/camelcase
    const { data: res } = await this.putAttr(
      id,
      attrData.attr_id,
      attrData.attr_name,
      this.getSel(),
      result
    )

    if (res.meta.status === 200) {
      this.$message.success(res.meta.msg)
      this.attrList.forEach((data) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        if (data.attr_id === attrData.attr_id) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          data.attr_vals = res.data.attr_vals
        }
      })
    } else {
      this.$message.error(res.meta.msg)
    }
  }

  // 添加参数的标签 val
  showTagInput(arrtDataWithNewTag) {
    arrtDataWithNewTag.showInput = true
    this.$nextTick((_) => {
      this.$refs.saveTagInput.$refs.input.focus()
    })
  }

  timeFlag = 0 // 防抖数据

  async handleInputConfirm(arrtDataWithNewTag) {
    // 因为这个函数可能会短时间内多次触发：第一次是输入框 enter 触发，接下来输入框被隐藏了，会第二次触发。所以定义一个触发间隔，到时候把标记复位
    if (this.timeFlag === 0) {
      this.timeFlag = window.setTimeout(() => {
        window.clearTimeout(this.timeFlag)
        this.timeFlag = 0
      }, 500)
    } else {
      return
    }
    // 检查空值
    const str = arrtDataWithNewTag.inputValue.trim()
    if (str === '') {
      arrtDataWithNewTag.showInput = false
      arrtDataWithNewTag.inputValue = ''
      this.$message.error('输入内容不合法')
      return
    }
    // 检查重复的值
    const existsTags = arrtDataWithNewTag.attr_vals.split(',')
    let flag = false
    for (const s of existsTags) {
      if (s === str) {
        flag = true
        break
      }
    }
    if (flag) {
      arrtDataWithNewTag.showInput = false
      arrtDataWithNewTag.inputValue = ''
      this.$message.error('输入内容已存在')
      return
    }

    const id = this.chooseCate[this.chooseCate.length - 1]
    const newVal = arrtDataWithNewTag.attr_vals + ',' + str

    const { data: res } = await this.putAttr(
      id,
      arrtDataWithNewTag.attr_id,
      arrtDataWithNewTag.attr_name,
      this.getSel(),
      newVal
    )

    arrtDataWithNewTag.showInput = false
    arrtDataWithNewTag.inputValue = ''

    if (res.meta.status === 200) {
      this.$message.success(res.meta.msg)
      this.attrList.forEach((data) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        if (data.attr_id === arrtDataWithNewTag.attr_id) {
          // eslint-disable-next-line @typescript-eslint/camelcase
          data.attr_vals = res.data.attr_vals
        }
      })
    } else {
      this.$message.error(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.chooseCateWrap {
  margin-top: 15px;
}
.el-tag.attrValTag {
  margin: 10px;
}
.saveTagInputEl {
  display: inline-block;
  width: 200px;
  min-width: 200px;
  max-width: 300px;
}
</style>
