<template>
  <div class="app-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-container">
        <filter-form 
          :queryParams="queryParams"
          :categoryOptions="categoryOptions"
          @query="handleQuery" 
          @reset="resetQuery" 
        />
      
    </el-card>

    <!-- 商品列表 -->
    <el-card class="list-container">
      <div class="table-operations">
        <el-button type="primary" size="medium" :disabled="!selectedGoods.length" @click="handleBatchApprove">批量通过</el-button>
        <el-button type="danger" size="medium" :disabled="!selectedGoods.length" @click="handleBatchReject">批量拒绝</el-button>
      </div>
      <el-table border v-loading="loading" :data="goodsList" style="width: 100%" height="540" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商家信息" width="180">
          <template slot-scope="scope">
            <div>{{ scope.row.merchantName }}</div>
            <div class="text-gray">ID: {{ scope.row.merchantId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="120">
          <template slot-scope="scope">
            <el-image 
              :src="scope.row.image" 
              :preview-src-list="[scope.row.image]"
              fit="cover"
              style="width: 80px; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="商品分类" width="120" />
        <el-table-column label="价格" width="120">
          <template slot-scope="scope">
            <span class="text-red">¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button type="primary" size="mini" @click="handleApprove(scope.row)">通过</el-button>
            <el-button type="danger" size="mini" @click="handleReject(scope.row)">拒绝</el-button>
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
          :page-sizes="[5, 10, 20, 40]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog title="商品详情" :visible.sync="detailDialogVisible" width="60%" center>
      <div v-if="detailData" class="detail-content" style="max-height: 60vh; overflow-y: auto;">
        <div class="detail-section">
          <h3>基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="商家名称" >{{ detailData.merchantName }}</el-descriptions-item>
            <el-descriptions-item label="商品名称">{{ detailData.name }}</el-descriptions-item>
            <el-descriptions-item label="商品分类">{{ detailData.category }}</el-descriptions-item>
            <el-descriptions-item label="商品价格">¥{{ detailData.price }}</el-descriptions-item>
            <el-descriptions-item label="提交时间">{{ detailData.submitTime }}</el-descriptions-item>
            <el-descriptions-item label="是否包邮">{{ detailData.freeShipping ? '是' : '否' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <h3>商品规格</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="商品规格">{{ detailData.specification || '暂无规格信息' }}</el-descriptions-item>
            <el-descriptions-item label="商品重量">{{ detailData.weight ? detailData.weight + 'kg' : '暂无重量信息' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h3>商品描述</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="详细描述">{{ detailData.description }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-images">
          <h4>商品图片</h4>
          <el-image 
            v-for="(img, index) in detailData.images" 
            :key="index"
            :src="img" 
            :preview-src-list="detailData.images"
            fit="cover"
            style="width: 120px; height: 120px; margin-right: 10px"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FilterForm from '@/components/FilterForm'
export default {
  components: {
    FilterForm
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        merchantName: '',
        category: '',
        dateRange: [],
        pageNum: 1,
        pageSize: 10
      },
      // 商品分类选项
      categoryOptions: [
        { value: 'food', label: '食品' },
        { value: 'clothing', label: '服装' },
        { value: 'electronics', label: '电子产品' }
      ],
      // 加载状态
      loading: false,
      // 商品列表数据
      goodsList: [],
      // 总记录数
      total: 0,
      // 详情对话框显示状态
      detailDialogVisible: false,
      // 详情数据
      detailData: null,
      // 选中的商品列表
      selectedGoods: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.goodsList = []
      this.loading = true
      // 模拟异步请求
      setTimeout(() => {
        for(let i = 0; i < this.queryParams.pageSize; i++){
          this.goodsList.push({
            merchantId: '10001',
            merchantName: '优品数码店',
            image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            name: 'iPhone 13 Pro',
            category: '数码电子',
            price: 6999,
            submitTime: '2023-05-20 10:30:00',
            description: '全新iPhone 13 Pro，搭载A15仿生芯片',
            images: [
              'https://example.com/image1.jpg',
              'https://example.com/image2.jpg'
            ]
          })
        }
        // this.goodsList = [
        //   {
        //     merchantId: '10001',
        //     merchantName: '优品数码店',
        //     image: 'https://example.com/image1.jpg',
        //     name: 'iPhone 13 Pro',
        //     category: '数码电子',
        //     price: 6999,
        //     submitTime: '2023-05-20 10:30:00',
        //     description: '全新iPhone 13 Pro，搭载A15仿生芯片',
        //     images: [
        //       'https://example.com/image1.jpg',
        //       'https://example.com/image2.jpg'
        //     ]
        //   }
        //   // 更多数据...
        // ]
        this.total = 100
        this.loading = false
      }, 1000)
    },
    // 查询按钮点击事件
    handleQuery() {
      console.log('商品审核查询');
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置按钮点击事件
    resetQuery() {
      this.queryParams = {
        merchantName: '',
        category: '',
        dateRange: [],
        pageNum: 1,
        pageSize: 10
      }
      this.getList()
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    // 查看详情
    handleDetail(row) {
      this.detailData = row
      this.detailDialogVisible = true
    },
    // 通过审核
    handleApprove(row) {
      this.$confirm('确认通过该商品的审核申请?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$message.success('审核通过成功')
        this.getList()
      }).catch(() => {})
    },
    // 拒绝审核
    handleReject(row) {
      this.$confirm('确认拒绝该商品的审核申请?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$message.success('已拒绝审核申请')
        this.getList()
      }).catch(() => {})
    },
    // 表格多选事件
    handleSelectionChange(selection) {
      this.selectedGoods = selection
    },
    // 批量通过
    handleBatchApprove() {
      if (!this.selectedGoods.length) return
      this.$confirm(`确认通过选中的 ${this.selectedGoods.length} 个商品的审核申请?`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$message.success('批量审核通过成功')
        this.goodsList = []
        this.getList()
      }).catch(() => {})
    },
    // 批量拒绝
    handleBatchReject() {
      if (!this.selectedGoods.length) return
      this.$confirm(`确认拒绝选中的 ${this.selectedGoods.length} 个商品的审核申请?`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$message.success('批量拒绝审核申请成功')
        this.goodsList = []
        this.getList()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.filter-container {
  margin-bottom: 15px;
}
.el-form-item {
  padding-right: 5px;
}
.table-operations {
  margin-bottom: 15px;
}
.list-container {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.text-gray {
  color: #909399;
  font-size: 12px;
}
.text-red {
  @include price;
}

.detail-content {
  padding: 20px;

  .detail-section {
    margin-bottom: 24px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
      padding-left: 8px;
      border-left: 4px solid #409EFF;
    }
  }
}

.detail-images {
  margin-top: 20px;

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 12px 0;
  }
}

</style>

