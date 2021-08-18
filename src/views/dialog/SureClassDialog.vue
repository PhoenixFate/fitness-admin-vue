<template>
  <div class="add-customer-contract-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="add-customer-contract">
      <div class="customer-card">
        <span>姓名</span>
        <span>{{ customerName }}</span>
      </div>
      <div class="customer-card">
        <span>合同名称</span>
        <span>{{ contract.contractName }}</span>
      </div>
      <div class="customer-card">
        <span>操作员</span>
        <el-input v-model="dataForm.operationName" placeholder="默认为当前账户"
                  style="width: 220px"></el-input>
      </div>
      <div class="customer-card">
        <span>销课时间</span>
        <el-date-picker
          v-model="dataForm.sureClassTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择销课时间"
          default-time="12:00:00">
        </el-date-picker>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 50px">取消</el-button>
        <el-button type="primary" @click="saveCustomerContract()">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {getStrDateLong} from '../../utils/dateUtil'
import {apiFinishTimes} from '../../api/contract'

export default {
  components: {BackgroundBlack},
  name: 'SureClassDialog',
  data () {
    return {
      dataForm: {
        customerContractId: null,
        operationName: '',
        sureClassTime: '',
        client: null
      }
    }
  },
  created () {
    this.dataForm.operationName = this.$store.state.user.name
    this.dataForm.sureClassTime = getStrDateLong(new Date())
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:sureClassDialogFlag', false)
    },
    saveCustomerContract () {
      console.log(this.dataForm)
      if (!this.dataForm.sureClassTime) {
        this.$message.warning('请选择销课日期')
        return
      }
      if (!this.dataForm.operationName) {
        // 为空则默认为当前操作员
        this.dataForm.operationName = this.$store.state.user.name
      }
      this.dataForm.customerContractId = this.contract.customerContractId
      this.dataForm.client = 'ADMIN'
      apiFinishTimes(this.dataForm).then(() => {
        this.success()
        this.hiddenDialog()
        this.$emit('updateData')
      })
    },
    success () {
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
        }
      })
    }
  },
  props: {
    contract: Object,
    customerName: String,
    sureClassDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.add-customer-contract-body {
  .add-customer-contract {
    width: 400px;
    height: 400px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -200px;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px 0 20px 20px;
    z-index: 2010;
    border: 1px solid #000;
    font-size: 14px;

    .contract-type {
      height: 44px;
      background-color: #e2e2e2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      margin-right: 6px;
    }


    .customer-card {
      height: 48px;
      display: flex;

      > span:nth-child(1) {
        display: block;
        height: 100%;
        width: 100px;
        line-height: 36px;
        text-align: center;
        margin-right: 20px;
      }

      > span:nth-child(2) {
        line-height: 36px;
        text-align: left;
        width: 140px;
      }

      .select-vip-card, .contract-type {
        height: 36px;
        width: 140px;
        background-color: #e2e2e2;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        font-size: 1rem;
      }


      .contract-type {
        width: 80px;
      }

      .contract-type-selected {
        background-color: #3ab3a7;
      }
    }

    .special-line {
      height: 168px;
      display: flex;

      textarea {
        width: 220px;
        height: 150px;
      }
    }


    .bottom-button {
      position: absolute;
      bottom: 20px;
      width: calc(100% - 40px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.old-contract {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
</style>
