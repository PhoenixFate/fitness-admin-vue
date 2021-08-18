<template>
  <div class="active-customer-contract-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="active-customer-contract">
      <div class="customer-card">
        <span>姓名</span>
        <span>{{ customerName }}</span>
      </div>
      <div class="customer-card">
        <span>合同名称</span>
        <span>{{ customerContract.contractName }}</span>
      </div>
      <div class="customer-card">
        <span>支付金额</span>
        <span>{{ customerContract.payMoney }}</span>
      </div>
      <div class="customer-card">
        <span>开始日期</span>
        <el-date-picker
          v-model="customerContract.activeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期">
        </el-date-picker>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 50px">取消</el-button>
        <el-button type="primary" @click="saveCustomerContract()">激活</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {getStrDate} from '../../utils/dateUtil'
import {apiActiveContract} from '../../api/contract'

export default {
  components: {BackgroundBlack},
  name: 'ActiveVipCardInDurationDialog',
  data () {
    return {}
  },
  created () {
    this.customerContract.activeTime = getStrDate(new Date())
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:activeCustomerContractDialogFlag', false)
    },
    saveCustomerContract () {
      if (!this.customerContract.activeTime) {
        this.$message.warning('请选择开始日期')
        return
      }
      console.log(this.customerContract)
      apiActiveContract(this.customerContract).then(() => {
        this.success()
        this.hiddenDialog()
        this.$emit('updateData')
      })
    },
    success () {
      this.toDoSave = true
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
    activeCustomerContractDialogFlag: Boolean,
    customerContract: Object,
    customerName: String
  }
}
</script>

<style scoped lang="scss">
.active-customer-contract-body {
  .active-customer-contract {
    width: 440px;
    height: 380px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -220px;
    margin-top: -190px;
    background-color: #fff;
    border-radius: 20px;
    padding: 40px 20px 40px 20px;
    z-index: 2010;
    border: 1px solid #000;

    .contract-type {
      height: 44px;
      background-color: #e2e2e2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
    }

    .customer-card {
      height: 48px;
      display: flex;

      > span:nth-child(1) {
        display: block;
        height: 100%;
        width: 120px;
        line-height: 36px;
        text-align: center;
        margin-right: 30px;
      }

      > span:nth-child(2) {
        line-height: 36px;
        text-align: left;
        width: 220px;
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
        width: 100px;
      }

      .contract-type-selected {
        background-color: #3ab3a7;
      }
    }

    .bottom-button {
      position: absolute;
      bottom: 30px;
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
