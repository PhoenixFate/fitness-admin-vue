<template>
  <el-dialog
    :title="!dataForm.trainingPlanId ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="训练计划名称" prop="trainingPlanName">
        <el-input v-model="dataForm.trainingPlanName" placeholder="请输入训练计划名称"></el-input>
      </el-form-item>
      <el-form-item label="计划封面照片">
        <div class="training-plan-image">
          <div class="training-plan-image-content" v-if="dataForm.trainingPlanCoverImage">
            <img :src="dataForm.trainingPlanCoverImage" alt="">
            <div class="delete-button" @click="deleteImage">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="training-plan-image-empty" v-if="!dataForm.trainingPlanCoverImage" @click="toUploadImage">+</div>
          <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
        </div>
      </el-form-item>
      <el-form-item label="训练目标" prop="goalId">
        <div class="training-plan-goal">
          <div class="goal-item"
               :class="dataForm.goalId===goal.trainingGoalId?'goal-item-selected':''"
               v-for="(goal,goalIndex) in trainingGoalList" @click="selectedGoal(goalIndex)">
            {{ goal.goalName }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="计划价格" prop="price">
        <el-input v-model="dataForm.price" placeholder="请输入训练计划价格" type="number"></el-input>
      </el-form-item>
      <el-form-item label="计划类型" prop="trainingType">
        <el-radio v-model="dataForm.trainingType" label="EXPERIENCE_TRAINING">体验课</el-radio>
        <el-radio v-model="dataForm.trainingType" label="CLASS_TRAINING">总课程数</el-radio>
        <el-radio v-model="dataForm.trainingType" label="MONTH_TRAINING">包月</el-radio>
      </el-form-item>
      <el-form-item label="总课程数量" prop="totalClass">
        <el-input v-model="dataForm.totalClass" placeholder="请输入总课程数" type="number"></el-input>
      </el-form-item>
      <el-form-item label="训练计划描述" prop="trainingPlanDescription">
        <textarea placeholder="请输入训练计划描述信息">{{dataForm.trainingPlanDescription}}</textarea>
      </el-form-item>
      <el-form-item label="训练计划阶段详情" prop="trainingPeriods">
        <div class="training-plan-periods">
          <div class="training-plan-period" v-for="(period,periodIndex) in dataForm.trainingPeriods" :key="periodIndex">
            <div class="period-index">
              <div>{{ chineseIndex[periodIndex] }}</div>
            </div>
            <div class="delete-period" @click="deletePeriod(periodIndex)">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
            <div class="period-item">
              <div class="item-left">阶段名称</div>
              <div class="item-right">
                <input placeholder="请输入阶段名称" v-model="period.periodName"/>
              </div>
            </div>
            <div class="period-item period-item-small">
              <div class="item-left">训练天数</div>
              <div class="item-right">
                <div class="minus minus-empty"></div>
                <span>{{ period.trainingDays }}</span>
                <div class="add add-empty"></div>
              </div>
            </div>
            <div class="period-item period-item-small">
              <div class="item-left">单次周期长度</div>
              <div class="item-right">
                <div class="minus" @click="minusDay(2,periodIndex)">-</div>
                <span>{{ period.oneCircleDays }}</span>
                <div class="add" @click="addDay(2,periodIndex)">+</div>
              </div>
            </div>
            <div class="period-item period-item-small">
              <div class="item-left">周期重复次数</div>
              <div class="item-right">
                <div class="minus" @click="minusDay(3,periodIndex)">-</div>
                <span>{{ period.circleRepeatTimes }}</span>
                <div class="add" @click="addDay(3,periodIndex)">+</div>
              </div>
            </div>
            <div class="period-class-list">
              <div class="period-class-list-title">单次周期课程</div>
              <div class="period-class-item" v-for="(dayItem,dayIndex) in period.trainingPeriodDays" :key="dayIndex">
                <div class="class-index">
                  第{{ dayIndex + 1 }}天
                </div>
                <div class="class-info" v-if="dayItem.isRest===0">
                  {{ dayItem.classInfo.className }}
                </div>
                <div class="class-rest" v-if="dayItem.isRest===1" @click="showClassInfoDialog(periodIndex,dayIndex)">
                  <span>休息</span>
                  <strong>|</strong>
                  <div>+</div>
                </div>
                <div class="class-delete" v-if="dayItem.isRest===0" @click="deleteClass(periodIndex,dayIndex)">
                  <img src="~@/assets/img/common/delete.png" alt="">
                </div>
                <div class="class-delete" v-if="dayItem.isRest===1">
                </div>
              </div>
            </div>
          </div>
          <div class="add-template"
               :class="dataForm.trainingPeriods && dataForm.trainingPeriods.length>0?'add-template-special':''"
          >
            <img src="~@/assets/img/class/exercise-add-background.png" alt="">
            <div class="cover" @click="addPeriod">
              <img src="~@/assets/img/template/add.png" alt="">
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <class-info-dialog
      :class-info-list="classInfoList"
      :classInfoDialogFlag.sync="classInfoDialogFlag"
      @selectOneClassInfo="selectOneClassInfo"
      style="z-index: 4000"
      v-if="classInfoDialogFlag">
    </class-info-dialog>
  </el-dialog>
</template>

<script>
import {apiUploadImage} from '../../../api/upload'
import {apiTrainingPlanDetail, apiTrainingPlanUpdate, apiTrainingPlanSave} from '../../../api/trainingPlan'
import {apiTrainingGoalList} from '../../../api/trainingPlanGoal'
import {ChineseIndex} from '../../../const/common/chineseIndexData'
import ClassInfoDialog from '../../dialog/ClassInfoDialog'
import {apiClassListWithDetail} from '../../../api/class'

export default {
  components: {ClassInfoDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        totalClass: 0,
        trainingPlanId: 0,
        trainingPlanName: '',
        trainingPlanCoverImage: '',
        goalId: '',
        price: '',
        trainingType: '',
        trainingPlanDescription: '',
        trainingPeriods: []
      },
      dataRule: {
        trainingPlanName: [
          {required: true, message: '训练计划名称不能为空', trigger: 'blur'}
        ],
        goalId: [
          {required: true, message: '训练目标不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '训练价格不能为空', trigger: 'blur'}
        ],
        trainingPeriods: [
          {required: true, message: '训练阶段不能为空', trigger: 'blur'}
        ],
        trainingType: [
          {required: true, message: '训练类型不能为空', trigger: 'blur'}
        ]
      },
      trainingGoalList: [],
      chineseIndex: ChineseIndex,
      currentPeriodIndex: -1,
      currentDayIndex: -1,
      classInfoDialogFlag: false,
      classInfoList: []
    }
  },
  created () {
  },
  methods: {
    closeDialog () {
      this.dataForm = {
        trainingPlanId: 0,
        trainingPlanName: '',
        trainingPlanCoverImage: '',
        goalId: '',
        price: '',
        trainingPlanDescription: '',
        trainingPeriods: [],
        totalClass: 0,
        trainingType: ''
      }
    },
    init (id) {
      this.dataForm.trainingPlanId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.trainingPlanId) {
          apiTrainingPlanDetail(id).then(({data}) => {
            this.dataForm = data.data
            console.log(this.dataForm)
          })
        }
        apiTrainingGoalList({limit: 100}).then(({data}) => {
          this.trainingGoalList = data.data.list
        })
        apiClassListWithDetail().then(({data}) => {
          this.classInfoList = data.data
        })
      })
    },
    selectOneClassInfo (index) {
      this.dataForm.trainingPeriods[this.currentPeriodIndex].trainingPeriodDays[this.currentDayIndex].classInfo = this.classInfoList[index]
      this.dataForm.trainingPeriods[this.currentPeriodIndex].trainingPeriodDays[this.currentDayIndex].classId = this.classInfoList[index].classId
      this.dataForm.trainingPeriods[this.currentPeriodIndex].trainingPeriodDays[this.currentDayIndex].isRest = 0
      this.computeTrainingDays()
    },
    selectedGoal (index) {
      this.dataForm.goalId = this.trainingGoalList[index].trainingGoalId
    },
    toUploadImage () {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click()
    },
    // 点击上传图片
    readLocalFile () {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'gym') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.trainingPlanCoverImage = res.data.data
        this.$forceUpdate()
      })
    },
    deletePeriod (index) {
      this.dataForm.trainingPeriods.splice(index, 1)
    },
    deleteImage () {
      this.dataForm.trainingPlanCoverImage = null
    },
    computeTrainingDays () {
      let classCount = 0
      this.dataForm.trainingPeriods[this.currentPeriodIndex].trainingPeriodDays.forEach((day, dayIndex) => {
        if (day.classId) {
          classCount++
        }
      })
      this.dataForm.trainingPeriods[this.currentPeriodIndex].trainingDays = classCount
    },
    deleteClass (periodIndex, dayIndex) {
      this.currentPeriodIndex = periodIndex
      this.currentDayIndex = dayIndex
      this.dataForm.trainingPeriods[periodIndex].trainingPeriodDays[dayIndex].classId = null
      this.dataForm.trainingPeriods[periodIndex].trainingPeriodDays[dayIndex].classInfo = null
      this.dataForm.trainingPeriods[periodIndex].trainingPeriodDays[dayIndex].isRest = 1
      this.computeTrainingDays()
    },
    showClassInfoDialog (periodIndex, dayIndex) {
      this.currentPeriodIndex = periodIndex
      this.currentDayIndex = dayIndex
      this.classInfoDialogFlag = true
    },
    minusDay (type, periodIndex) {
      this.currentPeriodIndex = periodIndex
      if (type === 2) {
        if (this.dataForm.trainingPeriods[periodIndex].oneCircleDays <= 1) {
        } else {
          this.dataForm.trainingPeriods[periodIndex].oneCircleDays -= 1
          this.dataForm.trainingPeriods[periodIndex].trainingPeriodDays.pop()
          this.computeTrainingDays()
        }
      } else if (type === 3) {
        if (this.dataForm.trainingPeriods[periodIndex].circleRepeatTimes <= 1) {
        } else {
          this.dataForm.trainingPeriods[periodIndex].circleRepeatTimes -= 1
        }
      }
    },
    addDay (type, periodIndex) {
      console.log(this.dataForm)
      this.currentPeriodIndex = periodIndex
      if (type === 2) {
        this.dataForm.trainingPeriods[periodIndex].oneCircleDays += 1
        this.dataForm.trainingPeriods[periodIndex].trainingPeriodDays.push({
          isRest: 1
        })
      } else if (type === 3) {
        this.dataForm.trainingPeriods[periodIndex].circleRepeatTimes += 1
      }
    },
    addPeriod () {
      let period = {
        periodIndex: this.dataForm.trainingPeriods.length + 1,
        periodName: '',
        periodDescription: '',
        trainingDays: 0,
        oneCircleDays: 1,
        circleRepeatTimes: 1,
        trainingPeriodDays: [
          {
            dayIndex: 1,
            isRest: 1
          }
        ]
      }
      this.dataForm.trainingPeriods.push(period)
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 校验阶段名称是否为空
          if (this.dataForm.trainingPeriods && this.dataForm.trainingPeriods.length > 0) {
            let flag = false
            this.dataForm.trainingPeriods.forEach((period) => {
              if (!period.periodName) {
                flag = true
              }
            })
            if (flag) {
              this.$message({
                message: '训练计划阶段名称不能为空',
                type: 'warning'
              })
              return
            }
          } else {
            this.$message({
              message: '训练计划阶段不能为空',
              type: 'warning'
            })
            return
          }

          if (this.dataForm.trainingPlanId) {
            // 修改
            apiTrainingPlanUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiTrainingPlanSave(this.dataForm).then(() => {
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
.training-plan-image {
  width: 200px;
  height: 130px;
  position: relative;

  .training-plan-image-content {
    width: 100%;
    height: 100%;
    border-radius: 6px;

    > img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }

    .delete-button {
      position: absolute;
      right: -16px;
      top: -16px;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .training-plan-image-empty {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #999;
    font-size: 30px;
    font-weight: 300;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 8px;
  }
}

.training-plan-goal {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .goal-item {
    width: 80px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-content: center;
    background-color: rgba(0, 0, 0, 0.08);
  }

  .goal-item-selected {
    background-color: #c3eeee;
    color: #38acc3;
  }
}

textarea {
  width: 400px;
  height: 160px;
  border: 1px solid #c1c1c1;
  outline: none;
  border-radius: 6px;
  padding: 10px 15px;
}

.training-plan-periods {
  .training-plan-period {
    width: 440px;
    margin: 0 20px 20px 0;
    min-height: 15rem;
    box-shadow: 0 0 .3rem #999;
    border-radius: .5rem;
    position: relative;
    overflow: hidden;
    padding: 1rem .5rem 0 .5rem;

    input {
      height: 30px;
      width: 140px;
      outline: none;
    }

    .delete-period {
      width: 2.4rem;
      height: 2.4rem;
      position: absolute;
      right: 0;
      top: 0;

      img {
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        right: .3rem;
        top: .3rem;
      }
    }

    .period-index {
      position: absolute;
      top: -1.5rem;
      left: -1.5rem;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      background-color: #60d0e2;

      div {
        position: absolute;
        width: 3.5rem;
        height: 3.5rem;
        right: 0;
        bottom: 0;
        text-align: center;
        line-height: 2.7rem;
        font-size: 1.5rem;
        color: #fff;
      }
    }

    .period-item {
      width: 80%;
      margin: .3rem auto 0;
      height: 2.6rem;
      display: flex;

      .item-left {
        width: 40%;
        font-size: 1.2rem;
        padding-left: 5%;
        line-height: 3rem;
      }

      .item-right {
        width: 60%;
        padding-left: 5%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .period-item-small {
      height: 2.5rem;
      line-height: 2.5rem;

      .item-left {
        font-size: 1rem;
      }

      .item-right {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .minus, .add {
          width: 2rem;
          height: 2rem;
          border: 1px solid #7a7a7a;
          border-radius: .3rem;
          line-height: 1.9rem;
          font-size: 1.2rem;
          text-align: center;
          color: #7a7a7a;
        }

        span {
          font-size: 1.1rem;
          display: block;
          width: 2.5rem;
          text-align: center;
        }

        .minus {
          margin-right: 1.5rem;
        }

        .add {
          margin-left: 1.5rem;
        }

        .minus-empty, .add-empty {
          border: none
        }

        label {
          width: 3rem;
        }
      }
    }

    .period-class-list {
      width: 70%;
      min-height: 10rem;
      box-shadow: 0 0 .2rem #a5a5a5;
      border-radius: .5rem;
      position: relative;
      margin: .9rem auto 1rem;
      overflow: hidden;
      padding-top: 2rem;

      .period-class-list-title {
        background-color: #1b9cc3;
        color: #fff;
        width: 7rem;
        height: 2rem;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 1rem;
        line-height: 1.8rem;
        padding-left: .3rem;
      }

      .period-class-item {
        width: 90%;
        margin: .5rem auto;
        height: 2.8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #999;
        border-radius: .4rem;

        .class-index {
          width: 28%;
          text-align: center;
          font-size: 1rem;
        }

        .class-info {
          width: 62%;
          font-size: .9rem;
          text-align: center;
        }

        .class-rest {
          width: 62%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;

          strong {
            margin: 0 6%;
          }

          div {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            border: 1px solid #999;
            text-align: center;
            line-height: 1.3rem;
            color: #999;
          }
        }

        .class-delete {
          width: 20%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 1rem;
            height: 1rem;
          }
        }
      }
    }
  }

  .add-template {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    border: .1rem solid #94eaf8;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    > img {
      width: 70%;
      height: 70%;
    }

    .cover {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(168, 246, 242, 0.38);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        width: 2rem;
        height: 2rem;
        background-color: rgba(255, 255, 255, 0.72);
      }
    }
  }

  .add-template-special {
    margin-left: 184px;
  }
}

</style>
