<template>
  <div class="check-in-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="check-in-dialog">
      <div class="customer-number">
        <input placeholder="请输入实体卡号" v-model="physicalCardNumber" @keyup.enter="getCustomerInfo">
        <div class="verify" @click="getCustomerInfo">校验</div>
      </div>
      <div class="customer-info">
        <div class="customer-info-content" v-if="customerDto">
          <div class="info-line special-line">
            <span>头像</span>
            <div class="avatar">
              <img :src="customerDto.customer.avatar"
                   v-if="customerDto.customer.avatar">
              <img src="~@/assets/img/customer/avatar-male.png"
                   v-if="!customerDto.customer.avatar && customerDto.customer.gender===1">
              <img src="~@/assets/img/customer/avatar-female.png"
                   v-if="!customerDto.customer.avatar && customerDto.customer.gender===2">
            </div>
            <div class="take-camera" @click="showTakePhoto()">
              拍照
            </div>
          </div>
          <div class="info-line">
            <span>会员编号</span>
            <strong>NO.{{ customerDto.customer.customerNumber }}</strong>
          </div>
          <div class="info-line">
            <span>实体卡编号</span>
            <strong>{{ customerDto.customer.physicalCardIndex }}</strong>
          </div>
          <div class="info-line">
            <span>姓名</span>
            <strong>{{ customerDto.customer.name }}</strong>
          </div>
          <div class="info-line">
            <span>手机</span>
            <strong>{{ customerDto.customer.mobile }}</strong>
          </div>
          <div class="info-line">
            <span>上次打卡时间</span>
            <strong
              v-if="customerDto.customerClockIn">{{ customerDto.customerClockIn.clockInTime |formatEmpty }}</strong>
            <strong v-if="!customerDto.customerClockIn">-</strong>
          </div>
          <div class="info-line">
            <span>上次退卡时间</span>
            <strong
              v-if="customerDto.customerClockIn">{{ customerDto.customerClockIn.clockOutTime |formatEmpty }}</strong>
            <strong v-if="!customerDto.customerClockIn">-</strong>
          </div>
          <div class="info-line">
            <span>续卡信息</span>
            <strong v-if="customerDto.customer && customerDto.customer.customerType==='NEVER_CONSUME'">从未消费</strong>
            <strong v-if="customerDto.customer && customerDto.customer.customerType==='FIRST_CONSUME'">新用户</strong>
            <strong v-if="customerDto.customer && customerDto.customer.customerType==='MORE_CONSUME'">续卡用户</strong>
          </div>
          <div class="info-line">
            <span>消费记录</span>
            <strong></strong>
          </div>
          <div class="vip-duration-scroll">
            <div class="vip-duration-content"
                 v-if="customerDto.customerContractList && customerDto.customerContractList.length>0">
              <div class="vip-duration-item" v-for="(contract,durationIndex) in customerDto.customerContractList"
                   :key="durationIndex">
                <div>{{ contract.contractType|contractTypeFilter }}</div>
                <div v-if="contract.vipCardName">{{ contract.vipCardName }}</div>
                <div v-if="contract.trainingPlanName">{{ contract.trainingPlanName }}</div>
                <div v-if=" (contract.contractType==='VIP_CARD_CONTRACT' && contract.vipCardBigType==='DURATION_CARD')
                    || (contract.contractType==='TRAINING_CONTRACT' && contract.trainingType==='MONTH_TRAINING')">
                  <span>{{ contract.activeTime }}</span>
                  <span>~</span>
                  <span>{{ contract.endTime }}</span>
                </div>
                <div v-if="(contract.contractType==='VIP_CARD_CONTRACT' && contract.vipCardBigType==='COUNT_CARD')
                  || (contract.contractType==='TRAINING_CONTRACT' && contract.trainingType!=='MONTH_TRAINING') ">
                  <span>总共: </span>
                  <span style="margin-right: 4px">{{ contract.totalRights }}次</span>
                  <span>剩余: </span>
                  <span>{{ contract.leftRights }}次</span>
                </div>
                <div
                  v-if="contract.contractType==='TRANSFER_CARD' || contract.contractType==='OTHER_SALES' || contract.contractType==='GROUP_PURCHASE_PRICE'">
                  <span>{{ contract.payMoney }}元</span>
                </div>
              </div>
            </div>
            <div class="vip-duration-empty"
                 v-if="!customerDto.customerContractList || customerDto.customerContractList.length===0">
              暂无会员消费记录
            </div>
          </div>
        </div>
        <div class="customer-info-empty" v-if="!customerDto">
          未查询到该会员信息
        </div>
      </div>
      <div class="bottom-buttons">
        <div class="check-in-button" @click="checkIn">打卡</div>
        <div class="check-out-button" @click="checkOut">退卡</div>
      </div>
    </div>
    <MessageInfoDialog
      style="z-index: 5000"
      :message="message"
      @messageSure="messageSure"
      v-if="messageInfoFlag"
    >
    </MessageInfoDialog>
    <TakeCameraDialog
      :customer="customerDto.customer"
      :takeCameraDialogFlag.sync="takeCameraDialogFlag"
      @sureTakePhoto="sureTakePhoto"
      style="z-index: 2100"
      v-if="takeCameraDialogFlag"
    >
    </TakeCameraDialog>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import {apiCustomerByPhysicalCard, apiUpdateCustomerCommon} from '../../api/customer/index'
import {apiCustomerClockInSave, apiCustomerClockInUpdate} from '../../api/customerClockIn'
import MessageInfoDialog from './MessageInfoDialog'
import TakeCameraDialog from './TakeCameraDialog'

export default {
  components: {BackgroundBlack, MessageInfoDialog, TakeCameraDialog},
  name: 'CheckInDialog',
  data () {
    return {
      physicalCardNumber: '',
      customerDto: null,
      messageInfoFlag: false,
      message: '',
      takeCameraDialogFlag: false
    }
  },
  methods: {
    showTakePhoto () {
      this.takeCameraDialogFlag = true
    },
    sureTakePhoto () {
      // 更新顾客信息
      apiUpdateCustomerCommon(this.customerDto.customer).then(() => {
      })
    },
    hiddenDialog () {
      this.$emit('update:checkInDialogFlag', false)
    },
    getCustomerInfo () {
      apiCustomerByPhysicalCard(this.physicalCardNumber).then((res) => {
        console.log(res)
        if (res.data.data) {
          this.customerDto = res.data.data
        } else {
          this.$message({
            message: '会员信息不存在',
            type: 'warning'
          })
          this.customerDto = null
        }
      })
    },
    checkCustomer () {
      if (!this.customerDto) {
        this.$message({
          message: '请先确认会员信息',
          type: 'warning'
        })
        return false
      }
      return true
    },
    checkIn () {
      if (!this.checkCustomer()) {
        return
      }
      apiCustomerClockInSave(this.customerDto.customer.customerId).then((res) => {
        this.message = '打卡成功！'
        this.messageInfoFlag = true
      })
    },
    checkOut () {
      if (!this.checkCustomer()) {
        return
      }
      apiCustomerClockInUpdate(this.customerDto.customer.customerId).then((res) => {
        this.message = '退卡成功！'
        this.messageInfoFlag = true
      })
    },
    messageSure () {
      this.messageInfoFlag = false
      this.hiddenDialog()
    }
  },
  props: {
    checkInDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.check-in-dialog-body {
  position: relative;

  .check-in-dialog {
    width: 50rem;
    height: 60rem;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -25rem;
    margin-top: -30rem;
    border-radius: 2rem;
    padding: 2rem;
    z-index: 2010;
    background-image: url("../../assets/img/home/check-in-background.png");
    background-size: 100% 100%;
    font-size: 1.3rem;

    .customer-number {
      position: absolute;
      top: 13rem;
      left: 9%;
      width: 80%;
      height: 6rem;
      display: flex;
      justify-content: center;
      align-items: center;

      input {
        margin-right: 6rem;
        outline-style: none;
        border: 1px solid #ffa234;
        border-radius: .3rem;
        height: 3rem;
        padding: 1rem;
        width: 16rem;
        font-size: 2rem;
        color: #ffa234;
        line-height: 3rem;
      }

      input::-webkit-input-placeholder {
        color: #999999;
        font-size: 1.4rem;
      }

      .verify {
        width: 8rem;
        height: 3rem;
        border-radius: .6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ffa234;
        color: #fff;
        font-size: 1.5rem;
      }
    }

    .customer-info {
      position: absolute;
      top: 19rem;
      left: 6%;
      width: 79%;
      height: 31.7rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .4rem 0 0 6rem;
      overflow-y: scroll;

      .customer-info-content {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;

        .info-line {
          height: 2.4rem;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            width: 12rem;
            height: 2.4rem;
            text-align: left;
          }

          strong {
            height: 2.4rem;
            flex: 1;
          }
        }

        .special-line {
          height: 14rem;
          display: flex;
          justify-content: flex-start;
          align-content: center;

          span:nth-child(1) {
            width: 12rem;
            height: 12rem;
            line-height: 12rem;
          }

          .avatar {
            width: 12rem;
            height: 12rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            img {
              width: 11rem;
              height: 11rem;
              border-radius: 50%;
              border: 1px solid #f8ba33;
            }
          }

          .take-camera {
            width: 5rem;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 3rem;
            border: 1px solid #999;
            border-radius: .6rem;
          }
        }

        .vip-duration-scroll {
          width: 35rem;
          min-height: 4rem;
          height: auto;
          border-radius: 1rem;
          font-size: 1.2rem;
          margin-left: -1.6rem;

          .vip-duration-content {
            height: auto;
            width: 100%;

            .vip-duration-item {
              height: 3rem;
              width: 90%;
              margin-left: 7%;
              display: flex;
              justify-content: flex-start;
              align-items: center;

              div:nth-child(1) {
                width: 6rem;
                text-align: center;
              }

              div:nth-child(2) {
                text-align: center;
                width: 10rem;
              }
            }
          }

          .vip-duration-empty {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .customer-info-empty {
        height: 100%;
        width: 100%;
        display: flex;
        position: absolute;
        left: -1rem;
        justify-content: center;
        align-items: center;
        color: #b4b3b3;
        font-size: 1.5rem;
      }
    }

    .bottom-buttons {
      height: 8rem;
      position: absolute;
      bottom: 1rem;
      width: 80%;
      left: 10%;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .check-in-button, .check-out-button {
        width: 13rem;
        height: 4rem;
        border-radius: .6rem;
        font-size: 1.8rem;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .check-in-button {
        background-color: #c6f6cf;
        color: #589e65;
        border: 1px solid #589e65;
      }

      .check-out-button {
        background-color: #e07275;
        color: #a14547;
        border: 1px solid #a14547;
      }
    }
  }
}

</style>
