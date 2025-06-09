<template>
  <div class="order-manage">
    <!-- <h2 class="page-title">全部订单</h2> -->
     
    <el-card class="header-card">
       <!-- 筛选条件 -->
      <el-form size="medium" :inline="true" :model="queryParams" >
        <el-form-item label="商家名称" >
          <el-input v-model="queryParams.merchantName" placeholder="请输入商家名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="queryParams.category" placeholder="请选择商品分类" clearable>
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="queryParams.filterTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            :value="queryParams.filterTime || []"
            @change="handleDateFilter"
          />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select
            v-model="queryParams.filterStatus"
            placeholder="订单状态"
            clearable
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
         </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="handleQuery" style="margin-right: 5px;" >查询</el-button>
          <el-button size="medium" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
 
  
      <!-- 订单状态统计 -->
      <div class="status-statistics">
        <el-row :gutter="20">
          <el-col
            v-for="(count, status) in orderStatusCounts"
            :key="status"
            :span="4"
          >
            <el-card
              shadow="hover"
              class="status-card"
              :class="{ 'active-card': queryParams.filterStatus === status }"
              @click.native="filterByStatus(status)"
            >
              <div
                class="status-icon"
                :class="'status-icon-' + getStatusType(status)"
              >
                <i :class="getStatusIcon(status)" />
              </div>
              <div class="status-info">
                <div class="status-count">{{ count }}</div>
                <div class="status-name">{{ status }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card
              shadow="hover"
              class="status-card total-card"
              @click.native="resetFilters"
            >
              <div class="status-icon status-icon-info">
                <i class="el-icon-s-data" />
              </div>
              <div class="status-info">
                <div class="status-count">{{ totalOrders }}</div>
                <div class="status-name">全部订单</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
   
    <el-card>
      <!-- 订单列表 -->
      <el-table
        ref="table"
        :data="filteredOrders"
        style="width: 100%; margin-top: 20px"
        row-key="orderId"
      >
        <!-- 删除以下多选框列 -->
        <!-- <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        /> -->
        <el-table-column label="订单状态" prop="status" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="订单时间"
          prop="createTime"
          width="180"
        />
        <el-table-column label="订单商品" prop="productInfo" width="200">
          <template #default="scope">
            <div>{{ scope.row.productName }} ×{{ scope.row.quantity }}</div>
            <div class="price-info">￥{{ scope.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单编号"
          prop="orderSn"
          width="180"
        />
        <el-table-column label="物流信息" width="220">
          <template #default="scope">
            <div v-if="scope.row.trackingNo">
              <div>{{ scope.row.trackingNo }}</div>
              <div v-if="scope.row.logisticsCompany" class="logistics-company">
                {{ scope.row.logisticsCompany }}
              </div>
            </div>
            <div v-else>未发货</div>
          </template>
        </el-table-column>
        <el-table-column label="物流详细" width="120">
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
    
        <el-table-column label="订单款结清情况" width="150" fixed="right">
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
import { MessageBox, Notification } from 'element-ui'
import axios from 'axios'
import FilterForm from '@/components/FilterForm'

export default {
  components: {
    FilterForm
  },
  data() {
    // 生成示例订单数据
    const statusOptions = [
      '待付款',
      '待发货',
      '待收货',
      '待评价',
      '退货未处理',
      '待买家退货',
      '买家已退货',
      '买家退货到货',
      '已退款',
      '需要客服联系'
    ]

    const statusData = {
      待付款: {
        products: ['iPhone 15 Pro', 'MacBook Air', 'AirPods Pro'],
        customers: ['张三', '李四', '王五'],
        prices: [8999, 9999, 1999]
      },
      待发货: {
        products: ['iPad Pro', 'Apple Watch', 'Mac mini'],
        customers: ['赵六', '钱七', '孙八'],
        prices: [6999, 2999, 4999]
      },
      待收货: {
        products: ['iMac 24寸', 'HomePod', 'Magic Keyboard'],
        customers: ['周九', '吴十', '郑十一'],
        prices: [12999, 2299, 999]
      },
      待评价: {
        products: ['Apple Pencil', 'Mac Studio', 'Studio Display'],
        customers: ['王小明', '李小红', '张小花'],
        prices: [999, 19999, 11499]
      },
      退货未处理: {
        products: ['iPhone 14', 'iPad Air', 'AirTag'],
        customers: ['刘大', '陈二', '杨三'],
        prices: [5999, 3999, 299]
      },
      待买家退货: {
        products: ['Mac Pro', 'Magic Mouse', 'Apple TV'],
        customers: ['黄四', '林五', '徐六'],
        prices: [45999, 599, 1299]
      },
      买家已退货: {
        products: ['Apple Watch Ultra', 'HomePod mini', 'Magic Trackpad'],
        customers: ['吴七', '郑八', '王九'],
        prices: [6299, 999, 899]
      },
      买家退货到货: {
        products: ['iPad mini', 'MacBook Pro 16', 'AirPods Max'],
        customers: ['赵十', '钱一', '孙二'],
        prices: [3999, 19999, 3999]
      },
      已退款: {
        products: ['iPhone SE', 'iPad 10.2', 'Apple Watch SE'],
        customers: ['李三', '周五', '吴六'],
        prices: [3499, 2499, 1999]
      },
      需要客服联系: {
        products: ['iMac Pro', 'MacBook Pro 14', 'AirPods 3'],
        customers: ['郑七', '王八', '刘九'],
        prices: [45999, 14999, 1399]
      }
    }

    const demoOrders = []
    let id = 1
    const now = new Date()
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都']
    const paymentMethods = ['支付宝', '微信支付', '信用卡', '银行转账']

    Object.entries(statusData).forEach(([status, data]) => {
      data.products.forEach((product, index) => {
        const isPaid = status !== '待付款'
        const trackingNo =
          status === '待发货'
            ? ''
            : `YT${now.getFullYear()}${String(now.getMonth() + 1).padStart(
              2,
              '0'
            )}${String(id).padStart(4, '0')}`
        const logisticsCompany =
          status === '待发货'
            ? ''
            : ['顺丰速运', '中通快递', '圆通速递'][index % 3]

        demoOrders.push({
          id: id,
          orderId: id,
          orderNo: `ORD${now.getFullYear()}${String(
            now.getMonth() + 1
          ).padStart(2, '0')}${String(id).padStart(4, '0')}`,
          orderSn: `SN${now.getFullYear()}${String(id).padStart(6, '0')}`,
          status: status,
          createTime: new Date(
            now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          productName: product,
          quantity: index + 1,
          price: data.prices[index],
          amount: data.prices[index] * (index + 1),
          customerName: data.customers[index],
          trackingNo: trackingNo,
          logisticsCompany: logisticsCompany,
          trackingUrl: trackingNo
            ? `https://openapi.kdzs.com/#/toolRes/amap?trackMapCode=${trackingNo}&isNoShowInfo=true`
            : '',
          refundReason: status === '退货未处理' ? '商品有瑕疵' : '',
          refundImages:
            status === '退货未处理' ? ['https://example.com/refund1.jpg'] : [],
          isPaid: isPaid,
          paidAmount: isPaid ? data.prices[index] * (index + 1) : 0,
          address: `${cities[id % cities.length]}市某区某街道${Math.floor(
            Math.random() * 100
          )}号`,
          paymentMethod: paymentMethods[id % paymentMethods.length]
        })
        id++
      })
    })

    return {
      // selectedOrders: [], // 选中的订单
      //查询条件
      queryParams: {
        merchantName: '',
        category: '',
        filterTime: [], // 时间筛选范围
        filterStatus: null, // 状态筛选
      },
      //商品分类
      categoryOptions: [
        { value: 'food', label: '食品' },
        { value: 'clothing', label: '服装' },
        { value: 'electronics', label: '电子产品' }
      ],
      currentStatus: null, // 当前路由状态参数
      allOrders: demoOrders, // 所有订单数据
      statusData: statusData, // 订单状态数据
      // shipForm: {
      //   // 发货表单
      //   orderId: '',
      //   logisticsCompany: '',
      //   trackingNo: ''
      // },
      // refundForm: {
      //   // 退款表单
      //   orderId: '',
      //   reason: '',
      //   images: [],
      //   createTime: '',
      //   processType: '',
      //   processResult: '',
      //   rejectReason: ''
      // },
      statusOptions: [
        // 状态选项
        { value: '待付款', label: '待付款' },
        { value: '待发货', label: '待发货' },
        { value: '待收货', label: '待收货' },
        { value: '待评价', label: '待评价' },
        { value: '退货未处理', label: '退货未处理' },
        { value: '待买家退货', label: '待买家退货' },
        { value: '买家已退货', label: '买家已退货' },
        { value: '买家退货到货', label: '买家退货到货' },
        { value: '已退款', label: '已退款' },
        { value: '需要客服联系', label: '需要客服联系' }
      ],
 
    }
  },

  computed: {
    // 订单状态统计
    orderStatusCounts() {
      const counts = {}
      this.statusOptions.forEach((option) => {
        counts[option.label] = 0
      })

      this.filteredOrders.forEach((order) => {
        if (counts[order.status] !== undefined) {
          counts[order.status]++
        }
      })

      return counts
    },

    // 总订单数
    totalOrders() {
      return this.filteredOrders.length
    },

    // 筛选后的订单列表
    filteredOrders() {
      // 状态名称映射表
      const statusMap = {
        PendingPayment: '待付款',
        PendingDelivery: '待发货',
        PendingReceipt: '待收货',
        PendingReview: '待评价',
        ReturnUnprocessed: '退货未处理',
        BuyerReturning: '待买家退货',
        BuyerReturned: '买家已退货',
        ReturnReceived: '买家退货到货',
        Refunded: '已退款',
        NeedService: '需要客服联系'
      }

      // 调试输出
      console.log('当前路由:', this.$route)
      console.log('当前状态筛选:', this.queryParams.filterStatus)

      // 获取当前路由状态参数
      let routeStatus = this.$route.params.status
      if (
        !routeStatus &&
        this.$route.name &&
        this.$route.name !== 'OrderManage'
      ) {
        routeStatus =
          statusMap[this.$route.name] || this.$route.name.replace('Order', '')
      }

      // 优先使用路由参数过滤
      const statusFilter = routeStatus || this.queryParams.filterStatus
      console.log('最终状态筛选条件:', statusFilter)

      const filtered = this.allOrders.filter((order) => {
        // 时间筛选
        let timeMatch = true
        if (Array.isArray(this.queryParams.filterTime) && this.queryParams.filterTime.length === 2) {
          const [start, end] = this.queryParams.filterTime
          const orderDate = new Date(order.createTime)
            .toISOString()
            .split('T')[0]
          timeMatch = orderDate >= start && orderDate <= end
        }

        // 状态筛选
        let statusMatch = true
        if (statusFilter) {
          statusMatch = order.status === statusFilter
          console.log(`订单状态: ${order.status}, 匹配结果: ${statusMatch}`)
        }

        return timeMatch && statusMatch
      })

      console.log('筛选结果:', filtered)
      return filtered
    },

  },
  watch: {
    $route: 'updateFilterVisibility'
  },
  mounted() {
    this.updateFilterVisibility()
  },
  created() {
    this.currentStatus = this.$route.params.status
    if (this.currentStatus) {
      this.queryParams.filterStatus = this.currentStatus
    }
  },
  methods: {
  
    // 判断订单是否可选
    // checkSelectable(row) {
    //   return row.status !== '已支付' // 已支付的订单不可选
    // },

    // 处理选择变化
    // handleSelectionChange(selection) {
    //   this.selectedOrders = selection
    // },

    // 获取状态标签类型
    getStatusType(status) {
      return (
        {
          待付款: 'warning',
          待发货: 'primary',
          待收货: '',
          待评价: 'info',
          退货未处理: 'danger',
          待买家退货: 'warning',
          买家已退货: 'warning',
          买家退货到货: 'info',
          已退款: 'success',
          需要客服联系: 'danger'
        }[status] || 'info'
      )
    },

    // 获取状态图标
    getStatusIcon(status) {
      return (
        {
          待付款: 'el-icon-wallet',
          待发货: 'el-icon-box',
          待收货: 'el-icon-truck',
          待评价: 'el-icon-chat-dot-round',
          退货未处理: 'el-icon-warning',
          待买家退货: 'el-icon-back',
          买家已退货: 'el-icon-sold-out',
          买家退货到货: 'el-icon-receiving',
          已退款: 'el-icon-money',
          需要客服联系: 'el-icon-service'
        }[status] || 'el-icon-document'
      )
    },

    // 点击状态卡片筛选订单
    filterByStatus(status) {
      this.queryParams.filterStatus = status
    },

    // 时间筛选处理
    handleDateFilter(value) {
      if (!value || value.length === 0) {
        this.queryParams.filterTime = null
        this.$refs.table.clearSelection()
      }
    },

    // 重置筛选条件
    resetFilters() {
      this.queryParams = {
        merchantName: '',
        category: '',
        filterTime: [],
        filterStatus: null
      }
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
.el-form-item {
  padding-right: 10px;
}
.order-manage {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .status-statistics {
   
    .status-card {
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.active-card {
        border-color: #409eff;
        box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.2);
      }

      .el-card__body {
        padding: 15px;
        display: flex;
        align-items: center;
      }

      .status-icon {
        float: left;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        transition: all 0.3s ease;

        i {
          font-size: 24px;
          color: #fff;
        }

        &.status-icon-warning {
          background-color: #e6a23c;
        }
        &.status-icon-primary {
          background-color: #409eff;
        }
        &.status-icon-success {
          background-color: #67c23a;
        }
        &.status-icon-danger {
          background-color: #f56c6c;
        }
        &.status-icon-info {
          background-color: #909399;
        }
      }

      .status-info {
        flex: 1;

        .status-count {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          line-height: 1.2;
          margin-bottom: 4px;
          transition: all 0.3s ease;
        }

        .status-name {
          font-size: 13px;
          color: #909399;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      &.total-card {
        background-color: #f5f7fa;

        .status-count {
          color: #409eff;
        }

        .status-icon {
          background-color: #409eff;
        }
      }

      &:hover .status-count {
        color: #409eff;
      }
    }
  }

  .el-table {
    .price-info {
      @include price;
      font-size: 0.9em;
      margin-top: 4px;
    }

    .payment-status-paid {
      color: #67c23a;
      font-weight: 500;
    }

    .payment-status-unpaid {
      color: #f56c6c;
      font-weight: 500;
    }
  }
}
</style>
