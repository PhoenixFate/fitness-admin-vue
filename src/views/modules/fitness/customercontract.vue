<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.physicalCardIndex" placeholder="顾客实体卡号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.customerName" placeholder="顾客姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.contractName" placeholder="合同名称" clearable></el-input>
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
        <el-select v-model="dataForm.contractStatus" clearable placeholder="合同状态">
          <el-option
            v-for="item in contractStatusOptions"
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
        <el-date-picker
          v-model="dataForm.activeDateMin"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="激活最小日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.activeDateMax"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="激活最大日期">
        </el-date-picker>
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
        <el-select v-model="dataForm.isOld" clearable placeholder="是否老合同">
          <el-option
            v-for="item in isOldOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="customer.physicalCardIndex"
        header-align="center"
        align="center"
        width="80"
        label="实体卡号">
      </el-table-column>
      <el-table-column
        prop="customer.name"
        header-align="center"
        align="center"
        width="100"
        label="顾客姓名">
      </el-table-column>
      <el-table-column
        prop="contractType"
        header-align="center"
        align="center"
        width="100"
        label="合同类型">
        <template slot-scope="scope">
          <span>{{ scope.row.contractType | contractTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contractType"
        header-align="center"
        align="center"
        width="160"
        label="卡/课程名称">
        <template slot-scope="scope">
          <div v-if="scope.row.contractType==='VIP_CARD_CONTRACT'">
            <span>{{ scope.row.vipCardName }}</span>
          </div>
          <div v-if="scope.row.contractType==='TRAINING_CONTRACT'">
            <span>{{ scope.row.trainingPlanName }}</span>
          </div>
        </template>
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
        prop="contractName"
        header-align="center"
        align="center"
        width="220"
        label="合同名称">
      </el-table-column>
      <el-table-column
        prop="contractNumber"
        header-align="center"
        align="center"
        width="230"
        label="合同编号">
      </el-table-column>
      <el-table-column
        prop="totalMoney"
        header-align="center"
        align="center"
        width="80"
        label="原始总价">
      </el-table-column>
      <el-table-column
        prop="payTotalMoney"
        header-align="center"
        align="center"
        width="100"
        label="支付总金额">
      </el-table-column>
      <el-table-column
        prop="payMoney"
        header-align="center"
        align="center"
        width="90"
        label="支付金额1">
      </el-table-column>
      <el-table-column
        prop="payType"
        header-align="center"
        align="center"
        width="90"
        label="支付方式1">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payMoney2"
        header-align="center"
        align="center"
        width="90"
        label="支付金额2">
      </el-table-column>
      <el-table-column
        prop="payType2"
        header-align="center"
        align="center"
        width="90"
        label="支付方式2">
        <template slot-scope="scope">
          <span>{{ scope.row.payType2 | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="leftMoney"
        header-align="center"
        align="center"
        width="100"
        label="剩余总金额">
      </el-table-column>
      <el-table-column
        prop="totalRights"
        header-align="center"
        align="center"
        label="总的权益">
      </el-table-column>
      <el-table-column
        prop="leftRights"
        header-align="center"
        align="center"
        label="剩余权益">
      </el-table-column>
      <el-table-column
        prop="freeDays"
        header-align="center"
        align="center"
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
        prop="payTime"
        header-align="center"
        align="center"
        width="120"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="operationTime"
        header-align="center"
        align="center"
        width="200"
        label="操作时间">
      </el-table-column>
      <!--      <el-table-column-->
      <!--        prop="offlineContract"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        width="200"-->
      <!--        label="是否有线下合同">-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="channel"
        header-align="center"
        align="center"
        width="100"
        label="渠道">
      </el-table-column>
      <el-table-column
        prop="isOld"
        header-align="center"
        align="center"
        width="100"
        label="是否老合同">
        <template slot-scope="scope">
          <span v-if="scope.row.isOld===0">新合同</span>
          <span v-if="scope.row.isOld===1">老合同</span>
        </template>
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
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="modifyContact(scope.row)"
                     v-if="scope.row.contractType==='GROUP_PURCHASE_PRICE'">修改
          </el-button>
          <el-button type="text" size="small" class="delete-text" @click="deleteContract(scope.row)">删除</el-button>
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
    <modify-contract-dialog
      style="z-index: 100"
      @getDate="getDataList"
      :contract="currentContract"
      :modifyContractFlag.sync="modifyContractFlag"
      v-if="modifyContractFlag"
    >
    </modify-contract-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './customercontract-add-or-update'
import {apiContractList, apiContractDelete} from '../../../api/contract'
import ModifyContractDialog from '../../dialog/ModifyContractDialog'
import {ContractTypeOptions, ContractStatusOptions, ContractOldOptions} from '../../../const/contract/contract'
import {VipCardBigTypeOptions, VipCardTypeOptions} from '../../../const/vipCardType'
import {TrainingTypeOptions} from '../../../const/training'
import {PayTypeOptions} from '../../../const/payType'

export default {
  data () {
    return {
      dataForm: {
        physicalCardIndex: '',
        customerName: '',
        contractName: '',
        contractType: '',
        contractStatus: '',
        trainingType: '',
        vipCardBigType: '',
        payMoneyMax: '',
        payMoneyMin: '',
        activeDateMin: '',
        activeDateMax: '',
        salesmanName: '',
        coachName: '',
        channel: '',
        isOld: '',
        payType: '',
        vipCardType: ''
      },
      contractTypeOptions: ContractTypeOptions,
      trainingTypeOptions: TrainingTypeOptions,
      vipCardBigTypeOptions: VipCardBigTypeOptions,
      vipCardTypeOptions: VipCardTypeOptions,
      contractStatusOptions: ContractStatusOptions,
      isOldOptions: ContractOldOptions,
      payTypeOptions: PayTypeOptions,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      currentContract: null,
      modifyContractFlag: false
    }
  },
  components: {
    AddOrUpdate, ModifyContractDialog
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
      console.log(params)
      apiContractList(params).then(({data}) => {
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
        console.log(this.dataList)
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    // 修改合同
    modifyContact (contract) {
      console.log(contract)
      this.currentContract = contract
      this.modifyContractFlag = true
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
    deleteContract (customerContract) {
      this.$confirm(`确定要删除名为 "${customerContract.contractName}" 的合同吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiContractDelete(customerContract.customerContractId).then(() => {
          this.message = '删除成功！'
          this.messageInfoFlag = true
          this.getDataList()
        })
      })
    }
  }
}
</script>
