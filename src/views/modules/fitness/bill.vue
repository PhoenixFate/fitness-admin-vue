<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-date-picker
          v-model="dataForm.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.contractPeriodFilter" clearable placeholder="合同筛选">
          <el-option
            v-for="item in contractPeriodFilter"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.contractType" clearable placeholder="合同类别">
          <el-option
            v-for="item in contractTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.payType" clearable placeholder="支付方式">
          <el-option
            v-for="item in payTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.payMoneyMin" placeholder="支付金额最小值" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.payMoneyMax" placeholder="支付金额最大值" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.vipCardBigType" clearable placeholder="会员卡类别">
          <el-option
            v-for="item in vipCardBigTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.vipCardType" clearable placeholder="会员卡分类">
          <el-option
            v-for="item in vipCardTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.trainingType" clearable placeholder="私教类型">
          <el-option
            v-for="item in trainingTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.customerName" placeholder="顾客姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.salesmanName" placeholder="销售姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.coachName" placeholder="上课教练" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.channel" placeholder="渠道" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button type="primary" @click="exportBill()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="totalList"
      border
      style="width: auto;margin-bottom: 2rem">
      <el-table-column
        prop="totalInAccountMoney"
        header-align="center"
        align="center"
        width="200"
        label="收入">
      </el-table-column>
      <el-table-column
        prop="totalAfterCouponInAccountMoney"
        header-align="center"
        align="center"
        width="200"
        label="券后收入">
      </el-table-column>
      <el-table-column
        prop="totalAfterTaxInAccountMoney"
        header-align="center"
        align="center"
        width="200"
        label="税后券后收入">
      </el-table-column>
      <el-table-column
        prop="totalRealMoney"
        header-align="center"
        align="center"
        width="200"
        label="毛利润">
      </el-table-column>
      <el-table-column
        prop="totalAfterTaxRealMoney"
        header-align="center"
        align="center"
        width="200"
        label="税后毛利润">
      </el-table-column>
    </el-table>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="customer.name"
        header-align="center"
        align="center"
        width="100"
        label="顾客姓名">
      </el-table-column>
      <el-table-column
        prop="contractName"
        header-align="center"
        align="center"
        width="220"
        label="合同名称">
      </el-table-column>
      <el-table-column
        prop="payTotalMoney"
        header-align="center"
        align="center"
        width="100"
        label="支付总金额">
      </el-table-column>
      <el-table-column
        prop="inAccountMoney"
        header-align="center"
        align="center"
        width="80"
        label="收入">
      </el-table-column>
      <el-table-column
        prop="afterCouponInAccountMoney"
        header-align="center"
        align="center"
        width="80"
        label="券后收入">
      </el-table-column>
      <el-table-column
        prop="afterTaxInAccountMoney"
        header-align="center"
        align="center"
        width="110"
        label="税后券后收入">
      </el-table-column>
      <el-table-column
        prop="payMoney"
        header-align="center"
        align="center"
        width="100"
        label="支付金额1">
      </el-table-column>
      <el-table-column
        prop="payType"
        header-align="center"
        align="center"
        width="100"
        label="支付方式1">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payMoney2"
        header-align="center"
        align="center"
        width="100"
        label="支付金额2">
      </el-table-column>
      <el-table-column
        prop="payType2"
        header-align="center"
        align="center"
        width="100"
        label="支付方式2">
        <template slot-scope="scope">
          <span>{{ scope.row.payType2|payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="realUsedCount"
        header-align="center"
        align="center"
        width="120"
        label="会员使用天数/私教使用次数">
      </el-table-column>
      <el-table-column
        prop="realIncome"
        header-align="center"
        align="center"
        width="160"
        label="毛利润">
      </el-table-column>
      <el-table-column
        prop="afterTaxRealIncome"
        header-align="center"
        align="center"
        width="160"
        label="税后毛利润">
      </el-table-column>
      <el-table-column
        prop="totalRights"
        header-align="center"
        align="center"
        width="120"
        label="总的权益">
      </el-table-column>
      <el-table-column
        prop="totalUsedCount"
        header-align="center"
        align="center"
        width="120"
        label="总使用权益">
      </el-table-column>
      <el-table-column
        prop="totalUsedMoney"
        header-align="center"
        align="center"
        width="120"
        label="总使用金额">
      </el-table-column>
      <el-table-column
        prop="leftRights"
        header-align="center"
        align="center"
        width="120"
        label="总剩余权益">
      </el-table-column>
      <el-table-column
        prop="leftMoney"
        header-align="center"
        align="center"
        width="120"
        label="总剩余金额">
      </el-table-column>
      <el-table-column
        prop="freeDays"
        header-align="center"
        align="center"
        width="100"
        label="赠送权益">
      </el-table-column>
      <el-table-column
        prop="couponMoney"
        header-align="center"
        align="center"
        width="100"
        label="抵用券金额">
      </el-table-column>
      <el-table-column
        prop="activeTime"
        header-align="center"
        align="center"
        width="140"
        label="激活时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        width="140"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="contractStatus"
        header-align="center"
        align="center"
        width="100"
        label="合同状态">
        <template slot-scope="scope">
          <span>{{ scope.row.contractStatus | contractStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payTime"
        header-align="center"
        align="center"
        width="120"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="salesmanName"
        header-align="center"
        align="center"
        width="100"
        label="销售人姓名">
      </el-table-column>
      <el-table-column
        prop="coachName"
        header-align="center"
        align="center"
        width="100"
        label="上课教练">
      </el-table-column>
      <el-table-column
        prop="channel"
        header-align="center"
        align="center"
        width="100"
        label="渠道">
      </el-table-column>
      <el-table-column
        prop="refundMoney"
        header-align="center"
        align="center"
        width="80"
        label="退费金额">
      </el-table-column>
      <el-table-column
        prop="refundPayType"
        header-align="center"
        align="center"
        width="100"
        label="退费方式">
        <template slot-scope="scope">
          <span>{{ scope.row.refundPayType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundDate"
        header-align="center"
        align="center"
        width="130"
        label="退费日期">
        <template slot-scope="scope">
          <span v-if="scope.row.refundDate">{{ scope.row.refundDate.substr(0, 10) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operationTime"
        header-align="center"
        align="center"
        width="200"
        label="操作时间">
      </el-table-column>
      <!--      <el-table-column-->
      <!--        fixed="right"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="60"-->
      <!--        label="操作">-->
      <!--        <template slot-scope="scope">-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
</template>

<script>
import {apiBillExport, apiBillList, apiBillTotalList} from '../../../api/bill'
import {getStrDate} from '../../../utils/dateUtil'
import {ContractOldOptions, ContractStatusOptions, ContractTypeOptions} from '../../../const/contract/contract'
import {VipCardBigTypeOptions, VipCardTypeOptions} from '../../../const/vipCardType'
import {TrainingTypeOptions} from '../../../const/training'
import {PayTypeOptions} from '../../../const/payType'

export default {
  data () {
    return {
      dataForm: {
        startDate: '',
        endDate: '',
        contractType: '',
        contractPeriodFilter: '',
        payType: '',
        payMoneyMin: '',
        payMoneyMax: '',
        vipCardBigType: '',
        vipCardType: '',
        trainingType: '',
        salesmanName: '',
        coachName: '',
        channel: '',
        customerName: ''
      },
      contractTypeOptions: ContractTypeOptions,
      trainingTypeOptions: TrainingTypeOptions,
      vipCardBigTypeOptions: VipCardBigTypeOptions,
      contractStatusOptions: ContractStatusOptions,
      vipCardTypeOptions: VipCardTypeOptions,
      payTypeOptions: PayTypeOptions,
      isOldOptions: ContractOldOptions,
      contractPeriodFilter: [{
        value: 'inPeriod',
        label: '在搜索时间段内付款'
      }],
      dataList: [],
      totalList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {},
  activated () {
    this.getDataList()
  },
  created () {
    this.dataForm.startDate = '2021-06-01'
    this.dataForm.endDate = getStrDate(new Date())
    console.log(this.dataForm.startDate)
    console.log(this.dataForm.endDate)
  },
  methods: {
    // 获取数据列表
    getDataList (origin) {
      if (origin === 'button') {
        this.pageIndex = 1
      }
      if (!this.dataForm.startDate) {
        this.$message.warning('请选择开始日期')
        return
      }
      if (!this.dataForm.endDate) {
        this.$message.warning('请选择结束日期')
        return
      }
      if (this.dataForm.endDate < this.dataForm.startDate) {
        this.$message.warning('结束日期需要大于等于开始日期')
        return
      }
      this.dataListLoading = true
      let params = Object.assign({
        'page': this.pageIndex,
        'limit': this.pageSize
      }, this.dataForm)
      console.log(params)
      apiBillList(params).then(({data}) => {
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
        console.log(this.dataList)
      }).finally(() => {
        this.dataListLoading = false
      })
      apiBillTotalList(params).then(({data}) => {
        console.log(data)
        this.totalList = []
        this.totalList.push(data.data)
      })
    },
    exportBill () {
      apiBillExport(this.dataForm).then(res => {
        if (res.data) {
          let fileName = '账单-' + this.dataForm.startDate + '-' + this.dataForm.endDate + '.xls'
          let blob = new Blob([res.data], {type: 'application/x-xls'})
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            // 下载
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        }
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
    }
  }
}
</script>
