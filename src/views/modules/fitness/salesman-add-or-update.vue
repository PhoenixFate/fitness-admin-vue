<template>
  <el-dialog
    :title="!dataForm.salesmanId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="姓名" prop="salesmanName">
        <el-input v-model="dataForm.salesmanName" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="dataForm.gender" label="1">男</el-radio>
        <el-radio v-model="dataForm.gender" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="出生年月" prop="birthday">
        <el-date-picker
          v-model="dataForm.birthday"
          type="date"
          placeholder="选择出生年月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {apiSalesmanDetail, apiSalesmanSave, apiSalesmanUpdate} from '../../../api/salesman'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        salesmanId: 0,
        salesmanName: '',
        gender: '',
        birthday: '',
        mobile: ''
      },
      dataRule: {
        salesmanName: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.salesmanId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.salesmanId) {
          apiSalesmanDetail(this.dataForm.salesmanId).then(({data}) => {
            this.dataForm = data.data
            if (this.dataForm.gender) {
              this.dataForm.gender += ''
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.salesmanId) {
            // 修改
            apiSalesmanUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiSalesmanSave(this.dataForm).then(() => {
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
