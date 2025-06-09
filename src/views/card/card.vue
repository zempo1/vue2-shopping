<template>
  <div class="app-container">
    <!-- 搜索筛选区域 -->
    <el-card class="header-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="序列号">
          <el-input v-model="queryParams.serialNumber" placeholder="请输入序列号" clearable />
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="queryParams.amount" :min="0" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="核销状态">
          <el-select v-model="queryParams.status" placeholder="请选择核销状态" clearable>
            <el-option label="未核销" value="unused" />
            <el-option label="已核销" value="used" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery" >查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 序列号列表 -->
    <el-card class="list-container">
      <div class="table-operations">
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAdd">新增序列号</el-button>
        <el-button type="primary" size="medium" :disabled="!selectedCard.length" @click="handleExport">批量导出</el-button>
        <el-button type="danger" size="medium" @click="handleImportClick">批量导入</el-button>
        <el-button type="info" size="medium" @click="downloadTemplate">下载导入模板</el-button>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept=".xlsx,.xls"
          @change="handleImportFile"
        />
      </div>
      
      <el-table v-loading="loading" :data="cardList" border  style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"  />
        <el-table-column prop="serialNumber" label="序列号" width="210" align="center" />
        <el-table-column prop="amount" label="金额" width="120" align="center">
          <template #default="scope">
            <span class="amount">¥{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="有效开始时间" width="170" align="center" />
        <el-table-column prop="endTime" label="有效结束时间" width="170" align="center" />
        <el-table-column prop="status" label="核销状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="scope">
            <el-button size="medium" type="primary" icon="el-icon-edit-outline" circle @click="handleEdit(scope.row)"></el-button>
            <el-button size="medium" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"></el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="系统自动生成" readonly />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="有效期" prop="validityPeriod">
          <el-date-picker
            v-model="form.validityPeriod"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
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
import * as XLSX from 'xlsx'
import {addZero} from '@/utils/index.js'

export default {
  name: 'CardManage',
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNumber: '',
        amount: undefined,
        dateRange: [],
        status: ''
      },
      // 列表数据
      cardList: [],
      total: 0,
      loading: false,
      selectedCard: [], // 选中的卡券
      // 对话框相关
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: '',
        serialNumber: '', //序列号
        amount: 0, //金额
        validityPeriod: [], //有效期范围
        remark: '', //备注,
        startTime: '',
        endTime: ''
      },
      // 表单验证规则
      rules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        validityPeriod: [
          { required: true, message: '请选择有效期', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      // TODO: 调用接口获取数据
      setTimeout(() => {
        this.cardList = [
          {
            id: 1,
            serialNumber: 'CARD2023001',
            amount: 100,
            startTime: '2023-01-01',
            endTime: '2023-12-31',
            status: 'unused',
            remark: '测试卡券'
          }
        ]
        this.total = 1
        this.loading = false
      }, 500)
    },
    // 查询操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置查询
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        serialNumber: '',
        amount: undefined,
        dateRange: [],
        status: ''
      }
      this.getList()
    },
    // 生成随机序列号
    generateSerialNumber() {
      const now = new Date()
      const timestamp = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0') 
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      return `CARD${timestamp}${random}`
    },
    // 新增操作
    handleAdd() {
      this.dialogTitle = '新增序列号'
      this.form = {
        serialNumber: this.generateSerialNumber(),
        amount: 0,
        validityPeriod: [],
        remark: ''
      }
      this.dialogVisible = true
    },
    // 编辑操作
    handleEdit(row) {
      this.dialogTitle = '编辑序列号'
      this.form = {
        id: row.id,
        serialNumber: row.serialNumber,
        amount: row.amount,
        validityPeriod: [row.startTime, row.endTime],
        remark: row.remark
      }
      this.dialogVisible = true
    },
    // 删除操作
    handleDelete(row) {
      this.$confirm('确认删除该序列号吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // TODO: 调用删除接口
        const index = this.cardList.indexOf(row)
        this.cardList.splice(index, 1)
        this.$message.success('删除成功')
        // this.getList()
      }).catch(() => {})
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // TODO: 调用保存接口
          console.log(this.form);
          this.form.startTime = this.form.validityPeriod[0]
          this.form.endTime = this.form.validityPeriod[1]
          this.form.status = 'unused' // 默认状态为未核销
          if(this.dialogTitle === '新增序列号'){
            this.cardList.push(this.form)
            console.log(1);
          }else{
            // 编辑操作
            const index = this.cardList.findIndex(item => item.id === this.form.id)
            this.cardList.splice(index, 1, this.form)
          }
          this.$message.success('保存成功')
          this.dialogVisible = false
          // this.getList()
        }
      })
    },
    // 选择操作
    handleSelectionChange(val) {
      this.selectedCard = val
    },
    // 分页操作
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        unused: 'success',
        used: 'info',
        expired: 'danger'
      }
      return statusMap[status]
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        unused: '未核销',
        used: '已核销',
        expired: '已过期'
      }
      return statusMap[status]
    },
    // 导出Excel
    handleExport() {
      const header = {
        serialNumber: '序列号',
        amount: '金额',
        startTime: '有效开始时间',
        endTime: '有效结束时间',
        status: '核销状态',
        remark: '备注'
      }
      const data = this.cardList.map(item => ({
        ...item,
        status: this.getStatusText(item.status)
      }))
      
      // 计算每列的最大宽度
      const columnWidths = {}
      const headerKeys = Object.keys(header)
      // 初始化列宽为表头的长度
      headerKeys.forEach(key => {
        columnWidths[key] = header[key].length
      })
      
      // 遍历数据计算每列的最大宽度
      data.forEach(item => {
        headerKeys.forEach(key => {
          const cellValue = String(item[key] || '')
          columnWidths[key] = Math.max(columnWidths[key], cellValue.length)
        })
      })
      
      const ws = XLSX.utils.json_to_sheet([header, ...data.map(item => ({
        serialNumber: item.serialNumber,
        amount: item.amount,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        remark: item.remark || ''
      }))], { skipHeader: true })
      
      // 设置列宽
      ws['!cols'] = headerKeys.map(key => ({
        wch: columnWidths[key] + 4 
      }))
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '序列号列表')
      XLSX.writeFile(wb, `序列号列表_${new Date().toLocaleDateString()}.xlsx`)
    },
    // 触发文件选择
    handleImportClick() {
      this.$refs.fileInput.click()
    },
    // 处理文件导入
    handleImportFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        try {
          const data = loadEvent.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const records = XLSX.utils.sheet_to_json(worksheet, {
            header: ['amount', 'startTime', 'endTime', 'remark'],
          });
          records.shift(); // 移除表头

          const validRecords = records.filter(record => {
            if (!record.amount || !record.startTime || !record.endTime) return false;
            try {
              if (typeof record.startTime === 'number') {
                const date = XLSX.SSF.parse_date_code(record.startTime);
                record.startTime = `${date.y}-${addZero(date.m.toString())}-${addZero(date.d.toString())}`;
              }
              if (typeof record.endTime === 'number') {
                const date = XLSX.SSF.parse_date_code(record.endTime);
                record.endTime = `${date.y}-${addZero(date.m.toString())}-${addZero(date.d.toString())}`;
              }
              return true;
            } catch (error) {
              console.error('日期格式转换失败:', error);
              return false;
            }
          });

          if (validRecords.length === 0) {
            this.$message.error('导入的数据格式不正确');
            return;
          }
          
          // 导入数据
          validRecords.forEach(record => {
            this.cardList.push({
              ...record,
              serialNumber: this.generateSerialNumber(),
              status: 'unused'
            });
          });

          this.$message.success(`成功导入${validRecords.length}条记录`);
        } catch (error) {
          console.error('文件解析错误:', error);
          this.$message.error('文件解析失败');
        } finally {
          e.target.value = '';
        }
      };

      reader.onerror = (errorEvent) => {
        console.error('文件读取错误:', errorEvent);
        this.$message.error('文件读取失败');
        e.target.value = '';
      };

      reader.readAsArrayBuffer(file);
    },
    // 下载导入模板
    downloadTemplate() {
      const header = [ '金额', '有效开始时间', '有效结束时间', '备注']
      const ws = XLSX.utils.aoa_to_sheet([header])
      
      // 计算列宽
      const columnWidths = header.map(h => ({ wch: h.length + 10 })) // 加10是为了留出一些边距
      ws['!cols'] = columnWidths
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '导入模板')
      XLSX.writeFile(wb, '序列号导入模板.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/index.scss';
  
  
  .el-form-item {
    padding: 0 4px;
  }
  .list-container {
    .table-operations {
      margin-bottom: 20px;
    }
    .amount {
      @include price;
    }
  }
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
</style>