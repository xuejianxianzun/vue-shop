<template>
  <div class="orderListWrap">
    <el-card>
      <!-- 搜索区域 -->
      <div class="searchWrap">
        <el-row :gutter="20">
          <el-col :span="6" class="inputArea">
            <el-input
              placeholder="请输入商品名称"
              v-model="query.query"
              clearable
              @clear="getGoodsList"
              @keydown.native.enter="getGoodsList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"
            ><el-button type="primary" @click="goToAdd"
              >添加商品</el-button
            ></el-col
          >
        </el-row>
      </div>
      <!-- 表格区域 -->

      <!-- 页码 -->
      <div class="paginationWrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="query.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DateFormat } from '@/utils/DateFormat'

@Component({
  components: {}
})
export default class GoodsList extends Vue {
  query = {
    query: '',
    pagenum: 1,
    pagesize: 10
  }

  total = 0

  orderListData = []

  created() {
    this.getOrderList()
  }

  async getOrderList() {
    const data = await this.$httpGet('goods', this.query)
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.total = data.data.total
    this.goodsListData = data.data.goods
  }

  formatDate(date: number) {
    return DateFormat.format(date, 'YYYY-MM-DD hh:mm:ss')
  }

  // 页码事件
  handleSizeChange(val: number) {
    this.query.pagesize = val
    this.getGoodsList()
  }

  handleCurrentChange(val: number) {
    this.query.pagenum = val
    this.getGoodsList()
  }

  // 添加商品
  goToAdd() {
    this.$router.push({
      path: '/goods/add'
    })
  }

  // 编辑商品
  readyEditGoods(data: Goods) {
    console.log(data)
  }

  // 删除商品
  async confimDeleteGoods(data: Goods) {
    const result = await this.$messageBox
      .confirm('是否要删除这个商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .catch((err) => err)

    if (result !== 'confirm') return

    const { data: res } = await this.axios.delete(`goods/${data.goods_id}`)

    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }

    this.$message.success(res.meta.msg)
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped></style>
