<template>
  <div class="rightsWrap">
    <div class="tableWrap" v-if="rightsList.length > 0">
      <el-card>
        <el-table :data="rightsList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称"> </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row)">{{
                getTagText(scope.row)
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Rights extends Vue {
  rightsList = []

  created() {
    this.getRightsList()
  }

  async getRightsList() {
    const { data: res } = await this.axios.get('rights/list')
    if (res.meta.status !== 200) {
      return this.$message.error('获取权限列表出错')
    }
    this.rightsList = []
    for (const data of res.data) {
      this.rightsList.push(data)
    }
  }

  getTagType(data) {
    switch (data.level) {
      case '0':
        return 'danger'
      case '1':
        return 'warning'
      case '2':
        return 'success'
    }
  }

  getTagText(data) {
    switch (data.level) {
      case '0':
        return '等级一'
      case '1':
        return '等级二'
      case '2':
        return '等级三'
    }
  }
}
</script>
