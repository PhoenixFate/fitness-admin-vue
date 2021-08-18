<template>
  <div id="meal-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="list-content-scroll">
        <div class="meal-item"
             v-for="(meal,index) in mealList"
             :class="index===currentIndex?'meal-item-selected':''"
             @click="selectItem(index)"
             :key="index">
          <div class="meal-item-left">
            <img :src="meal.healthyMealCoverImage" alt="">
          </div>
          <div class="meal-item-right">
            <h6>{{ meal.healthyMealName }}</h6>
            <div class="meal-item-nutrition">
              <div class="line">
                <div class="line-item">
                  <span>热量</span>
                  <span>{{ meal.hot }}千焦</span>
                </div>
                <div class="line-item">
                  <span>蛋白质</span>
                  <span>{{ meal.protein }}克</span>
                </div>
              </div>
              <div class="line">
                <div class="line-item">
                  <span>脂肪</span>
                  <span>{{ meal.fat }}克</span>
                </div>
                <div class="line-item">
                  <span>碳水化物</span>
                  <span>{{ meal.carbon }}克</span>
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
  name: 'MealListDialog',
  components: {BackgroundBlack},
  data () {
    return {
      currentIndex: -1
    }
  },
  created () {

  },
  props: {
    mealList: Array,
    mealListDialogFlag: Boolean,
    currentDietPlanItem: Object
  },
  mounted () {
    this.currentIndex = -1
  },
  methods: {
    selectItem (index) {
      this.currentIndex = index
      this.currentDietPlanItem.healthyMeal = this.mealList[index]
      this.$parent.$forceUpdate()
      setTimeout(() => {
        this.currentIndex = -1
        this.$emit('update:mealListDialogFlag', false)
      }, 500)
    },
    hiddenDialog () {
      this.$emit('update:mealListDialogFlag', false)
    }
  }
}
</script>

<style scoped lang="scss">
#meal-list-dialog-content {
  .list-content {
    width: 360px;
    height: 500px;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -250px;
    left: 50%;
    margin-left: -180px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 50px #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: .9rem;
    border: none;

    .list-content-scroll {
      overflow-y: scroll;
      padding: .9rem;
      height: 100%;
      width: 100%;

      .meal-item {
        width: 100%;
        height: 6.4rem;
        margin-bottom: .9rem;
        background-color: #fff;
        font-size: 1.1rem;
        box-shadow: 0 0 .2rem #b3b3b3;
        position: relative;
        border-radius: .4rem;
        display: flex;

        .meal-item-left {
          width: 36%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;

          img {
            width: 100%;
            height: 100%;
            border-top-left-radius: .4rem;
            border-bottom-left-radius: .4rem;
          }
        }

        .meal-item-right {
          width: 58%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding-left: 18px;

          h6 {
            font-size: .8rem;
            font-weight: 500;
            text-align: left;
            line-height: 1.6rem;
            margin-top: .2rem;
          }

          .meal-item-nutrition {
            font-size: .7rem;
            height: 3.2rem;
            width: 96%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .line {
              height: 1.2rem;
              display: flex;
              justify-content: space-between;

              .line-item {
                width: 45%;
                line-height: 1.2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;

                span:nth-child(1) {
                  font-size: .6rem;
                }

                span:nth-child(2) {
                  font-size: .5rem;
                }
              }
            }
          }
        }
      }

      .meal-item:last-child {
        margin-bottom: 0;
      }

      .meal-item-selected {
        background-color: #fff7e9;
        box-shadow: 0 0 .4rem #fab338;
      }
    }
  }
}
</style>
