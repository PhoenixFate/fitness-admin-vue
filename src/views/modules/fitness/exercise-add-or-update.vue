<template>
  <el-dialog
    :title="!dataForm.exerciseId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="训练项名称" prop="exerciseName">
        <el-input v-model="dataForm.exerciseName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="动作组" prop="actionSets">
        <div class="action-set">
          <div class="action-set-left">
            <div class="action-set-add" @click="showActionDialog">+</div>
          </div>
          <div class="action-set-right">
            <div class="action-set-empty" v-if="!dataForm.actionSets || dataForm.actionSets.length===0">
              <img src="~@/assets/img/exercise/action-empty.png" alt="">
              <p>点击 "+" 添加动作组中</p>
            </div>
            <div class="action-set-content" v-if="dataForm.actionSets && dataForm.actionSets.length>0">
              <div class="action-set-item"
                   :class="actionSetType[actionSet.actionSetType].activeClass"
                   v-for="(actionSet,actionSetIndex) in dataForm.actionSets">
                <div class="action-set-item-name"
                     :class="actionSetType[actionSet.actionSetType].activeClass">
                  {{ actionSetType[actionSet.actionSetType].name }}
                </div>
                <div class="action-set-item-action">
                  <div v-for="(action,actionIndex) in actionSet.actions">
                    <span>{{ action.actionName }}</span>
                    <span v-if="actionIndex!==actionSet.actions.length-1">+</span>
                  </div>
                </div>
                <div class="delete-button" @click="deleteActionSet(actionSetIndex)">
                  <img src="~@/assets/img/common/delete.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="动作组详情">
        <div class="action-set-detail">
          <div class="standard-item" v-for="(item,index) in  dataForm.actionSets" :key="index">
            <div class="set-type" :class="actionSetType[item.actionSetType].activeClass">
              {{ actionSetType[item.actionSetType].name }}
            </div>
            <div class="action-line" v-for="(action,actionIndex) in item.actions" :key="actionIndex">
              <div class="line1">
                <div class="action-name-special">{{ action.actionName }}</div>
                <div class="action-set-special">
                  <span v-if="!(item.actionSetType!=='SUPER_SET')"></span>
                  <span v-if="item.actionSetType!=='SUPER_SET'">
                  <input v-model="item.setNumber" type="number"/>组
                </span>
                  <span v-if="action.unit==='SET'"><input v-model="action.count" type="number"/>次/组</span>
                  <span v-if="action.unit==='SECOND'"><input v-model="action.time" type="number"/>秒</span>
                </div>
              </div>
              <div class="line2" v-if="item.actionSetType!=='SUPER_SET'">
                <div class="rest">
                  <div class="rest-left">
                    <span>每组间休息时间:</span>
                  </div>
                  <span><input v-model="item.restInternal" type="number"/>秒</span>
                </div>
              </div>
              <div class="line2" v-if="item.actionSetType==='REDUCE_SET'">
                <div class="rest">
                  <div class="rest-left">
                    <span>递减组数:</span>
                  </div>
                  <span><input v-model="item.reduceSetNumber" type="number"/>组</span></div>
              </div>
              <div class="line2" v-if="action.containWeight">
                <div class="rest">
                  <div class="rest-left">
                    <span>重量:</span>
                  </div>
                  <span v-if="action.containWeight"><input v-model="action.weight" type="number"/>KG</span>
                </div>
              </div>
              <div class="divider-line"
                   v-if="actionIndex!==item.actions.length-1 || item.actionSetType==='SUPER_SET'"></div>
            </div>
            <div class="special-line" v-if="item.actionSetType==='SUPER_SET'">
              <div class="line2">
                <div class="rest">
                  <div class="rest-left">
                    <span>组数:</span>
                  </div>
                  <span><input v-model="item.setNumber" type="number"/>组</span>
                </div>
              </div>
              <div class="line2">
                <div class="rest">
                  <div class="rest-left">
                    <span>每组间休息时间:</span>
                  </div>
                  <span><input v-model="item.restInternal" type="number"/>秒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <ActionDialog
      :action-list="actionList"
      :actionDialogFlag.sync="actionDialogFlag"
      :actionSearchValue.sync="actionSearchValue"
      @addActionSet="addActionSet"
      @loadActionData="loadActionData"
      style="z-index: 4000"
      v-if="actionDialogFlag">
    </ActionDialog>
  </el-dialog>
</template>

<script>
import {apiExerciseDetail, apiExerciseUpdate, apiExerciseSave} from '../../../api/exercise'
import {ActionSetType} from '../../../const/actionSet/actionSetType'
import ActionDialog from '../../dialog/ActionDialog'
import {apiActionList2} from '../../../api/action'

export default {
  components: {ActionDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        exerciseId: 0,
        exerciseName: '',
        actionSets: []
      },
      dataRule: {
        exerciseName: [
          {required: true, message: '训练项名称不能为空', trigger: 'blur'}
        ],
        actionSets: [
          {required: true, message: '动作组不能为空', trigger: 'blur'}
        ]
      },
      actionSetType: ActionSetType,
      actionList: [],
      actionDialogFlag: false,
      actionSearchValue: null
    }
  },
  methods: {
    init (id) {
      this.dataForm.exerciseId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.exerciseId) {
          apiExerciseDetail(id).then(({data}) => {
            this.dataForm = data.data
          })
        }
        this.loadActionData()
      })
    },
    showActionDialog () {
      this.actionDialogFlag = true
    },
    loadActionData () {
      apiActionList2({searchValue: this.actionSearchValue}).then(({data}) => {
        this.actionList = data.data
      })
    },
    addActionSet (type) {
      let actionList = []
      this.actionList.forEach((actions) => {
        actions.actions.forEach((action) => {
          if (action.selected) {
            console.log(action)
            let tempAction = {
              actionId: action.actionId,
              actionName: action.actionName,
              containWeight: action.containWeight,
              unit: action.unit,
              restInternal: 60,
              index: action.index
            }
            if (action.unit === 'SECOND') {
              tempAction.time = 60
              tempAction.setNumber = 1
              tempAction.count = 10
            }
            if (action.unit === 'SET') {
              tempAction.setNumber = 3
              tempAction.count = 10
            }
            if (action.containWeight) {
              tempAction.weight = 10
            }
            if (type === 'REDUCE_SET') {
              tempAction.reduceSetNumber = 3
            }
            actionList.push(tempAction)
          }
        })
      })
      let finalActionList = []
      actionList.forEach((temp, actionIndex) => {
        actionList.forEach((action) => {
          if (action.index === (actionIndex + 1)) {
            finalActionList.push(action)
          }
        })
      })
      let actionSet = {
        actionSetType: type,
        actions: finalActionList
      }
      this.dataForm.actionSets.push(actionSet)
      this.actionDialogFlag = false
      this.$forceUpdate()
    },
    deleteActionSet (actionSetIndex) {
      this.dataForm.actionSets.splice(actionSetIndex, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.exerciseId) {
            apiExerciseUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            apiExerciseSave(this.dataForm).then(() => {
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
.action-set {
  width: 100%;
  min-height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  padding: 10px;

  .action-set-left {
    width: 100px;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .action-set-add {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 1px solid #aaa;
      font-size: 26px;
      font-weight: 300;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #aaa;
      padding-bottom: 4px;
    }
  }

  .action-set-right {
    flex: 1;
    height: auto;

    .action-set-empty {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-left: 60px;
      flex-direction: column;

      img {
        width: 180px;
        height: 120px;
      }

      p {
        color: #999;
        padding-left: 40px;
      }
    }

    .action-set-content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;

      .action-set-item {
        width: 80%;
        height: auto;
        margin: 10px 14% 10px 6%;
        border: 1px solid #999;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .action-set-item-name {
          width: 80px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .type-common {
          color: #eca656;
          border: none;
        }

        .type-super {
          color: #f33a3a;
          border: none;
        }

        .type-reduce {
          color: #2dab5b;
          border: none;
        }

        .action-set-item-action {
          flex: 1;
          min-height: 40px;
          padding: 0 10px 0 20px;
          border-radius: 6px;

          div {
            float: left;
            height: 40px;
            line-height: 40px;

            span:nth-child(2) {
              margin: 0 6px;
            }
          }
        }

        .delete-button {
          position: absolute;
          top: 50%;
          right: -60px;
          margin-top: -15px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 60%;
            height: 60%;
          }
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

    }
  }
}

.action-set-detail {

  .standard-item {
    width: 66%;
    min-width: 400px;
    min-height: 2.5rem;
    background-color: rgb(252, 241, 231);
    margin: 0 auto .7rem .8rem;
    line-height: 2.5rem;
    border-radius: .4rem;
    box-shadow: 0 0 .2rem #ddb2b5;
    padding: 0 .4rem 0 2.2rem;
    font-size: .8rem;
    position: relative;
    overflow: hidden;
    input {
      width: 60px;
    }
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
      min-height: 3.6rem;
      margin-bottom: .5rem;
      position: relative;

      .divider-line {
        position: absolute;
        height: 1px;
        width: 90%;
        border-bottom: 1px solid #aaa;
        bottom: -0.2rem;
        left: 5%;
      }

      label {
        width: 2rem;
        font-size: 1rem;
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
          padding-left: 6%;
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
      height: 5rem;
      margin: 1rem 0;
      width: 100%;

      label {
        width: 2rem;
        font-size: 1rem;
        height: 80%;
      }

      .line2 {
        height: 2.5rem;
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

  .standard-empty {
    height: 11rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: .3rem;

    img {
      width: 80%;
      height: 88%;
      border-radius: .8rem;
      margin-top: .8rem;
    }

    p {
      margin: .5rem 0 .8rem 0;
      font-size: .9rem;
      color: #888;
    }
  }
}
</style>
