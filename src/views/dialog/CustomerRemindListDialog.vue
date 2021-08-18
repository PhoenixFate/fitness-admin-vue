<template>
  <div class="minus-times-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="minus-times">
      <h5>顾客回访提醒</h5>
      <div class="minus-times-scroll">
        <div class="minus-times-content">
          <div class="minus-times-item">
            <span>序号</span>
            <span>姓名</span>
            <span>上次回访时间</span>
            <span>上次回访内容</span>
            <span>下次回访时间</span>
          </div>
          <div class="minus-times-item" v-for="(remind,index) in remindList"
               :key="index">
            <span>{{ index + 1 }}</span>
            <span>{{ remind.customerName }}</span>
            <span>{{ remind.visitDate }}</span>
            <span>{{ remind.visitContent }}</span>
            <span>{{ remind.nextVisitDate }}</span>
          </div>
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

export default {
  components: {BackgroundBlack},
  name: 'CustomerRemindListDialog',
  data () {
    return {}
  },
  created () {
    console.log(this.customer)
    this.getData()
  },
  methods: {
    getData () {

    },
    hiddenDialog () {
      this.$emit('update:customerRemindListDialogFlag', false)
    }
  },
  props: {
    customerRemindListDialogFlag: Boolean,
    remindList: Array
  }
}
</script>

<style scoped lang="scss">
.minus-times-body {
  .minus-times {
    width: 600px;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
    background-color: #fff;
    border-radius: 20px;
    padding: 30px 20px 20px 20px;
    border: 1px solid #000;
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
        width: 200px;
        display: block;
        line-height: 36px;
        text-align: left;
      }
    }

    .minus-times-scroll {
      width: 560px;
      height: 350px;
      margin: 10px 10px 0 6px;

      .minus-times-content {
        height: 100%;
        width: 100%;
        overflow-y: scroll;

        .minus-times-item {
          height: 40px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: center;

          span:nth-child(1) {
            width: 40px;
          }

          span:nth-child(2) {
            width: 90px;
          }

          span:nth-child(3) {
            width: 160px;
          }

          span:nth-child(4) {
            width: 220px;
          }

          span:nth-child(5) {
            width: 120px;

            span:nth-child(1) {
              margin-right: 20px;
              color: #3ab3a7;
            }

            span:nth-child(2) {
              color: #e3505a;
            }
          }
        }
      }

      .minus-times-empty {
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
