<template>
  <div class="exercise-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="exercise-dialog">
      <div class="dialog-content">
        <div class="exercise-item" v-for="(exercise,exerciseIndex) in exerciseList"
             @click="selectExercise(exerciseIndex)">
          <div class="exercise-item-left">
            {{ exercise.exerciseName }}
          </div>
          <div class="exercise-item-right">
            <div class="action-set-item"
                 :class="actionSetType[actionSet.actionSetType].activeClass"
                 v-for="actionSet in exercise.actionSets">
              <div class="block" :class="actionSetType[actionSet.actionSetType].activeClass"></div>
              <span v-for="(action,actionIndex) in actionSet.actions">
                <span>{{ action.actionName }}</span>
                <span v-if="actionIndex!==actionSet.actions.length-1" class="add">+</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import {ActionSetType} from '../../const/actionSet/actionSetType'

export default {
  components: {BackgroundBlack},
  name: 'ExerciseDialog',
  data () {
    return {
      actionSetType: ActionSetType,
      currentIndex: -1
    }
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:exerciseDialogFlag', false)
    },
    selectExercise (exerciseIndex) {
      this.currentIndex = exerciseIndex
      this.$emit('selectOneExercise', exerciseIndex)
      setTimeout(() => {
        this.$emit('update:exerciseDialogFlag', false)
      }, 500)
    }
  },
  props: {
    exerciseList: Array,
    exerciseDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.exercise-dialog-body {
  .exercise-dialog {
    width: 480px;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -240px;
    margin-top: -300px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    border-radius: 20px;
    padding: 20px;
    z-index: 2010;

    .dialog-content {
      width: 100%;
      height: 100%;
      padding: 10px;
      overflow-y: scroll;

      .exercise-item {
        width: 100%;
        height: auto;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;

        .exercise-item-left {
          width: 30%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 17px;
        }

        .exercise-item-right {
          width: 70%;
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          flex-direction: column;

          .action-set-item {
            width: 100%;
            min-height: 30px;
            border-radius: 4px;
            padding-left: 12px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            position: relative;
            overflow: hidden;

            .block {
              position: absolute;
              left: 0;
              top: 0;
              width: 4px;
              height: 100%;
              background-color: #0BB2D4;
            }

            .type-common {
              background-color: #eca656;
            }

            .type-super {
              background-color: #f33a3a;
            }

            .type-reduce {
              background-color: #2dab5b;
            }

            .add {
              margin: 0 6px 0 4px;
            }
          }

          .type-common {
            border: 1px solid #eca656;
          }

          .type-super {
            border: 1px solid #f33a3a;
          }

          .type-reduce {
            border: 1px solid #2dab5b
          }

          .action-set-item:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
