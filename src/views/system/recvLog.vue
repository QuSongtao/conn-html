<template>
  <div>
    <el-form :inline="true" :model="formInline" style="height: 50px;">
      <el-form-item label="接收时间：" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.date1" style="width: 150px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker type="date" placeholder="选择终止日期" v-model="formInline.date2" style="width: 150px;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="电文ID：" label-width="70px">
        <el-input v-model="formInline.telId" placeholder="输入电文ID" clearable style="width: 160px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" plain @click="reSend">重接</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="sendLogData"
              :height="tableHeight" border
              :style="{'width': '100%','height': tableHeight}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="telId" label="电文ID" width="120"></el-table-column>
      <el-table-column prop="telType" label="电文类型" width="80"></el-table-column>
      <el-table-column prop="sendFlag" label="处理状态" width="180" v-if="show"></el-table-column>
      <el-table-column prop="createTime" label="插入时间" width="180"></el-table-column>
      <el-table-column prop="sendTime" label="接收时间" width="180"></el-table-column>
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
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
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
import _ from 'lodash';
export default {
  data () {
    return {
      multipleSelection: [],
      currentPage4: 4,
      msgId: '',
      dialogVisible: false,
      tableHeight: document.body.clientHeight - 150,
      formInline: {
        telId: 'A',
        date1: new Date(),
        date2: new Date()
      },
      sendLogData: [{
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
      }, {
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
      }, {
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
      }, {
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
      }, {
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
      }, {
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
      }, {
        telId: 'LZSERP00001',
        telType: 'MQ',
        sendFlag: '已发送',
        createTime: '2018-10-09 10:10:10',
        sendTime: '2018-10-09 10:10:10',
        msgId: '938e7b70-b836-11e8-b9fc-02420a000055'
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
</style>
