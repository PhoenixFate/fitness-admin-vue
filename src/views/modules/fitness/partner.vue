<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.partnerName" placeholder="合作伙伴名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:partner:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="partnerId"
        header-align="center"
        align="center"
        label="合作伙伴id"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="partnerName"
        header-align="center"
        align="center"
        label="合作伙伴名称"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="bossName"
        header-align="center"
        align="center"
        label="老板名称">
      </el-table-column>
      <el-table-column
        prop="bossMobile"
        header-align="center"
        align="center"
        label="老板电话">
      </el-table-column>
      <el-table-column
        prop="gymCount"
        header-align="center"
        align="center"
        label="健身房数量">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.partnerId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.partnerId,scope.row.partnerName)">删除
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
import AddOrUpdate from './partner-add-or-update'
import {apiPartnerList, apiPartnerDelete} from '../../../api/patner'

export default {
  data () {
    return {
      dataForm: {
        partnerName: ''
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
        'partnerName': this.dataForm.partnerName
      }
      apiPartnerList(params).then(({data}) => {
        console.log(data.data.list)
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
      }).catch(() => {
        this.dataList = []
        this.totalPage = 0
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
    deleteHandle (id, partnerName) {
      this.$confirm(`确定对${partnerName}进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiPartnerDelete(id).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch((res) => {
          console.log(res)
          // this.$message.error(data.msg)
        })
      }).catch(() => {
        // 取消
      })
    }
  }
}
</script>
