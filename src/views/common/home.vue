<template>
  <div class="admin-home">
    <div class="left-first-line">
      <div class="check-in">
        <h6>会员签到</h6>
        <div class="check-in-body" @click="showCheckInDialog">
          <img src="~@/assets/img/home/check-in.png" alt="">
          <strong><span style="margin-right: 1rem">打</span><span>卡</span></strong>
        </div>
      </div>
      <div class="today-count">
        <div class="admin-title">
          <span>今日数据</span>
        </div>
        <div class="today-count-content">
          <div class="today-count-item">
            <h6>新增顾客数</h6>
            <div class="today-count-body">
              <div class="count-item-left">
                <img src="~@/assets/img/home/customer.png" alt="">
              </div>
              <div class="count-item-right">
                <p><strong>{{ this.todayData.customerCount }}</strong><span>人</span></p>
              </div>
            </div>
          </div>
          <div class="today-count-item">
            <h6>新增会员数</h6>
            <div class="today-count-body">
              <div class="count-item-left">
                <img src="~@/assets/img/home/vip.png" alt="">
              </div>
              <div class="count-item-right">
                <p><strong>{{ this.todayData.vipCustomerCount }}</strong><span>人</span></p>
              </div>
            </div>
          </div>
          <div class="today-count-item">
            <h6>销售会员卡</h6>
            <div class="today-count-body">
              <div class="count-item-left">
                <img src="~@/assets/img/home/card.png" alt="">
              </div>
              <div class="count-item-right">
                <p><strong>{{ this.todayData.cardSaleCount }}</strong><span>张</span></p>
              </div>
            </div>
          </div>
          <div class="today-count-item">
            <h6>销售金额</h6>
            <div class="today-count-body">
              <div class="count-item-left">
                <img src="~@/assets/img/home/money.png" alt="">
              </div>
              <div class="count-item-right">
                <p><strong>{{ this.todayData.chargeMoney }}</strong><span>元</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-body">
      <div class="home-body-left">
        <div id="customer-line"></div>
        <div id="vip-line"></div>
        <div id="money-line"></div>
      </div>
      <div class="home-body-right">
        <div class="rank-customer">
          <div class="rank-title">
            <img src="~@/assets/img/home/rank/rank1-title.png" alt="">
            <div>本周添加顾客排行榜</div>
          </div>
          <div class="rank-content">
            <div class="rank-content-item content1">
              <div class="avatar">
                <img src="~@/assets/img/avatar.png" alt="">
                <div class="rank-second">2</div>
                <div class="coach-name">胡教练</div>
                <div class="customer-number"><strong>1</strong><span>人</span></div>
              </div>
            </div>
            <div class="rank-content-item content2">
              <div class="avatar">
                <img src="~@/assets/img/avatar.png" alt="">
                <div class="rank-second">1</div>
                <div class="coach-name">胡教练</div>
                <div class="customer-number"><strong>1</strong><span>人</span></div>
              </div>
            </div>
            <div class="rank-content-item content3">
              <div class="avatar">
                <img src="~@/assets/img/avatar.png" alt="">
                <div class="rank-second">3</div>
                <div class="coach-name">胡教练</div>
                <div class="customer-number"><strong>1</strong><span>人</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="rank-card">
          <div class="rank-honor">
            <img src="~@/assets/img/home/card/rank-card-honor.png" alt="">
          </div>
          <div class="rank-title">本周销卡排行榜</div>
          <div class="rank-content">
            <div class="rank-card-light"></div>
            <div class="rank-item card-item1">
              <div class="card-crown">
                <img src="~@/assets/img/home/card/crown2.png" alt="">
                <div class="card-crown-number">2</div>
              </div>
              <div class="card-avatar">
                <img src="~@/assets/img/avatar.png" alt="">
              </div>
              <div class="coach-name">胡教练</div>
              <div class="card-number"><strong>1</strong><span>张</span></div>
            </div>
            <div class="rank-item card-item2">
              <div class="card-crown">
                <img src="~@/assets/img/home/card/crown1.png" alt="">
                <div class="card-crown-number">1</div>
              </div>
              <div class="card-avatar">
                <img src="~@/assets/img/avatar.png" alt="">
              </div>
              <div class="coach-name">胡教练</div>
              <div class="card-number"><strong>1</strong><span>张</span></div>
            </div>
            <div class="rank-item card-item3">
              <div class="card-crown">
                <img src="~@/assets/img/home/card/crown3.png" alt="">
                <div class="card-crown-number">3</div>
              </div>
              <div class="card-avatar">
                <img src="~@/assets/img/avatar.png" alt="">
              </div>
              <div class="coach-name">胡教练</div>
              <div class="card-number"><strong>1</strong><span>张</span></div>
            </div>
            <div class="rank-content-bottom">
            </div>
          </div>
        </div>
        <div class="rank-sell">
          <img src="~@/assets/img/home/sell/rank-sell-background1.png" alt="">
          <img src="~@/assets/img/home/sell/rank-sell-background2.png" alt="">
          <div class="rank-sell-title">
            本周销售排行榜
          </div>
          <div class="rank-content">
            <div class="rank-content-item content1">
              <div class="avatar">
                <div class="rank-second">
                  <img src="~@/assets/img/home/sell/rank2.png" alt="">
                </div>
                <img src="~@/assets/img/avatar.png" alt="">
                <div class="coach-name">胡教练</div>
                <div class="customer-number"><strong>1000</strong><span>元</span></div>
              </div>
            </div>
            <div class="rank-content-item content2">
              <div class="avatar">
                <div class="rank-second">
                  <img src="~@/assets/img/home/sell/rank1.png" alt="">
                </div>
                <img src="~@/assets/img/avatar.png" alt="">
                <div class="coach-name">胡教练</div>
                <div class="customer-number"><strong>1000</strong><span>元</span></div>
              </div>
            </div>
            <div class="rank-content-item content3">
              <div class="avatar">
                <div class="rank-second">
                  <img src="~@/assets/img/home/sell/rank3.png" alt="">
                </div>
                <img src="~@/assets/img/avatar.png" alt="">
                <div class="coach-name">胡教练</div>
                <div class="customer-number"><strong>1000</strong><span>元</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CheckInDialog
      :checkInDialogFlag.sync="checkInDialogFlag"
      style="z-index: 2000"
      v-if="checkInDialogFlag">
    </CheckInDialog>
  </div>
</template>
<script>
import {apiHomeToday, apiCustomerCount, apiVipCount, apiSaleMoney} from '../../api/home'
import {getStrDate, addDateStr} from '../../utils/dateUtil'
import CheckInDialog from '../dialog/CheckInDialog'

export default {
  components: {CheckInDialog},
  data () {
    return {
      todayData: {
        customerCount: 0,
        vipCustomerCount: 0,
        cardSaleCount: 0,
        chargeMoney: 0
      },
      customerCountX: [],
      customerCountY: [],
      vipCountX: [],
      vipCountY: [],
      moneyX: [],
      moneyY: [],
      checkInDialogFlag: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData: function () {
      apiHomeToday().then((res) => {
        this.todayData = res.data.data
      })
      let endDate = getStrDate(new Date())
      let startDate = addDateStr(new Date(), -6)
      let date = {
        startDate: startDate,
        endDate: endDate
      }
      apiCustomerCount(date).then((res) => {
        let tempX = []
        let tempY = []
        res.data.data.forEach((temp) => {
          tempX.push(temp.detailDate)
          tempY.push(temp.customerCount)
        })
        this.customerCountX = tempX
        this.customerCountY = tempY
        this.initCustomerCountLine()
      })
      apiVipCount(date).then((res) => {
        let tempX = []
        let tempY = []
        res.data.data.forEach((temp) => {
          tempX.push(temp.detailDate)
          tempY.push(temp.customerCount)
        })
        this.vipCountX = tempX
        this.vipCountY = tempY
        this.initVipCountLine()
      })
      apiSaleMoney(date).then((res) => {
        let tempX = []
        let tempY = []
        res.data.data.forEach((temp) => {
          tempX.push(temp.detailDate)
          tempY.push(temp.customerMoney)
        })
        this.moneyX = tempX
        this.moneyY = tempY
        this.initMoneyLine()
      })
    },
    showCheckInDialog () {
      this.checkInDialogFlag = true
    },
    initCustomerCountLine () {
      // 基于准备好的dom，初始化echarts实例
      let customerChart = this.$echarts.init(document.getElementById('customer-line'))
      // 绘制图表
      customerChart.setOption({
        title: {
          text: '本周添加顾客人数'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.customerCountX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.customerCountY,
          type: 'line',
          areaStyle: {}
        }]
      })
      window.addEventListener('resize', () => {
        customerChart.resize()
      })
    },
    initVipCountLine () {
      // 基于准备好的dom，初始化echarts实例
      let vipChart = this.$echarts.init(document.getElementById('vip-line'))
      // 绘制图表
      vipChart.setOption({
        title: {
          text: '本周新增会员人数'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.vipCountX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.vipCountY,
          type: 'line',
          areaStyle: {}
        }]
      })
      window.addEventListener('resize', () => {
        vipChart.resize()
      })
    },
    initMoneyLine () {
      // 基于准备好的dom，初始化echarts实例
      let moneyChart = this.$echarts.init(document.getElementById('money-line'))
      // 绘制图表
      moneyChart.setOption({
        title: {
          text: '本周销售金额'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.moneyX
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.moneyY,
          type: 'line',
          areaStyle: {}
        }]
      })
      window.addEventListener('resize', () => {
        moneyChart.resize()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.admin-home {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1rem;

  .left-first-line {
    height: 18rem;
    width: 100%;
    box-sizing: border-box;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    background-color: #f0f3f4;
    .today-count {
      width: calc(100% - 18rem);
      height: 16rem;
      min-width: 50rem;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      padding: 1.6rem 2rem 2rem 2rem;
      background-color: #fff;
      .admin-title {
        height: 2.5rem;
        font-weight: bold;
        line-height: 2.5rem;
        margin-bottom: .4rem;
        span {
          font-size: 1.6rem;
        }
      }

      .today-count-content {
        width: 100%;
        height: 12rem;
        display: flex;
        justify-content: space-between;

        .today-count-item {
          width: 12rem;
          height: 10rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          h6 {
            font-size: 1.4rem;
            font-weight: normal;
            margin: 1rem 0 1.5rem -1rem;
            text-align: center;
          }

          .today-count-body {
            display: flex;
            align-items: center;
            justify-content: center;

            .count-item-left {
              width: 6.4rem;
              height: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding-left: 3.4rem;

              img {
                width: 2.8rem;
                height: 2.8rem;
              }
            }

            .count-item-right {
              width: 10rem;

              p {
                font-size: 1.8rem;
                text-align: left;
                padding-left: 1.3rem;

                span {
                  margin-left: .4rem;
                  font-size: 1.6rem;
                }
              }
              strong {
                font-size: 1.5rem;
              }
            }
          }
        }

        .today-count-item:last-child {
          h6 {
            margin-left: -1.4rem;
          }
        }
      }
    }

    .check-in {
      width: 16rem;
      height: 16rem;
      background-color: #fff;
      border-radius: 1rem;
      padding: 1.6rem 2rem 2rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      h6 {
        height: 2.5rem;
        font-size: 1.6rem;
        font-weight: bold;
        line-height: 2.5rem;
      }

      .check-in-body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 14rem;
        position: relative;

        img {
          width: 8rem;
          height: 8rem;
          margin-top: .8rem;
        }

        strong {
          position: absolute;
          width: 6rem;
          bottom: 1.45rem;
          text-align: center;
          left: 50%;
          margin-left: -3rem;
          color: #fff;
          font-size: 1.3rem;
          span{
            font-size: 1.3rem;
          }
        }
      }
    }
  }

  .home-body {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .home-body-left {
      width: calc(100% - 30rem);
      min-height: 90rem;
      background-color: #f0f3f4;
      padding: 0 2rem 2rem 2rem;
    }

    .home-body-right {
      width: 30rem;
      min-height: 90rem;
      background-color: #f0f3f4;
      padding: 2rem 2rem 2rem 0;

      .rank-customer {
        width: 28rem;
        height: 28rem;
        border-radius: 1rem;
        background: linear-gradient(to bottom, #f38181 0%, #cd474f 100%);
        position: relative;

        .rank-title {
          position: absolute;
          top: 0;
          left: 0;
          height: 9rem;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          > img {
            width: 70%;
            height: 5rem;
          }

          div {
            color: #fff;
            width: 14rem;
            height: 4rem;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -7rem;
            margin-top: -2.8rem;
            font-size: 1.2rem;
            text-align: center;
            line-height: 4rem;
          }
        }

        .rank-content {
          position: absolute;
          top: 10rem;
          width: 22rem;
          height: 13rem;
          left: 3rem;
          background-image: url('../../assets/img/home/rank/rank1-content.png');
          background-size: 100% 100%;

          .rank-content-item {
            position: absolute;
            width: 6rem;
            height: 8rem;

            .avatar {
              width: 4rem;
              height: 4rem;
              border-radius: 50%;
              border: .2rem solid #fe4850;
              position: absolute;
              left: 50%;
              top: 50%;
              margin-top: -3rem;
              margin-left: -2rem;

              > img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }

              .rank-second {
                width: 1.3rem;
                height: 1.3rem;
                border-radius: 50%;
                background-color: #f84550;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                position: absolute;
                top: -.6rem;
                right: -.6rem;
                font-size: .8rem;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .coach-name {
                width: 6rem;
                height: 2rem;
                background-image: url('../../assets/img/home/rank/rank1-avatar-title.png');
                background-size: 100% 100%;
                position: absolute;
                left: -1.4rem;
                bottom: -2rem;
                text-align: center;
                line-height: 1.8rem;
                color: #fff;
                font-weight: normal;
                font-size: 1rem;
              }

              .customer-number {
                width: 8rem;
                height: 2rem;
                position: absolute;
                bottom: -5rem;
                left: -2rem;
                text-align: center;
                line-height: 2rem;

                strong {
                  font-size: 1.4rem;
                  margin-right: .4rem;
                }
              }
            }

          }

          .content1 {
            left: 1.2rem;
            top: 2.4rem;
          }

          .content2 {
            left: 8rem;
            top: 1rem;

          }

          .content3 {
            right: 1rem;
            top: 2.4rem;
          }
        }
      }

      .rank-card {
        width: 28rem;
        height: 28rem;
        border-radius: 1rem;
        background-image: url("../../assets/img/home/card/rank-card-background.png");
        background-size: 100% 100%;
        margin-top: 2rem;
        position: relative;

        .rank-honor {
          height: 8rem;
          width: 100%;
          position: relative;

          img {
            width: 9rem;
            height: 8rem;
            position: absolute;
            margin-left: -4.5rem;
            left: 50%;
            margin-top: 1rem;
          }

          z-index: 1;
        }

        .rank-title {
          height: 3.6rem;
          width: 100%;
          text-align: center;
          line-height: 5rem;
          font-size: 1.6rem;
          font-weight: bold;
          color: #fff;
          font-family: "SimHei", "STHeiti", serif;
          text-shadow: 0 0 1rem #f3a806;
          z-index: 1;
        }

        .rank-content {
          height: 15rem;
          width: 100%;
          position: relative;

          .rank-card-light {
            position: absolute;
            width: 28rem;
            height: 20rem;
            bottom: 0;
            left: 0;
            background-image: url('../../assets/img/home/card/rank-card-light.png');
            background-size: 100% 100%;
            z-index: 0;
          }

          .rank-item {
            width: 7rem;
            height: 7rem;
            position: absolute;

            .card-avatar {
              position: absolute;
              width: 4.5rem;
              height: 4.5rem;
              left: 1.6rem;
              top: .2rem;
              border-radius: 50%;
              border: 1px solid #ff223b;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .card-crown {
              position: absolute;
              left: .3rem;
              width: 2.4rem;
              height: 2.2rem;
              top: -.3rem;

              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }

              .card-crown-number {
                position: absolute;
                width: 2rem;
                height: 2rem;
                left: 1.2rem;
                top: .7rem;
                font-size: 1rem;
              }
            }

            .coach-name {
              width: 7rem;
              height: 2rem;
              background-image: url('../../assets/img/home/rank/rank1-avatar-title.png');
              background-size: 100% 100%;
              position: absolute;
              left: 0;
              bottom: 1rem;
              text-align: center;
              line-height: 2rem;
              color: #fff;
              font-weight: normal;
              font-size: 1rem;
            }

            .card-number {
              position: absolute;
              width: 8rem;
              height: 3rem;
              left: 0;
              bottom: -1rem;
              text-align: center;
              line-height: 3rem;

              strong {
                margin-right: .3rem;
              }

              span {
                font-size: 1rem;
              }
            }
          }

          .card-item1 {
            left: 4.4rem;
            top: 2rem;
            z-index: 10;

            .card-crown {
              .card-crown-number {
                color: #1c3b6e;
              }
            }
          }

          .card-item2 {
            left: 10.6rem;
            top: .2rem;
            z-index: 10;

            .card-crown {
              .card-crown-number {
                color: #ff2a00;
              }
            }

            .card-number {
              color: #fff;
            }
          }

          .card-item3 {
            right: 4rem;
            top: 2rem;
            z-index: 10;

            .card-crown {
              .card-crown-number {
                color: #814305;
              }
            }
          }

          .rank-content-bottom {
            position: absolute;
            left: 4rem;
            width: 20rem;
            height: 12rem;
            bottom: 0;
            background-image: url("../../assets/img/home/card/rank-card-content.png");
            background-size: 100% 100%;
          }
        }
      }

      .rank-sell {
        width: 28rem;
        height: 28rem;
        margin-top: 2rem;
        border-radius: 1rem;
        background-color: #ff4232;
        overflow: hidden;
        position: relative;

        > img:nth-child(1) {
          width: 100%;
          height: 4rem;
          border: none;
          position: absolute;
          top: 0;
          left: 0;
        }

        > img:nth-child(2) {
          width: 100%;
          height: 20rem;
          border: none;
          position: absolute;
          top: 4rem;
          left: 0;
        }

        .rank-sell-title {
          position: absolute;
          top: 0;
          left: 0;
          height: 5rem;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          letter-spacing: .8rem;
          color: #fff;
          z-index: 10;
        }

        .rank-content {
          position: absolute;
          top: 12rem;
          width: 24rem;
          height: 14rem;
          left: 2rem;
          background-image: url('../../assets/img/home/sell/rank-sell-content-background.png');
          background-size: 100% 100%;

          .rank-content-item {
            position: absolute;
            width: 6rem;
            height: 8rem;

            .avatar {
              width: 4rem;
              height: 4rem;
              border-radius: 50%;
              position: absolute;
              left: 50%;
              top: 50%;
              margin-top: -3rem;
              margin-left: -2rem;

              > img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                z-index: 10;
              }

              .rank-second {
                width: 1.8rem;
                height: 1.8rem;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: -1.8rem;
                margin-left: -.9rem;
                left: 50%;
                z-index: 1;

                img {
                  width: 100%;
                  height: 100%;
                  z-index: 1;
                }
              }

              .coach-name {
                width: 7rem;
                height: 2rem;
                position: absolute;
                left: -2rem;
                bottom: -2.5rem;
                text-align: center;
                line-height: 1.8rem;
                color: #000;
                font-weight: normal;
              }

              .customer-number {
                width: 8rem;
                height: 2rem;
                position: absolute;
                bottom: -4.4rem;
                left: -2rem;
                text-align: center;
                line-height: 2rem;

                strong {
                  font-size: 1.2rem;
                  margin-right: .4rem;
                }
              }
            }

          }

          .content1 {
            left: 1.2rem;
            top: 3rem;

            .avatar {
              border: .2rem solid #bdbdbd;
            }
          }

          .content2 {
            left: 9rem;
            top: 1rem;

            .avatar {
              border: .2rem solid #ffdb4d;

              .coach-name {
                color: #dbac17;
              }
            }
          }

          .content3 {
            right: 1.2rem;
            top: 3rem;

            .avatar {
              border: .2rem solid #be8039;
            }
          }
        }
      }
    }
  }

  #customer-line, #vip-line, #money-line {
    padding: 2rem 0 0 2rem;
    width: 100%;
    height: 24rem;
    background-color: #fff;
    border-radius: 1rem;
    margin-top: 2rem;
  }
}
</style>

