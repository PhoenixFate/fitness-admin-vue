<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="contractId">
      <el-input v-model="dataForm.contractId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="customerPlanDayId">
      <el-input v-model="dataForm.customerPlanDayId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="操作人员姓名" prop="operationName">
      <el-input v-model="dataForm.operationName" placeholder="操作人员姓名"></el-input>
    </el-form-item>
    <el-form-item label="操作时间" prop="sureClassTime">
      <el-input v-model="dataForm.sureClassTime" placeholder="操作时间"></el-input>
    </el-form-item>
    <el-form-item label="从哪里销课的" prop="client">
      <el-input v-model="dataForm.client" placeholder="从哪里销课的"></el-input>
    </el-form-item>
    <el-form-item label="上课教练id" prop="coachId">
      <el-input v-model="dataForm.coachId" placeholder="上课教练id"></el-input>
    </el-form-item>
    <el-form-item label="" prop="gymId">
      <el-input v-model="dataForm.gymId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="partnerId">
      <el-input v-model="dataForm.partnerId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="deleteFlag">
      <el-input v-model="dataForm.deleteFlag" placeholder=""></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          customerSureClassId: 0,
          customerId: '',
          contractId: '',
          customerPlanDayId: '',
          operationName: '',
          sureClassTime: '',
          client: '',
          coachId: '',
          gymId: '',
          partnerId: '',
          createTime: '',
          updateTime: '',
          deleteFlag: ''
        },
        dataRule: {
          customerId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          contractId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          customerPlanDayId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          operationName: [
            { required: true, message: '操作人员姓名不能为空', trigger: 'blur' }
          ],
          sureClassTime: [
            { required: true, message: '操作时间不能为空', trigger: 'blur' }
          ],
          client: [
            { required: true, message: '从哪里销课的不能为空', trigger: 'blur' }
          ],
          coachId: [
            { required: true, message: '上课教练id不能为空', trigger: 'blur' }
          ],
          gymId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          partnerId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          deleteFlag: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.customerSureClassId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.customerSureClassId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/customersureclasslog/info/${this.dataForm.customerSureClassId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.customerId = data.customerSureClassLog.customerId
                this.dataForm.contractId = data.customerSureClassLog.contractId
                this.dataForm.customerPlanDayId = data.customerSureClassLog.customerPlanDayId
                this.dataForm.operationName = data.customerSureClassLog.operationName
                this.dataForm.sureClassTime = data.customerSureClassLog.sureClassTime
                this.dataForm.client = data.customerSureClassLog.client
                this.dataForm.coachId = data.customerSureClassLog.coachId
                this.dataForm.gymId = data.customerSureClassLog.gymId
                this.dataForm.partnerId = data.customerSureClassLog.partnerId
                this.dataForm.createTime = data.customerSureClassLog.createTime
                this.dataForm.updateTime = data.customerSureClassLog.updateTime
                this.dataForm.deleteFlag = data.customerSureClassLog.deleteFlag
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/customersureclasslog/${!this.dataForm.customerSureClassId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'customerSureClassId': this.dataForm.customerSureClassId || undefined,
                'customerId': this.dataForm.customerId,
                'contractId': this.dataForm.contractId,
                'customerPlanDayId': this.dataForm.customerPlanDayId,
                'operationName': this.dataForm.operationName,
                'sureClassTime': this.dataForm.sureClassTime,
                'client': this.dataForm.client,
                'coachId': this.dataForm.coachId,
                'gymId': this.dataForm.gymId,
                'partnerId': this.dataForm.partnerId,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'deleteFlag': this.dataForm.deleteFlag
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
