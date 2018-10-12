<template>
  <div>
    <el-button-group>
      <el-button type="primary" @click="getMqLogFiles">发送日志</el-button>
      <el-button type="primary">接收日志</el-button>
      <el-button type="primary">系统日志</el-button>
    </el-button-group>
    <el-row>
      <el-col :span="6">
        <el-table :data="sendLogData"
                  :height="tableHeight" border
                  :style="{'width': '100%','height': tableHeight}"
                  @selection-change="handleSelectionChange"
                  @row-click="rowClick">
          <el-table-column prop="fileName" label="文件名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileSize" label="大小" width="70"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleInfo(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18" :style="{'background-color': '#004444','height': tableHeight + 'px'}" class="logTextArea">
        <div v-html="logText"></div>
      </el-col>
    </el-row>
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
import _ from 'lodash';
import axios from 'axios';
export default {
  data () {
    return {
      logText: '1131312',
      multipleSelection: [],
      currentPage4: 4,
      msgId: '',
      dialogVisible: false,
      tableHeight: document.body.clientHeight - 120,
      formInline: {
        telId: 'A',
        date1: new Date(),
        date2: new Date()
      },
      sendLogData: [{
        fileName: 'recv_2018-10-08.0.log',
        fileSize: '10.8M'
      }, {
        fileName: '2018-10-08.log',
        fileSize: '10.8M'
      }, {
        fileName: '2018-10-08.log',
        fileSize: '10.8M'
      }, {
        fileName: '2018-10-08.log',
        fileSize: '10.8M'
      }, {
        fileName: '2018-10-08.log',
        fileSize: '10.8M'
      }, {
        fileName: '2018-10-08.log',
        fileSize: '10.8M'
      }, {
        fileName: '2018-10-08.log',
        fileSize: '10.8M'
      }]
    };
  },
  methods: {
    onSubmit: function () {
      this.$message({
        message: '恭喜你，成功消息',
        type: 'success'
      });
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
        this.$message({
          message: this.multipleSelection[0].msgId,
          type: 'success'
        });
      }
    },
    handleSizeChange: function (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange: function (val) {
      console.log(`当前页: ${val}`);
    },
    rowClick: function (row, event, column) {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    getMqLogFiles: function () {
      axios.get('http://localhost:8081/mq/log/send/files').then(res => {
        this.sendLogData = res.data;
      });
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.tableHeight = document.body.clientHeight - 120;
    }, 400);
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-button-group{margin-bottom: 10px;}
  .el-pagination{background-color: #ffffff;}
  .logTextArea{
    overflow-y: auto;
    overflow-x: auto;
    white-space: nowrap;
    color: #fabe5f;
    font-family: 'Consolas';
    font-size: 12px;
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
