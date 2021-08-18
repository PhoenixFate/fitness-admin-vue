<template>
  <div class="training-plan-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="training-plan-dialog">
      <div class="dialog-content">
        <div class="training-plan-item" v-for="(plan,planIndex) in trainingPlanList" @click="selectVipCard(planIndex)">
          {{ plan.trainingPlanName }}
        </div>
        <div class="training-plan-item training-plan-cancel" @click="hiddenDialog">
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
      this.$emit('update:trainingPlanDialogFlag', false)
    },
    selectVipCard (cardIndex) {
      this.$emit('selectOneTrainingPlan', cardIndex)
      this.$emit('update:trainingPlanDialogFlag', false)
    }
  },
  props: {
    trainingPlanList: Array,
    trainingPlanDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.training-plan-dialog-body {
  .training-plan-dialog {
    width: 240px;
    height: 300px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -120px;
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

      .training-plan-item {
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

      .training-plan-item:last-child {
        margin-bottom: 0;
      }

      .training-plan-cancel {
        background-color: #cbcbcb;
      }
    }
  }
}
</style>
