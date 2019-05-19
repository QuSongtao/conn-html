<template>
  <div>
    <el-form :inline="true" :model="formInline" size="small" class="form-style">
      <el-button-group>
        <el-button type="primary" @click="getSendLog" size="small">发送日志</el-button>
        <el-button type="primary" @click="getRecvLog" size="small">接收日志</el-button>
        <el-button type="primary" @click="getSysLog" size="small">系统日志</el-button>
      </el-button-group>
    </el-form>
    <el-row>
      <el-col :span="6">
        <el-table :data="gridData"
                  :height="tableHeight"
                  :style="{'width': '100%','height': tableHeight}"
                  highlight-current-row
                  @row-dblclick="rowDbClick"
                  ref="dataTable"
                  border
        >
          <el-table-column prop="fileName" label="文件名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileSize" label="大小" width="70"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="download(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18" :style="{'height': tableHeight + 'px'}" class="logTextArea">
        <div style="border: 1px solid #e5e5e5;">
          <textarea v-model="logText" class="logarea" :style="{'height': taH + 'px'}"></textarea>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      logText: '',
      tableHeight: document.body.clientHeight - 110,
      taH: document.body.clientHeight - 112,
      pathIndex: '',
      gridData: []
    };
  },
  methods: {
    getSendLog: function () {
      this.pathIndex = 'MQS';
      this.getLogFiles();
    },
    getRecvLog: function () {
      this.pathIndex = 'MQR';
      this.getLogFiles();
    },
    getSysLog: function () {
      this.pathIndex = 'MQO';
      this.getLogFiles();
    },
    download: function (index, row) {
      this.$http.openApiAxios({
        url: '/mgr/log/download',
        method: 'GET',
        params: {
          pathIndex: this.pathIndex,
          fileName: row.fileName
        },
        responseType: 'blob',
        success: function (res) {
          let url = window.URL.createObjectURL(new Blob([res]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', row.fileName);
          document.body.appendChild(link);
          link.click();
        }
      });
    },
    rowDbClick: function (row, event, column) {
      this.$refs.dataTable.setCurrentRow(row);
      let that = this;
      this.$http.openApiAxios({
        url: '/mgr/log/content',
        method: 'GET',
        params: {
          pathIndex: this.pathIndex,
          fileName: row.fileName
        },
        success: function (res) {
          that.logText = res;
        }
      });
    },
    getLogFiles: function () {
      let that = this;
      this.$http.openApiAxios({
        url: '/mgr/log/files',
        method: 'GET',
        params: {
          pathIndex: this.pathIndex
        },
        success: function (res) {
          that.gridData = res;
        }
      });
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.tableHeight = document.body.clientHeight - 110;
      that.taH = document.body.clientHeight - 112;
    }, 400);
    this.getSendLog();
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-button-group{margin-bottom: 3px; margin-left: 5px}
  .el-form-item{margin-bottom: 3px !important;}
  .form-style{background-color: #fafafa; padding-top: 3px; margin-bottom: 5px;border: 1px solid #e5e5e5}
  .logTextArea{
    font-family: 'Consolas';
    font-size: 12px;
    padding-left: 5px;
  }
  .logarea{
    width: 100%;
    height: auto;
    overflow-y: auto;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0;
    border:0px solid #e5e5e5;
    resize: none;
  }
  textarea {
    cs:expression(this.readOnly=true);
  }
</style>
