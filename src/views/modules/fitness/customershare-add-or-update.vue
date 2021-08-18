<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="160px">
      <el-form-item label="顾客头像" prop="customerAvatar">
        <div class="customer-avatar">
          <img :src="dataForm.customerAvatar"
               v-if="dataForm.customerAvatar">
          <img src="~@/assets/img/customer/avatar-male.png"
               v-if="!dataForm.customerAvatar && dataForm.gender===1">
          <img src="~@/assets/img/customer/avatar-female.png"
               v-if="!dataForm.customerAvatar && dataForm.gender===2">
        </div>
      </el-form-item>
      <el-form-item label="顾客姓名" prop="customerName">
        <el-input v-model="dataForm.customerName" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="分享的内容" prop="shareText">
        <textarea cols="30" rows="10" disabled>{{dataForm.shareText}}</textarea>
      </el-form-item>
      <el-form-item label="分享的时间" prop="shareTime">
        <el-input v-model="dataForm.shareTime" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="分享的照片" prop="shareTime">
        <div class="share-images">
          <div class="share-image" v-for="image in dataForm.customerShareImages">
            <img :src="image" alt="">
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {apiCustomerShareDetail} from '../../../api/customerShare'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        customerShareId: 0,
        customerName: '',
        shareText: ''
      },
      dataRule: {
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.customerShareId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.customerShareId) {
          apiCustomerShareDetail(id).then(({data}) => {
            this.dataForm = data.data
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.customer-avatar {
  width: 110px;
  height: 110px;
  >img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border:1px solid #f8ba33;
  }
}
textarea {
  outline: none;
  border: 1px solid #e9e9e9;
  padding: 10px 15px;
  border-radius: 6px;
  resize: none;
}
.share-images {
  width: 600px;
  height: auto;
  .share-image {
    width: 140px;
    height: 180px;
    border-radius: 6px;
    float: left;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
