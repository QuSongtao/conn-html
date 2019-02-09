<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" >
        <el-row class="row-lt">
          <el-col :span="8" class="data-icon">
            <i class="fa fa-server icon-size-rt" @click="getQmgrStatus"></i>
            <div class="icon-text">IBM MQ</div>
          </el-col>
          <el-col :span="16" class="data-dsp">
            <div class="ctn-title"><span>队列管理器</span></div>
            <div class="ctn-text"><span>{{qmgrName}}</span></div>
            <div class="ctn-title"><span>运行状态</span></div>
            <div class="ctn-text"><span :class="qmgrStatus === 'DOWN' ? 'dataDanger' : 'dataNormal'">{{qmgrStatus}}</span></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" >
        <el-row class="row-st">
          <el-col :span="8" class="data-icon">
            <i class="fa fa-sliders icon-size-rt" @click="getNettyStatus"></i>
            <div>SOCKET</div>
          </el-col>
          <el-col :span="16" class="data-dsp">
            <div class="ctn-title"><span>服务端{{serverAddr}}</span></div>
            <div class="ctn-text"><span :class="serverStatus === 'RUNNING' ? 'dataNormal' : 'dataDanger'">{{serverStatus}}</span></div>
            <div class="ctn-title"><span>客户端{{clientAddr}}</span></div>
            <div class="ctn-text"><span :class="clientStatus === 'RUNNING' ?  'dataNormal' : 'dataDanger'">{{clientStatus}}</span></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row class="row-rt">
          <el-col :span="8" class="data-icon">
            <i class="fa fa-skyatlas icon-size-rt" @click="getCountNum"></i>
            <div>待处理</div>
          </el-col>
          <el-col :span="16" class="data-dsp">
            <div class="ctn-title"><span>待发送数据</span></div>
            <div class="ctn-text"><span>{{toSendNum}}</span></div>
            <div class="ctn-title"><span>待处理数据</span></div>
            <div class="ctn-text"><span>{{toRecvNum}}</span></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row class="row-ft">
          <el-col :span="8" class="data-icon">
            <i class="fa fa-at icon-size-rt" @click="getCountNum"></i>
            <div>累计结果</div>
          </el-col>
          <el-col :span="16" class="data-dsp">
            <div class="ctn-title"><span>累计发送数据</span></div>
            <div class="ctn-text"><span>{{sendTotalNum}}</span></div>
            <div class="ctn-title"><span>累计接收数据</span></div>
            <div class="ctn-text"><span>{{recvTotalNum}}</span></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-tabs type="border-card" class="el-table--border_card" :style="{'height': logHeight + 'px'}">
        <el-tab-pane :style="{'height': logHgt + 'px'}" ref="mqLogTextArea">
          <span slot="label" @click="getMqLog"><i class="fa fa-server"></i> IBM MQ日志</span>
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
      logHeight: document.body.clientHeight - 175,
      logHgt: document.body.clientHeight - 226,
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
      that.logHeight = document.body.clientHeight - 175;
      that.logHgt = document.body.clientHeight - 226;
    }, 400);
    this.getMqLog();
    this.getQmgrStatus();
    this.getNettyStatus();
    this.getCountNum();
  }
};
</script>
<style scoped lang="scss">
  $ctn-bg-color: #ffffff;
  $ctn-tx-color: #6b6969;
  $ft-size: 18px;
  $icon-text-size: 14px;
  .el-row {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col{height: 100px;}
  .row-lt{background-color: #00c0ef;}
  .row-rt{background-color: #00a65a;}
  .row-st{background-color: #dd4b39;}
  .row-ft{background-color: #f39c12;}
  .ctn-title{margin: 5px 0 0 5px; font-size: 14px;}
  .ctn-title span{color:$ctn-tx-color}
  .ctn-text{margin: 2px 0 0 5px;}
  .ctn-text span{font-size: $ft-size;font-weight:bold; color: #626366}

  .data-dsp{background-color: #ffffff; height: 100px;}
  .data-icon{text-align: center; color: #ffffff; font-size: 14px;}

  /*根据变量改变状态字体颜色*/
  .dataDanger{ color: orangered !important;}
  .dataNormal{ color: green !important;}
  .icon-size-rt{color: #FFFFFF;font-size: 40px;margin-top: 20px;text-align: center;cursor: pointer;}
  .el-table--border_card{/*background-color: #004444*/;margin-left: 5px;margin-right: 5px;}

  /*日志样式*/
  .el-tab-pane{overflow: auto;white-space: nowrap;color: #fabe5f;background-color: #004444;font-family: 'Consolas';font-size: 12px;padding: 5px 0 5px 5px;}
</style>
