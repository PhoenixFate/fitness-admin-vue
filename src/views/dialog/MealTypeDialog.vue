<template>
  <div id="meal-type-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="list-content-scroll">
        <div class="meal-type-item"
             v-for="(mealType,index) in mealTypeList"
             :class="index===currentIndex?'meal-type-item-selected':''"
             @click="selectItem(index)"
             :key="index">
          <div class="meal-type-item-cover">
            <img src="~@/assets/img/dietPlan/mealTypeBackground/breakfast.png" alt=""
                 v-if="mealType.mealTypeValue==='BREAKFAST' || mealType.mealTypeValue==='BREAKFAST_MORE'">
            <img src="~@/assets/img/dietPlan/mealTypeBackground/lunch.png" alt=""
                 v-if="mealType.mealTypeValue==='LUNCH' || mealType.mealTypeValue==='LUNCH_MORE'">
            <img src="~@/assets/img/dietPlan/mealTypeBackground/dinner.png" alt=""
                 v-if="mealType.mealTypeValue==='DINNER'">
            <div class="meal-type-content">
              <div class="meal-type-left">
                <img src="~@/assets/img/dietPlan/mealType/breakfast.png" alt=""
                     v-if="mealType.mealTypeValue==='BREAKFAST'">
                <img src="~@/assets/img/dietPlan/mealType/breakfast-more.png" alt=""
                     v-if="mealType.mealTypeValue==='BREAKFAST_MORE'">
                <img src="~@/assets/img/dietPlan/mealType/lunch.png" alt="" v-if="mealType.mealTypeValue==='LUNCH'">
                <img src="~@/assets/img/dietPlan/mealType/lunch-more.png" alt=""
                     v-if="mealType.mealTypeValue==='LUNCH_MORE'">
                <img src="~@/assets/img/dietPlan/mealType/dinner.png" alt="" v-if="mealType.mealTypeValue==='DINNER'">
              </div>
              <div class="meal-type-right">
                <h4>{{ mealType.mealTypeName }}</h4>
                <div>
                  <span>{{ mealType.startTime }}</span>
                  <span>~</span>
                  <span>{{ mealType.endTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  name: 'MealTypeListDialog',
  components: {BackgroundBlack},
  data () {
    return {
      currentIndex: -1
    }
  },
  created () {
    console.log(this.tempDietItem)
    if (this.tempDietItem.mealType) {
      this.mealTypeList.forEach((mealType, index) => {
        if (mealType.mealTypeId === this.tempDietItem.mealType.mealTypeId) {
          this.currentIndex = index
        }
      })
    }
  },
  props: {
    tempDietItem: Object,
    mealTypeList: Array,
    mealTypeListDialogFlag: Boolean
  },
  methods: {
    selectItem (index) {
      this.currentIndex = index
      this.$emit('selectOneMealType', index)
      setTimeout(() => {
        this.currentIndex = -1
        this.$emit('update:mealTypeListDialogFlag', false)
      }, 500)
    },
    hiddenDialog () {
      this.$emit('update:mealTypeListDialogFlag', false)
    }
  }
}
</script>

<style scoped lang="scss">
#meal-type-list-dialog-content {
  .list-content {
    width: 300px;
    height: 400px;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -200px;
    left: 50%;
    margin-left: -150px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: .8rem;
    border: none;

    .list-content-scroll {
      overflow-y: scroll;
      padding: .9rem;
      height: 100%;
      width: 100%;

      .meal-type-item {
        width: 100%;
        height: 5.4rem;
        margin-bottom: .9rem;
        font-size: 1.1rem;
        border-radius: .6rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .meal-type-item-cover {
          height: 100%;
          width: 100%;
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
              width: 40%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding-left: 2px;
              img {
                width: 3.6rem;
                height: 3.6rem;
              }
            }

            .meal-type-right {
              width: 60%;
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
          }
        }
      }

      .meal-type-item:last-child {
        margin-bottom: 0;
      }

      .meal-type-item-selected {
        border: .1rem solid #ffc35a;
        background-color: #fff7e9;
        box-shadow: 0 0 1.5rem #ffc35a;
      }
    }
  }
}
</style>
