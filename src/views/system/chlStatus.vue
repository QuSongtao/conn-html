<template>
  <div>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="通道类型" label-width="80px">
        <el-select v-model="formInline.region" placeholder="请选择" style="width: 120px;">
          <el-option label="全部通道" value="A"></el-option>
          <el-option label="发送通道" value="S"></el-option>
          <el-option label="接收通道" value="R"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="chlStatusData" :height="tableHeight" border :style="{'width': '100%','height': tableHeight}">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="chlName" label="通道名称" width="180"></el-table-column>
      <el-table-column prop="status" label="通道状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='RUNNING'" type="success" size="medium" class="status-tag-radius">{{ scope.row.status }}</el-tag>
          <el-tag v-if="scope.row.status==='DOWN'" type="danger" size="medium" class="status-tag-radius">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="chlType" label="通道类型" width="180"></el-table-column>
      <el-table-column prop="des" label="备注信息"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      tableHeight: document.body.clientHeight - 120,
      formInline: {
        region: 'A'
      },
      chlStatusData: [{
        chlName: 'LZ.ERP.CH',
        status: 'RUNNING',
        chlType: '发送通道',
        des: '发送ERP通道'
      }, {
        chlName: 'LZ.SMS.CH',
        status: 'RUNNING',
        chlType: '发送通道',
        des: '发送ERP通道'
      }, {
        chlName: 'LZ.ERP.CH',
        status: 'DOWN',
        chlType: '发送通道',
        des: '发送ERP通道'
      }, {
        chlName: 'LZ.ERP.CH',
        status: 'DOWN',
        chlType: '发送通道',
        des: '发送ERP通道'
      }, {
        chlName: 'LZ.ERP.CH',
        status: 'RUNNING',
        chlType: '发送通道',
        des: '发送ERP通道'
      }]
    };
  },
  methods: {
    onSubmit: function () {
      this.$message({
        message: '恭喜你，成功消息',
        type: 'success'
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
  .el-form-item{margin-bottom: 10px !important;}
</style>
