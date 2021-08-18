<template>
  <el-dialog
    :title="!dataForm.visitorId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="dataForm.nickname" placeholder="昵称" style="width: 220px;margin-left: 20px"></el-input>
      </el-form-item>
      <el-form-item label="咨询时间" prop="visitTime">
        <el-date-picker
          v-model="dataForm.visitTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择咨询时间"
          style="margin-left: 20px"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="咨询项目" prop="consultProject">
        <textarea name="consultProject" id="consultProject" v-model="dataForm.consultProject"
                  placeholder="请输入咨询项目" class="consult-project"></textarea>
      </el-form-item>
      <el-form-item label="跟进情况" prop="followUp">
        <textarea name="followUp" id="followUp" v-model="dataForm.followUp" placeholder="请输入跟进情况"
                  class="follow-up"></textarea>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {apiVisitorDetail, apiVisitorSave, apiVisitorUpdate} from '../../../api/visitor'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        visitorId: 0,
        visitTime: '',
        nickname: '',
        consultProject: '',
        followUp: ''
      },
      dataRule: {
        visitTime: [
          {required: true, message: '咨询时间不能为空', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '昵称不能为空', trigger: 'blur'}
        ],
        consultProject: [
          {required: true, message: '咨询项目不能为空', trigger: 'blur'}
        ],
        followUp: [
          {required: true, message: '跟进情况不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.visitorId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.visitorId) {
          apiVisitorDetail(this.dataForm.visitorId).then(({data}) => {
            console.log(data)
            this.dataForm = data.data
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.visitorId) {
            apiVisitorUpdate(this.dataForm).then(() => {
            }).finally(() => {
              this.saveFinish()
            })
          } else {
            apiVisitorSave(this.dataForm).then(() => {
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
.consult-project, .follow-up {
  border: 1px solid #cdcdcd;
  width: 280px;
  height: 160px;
  border-radius: 4px;
  line-height: 1.3;
  padding: 10px 15px;
  margin-left: 20px;
}

</style>
