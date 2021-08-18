<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.customerName" placeholder="顾客姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.contractType" clearable placeholder="销课分类">
          <el-option
            v-for="item in contractTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.coachName" placeholder="教练姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.operationName" placeholder="操作员姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.sureClassTimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="销课日期-开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.sureClassTimeEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="销课日期-结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button type="primary" @click="exportBill()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="customerSureClassId"
        header-align="center"
        align="center"
        width="80"
        label="id">
      </el-table-column>
      <el-table-column
        prop="customerName"
        header-align="center"
        align="center"
        width="120"
        label="顾客">
      </el-table-column>
      <el-table-column
        prop="contractName"
        header-align="center"
        align="center"
        label="合同">
      </el-table-column>
      <el-table-column
        prop="coachName"
        header-align="center"
        align="center"
        width="120"
        label="上课教练">
      </el-table-column>
      <el-table-column
        prop="sureClassTime"
        header-align="center"
        align="center"
        label="销课时间">
      </el-table-column>
      <el-table-column
        prop="operationName"
        header-align="center"
        align="center"
        width="130"
        label="操作人员">
      </el-table-column>
      <el-table-column
        prop="client"
        header-align="center"
        align="center"
        width="150"
        label="销课客户端">
        <template slot-scope="scope">
          <span>{{ scope.row.client | clientFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.customerSureClassId)">修改</el-button>-->
          <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import AddOrUpdate from './customerSureClass-add-or-update'
import {apiSureClassList, apiDeleteSureClassLog, apiExportSureClass} from '../../../api/customerSureClass'

export default {
  data () {
    return {
      dataForm: {
        customerName: '',
        coachName: '',
        operationName: '',
        sureClassTimeStart: '',
        sureClassTimeEnd: '',
        startDate: '2021-06-01',
        endDate: '2021-07-01'
      },
      contractTypeOptions: [{
        value: 'TRAINING_CONTRACT',
        label: '私教'
      }, {
        value: 'VIP_CARD_CONTRACT',
        label: '次卡'
      }],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
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
      apiSureClassList(params).then(({data}) => {
        console.log(data)
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    exportBill () {
      apiExportSureClass(this.dataForm).then(res => {
        if (res.data) {
          let fileName = '销课记录.xls'
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
    },
    // 删除
    deleteHandle (sureClass) {
      this.$confirm(`确定要进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDeleteSureClassLog(sureClass.customerSureClassId).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    }
  }
}
</script>
