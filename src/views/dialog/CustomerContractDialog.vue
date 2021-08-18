<template>
  <div class="customer-contract-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="customer-contract">
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ customerName }}</span>
      </div>
      <div class="customer-name">
        <span>权益列表</span>
        <span></span>
      </div>
      <div class="customer-contract-scroll">
        <div class="customer-contract-content">
          <div class="customer-contract-item-header">
            <span class="span-name">姓名</span>
            <span>合同类型</span>
            <span>会员卡名称/私教名称</span>
            <span>合同名称</span>
            <span>合同编号</span>
            <span>状态</span>
            <span>可用权限次/天/元</span>
            <span>剩余权限</span>
            <span>激活时间</span>
            <span>结束时间</span>
            <span>支付总额</span>
            <span>支付金额1</span>
            <span>支付方式1</span>
            <span>支付金额2</span>
            <span>支付方式2</span>
            <span>剩余金额</span>
            <span>抵用券金额</span>
            <span>办理销售</span>
            <span>上课私教</span>
            <span>支付时间</span>
            <span>办理时间</span>
            <span>渠道</span>
            <span>是否老合同</span>
            <span>退费金额</span>
            <span>退费方式</span>
            <span>退费日期</span>
            <span>操作</span>
          </div>
          <div class="customer-contract-item" v-for="(contract,contractIndex) in customerContractList"
               :key="contractIndex">
            <span>{{ customerName }}</span>
            <span>{{ contract.contractType|contractTypeFilter }}</span>
            <span v-if="contract.vipCardName">{{ contract.vipCardName }}</span>
            <span v-if="contract.trainingPlanName">{{ contract.trainingPlanName }}</span>
            <span
              v-if="contract.contractType==='TRANSFER_CARD' || contract.contractType==='OTHER_SALES'
              || contract.contractType==='GROUP_PURCHASE_PRICE'|| contract.contractType==='REFUND'">-</span>
            <span>{{ contract.contractName }}</span>
            <span>{{ contract.contractNumber }}</span>
            <span>{{ contract.contractStatus | contractStatusFilter }}</span>
            <span>{{ contract.totalRights }}</span>
            <span>{{ contract.leftRights }}</span>
            <span>{{ contract.activeTime }}</span>
            <span>{{ contract.endTime }}</span>
            <span>{{ contract.payTotalMoney }}</span>
            <span>{{ contract.payMoney }}</span>
            <span>{{ contract.payType |payTypeFilter }}</span>
            <span>{{ contract.payMoney2 }}</span>
            <span>{{ contract.payType2 |payTypeFilter }}</span>
            <span>{{ contract.leftMoney }}</span>
            <span>{{ contract.couponMoney }}</span>
            <span>{{ contract.salesmanName }}</span>
            <span>{{ contract.coachName }}</span>
            <span>{{ contract.payTime }}</span>
            <span>{{ contract.operationTime }}</span>
            <span>{{ contract.channel }}</span>
            <span v-if="contract.isOld===0">新合同</span>
            <span v-if="contract.isOld===1">老合同</span>
            <span>{{ contract.refundMoney }}</span>
            <span>{{ contract.refundPayType |payTypeFilter }}</span>
            <span>{{ contract.refundDate }}</span>
            <span>
              <div class="active-contract"
                   @click="activeContract(contract)"
                   v-if="contract.contractStatus==='PREPAYMENT'">
                激活
              </div>
              <div class="minus-card-times"
                   @click="finishTimes(contract)"
                   v-if="contract.contractType && contract.contractType==='VIP_CARD_CONTRACT' && contract.vipCardBigType==='COUNT_CARD'">
                销次卡一次
              </div>
              <div class="minus-coach-times"
                   @click="finishTimes(contract)"
                   v-if="contract.contractType && contract.contractType==='TRAINING_CONTRACT' && ( contract.trainingType && contract.trainingType!=='MONTH_TRAINING')">
                销私教一次
              </div>
              <div class="minus-times-record"
                   @click="showMinusClassHistory(contract)"
                   v-if="contract.vipCardBigType==='COUNT_CARD' || contract.trainingType==='EXPERIENCE_TRAINING' || contract.trainingType==='CLASS_TRAINING'">
                销课记录
              </div>
               <div class="refund-contract"
                    @click="refundContract(contract)"
                    v-if="contract.contractStatus!=='REFUNDED' && contract.contractType!=='REFUND'"
               >
                退款
              </div>
               <div class="delete-contract"
                    @click="deleteContract(contract)">
                删除
              </div>
            </span>
          </div>
          <div class="customer-contract-empty"
               v-if="customerContractList.length===0">
            暂无开通会员记录
          </div>
        </div>

      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 20vw">关闭</el-button>
        <el-button type="success" @click="showAddVipCard()">添加会员权益</el-button>
      </div>
    </div>
    <AddCustomerContractDialog
      :customer-id="customerId"
      :customer-name="customerName"
      :addCustomerContractDialogFlag.sync="addCustomerContractDialogFlag"
      @updateData="getDate"
      style="z-index: 40"
      v-if="addCustomerContractDialogFlag"
    >
    </AddCustomerContractDialog>
    <MessageInfoDialog
      style="z-index: 4000"
      :message="message"
      @messageSure="messageSure"
      v-if="messageInfoFlag"
    >
    </MessageInfoDialog>
    <ActiveCustomerContractDialog
      style="z-index: 100"
      :activeCustomerContractDialogFlag.sync="activeCustomerContractDialogFlag"
      :customer-contract="currentContract"
      :customerName="customerName"
      v-if="activeCustomerContractDialogFlag"
      @updateData="getDate"
    >
    </ActiveCustomerContractDialog>
    <MinusTimesHistoryDialog
      style="z-index: 110"
      :minusTimesDialogFlag.sync="minusTimesDialogFlag"
      :contract="currentContract"
      :customerName="customerName"
      v-if="minusTimesDialogFlag"
    >
    </MinusTimesHistoryDialog>
    <SureClassDialog
      style="z-index: 110"
      :sureClassDialogFlag.sync="sureClassDialogFlag"
      :contract="currentContract"
      @updateData="getDate"
      :customerName="customerName"
      v-if="sureClassDialogFlag"
    >
    </SureClassDialog>
    <RefundContractDialog
      style="z-index: 110"
      :refundContractFlag.sync="refundContractFlag"
      :contract="currentContract"
      @updateData="getDate"
      :customerName="customerName"
      v-if="refundContractFlag"
    >
    </RefundContractDialog>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import AddCustomerContractDialog from './AddCustomerContractDialog'
import ActiveCustomerContractDialog from './ActiveCustomerContractDialog'
import MinusTimesHistoryDialog from './MinusTimesHistoryDialog'
import {
  apiContractDelete,
  apiCustomerContractList
} from '../../api/contract'
import MessageInfoDialog from './MessageInfoDialog'
import SureClassDialog from './SureClassDialog'
import RefundContractDialog from './RefundContractDialog'

export default {
  components: {
    BackgroundBlack,
    AddCustomerContractDialog,
    MessageInfoDialog,
    ActiveCustomerContractDialog,
    MinusTimesHistoryDialog,
    SureClassDialog,
    RefundContractDialog
  },
  name: 'VipDurationDialog',
  data () {
    return {
      addCustomerContractDialogFlag: false,
      toDoSave: false,
      customerContractList: [],
      messageInfoFlag: false,
      message: '',
      currentContract: null,
      activeCustomerContractDialogFlag: false,
      minusTimesDialogFlag: false,
      sureClassDialogFlag: false,
      refundContractFlag: false
    }
  },
  created () {
    this.getDate()
  },
  destroyed () {
    this.$emit('getDataList')
  },
  methods: {
    getDate () {
      apiCustomerContractList(this.customerId).then(({data}) => {
        console.log(data)
        this.customerContractList = data.data
      })
    },
    finishTimes (contract) {
      // 销次数
      this.currentContract = contract
      this.sureClassDialogFlag = true
    },
    showMinusClassHistory (contract) {
      this.currentContract = contract
      this.minusTimesDialogFlag = true
    },
    activeContract (contract) {
      this.currentContract = contract
      this.activeCustomerContractDialogFlag = true
    },
    refundContract (contract) {
      this.currentContract = contract
      this.refundContractFlag = true
    },
    deleteContract (customerContract) {
      this.$confirm(`确定要删除名为 "${customerContract.contractName}" 的合同吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiContractDelete(customerContract.customerContractId).then(() => {
          this.message = '删除成功！'
          this.messageInfoFlag = true
          this.getDate()
        })
      })
    },
    showAddVipCard () {
      this.addCustomerContractDialogFlag = true
    },
    hiddenDialog () {
      this.$emit('update:customerContractDialogFlag', false)
    },
    messageSure () {
      this.messageInfoFlag = false
    }
  },
  props: {
    customerId: Number,
    customerName: String,
    customerContractDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.customer-contract-body {
  .customer-contract {
    width: 80vw;
    height: 70vh;
    position: fixed;
    left: 10vw;
    top: 15vh;
    background-color: #fff;
    border-radius: 20px;
    padding: 30px 20px 20px 20px;
    z-index: 2010;


    .customer-name {
      height: 36px;
      display: flex;

      span:nth-child(1) {
        display: block;
        height: 100%;
        width: 140px;
        line-height: 36px;
        text-align: left;
        padding-left: 30px;
      }

      span:nth-child(2) {
        height: 100%;
        width: 100px;
        display: block;
        line-height: 36px;
        text-align: left;
      }
    }

    .customer-contract-scroll {
      width: 90%;
      height: 70%;
      margin: 15px auto 0;

      .customer-contract-content {
        height: 100%;
        width: 100%;
        font-size: 16px;
        overflow: scroll;

        .customer-contract-item-header, .customer-contract-item {
          height: 50px;
          width: 3890px;

          > span {
            height: 50px;
            line-height: 50px;
            width: 100px;
            display: block;
            float: left;
            text-align: center;
          }

          > span:nth-child(1) {
            width: 60px;
          }

          > span:nth-child(2) {
            width: 100px;
          }

          > span:nth-child(3) {
            width: 180px;
          }

          > span:nth-child(4) {
            width: 210px;
          }

          > span:nth-child(5) {
            width: 240px;
          }

          > span:nth-child(6) {
            width: 100px;
          }

          > span:nth-child(7) {
            width: 140px;
          }

          > span:nth-child(8) {
            width: 80px;
          }

          > span:nth-child(9) {
            width: 100px;
          }

          > span:nth-child(10) {
            width: 100px;
          }

          > span:nth-child(11) {
            width: 80px;
          }

          > span:nth-child(12) {
            width: 100px;
          }

          > span:nth-child(13) {
            width: 100px;
          }

          > span:nth-child(14) {
            width: 110px;
          }

          > span:nth-child(15) {
            width: 120px;
          }

          > span:nth-child(16) {
            width: 110px;
          }

          > span:nth-child(17) {
            width: 120px;
          }

          > span:nth-child(18) {
            width: 110px;
          }

          > span:nth-child(19) {
            width: 110px;
          }

          > span:nth-child(20) {
            width: 120px;
          }

          > span:nth-child(21) {
            width: 190px;
          }

          > span:nth-child(22) {
            width: 140px;
          }

          > span:nth-child(23) {
            width: 100px;
          }

          > span:nth-child(24) {
            width: 80px;
          }

          > span:nth-child(25) {
            width: 100px;
          }

          > span:nth-child(26) {
            width: 160px;
          }

          > span:nth-child(27) {
            width: 490px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .minus-card-times, .delete-contract, .minus-coach-times, .active-contract, .minus-times-record, .refund-contract {
            width: 60px;
            height: 30px;
            border-radius: 5px;
            border: 1px solid #000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            margin-right: 30px;
          }

          .active-contract {
            background-color: #22bb5a;
            color: #fff;
            border: none;
          }

          .minus-times-record {
            border: 1px solid #1b9cc3;
            width: 80px;
            color: #1b9cc3;
          }

          .delete-contract {
            border: 1px solid #de5959;
            color: #de5959;
            margin-right: 0;
          }

          .refund-contract {
            border: 1px solid #e5c242;
            color: #e5c242;
            margin-right: 30px;
          }

          .minus-card-times {
            width: 80px;
            font-size: 12px;
          }

          .minus-coach-times {
            border: 1px solid #70c641;
            width: 80px;
            color: #70c641;
            font-size: 12px;
          }
        }

        .customer-contract-empty {
          width: 100%;
          height: 260px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
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
