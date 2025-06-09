<template>
  <div class="app-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" size="medium">
        <el-form-item label="分类名称">
          <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card class="table-container">
      <div class="table-header">
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAdd">新增分类</el-button>
        <el-button type="danger" size="medium" icon="el-icon-delete" :disabled="!selectedCategories.length" @click="handleBatchDelete">批量删除</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="categoryList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="分类名称" prop="name" />
        <el-table-column label="排序" prop="sort" width="120" align="center" />
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="220" align="center" />
        <el-table-column label="操作" width="220" align="center" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/修改分类对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'GoodsCategory',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      selectedCategories: [],
      // 商品分类表格数据
      categoryList: [],
      // 弹出层标题
      dialogTitle: '',
      // 是否显示弹出层
      dialogVisible: false,
      // 查询参数
      queryParams: {
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        sort: 0,
        status: '1',
        remark: undefined
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询商品分类列表 */
    getList() {
      this.loading = true
      // TODO: 调用获取列表接口
      setTimeout(() => {
        this.categoryList = [
          {
            id: 1,
            name: '食品',
            sort: 1,
            status: '1',
            createTime: '2024-01-01 12:00:00',
            remark: '食品分类'
          }
        ]
        this.loading = false
      }, 500)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        name: undefined,
        status: undefined
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.dialogTitle = '添加商品分类'
      this.form = {
        name: undefined,
        sort: 0,
        status: '1',
        remark: undefined
      }
      this.dialogVisible = true
    },
    /** 修改按钮操作 */
    handleEdit(row) {
      this.dialogTitle = '修改商品分类'
      this.form = { ...row }
      this.dialogVisible = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            // TODO: 调用修改接口
            const index = this.categoryList.findIndex(item => item.id === this.form.id)
            this.categoryList.splice(index, 1, this.form)
          } else {
            // TODO: 调用新增接口
            this.form.id = Date.now()
            this.form.createTime = new Date().toLocaleString()
            this.categoryList.push(this.form)
          }
          this.dialogVisible = false
          this.$message.success('保存成功')
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除该商品分类?', '警告', {
        type: 'warning'
      }).then(() => {
        // TODO: 调用删除接口
        const index = this.categoryList.findIndex(item => item.id === row.id)
        this.categoryList.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    /** 批量删除操作 */
    handleBatchDelete() {
      if (!this.selectedCategories.length) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      this.$confirm(`是否确认删除选中的${this.selectedCategories.length}条数据?`, '警告', {
        type: 'warning'
      }).then(() => {
        // TODO: 调用批量删除接口
        const ids = this.selectedCategories.map(item => item.id)
        this.categoryList = this.categoryList.filter(item => !ids.includes(item.id))
        this.$message.success('删除成功')
      })
    },
    /** 状态修改 */
    handleStatusChange(row) {
      // TODO: 调用修改状态接口
      this.$message.success(`修改状态成功：${row.status === '1' ? '启用' : '禁用'}`)
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.selectedCategories = selection
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 20px;
}

.table-container {
  .table-header {
    margin-bottom: 20px;
  }
}
</style>