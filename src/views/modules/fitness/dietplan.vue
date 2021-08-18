<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.dietPlanName" placeholder="饮食计划名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:dietplan:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="dietPlanId"
        header-align="center"
        align="center"
        width="60"
        label="id">
      </el-table-column>
      <el-table-column
        prop="dietPlanName"
        header-align="center"
        align="center"
        width="200"
        label="饮食计划名称">
      </el-table-column>
      <el-table-column
        prop="dietPlanDescription"
        header-align="center"
        align="left"
        min-width="240"
        label="饮食计划介绍">
        <template slot-scope="scope">
          <div class="diet-plan-description">
            {{ scope.row.dietPlanDescription }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="700"
        label="饮食计划安排">
        <template slot-scope="scope">
          <div class="diet-plan-items">
            <div class="diet-plan-item" v-for="item in scope.row.dietPlanItems">
              <div class="meal-type">{{ item.mealType.mealTypeName }}</div>
              <div class="nutrition">
                <span>热量: {{ item.hot }}</span>
                <span>脂肪: {{ item.fat }}</span>
                <span>碳水: {{ item.carbon }}</span>
                <span>蛋白质: {{ item.protein }}</span>
              </div>
              <div class="food">
                <strong>推荐餐食</strong>
                <span v-if="item.healthyMeal">{{ item.healthyMeal.healthyMealName }}</span>
                <span v-if="!item.healthyMeal">暂无</span>
              </div>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.dietPlanId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.dietPlanId,scope.row.dietPlanName)">删除
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
import {apiDietPlanList, apiDietPlanDelete} from '../../../api/dietPlan'
import AddOrUpdate from './dietplan-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        dietPlanName: ''
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
        'searchValue': this.dataForm.dietPlanName
      }
      apiDietPlanList(params).then(({data}) => {
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
    },
    // 删除
    deleteHandle (id, dietPlanName) {
      this.$confirm(`确定对 "${dietPlanName}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDietPlanDelete(id).then(() => {
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
.diet-plan-description {
  text-indent: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 4; //显示的行
}

.diet-plan-items {
  width: 100%;
  height: auto;

  .diet-plan-item {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .meal-type {
      width: 100px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-weight: bold;
      font-size: 16px;
      height: 30px;
    }

    .nutrition {
      width: 300px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      span {
        margin-right: 8px;
        width: 24%;
        display: flex;
      }

      span:nth-child(1) {
        width: 30%;
      }

      span:nth-child(4) {
        width: 30%;
      }
    }

    .food {
      width: 240px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      strong {
        width: 80px;
        font-size: 14px;
      }
    }
  }
}
</style>
