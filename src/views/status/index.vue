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

    <el-card>
      <div>
        <el-button type="primary" size="medium" :disabled="!selectOrders.length"  @click="clear">批量结清</el-button>
      </div>
      <!-- 订单列表 -->
      <el-table
        ref="table"
        :data="orderList"
        border
        style="width: 100%; margin-top: 20px"
        row-key="orderId"
        @selection-change="handleSelectionChange"
      >
        <!-- 删除以下多选框列 -->
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        />
        <el-table-column label="订单状态" prop="status" width="120" align="center">
          <template #default="scope">
            <el-tag type="info">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="订单时间"
          prop="createTime"
          width="180"
          align="center"
        />
        <el-table-column label="订单商品" prop="productInfo" width="200" align="center">
           <template #default="scope">
            <div>{{ scope.row.productInfo.productName }} ×{{ scope.row.productInfo.quantity }}</div>
            <div class="price">￥{{ scope.row.productInfo.price }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单编号"
          prop="orderSn"
          width="180"
          align="center"
        />
        <el-table-column label="物流信息" width="220" align="center">
          <template #default="scope">
              <div>{{ scope.row.trackingNo }}</div>
              <div class="logistics-company">
                {{ scope.row.logisticsCompany }}
              </div>
          </template>
        </el-table-column>
        <el-table-column label="物流详细" width="120" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.trackingUrl"
              type="primary"
              size="small"
              @click="viewLogistics(scope.row.trackingUrl)"
            >
              查看物流
            </el-button>
          </template>
        </el-table-column>
    
        <el-table-column label="订单款结清情况"  align="center" >
          <template #default="scope">
            <span
              :class="
                scope.row.isPaid ? 'payment-status-paid' : 'payment-status-unpaid'
              "
            >
              {{
                scope.row.isPaid
                  ? "已结清（" + scope.row.paidAmount + "元）"
                  : "未结清（0元）"
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
      queryParams: {
        merchantName: '',
        category: '',
        dateRange: [],
        pageNum: 1,
        pageSize: 10
      },
      categoryOptions: [
        { value: 'food', label: '食品' },
        { value: 'clothing', label: '服装' },
        { value: 'electronics', label: '电子产品' }
      ],
      orderList: [
        {
          orderId: 1,
          status: '待评价',
          createTime: '2021-01-01 10:00:00',
          productInfo: {
            productName: '商品名称',
            quantity: 1,
            price: 100
          },
          orderSn: '202101010001',
          trackingNo: '1234567890',
          trackingUrl: 'https://www.baidu.com',
          isPaid: true,
          paidAmount: 100
        },
          {
          orderId: 1,
          status: '待评价',
          createTime: '2021-01-01 10:00:00',
          productInfo: {
            productName: '商品名称',
            quantity: 1,
            price: 100
          },
          orderSn: '202101010001',
          trackingNo: '1234567890',
          trackingUrl: 'https://www.baidu.com',
          isPaid: true,
          paidAmount: 100
        }
      ],
      selectOrders:[], // 选中的订单列表
      
    }
  },
  methods: {
    
    // mounted() { 
    //   // this.getOrderList();
    // },
    // // 获取订单列表
    // getOrderList() {
    //   // TODO: 调用获取列表数据的方法
    // },
    
    // 查询操作
    handleQuery() {
      this.queryParams.pageNum = 1
      console.log('结清状态查询');
      // TODO: 调用获取列表数据的方法
    },
    // 重置查询
    resetQuery() {
      this.queryParams = {
        merchantName: '',
        category: '',
        dateRange: [],
        pageNum: 1,
        pageSize: 10
      }
      // TODO: 调用获取列表数据的方法
    },
    // 批量结清
    handleSelectionChange(selection) {
      this.selectOrders = selection;
    },
    // 查看物流
    viewLogistics(url) {
      try {
        window.open(url, '_blank')
      } catch (e) {
        this.$message.error('打开物流页面失败')
        console.error(e)
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.filter-container {
  margin-bottom: 20px;
}
.price {
  @include price;
  margin-top: 4px;
  font-size: 0.9em;
}
</style>

