<template>
  <div class="minus-times-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="minus-times">
      <div class="customer-name">
        <span>姓名</span>
        <span>{{ customerName }}</span>
      </div>
      <div class="customer-name">
        <span>合同名称</span>
        <span>{{ contract.contractName }}</span>
      </div>
      <div class="customer-name">
        <span>销课记录</span>
        <span></span>
      </div>
      <div class="minus-times-scroll">
        <div class="minus-times-content"
             v-if="customerSureClassList && customerSureClassList.length>0">
          <div class="minus-times-item">
            <span>序号</span>
            <span>销课人员</span>
            <span>销课时间</span>
            <span>销课客户端</span>
            <span>操作</span>
          </div>
          <div class="minus-times-item" v-for="(sureClass,index) in customerSureClassList"
               :key="index">
            <span>{{ index + 1 }}</span>
            <span>{{ sureClass.operationName }}</span>
            <span>{{ sureClass.sureClassTime }}</span>
            <span>{{ sureClass.client | clientFilter }}</span>
            <span>
              <span @click="showModifySureClassDialog(sureClass)">修改</span>
              <span @click="deleteSureClass(sureClass)">删除</span>
            </span>
          </div>
        </div>
        <div class="minus-times-empty"
             v-if="!customerSureClassList || customerSureClassList.length===0">
          暂无销课记录
        </div>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()">关闭</el-button>
      </div>
    </div>
    <ModifySureClassDialog
      :sureClass="sureClass"
      :modifySureClassFlag.sync="modifySureClassFlag"
      v-if="modifySureClassFlag"
      style="z-index: 80"
    >
    </ModifySureClassDialog>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {apiOneContractSureClassList, apiDeleteSureClassLog} from '../../api/customerSureClass'
import ModifySureClassDialog from './ModifySureClassDialog'

export default {
  components: {BackgroundBlack, ModifySureClassDialog},
  name: 'MinusTimesHistoryDialog',
  data () {
    return {
      customerSureClassList: [],
      modifySureClassFlag: false,
      sureClass: null
    }
  },
  created () {
    console.log(this.customer)
    this.getData()
  },
  methods: {
    getData () {
      apiOneContractSureClassList(this.contract.customerContractId).then(({data}) => {
        console.log(data)
        this.customerSureClassList = data.data
      })
    },
    showModifySureClassDialog (sureClass) {
      this.sureClass = sureClass
      this.modifySureClassFlag = true
    },
    deleteSureClass (sureClass) {
      this.$confirm(`确定要删除时间为 "${sureClass.sureClassTime}" 的销课记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDeleteSureClassLog(sureClass.customerSureClassId).then(() => {
          this.success()
          this.getData()
        })
      })
    },
    hiddenDialog () {
      this.$emit('update:minusTimesDialogFlag', false)
    },
    success () {
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
    customerName: String,
    minusTimesDialogFlag: Boolean,
    contract: Object
  }
}
</script>

<style scoped lang="scss">
.minus-times-body {
  .minus-times {
    width: 560px;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -280px;
    margin-top: -300px;
    background-color: #fff;
    border-radius: 20px;
    padding: 30px 20px 20px 20px;
    border: 1px solid #000;
    z-index: 2010;

    .customer-name {
      height: 36px;
      display: flex;

      span:nth-child(1) {
        display: block;
        height: 100%;
        width: 120px;
        line-height: 36px;
        text-align: left;
        padding-left: 30px;
      }

      span:nth-child(2) {
        height: 100%;
        width: 200px;
        display: block;
        line-height: 36px;
        text-align: left;
      }
    }

    .minus-times-scroll {
      width: 460px;
      height: 350px;
      margin: 10px 10px 0 40px;

      .minus-times-content {
        height: 100%;
        width: 100%;
        overflow-y: scroll;

        .minus-times-item {
          height: 40px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: center;

          span:nth-child(1) {
            width: 40px;
          }

          span:nth-child(2) {
            width: 120px;
          }

          span:nth-child(3) {
            width: 200px;
          }

          span:nth-child(4) {
            width: 120px;
          }

          span:nth-child(5) {
            width: 120px;

            span:nth-child(1) {
              margin-right: 20px;
              color: #3ab3a7;
            }

            span:nth-child(2) {
              color: #e3505a;
            }
          }
        }
      }

      .minus-times-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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
</style>
