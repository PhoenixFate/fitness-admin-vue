<template>
  <div id="meal-item-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="meal-item-dialog">
      <div class="dialog-title">用餐规划</div>
      <div class="dialog-body">
        <div class="meal-type">
          <div class="name">
            餐食类型
          </div>
        </div>

        <div class="meal-type-detail">
          <div class="meal-type-detail-empty" v-if="!tempDietItem.mealType" @click="showMealTypeListDialog">
            <span>点击选择餐食类型</span>
            <img src="~@/assets/img/template/click.png" alt="">
          </div>
          <div class="meal-type-item-cover" v-if="tempDietItem.mealType" @click="showMealTypeListDialog">
            <img src="~@/assets/img/dietPlan/mealTypeBackground/breakfast.png" alt=""
                 v-if="tempDietItem.mealType.mealTypeValue==='BREAKFAST' || tempDietItem.mealType.mealTypeValue==='BREAKFAST_MORE'">
            <img src="~@/assets/img/dietPlan/mealTypeBackground/lunch.png" alt=""
                 v-if="tempDietItem.mealType.mealTypeValue==='LUNCH' || tempDietItem.mealType.mealTypeValue==='LUNCH_MORE'">
            <img src="~@/assets/img/dietPlan/mealTypeBackground/dinner.png" alt=""
                 v-if="tempDietItem.mealType.mealTypeValue==='DINNER'">
            <div class="meal-type-content">
              <div class="meal-type-left">
                <img src="~@/assets/img/dietPlan/mealType/breakfast.png" alt=""
                     v-if="tempDietItem.mealType.mealTypeValue==='BREAKFAST'">
                <img src="~@/assets/img/dietPlan/mealType/breakfast-more.png" alt=""
                     v-if="tempDietItem.mealType.mealTypeValue==='BREAKFAST_MORE'">
                <img src="~@/assets/img/dietPlan/mealType/lunch.png" alt=""
                     v-if="tempDietItem.mealType.mealTypeValue==='LUNCH'">
                <img src="~@/assets/img/dietPlan/mealType/lunch-more.png" alt=""
                     v-if="tempDietItem.mealType.mealTypeValue==='LUNCH_MORE'">
                <img src="~@/assets/img/dietPlan/mealType/dinner.png" alt=""
                     v-if="tempDietItem.mealType.mealTypeValue==='DINNER'">
              </div>
              <div class="meal-type-right">
                <h4>{{ tempDietItem.mealType.mealTypeName }}</h4>
                <div>
                  <span>{{ tempDietItem.mealType.startTime }}</span>
                  <span>~</span>
                  <span>{{ tempDietItem.mealType.endTime }}</span>
                </div>
              </div>
              <div class="meal-type-click">
                <img src="~@/assets/img/template/click.png" alt="">
              </div>
            </div>
          </div>
        </div>

        <h5>摄入指标</h5>
        <div class="target-line">
          <div class="target-item">
            <span>热量</span>
            <span><input v-model="tempDietItem.hot"/>kj</span>
          </div>
          <div class="target-item">
            <span>碳水</span>
            <span><input v-model="tempDietItem.carbon"/>g</span>
          </div>
        </div>
        <div class="target-line">
          <div class="target-item">
            <span>蛋白质</span>
            <span><input v-model="tempDietItem.protein"/>g</span>
          </div>
          <div class="target-item">
            <span>脂肪</span>
            <span><input v-model="tempDietItem.fat"/>g</span>
          </div>
        </div>
        <h5>推荐用餐</h5>
        <div class="food">
          <div class="meal-item" v-if="tempDietItem.healthyMeal">
            <img :src="tempDietItem.healthyMeal.healthyMealCoverImage" alt="">
            <p>{{ tempDietItem.healthyMeal.healthyMealName }}</p>
          </div>
          <div class="food-empty" v-if="!tempDietItem.healthyMeal" @click="showMealListDialog()">
            <img src="~@/assets/img/dietPlan/empty-meal.png" alt="">
            <p>请点击选择餐食</p>
            <div class="empty-click">
              <img src="~@/assets/img/dietPlan/click.png" alt="">
            </div>
          </div>
          <div class="delete-meal" v-if="tempDietItem.healthyMeal" @click="deleteMeal()">
            <img src="~@/assets/img/common/delete-gray.png" alt="">
          </div>
        </div>

      </div>
      <div class="dialog-buttons">
        <div class="cancel" @click="cancel">取消</div>
        <div class="confirm" @click="addItem">添加</div>
      </div>
    </div>

    <MealListDialog
      :meal-list-dialog-flag.sync="mealListDialogFlag"
      :current-diet-plan-item="tempDietItem"
      :meal-list="mealList"
      class="animate__animated"
      style="z-index: 3100"
      v-if="mealListDialogFlag"
    ></MealListDialog>

    <MealTypeDialog
      :meal-type-list-dialog-flag.sync="mealTypeListDialogFlag"
      :meal-type-list="mealTypeList"
      :temp-diet-item="tempDietItem"
      @selectOneMealType="selectOneMealType"
      class="animate__animated"
      style="z-index: 3100"
      v-if="mealTypeListDialogFlag"
    ></MealTypeDialog>

  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import MealListDialog from './MealListDialog'
import MealTypeDialog from './MealTypeDialog'

export default {
  name: 'AddDietPlanItemDialog',
  components: {BackgroundBlack, MealListDialog, MealTypeDialog},
  data () {
    return {
      tempDietItem: {
        mealType: null,
        mealTypeId: null,
        hot: null,
        carbon: null,
        protein: null,
        fat: null,
        healthyMeal: null,
        healthyMealId: null
      },
      mealListDialogFlag: false,
      mealTypeListDialogFlag: false
    }
  },
  props: {
    dietItemDialogFlag: Boolean,
    mealTypeList: Array,
    mealList: Array
  },
  methods: {
    selectOneMealType (index) {
      this.tempDietItem.mealType = this.mealTypeList[index]
    },
    cancel () {
      this.$emit('update:dietItemDialogFlag', false)
    },
    showMealTypeListDialog () {
      this.mealTypeListDialogFlag = true
    },
    showMealListDialog () {
      this.mealListDialogFlag = true
    },
    deleteMeal () {
      this.tempDietItem.healthyMeal = null
      this.tempDietItem.healthyMealId = null
      this.$forceUpdate()
    },
    addItem () {
      if (!this.tempDietItem.mealType) {
        this.$message({
          message: '请选择餐食类型',
          type: 'warning'
        })
        return
      }
      if (this.tempDietItem.hot == null || this.tempDietItem.carbon == null || this.tempDietItem.protein === null || this.tempDietItem.fat == null) {
        this.$message({
          message: '请填写摄入指标',
          type: 'warning'
        })
        return
      }
      this.$emit('addOneDietItem', this.tempDietItem)
      this.$emit('update:dietItemDialogFlag', false)
    },
    hiddenDialog () {
      this.$emit('update:dietItemDialogFlag', false)
    }
  }
}
</script>

<style scoped lang="scss">
#meal-item-dialog-content {
  .meal-item-dialog {
    width:  420px;
    height: 510px;
    position: fixed;
    top: 50%;
    margin-top: -255px;
    left: 50%;
    margin-left: -210px;
    z-index: 2010;
    border-radius: 1rem;
    border: none;
    background-color: #faf6c7;
    padding: 1.5rem;

    input {
      width: 60px;
    }

    .dialog-title {
      position: absolute;
      width: 7rem;
      left: 50%;
      margin-left: -3.5rem;
      top: -1.1rem;
      height: 2.5rem;
      background-color: #ffc35a;
      font-size: .9rem;
      font-weight: bold;
      border-radius: .3rem;
      text-align: center;
      line-height: 2.5rem;
      color: #fff;
    }

    .dialog-body {
      margin-top: 2%;
      height: 82%;
      width: 100%;

      .meal-type {
        height: 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .name {
          width: 30%;
          font-size: 1.1rem;
          font-weight: bold;
        }
      }

      .meal-type-detail {
        height: 4rem;
        width: 100%;
        margin-top: .3rem;

        .meal-type-detail-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 3.5%;
          height: 3rem;
          width: 60%;
          background-color: #f3f3f3;
          border-radius: .6rem;
          font-size: 1rem;
          color: #888888;

          span {
            margin-right: 1.4rem;
          }

          img {
            height: 1.2rem;
            width: 1.2rem;
          }
        }

        .meal-type-item-cover {
          margin-left: 3.5%;
          height: 4rem;
          width: 74%;
          border-radius: .6rem;
          position: relative;

          img {
            width: 100%;
            height: 100%;
          }

          .meal-type-content {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-content: center;

            .meal-type-left {
              width: 35%;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 3.6rem;
                height: 3.6rem;
              }
            }

            .meal-type-right {
              width: 53%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;

              h4 {
                font-size: 1.1rem;
                font-weight: 500;
                text-align: left;
                line-height: 1.8rem;
              }

              div {
                font-size: .7rem;
                color: #666666;
                padding-left: .2rem;

                span:nth-child(2) {
                  font-size: .8rem;
                  font-weight: 500;
                  margin: 0 .5rem;
                }
              }
            }

            .meal-type-click {
              width: 14%;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                height: 1.2rem;
                width: 1.2rem;
              }
            }
          }
        }
      }

      h5 {
        font-size: 1.1rem;
        font-weight: bold;
        margin: .7rem 0 .5rem;
      }

      h5:nth-child(2) {
        margin-bottom: .2rem;
        margin-top: .9rem;
      }

      .target-line {
        width: 100%;
        height: 2rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: .5rem;

        .target-item {
          width: 44%;
          height: 100%;
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 .8rem;
          border-radius: .4rem;
          font-size: .8rem;

          span:nth-child(1) {
            font-size: .9rem;
          }

          span:nth-child(2) {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          label {
            width: 2.6rem;
            font-size: .8rem;
          }
        }
      }

      .food {
        height: 9.5rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: relative;

        .delete-meal {
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 14%;
          top: -12%;
          z-index: 4000;

          img {
            width: 50%;
            height: 50%;
          }
        }

        .food-empty {
          > img {
            width: 9rem;
            height: 7rem;
          }

          p {
            text-align: center;
            color: #888;
            margin-top: .1rem;
          }

          .empty-click {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background-color: rgba(#fff, 0.8);
            position: absolute;
            top: 24%;
            left: 50%;
            margin-left: -1.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ffc35a;

            img {
              width: 80%;
              height: 80%;
              margin-top: -18%;
              margin-left: 6%;
            }
          }
        }

        img {
          width: 9rem;
          height: 7rem;
          border-radius: .3rem;
        }

        p {
          margin-top: .1rem;
          margin-bottom: 0;
          text-align: center;
          font-size: .8rem;
        }
      }
    }

    .dialog-buttons {
      position: absolute;
      bottom: 0;
      height: 5rem;
      left: 5%;
      width: 90%;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .cancel, .confirm {
        width: 5.5rem;
        height: 2rem;
        background-color: #fff;
        line-height: 2rem;
        border-radius: .4rem;
        text-align: center;
        font-size: .9rem;
      }

      .cancel {
        border: 1px solid #b8b8b8;
        background-color: #f6f6f6;
        color: #888;
      }

      .confirm {
        border: 1px solid #ffc35a;
        background-color: #fde6bb;
        color: #fca30b;
      }
    }
  }
}
</style>
