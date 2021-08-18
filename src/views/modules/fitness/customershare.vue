<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.customerName" placeholder="顾客姓名" clearable></el-input>
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
        prop="customerShareId"
        header-align="center"
        align="center"
        label="id">
      </el-table-column>
      <el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        width="110"
        label="头像">
        <template slot-scope="scope">
          <div class="avatar">
            <img :src="scope.row.customerAvatar"
                 v-if="scope.row.customerAvatar">
            <img src="~@/assets/img/customer/avatar-male.png"
                 v-if="!scope.row.customerAvatar && scope.row.gender===1">
            <img src="~@/assets/img/customer/avatar-female.png"
                 v-if="!scope.row.customerAvatar && scope.row.gender===2">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerName"
        header-align="center"
        align="center"
        label="顾客姓名">
      </el-table-column>
      <el-table-column
        prop="shareText"
        header-align="center"
        align="center"
        label="分享的内容">
      </el-table-column>
      <el-table-column
        prop="shareTime"
        header-align="center"
        align="center"
        label="分享的时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="分享的照片">
        <template slot-scope="scope">
          <span v-if="scope.row.customerShareImages && scope.row.customerShareImages.length>0">
            {{ scope.row.customerShareImages.length }}张
          </span>
          <span v-if="!scope.row.customerShareImages ||scope.row.customerShareImages.length===0">
            0张
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.customerShareId)">详情</el-button>
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
import AddOrUpdate from './customershare-add-or-update'
import {apiCustomerShareList} from '../../../api/customerShare'

export default {
  data () {
    return {
      dataForm: {
        customerName: ''
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
        'customerName': this.dataForm.customerName
      }
      apiCustomerShareList(params).then(({data}) => {
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
        console.log(this.dataList)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid #f8ba33;
  }
}

</style>
