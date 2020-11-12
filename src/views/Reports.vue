<template>
  <div class="reportsWrap">
    <el-card>
      <div class="echartsWrap">
        <div id="echartsMain" ref="echartsRef"></div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Reports extends Vue {
  option = {
    title: {
      text: '用户来源'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ]
  }

  async mounted() {
    const myChart = window.echarts.init(this.$refs.echartsRef)
    // 绘制图表
    const data = await this.getReportData()
    Object.assign(this.option, data)
    myChart.setOption(this.option)
  }

  async getReportData() {
    const res = await this.$httpGet('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    return res.data
  }
}
</script>

<style lang="less" scoped>
#echartsMain {
  width: 80%;
  height: 500px;
}
</style>
