<template>
  <div class="app-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" ref="queryForm" size="small">
        <el-form-item label="用户名称">
          <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleDateRangeChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column label="用户名称" prop="username" min-width="120" show-overflow-tooltip />
        <el-table-column label="手机号码" prop="phone" width="140" align="center" />
        <el-table-column label="注册时间" prop="createTime" width="170" align="center" />
        <el-table-column label="最近登录" prop="lastLoginTime" width="170" align="center" />
        <el-table-column label="账户余额" width="140" align="center">
          <template slot-scope="scope">
            <span style="color: #f56c6c; font-weight: bold;">¥{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="handleViewDetail(scope.row)"
            >查看</el-button>
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

    <!-- 用户详情对话框 -->
    <el-dialog :title="'用户详情 - ' + detailForm.username" :visible.sync="detailDialogVisible" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名称">{{ detailForm.username }}</el-descriptions-item>
        <el-descriptions-item label="手机号码">{{ detailForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="真实姓名">{{ detailForm.realName }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ detailForm.idCard }}</el-descriptions-item>
        <el-descriptions-item label="账户余额">
          <span style="color: #f56c6c; font-weight: bold;">¥{{ detailForm.balance }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ detailForm.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最近登录">{{ detailForm.lastLoginTime }}</el-descriptions-item>
        <el-descriptions-item label="登录IP">{{ detailForm.lastLoginIp }}</el-descriptions-item>
      </el-descriptions>

      <!-- 充值记录 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>充值记录</h3>
        </div>
        <el-table
          :data="rechargeList"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column label="充值时间" prop="createTime" width="160" align="center" />
          <el-table-column label="充值金额" width="120" align="center">
            <template slot-scope="scope">
              <span style="color: #67c23a; font-weight: bold;">¥{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="充值序列号" prop="serialNo" min-width="180" show-overflow-tooltip />
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                {{ scope.row.status === '1' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserManage',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 用户列表数据
      userList: [],
      // 充值记录列表
      rechargeList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 详情对话框显示状态
      detailDialogVisible: false,
      // 详情表单
      detailForm: {
        username: '',
        phone: '',
        realName: '',
        idCard: '',
        balance: 0,
        createTime: '',
        lastLoginTime: '',
        lastLoginIp: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      // TODO: 调用获取用户列表接口
      setTimeout(() => {
        this.userList = [
          {
            id: 1,
            username: '测试用户',
            phone: '13800138000',
            realName: '张三',
            idCard: '110101199001011234',
            balance: 1000.00,
            createTime: '2024-01-01 12:00:00',
            lastLoginTime: '2024-01-10 08:30:00',
            lastLoginIp: '192.168.1.1'
          }
        ]
        this.total = 1
        this.loading = false
      }, 500)
    },
    /** 获取充值记录 */
    getRechargeList(userId) {
      // TODO: 调用获取充值记录接口
      this.rechargeList = [
        {
          id: 1,
          createTime: '2024-01-05 15:30:00',
          amount: 500.00,
          serialNo: 'RC202401051530001',
          status: '1'
        }
      ]
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.$refs.queryForm.resetFields()
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        startTime: undefined,
        endTime: undefined
      }
      this.getList()
    },
    /** 日期范围变化 */
    handleDateRangeChange(dates) {
      if (dates) {
        this.queryParams.startTime = dates[0]
        this.queryParams.endTime = dates[1]
      } else {
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      }
    },
    /** 查看详情按钮操作 */
    handleViewDetail(row) {
      this.detailForm = { ...row }
      this.detailDialogVisible = true
      this.getRechargeList(row.id)
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

.detail-section {
  margin-top: 20px;
  
  .section-header {
    margin-bottom: 15px;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>