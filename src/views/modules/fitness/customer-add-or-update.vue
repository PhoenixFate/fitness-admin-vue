<template>
  <el-dialog
    :title="!dataForm.customerId ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="130px">
      <el-form-item label="头像" prop="avatar">
        <div class="customer-avatar">
          <img :src="dataForm.avatar" alt="" v-if="dataForm.avatar" @click="toUploadImage">
          <img src="~@/assets/img/customer/avatar-male.png"
               v-if="!dataForm.avatar && dataForm.gender==1" @click="toUploadImage">
          <img src="~@/assets/img/customer/avatar-female.png"
               v-if="!dataForm.avatar && dataForm.gender==2" @click="toUploadImage">
          <div class="take-camera" @click="showTakePhoto()">
            拍照
          </div>
        </div>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="请输入电话"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <div class="customer-gender">
          <el-radio v-model="dataForm.gender" label="1">男</el-radio>
          <el-radio v-model="dataForm.gender" label="2">女</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="身份证号" prop="identityCard">
        <el-input v-model="dataForm.identityCard" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="dataForm.birthday"
          type="date"
          placeholder="选择生日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实体卡编号" prop="physicalCardIndex">
        <el-input v-model="dataForm.physicalCardIndex" placeholder="请输入实体卡编号，例如: NO.001 或者 001"></el-input>
      </el-form-item>
      <el-form-item label="实体卡id" prop="physicalCardNumber">
        <el-input v-model="dataForm.physicalCardNumber" placeholder="请输入实体id"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="dataForm.mail" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="mail">
        <el-input v-model="dataForm.address" placeholder="请输入联系地址"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
    <TakeCameraDialog
      :customer="dataForm"
      :takeCameraDialogFlag.sync="takeCameraDialogFlag"
      style="z-index: 2100"
      v-if="takeCameraDialogFlag"
    >
    </TakeCameraDialog>
  </el-dialog>
</template>

<script>
import {apiUploadImage} from '../../../api/upload'
import {apiCustomerById, apiSaveCustomer, apiUpdateCustomerCommon} from '../../../api/customer'
import TakeCameraDialog from '../../dialog/TakeCameraDialog'

export default {
  components: {TakeCameraDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        customerId: 0,
        name: '',
        nickname: '',
        mobile: '',
        gender: '1',
        identityCard: '',
        birthday: '',
        avatar: '',
        city: '',
        physicalCardIndex: '',
        physicalCardNumber: '',
        mail: '',
        address: ''
      },
      dataRule: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '手机号不能为空', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ],
        identityCard: [
          {required: false, message: '身份证不能为空', trigger: 'blur'}
        ]
      },
      takeCameraDialogFlag: false
    }
  },
  methods: {
    showTakePhoto () {
      this.takeCameraDialogFlag = true
    },
    closeDialog () {
      this.dataForm = {
        customerId: 0,
        name: '',
        nickname: '',
        mobile: '',
        gender: '1',
        identityCard: '',
        birthday: '',
        avatar: '',
        city: '',
        physicalCardIndex: '',
        physicalCardNumber: '',
        mail: '',
        address: ''
      }
    },
    init (id) {
      this.dataForm.customerId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.customerId) {
          apiCustomerById(this.dataForm.customerId).then(({data}) => {
            this.dataForm = data.data
            if (this.dataForm) {
              this.dataForm.gender += ''
            }
          })
        }
      })
    },
    toUploadImage () {
      this.$refs.refUploadFile.click()
    },
    // 点击上传图片
    readLocalFile () {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'customer') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        console.log(res)
        this.dataForm.avatar = res.data.data
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.customerId) {
            // 修改
            apiUpdateCustomerCommon(this.dataForm).then((res) => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiSaveCustomer(this.dataForm).then((res) => {
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
.customer-avatar {
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  .take-camera {
    width: 80px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #999;
    margin-left: 60px;
    border-radius: 6px;
  }
}

.customer-gender {
  height: 40px;
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
}
</style>
