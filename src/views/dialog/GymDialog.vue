<template>
  <div class="gym-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="gym-dialog">
      <div class="dialog-content">
        <div class="gym-item" v-for="(gym,gymIndex) in gymList" @click="selectGym(gymIndex)">
          <img src="~@/assets/img/partner/gym-default.png" alt="" v-if="!gym.gymImageUrl">
          <img :src="gym.gymImageUrl" alt="" v-if="gym.gymImageUrl">
          <h3>{{ gym.gymName }}</h3>
          <h6>{{ gym.city }}</h6>
          <p>{{ gym.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  components: {BackgroundBlack},
  name: 'GymsDialog',
  data () {
    return {}
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:gymDialogFlag', false)
    },
    selectGym (gymIndex) {
      this.$emit('selectOneGym', gymIndex)
      this.$emit('update:gymDialogFlag', false)
    }
  },
  props: {
    gymList: Array,
    gymDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.gym-dialog-body {
  .gym-dialog {
    width: 400px;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -300px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    border-radius: 20px;
    padding: 20px;
    z-index: 2010;

    .dialog-content {
      width: 100%;
      height: 100%;
      overflow-y: scroll;

      .gym-item {
        width: 100%;
        height: 120px;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 8px;
        position: relative;

        > img {
          width: 140px;
          height: 100px;
          position: absolute;
          left: 10px;
          top: 10px;
          border-radius: 6px;
        }

        h3 {
          position: absolute;
          left: 170px;
          top: 12px;
          font-size: 20px;
          color: #000;
        }

        h6 {
          position: absolute;
          left: 170px;
          top: 56px;
          font-size: 14px;

        }

        p {
          position: absolute;
          left: 170px;
          top: 80px;
          font-size: 12px;
          color: #999;
          line-height: 1.1;
        }
      }
    }
  }
}
</style>
