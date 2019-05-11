<template>
  <div>
    <el-form :inline="true" :model="formInline" size="small" class="form-style">
      <el-form-item label="电文ID：" label-width="90px">
        <el-input v-model="formInline.telId" placeholder="输入电文ID" clearable style="width: 160px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addNewRecord" v-if="isAdmin" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="telConfigData"
              :height="tableHeight"
              :style="{'width': '100%','height': tableHeight}"
              ref="tableSendLog"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="id" label="主键ID" width="10" v-if="show"></el-table-column>
      <el-table-column prop="telId" label="电文ID" width="120"></el-table-column>
      <el-table-column prop="telName" label="电文名称" width="120"></el-table-column>
      <!--<el-table-column prop="transferType" label="类型" width="80" :formatter="statusFormat"></el-table-column>-->
      <el-table-column prop="queueName" label="队列名称" width="80"></el-table-column>
      <el-table-column prop="sender" label="发送者编码" width="80"></el-table-column>
      <el-table-column prop="senderName" label="发送者名称" width="130"></el-table-column>
      <el-table-column prop="receiver" label="接收者编码" width="80"></el-table-column>
      <el-table-column prop="receiverName" label="接收者名称" width="130"></el-table-column>
      <el-table-column label="操作" fixed="right" v-if="isAdmin">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleInfo(scope.$index, scope.row)" v-if="isAdmin">修改</el-button>
          <el-button size="mini" @click="deleteTelId(scope.$index, scope.row)" v-if="isAdmin">删除</el-button>
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
    <el-dialog title="表单" :visible.sync="dialogVisible" width="350px" v-dialogDrag>
      <el-form :model="form">
        <el-form-item label="主键" :label-width="formLabelWidth" v-if="false">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电文id" :label-width="formLabelWidth">
          <el-input v-model="form.telId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电文名称" :label-width="formLabelWidth">
          <el-input v-model="form.telName" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="类型" :label-width="formLabelWidth">-->
        <!--<el-select v-model="form.transferType" placeholder="选择类型">-->
        <!--<el-option label="发送" value="S"></el-option>-->
        <!--<el-option label="接收" value="R"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="队列名称" :label-width="formLabelWidth">
          <el-input v-model="form.queueName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送者编码" :label-width="formLabelWidth">
          <el-input v-model="form.sender" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发送者名称" :label-width="formLabelWidth">
          <el-input v-model="form.senderName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收者编码" :label-width="formLabelWidth">
          <el-input v-model="form.receiver" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收者名称" :label-width="formLabelWidth">
          <el-input v-model="form.receiverName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="saveTelConfig" size="mini">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

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
      msgId: '',
      dialogVisible: false,
      tableHeight: document.body.clientHeight - 150,
      formInline: {
        telId: null,
        date1: this.$util.formatDate(new Date()),
        date2: this.$util.formatDate(new Date())
      },
      telConfigData: [],
      form: {},
      formLabelWidth: '120px',
      saveMethod: 'PATCH',
      isAdmin: this.$store.state.isAdmin === '1'
    };
  },
  methods: {
    // 查询按钮
    query: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/tel',
        params: {
          telId: this.formInline.telId,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        success: function (res) {
          that.totalRow = res.data.page.totalRows;
          that.telConfigData = res.data.rows;
        }
      });
    },
    addNewRecord: function () {
      this.form = {};
      this.dialogVisible = true;
      this.saveMethod = 'POST';
    },
    saveTelConfig: function () {
      let that = this;
      this.$http.openApiAxios({
        url: '/mgr/tel',
        method: this.saveMethod,
        params: this.form,
        success: function (res) {
          if (res.meta.code === 1) {
            that.$message.success('保存成功!');
            that.query();
          } else {
            that.$message.error('保存数据失败!');
          }
          that.dialogVisible = false;
        }
      });
    },
    deleteTelId: function (index, row) {
      let that = this;
      this.$confirm('确定删除?').then(_ => {
        this.$http.openApiAxios({
          url: '/mgr/tel',
          method: 'DELETE',
          params: {
            id: row.id
          },
          success: function (res) {
            if (res.meta.code === 1) {
              that.$message.success('删除成功!');
              that.query();
            } else {
              that.$message.error('删除电文失败!');
            }
          }
        });
      }).catch(_ => {
      });
    },
    // 发送状态格式化
    statusFormat: function (row, column, cellValue, index) {
      switch (cellValue) {
        case 'S':
          return '发送';
        case 'R':
          return '接收';
        default:
          return '未知';
      }
    },
    handleInfo: function (index, row) {
      this.form = row;
      this.dialogVisible = true;
      this.saveMethod = 'PATCH';
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
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
