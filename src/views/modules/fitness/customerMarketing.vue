<template>
  <div class="mod-config">
    <div class="card-left">
      <h5>会员卡剩余</h5>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
        <el-form-item>
          <el-input v-model="dataForm.vipLeftDaysMin" placeholder="剩余会员天数最小" type="number" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.vipLeftDaysMax" placeholder="剩余会员天数最大" type="number" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList('button')">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading1"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          width="80"
          label="会员姓名">
        </el-table-column>
        <el-table-column
          prop="vipLeftDays"
          header-align="center"
          align="center"
          width="120"
          label="剩余会员天数">
        </el-table-column>
        <el-table-column
          prop="contract.vipCardName"
          header-align="center"
          align="center"
          width="160"
          label="卡的名称">
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
          header-align="center"
          align="center"
          width="260"
          label="会员有效期">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.vipStartDate }}</span>
              <span v-if="scope.row.vipStartDate" style="margin: 0 10px">~</span>
              <span>{{ scope.row.vipEndDate }}</span>
            </div>
          </template>
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
          prop="mobile"
          header-align="center"
          align="center"
          width="120"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="recentVisit.visitDate"
          header-align="center"
          align="center"
          width="180"
          label="最近回访时间">
        </el-table-column>
        <el-table-column
          prop="recentVisit.visitContent"
          header-align="center"
          align="center"
          width="200"
          label="最近回访内容">
        </el-table-column>
        <el-table-column
          prop="recentVisit.nextVisitDate"
          header-align="center"
          align="center"
          width="120"
          label="下次回访日期">
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
            <el-button type="text" size="small" @click="showReturnVisitDialog(scope.row)">回访</el-button>
            <el-button type="text" size="small" @click="showVipDurationDialog(scope.row)">所有权益</el-button>
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
    </div>
    <div class="training-left">
      <h5>私教剩余</h5>
      <el-form :inline="true" :model="dataForm2" @keyup.enter.native="getDataList2('button')">
        <el-form-item>
          <el-button @click="getDataList2('button')">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList2"
        border
        v-loading="dataListLoading2"
        style="width: 100%;">
        <el-table-column
          prop="customer.name"
          header-align="center"
          align="center"
          width="80"
          label="会员姓名">
        </el-table-column>
        <el-table-column
          prop="leftRights"
          header-align="center"
          align="center"
          width="120"
          label="剩余私教次数">
        </el-table-column>
        <el-table-column
          prop="contractName"
          header-align="center"
          align="center"
          width="220"
          label="合同名称">
        </el-table-column>
        <el-table-column
          prop="salesmanName"
          header-align="center"
          align="center"
          width="100"
          label="办理销售">
          <template slot-scope="scope">
            <span v-if="scope.row.contract">{{ scope.row.contract.salesmanName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="260"
          label="私教有效期">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.activeTime }}</span>
              <span v-if="scope.row.activeTime" style="margin: 0 10px">~</span>
              <span>{{ scope.row.endTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer.gender"
          header-align="center"
          align="center"
          width="60"
          label="性别">
          <template slot-scope="scope">
            <div class="gender">
              <div class="gender-male" v-if="scope.row.customer.gender===1">
                男
              </div>
              <div class="gender-female" v-if="scope.row.customer.gender===2">
                女
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer.mobile"
          header-align="center"
          align="center"
          width="120"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="recentVisit.visitDate"
          header-align="center"
          align="center"
          width="180"
          label="最近回访时间">
        </el-table-column>
        <el-table-column
          prop="recentVisit.visitContent"
          header-align="center"
          align="center"
          width="200"
          label="最近回访内容">
        </el-table-column>
        <el-table-column
          prop="recentVisit.nextVisitDate"
          header-align="center"
          align="center"
          width="120"
          label="下次回访日期">
        </el-table-column>
        <el-table-column
          prop="customer.customerType"
          header-align="center"
          align="center"
          width="80"
          label="续卡信息">
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.customer.customerType==='NEVER_CONSUME'">
                <span>潜客</span>
              </div>
              <div v-if="scope.row.customer.customerType==='FIRST_CONSUME'">
                <span>新用户</span>
              </div>
              <div v-if="scope.row.customer.customerType==='MORE_CONSUME'">
                <span>续卡用户</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer.status"
          header-align="center"
          align="center"
          width="80"
          label="状态">
          <template slot-scope="scope">
            <div class="customer-status">
              <div class="status-common" v-if="scope.row.customer.status==='COMMON'">
                <span>正常</span>
              </div>
              <div class="status-stop" v-if="scope.row.customer.status==='STOP_CARD'">
                <span>停卡中</span>
              </div>
              <div class="status-canceled" v-if="scope.row.customer.status==='CANCELLED'">
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
            <el-button type="text" size="small" @click="showReturnVisitDialog2(scope.row)">回访</el-button>
            <el-button type="text" size="small" @click="showVipDurationDialog2(scope.row)">所有权益</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle2"
        @current-change="currentChangeHandle2"
        :current-page="pageIndex2"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize2"
        :total="totalPage2"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <div class="training-left">
      <h5>顾客/访课数量统计</h5>
      <el-form :inline="true" :model="dataForm2" @keyup.enter.native="getDataList3('button')">
        <el-form-item>
          <el-button @click="getDataList3('button')">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList3"
        border
        v-loading="dataListLoading3"
        style="width: 100%;">
        <el-table-column
          prop="typeName"
          header-align="center"
          align="center"
          width="80"
          label="类别">
        </el-table-column>
        <el-table-column
          prop="oneToFive"
          header-align="center"
          align="center"
          width="80"
          label="01-05">
        </el-table-column>
        <el-table-column
          prop="fiveToEight"
          header-align="center"
          align="center"
          width="80"
          label="05-08">
        </el-table-column>
        <el-table-column
          prop="eightToNine"
          header-align="center"
          align="center"
          width="80"
          label="08-09">
        </el-table-column>
        <el-table-column
          prop="nineToTen"
          header-align="center"
          align="center"
          width="80"
          label="09-10">
        </el-table-column>
        <el-table-column
          prop="tenToEleven"
          header-align="center"
          align="center"
          width="80"
          label="10-11">
        </el-table-column>
        <el-table-column
          prop="elevenToTwelve"
          header-align="center"
          align="center"
          width="80"
          label="11-12">
        </el-table-column>
        <el-table-column
          prop="twelveToThirteen"
          header-align="center"
          align="center"
          width="80"
          label="12-13">
        </el-table-column>
        <el-table-column
          prop="thirteenToFourteen"
          header-align="center"
          align="center"
          width="80"
          label="13-14">
        </el-table-column>
        <el-table-column
          prop="fourteenToFifteen"
          header-align="center"
          align="center"
          width="80"
          label="14-15">
        </el-table-column>
        <el-table-column
          prop="fifteenToSixteen"
          header-align="center"
          align="center"
          width="80"
          label="15-16">
        </el-table-column>
        <el-table-column
          prop="sixteenToSeventeen"
          header-align="center"
          align="center"
          width="80"
          label="16-17">
        </el-table-column>
        <el-table-column
          prop="seventeenToEighteen"
          header-align="center"
          align="center"
          width="80"
          label="17-18">
        </el-table-column>
        <el-table-column
          prop="eighteenToNineteen"
          header-align="center"
          align="center"
          width="80"
          label="18-19">
        </el-table-column>
        <el-table-column
          prop="nineteenToTwenty"
          header-align="center"
          align="center"
          width="80"
          label="19-20">
        </el-table-column>
        <el-table-column
          prop="twentyTo21"
          header-align="center"
          align="center"
          width="80"
          label="20-21">
        </el-table-column>
        <el-table-column
          prop="twentyOneTo22"
          header-align="center"
          align="center"
          width="80"
          label="21-22">
        </el-table-column>
        <el-table-column
          prop="twentyTwoTo23"
          header-align="center"
          align="center"
          width="80"
          label="22-23">
        </el-table-column>
        <el-table-column
          prop="twentyThreeTo01"
          header-align="center"
          align="center"
          width="80"
          label="23-01">
        </el-table-column>
      </el-table>

    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <CustomerContractDialog
      :customer-id="currentCustomer.customerId"
      :customer-name="currentCustomer.name"
      :customerContractDialogFlag.sync="customerContractDialogFlag"
      @getDataList="getDataList"
      style="z-index: 40"
      v-if="customerContractDialogFlag"
    >
    </CustomerContractDialog>
    <ReturnVisitHistoryDialog
      :customer="currentCustomer"
      @updateData="getDataList"
      :returnVisitDialogFlag.sync="returnVisitDialogFlag"
      style="z-index: 40"
      v-if="returnVisitDialogFlag"
    >
    </ReturnVisitHistoryDialog>
    <ReturnVisitHistoryDialog
      :customer="currentCustomer"
      @updateData="getDataList2"
      :returnVisitDialogFlag.sync="returnVisitDialogFlag2"
      style="z-index: 40"
      v-if="returnVisitDialogFlag2"
    >
    </ReturnVisitHistoryDialog>
    <CustomerRemindListDialog
      :remind-list="remindList"
      :customerRemindListDialogFlag.sync="customerRemindListDialogFlag"
      style="z-index: 40"
      v-if="customerRemindListDialogFlag"
    >
    </CustomerRemindListDialog>
    <div id="chartLineBox" class="chart-box"></div>

  </div>
</template>

<script>
import AddOrUpdate from './customer-add-or-update'
import CustomerContractDialog from '../../dialog/CustomerContractDialog'
import ReturnVisitHistoryDialog from '../../dialog/ReturnVisitHistoryDialog'
import {
  apiCustomerMarketCardList,
  apiCustomerMarketTrainingList,
  apiPeriodCount,
  apiPeriodCountChart
} from '../../../api/marketing'
import {apiGetRemind} from '../../../api/returnVisit'
import {getStrDate} from '../../../utils/dateUtil'
import CustomerRemindListDialog from '../../dialog/CustomerRemindListDialog'
import * as echarts from 'echarts'

export default {
  data () {
    return {
      chartLine: null,
      dataForm: {
        vipLeftDaysMin: '',
        vipLeftDaysMax: ''
      },
      dataForm2: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading1: false,
      dataListLoading2: false,
      dataListLoading3: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      currentCustomer: {},
      bindPhysicalCardDialogFlag: false,
      customerContractDialogFlag: false,
      clockInDialogFlag: false,
      returnVisitDialogFlag: false,
      returnVisitDialogFlag2: false,
      customerRemindListDialogFlag: false,
      remindList: [],
      dataList2: [],
      pageIndex2: 1,
      pageSize2: 10,
      totalPage2: 0,
      dataList3: [],
      chartData: []
    }
  },
  components: {
    AddOrUpdate, CustomerContractDialog, ReturnVisitHistoryDialog, CustomerRemindListDialog
  },
  activated () {
    this.getDataList()
    this.getDataList2()
    this.getDataList3()
    this.getChartData()
  },
  created () {
    this.getRemindList()
  },
  methods: {
    getRemindList () {
      apiGetRemind({date: getStrDate(new Date())}).then(({data}) => {
        if (data.data && data.data.length > 0) {
          this.remindList = data.data
          // this.showRemindListDialog()
        }
      })
    },
    // 获取数据列表
    getDataList (origin) {
      if (origin === 'button') {
        this.pageIndex = 1
      }
      this.dataListLoading1 = true
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'customerName': this.dataForm.customerName,
        vipLeftDaysMin: this.dataForm.vipLeftDaysMin,
        vipLeftDaysMax: this.dataForm.vipLeftDaysMax
      }
      apiCustomerMarketCardList(params).then(({data}) => {
        console.log(data)
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
        if (this.dataList && this.dataList.length > 0) {
          this.dataList.forEach((customer) => {
            if (customer.contracts && customer.contracts.length > 0) {
              for (let i = 0; i < customer.contracts.length; i++) {
                let contract = customer.contracts[i]
                if (contract.contractType === 'VIP_CARD_CONTRACT') {
                  // 会员卡、私教课
                  customer.contract = contract
                  break
                }
              }
            }
            if (customer.customerReturnVisits && customer.customerReturnVisits.length > 0) {
              customer.recentVisit = customer.customerReturnVisits[0]
            }
          })
        }
      }).finally(() => {
        this.dataListLoading1 = false
      })
    },
    getDataList2 (origin) {
      if (origin === 'button') {
        this.pageIndex2 = 1
      }
      this.dataListLoading2 = true
      let params = {
        'page': this.pageIndex2,
        'limit': this.pageSize2
      }
      apiCustomerMarketTrainingList(params).then(({data}) => {
        console.log(data)
        this.dataList2 = data.data.list
        this.totalPage2 = data.data.totalCount
        if (this.dataList2 && this.dataList2.length > 0) {
          this.dataList2.forEach((customer) => {
            if (customer.customerReturnVisits && customer.customerReturnVisits.length > 0) {
              customer.recentVisit = customer.customerReturnVisits[0]
            }
          })
        }
      }).finally(() => {
        this.dataListLoading2 = false
      })
    },
    getDataList3 () {
      apiPeriodCount().then(({data}) => {
        console.log(data)
        this.dataList3 = data.data
      }).finally(() => {
        this.dataListLoading3 = false
      })
    },
    getChartData () {
      apiPeriodCountChart().then(({data}) => {
        console.log(data)
        this.chartData = data.data
        this.initChartLine()
      })
    },

    // 趋势图
    initChartLine () {
      let customerPeriodData = this.chartData[0]
      let visitorPeriodData = this.chartData[1]
      let option = {
        title: {
          text: '时间段访问统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['顾客访问统计', '访客访问统计']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '0%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['01-05', '05-08', '08-09', '09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-01']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '顾客时间段数量',
            type: 'line',
            areaStyle: {
              normal: {
                color: 'rgba(255,255,255,.5)'
              }

            },
            data: customerPeriodData
          },
          {
            name: '访客时间段统计',
            type: 'line',
            areaStyle: {},
            stack: 'total',
            data: visitorPeriodData
          }
        ]
      }
      if (!this.chartLine) {
        this.chartLine = echarts.init(document.getElementById('chartLineBox'))
        window.addEventListener('resize', () => {
          this.chartLine.resize()
        })
      }
      this.chartLine.setOption(option)
    },

    showVipDurationDialog (customer) {
      this.currentCustomer = customer
      this.customerContractDialogFlag = true
    },
    showVipDurationDialog2 (customerContract) {
      this.currentCustomer = customerContract.customer
      this.customerContractDialogFlag = true
    },
    showRemindListDialog () {
      this.customerRemindListDialogFlag = true
    },
    showReturnVisitDialog (customer) {
      this.currentCustomer = customer
      this.returnVisitDialogFlag = true
    },
    showReturnVisitDialog2 (customerContract) {
      this.currentCustomer = customerContract.customer
      this.returnVisitDialogFlag2 = true
    },
    showClockInHistory (customer) {
      this.clockInDialogFlag = true
      this.currentCustomer = customer
    },
    bindPhysicalCard (customer) {
      this.currentCustomer = customer
      this.bindPhysicalCardDialogFlag = true
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    sizeChangeHandle2 (val) {
      this.pageSize2 = val
      this.pageIndex2 = 1
      this.getDataList2()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 当前页
    currentChangeHandle2 (val) {
      this.pageIndex2 = val
      this.getDataList2()
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
.card-left {
  h5 {
    margin: 4px 0 20px 0;
    font-size: 18px;
  }
}

.training-left {
  h5 {
    margin: 22px 0 20px 0;
    font-size: 18px;
  }
}

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

.chart-box {
  min-height: 400px;
  margin-top: 30px;
}
</style>
