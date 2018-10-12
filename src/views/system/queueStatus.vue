<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="onSubmit">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="queueStatusData" :height="tableHeight" border :style="{'width': '100%','height': tableHeight}">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="queueName" label="队列名称" width="180"></el-table-column>
      <el-table-column prop="currentDepth" label="当前深度" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.currentDepth === 0" type="success" size="medium" class="status-tag-radius">{{ scope.row.currentDepth }}条</el-tag>
          <el-tag v-if="scope.row.currentDepth > 0" type="danger" size="medium" class="status-tag-radius">{{ scope.row.currentDepth }}条</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="queueType" label="队列类型" width="180"></el-table-column>
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
        region: 'S'
      },
      queueStatusData: [{
        queueName: 'ERP.LZ.Q',
        currentDepth: 80,
        queueType: '本地队列',
        des: '接收ERP队列'
      }, {
        queueName: 'ERP.LZ.Q',
        currentDepth: 0,
        queueType: '本地队列',
        des: '接收ERP队列'
      }, {
        queueName: 'ERP.LZ.Q',
        currentDepth: 80,
        queueType: '本地队列',
        des: '接收ERP队列'
      }, {
        queueName: 'ERP.LZ.Q',
        currentDepth: 80,
        queueType: '本地队列',
        des: '接收ERP队列'
      }, {
        queueName: 'ERP.LZ.Q',
        currentDepth: 80,
        queueType: '本地队列',
        des: '接收ERP队列'
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
  .status-tag-radius{border-radius: 12px !important;}
</style>
