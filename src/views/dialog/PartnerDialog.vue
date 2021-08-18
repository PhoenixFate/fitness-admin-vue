<template>
  <div class="partner-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="partner-dialog">
      <div class="dialog-content">
        <div class="partner-item" :class="currentIndex===partnerIndex?'partner-item-selected':''"
             v-for="(partner,partnerIndex) in partnerList" @click="selectPartner(partnerIndex)">
          <h4>{{ partner.partnerName }}</h4>
          <div class="card-item boss">
            <div class="card-item-left">
              <img src="~@/assets/img/common/card/boss.png" alt="">
            </div>
            <div class="card-item-right">{{ partner.bossName }}</div>
          </div>
          <div class="card-item mobile">
            <div class="card-item-left">
              <img src="~@/assets/img/common/card/mobile.png" alt="">
            </div>
            <div class="card-item-right">{{ partner.bossMobile }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  components: {BackgroundBlack},
  name: 'PartnersDialog',
  data () {
    return {
      currentIndex: -1
    }
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:partnerDialogFlag', false)
    },
    selectPartner (partnerIndex) {
      this.currentIndex = partnerIndex
      this.$emit('selectOnePartner', partnerIndex)
      setTimeout(() => {
        this.$emit('update:partnerDialogFlag', false)
      }, 500)
    }
  },
  props: {
    partnerList: Array,
    partnerDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.partner-dialog-body {
  .partner-dialog {
    width: 360px;
    height: 620px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -310px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    border-radius: 20px;
    padding: 20px;
    z-index: 2010;

    .dialog-content {
      width: 100%;
      height: 100%;
      padding:20px;
      overflow-y: scroll;
      .partner-item {
        width: 100%;
        height: 160px;
        margin-bottom: 30px;
        background-color: #fff;
        border-radius: 8px;
        position: relative;
        background-image: url('../../assets/img/common/card/card-background.png');
        background-size: 100% 100%;

        h4 {
          position: absolute;
          top: 40px;
          left: 30px;
          font-size: 16px;
          color: #3b6474;
        }

        .card-item {
          position: absolute;
          height: 24px;
          width: 140px;
          left: 30px;
          display: flex;

          .card-item-left {
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 16px;
              height: 16px;
            }
          }

          .card-item-right {
            width: 116px;
            padding-left: 10px;
          }
        }

        .boss {
          top: 78px;

          .card-item-right {
            font-size: 15px;
            font-weight: bold;
            color: #567986;
          }
        }

        .mobile {
          top: 98px;

          .card-item-right {
            font-size: 13px;
            color: #567986;
          }
        }

        .location {
          top: 118px;

          .card-item-right {
            font-size: 11px;
          }
        }
      }

      .partner-item-selected {
        box-shadow: 0 0 16px #41f641;
      }
    }
  }
}
</style>
