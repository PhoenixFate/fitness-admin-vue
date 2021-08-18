<template>
  <div class="add-customer-contract-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="add-customer-contract">
      <div class="customer-card">
        <span>姓名</span>
        <span>{{ customer.name }}</span>
      </div>
      <div class="customer-card">
        <span>操作员</span>
        <el-input v-model="returnVisit.operationName" placeholder="默认为当前账户，可不填"
                  style="width: 220px"></el-input>
      </div>
      <div class="customer-card special-line">
        <span>回访内容</span>
        <textarea v-model="returnVisit.visitContent"></textarea>
      </div>
      <div class="customer-card">
        <span>回访时间</span>
        <el-date-picker
          v-model="returnVisit.visitDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择回访时间"
          default-time="12:00:00">
        </el-date-picker>
      </div>
      <div class="customer-card">
        <span>下次回访时间</span>
        <el-date-picker
          v-model="returnVisit.nextVisitDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择下次回访时间">
        </el-date-picker>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 50px">取消</el-button>
        <el-button type="primary" @click="saveCustomerContract()">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {apiSaveCustomerReturnVisit} from '../../api/returnVisit'
import {getStrDateLong} from '../../utils/dateUtil'

export default {
  components: {BackgroundBlack},
  name: 'AddReturnVisitDialog',
  data () {
    return {
      returnVisit: {
        operationName: '',
        visitContent: '',
        visitDate: '',
        nextVisitDate: ''
      }
    }
  },
  created () {
    this.returnVisit.operationName = this.$store.state.user.name
    this.returnVisit.visitDate = getStrDateLong(new Date())
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:addReturnVisitDialogFlag', false)
    },
    saveCustomerContract () {
      console.log(this.returnVisit)
      if (!this.returnVisit.visitContent) {
        this.$message.warning('请填写回访内容')
        return
      }
      if (!this.returnVisit.visitDate) {
        this.$message.warning('请选择回访日期')
        return
      }
      if (!this.returnVisit.operationName) {
        // 为空则默认为当前操作员
        this.returnVisit.operationName = this.$store.state.user.name
      }
      this.returnVisit.customerId = this.customer.customerId
      this.returnVisit.customerName = this.customer.name
      apiSaveCustomerReturnVisit(this.returnVisit).then(() => {
        this.success()
        this.hiddenDialog()
        this.$emit('updateData')
      })
    },
    success () {
      this.toDoSave = true
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
        }
      })
    }
  },
  props: {
    customer: Object,
    addReturnVisitDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.add-customer-contract-body {
  .add-customer-contract {
    width: 400px;
    height: 500px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -250px;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px 0 20px 20px;
    z-index: 2010;
    border: 1px solid #000;
    font-size: 14px;

    .contract-type {
      height: 44px;
      background-color: #e2e2e2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      margin-right: 6px;
    }


    .customer-card {
      height: 48px;
      display: flex;

      > span:nth-child(1) {
        display: block;
        height: 100%;
        width: 100px;
        line-height: 36px;
        text-align: center;
        margin-right: 20px;
      }

      > span:nth-child(2) {
        line-height: 36px;
        text-align: left;
        width: 140px;
      }

      .select-vip-card, .contract-type {
        height: 36px;
        width: 140px;
        background-color: #e2e2e2;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        font-size: 1rem;
      }


      .contract-type {
        width: 80px;
      }

      .contract-type-selected {
        background-color: #3ab3a7;
      }
    }

    .special-line {
      height: 168px;
      display: flex;

      textarea {
        width: 220px;
        height: 150px;
      }
    }


    .bottom-button {
      position: absolute;
      bottom: 20px;
      width: calc(100% - 40px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.old-contract {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
</style>
