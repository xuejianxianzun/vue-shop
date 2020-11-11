<template>
  <div class="goodsAddWrap">
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <div class="stepsWrap">
        <el-steps :active="stepNumber" finish-status="success" align-center="">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <div class="tabsWrap">
        <el-form
          ref="addGoodsForm"
          :model="formData"
          label-position="left"
          :rules="addFormRules"
        >
          <el-tabs
            v-model="activeTab"
            tab-position="left"
            :before-leave="beforeTabsLeave"
          >
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="addTabs1">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="formData.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  type="number"
                  v-model="formData.goods_price"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input
                  type="number"
                  v-model="formData.goods_weight"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  type="number"
                  v-model.number="formData.goods_number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat"> </el-form-item>

              <div class="casWrap">
                <el-cascader
                  v-model="formData.goods_cat"
                  :options="cateList"
                  :props="{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name'
                  }"
                  clearable
                  ref="chooseRef"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-tab-pane>
            <!-- 商品参数 -->
            <el-tab-pane label="商品参数" name="addTabs2">
              <el-form-item
                v-for="param in paramsData"
                :key="param.attr_id"
                :label="param.attr_name"
              >
                <el-checkbox-group
                  v-model="param.attr_vals"
                  class="checkboxGroup"
                >
                  <el-checkbox
                    v-for="(str, i) in param.attr_vals"
                    :key="i"
                    :label="str"
                    border
                    false-label=""
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <!-- 商品属性 -->
            <el-tab-pane label="商品属性" name="addTabs3">
              <el-form-item
                v-for="attr in attrData"
                :key="attr.attr_id"
                :label="attr.attr_name"
              >
                <el-input v-model="attr.attr_vals[0]"></el-input>
              </el-form-item>
            </el-tab-pane>
            <!-- 商品图片 -->
            <el-tab-pane label="商品图片" name="addTabs4">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                list-type="picture"
                :headers="headerObj"
                :on-success="uploadSuccess"
                :on-remove="uploadRemove"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-tab-pane>
            <!-- 商品内容 -->
            <el-tab-pane label="商品内容" name="addTabs5">
              <quillEditor v-model="formData.goods_introduce"></quillEditor>
              <div class="div">
                <el-button
                  type="primary"
                  class="submitAddBtn"
                  @click="submitData"
                  >{{ mode === 'add' ? '添加商品' : '提交编辑' }}</el-button
                >
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>

    <div class="imgPreviewDialog">
      <el-dialog
        :visible.sync="showImgPreview"
        title="图片预览"
        width="50%"
        :before-close="closePrev"
      >
        <div>
          <img :src="prevImgUrl" alt="" class="prevImg" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue, Watch } from 'vue-property-decorator'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
@Component({
  components: {
    quillEditor
  }
})
export default class GoodsAdd extends Vue {
  stepNumber = 0 // 激活的步骤条

  activeTab = 'addTabs1' // 激活的标签页
  allTabNames = ['addTabs1', 'addTabs2', 'addTabs3', 'addTabs4', 'addTabs5'] // 所有的标签页名称

  // 切换标签页的事件
  beforeTabsLeave() {
    // 要求必须选择了商品分类，才允许切换选项卡
    const len = this.formData.goods_cat.length
    if (len !== 3) {
      this.$message.error('请选择商品分类')
      return false
    }
  }

  // 切换标签页时，跳转到对应的步骤条
  @Watch('activeTab')
  change(newVal) {
    const index = this.allTabNames.findIndex((val) => {
      return val === newVal
    })
    this.stepNumber = index
  }

  // 添加商品的表单数据
  formData = {
    goods_name: '',
    goods_price: 1,
    goods_weight: 0,
    goods_number: 0,
    goods_cat: [],
    goods_introduce: '',
    pics: [],
    attrs: []
  }

  addFormRules = {
    goods_name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' }
    ],
    goods_price: [
      { required: true, message: '请输入商品价格', trigger: 'blur' }
    ],
    goods_weight: [
      { required: true, message: '请输入商品名重量', trigger: 'blur' }
    ],
    goods_number: [
      { required: true, message: '请输入商品数量', trigger: 'blur' },
      { type: 'number', min: 1, message: '商品数量不能为空', trigger: 'blur' }
    ],
    goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
  }

  // 所有分类列表
  cateList = []

  mode: 'add' | 'edit' = 'add'

  chekcMode() {
    if (
      this.$route.path.includes('/edit/') &&
      this.$route.params.id !== undefined
    ) {
      // 如果是编辑商品模式
      this.mode = 'edit'
      this.restoreGoodsData()
    } else {
      this.mode = 'add'
    }
  }

  checkedParamData = []

  async restoreGoodsData() {
    // 查询这个商品的数据
    const res = await this.$httpGet(`goods/${this.$route.params.id}`)
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    // 转换成编辑商品的数据格式
    const d = res.data

    this.formData.goods_name = d.goods_name
    this.formData.goods_price = d.goods_price
    this.formData.goods_weight = d.goods_weight
    this.formData.goods_number = parseInt(d.goods_number)
    this.formData.goods_introduce = d.goods_introduce
    this.formData.goods_cat = [d.cat_one_id, d.cat_two_id, d.cat_three_id]

    // 恢复商品参数数据
    const many = d.attrs.filter((data) => data.attr_sel === 'many')
    for (const d of many) {
      this.paramsData.push({
        attr_id: d.attr_id,
        attr_name: d.attr_name,
        attr_vals: this.splitVals(d.attr_vals)
      })
    }

    // 恢复商品属性数据
    const only = d.attrs.filter((data) => data.attr_sel === 'only')
    for (const d of only) {
      this.attrData.push({
        attr_id: d.attr_id,
        attr_name: d.attr_name,
        attr_vals: d.attr_value
      })
    }

    // 恢复图片数据
    for (const pic of d.pics) {
      this.fileList.push({
        name: pic.pics_big,
        url: pic.pics_big_url,
        response: {
          data: {
            tmp_path: pic.pics_big,
            url: pic.pics_big_url
          }
        }
      })
    }
  }

  async created() {
    this.getCateList()
    this.chekcMode()
  }

  // 获取所有分类数据
  async getCateList() {
    const data = await this.$httpGet('categories')
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.cateList = data.data
  }

  // 储存该分类下的动态参数，修改时也存储到这里。一个分类里可能有多个参数组，所以这里是数组结构
  paramsData = []
  // 储存该分类下的静态属性
  attrData = []

  // 级联选择器变化事件
  async handleChange() {
    // 只允许选中三级分类
    if (this.formData.goods_cat.length !== 3) {
      return (this.formData.goods_cat = [])
    }
    this.paramsData = await this.getParams('many')
    this.attrData = await this.getParams('only')
  }

  // 获取动态参数
  async getParams(sel: 'many' | 'only') {
    return new Promise<[]>(async (resolve, reject) => {
      if (this.formData.goods_cat.length === 0) {
        return resolve([])
      }
      const data = await this.$httpGet(
        `categories/${
          this.formData.goods_cat[this.formData.goods_cat.length - 1]
        }/attributes`,
        { sel }
      )
      if (data.meta.status !== 200) {
        this.$message.error(data.meta.msg)
        return reject
      }

      for (const d of data.data) {
        d.attr_vals = this.splitVals(d.attr_vals)
      }
      return resolve(data.data)
    })
  }

  // 分割属性字符串为数组。去掉空值
  splitVals(vals: string): string[] {
    vals = vals.trim() as string
    if (vals === '') {
      return []
    } else {
      // 通过循环过滤掉空项
      const temp = vals.split(',')
      return temp.filter((value) => value !== '')
    }
  }

  // 上传图片
  headerObj = {
    Authorization: window.sessionStorage.getItem('token')
  }

  fileList = []

  uploadSuccess(response, file, fileList) {
    this.fileList = fileList
  }

  uploadRemove(file, fileList) {
    this.fileList = fileList
  }

  showImgPreview = false

  prevImgUrl = ''
  handlePreview(file) {
    this.prevImgUrl = file.response.data.url
    this.showImgPreview = true
  }

  closePrev() {
    this.showImgPreview = false
  }

  submitData() {
    this.mode === 'add' ? this.submitAddGoods() : this.updateGoods()
  }

  // 根据 fromData 生成添加和编辑所需的数据
  createPostData() {
    // 拷贝到一个新对象上，作为提交的数据
    const data = Object.assign({}, this.formData)
    // 把商品分类转换成字符串
    data.goods_cat = data.goods_cat.join(',')
    // 添加动态参数
    for (const d of this.paramsData) {
      data.attrs.push({
        attr_id: d.attr_id,
        attr_value: d.attr_vals.join(',')
      })
    }
    // 添加静态属性
    for (const d of this.attrData) {
      data.attrs.push({
        attr_id: d.attr_id,
        attr_value: d.attr_vals[0]
      })
    }
    // 添加图片信息
    for (const file of this.fileList) {
      data.pics.push({
        pic: file.response.data.tmp_path
      })
    }
    return data
  }

  // 添加商品
  async submitAddGoods() {
    const r = await this.$refs.addGoodsForm.validate().catch((err) => err)
    if (!r) {
      return this.$message.error('表单验证失败')
    }

    const data = this.createPostData()
    const { data: res } = await this.axios.post('goods', data)
    if (res.meta.status !== 201) {
      this.$message.error(res.meta.msg)
      return
    }

    this.$message.success(res.meta.msg)

    window.setTimeout(() => {
      this.$router.push('/goods')
    }, 500)
  }

  // 编辑商品时更新商品
  async updateGoods() {
    const r = await this.$refs.addGoodsForm.validate().catch((err) => err)
    if (!r) {
      return this.$message.error('表单验证失败')
    }

    const data = this.createPostData()
    const { data: res } = await this.axios.put(
      `goods/${this.$route.params.id}`,
      data
    )
    if (res.meta.status !== 200) {
      this.$message.error(res.meta.msg)
      return
    }

    this.$message.success('编辑商品成功')

    window.setTimeout(() => {
      this.$router.push('/goods')
    }, 500)
  }
}
</script>

<style lang="less" scoped>
.stepsWrap {
  margin-top: 20px;
}
.tabsWrap {
  margin-top: 20px;
  padding-bottom: 20px;
}
.el-cascader {
  min-width: 300px;
}
.checkboxGroup {
  clear: both;
}
.el-checkbox {
  margin: 10px 10px;
}
.prevImg {
  max-width: 100%;
  height: auto;
}
.submitAddBtn {
  margin-top: 15px;
}
</style>
