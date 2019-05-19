<template>
  <div>
    <el-form :inline="true" size="small" class="form-style">
      <el-form-item>
        <el-button type="primary" @click="refresh" style="margin-left: 5px;">刷新</el-button>
        <el-button @click="add" style="margin-left: 5px;" :disabled="!selectedRow">增加</el-button>
      </el-form-item>
    </el-form>
    <el-container v-bind:style="{'width': '100%', 'height': tableHeight + 'px'}">
      <el-aside width="202px" style="background-color: #4a5064; margin-right: 5px;">
        <el-table :data="gridDataIndex"
                  height="100%"
                  :style="{'width': '100%','height': '100%'}"
                  @row-click="rowClick"
                  highlight-current-row
                  ref="indexTable"
                  border
        >
          <el-table-column type="id" label="主键" width="50" v-if="show"></el-table-column>
          <el-table-column prop="typeCode" label="类型编码" width="70" v-if="show"></el-table-column>
          <el-table-column prop="typeName" label="类型名称" width="130" v-if="show"></el-table-column>
          <el-table-column prop="code" label="分类编码" width="70"></el-table-column>
          <el-table-column prop="name" label="分类名称" width="130" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-aside>
      <el-main style="background-color: #8c939d; padding: 0 !important;">
        <el-table :data="gridData" height="100%" :style="{'width': '100%','height': '100%'}" border>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column type="id" label="主键" width="50" v-if="show"></el-table-column>
          <el-table-column prop="typeName" label="分类名称" width="130"></el-table-column>
          <el-table-column prop="code" label="编码" width="70"></el-table-column>
          <el-table-column prop="name" label="名称" width="130"></el-table-column>
          <el-table-column prop="des" label="备注说明" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="edit(scope.$index, scope.row)" :disabled="scope.row.connFlag==='0'">修改</el-button>
              <el-button size="mini" @click="del(scope.row.id)" :disabled="scope.row.connFlag==='1'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 编辑对话框 -->
    <el-dialog title="字典编码" :visible.sync="dialogVisible" width="35%">
      <el-form :model="form" ref="dictForm" :rules="rules" class="ms-content">
        <el-form-item label="主键" :label-width="formLabelWidth" v-if="false">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" :label-width="formLabelWidth" prop="typeCode">
          <el-input v-model="form.typeCode" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="form.typeName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="字典编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" :label-width="formLabelWidth">
          <el-input v-model="form.des" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      formLabelWidth: '120px',
      selectedRow: null,
      show: false,
      tableHeight: document.body.clientHeight - 120,
      pageIndex: 1,
      pageSize: 20,
      totalRow: 0,
      gridData: [],
      gridDataIndex: [],
      dialogVisible: false,
      form: {},
      rules: {
        code: [{required: true}],
        name: [{required: true}]
      }
    };
  },
  methods: {
    refresh: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/dict/1000',
        params: {},
        success: function (res) {
          that.gridDataIndex = res;
        }
      });
    },
    rowClick: function (row, event, column) {
      this.$refs.indexTable.setCurrentRow(row);
      this.selectedRow = row;
      const typeCode = row.code;
      let that = this;
      this.$http.openApiAxios({
        url: `/mgr/dict/${typeCode}`,
        method: 'GET',
        params: {},
        success: function (res) {
          that.gridData = res;
        }
      });
    },
    add: function () {
      this.form.typeCode = this.selectedRow.code;
      this.form.typeName = this.selectedRow.name;
      this.dialogVisible = true;
      this.method = 'POST';
    },
    edit: function (index, row) {
      this.form = row;
      this.dialogVisible = true;
      this.method = 'PATCH';
    },
    save: function () {
      let that = this;
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          this.$http.openApiAxios({
            method: this.method,
            url: '/mgr/dict',
            params: this.form,
            success: function (res) {
              if (res.meta.code === 1) {
                that.$message.success('保存成功!');
                that.dialogVisible = false;
                that.$http.openApiAxios({
                  url: `/mgr/dict/${that.selectedRow.code}`,
                  method: 'GET',
                  params: {},
                  success: function (res) {
                    that.gridData = res;
                  }
                });
              } else {
                that.$message.warning(res.meta.message);
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    del: function (id) {
      const that = this;
      this.$confirm('确定删除?').then(_ => {
        this.$http.openApiAxios({
          method: 'DELETE',
          url: `/mgr/dict/${id}`,
          params: {},
          success: function (res) {
            if (res.meta.code === 1) {
              that.$message.success('删除成功!');
              that.$http.openApiAxios({
                url: `/mgr/dict/${that.selectedRow.code}`,
                method: 'GET',
                params: {},
                success: function (res) {
                  that.gridData = res;
                }
              });
            } else {
              that.$message.error(res.meta.message);
            }
          }
        });
      });
    },
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.refresh();
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val;
      this.refresh();
    }
  },
  mounted: function () {
    const that = this;
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.tableHeight = document.body.clientHeight - 120;
    }, 400);
    that.refresh();
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-form-item{margin-bottom: 3px !important;}
  .form-style{background-color: #fafafa; padding-top: 3px; margin-bottom: 5px;border: 1px solid #e5e5e5}
</style>
