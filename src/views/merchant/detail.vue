<template>
  <div class="merchant-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商家认证信息</span>
        <!-- 将按钮移到右侧 -->
        <div class="operation-buttons">
          <el-button type="primary" size="small" @click="success()">通过审核</el-button>
          <el-button type="danger" size="small" @click="reject()">拒绝</el-button>
        </div>
      </div>
      <el-form ref="form" :model="merchantForm" label-width="120px">
        <h3>基本信息</h3>
        <el-form-item label="商家名称">
          <el-input v-model="merchantForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="merchantForm.idNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号">
          <el-input v-model="merchantForm.alipayAccount" disabled></el-input>
        </el-form-item>
         <el-form-item label="银行卡号">
          <el-input v-model="merchantForm.bankCard" disabled></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="merchantForm.bankName" disabled></el-input>
        </el-form-item>
        <el-form-item label="店铺介绍">
          <el-input type="textarea" v-model="merchantForm.description" disabled rows="3"></el-input>
        </el-form-item>

        <h3>证件信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证正面">
              <el-image
                style="width: 200px; height: 120px"
                :src="merchantForm.idCardFront"
                fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面">
              <el-image
                style="width: 200px; height: 120px"
                :src="merchantForm.idCardBack"
                fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业执照">
              <el-image
              style="width: 200px; height: 120px"
              :src="merchantForm.businessLicense"
              fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检报告">
              <el-image
              style="width: 200px; height: 120px"
              :src="merchantForm.qualityReport"
              fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
       
        <el-form-item label="食品经营许可证">
          <el-image
            style="width: 200px; height: 120px"
            :src="merchantForm.foodLicense"
            fit="cover">
          </el-image>
        </el-form-item>

        <el-form-item label="食品安全证明">
          <el-image
            style="width: 200px; height: 120px"
            :src="merchantForm.foodSafetyCert"
            fit="cover">
          </el-image>
        </el-form-item>
       

        <h3>负责人信息</h3>
        <el-form-item label="负责人姓名">
          <el-input v-model="merchantForm.managerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="merchantForm.managerPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="merchantForm.managerIdNumber" disabled></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证正面">
              <el-image
                style="width: 200px; height: 120px"
                :src="merchantForm.managerIdCardFront"
                fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面">
              <el-image
                style="width: 200px; height: 120px"
                :src="merchantForm.managerIdCardBack"
                fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>

        <h3>法人信息</h3>
        <el-form-item label="法人姓名">
          <el-input v-model="merchantForm.legalName" disabled></el-input>
        </el-form-item>
        <el-form-item label="法人电话">
          <el-input v-model="merchantForm.legalPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="merchantForm.legalIdNumber" disabled></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证正面">
              <el-image
                style="width: 200px; height: 120px"
                :src="merchantForm.legalIdCardFront"
                fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面">
              <el-image
                style="width: 200px; height: 120px"
                :src="merchantForm.legalIdCardBack"
                fit="cover">
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Merchant',
  data() {
    return {
      merchantForm: {
        //商家信息
        name: '示例商家',
        idNumber: '310000199001011234',
        alipayAccount: 'example@alipay.com',
        bankCard: '6222000000000000000',
        bankName: '中国工商银行',
        description: '这是一家专注于提供优质食品的商家，拥有多年的行业经验...',
        idCardFront: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        idCardBack: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        businessLicense: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        foodLicense: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        qualityReport: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        foodSafetyCert: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        //负责人信息
        managerName: '张三', 
        managerPhone: '13800000000',
        managerIdNumber:'445121222222222',
        managerIdCardFront: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        managerIdCardBack: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        //法人信息
        legalName: '李四',
        legalPhone: '13900000000',
        legalIdNumber:'445121222222222',
        legalIdCardFront: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        legalIdCardBack: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
         
      }
    }
  },
  methods: {
    success() {
      this.$message.success('通过审核')
      this.$router.push({ name: 'Merchant' })
    },
    reject() {
      this.$message.success('打回成功')
      this.$router.push({ name: 'Merchant' })
    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-container {
  padding: 20px;

  .box-card {
    width: 100%;
    margin-bottom: 20px;
  }

  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;  // 添加左右内边距
  }

  .operation-buttons {
    flex-shrink: 0;  // 防止按钮被压缩
    margin-left: auto;  // 将按钮推到最右边
    .el-button {
      margin-left: 10px;
    }
  }

  h3 {
    margin: 20px 0;
    padding-left: 8px;
    border-left: 4px solid #409EFF;
  }

  .el-form {
    max-width: 980px;
    margin: 0 auto;
  }
}
</style>
