<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
    <el-form-item label="订单编号" prop="orderNumber">
      <el-input v-model="dataForm.orderNumber" placeholder="订单编号"></el-input>
    </el-form-item>
    <el-form-item label="" prop="customerId">
      <el-input v-model="dataForm.customerId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="coachId">
      <el-input v-model="dataForm.coachId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="totalPrice">
      <el-input v-model="dataForm.totalPrice" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="OPEN_VIP 开通会员卡  OPEN_CLASS_BY_TOTAL 根据课程单价*总价开通私教课  OPEN_CLASS_BY_TRAINING_PLAN" prop="orderType">
      <el-input v-model="dataForm.orderType" placeholder="OPEN_VIP 开通会员卡  OPEN_CLASS_BY_TOTAL 根据课程单价*总价开通私教课  OPEN_CLASS_BY_TRAINING_PLAN"></el-input>
    </el-form-item>
    <el-form-item label="支付时间" prop="payTime">
      <el-input v-model="dataForm.payTime" placeholder="支付时间"></el-input>
    </el-form-item>
    <el-form-item label="" prop="payMoney">
      <el-input v-model="dataForm.payMoney" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="退款时间" prop="refundTime">
      <el-input v-model="dataForm.refundTime" placeholder="退款时间"></el-input>
    </el-form-item>
    <el-form-item label="退款金额" prop="refundMoney">
      <el-input v-model="dataForm.refundMoney" placeholder="退款金额"></el-input>
    </el-form-item>
    <el-form-item label="" prop="orderStatus">
      <el-input v-model="dataForm.orderStatus" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="健身房id" prop="gymId">
      <el-input v-model="dataForm.gymId" placeholder="健身房id"></el-input>
    </el-form-item>
    <el-form-item label="合作伙伴id" prop="partnerId">
      <el-input v-model="dataForm.partnerId" placeholder="合作伙伴id"></el-input>
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
          orderId: 0,
          orderNumber: '',
          customerId: '',
          coachId: '',
          totalPrice: '',
          orderType: '',
          payTime: '',
          payMoney: '',
          refundTime: '',
          refundMoney: '',
          orderStatus: '',
          gymId: '',
          partnerId: '',
          createTime: '',
          updateTime: '',
          deleteFlag: ''
        },
        dataRule: {
          orderNumber: [
            { required: true, message: '订单编号不能为空', trigger: 'blur' }
          ],
          customerId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          coachId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          totalPrice: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          orderType: [
            { required: true, message: 'OPEN_VIP 开通会员卡  OPEN_CLASS_BY_TOTAL 根据课程单价*总价开通私教课  OPEN_CLASS_BY_TRAINING_PLAN不能为空', trigger: 'blur' }
          ],
          payTime: [
            { required: true, message: '支付时间不能为空', trigger: 'blur' }
          ],
          payMoney: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          refundTime: [
            { required: true, message: '退款时间不能为空', trigger: 'blur' }
          ],
          refundMoney: [
            { required: true, message: '退款金额不能为空', trigger: 'blur' }
          ],
          orderStatus: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          gymId: [
            { required: true, message: '健身房id不能为空', trigger: 'blur' }
          ],
          partnerId: [
            { required: true, message: '合作伙伴id不能为空', trigger: 'blur' }
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
        this.dataForm.orderId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.orderId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/order/info/${this.dataForm.orderId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orderNumber = data.order.orderNumber
                this.dataForm.customerId = data.order.customerId
                this.dataForm.coachId = data.order.coachId
                this.dataForm.totalPrice = data.order.totalPrice
                this.dataForm.orderType = data.order.orderType
                this.dataForm.payTime = data.order.payTime
                this.dataForm.payMoney = data.order.payMoney
                this.dataForm.refundTime = data.order.refundTime
                this.dataForm.refundMoney = data.order.refundMoney
                this.dataForm.orderStatus = data.order.orderStatus
                this.dataForm.gymId = data.order.gymId
                this.dataForm.partnerId = data.order.partnerId
                this.dataForm.createTime = data.order.createTime
                this.dataForm.updateTime = data.order.updateTime
                this.dataForm.deleteFlag = data.order.deleteFlag
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
              url: this.$http.adornUrl(`/generator/order/${!this.dataForm.orderId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'orderId': this.dataForm.orderId || undefined,
                'orderNumber': this.dataForm.orderNumber,
                'customerId': this.dataForm.customerId,
                'coachId': this.dataForm.coachId,
                'totalPrice': this.dataForm.totalPrice,
                'orderType': this.dataForm.orderType,
                'payTime': this.dataForm.payTime,
                'payMoney': this.dataForm.payMoney,
                'refundTime': this.dataForm.refundTime,
                'refundMoney': this.dataForm.refundMoney,
                'orderStatus': this.dataForm.orderStatus,
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
