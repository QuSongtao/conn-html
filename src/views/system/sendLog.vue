<template>
  <div>
    <el-form :inline="true" :model="formInline" size="small" class="form-style">
      <el-form-item label="发送时间：" required label-width="110px">
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
        <el-button type="primary" plain @click="reSend" v-if="this.$store.state.isAdmin === '1'">重发</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="sendLogData"
              :height="tableHeight"
              :style="{'width': '100%','height': tableHeight}"
              ref="tableSendLog"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="id" label="主键ID" width="10" v-if="show"></el-table-column>
      <el-table-column prop="telId" label="电文ID" width="100"></el-table-column>
      <!--<el-table-column prop="telType" label="电文类型" width="80"></el-table-column>-->
      <el-table-column prop="sendFlag" label="发送状态" width="80" :formatter="statusFormat"></el-table-column>
      <el-table-column prop="receiverName" label="接收者" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="插入时间" width="150"></el-table-column>
      <el-table-column prop="sendTime" label="发送时间" width="150"></el-table-column>
      <el-table-column prop="sendResult" label="结果描述" width="200" show-overflow-tooltip></el-table-column>
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
      <!--<textarea style="width: 99%; border: 1px solid #cccccc" v-model="msgText"></textarea>-->
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false" size="mini">取 消</el-button>-->
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
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/sendLog/message',
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
    reSend: function () {
      if (this.multipleSelection.length > 0) {
        let ids = [];
        let that = this;
        for (let m = 0; m < this.multipleSelection.length; m++) {
          ids.push(this.multipleSelection[m].id);
        }
        this.$http.openApiAxios({
          method: 'POST',
          url: '/mgr/sendLog/resend',
          params: {
            ids: ids.join()
          },
          success: function (res) {
            that.$message({
              showClose: true,
              message: res.data,
              type: 'success'
            });
            that.$refs.tableSendLog.clearSelection();
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
  .el-form-item{margin-bottom: 3px !important;}
  .form-style{background-color: #fafafa; padding-top: 3px; margin-bottom: 5px;border: 1px solid #e5e5e5}
</style>
