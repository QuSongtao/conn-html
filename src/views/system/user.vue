<template>
  <div>
    <el-form :inline="true" size="small" class="form-style">
      <el-form-item>
        <el-button @click="add" style="margin-left: 5px;">增加</el-button>
        <el-button @click="del" style="margin-left: 5px;">删除</el-button>
        <el-button type="primary" @click="refresh" style="margin-left: 5px;">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="gridData"
              :height="tableHeight"
              :style="{'width': '100%','height': tableHeight}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column type="id" label="主键" width="50" v-if="show"></el-table-column>
      <el-table-column prop="username" label="用户名称" width="120"></el-table-column>
      <el-table-column prop="loginName" label="登录账号" width="120"></el-table-column>
      <el-table-column prop="isAdmin" label="用户角色" width="100" :formatter="adminFormat"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" width="150"></el-table-column>
      <el-table-column prop="des" label="备注说明" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.$index, scope.row)">修改</el-button>
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
    <el-dialog title="用户" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" ref="userForm" :rules="rules" class="ms-content">
        <el-form-item label="主键" :label-width="formLabelWidth" v-if="false">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" :label-width="formLabelWidth" prop="loginName">
          <el-input v-model="form.loginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth" prop="isAdmin">
          <el-select v-model="form.isAdmin" placeholder="选择角色" value="0">
            <el-option v-for="item in isAdmin" :label="item.name" :value="item.code" :key="item.code"></el-option>
          </el-select>
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
      multipleSelection: [],
      show: false,
      tableHeight: document.body.clientHeight - 150,
      pageIndex: 1,
      pageSize: 20,
      totalRow: 0,
      gridData: [],
      isAdmin: [],
      dialogVisible: false,
      form: {},
      formLabelWidth: '120px',
      method: 'POST',
      rules: {
        isAdmin: [
          {required: true, message: '请选择角色！', trigger: 'blur'}
        ],
        loginName: [{required: true}]
      }
    };
  },
  methods: {
    refresh: function () {
      let that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/user/all',
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        success: function (res) {
          that.totalRow = res.data.page.totalRows;
          that.gridData = res.data.rows;
        }
      });
    },
    adminFormat: function (row, column, value) {
      for (let i = 0; i < this.isAdmin.length; i++) {
        if (this.isAdmin[i].code === value) {
          return this.isAdmin[i].name;
        }
      }
    },
    codeDict: function (typeCode) {
      const that = this;
      this.$http.openApiAxios({
        method: 'GET',
        url: '/mgr/dict/' + typeCode,
        params: {
        },
        success: function (res) {
          that.isAdmin = res;
        }
      });
    },
    add: function () {
      this.dialogVisible = true;
      this.method = 'POST';
    },
    save: function () {
      let that = this;
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.$http.openApiAxios({
            method: this.method,
            url: '/mgr/user',
            params: this.form,
            success: function (res) {
              if (res.meta.code === 1) {
                that.$message.success('保存成功!');
                that.refresh();
                that.dialogVisible = false;
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
    edit: function (index, row) {
      this.form = row;
      this.dialogVisible = true;
      this.method = 'PATCH';
    },
    del: function () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('没有选择任何记录!');
        return;
      }
      const ids = [];
      const loginNames = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
        loginNames.push(this.multipleSelection[i].loginName);
      }
      const that = this;
      this.$confirm('确定删除?').then(_ => {
        this.$http.openApiAxios({
          method: 'DELETE',
          url: '/mgr/user',
          params: {
            ids: ids.join(','),
            loginNames: loginNames.join(',')
          },
          success: function (res) {
            if (res.meta.code === 1) {
              that.$message.success('删除成功!');
              that.refresh();
            } else {
              that.$message.error(res.meta.message);
            }
          }
        });
      });
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
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
      that.tableHeight = document.body.clientHeight - 150;
    }, 400);
    this.codeDict('1001');
  }
};
</script>
<style lang="scss" scoped>
  .status-tag-radius{border-radius: 14px !important;}
  .el-form-item{margin-bottom: 3px !important;}
  .form-style{background-color: #fafafa; padding-top: 3px; margin-bottom: 5px;border: 1px solid #e5e5e5}
</style>
