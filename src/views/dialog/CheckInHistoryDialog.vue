<template>
  <div class="vip-duration-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="vip-duration">
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ customer.name }}</span>
      </div>
      <div class="customer-name">
        <span>打卡记录</span>
        <span></span>
      </div>
      <div class="vip-duration-scroll">
        <div class="vip-duration-content"
             v-if="customerClockInList && customerClockInList.length>0">
          <div class="vip-duration-item" v-for="(clockIn,index) in customerClockInList"
               :key="index">
            <span>{{ clockIn.clockInTime }}</span>
            <span style="margin: 0 20px">~</span>
            <span>{{ clockIn.clockOutTime }}</span>
          </div>
        </div>
        <div class="vip-duration-empty"
             v-if="!customerClockInList || customerClockInList.length===0">
          暂无打卡记录
        </div>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {apiCustomerClockInList} from '../../api/customerClockIn'

export default {
  components: {BackgroundBlack},
  name: 'VipDurationDialog',
  data () {
    return {
      customerClockInList: []
    }
  },
  created () {
    console.log(this.customer)
    this.getData()
  },
  methods: {
    getData () {
      apiCustomerClockInList({customerId: this.customer.customerId, limit: 100}).then(({data}) => {
        console.log(data)
        this.customerClockInList = data.data.list
      })
    },
    hiddenDialog () {
      this.$emit('update:clockInDialogFlag', false)
    }
  },
  props: {
    customer: Object,
    clockInDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.vip-duration-body {
  .vip-duration {
    width: 460px;
    height: 520px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -230px;
    margin-top: -260px;
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
      width: 360px;
      height: 320px;
      margin: 10px 10px 0 50px;

      .vip-duration-content {
        height: 100%;
        width: 100%;
        overflow-y: scroll;

        .vip-duration-item {
          height: 50px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          div:nth-child(1) {
            width: 120px;
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
      width: calc(100% - 40px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
