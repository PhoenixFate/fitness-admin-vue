<template>
  <el-dialog
    :title="!dataForm.dietPlanId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="饮食计划名称" prop="dietPlanName">
        <el-input v-model="dataForm.dietPlanName" placeholder="请输入饮食计划名称"></el-input>
      </el-form-item>
      <el-form-item label="饮食计划介绍" prop="dietPlanDescription">
        <textarea placeholder="请输入饮食计划介绍信息" v-model="dataForm.dietPlanDescription"></textarea>
      </el-form-item>
      <el-form-item label="饮食计划安排" prop="dietPlanItems">
        <div class="diet-plan-arrange">
          <div class="detail-item" v-for="(dietPlanItem,index) in dataForm.dietPlanItems" :key="index">
            <div class="delete-diet-item" @click="deleteDietItem(index)">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>

            <div class="detail-title" v-if="dietPlanItem.mealType">
              <div class="detail-title-left">
                <img src="~@/assets/img/dietPlan/mealType/breakfast.png" alt=""
                     v-if="dietPlanItem.mealType.mealTypeValue==='BREAKFAST'">
                <img src="~@/assets/img/dietPlan/mealType/breakfast-more.png" alt=""
                     v-if="dietPlanItem.mealType.mealTypeValue==='BREAKFAST_MORE'">
                <img src="~@/assets/img/dietPlan/mealType/lunch.png" alt=""
                     v-if="dietPlanItem.mealType.mealTypeValue==='LUNCH'">
                <img src="~@/assets/img/dietPlan/mealType/lunch-more.png" alt=""
                     v-if="dietPlanItem.mealType.mealTypeValue==='LUNCH_MORE'">
                <img src="~@/assets/img/dietPlan/mealType/dinner.png" alt=""
                     v-if="dietPlanItem.mealType.mealTypeValue==='DINNER'">
              </div>
              <div class="detail-title-right">
                <span>{{ dietPlanItem.mealType.mealTypeName }}</span>
              </div>
            </div>
            <h5>用餐时间</h5>
            <div class="meal-time" v-if="dietPlanItem.mealType">
              <div class="meal-time-content">
                <span>{{ dietPlanItem.mealType.startTime }}</span>
                <span>~</span>
                <span>{{ dietPlanItem.mealType.endTime }}</span>
              </div>
            </div>

            <h5>摄入指标</h5>
            <div class="target-line">
              <div class="target-item">
                <span>热量</span>
                <span><input v-model="dietPlanItem.hot"/>kj</span>
              </div>
              <div class="target-item">
                <span>碳水</span>
                <span><input v-model="dietPlanItem.carbon"/>g</span>
              </div>
            </div>
            <div class="target-line">
              <div class="target-item">
                <span>蛋白质</span>
                <span><input v-model="dietPlanItem.protein"/>g</span>
              </div>
              <div class="target-item">
                <span>脂肪</span>
                <span><input v-model="dietPlanItem.fat"/>g</span>
              </div>
            </div>

            <h5>推荐用餐</h5>
            <div class="food">
              <div class="meal-item" v-if="dietPlanItem.healthyMeal">
                <img :src="dietPlanItem.healthyMeal.healthyMealCoverImage" alt="">
                <p>{{ dietPlanItem.healthyMeal.healthyMealName }}</p>
              </div>
              <div class="food-empty" v-if="!dietPlanItem.healthyMeal" @click="showMealListDialog(index)">
                <img src="~@/assets/img/dietPlan/empty-meal.png" alt="">
                <p>请点击选择餐食</p>
                <div class="empty-click">
                  <img src="~@/assets/img/dietPlan/click.png" alt="">
                </div>
              </div>
              <div class="delete-meal" v-if="dietPlanItem.healthyMeal" @click="deleteMeal(index)">
                <img src="~@/assets/img/common/delete-gray.png" alt="">
              </div>
            </div>
          </div>
          <div class="item-add" @click="showAddDietItemDialog">+</div>
        </div>
      </el-form-item>
    </el-form>

    <AddDietPlanItemDialog
      :mealList="mealList"
      :mealTypeList="mealTypeList"
      :dietItemDialogFlag.sync="dietItemDialogFlag"
      @addOneDietItem="addOneDietItem"
      style="z-index: 4000"
      v-if="dietItemDialogFlag">
    </AddDietPlanItemDialog>
    <MealListDialog
      :meal-list-dialog-flag.sync="mealListDialogFlag"
      :current-diet-plan-item="currentDietPlanItem"
      :meal-list="mealList"
      class="animate__animated"
      style="z-index: 3100"
      v-if="mealListDialogFlag"
    ></MealListDialog>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {apiDietPlanDetail, apiDietPlanUpdate, apiDietPlanSave} from '../../../api/dietPlan'
import {apiHealthyMealListWithDetail} from '../../../api/healthyMeal'
import {apiMealTypeList} from '../../../api/mealType'
import AddDietPlanItemDialog from '../../dialog/AddDietPlanItemDialog'
import MealListDialog from '../../dialog/MealListDialog'

export default {
  components: {AddDietPlanItemDialog, MealListDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        dietPlanId: 0,
        dietPlanName: '',
        dietPlanDescription: '',
        dietPlanItems: []
      },
      dataRule: {
        dietPlanName: [
          {required: true, message: '饮食计划名称不能为空', trigger: 'blur'}
        ]
      },
      currentDietPlanItem: {},
      mealListDialogFlag: false,
      dietItemDialogFlag: false,
      mealList: [],
      mealTypeList: []
    }
  },
  methods: {
    init (id) {
      this.dataForm.dietPlanId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.dietPlanId) {
          apiDietPlanDetail(id).then(({data}) => {
            this.dataForm = data.data
            console.log(this.dataForm)
          })
        }
        apiHealthyMealListWithDetail().then(({data}) => {
          this.mealList = data.data
        })
        apiMealTypeList({limit: 100}).then(({data}) => {
          this.mealTypeList = data.data.list
        })
      })
    },
    addOneDietItem (tempDietItem) {
      console.log(tempDietItem)
      console.log(this.dataForm.dietPlanItems)
      // 检查该餐食类型是否已经存在
      let flag = false
      this.dataForm.dietPlanItems.forEach((item) => {
        if (item.mealType.mealTypeId === tempDietItem.mealType.mealTypeId) {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          message: '该阶段用餐已经存在',
          type: 'warning'
        })
        return
      }
      let dietItem = {
        mealType: tempDietItem.mealType,
        mealTypeId: tempDietItem.mealTypeId,
        hot: tempDietItem.hot,
        carbon: tempDietItem.carbon,
        protein: tempDietItem.protein,
        fat: tempDietItem.fat,
        healthyMeal: tempDietItem.healthyMeal,
        healthyMealId: tempDietItem.healthyMealId
      }
      this.dataForm.dietPlanItems.push(dietItem)
    },
    deleteDietItem (index) {
      this.dataForm.dietPlanItems.splice(index, 1)
    },
    deleteMeal (dietItemIndex) {
      this.dataForm.dietPlanItems[dietItemIndex].healthyMeal = null
      this.dataForm.dietPlanItems[dietItemIndex].healthyMealId = null
    },
    showMealListDialog (index) {
      this.currentDietPlanItem = this.dataForm.dietPlanItems[index]
      this.mealListDialogFlag = true
    },
    showAddDietItemDialog () {
      this.dietItemDialogFlag = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.dietPlanId) {
            // 修改
            console.log(this.dataForm)
            apiDietPlanUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiDietPlanSave(this.dataForm).then(() => {
              this.saveFinish()
            })
          }
        }
      })
    },
    saveFinish () {
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.visible = false
          this.$emit('refreshDataList')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
textarea {
  width: 400px;
  height: 160px;
  border: 1px solid #c1c1c1;
  outline: none;
  border-radius: 6px;
  padding: 10px 15px;
}

.diet-plan-arrange {
  height: auto;
  width: 400px;
  padding: .5rem .5rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  input {
    width: 60px;
    outline: none;
  }

  .detail-item {
    height: auto;
    width: 100%;
    margin: 1.5rem auto 0;
    background-color: rgba(#efeab8, 0.3);
    box-shadow: 0 0 .2rem #999;
    border-radius: .6rem;
    position: relative;
    padding: 1rem;

    .delete-diet-item {
      width: 2rem;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 0;
      top: -1px;

      img {
        width: 60%;
        height: 60%;
      }
    }

    .meal-type-image {
      position: absolute;
      left: 0;
      top: 0;
      width: 3rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 60%;
        height: 60%;
      }
    }

    .detail-title {
      position: absolute;
      width: 8rem;
      left: 50%;
      margin-left: -4rem;
      top: -.9rem;
      height: 2.4rem;
      background-color: #f1a92e;
      font-size: .9rem;
      font-weight: bold;
      border-radius: .3rem;
      color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .detail-title-left {
        width: 40%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 1.6rem;
          height: 1.6rem;
        }
      }

      .detail-title-right {
        width: 60%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

    }

    .meal-time {
      height: 2.5rem;
      width: 100%;

      .meal-time-content {
        margin-left: 4%;
        height: 2.5rem;
        width: 66%;
        min-width: 12rem;
        background-color: #fff;
        border-radius: .4rem;
        font-size: .9rem;
        padding-left: 5%;
        line-height: 2.5rem;

        span:nth-child(2) {
          margin: 0 1rem;
        }
      }
    }

    h5 {
      font-size: 1.1rem;
      margin: 1rem 0 .5rem;
    }

    .target-line {
      width: 100%;
      height: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 4%;
      margin-top: .5rem;

      .target-item {
        width: 46%;
        height: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .5rem;
        border-radius: .4rem;
        font-size: .9rem;

        span:nth-child(2) {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        label {
          width: 2.7rem;
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
        right: 4%;
        top: -15%;

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

  .item-add {
    background-color: #ffda9c;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: .1rem solid #e7c305;
    color: #fff;
    font-size: 2rem;
    line-height: 2.5rem;
    text-align: center;
    margin-top: .7rem;
  }
}
</style>
