<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.salesmanName" placeholder="销售姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:salesman:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="salesmanId"
        header-align="center"
        align="center"
        label="销售人员id">
      </el-table-column>
      <el-table-column
        prop="salesmanName"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
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
        prop="birthday"
        header-align="center"
        align="center"
        label="出生年月">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.salesmanId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.salesmanId,scope.row.salesmanName)">删除
          </el-button>
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
import AddOrUpdate from './salesman-add-or-update'
import {apiSalesmanList, apiSalesmanDelete} from '../../../api/salesman'

export default {
  data () {
    return {
      dataForm: {
        salesmanName: ''
      },
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
  created () {
    console.log(this.$store.state.user)
  },
  methods: {
    // 获取数据列表
    getDataList (origin) {
      if (origin === 'button') {
        this.pageIndex = 1
      }
      this.dataListLoading = true
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        salesmanName: this.salesmanName
      }
      apiSalesmanList(params).then(({data}) => {
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
      }).finally(() => {
        this.dataListLoading = false
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
    deleteHandle (id, salesmanName) {
      this.$confirm(`确定对 ${salesmanName} 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiSalesmanDelete(id).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {
        })
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
</style>
