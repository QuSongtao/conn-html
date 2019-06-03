<template>
  <div>
    <el-form :inline="true" :model="formInline" size="small" class="form-style">
      <el-form-item label="通道类型:" label-width="90px">
        <el-select v-model="formInline.region" placeholder="请选择" style="width: 120px;" @change="refresh">
          <el-option label="全部通道" value="A"></el-option>
          <el-option label="发送通道" value="S"></el-option>
          <el-option label="接收通道" value="R"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refresh">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="gridData" :height="tableHeight" :style="{'width': '100%','height': tableHeight}" border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column type="id" label="主键" width="50" v-if="show"></el-table-column>
      <el-table-column prop="objName" label="通道名称" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="objDes" label="通道描述" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="objType" label="对象类型" width="50" v-if="show"></el-table-column>
      <el-table-column prop="transferType" label="收发类型" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.transferType==='S'">发送通道</span>
          <span v-if="scope.row.transferType==='R'">接收通道</span>
        </template>
      </el-table-column>
      <el-table-column prop="objStatus" label="通道状态" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.objStatus==='正在运行' ? 'success' : 'danger'" size="medium" class="status-tag-radius">
            {{scope.row.objStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remoteSystem" label="远程系统名称" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right" v-if="isAdmin">
        <template slot-scope="scope">
          <el-button size="mini" @click="stopChannel(scope.$index, scope.row)" :disabled="scope.row.connFlag==='已停止'"
                     v-if="isAdmin">停止
          </el-button>
          <el-button size="mini" @click="resetChannel(scope.$index, scope.row)" :disabled="scope.row.connFlag!=='已停止'"
                     v-if="isAdmin">重置
          </el-button>
          <el-button size="mini" @click="startChannel(scope.$index, scope.row)" :disabled="scope.row.connFlag==='正在运行'"
                     v-if="isAdmin">启动
          </el-button>
        </template>
      </el-table-column>
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
      formInline: {
        region: null
      },
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
        url: '/mq/status/channel',
        params: {
          transferType: this.formInline.region === 'A' ? null : this.formInline.region,
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
    },
    stopChannel: function (index, row) {
      this.controlChannel(row.objName, 29);
    },
    resetChannel: function (index, row) {
      this.controlChannel(row.objName, 27);
    },
    startChannel: function (index, row) {
      this.controlChannel(row.objName, 28);
    },
    controlChannel: function (channelName, handleCode) {
      this.$confirm('确定操作?').then(_ => {
        let that = this;
        this.$http.openApiAxios({
          method: 'POST',
          url: '/mq/status/ctl',
          params: {
            channelName: channelName,
            handleCode: handleCode
          },
          success: function (res) {
            let msgType = 'success';
            if (res.meta.code === 0) {
              msgType = 'error';
            }
            that.$message({
              showClose: true,
              message: res.data,
              type: msgType
            });
          }
        });
      });
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
  .status-tag-radius {
    border-radius: 14px !important;
  }

  .el-form-item {
    margin-bottom: 3px !important;
  }

  .form-style {
    background-color: #fafafa;
    padding-top: 3px;
    margin-bottom: 5px;
    border: 1px solid #e5e5e5
  }
</style>
