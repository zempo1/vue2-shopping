<template>
  <div class="app-container">
    <el-table :data="merchantList" border style="width: 100%" >
      <el-table-column prop="name" label="商家名称" width="400"  />
      <el-table-column prop="alipayAccount" label="支付宝账号" width="250" />
      <el-table-column prop="bankCard" label="银行卡号" width="250" />
      <el-table-column prop="idCard" label="身份证信息" width="250" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="viewDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MerchantList',
  data() {
    return {
      merchantList: [
        {
          id: 1,
          alipayAccount: 'merchant1@alipay.com',
          bankCard: '6222026000000000018',
          name: '示例商家1',
          idCard: '310000199001011234'
        },
        {
          id: 2,
          alipayAccount: 'merchant2@alipay.com',
          bankCard: '6222026000000000019',
          name: '示例商家2',
          idCard: '310000199001011235'
        }
      ]
    }
  },
  methods: {
    viewDetail(row) {
      this.$router.push(`/merchant/detail/${row.id}`)
    }
  }
}
</script>