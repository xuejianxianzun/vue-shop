<template>
  <div class="orderListWrap">
    <el-card>
      <!-- 搜索区域 -->
      <div class="searchWrap">
        <el-row :gutter="20">
          <el-col :span="6" class="inputArea">
            <el-input
              placeholder="请输入订单名称"
              v-model="query.query"
              clearable
              @clear="getOrderList"
              @keydown.native.enter="getOrderList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getOrderList"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 表格区域 -->
      <el-table
        :data="orderListData"
        style="width: 100%"
        class="mainTable"
        border
      >
        <el-table-column label="序号" type="index" width="70">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope1">
            <el-tag v-if="scope1.row.pay_status === '0'" type="warning"
              >未付款</el-tag
            >
            <el-tag v-if="scope1.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="order_number" label="下单时间" width="200">
          <template slot-scope="scope">
            {{ formatDate(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope3">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click.native="readyEditOrder(scope3.row)"
              >地址</el-button
            >
            <el-button
              type="success"
              icon="el-icon-location"
              size="small"
              @click.native="logistics(scope3.row)"
              >物流</el-button
            >
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 编辑省市地区的 dialog -->
    <el-dialog
      :visible="showEditLocation"
      title="修改地址"
      width="50%"
      @close="cancelEditLocation"
    >
      <el-form
        ref="locaRef"
        :model="locationForm"
        :rules="locationRules"
        label-width="140px"
      >
        <el-form-item prop="location" label="请选择地区">
          <el-cascader
            v-model="locationForm.location"
            :options="city"
            :props="{
              expandTrigger: 'hover'
            }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="address" label="请输入详细地址">
          <el-input v-model="locationForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditLocation = false">取 消</el-button>
        <el-button type="primary" @click="editLocation">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 显示物流进度的dialog -->
    <el-dialog
      :visible="showLogistics"
      title="物流进度"
      width="50%"
      @close="hideLogistics"
    >
      <div class="timelineWrap">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in logisticsData"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showLogistics = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DateFormat } from '@/utils/DateFormat'
import city from '@/utils/citydata.js'

@Component({
  components: {}
})
export default class GoodsList extends Vue {
  query = {
    query: '',
    pagenum: 1,
    pagesize: 10
  }

  city = city

  total = 0

  orderListData = []

  created() {
    this.getOrderList()
  }

  async getOrderList() {
    const data = await this.$httpGet('orders', this.query)
    if (data.meta.status !== 200) {
      return this.$message.error(data.meta.msg)
    }
    this.total = data.data.total
    this.orderListData = data.data.goods
  }

  formatDate(date: number) {
    return DateFormat.format(date, 'YYYY-MM-DD hh:mm:ss')
  }

  // 页码事件
  handleSizeChange(val: number) {
    this.query.pagesize = val
    this.getOrderList()
  }

  handleCurrentChange(val: number) {
    this.query.pagenum = val
    this.getOrderList()
  }

  // 编辑订单
  showEditLocation = false

  locationForm = {
    location: [],
    address: ''
  }

  locationRules = {
    location: [{ required: true, message: '请选择地区', trigger: 'blur' }],
    address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
  }

  readyEditOrder(data) {
    this.showEditLocation = true
  }

  async editLocation() {
    const r = await this.$refs.locaRef.validate().catch((err) => err)
    if (!r) {
      this.$message.error('表单校验失败')
      return
    }

    this.$message.success('地区修改成功')
    this.showEditLocation = false
  }

  cancelEditLocation() {
    this.showEditLocation = false
    this.$refs.locaRef.resetFields()
  }

  // 物流
  showLogistics = false

  logisticsActive = 0

  logisticsData = []

  async logistics(data) {
    // api 请求有问题，所以直接定义数据
    // const res = await this.$httpGet('/kuaidi/70365716896101')

    // if (res.meta.status !== 200) {
    //   this.$message.error(res.meta.msg)
    //   return
    // }

    // this.logisticsData = res.data
    this.logisticsData = [
      {
        time: '2018-05-10 09:39:00',
        ftime: '2018-05-10 09:39:00',
        context: '已签收,感谢使用顺丰,期待再次为您服务',
        location: ''
      },
      {
        time: '2018-05-10 08:23:00',
        ftime: '2018-05-10 08:23:00',
        context:
          '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
        location: ''
      },
      {
        time: '2018-05-10 07:32:00',
        ftime: '2018-05-10 07:32:00',
        context: '快件到达 [北京海淀育新小区营业点]',
        location: ''
      },
      {
        time: '2018-05-10 02:03:00',
        ftime: '2018-05-10 02:03:00',
        context:
          '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
        location: ''
      },
      {
        time: '2018-05-09 23:05:00',
        ftime: '2018-05-09 23:05:00',
        context: '快件到达 [北京顺义集散中心]',
        location: ''
      },
      {
        time: '2018-05-09 21:21:00',
        ftime: '2018-05-09 21:21:00',
        context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
        location: ''
      },
      {
        time: '2018-05-09 13:07:00',
        ftime: '2018-05-09 13:07:00',
        context: '顺丰速运 已收取快件',
        location: ''
      },
      {
        time: '2018-05-09 12:25:03',
        ftime: '2018-05-09 12:25:03',
        context: '卖家发货',
        location: ''
      },
      {
        time: '2018-05-09 12:22:24',
        ftime: '2018-05-09 12:22:24',
        context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
        location: ''
      },
      {
        time: '2018-05-08 21:36:04',
        ftime: '2018-05-08 21:36:04',
        context: '商品已经下单',
        location: ''
      }
    ]
    this.showLogistics = true
  }

  hideLogistics() {
    this.showLogistics = false
    this.logisticsActive = 0
  }
}
</script>

<style lang="less" scoped></style>
