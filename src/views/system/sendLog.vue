<template>
  <div>
    <el-form :inline="true" :model="formInline" style="height: 50px;">
      <el-form-item label="发送时间：" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择起始日期" value-format="yyyy-MM-dd" v-model="formInline.date1" style="width: 150px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker type="date" placeholder="选择终止日期" value-format="yyyy-MM-dd" v-model="formInline.date2" style="width: 150px;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="电文ID：" label-width="70px">
        <el-input v-model="formInline.telId" placeholder="输入电文ID" clearable style="width: 160px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" plain @click="reSend">重发</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="sendLogData"
              :height="tableHeight" border
              :style="{'width': '100%','height': tableHeight}"
              ref="tableSendLog"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="id" label="主键ID" width="10" v-if="show"></el-table-column>
      <el-table-column prop="telId" label="电文ID" width="120"></el-table-column>
      <el-table-column prop="telType" label="电文类型" width="80"></el-table-column>
      <el-table-column prop="sendFlag" label="发送状态" width="80" :formatter="statusFormat"></el-table-column>
      <el-table-column prop="createTime" label="插入时间" width="180"></el-table-column>
      <el-table-column prop="sendTime" label="发送时间" width="180"></el-table-column>
      <el-table-column prop="msgId" label="消息ID" show-overflow-tooltip></el-table-column>
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
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>{{msgId}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
export default {
  data () {
    return {
      show: false,
      multipleSelection: [],
      pageIndex: 1,
      pageSize: 10,
      totalRow: 0,
      msgId: '',
      dialogVisible: false,
      tableHeight: document.body.clientHeight - 150,
      formInline: {
        telId: '',
        date1: this.$util.formatDate(new Date()),
        date2: this.$util.formatDate(new Date())
      },
      sendLogData: []
    };
  },
  methods: {
    // 查询按钮
    query: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/sendLog/data',
        params: {
          dtStart: this.formInline.date1,
          dtEnd: this.formInline.date2,
          telId: this.formInline.telId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        success: function (res) {
          that.totalRow = res.data.page.totalRows;
          that.sendLogData = res.data.rows;
        }
      });
    },
    // 发送状态格式化
    statusFormat: function (row, column, cellValue, index) {
      switch (cellValue) {
        case '0':
          return '未发送';
        case '1':
          return '已发送';
        default:
          return '未知';
      }
    },
    handleInfo: function (index, row) {
      this.msgId = row.msgId;
      this.dialogVisible = true;
    },
    handleClose: function (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    closed: function () {
      console.log('关闭后回调yes!');
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
    },
    reSend: function () {
      if (this.multipleSelection.length > 0) {
        let ids = [];
        for (let m = 0; m < this.multipleSelection.length; m++) {
          ids.push(this.multipleSelection[0].id);
        }
        axios({
          method: 'post',
          url: 'http://localhost:8083/mgr/sendLog/resend',
          params: {
            ids: ids.join()
          }
        }).then(res => {
          this.$message({
            showClose: true,
            message: res.data.data,
            type: 'success'
          });
          this.$refs.tableSendLog.clearSelection();
        }).catch(reason => {
          this.$message({
            message: reason,
            type: 'error'
          });
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val;
      this.query();
      console.log(`当前页: ${val}`);
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
