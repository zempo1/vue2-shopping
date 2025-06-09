<template>
  <div class="app-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="商家名称">
          <el-input v-model="queryParams.name" placeholder="请输入商家名称" clearable />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="queryParams.phone" placeholder="请输入联系电话" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商家列表 -->
    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="merchantList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column label="商家名称" prop="name" min-width="120" show-overflow-tooltip />
        <el-table-column label="联系人" prop="contactPerson" width="100" align="center" />
        <el-table-column label="联系电话" prop="phone" width="120" align="center" />
        <el-table-column label="地址" prop="address" min-width="200" show-overflow-tooltip />
        <el-table-column label="商品数量" prop="goodsCount" width="90" align="center" />
        <el-table-column label="注册时间" prop="createTime" width="160" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="handleViewDetail(scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-goods"
              @click="handleManageGoods(scope.row)"
            >商品管理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParams.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 商家详情对话框 -->
    <el-dialog :title="'商家详情 - ' + detailForm.name" :visible.sync="detailDialogVisible" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商家名称">{{ detailForm.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ detailForm.contactPerson }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{ detailForm.email }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ detailForm.address }}</el-descriptions-item>
        <el-descriptions-item label="营业执照" :span="2">
          <el-image
            style="width: 150px; height: 150px"
            :src="detailForm.license"
            :preview-src-list="[detailForm.license]"
          />
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ detailForm.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailForm.status === '1' ? 'success' : 'danger'">
            {{ detailForm.status === '1' ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailForm.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 商品管理对话框 -->
    <el-dialog :title="'商品管理 - ' + currentMerchant.name" :visible.sync="goodsDialogVisible" width="900px">
      <el-table
        v-loading="goodsLoading"
        :data="goodsList"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品名称" prop="name" min-width="150" show-overflow-tooltip />
        <el-table-column label="分类" prop="category" width="100" />
        <el-table-column label="价格" prop="price" width="100" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column label="库存" prop="stock" width="80" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'1'"
              :inactive-value="'0'"
              @change="handleGoodsStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!selectedGoods.length" @click="handleBatchDisableGoods">批量禁用</el-button>
        <el-button @click="goodsDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MerchantManage',
  data() {
    return {
      // 遮罩层
      loading: false,
      goodsLoading: false,
      // 总条数
      total: 0,
      // 商家列表数据
      merchantList: [],
      // 商品列表数据
      goodsList: [],
      // 选中的商品数据
      selectedGoods: [],
      // 当前操作的商家
      currentMerchant: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        phone: undefined,
        status: undefined
      },
      // 详情对话框显示状态
      detailDialogVisible: false,
      // 商品管理对话框显示状态
      goodsDialogVisible: false,
      // 详情表单
      detailForm: {
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        license: '',
        createTime: '',
        status: '1',
        remark: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询商家列表 */
    getList() {
      this.loading = true
      // TODO: 调用获取商家列表接口
      setTimeout(() => {
        this.merchantList = [
          {
            id: 1,
            name: '测试商家',
            contactPerson: '张三',
            phone: '13800138000',
            email: 'test@example.com',
            address: '北京市朝阳区xxx街道xxx号',
            license: 'https://example.com/license.jpg',
            goodsCount: 10,
            createTime: '2024-01-01 12:00:00',
            status: '1',
            remark: '测试商家备注信息'
          }
        ]
        this.total = 1
        this.loading = false
      }, 500)
    },
    /** 查询商品列表 */
    getGoodsList(merchantId) {
      this.goodsLoading = true
      // TODO: 调用获取商品列表接口
      setTimeout(() => {
        this.goodsList = [
          {
            id: 1,
            name: '测试商品',
            category: '食品',
            price: 99.99,
            stock: 100,
            status: '1'
          }
        ]
        this.goodsLoading = false
      }, 500)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        phone: undefined,
        status: undefined
      }
      this.getList()
    },
    /** 查看详情按钮操作 */
    handleViewDetail(row) {
      this.detailForm = { ...row }
      this.detailDialogVisible = true
    },
    /** 商品管理按钮操作 */
    handleManageGoods(row) {
      this.currentMerchant = row
      this.goodsDialogVisible = true
      this.getGoodsList(row.id)
    },
    /** 商家状态修改 */
    handleStatusChange(row) {
      // TODO: 调用修改商家状态接口
      this.$message.success(`修改商家状态成功：${row.status === '1' ? '启用' : '禁用'}`)
    },
    /** 商品状态修改 */
    handleGoodsStatusChange(row) {
      // TODO: 调用修改商品状态接口
      this.$message.success(`修改商品状态成功：${row.status === '1' ? '上架' : '下架'}`)
    },
    /** 批量禁用商品 */
    handleBatchDisableGoods() {
      this.$confirm(`是否确认禁用选中的${this.selectedGoods.length}个商品?`, '警告', {
        type: 'warning'
      }).then(() => {
        // TODO: 调用批量禁用商品接口
        this.selectedGoods.forEach(item => {
          item.status = '0'
        })
        this.$message.success('批量禁用成功')
      })
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.selectedGoods = selection
    },
    /** 分页大小改变 */
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    /** 分页页码改变 */
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 20px;
}

.table-container {
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}

.dialog-footer {
  text-align: right;
}
</style>