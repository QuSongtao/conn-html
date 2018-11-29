<template>
  <div>
    <!--<el-radio-group v-model="logRadio">-->
    <!--<el-radio-button label="发送日志" @click="getSendLog"></el-radio-button>-->
    <!--<el-radio-button label="接收日志" @click="getRecvLog"></el-radio-button>-->
    <!--<el-radio-button label="系统日志" @click="getSysLog"></el-radio-button>-->
    <!--</el-radio-group>-->
    <el-button-group>
      <el-button type="primary" @click="getSendLog">发送日志</el-button>
      <el-button type="primary" @click="getRecvLog">接收日志</el-button>
      <el-button type="primary" @click="getSysLog">系统日志</el-button>
    </el-button-group>
    <el-row>
      <el-col :span="6">
        <el-table :data="gridData"
                  :height="tableHeight"
                  :style="{'width': '100%','height': tableHeight}"
                  @row-dblclick="rowDbClick">
          <el-table-column prop="fileName" label="文件名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileSize" label="大小" width="70"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="download(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18" :style="{'background-color': '#004444','height': tableHeight + 'px'}" class="logTextArea">
        <textarea v-html="logText" class="logarea" :style="{'height': tableHeight + 'px'}"></textarea>
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
      tableHeight: document.body.clientHeight - 120,
      pathIndex: '',
      gridData: []
    };
  },
  methods: {
    getSendLog: function () {
      this.pathIndex = 'SKS';
      this.getLogFiles();
    },
    getRecvLog: function () {
      this.pathIndex = 'SKR';
      this.getLogFiles();
    },
    getSysLog: function () {
      this.pathIndex = 'SKO';
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
      that.tableHeight = document.body.clientHeight - 120;
    }, 400);
    this.getSendLog();
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-button-group{margin-bottom: 10px;}
  .el-pagination{background-color: #ffffff;}
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
    border: 0 solid #cccccc;
    resize: none;
  }
</style>
