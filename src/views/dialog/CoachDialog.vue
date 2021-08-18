<template>
  <div class="coach-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="coach-dialog">
      <div class="dialog-content">
        <div class="coach-item" :class="currentCoachIndex===coachIndex?'coach-item-selected':''"
             v-for="(coach,coachIndex) in coachList" @click="selectCoach(coachIndex)">
          <img :src="coach.avatar" alt="" v-if="coach.avatar">
          <img src="~@/assets/img/coach/coach-avatar-male.png" alt="" v-if="!coach.avatar && coach.gender===1">
          <img src="~@/assets/img/coach/coach-avatar-female.png" alt="" v-if="!coach.avatar && coach.gender===2">
          <h3>{{ coach.coachName }}</h3>
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
    return {
      currentCoachIndex: -1
    }
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:coachDialogFlag', false)
    },
    selectCoach (coachIndex) {
      this.currentCoachIndex = coachIndex
      this.$emit('selectOneCoach', coachIndex)
      setTimeout(() => {
        this.$emit('update:coachDialogFlag', false)
      }, 800)
    }
  },
  props: {
    coachList: Array,
    coachDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.coach-dialog-body {
  .coach-dialog {
    width: 420px;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -300px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    border-radius: 20px;
    padding: 20px 4px 20px 20px;
    z-index: 2010;
    .dialog-content {
      width: 100%;
      height: 100%;
      padding: 10px;
      overflow-y: scroll;

      .coach-item {
        width: 107px;
        height: 136px;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 8px;
        float: left;
        position: relative;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        > img {
          width: 80px;
          height: 80px;
          margin-bottom: 8px;
          border-radius: 50%;
        }

        h3 {
          font-size: 14px;
        }
      }

      .coach-item-selected {
        box-shadow: 0 0 10px #41f641;
      }

      .coach-item:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>
