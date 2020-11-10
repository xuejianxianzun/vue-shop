<template>
  <div class="goodsListWrap">
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
      <div class="tableWrap">
        <el-table
          :data="goodsListData"
          border
          style="width: 100%"
          stripe
          class="mainTable"
        >
          <el-table-column
            label="序号"
            type="index"
            width="70"
          ></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格（元）"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量"
            width="100"
          ></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="260">
            <template slot-scope="scope">
              {{ formatDate(scope.row.add_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click.native="readyEditGoods(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click.native="confimDeleteGoods(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

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

type Goods = {
  add_time: number
  cat_id: null | number
  cat_one_id: null | number
  cat_three_id: null | number
  cat_two_id: null | number
  goods_id: number
  goods_name: string
  goods_number: number
  goods_price: number
  goods_state: number
  goods_weight: number
  hot_mumber: number
  is_promote: boolean
  upd_time: number
}

type GoodsListData = {
  goods: Goods[]
  pagenum: string
  total: number
}

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

  goodsListData = []

  created() {
    this.getGoodsList()
  }

  showAddGoods = false

  async getGoodsList() {
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
