<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12" >
          <el-row class="row-lt">
            <el-col :span="4">
              <i class="fa fa-database icon-size-lt" @click="getQmgrStatus"></i>
            </el-col>
            <el-col :span="4">
              <div class="status-title">IBM MQ</div>
            </el-col>
            <el-col :span="8" class="status-dsp">
              <div class="qmgr-name"><span>{{qmgrName}}</span></div>
              <div class="qmgr-title"><span>队列管理器</span></div>

            </el-col>
            <el-col :span="8" class="status-dsp">
              <div class="qmgr-name"><span :class="qmgrStatus === 'DOWN' ? 'dataDanger' : 'dataNormal'">{{qmgrStatus}}</span></div>
              <div class="qmgr-title"><span>运行状态</span></div>
            </el-col>
          </el-row>
        <el-row class="row-lt">
          <el-col :span="4">
              <i class="fa fa-sitemap icon-size-lt" @click="getNettyStatus"></i>
          </el-col>
          <el-col :span="4">
            <div class="status-title">SOCKET</div>
          </el-col>
          <el-col :span="8" class="status-dsp">
            <div class="sk-ip"><span>{{serverAddr}}</span></div>
            <div class="sk-status"><span :class="serverStatus === 'RUNNING' ? 'dataNormal' : 'dataDanger'">{{serverStatus}}</span></div>
            <div class="sk-title"><span>服务端</span></div>
          </el-col>
          <el-col :span="8" class="status-dsp">
            <div class="sk-ip"><span>{{clientAddr}}</span></div>
            <div class="sk-status"><span :class="clientStatus === 'RUNNING' ?  'dataNormal' : 'dataDanger'">{{clientStatus}}</span></div>
            <div class="sk-title"><span>客户端</span></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="row-rt">
          <el-col :span="4" class="data-icon">
              <i class="fa fa-random icon-size-rt" @click="getCountNum"></i>
          </el-col>
          <el-col :span="8" class="data-dsp">
            <div class="data-title"><span>待发送数据</span></div>
            <div class="data-content"><span class="data-number">{{toSendNum}}</span><span>条</span></div>
          </el-col>
          <el-col :span="4" class="data-icon">
            <i class="fa fa-line-chart icon-size-rt" @click="getCountNum"></i>
          </el-col>
          <el-col :span="8" class="data-dsp">
            <div class="data-title"><span>累计发送数据</span></div>
            <div class="data-content"><span class="data-number-old">{{sendTotalNum}}</span><span>条</span></div>
          </el-col>
        </el-row>
        <el-row class="row-rt">
          <el-col :span="4" class="data-icon">
            <i class="fa fa-puzzle-piece icon-size-rt" @click="getCountNum"></i>
          </el-col>
          <el-col :span="8" class="data-dsp">
            <div class="data-title"><span>待处理数据</span></div>
            <div class="data-content"><span class="data-number">{{toRecvNum}}</span><span>条</span></div>
          </el-col>
          <el-col :span="4" class="data-icon">
            <i class="fa fa-bar-chart-o icon-size-rt" @click="getCountNum"></i>
          </el-col>
          <el-col :span="8" class="data-dsp">
            <div class="data-title"><span>累计接收数据</span></div>
            <div class="data-content"><span class="data-number-old">{{recvTotalNum}}</span><span>条</span></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-tabs type="border-card" class="el-table--border_card" :style="{'height': logHeight + 'px'}">
        <el-tab-pane :style="{'height': logHgt + 'px'}" ref="mqLogTextArea">
          <span slot="label" @click="getMqLog"><i class="fa fa-database"></i> IBM MQ日志</span>
          <div v-html="mqLog"></div>
        </el-tab-pane>
        <el-tab-pane :style="{'height': logHgt + 'px'}">
          <span slot="label" @click="getSkLog"><i class="fa fa-sitemap"></i> SOCKET日志</span>
          <div v-html="skLog"></div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  data () {
    return {
      hti: window.innerHeught - 50 - 10,
      hasError: true,
      logHeight: document.body.clientHeight - 285,
      logHgt: document.body.clientHeight - 335,
      mqLog: '',
      skLog: '',
      qmgrName: '未知',
      qmgrStatus: '未知',
      serverStatus: '未知', // sk
      serverAddr: '未知',
      clientStatus: '未知',
      clientAddr: '未知',
      toSendNum: 'X',
      toRecvNum: 'X',
      sendTotalNum: 'X',
      recvTotalNum: 'X'
    };
  },
  methods: {
    getMqLog: function () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/log/lastNLines',
        params: {
          pathIndex: 'MQO',
          fileName: 'out.log'
        },
        success: function (res) {
          that.mqLog = res;
          let divMqArea = document.getElementById('pane-0');
          divMqArea.scrollTop = divMqArea.scrollHeight;
        }
      });
    },
    getSkLog: function () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/log/lastNLines',
        params: {
          pathIndex: 'SKO',
          fileName: 'out.log'
        },
        success: function (res) {
          that.skLog = res;
          let divMqArea = document.getElementById('pane-1');
          divMqArea.scrollTop = divMqArea.scrollHeight;
        }
      });
    },
    getNettyStatus: function () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/sk/status',
        params: {},
        success: function (res) {
          that.serverAddr = res.serverAddr;
          that.serverStatus = res.serverStatus;
          that.clientAddr = res.clientAddr;
          that.clientStatus = res.clientStatus;
        }
      });
    },
    getQmgrStatus: function () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mq/status/qmgr',
        params: {},
        success: function (res) {
          that.qmgrName = res.qmgrName;
          that.qmgrStatus = res.status;
        }
      });
    },
    getCountNum: function () {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/count',
        params: {},
        success: function (res) {
          that.toSendNum = res.toSendNum;
          that.toRecvNum = res.toRecvNum;
          that.sendTotalNum = res.sendTotalNum;
          that.recvTotalNum = res.recvTotalNum;
        }
      });
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.logHeight = document.body.clientHeight - 285;
      that.logHgt = document.body.clientHeight - 335;
    }, 400);
    this.getMqLog();
    this.getQmgrStatus();
    this.getNettyStatus();
    this.getCountNum();
  }
};
</script>
<style scoped lang="scss">
  .el-row {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .row-lt{background-color: #333744;}
  .row-lt .el-col{height: 100px;color: #ffffff;text-align: center}
  .row-lt .status-dsp{background-color: #4a5064;}
  .row-lt .status-dsp .qmgr-title{text-align: center;margin-top: 5px;}
  .row-lt .status-dsp .qmgr-title span{font-size: 14px; color: #ffffff}
  .row-lt .status-dsp .qmgr-name{margin-top: 18px;}
  .row-lt .status-dsp .qmgr-name span{font-size: 28px;font-weight:bold;}
  .row-lt .status-dsp .sk-ip{text-align: center;color: #ffffff;margin-top: 10px;}
  .row-lt .status-dsp .sk-ip span{font-size: 12px;}
  .row-lt .status-dsp .sk-status{margin-top: 1px;text-align: center;color: #ffffff;}
  .row-lt .status-dsp .sk-status span{font-size: 28px;font-weight: bold;}
  .row-lt .status-dsp .sk-title{text-align: center;margin-top: 1px;}
  .row-lt .status-dsp .sk-title span{font-size: 14px; color: #ffffff}
  .row-lt .status-title{margin-top: 40px; font-size: 16px;}

  .row-rt{background-color: #333744; height: 100px;}
  .row-rt .data-icon{text-align: center}
  .row-rt .data-dsp{background-color: #4a5064; height: 100px; color: #ffffff}
  .row-rt .data-dsp .data-title{margin-top: 10px; margin-left: 10px;}
  .row-rt .data-dsp .data-title span{font-size: 14px; margin-left: 5px;}
  .row-rt .data-dsp .data-content{margin-top: 10px;margin-left:10px;font-size: 14px;}
  .row-rt .data-dsp .data-content .data-number{font-size: 30px;font-weight: bold;margin-left: 5px; color: lawngreen}
  .row-rt .data-dsp .data-content .data-number-old{font-size: 30px;font-weight: bold;margin-left: 5px; color: gainsboro;}
  /*根据变量改变状态字体颜色*/
  .dataDanger{ color: orangered;}
  .dataNormal{ color: lawngreen;}
  .icon-size-rt{color: #FFFFFF;font-size: 45px;font-weight: bold;margin-top: 26px;text-align: center;cursor: pointer;}
  .icon-size-lt{font-size: 50px;font-weight: bold;margin-top: 26px;cursor: pointer;}
  .el-table--border_card{background-color: #004444;margin-left: 5px;margin-right: 5px;}
  /*日志样式*/
  .el-tab-pane{overflow: auto;white-space: nowrap;color: #fabe5f;font-family: 'Consolas';font-size: 12px;padding: 5px 0 5px 5px;}
</style>
