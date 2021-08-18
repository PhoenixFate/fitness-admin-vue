<template>
  <div class="minus-times-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="minus-times">
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ customerName }}</span>
      </div>
      <div class="customer-name">
        <span>合同名称</span>
        <span>{{ contract.contractName }}</span>
      </div>
      <div class="customer-name">
        <span>退款金额</span>
        <el-input v-model="dataForm.refundMoney" type="number" placeholder="请输入退款金额"
                  style="width: 220px"></el-input>
      </div>
      <div class="customer-name">
        <span>支付方式</span>
        <el-select v-model="dataForm.refundPayType" clearable placeholder="退款支付方式" style="margin-right: 30px">
          <el-option
            v-for="item in payWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="customer-name">
        <span>退款日期</span>
        <el-date-picker
          v-model="dataForm.refundDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择退款日期">
        </el-date-picker>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 50px">取消</el-button>
        <el-button type="primary" @click="refundContract()">确认退款</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {PayTypeOptions} from '../../const/payType'
import {apiRefundContract} from '../../api/contract'

export default {
  components: {BackgroundBlack},
  name: 'ModifyContractDialog',
  data () {
    return {
      dataForm: {
        customerContractId: '',
        refundMoney: '',
        refundDate: '',
        refundPayType: ''
      },
      payWayOptions: PayTypeOptions
    }
  },
  created () {
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:refundContractFlag', false)
    },
    refundContract () {
      this.dataForm.customerContractId = this.contract.customerContractId
      if (!this.dataForm.refundMoney) {
        this.$message({
          message: '退款金额不能为空',
          type: 'warning'
        })
        return
      }
      if (!this.dataForm.refundDate) {
        this.$message({
          message: '退款日期不能为空',
          type: 'warning'
        })
        return
      }
      if (!this.dataForm.refundPayType) {
        this.$message({
          message: '退款支付方式不能为空',
          type: 'warning'
        })
        return
      }
      apiRefundContract(this.dataForm).then(() => {
        this.$emit('update:refundContractFlag', false)
        this.$emit('updateData')
      })
    }
  },
  props: {
    refundContractFlag: Boolean,
    contract: Object,
    customerName: ''
  }
}
</script>

<style scoped lang="scss">
.minus-times-body {
  .minus-times {
    width: 420px;
    height: 400px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -210px;
    margin-top: -250px;
    background-color: #fff;
    border-radius: 20px;
    padding: 30px 20px 20px 20px;
    z-index: 2010;
    border: 1px solid black;

    .customer-name {
      height: 50px;
      display: flex;

      span:nth-child(1) {
        display: block;
        height: 100%;
        width: 120px;
        line-height: 36px;
        text-align: left;
        padding-left: 30px;
      }

      span:nth-child(2) {
        height: 100%;
        width: 200px;
        display: block;
        line-height: 36px;
        text-align: left;
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
</style>
