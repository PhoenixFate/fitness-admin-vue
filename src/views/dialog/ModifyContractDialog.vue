<template>
  <div class="minus-times-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="minus-times">
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ contract.customer.name }}</span>
      </div>
      <div class="customer-name">
        <span>合同名称</span>
        <el-input v-model="contract.contractName" placeholder="请输入合同名称" style="width: 220px"></el-input>
      </div>
      <div class="customer-name">
        <span>合同金额</span>
        <el-input v-model="contract.payMoney" type="number" placeholder="请输入支付金额"
                  style="width: 220px"></el-input>
      </div>
      <div class="customer-name">
        <span>开始日期</span>
        <el-date-picker
          v-model="contract.activeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期">
        </el-date-picker>
      </div>
      <div class="customer-name">
        <span>结束日期</span>
        <el-date-picker
          v-model="contract.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期">
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
import {apiUpdateContract} from '../../api/contract'

export default {
  components: {BackgroundBlack},
  name: 'ModifyContractDialog',
  data () {
    return {}
  },
  created () {
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:modifyContractFlag', false)
    },
    saveCustomerContract () {
      this.contract.totalMoney = this.contract.payMoney
      apiUpdateContract(this.contract).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500
        })
      }).finally(() => {
        this.$emit('getDate')
        this.hiddenDialog()
      })
    }
  },
  props: {
    modifyContractFlag: Boolean,
    contract: Object
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
