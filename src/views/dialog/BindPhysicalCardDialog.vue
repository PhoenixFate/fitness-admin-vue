<template>
  <div class="bind-physical-card-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="bind-physical-card">
      <h5>绑定实体卡</h5>
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ customer.name }}</span>
      </div>
      <div class="customer-avatar">
        <span>头像</span>
        <img :src="customer.avatar" alt="" v-if="customer.avatar" @click="toUploadImage">
        <img src="~@/assets/img/customer/avatar-male.png"
             v-if="!customer.avatar && customer.gender===1" @click="toUploadImage">
        <img src="~@/assets/img/customer/avatar-female.png"
             v-if="!customer.avatar && customer.gender===2" @click="toUploadImage">
      </div>
      <div class="customer-card">
        <span>实体卡号</span>
        <div>
          <el-input v-model="customer.physicalCardNumber" placeholder="请输入实体卡号" style="padding-left: 28px"></el-input>
        </div>
      </div>
      <div class="bottom-button">
        <el-button type="primary" @click="saveCustomer()">确定</el-button>
      </div>
    </div>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {apiUploadImage} from '../../api/upload'

export default {
  components: {BackgroundBlack},
  name: 'PartnersDialog',
  data () {
    return {
      currentIndex: -1
    }
  },
  methods: {
    toUploadImage () {
      this.$refs.refUploadFile.click()
    },
    // 点击上传图片
    readLocalFile () {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'food') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        console.log(res)
        this.customer.avatar = res.data.data
      })
    },
    hiddenDialog () {
      this.$emit('update:bindPhysicalCardDialogFlag', false)
    },
    saveCustomer () {
      this.$emit('saveCustomerCommon')
    }
  },
  props: {
    customer: Object,
    bindPhysicalCardDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.bind-physical-card-body {
  .bind-physical-card {
    width: 360px;
    height: 420px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -180px;
    margin-top: -210px;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px;
    z-index: 2010;

    h5 {
      text-align: center;
      line-height: 40px;
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .customer-name, .customer-card, .customer-avatar {
      height: 36px;
      display: flex;

      span:nth-child(1) {
        display: block;
        height: 100%;
        width: 80px;
        line-height: 36px;
        text-align: center;
      }
    }

    .customer-name {
      span:nth-child(2) {
        display: block;
        text-align: left;
        line-height: 36px;
        margin-left: 30px;
      }
    }

    .customer-avatar {
      height: 100px;
      display: flex;
      margin: 20px 0;

      span:nth-child(1) {
        line-height: 100px;
      }

      img {
        height: 100px;
        width: 100px;
        border-radius: 6px;
        margin-left: 20px;
      }
    }


    .bottom-button {
      position: absolute;
      bottom: 30px;
      width: calc(100% - 40px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
