<template>
  <div class="vip-card-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="vip-card-dialog">
      <div class="dialog-content">
        <div class="vip-card-item" v-for="(vipCard,cardIndex) in vipCardList" @click="selectVipCard(cardIndex)">
          {{ vipCard.vipCardName }}
        </div>
        <div class="vip-card-item vip-card-cancel" @click="hiddenDialog">
          取消
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  components: {BackgroundBlack},
  name: 'VipCardDialog',
  data () {
    return {}
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:vipDialogFlag', false)
    },
    selectVipCard (cardIndex) {
      this.$emit('selectOneVipCard', cardIndex)
      this.$emit('update:vipDialogFlag', false)
    }
  },
  props: {
    vipCardList: Array,
    vipDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.vip-card-dialog-body {
  .vip-card-dialog {
    width: 200px;
    height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -150px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    border-radius: 10px;
    padding: 20px;
    z-index: 2010;

    .dialog-content {
      width: 100%;
      height: 100%;
      overflow-y: scroll;

      .vip-card-item {
        width: 100%;
        height: 60px;
        margin-bottom: 10px;
        background-color: #fff;
        border-radius: 8px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
      }

      .vip-card-item:last-child {
        margin-bottom: 0;
      }

      .vip-card-cancel {
        background-color: #cbcbcb;
      }

    }
  }
}
</style>
