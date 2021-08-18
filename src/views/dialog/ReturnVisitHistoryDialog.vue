<template>
  <div class="vip-duration-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="vip-duration">
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ customer.name }}</span>
      </div>
      <div class="customer-name">
        <span>回访记录</span>
        <span></span>
      </div>
      <div class="vip-duration-scroll">
        <div class="vip-duration-content"
             v-if="customerReturnVisitList && customerReturnVisitList.length>0">
          <div class="vip-duration-item">
            <div>操作员姓名</div>
            <div>回访日期</div>
            <div>回访内容</div>
            <div>下次回访日期</div>
          </div>
          <div class="vip-duration-item" v-for="(visit,index) in customerReturnVisitList"
               :key="index">
            <div>{{ visit.operationName }}</div>
            <div>
              {{ visit.visitDate }}
            </div>
            <div>{{ visit.visitContent }}</div>
            <div>{{ visit.nextVisitDate }}</div>
          </div>
        </div>
        <div class="vip-duration-empty"
             v-if="!customerReturnVisitList || customerReturnVisitList.length===0">
          暂无回访记录
        </div>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 80px">关闭</el-button>
        <el-button type="primary" @click="showAddReturnVisitDialog()">添加回访</el-button>
      </div>
    </div>
    <AddReturnVisitDialog
      :customer="customer"
      style="z-index: 80"
      :addReturnVisitDialogFlag.sync="addReturnVisitDialogFlag"
      @updateData="getData"
      v-if="addReturnVisitDialogFlag"
    >
    </AddReturnVisitDialog>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {apiOneCustomerReturnVisit} from '../../api/returnVisit'
import AddReturnVisitDialog from './AddReturnVisitDialog'

export default {
  components: {BackgroundBlack, AddReturnVisitDialog},
  name: 'VipDurationDialog',
  data () {
    return {
      customerReturnVisitList: [],
      addReturnVisitDialogFlag: false
    }
  },
  created () {
    console.log(this.customer)
    this.getData()
  },
  methods: {
    getData () {
      apiOneCustomerReturnVisit(this.customer.customerId).then(({data}) => {
        console.log(data)
        this.customerReturnVisitList = data.data
      })
    },
    showAddReturnVisitDialog () {
      this.addReturnVisitDialogFlag = true
    },
    hiddenDialog () {
      this.$emit('update:returnVisitDialogFlag', false)
      this.$emit('updateData')
    }
  },
  props: {
    customer: Object,
    returnVisitDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.vip-duration-body {
  .vip-duration {
    width: 560px;
    height: 520px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -280px;
    margin-top: -260px;
    background-color: #fff;
    border-radius: 20px;
    padding: 30px 10px 20px 10px;
    z-index: 2010;
    font-size: 14px;

    .customer-name {
      height: 36px;
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
        width: 100px;
        display: block;
        line-height: 36px;
        text-align: left;
      }
    }

    .vip-duration-scroll {
      width: 480px;
      height: 320px;
      margin: 10px 10px 0 40px;

      .vip-duration-content {
        height: 100%;
        width: 100%;
        overflow-y: scroll;

        .vip-duration-item {
          min-height: 60px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          div:nth-child(1) {
            width: 110px;
            text-align: center;
          }

          div:nth-child(2) {
            width: 100px;
            text-align: center;
          }

          div:nth-child(3) {
            width: 200px;
            text-align: center;
          }

          div:nth-child(4) {
            width: 100px;
            text-align: center;
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

    .bottom-button {
      position: absolute;
      bottom: 20px;
      width: calc(100% - 20px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
