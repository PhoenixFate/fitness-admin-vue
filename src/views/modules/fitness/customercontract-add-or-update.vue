<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="合同类型：私教还是会员卡" prop="contractType">
      <el-input v-model="dataForm.contractType" placeholder="合同类型：私教还是会员卡"></el-input>
    </el-form-item>
    <el-form-item label="会员卡类型" prop="vipCardBigType">
      <el-input v-model="dataForm.vipCardBigType" placeholder="会员卡类型"></el-input>
    </el-form-item>
    <el-form-item label="私教类型" prop="trainingType">
      <el-input v-model="dataForm.trainingType" placeholder="私教类型"></el-input>
    </el-form-item>
    <el-form-item label="合同名称" prop="contractName">
      <el-input v-model="dataForm.contractName" placeholder="合同名称"></el-input>
    </el-form-item>
    <el-form-item label="合同编号" prop="contractNumber">
      <el-input v-model="dataForm.contractNumber" placeholder="合同编号"></el-input>
    </el-form-item>
    <el-form-item label="原始总价" prop="totalMoney">
      <el-input v-model="dataForm.totalMoney" placeholder="原始总价"></el-input>
    </el-form-item>
    <el-form-item label="支付金额" prop="payMoney">
      <el-input v-model="dataForm.payMoney" placeholder="支付金额"></el-input>
    </el-form-item>
    <el-form-item label="剩余金额" prop="leftMoney">
      <el-input v-model="dataForm.leftMoney" placeholder="剩余金额"></el-input>
    </el-form-item>
    <el-form-item label="合同状态" prop="contractStatus">
      <el-input v-model="dataForm.contractStatus" placeholder="合同状态"></el-input>
    </el-form-item>
    <el-form-item label="总的权益" prop="totalRights">
      <el-input v-model="dataForm.totalRights" placeholder="总的权益"></el-input>
    </el-form-item>
    <el-form-item label="剩余权益" prop="leftRights">
      <el-input v-model="dataForm.leftRights" placeholder="剩余权益"></el-input>
    </el-form-item>
    <el-form-item label="" prop="vipCardId">
      <el-input v-model="dataForm.vipCardId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="trainingPlanId">
      <el-input v-model="dataForm.trainingPlanId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="赠送的天数" prop="freeDays">
      <el-input v-model="dataForm.freeDays" placeholder="赠送的天数"></el-input>
    </el-form-item>
    <el-form-item label="激活时间" prop="activeTime">
      <el-input v-model="dataForm.activeTime" placeholder="激活时间"></el-input>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-input v-model="dataForm.endTime" placeholder="结束时间"></el-input>
    </el-form-item>
    <el-form-item label="销售人姓名" prop="salesmanName">
      <el-input v-model="dataForm.salesmanName" placeholder="销售人姓名"></el-input>
    </el-form-item>
    <el-form-item label="销售人id" prop="salesmanId">
      <el-input v-model="dataForm.salesmanId" placeholder="销售人id"></el-input>
    </el-form-item>
    <el-form-item label="操作时间" prop="operationTime">
      <el-input v-model="dataForm.operationTime" placeholder="操作时间"></el-input>
    </el-form-item>
    <el-form-item label="是否有线下合同" prop="offlineContract">
      <el-input v-model="dataForm.offlineContract" placeholder="是否有线下合同"></el-input>
    </el-form-item>
    <el-form-item label="渠道" prop="channel">
      <el-input v-model="dataForm.channel" placeholder="渠道"></el-input>
    </el-form-item>
    <el-form-item label="" prop="partnerId">
      <el-input v-model="dataForm.partnerId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="gymId">
      <el-input v-model="dataForm.gymId" placeholder=""></el-input>
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
          customerContractId: 0,
          customerId: '',
          contractType: '',
          vipCardBigType: '',
          trainingType: '',
          contractName: '',
          contractNumber: '',
          totalMoney: '',
          payMoney: '',
          leftMoney: '',
          contractStatus: '',
          totalRights: '',
          leftRights: '',
          vipCardId: '',
          trainingPlanId: '',
          freeDays: '',
          activeTime: '',
          endTime: '',
          salesmanName: '',
          salesmanId: '',
          operationTime: '',
          offlineContract: '',
          channel: '',
          partnerId: '',
          gymId: '',
          createTime: '',
          updateTime: '',
          deleteFlag: ''
        },
        dataRule: {
          customerId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          contractType: [
            { required: true, message: '合同类型：私教还是会员卡不能为空', trigger: 'blur' }
          ],
          vipCardBigType: [
            { required: true, message: '会员卡类型不能为空', trigger: 'blur' }
          ],
          trainingType: [
            { required: true, message: '私教类型不能为空', trigger: 'blur' }
          ],
          contractName: [
            { required: true, message: '合同名称不能为空', trigger: 'blur' }
          ],
          contractNumber: [
            { required: true, message: '合同编号不能为空', trigger: 'blur' }
          ],
          totalMoney: [
            { required: true, message: '原始总价不能为空', trigger: 'blur' }
          ],
          payMoney: [
            { required: true, message: '支付金额不能为空', trigger: 'blur' }
          ],
          leftMoney: [
            { required: true, message: '剩余金额不能为空', trigger: 'blur' }
          ],
          contractStatus: [
            { required: true, message: '合同状态不能为空', trigger: 'blur' }
          ],
          totalRights: [
            { required: true, message: '总的权益不能为空', trigger: 'blur' }
          ],
          leftRights: [
            { required: true, message: '剩余权益不能为空', trigger: 'blur' }
          ],
          vipCardId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          trainingPlanId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          freeDays: [
            { required: true, message: '赠送的天数不能为空', trigger: 'blur' }
          ],
          activeTime: [
            { required: true, message: '激活时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ],
          salesmanName: [
            { required: true, message: '销售人姓名不能为空', trigger: 'blur' }
          ],
          salesmanId: [
            { required: true, message: '销售人id不能为空', trigger: 'blur' }
          ],
          operationTime: [
            { required: true, message: '操作时间不能为空', trigger: 'blur' }
          ],
          offlineContract: [
            { required: true, message: '是否有线下合同不能为空', trigger: 'blur' }
          ],
          channel: [
            { required: true, message: '渠道不能为空', trigger: 'blur' }
          ],
          partnerId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          gymId: [
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
        this.dataForm.customerContractId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.customerContractId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/customercontract/info/${this.dataForm.customerContractId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.customerId = data.customerContract.customerId
                this.dataForm.contractType = data.customerContract.contractType
                this.dataForm.vipCardBigType = data.customerContract.vipCardBigType
                this.dataForm.trainingType = data.customerContract.trainingType
                this.dataForm.contractName = data.customerContract.contractName
                this.dataForm.contractNumber = data.customerContract.contractNumber
                this.dataForm.totalMoney = data.customerContract.totalMoney
                this.dataForm.payMoney = data.customerContract.payMoney
                this.dataForm.leftMoney = data.customerContract.leftMoney
                this.dataForm.contractStatus = data.customerContract.contractStatus
                this.dataForm.totalRights = data.customerContract.totalRights
                this.dataForm.leftRights = data.customerContract.leftRights
                this.dataForm.vipCardId = data.customerContract.vipCardId
                this.dataForm.trainingPlanId = data.customerContract.trainingPlanId
                this.dataForm.freeDays = data.customerContract.freeDays
                this.dataForm.activeTime = data.customerContract.activeTime
                this.dataForm.endTime = data.customerContract.endTime
                this.dataForm.salesmanName = data.customerContract.salesmanName
                this.dataForm.salesmanId = data.customerContract.salesmanId
                this.dataForm.operationTime = data.customerContract.operationTime
                this.dataForm.offlineContract = data.customerContract.offlineContract
                this.dataForm.channel = data.customerContract.channel
                this.dataForm.partnerId = data.customerContract.partnerId
                this.dataForm.gymId = data.customerContract.gymId
                this.dataForm.createTime = data.customerContract.createTime
                this.dataForm.updateTime = data.customerContract.updateTime
                this.dataForm.deleteFlag = data.customerContract.deleteFlag
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
              url: this.$http.adornUrl(`/generator/customercontract/${!this.dataForm.customerContractId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'customerContractId': this.dataForm.customerContractId || undefined,
                'customerId': this.dataForm.customerId,
                'contractType': this.dataForm.contractType,
                'vipCardBigType': this.dataForm.vipCardBigType,
                'trainingType': this.dataForm.trainingType,
                'contractName': this.dataForm.contractName,
                'contractNumber': this.dataForm.contractNumber,
                'totalMoney': this.dataForm.totalMoney,
                'payMoney': this.dataForm.payMoney,
                'leftMoney': this.dataForm.leftMoney,
                'contractStatus': this.dataForm.contractStatus,
                'totalRights': this.dataForm.totalRights,
                'leftRights': this.dataForm.leftRights,
                'vipCardId': this.dataForm.vipCardId,
                'trainingPlanId': this.dataForm.trainingPlanId,
                'freeDays': this.dataForm.freeDays,
                'activeTime': this.dataForm.activeTime,
                'endTime': this.dataForm.endTime,
                'salesmanName': this.dataForm.salesmanName,
                'salesmanId': this.dataForm.salesmanId,
                'operationTime': this.dataForm.operationTime,
                'offlineContract': this.dataForm.offlineContract,
                'channel': this.dataForm.channel,
                'partnerId': this.dataForm.partnerId,
                'gymId': this.dataForm.gymId,
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
