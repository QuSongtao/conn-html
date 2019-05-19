<template>
  <div>
    <el-form :inline="true" size="small" class="form-style">
      <el-form-item>
        <el-button type="primary" @click="refresh" style="margin-left: 5px;">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="gridData" :height="tableHeight" :style="{'width': '100%','height': tableHeight}" border>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column type="id" label="主键" width="50" v-if="show"></el-table-column>
      <el-table-column prop="sysCode" label="系统编码" width="100"></el-table-column>
      <el-table-column prop="sysName" label="系统名称" width="200"></el-table-column>
      <el-table-column prop="connType" label="通信方式" width="80" ></el-table-column>
      <el-table-column prop="connProperties" label="连接属性" width="150"></el-table-column>
      <el-table-column prop="connFlag" label="启用标识" width="110">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.connFlag==='1'" type="success" size="medium" class="status-tag-radius">启用中</el-tag>
          <el-tag v-if="scope.row.connFlag==='0'" type="danger" size="medium" class="status-tag-radius">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="changeStatus(scope.row.id, 0)" :disabled="scope.row.connFlag==='0'" v-if="isAdmin">禁用</el-button>
          <el-button size="mini" @click="changeStatus(scope.row.id, 1)" :disabled="scope.row.connFlag==='1'" v-if="isAdmin">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      show: false,
      tableHeight: document.body.clientHeight - 120,
      pageIndex: 1,
      pageSize: 20,
      totalRow: 0,
      gridData: [],
      isAdmin: this.$store.state.isAdmin === '1'
    };
  },
  methods: {
    refresh: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/sysCode/all',
        params: {},
        success: function (res) {
          that.gridData = res.data;
        }
      });
    },
    changeStatus: function (id, value) {
      this.$confirm('确定操作?').then(_ => {
        let that = this;
        this.$http.openApiAxios({
          method: 'POST',
          url: `/mgr/sysCode/${id}/${value}`,
          params: {},
          success: function (res) {
            that.refresh();
          }
        });
      });
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.tableHeight = document.body.clientHeight - 120;
    }, 400);
    that.refresh();
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-form-item{margin-bottom: 3px !important;}
  .form-style{background-color: #fafafa; padding-top: 3px; margin-bottom: 5px;border: 1px solid #e5e5e5}
</style>
