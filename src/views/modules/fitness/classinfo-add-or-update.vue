<template>
  <el-dialog
    :title="!dataForm.classId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="课程名称" prop="className">
        <el-input v-model="dataForm.className" placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item label="课程封面照片" prop="classCoverImage">
        <div class="class-image">
          <div class="class-image-content" v-if="dataForm.classCoverImage">
            <img :src="dataForm.classCoverImage" alt="">
            <div class="delete-button" @click="deleteClassImage">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="class-image-empty" v-if="!dataForm.classCoverImage" @click="toUploadImage">+</div>
        </div>
      </el-form-item>
      <el-form-item label="训练项目" prop="exercises">
        <div class="exercise-item" v-for="(exerciseItem,index) in dataForm.exercises" :key="index">
          <div class="title">
            {{ exerciseItem.exerciseName }}
          </div>
          <div class="delete" @click="deleteExerciseItem(index)">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
          <div class="tabs">
            <div class="standard-item" v-for="(actionSet,index) in  exerciseItem.actionSets" :key="index">
              <div class="set-type" :class="actionSetType[actionSet.actionSetType].activeClass">
                {{ actionSetType[actionSet.actionSetType].name }}
              </div>
              <div class="action-line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
                <div class="line1">
                  <div class="action-name-special">{{ action.actionName }}</div>
                  <div class="action-set-special">
                    <span v-if="!(actionSet.actionSetType!=='SUPER_SET')"></span>
                    <span v-if="actionSet.actionSetType!=='SUPER_SET'">
                      <input v-model="actionSet.setNumber" type="number"/>组
                    </span>
                    <span v-if="action.unit==='SET'"><input v-model="action.count" type="number"/>次/组</span>
                    <span v-if="action.unit==='SECOND'"><input v-model="action.time" type="number"/>秒</span>
                  </div>
                </div>
                <div class="line2" v-if="actionSet.actionSetType!=='SUPER_SET'">
                  <div class="rest">
                    <div class="rest-left">
                      <span>每组间休息时间:</span>
                    </div>
                    <span><input
                      v-model="actionSet.restInternal"/>秒</span></div>
                </div>
                <div class="line2" v-if="actionSet.actionSetType==='REDUCE_SET'">
                  <div class="rest">
                    <div class="rest-left">
                      <span>递减组数:</span>
                    </div>
                    <span><input v-model="actionSet.reduceSetNumber"/>组</span></div>
                </div>
                <div class="line2" v-if="action.containWeight">
                  <div class="rest">
                    <div class="rest-left">
                      <span>重量:</span>
                    </div>
                    <span v-if="action.containWeight"><input v-model="action.weight"/>KG</span>
                  </div>
                </div>
                <div class="divider-line"
                     v-if="actionIndex!==actionSet.actions.length-1 || actionSet.actionSetType==='SUPER_SET'"></div>
              </div>
              <div class="special-line" v-if="actionSet.actionSetType==='SUPER_SET'">
                <div class="line2">
                  <div class="rest">
                    <div class="rest-left">
                      <span>组数:</span>
                    </div>
                    <span><input v-model="actionSet.setNumber" type="number"/>组</span>
                  </div>
                </div>
                <div class="line2">
                  <div class="rest">
                    <div class="rest-left">
                      <span>每组间休息时间:</span>
                    </div>
                    <span><input v-model="actionSet.restInternal" type="number"/>秒</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-exercise"
             :class="(dataForm.exercises &&dataForm.exercises.length>0)?'add-exercise-special':''"
             @click="showExerciseDialog">
          <img src="~@/assets/img/class/exercise-add-background.png" alt="">
          <div class="background-cover">
            <img src="~@/assets/img/class/exercise-add.png" alt="">
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
    <ExerciseDialog
      :exercise-list="exerciseList"
      :exercise-dialog-flag.sync="exerciseDialogFlag"
      @selectOneExercise="selectOneExercise"
      style="z-index: 4000"
      v-if="exerciseDialogFlag">
    </ExerciseDialog>
  </el-dialog>
</template>

<script>
import {apiClassDetail, apiClassUpdate, apiClassSave} from '../../../api/class'
import {apiUploadImage} from '../../../api/upload'
import {apiExerciseListWithDetail} from '../../../api/exercise'
import ExerciseDialog from '../../dialog/ExerciseDialog'
import {ActionSetType} from '../../../const/actionSet/actionSetType'

export default {
  components: {ExerciseDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        classId: 0,
        className: '',
        classCoverImage: '',
        exercises: []
      },
      dataRule: {
        className: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        classCoverImage: [
          {required: false, message: '课程封面照片不能为空', trigger: 'blur'}
        ],
        exercises: [
          {required: true, message: '训练项不能为空', trigger: 'blur'}
        ]
      },
      exerciseList: [],
      exerciseDialogFlag: false,
      actionSetType: ActionSetType

    }
  },
  methods: {
    init (id) {
      this.dataForm.classId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.classId) {
          apiClassDetail(this.dataForm.classId).then(({data}) => {
            this.dataForm = data.data
          })
        }
        apiExerciseListWithDetail().then(({data}) => {
          this.exerciseList = data.data
          console.log(this.exerciseList)
        })
      })
    },
    showExerciseDialog () {
      this.exerciseDialogFlag = true
    },
    deleteExerciseItem (exerciseIndex) {
      this.dataForm.exercises.splice(exerciseIndex, 1)
    },
    selectOneExercise (index) {
      // 检查该训练项是否已经存在在该课程中
      let temp = this.exerciseList[index]
      let flag = false
      this.dataForm.exercises.forEach((exercise) => {
        if (exercise.exerciseId === temp.exerciseId) {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          message: '该训练项已经存在于该课程中',
          type: 'warning'
        })
        return
      }
      this.dataForm.exercises.push(this.exerciseList[index])
      this.$forceUpdate()
    },
    deleteClassImage () {
      this.dataForm.classCoverImage = null
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
      params.append('prefix', 'classInfo') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.classCoverImage = res.data.data
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.classId) {
            apiClassUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            apiClassSave(this.dataForm).then(() => {
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
.class-image {
  width: 200px;
  height: 130px;
  position: relative;

  .class-image-content {
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

  .class-image-empty {
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

.exercise-item {
  height: auto;
  width: 70%;
  margin: 10px 20% 20px 0;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  position: relative;
  border: 1px solid #fdad41;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.8rem .3rem;

  .title {
    position: absolute;
    height: 2rem;
    width: 44%;
    top: -.5rem;
    left: 29%;
    color: #fff;
    text-align: center;
    line-height: 1.6rem;
    background-image: url("../../../assets/img/class/exercise-title.png");
    background-size: 100% 100%;
    padding-right: 5%;
    font-weight: bold;
    font-size: 1rem;
  }

  .delete {
    position: absolute;
    top: -.8rem;
    right: -.5rem;
    width: 2rem;
    height: 2rem;

    img {
      width: 60%;
      height: 60%;
      margin-left: 20%;
      margin-top: 20%;
    }
  }

  .connection {
    position: absolute;
    bottom: -2.5rem;
    left: 10%;
    height: 4rem;
    width: 80%;
    display: flex;
    justify-content: space-between;
    z-index: 1;

    img {
      width: 1.2rem;
      height: 100%;
    }
  }

  .tabs {
    width: 90%;
    height: auto;
    margin-top: 2%;

    input {
      width: 40px;
    }

    .standard-item {
      width: 100%;
      min-height: 2.5rem;
      background-color: rgb(252, 241, 231);
      margin: 0 auto 12px;
      line-height: 2.5rem;
      border-radius: .4rem;
      box-shadow: 0 0 .2rem #ddb2b5;
      padding: 0 .2rem 0 2.1rem;
      font-size: .8rem;
      position: relative;
      overflow: hidden;

      .set-type {
        position: absolute;
        left: 0;
        top: 0;
        width: 2rem;
        height: 3.5rem;
        color: #fff;
        writing-mode: vertical-rl;
        background-color: #eca656;
        font-weight: bold;
        font-size: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
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

      .action-line {
        min-height: 3rem;
        position: relative;

        .divider-line {
          position: absolute;
          height: 1px;
          width: 90%;
          border-bottom: 1px solid #cbcbcb;
          bottom: -.3rem;
          left: 5%;
        }

        label {
          width: 2rem;
          font-size: .9rem;
          height: 80%;
        }

        .line1, .line2 {
          height: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .line1 {
          position: relative;

          .action-name-special {
            width: 54%;
            font-size: 1rem;
            min-height: 2.5rem;
            line-height: 2.5rem;
            position: absolute;
            justify-content: flex-start;
            padding-left: 5%;
            left: 0;
            top: 0;
          }

          .action-set-special {
            width: 46%;
            height: 2.5rem;
            position: absolute;
            right: 0;
            top: 0;
            display: flex;

            span {
              display: flex;
              align-items: center;
              text-align: right;
              justify-content: flex-end;
            }

            span:nth-child(1) {
              width: 40%;
            }

            span:nth-child(2) {
              width: 60%;
            }
          }

        }

        .line2 {
          justify-content: flex-end;

          .rest {
            width: 66%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .rest-left {
              width: 60%;
              font-size: .8rem;
              display: flex;
              justify-content: flex-end;
              align-items: center;
            }

            > span {
              display: flex;
              align-items: center;
              text-align: right;
              justify-content: flex-end;
            }
          }
        }
      }

      .special-line {
        height: 4.4rem;
        margin: .2rem 0;
        width: 100%;

        label {
          width: 2rem;
          font-size: 1rem;
          height: 80%;
        }

        .line2 {
          height: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .rest {
            width: 66%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .rest-left {
              width: 60%;
              font-size: .8rem;
              display: flex;
              justify-content: flex-end;
              align-items: center;
            }

            > span {
              display: flex;
              align-items: center;
              text-align: right;
              justify-content: flex-end;
            }
          }
        }
      }
    }

    .standard-item:last-child {
      margin-bottom: 0;
    }

    .action {
      height: 2rem;
      line-height: 2rem;
      display: flex;
      justify-content: space-between;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      label {
        width: 1.5rem;
        font-size: .9rem;
        height: 60%;
      }

      span:nth-child(1) {
        width: 46%;
        justify-content: flex-start;
      }

      span:nth-child(2) {
        width: 24%;
        text-align: right;
        justify-content: flex-end;
      }

      span:nth-child(3) {
        width: 30%;
        text-align: right;
        padding-right: 1rem;
        justify-content: flex-end;
      }
    }

  }
}

.add-exercise {
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  position: relative;
  margin-top: 10px;

  > img {
    width: 80%;
    height: 80%;
    margin-left: 10%;
    margin-top: 10%;
  }

  .background-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.68);
    border-radius: 50%;
    border: .1rem solid #f5d9b7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 3rem;
      height: 3rem;
      margin: .6rem 0 .4rem .2rem;
    }
  }
}

.add-exercise-special {
  margin-left: 20%;
}
</style>
