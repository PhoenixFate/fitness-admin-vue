<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.customerName" placeholder="顾客姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.physicalCardIndex" placeholder="实体卡号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.gender" clearable placeholder="性别">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.createDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="创建日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="physicalCardIndex"
        header-align="center"
        align="center"
        width="120"
        label="实体卡编号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="110"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime.substr(0, 10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="100"
        label="会员姓名">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="120"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        width="110"
        label="会员照片">
        <template slot-scope="scope">
          <div class="avatar">
            <img :src="scope.row.avatar"
                 v-if="scope.row.avatar">
            <img src="~@/assets/img/customer/avatar-male.png"
                 v-if="!scope.row.avatar && scope.row.gender===1">
            <img src="~@/assets/img/customer/avatar-female.png"
                 v-if="!scope.row.avatar && scope.row.gender===2">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.contractType"
        header-align="center"
        align="center"
        width="120"
        label="卡的类型">
        <template slot-scope="scope">
          <span v-if="scope.row.contract && scope.row.contract.contractType==='VIP_CARD_CONTRACT'">会员卡</span>
          <span v-if="scope.row.contract && scope.row.contract.contractType==='TRAINING_CONTRACT'">私教</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.contractType"
        header-align="center"
        align="center"
        width="160"
        label="卡的名称">
        <template slot-scope="scope">
          <div v-if="scope.row.contract && scope.row.contract.contractType==='VIP_CARD_CONTRACT'">
            <span>{{ scope.row.contract.vipCardName }}</span>
          </div>
          <div v-if="scope.row.contract && scope.row.contract.contractType==='TRAINING_CONTRACT'">
            <span>{{ scope.row.contract.trainingPlanName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.contractStatus"
        header-align="center"
        align="center"
        width="110"
        label="卡的状态">
        <template slot-scope="scope">
          <span v-if="scope.row.contract && scope.row.contract.contractStatus==='NO_START'">未开始</span>
          <span v-if="scope.row.contract && scope.row.contract.contractStatus==='IN_PROGRESS'">进行中</span>
          <span v-if="scope.row.contract && scope.row.contract.contractStatus==='FINISHED'">已结束</span>
          <span v-if="scope.row.contract && scope.row.contract.contractStatus==='EXPIRED'">未使用，过期</span>
          <span v-if="scope.row.contract && scope.row.contract.contractStatus==='DELETE_MANUALLY'">手动删除</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.salesmanName"
        header-align="center"
        align="center"
        width="100"
        label="办理销售">
        <template slot-scope="scope">
          <span v-if="scope.row.contract">{{ scope.row.contract.salesmanName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.activeTime"
        header-align="center"
        align="center"
        width="120"
        label="有效期">
        <template slot-scope="scope">
          <div
            v-if="scope.row.contract && (scope.row.contract.vipCardBigType==='DURATION_CARD' || scope.row.contract.trainingType==='MONTH_TRAINING')"
            class="vip-duration">
            <div>{{ scope.row.contract.activeTime }}</div>
            <div>~</div>
            <div>{{ scope.row.contract.endTime }}</div>
          </div>
          <div
            v-if="scope.row.contract && (scope.row.contract.vipCardBigType==='COUNT_CARD' || (scope.row.contract.trainingType && scope.row.contract.trainingType!=='MONTH_TRAINING'))"
            class="vip-duration">
            <div>{{ scope.row.contract.totalRights }}次</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="contract.activeTime"
        header-align="center"
        align="center"
        width="110"
        label="剩余权益">
        <template slot-scope="scope">
          <div
            v-if="scope.row.contract && (scope.row.contract.vipCardBigType==='DURATION_CARD' || scope.row.contract.trainingType==='MONTH_TRAINING')"
            class="vip-duration">
            <div>{{ scope.row.contract.leftRights }}天</div>
          </div>
          <div
            v-if="scope.row.contract && (scope.row.contract.vipCardBigType==='COUNT_CARD' || (scope.row.contract.trainingType && scope.row.contract.trainingType!=='MONTH_TRAINING'))"
            class="vip-duration">
            <div>{{ scope.row.contract.leftRights }}次</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalMoney"
        header-align="center"
        align="center"
        width="100"
        label="消费总额">
      </el-table-column>
      <el-table-column
        prop="birthday"
        header-align="center"
        align="center"
        width="100"
        label="生日">
      </el-table-column>
      <el-table-column
        prop="contract.channel"
        header-align="center"
        align="center"
        width="120"
        label="渠道来源">
      </el-table-column>
      <el-table-column
        prop="contract.contractNumber"
        header-align="center"
        align="center"
        width="220"
        label="合同编号">
      </el-table-column>
      <el-table-column
        prop="physicalCardNumber"
        header-align="center"
        align="center"
        width="120"
        label="实体卡id">
      </el-table-column>
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
        width="60"
        label="性别">
        <template slot-scope="scope">
          <div class="gender">
            <div class="gender-male" v-if="scope.row.gender===1">
              男
            </div>
            <div class="gender-female" v-if="scope.row.gender===2">
              女
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="110"
        label="会员总时长">
        <template slot-scope="scope">
          <div class="vip-duration">
            <div>{{ scope.row.vipStartDate }}</div>
            <div v-if="scope.row.vipStartDate">~</div>
            <div>{{ scope.row.vipEndDate }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="训练目标">
        <template slot-scope="scope">
          <div class="customer-goal" v-if="scope.row.goalId">
            <div>{{ scope.row.goalName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="coachName"
        header-align="center"
        align="center"
        width="100"
        label="专属教练">
      </el-table-column>
      <el-table-column
        prop="identityCard"
        header-align="center"
        align="center"
        width="200"
        label="身份证">
      </el-table-column>
      <el-table-column
        prop="city"
        header-align="center"
        align="center"
        width="80"
        label="城市">
      </el-table-column>
      <el-table-column
        prop="mail"
        header-align="center"
        align="center"
        width="120"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="address"
        header-align="center"
        align="center"
        width="100"
        label="联系地址">
      </el-table-column>
      <el-table-column
        prop="customerNumber"
        header-align="center"
        align="center"
        width="94"
        label="顾客编号">
        <template slot-scope="scope">
          <div class="customer-number">
            {{ scope.row.customerNumber }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerType"
        header-align="center"
        align="center"
        width="80"
        label="续卡信息">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.customerType==='NEVER_CONSUME'">
              <span>潜客</span>
            </div>
            <div v-if="scope.row.customerType==='FIRST_CONSUME'">
              <span>新用户</span>
            </div>
            <div v-if="scope.row.customerType==='MORE_CONSUME'">
              <span>续卡用户</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="80"
        label="状态">
        <template slot-scope="scope">
          <div class="customer-status">
            <div class="status-common" v-if="scope.row.status==='COMMON'">
              <span>正常</span>
            </div>
            <div class="status-stop" v-if="scope.row.status==='STOP_CARD'">
              <span>停卡中</span>
            </div>
            <div class="status-canceled" v-if="scope.row.status==='CANCELLED'">
              <span>已注销</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showVipDurationDialog(scope.row)">所有权益</el-button>
          <el-button type="text" size="small" @click="showClockInHistory(scope.row)">打卡记录</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.customerId)"
                     v-if="scope.row.status==='COMMON' || scope.row.status==='STOP_CARD'">修改
          </el-button>
          <el-button type="text" class="delete-text" size="small" @click="stopCard(scope.row)"
                     v-if="scope.row.status==='COMMON'">停卡
          </el-button>
          <el-button type="text" class="delete-text" size="small" @click="cancelStop(scope.row)"
                     v-if="scope.row.status==='STOP_CARD'">取消停卡
          </el-button>
          <el-button type="text" class="delete-text" size="small" @click="cancelCustomer(scope.row)"
                     v-if="scope.row.status==='COMMON'">注销
          </el-button>
          <el-button type="text" class="delete-text" size="small" @click="deleteCustomer(scope.row)">删除
          </el-button>
          <!--          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <BindPhysicalCardDialog
      :customer="currentCustomer"
      :bindPhysicalCardDialogFlag.sync="bindPhysicalCardDialogFlag"
      @saveCustomerCommon="saveCustomerCommon"
      style="z-index: 40"
      v-if="bindPhysicalCardDialogFlag"
    >
    </BindPhysicalCardDialog>
    <CustomerContractDialog
      :customer-id="currentCustomer.customerId"
      :customer-name="currentCustomer.name"
      :customerContractDialogFlag.sync="customerContractDialogFlag"
      @getDataList="getDataList"
      style="z-index: 40"
      v-if="customerContractDialogFlag"
    >
    </CustomerContractDialog>
    <CheckInHistoryDialog
      :customer="currentCustomer"
      :clockInDialogFlag.sync="clockInDialogFlag"
      style="z-index: 40"
      v-if="clockInDialogFlag"
    >
    </CheckInHistoryDialog>
  </div>
</template>

<script>
import AddOrUpdate from './customer-add-or-update'
import {
  apiCustomerList,
  apiUpdateCustomerCommon,
  apiStopCustomer,
  apiCancelCustomer,
  apiCancelStop,
  apiCustomerDelete
} from '../../../api/customer'
import BindPhysicalCardDialog from '../../dialog/BindPhysicalCardDialog'
import CustomerContractDialog from '../../dialog/CustomerContractDialog'
import CheckInHistoryDialog from '../../dialog/CheckInHistoryDialog'

export default {
  data () {
    return {
      dataForm: {
        customerName: '',
        mobile: '',
        gender: '',
        physicalCardIndex: '',
        isVip: '',
        createDate: null
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      genderOptions: [{
        value: '1',
        label: '男'
      }, {
        value: '2',
        label: '女'
      }],
      vipOptions: [{
        value: '1',
        label: '会员'
      }, {
        value: '0',
        label: '非会员'
      }],
      currentCustomer: {},
      bindPhysicalCardDialogFlag: false,
      customerContractDialogFlag: false,
      clockInDialogFlag: false
    }
  },
  components: {
    AddOrUpdate, BindPhysicalCardDialog, CustomerContractDialog, CheckInHistoryDialog
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (origin) {
      if (origin === 'button') {
        this.pageIndex = 1
      }
      this.dataListLoading = true
      let params = Object.assign({
        'page': this.pageIndex,
        'limit': this.pageSize
      }, this.dataForm)
      apiCustomerList(params).then(({data}) => {
        console.log(data)
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
        if (this.dataList && this.dataList.length > 0) {
          this.dataList.forEach((customer) => {
            let totalMoney = 0
            if (customer.contracts && customer.contracts.length > 0) {
              for (let i = 0; i < customer.contracts.length; i++) {
                let contract = customer.contracts[i]
                if (contract.contractType === 'VIP_CARD_CONTRACT' || contract.contractType === 'TRAINING_CONTRACT') {
                  // 会员卡、私教课
                  customer.contract = contract
                  break
                }
              }
              customer.contracts.forEach((contract) => {
                totalMoney += parseFloat(contract.payTotalMoney)
              })
              customer.totalMoney = totalMoney
            }
          })
        }
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    stopCard (customer) {
      this.$confirm(`确定对 "${customer.name}" 进行停卡操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiStopCustomer(customer.customerId).then(() => {
          this.success()
        })
      })
    },
    cancelStop (customer) {
      this.$confirm(`确定对 "${customer.name}" 进行取消停卡操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiCancelStop(customer.customerId).then(() => {
          this.success()
        })
      })
    },
    cancelCustomer (customer) {
      this.$confirm(`确定对 "${customer.name}" 进行注销操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiCancelCustomer(customer.customerId).then(() => {
          this.success()
        })
      })
    },
    deleteCustomer (customer) {
      this.$confirm(`确定对 "${customer.name}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiCustomerDelete(customer.customerId).then(() => {
          this.success()
        })
      })
    },
    showVipDurationDialog (customer) {
      this.currentCustomer = customer
      this.customerContractDialogFlag = true
    },
    showClockInHistory (customer) {
      this.clockInDialogFlag = true
      this.currentCustomer = customer
    },
    bindPhysicalCard (customer) {
      this.currentCustomer = customer
      this.bindPhysicalCardDialogFlag = true
    },
    saveCustomerCommon () {
      apiUpdateCustomerCommon(this.currentCustomer).then().finally(() => {
        this.bindPhysicalCardDialogFlag = false
        this.success()
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
    },
    success () {
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.getDataList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.gender {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .gender-male, .gender-female {
    width: 30px;
    height: 30px;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }

  .gender-male {
    background-color: #3ab3a7;
  }

  .gender-female {
    background-color: #f1aeb3;
  }
}

.avatar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid #f8ba33;
  }
}

.vip {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 40px;
    height: 28px;
  }
}

.customer-number {
  font-weight: bold;
  color: #e76606;
  font-size: 22px;
}

.class-progress {
  strong {
    font-size: 16px;
    font-weight: bold;
  }

  strong:nth-child(1) {
    color: #6abc6a;
  }
}

.customer-goal {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 60px;
    height: 30px;
    border: 1px solid #1b9cc3;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1b9cc3;
  }
}

.customer-status {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .status-common, .status-stop, .status-canceled {
    width: 60px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .status-canceled {
    background-color: #ce392b;
  }

  .status-common {
    background-color: #a8d245;
  }

  .status-stop {
    background-color: #dbc037;
  }
}

.contract-duration {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
