<template>
  <div>
    <el-form :inline="true" :model="formInline">
      <el-form-item>
        <el-button type="primary" @click="refresh">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="gridData" :height="tableHeight" border :style="{'width': '100%','height': tableHeight}">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column type="id" label="主键" width="50" v-if="show"></el-table-column>
      <el-table-column prop="objName" label="队列名称" width="180"></el-table-column>
      <el-table-column prop="objDes" label="队列描述" width="180"></el-table-column>
      <el-table-column prop="objType" label="对象类型" width="50" v-if="show"></el-table-column>
      <el-table-column prop="transferType" label="收发类型" width="180" v-if="show">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.transferType==='S'" type="success" size="medium" class="status-tag-radius">发送</el-tag>
          <el-tag v-if="scope.row.transferType==='R'" type="danger" size="medium" class="status-tag-radius">接收</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="objStatus" label="队列深度" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.objStatus!=='未知' ? 'success' : 'danger'" size="medium" class="status-tag-radius">{{scope.row.objStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remoteSystem" label="远程系统名称" width="180"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow">
    </el-pagination>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      show: false,
      tableHeight: document.body.clientHeight - 150,
      pageIndex: 1,
      pageSize: 20,
      totalRow: 0,
      gridData: []
    };
  },
  methods: {
    refresh: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mq/status/channel',
        params: {
          transferType: this.formInline.region,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        success: function (res) {
          that.totalRow = res.data.page.totalRows;
          that.gridData = res.data.rows;
        }
      });
    },
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.refresh();
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val;
      this.refresh();
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.tableHeight = document.body.clientHeight - 150;
    }, 400);
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-pagination{background-color: #ffffff;}
  .el-form-item{margin-bottom: 10px !important;}
</style>
