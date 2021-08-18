<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.searchValue" placeholder="训练计划名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:trainingplan:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="trainingPlanId"
        header-align="center"
        align="center"
        width="120"
        label="训练计划id">
      </el-table-column>
      <el-table-column
        prop="trainingPlanName"
        header-align="center"
        align="center"
        label="训练计划名称">
      </el-table-column>
      <el-table-column
        prop="trainingPlanCoverImage"
        header-align="center"
        align="center"
        label="封面照片">
        <template slot-scope="scope">
          <img style="width:180px;height:130px;border:none; border-radius: 4px" :src="scope.row.trainingPlanCoverImage"
               v-if="scope.row.trainingPlanCoverImage">
        </template>
      </el-table-column>
      <el-table-column
        prop="goalName"
        header-align="center"
        align="center"
        width="150"
        label="计划目标">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        width="150"
        label="计划价格">
      </el-table-column>
      <el-table-column
        prop="trainingPlanDescription"
        header-align="center"
        align="center"
        label="计划描述信息">
        <template slot-scope="scope">
          <div class="training-plan-description">
            {{ scope.row.trainingPlanDescription }}
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.trainingPlanId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.trainingPlanId,scope.row.trainingPlanName)">删除
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
import {apiTrainingPlanList, apiTrainingPlanDelete} from '../../../api/trainingPlan'
import AddOrUpdate from './trainingplan-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        searchValue: ''
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
        'searchValue': this.dataForm.searchValue
      }
      apiTrainingPlanList(params).then(({data}) => {
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
    deleteHandle (id, trainingPlanName) {
      this.$confirm(`确定对 "${trainingPlanName}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiTrainingPlanDelete(id).then(() => {
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
<style lang="scss" scoped>
.training-plan-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 5; //显示的行
}
</style>
