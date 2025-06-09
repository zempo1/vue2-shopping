<template>
  <el-form size="small" :inline="true" :model="queryParams" class="demo-form-inline">
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
        v-model="queryParams.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item>
      <el-button size="medium" type="primary" @click="handleQuery">查询</el-button>
      <el-button size="medium" @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FilterForm',
  props: {
    // 查询参数
    queryParams: {
      type: Object,
      required: true
    },
    // 商品分类选项
    categoryOptions: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 查询按钮点击事件
    handleQuery() {
      this.$emit('query')
    },
    // 重置按钮点击事件
    handleReset() {
      this.$emit('reset')
    }
  }
}
</script>

<style scoped>
.demo-form-inline .el-form-item {
  margin-right: 10px;
}
</style>