<template>
  <el-dialog
    :title="!dataForm.targetId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="目标名称" prop="targetName">
        <el-input v-model="dataForm.targetName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="目标分类" prop="targetType">
        <el-select v-model="dataForm.targetType" clearable placeholder="请选择目标分类">
          <el-option
            v-for="item in targetTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标周期类型"
                    prop="targetPeriodType">
        <el-select v-model="dataForm.targetPeriodType" clearable placeholder="请选择目标周期类型">
          <el-option
            v-for="item in targetPeriodTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="具体的指标" prop="detailNumber">
        <el-input v-model="dataForm.detailNumber" placeholder="请输入具体的指标" type="number"></el-input>
      </el-form-item>
      <el-form-item label="目标描述" prop="targetDescription">
        <textarea v-model="dataForm.targetDescription" placeholder="请填写目标描述信息" class="target-description"></textarea>
      </el-form-item>
      <el-form-item label="目标教练">
        <div class="target-coach" v-for="(coach,coachIndex) in dataForm.coaches">
          <img :src="coach.avatar" alt="" v-if="coach.avatar">
          <img src="~@/assets/img/coach/coach-avatar-male.png" alt="" v-if="!coach.avatar && coach.gender===1">
          <img src="~@/assets/img/coach/coach-avatar-female.png" alt="" v-if="!coach.avatar && coach.gender===2">
          <h6>{{ coach.coachName }}</h6>
          <div class="delete-button" @click="deleteCoach(coachIndex)">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="target-coach-empty" @click="showCoachesDialog">
          +
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <coach-dialog
      :coach-list="coachList"
      :coach-dialog-flag.sync="coachDialogFlag"
      @selectOneCoach="selectOneCoach"
      style="z-index: 4000"
      v-if="coachDialogFlag">
    </coach-dialog>
  </el-dialog>
</template>

<script>
import {apiTargetDetail, apiTargetSave, apiTargetUpdate} from '../../../api/target'
import {apiCoachList} from '../../../api/coach'
import CoachDialog from '../../dialog/CoachDialog'

export default {
  components: {CoachDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        targetId: 0,
        targetName: '',
        targetDescription: '',
        targetType: '',
        detailNumber: '',
        targetPeriodType: '',
        coaches: []
      },
      targetTypeOptions: [{
        value: 'NEW_CUSTOMER',
        label: '新增顾客数量'
      }, {
        value: 'NEW_VIP',
        label: '新增会员数量'
      }, {
        value: 'SALE_MONEY',
        label: '销售金额'
      }],
      targetPeriodTypeOptions: [{
        value: 'DAT_TARGET',
        label: '日计划'
      }, {
        value: 'WEEK_TARGET',
        label: '周计划'
      }, {
        value: 'MONTH_TARGET',
        label: '月计划'
      }],
      dataRule: {
        targetName: [
          {required: true, message: '目标名称不能为空', trigger: 'blur'}
        ],
        targetType: [
          {required: true, message: '目标分类不能为空', trigger: 'blur'}
        ],
        targetPeriodType: [
          {required: true, message: '目标周期类型不能为空', trigger: 'blur'}
        ],
        detailNumber: [
          {required: true, message: '具体的指标不能为空', trigger: 'blur'}
        ]
      },
      coachList: [],
      coachDialogFlag: false
    }
  },
  methods: {
    init (id) {
      this.dataForm.targetId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.targetId) {
          apiTargetDetail(this.dataForm.targetId).then(({data}) => {
            console.log(data)
            this.dataForm = data.data
          })
        }
        apiCoachList({limit: 100}).then(({data}) => {
          this.coachList = data.data.list
        })
      })
    },
    deleteCoach (coachIndex) {
      this.dataForm.coaches.splice(coachIndex, 1)
    },
    showCoachesDialog () {
      this.coachDialogFlag = true
    },
    selectOneCoach (coachIndex) {
      console.log(coachIndex)
      console.log(this.coachList[coachIndex])
      console.log(this.dataForm)
      // 检查选择的coach是否已经在gym的coaches中
      let temp = this.coachList[coachIndex]
      let flag = false
      if (this.dataForm.coaches) {
        this.dataForm.coaches.forEach((coach) => {
          if (coach.coachId === temp.coachId) {
            flag = true
          }
        })
      }
      if (flag) {
        this.$message({
          message: '该目标中已经存在该教练',
          type: 'warning'
        })
      } else {
        this.dataForm.coaches.push(temp)
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.targetId) {
            apiTargetUpdate(this.dataForm).then(() => {
            }).finally(() => {
              this.saveFinish()
            })
          } else {
            apiTargetSave(this.dataForm).then(() => {
            }).finally(() => {
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
.target-description {
  border: 1px solid #bdbcbc;
  width: 400px;
  height: 160px;
  border-radius: 4px;
  line-height: 1.3;
  padding: 10px 15px;
  outline: none;
}

.target-coach {
  width: 100px;
  height: 120px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  > img {
    width: 70px;
    height: 70px;
    margin-top: 8px;
    border-radius: 50%;
  }

  h6 {
    font-size: 14px;
  }
}

.target-coach-empty {
  width: 100px;
  height: 120px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 300;
  color: #999;
  padding-bottom: 4px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
