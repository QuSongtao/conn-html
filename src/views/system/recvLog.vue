<template>
  <div>
    <el-form :inline="true" :model="formInline" size="mini" class="form-style">
      <el-form-item label="接收时间：" required label-width="110px">
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择起始日期" value-format="yyyy-MM-dd" v-model="formInline.date1" style="width: 130px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker type="date" placeholder="选择终止日期" value-format="yyyy-MM-dd" v-model="formInline.date2" style="width: 130px;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="发送者：" label-width="70px">
        <el-select v-model="formInline.sender" placeholder="请选择" clearable style="width: 190px;">
          <el-option v-for="item in selectOptions" :label="item.sysName" :value="item.sysCode" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电文ID：" label-width="70px">
        <el-input v-model="formInline.telId" placeholder="输入电文ID" clearable style="width: 130px;"></el-input>
      </el-form-item>
      <el-form-item label="处理状态：" label-width="90px">
        <el-select v-model="formInline.dealFlag" placeholder="请选择" clearable style="width: 130px;">
          <el-option label="处理失败" value="0"></el-option>
          <!--<el-option label="触发器失败" value="9"></el-option>-->
          <el-option label="处理成功" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" plain @click="reDeal" v-if="this.$store.state.isAdmin === '1'">重接</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="gridData"
              :height="tableHeight"
              :style="{'width': '100%','height': tableHeight}"
              ref="tableRecvLog"
              border
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column type="id" label="主键" width="60" v-if="show"></el-table-column>
      <el-table-column prop="telId" label="电文ID" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="senderName" label="发送者" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiverName" label="接收者" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="recvTime" label="接收时间" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dealTime" label="处理时间" width="170" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dealFlag" label="处理状态" width="130" :formatter="statusFormat">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.dealFlag === '0' ? 'red' : ''}">
            {{statusFormat(scope.row.dealFlag)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="des" label="处理结果" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="msgId" label="消息ID" v-if="show"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleInfo(scope.$index, scope.row)">消息详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div></div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow">
    </el-pagination>
    <el-dialog
      title="消息内容"
      v-dialogDrag
      :visible.sync="dialogVisible"
      width="450px">
      <div style="border: 1px solid #cccccc;height: 200px;width: 100%;word-wrap:break-word;overflow-y: auto">{{msgText}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
  .el-dialog__body {
    padding: 5px 5px 0 5px !important;
    font-size: 12px !important;
  }
</style>
<script>
import _ from 'lodash';
export default {
  data () {
    return {
      show: false,
      multipleSelection: [],
      pageIndex: 1,
      pageSize: 20,
      totalRow: 0,
      msgText: '',
      dialogVisible: false,
      tableHeight: document.body.clientHeight - 150,
      formInline: {
        telId: '',
        date1: this.$util.formatDate(new Date()),
        date2: this.$util.formatDate(new Date())
      },
      gridData: [],
      selectOptions: []
    };
  },
  methods: {
    // 查询按钮
    query: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/recvLog/data',
        params: {
          dtStart: this.formInline.date1,
          dtEnd: this.formInline.date2,
          telId: this.formInline.telId,
          sender: this.formInline.sender,
          dealFlag: this.formInline.dealFlag,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        success: function (res) {
          that.totalRow = res.data.page.totalRows;
          that.gridData = res.data.rows;
        }
      });
    },
    // 处理状态格式化
    statusFormat: function (cellValue) {
      switch (cellValue) {
        case '0':
          return '业务处理失败';
        case '1':
          return '业务处理成功';
        case '9':
          return '触发器失败';
        default:
          return '未知';
      }
    },
    handleInfo: function (index, row) {
      this.msgId = row.msgId;
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/recvLog/message',
        params: {
          msgId: row.msgId
        },
        success: function (res) {
          that.msgText = res.data;
          that.dialogVisible = true;
        }
      });
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
    },
    reDeal: function () {
      if (this.multipleSelection.length > 0) {
        let ids = [];
        let that = this;
        for (let m = 0; m < this.multipleSelection.length; m++) {
          ids.push(this.multipleSelection[m].id);
        }
        this.$http.openApiAxios({
          method: 'POST',
          url: '/mgr/recvLog/reDeal',
          params: {
            ids: ids.join()
          },
          success: function (res) {
            that.$message({
              showClose: true,
              message: res.data,
              type: 'success'
            });
            that.$refs.tableRecvLog.clearSelection();
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: '没有选择记录!',
          type: 'warning'
        });
      }
    },
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.query();
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val;
      this.query();
    },
    // 获取通信系统列表
    getSyscode: function () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/sysCode/all',
        success: function (res) {
          that.selectOptions = res.data;
        }
      });
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.tableHeight = document.body.clientHeight - 150;
    }, 400);
    this.getSyscode();
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-form-item{margin-bottom: 3px !important;}
  .form-style{background-color: #fafafa; padding-top: 3px; margin-bottom: 5px;border: 1px solid #e5e5e5; font-size: 12px;}
</style>
