<template>
  <div class="add-customer-contract-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="add-customer-contract">
      <div class="customer-card">
        <span>姓名</span>
        <span>{{ customerName }}</span>
      </div>
      <div class="customer-card" style="margin-bottom: 10px">
        <span>合同类型</span>
        <div class="contract-type"
             :class="customerContract.contractType==='VIP_CARD_CONTRACT'?'contract-type-selected':''"
             @click="selectContractType('VIP_CARD_CONTRACT')">
          <span>会员卡</span>
        </div>
        <div class="contract-type"
             :class="customerContract.contractType==='TRAINING_CONTRACT'?'contract-type-selected':''"
             @click="selectContractType('TRAINING_CONTRACT')"
        >
          <span>私教</span>
        </div>
        <div class="contract-type"
             :class="customerContract.contractType==='TRANSFER_CARD'?'contract-type-selected':''"
             @click="selectContractType('TRANSFER_CARD')"
        >
          <span>转/补卡费</span>
        </div>
        <div class="contract-type"
             :class="customerContract.contractType==='OTHER_SALES'?'contract-type-selected':''"
             @click="selectContractType('OTHER_SALES')"
        >
          <span>其他销售</span>
        </div>
        <div class="contract-type"
             :class="customerContract.contractType==='GROUP_PURCHASE_PRICE'?'contract-type-selected':''"
             @click="selectContractType('GROUP_PURCHASE_PRICE')"
        >
          <span>团购补价</span>
        </div>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='VIP_CARD_CONTRACT'">
        <span>会员卡类型</span>
        <div class="select-vip-card" @click="showVipCardDialog">
          <span v-if="!customerContract.vipCard">选择会员卡</span>
          <span v-if="customerContract.vipCard">{{ customerContract.vipCard.vipCardName }}</span>
        </div>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='TRAINING_CONTRACT'">
        <span>私教类型</span>
        <div class="select-vip-card" @click="showTrainingPlanDialog">
          <span v-if="!customerContract.trainingPlan">选择私教类型</span>
          <span v-if="customerContract.trainingPlan">{{ customerContract.trainingPlan.trainingPlanName }}</span>
        </div>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='VIP_CARD_CONTRACT'">
        <span>原价</span>
        <span v-if=" customerContract.vipCard ">{{ customerContract.vipCard.price }}</span>
        <span v-if=" !customerContract.vipCard ">-</span>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='TRAINING_CONTRACT'">
        <span>价格</span>
        <span v-if=" customerContract.trainingPlan ">{{ customerContract.trainingPlan.price }}</span>
        <span v-if=" !customerContract.trainingPlan ">-</span>
      </div>
      <div class="customer-card" v-if="customerContract.contractStatus==='INITIAL'">
        <span
          v-if="customerContract.contractType==='VIP_CARD_CONTRACT' || customerContract.contractType==='TRAINING_CONTRACT' || customerContract.contractType==='GROUP_PURCHASE_PRICE'">开始日期</span>
        <span
          v-if="customerContract.contractType==='TRANSFER_CARD' || customerContract.contractType==='OTHER_SALES'">日期</span>
        <el-date-picker
          v-model="customerContract.activeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期">
        </el-date-picker>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='GROUP_PURCHASE_PRICE'">
        <span>结束日期</span>
        <el-date-picker
          v-model="customerContract.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期">
        </el-date-picker>
      </div>
      <div class="customer-card">
        <span>付款时间</span>
        <el-date-picker
          v-model="customerContract.payTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择付款日期">
        </el-date-picker>
      </div>
      <div class="customer-card">
        <span>合同名称</span>
        <el-input v-model="customerContract.contractName" placeholder="请输入合同名称" style="width: 180px"></el-input>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='TRAINING_CONTRACT'">
        <span>总课程数</span>
        <span v-if=" customerContract.trainingPlan && customerContract.trainingPlan.trainingType!=='MONTH_TRAINING'">{{
            customerContract.trainingPlan.totalClass
          }}</span>
        <span
          v-if=" !customerContract.trainingPlan || customerContract.trainingPlan.trainingType==='MONTH_TRAINING'">-</span>
      </div>
      <div class="customer-card"
           v-if="customerContract.contractType==='TRAINING_CONTRACT' && (!customerContract.trainingPlan || customerContract.trainingPlan.trainingType!=='MONTH_TRAINING')">
        <span>单课价格</span>
        <el-input v-model="customerContract.oneClassMoney" placeholder="请输入私教单课价格" style="width: 180px"
                  type="number"></el-input>
      </div>
      <div class="customer-card">
        <span>支付金额</span>
        <el-input v-model="customerContract.payMoney" type="number" placeholder="请输入支付金额"
                  style="width: 180px;margin-right: 42px"></el-input>
        <el-input v-model="customerContract.payMoney2" type="number" placeholder="请输入支付金额2"
                  style="width: 180px"></el-input>
      </div>
      <div class="customer-card">
        <span>支付方式</span>
        <el-select v-model="customerContract.payType" clearable placeholder="支付方式" style="margin-right: 30px">
          <el-option
            v-for="item in payWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="customerContract.payType2" clearable placeholder="支付方式2">
          <el-option
            v-for="item in payWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='GROUP_PURCHASE_PRICE'">
        <span>税后支付金额</span>
        <el-input v-model="customerContract.afterTaxPayMoney" type="number" placeholder="请输入税后支付金额"
                  style="width: 180px"></el-input>
      </div>
      <div class="customer-card"
           v-if="customerContract.contractType==='VIP_CARD_CONTRACT' || customerContract.contractType==='TRAINING_CONTRACT'">
        <span>抵用券金额</span>
        <el-input v-model="customerContract.couponMoney" type="number" placeholder="请输入抵用券金额"
                  style="width: 180px"></el-input>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='VIP_CARD_CONTRACT'">
        <span>赠送天数</span>
        <el-input v-model="customerContract.freeDays" type="number" placeholder="请输入赠送天数"
                  style="width: 180px"></el-input>
      </div>
      <div class="customer-card">
        <span>销售人员</span>
        <el-select v-model="customerContract.salesmanId" @change="selectOneSalesman" clearable placeholder="请选择销售人员">
          <el-option
            v-for="item in salesmanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="customer-card">
        <span>渠道</span>
        <el-input v-model="customerContract.channel" placeholder="请输入渠道" style="width: 180px"></el-input>
      </div>
      <div class="customer-card">
        <span>是否老合同</span>
        <div class="old-contract">
          <el-radio v-model="customerContract.isOld" label="0">新合同</el-radio>
          <el-radio v-model="customerContract.isOld" label="1">老合同</el-radio>
        </div>
      </div>
      <div class="customer-card" v-if="customerContract.contractType==='VIP_CARD_CONTRACT'">
        <span>是否预收费</span>
        <div class="old-contract">
          <el-radio v-model="customerContract.contractStatus" label="INITIAL" @change="selectPrepayment">非预先收费
          </el-radio>
          <el-radio v-model="customerContract.contractStatus" label="PREPAYMENT" @change="selectPrepayment">预先收费
          </el-radio>
        </div>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 50px">取消</el-button>
        <el-button type="primary" @click="saveCustomerContract()">保存</el-button>
      </div>
    </div>
    <VipCardDialog
      :vip-card-list="vipCardList"
      :vipDialogFlag.sync="vipCardDialogFlag"
      @selectOneVipCard="selectOneVipCard"
      style="z-index: 1100"
      v-if="vipCardDialogFlag"
    >
    </VipCardDialog>
    <TrainingPlanDialog
      :trainingPlanList="trainingPlanList"
      :trainingPlanDialogFlag.sync="trainingPlanDialogFlag"
      @selectOneTrainingPlan="selectOneTrainingPlan"
      style="z-index: 1100"
      v-if="trainingPlanDialogFlag"
    >
    </TrainingPlanDialog>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import VipCardDialog from './VipCardDialog'
import {apiVipCardList} from '../../api/vipCard'
import {getStrDate} from '../../utils/dateUtil'
import {apiSaveCustomerContract} from '../../api/contract'
import {apiTrainingPlanList} from '../../api/trainingPlan'
import TrainingPlanDialog from './TrainingPlanDialog'
import {apiSalesmanList} from '../../api/salesman'
import {PayTypeOptions} from '../../const/payType'

export default {
  components: {BackgroundBlack, VipCardDialog, TrainingPlanDialog},
  name: 'AddVipCardInDurationDialog',
  data () {
    return {
      customerContract: {
        contractName: '',
        contractType: 'VIP_CARD_CONTRACT',
        activeTime: '',
        payMoney: '',
        payMoney2: '',
        afterTaxPayMoney: '',
        endDate: '',
        vipCard: null,
        trainingPlan: null,
        salesmanName: '',
        channel: '',
        payType: '',
        payType2: '',
        oneClassMoney: '',
        freeDays: 0,
        couponMoney: 0,
        isOld: '0',
        contractStatus: 'INITIAL',
        payTime: ''
      },
      payWayOptions: PayTypeOptions,
      salesmanOptions: [],
      vipCardDialogFlag: false,
      vipCardList: [],
      trainingPlanList: [],
      trainingPlanDialogFlag: false,
      salesmanList: []
    }
  },
  created () {
    this.customerContract.customerId = this.customerId
    this.customerContract.activeTime = getStrDate(new Date())
    this.customerContract.payTime = getStrDate(new Date())
    this.customerContract.contractName = this.customerName + '-会员卡'
    this.getData()
  },
  watch: {
    'customerContract.oneClassMoney': {
      handler: function (val, oldVal) {
        if (this.customerContract.trainingPlan && this.customerContract.trainingPlan.totalClass) {
          this.customerContract.payMoney = (val * this.customerContract.trainingPlan.totalClass).toFixed(2)
        }
      }
    }
  },
  methods: {
    getData () {
      apiVipCardList({limit: 100}).then(({data}) => {
        this.vipCardList = data.data.list
      })
      apiTrainingPlanList({limit: 100}).then(({data}) => {
        this.trainingPlanList = data.data.list
        console.log(this.trainingPlanList)
      })
      apiSalesmanList({limit: 100}).then(({data}) => {
        console.log(data)
        this.salesmanList = data.data.list
        console.log(this.salesmanList)
        this.salesmanList.forEach((salesman) => {
          let item = {
            value: salesman.salesmanId,
            label: salesman.salesmanName
          }
          this.salesmanOptions.push(item)
        })
      })
    },
    selectOneSalesman (salesmanId) {
      console.log(salesmanId)
      this.salesmanList.forEach((temp) => {
        if (temp.salesmanId === salesmanId) {
          this.customerContract.salesmanName = temp.salesmanName
        }
      })
    },
    selectPrepayment (item) {
      console.log(item)
    },
    selectOneVipCard (cardIndex) {
      this.customerContract.vipCard = this.vipCardList[cardIndex]
      this.customerContract.vipCardId = this.vipCardList[cardIndex].vipCardId
      this.customerContract.contractName = this.customerName + '-' + this.vipCardList[cardIndex].vipCardName
      this.customerContract.payMoney = this.vipCardList[cardIndex].price
      this.$forceUpdate()
    },
    selectOneTrainingPlan (planIndex) {
      this.customerContract.trainingPlan = this.trainingPlanList[planIndex]
      this.customerContract.trainingPlanId = this.trainingPlanList[planIndex].trainingPlanId
      this.customerContract.contractName = this.customerName + '-' + this.trainingPlanList[planIndex].trainingPlanName
      this.customerContract.payMoney = this.trainingPlanList[planIndex].price
      if (this.trainingPlanList[planIndex].trainingType !== 'MONTH_TRAINING') {
        this.customerContract.oneClassMoney = (this.trainingPlanList[planIndex].price / this.trainingPlanList[planIndex].totalClass).toFixed(2)
      } else {
        this.customerContract.oneClassMoney = 0
      }
      this.$forceUpdate()
    },
    selectContractType (contractType) {
      this.customerContract.contractType = contractType
      if (contractType === 'VIP_CARD_CONTRACT') {
        // 会员卡
        this.customerContract.contractName = this.customerName + '-会员卡'
      } else if (contractType === 'TRAINING_CONTRACT') {
        // 私教
        this.customerContract.contractName = this.customerName + '-私教'
      } else if (contractType === 'TRANSFER_CARD') {
        // 转卡费
        this.customerContract.contractName = this.customerName + '-转卡费'
      } else {
        // 其他销售 或者团购补价
        this.customerContract.contractName = ''
      }
    },
    showVipCardDialog () {
      this.vipCardDialogFlag = true
    },
    showTrainingPlanDialog () {
      this.trainingPlanDialogFlag = true
    },
    hiddenDialog () {
      this.$emit('update:addCustomerContractDialogFlag', false)
    },
    saveCustomerContract () {
      if (!this.customerContract.payMoney) {
        this.$message.warning('请输入支付金额')
        return
      }
      if (!this.customerContract.payType) {
        this.$message.warning('请选择支付方式')
        return
      }
      if (!this.customerContract.contractName) {
        this.$message.warning('请填写合同名称')
        return
      }
      if (this.customerContract.contractType === 'VIP_CARD_CONTRACT') {
        // 会员卡
        if (!this.customerContract.vipCard) {
          this.$message.warning('请选择会员卡')
          return
        }
        this.customerContract.trainingPlan = null
        this.customerContract.trainingPlanId = null
      } else if (this.customerContract.contractType === 'TRAINING_CONTRACT') {
        // 私教
        if (!this.customerContract.trainingPlan) {
          this.$message.warning('请选择私教')
          return
        }
        this.customerContract.vipCard = null
        this.customerContract.vipCardId = null
      } else if (this.customerContract.contractType === 'TRANSFER_CARD' || this.customerContract.contractType === 'OTHER_SALES' || this.customerContract.contractType === 'GROUP_PURCHASE_PRICE') {
        // 转卡费用 或者 其他销售 或者 团购补差价
        this.customerContract.vipCard = null
        this.customerContract.vipCardId = null
        this.customerContract.trainingPlan = null
        this.customerContract.trainingPlanId = null
      }

      if (this.customerContract.contractStatus === 'PREPAYMENT') {
        // 预收费去掉开始日期
        this.customerContract.activeTime = null
      } else {
        // 非预收费需要有开始日期
        if (!this.customerContract.activeTime) {
          this.$message.warning('请选择开始日期')
          return
        }
      }
      if (this.customerContract.contractType === 'GROUP_PURCHASE_PRICE') {
        // 团购补差价
        if (!this.customerContract.endTime) {
          this.$message.warning('请选择结束日期')
          return
        }
      }

      if (!this.customerContract.payTime) {
        this.$message.warning('请选择付款日期')
        return
      }

      apiSaveCustomerContract(this.customerContract).then(() => {
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
    customerId: Number,
    customerName: String,
    addCustomerContractDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.add-customer-contract-body {
  .add-customer-contract {
    width: 700px;
    height: 820px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -350px;
    margin-top: -410px;
    background-color: #fff;
    border-radius: 20px;
    padding: 14px 0 14px 30px;
    z-index: 2010;
    border: 1px solid #000;
    font-size: 16px;

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
        width: 130px;
        line-height: 36px;
        text-align: center;
        margin-right: 30px;
      }

      > span:nth-child(2) {
        line-height: 36px;
        text-align: left;
        width: 120px;
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
