<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.targetName" placeholder="目标名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.targetType" clearable placeholder="目标类型">
          <el-option
            v-for="item in targetTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.targetPeriodType" clearable placeholder="目标周期">
          <el-option
            v-for="item in targetPeriodTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:target:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="targetId"
        header-align="center"
        align="center"
        width="100"
        label="id">
      </el-table-column>
      <el-table-column
        prop="targetName"
        header-align="center"
        align="center"
        label="目标名称">
      </el-table-column>
      <el-table-column
        prop="targetDescription"
        header-align="center"
        align="center"
        label="目标描述">
        <template slot-scope="scope">
          <div class="action-description">
            {{ scope.row.targetDescription }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="targetType"
        header-align="center"
        align="center"
        label="目标分类">
        <template slot-scope="scope">
          <div class="target-type">
            <div class="type-item card" v-if="scope.row.targetType==='NEW_CUSTOMER'">新增顾客人数</div>
            <div class="type-item one-class" v-if="scope.row.targetType==='NEW_VIP'">新增会员人数</div>
            <div class="type-item one-plan" v-if="scope.row.targetType==='SALE_MONEY'">销售金额</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="detailNumber"
        header-align="center"
        align="center"
        label="具体的指标">
      </el-table-column>
      <el-table-column
        prop="targetPeriodType"
        header-align="center"
        align="center"
        width="140"
        label="目标周期">
        <template slot-scope="scope">
          <div class="unit">
            <div class="unit-second" v-if="scope.row.targetPeriodType==='DAT_TARGET'">
              <span>日</span>
            </div>
            <div class="unit-set" v-if="scope.row.targetPeriodType==='WEEK_TARGET'">
              <span>周</span>
            </div>
            <div class="unit-meter" v-if="scope.row.targetPeriodType==='MONTH_TARGET'">
              <span>月</span>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.targetId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.targetId,scope.row.targetName)">删除
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
import {apiTargetList, apiTargetDelete} from '../../../api/target'
import AddOrUpdate from './target-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        targetName: '',
        targetType: '',
        targetPeriodType: ''
      },
      targetTypeOptions: [{
        value: 'NEW_CUSTOMER',
        label: '新增顾客数量'
      }, {
        value: 'NEW_VIP',
        label: '新增会员数量'
      }, {
        value: 'SALE_MONEY',
        label: '销售金额'
      }],
      targetPeriodTypeOptions: [{
        value: 'DAT_TARGET',
        label: '日计划'
      }, {
        value: 'WEEK_TARGET',
        label: '周计划'
      }, {
        value: 'MONTH_TARGET',
        label: '月计划'
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
      let params = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        'targetName': this.dataForm.targetName,
        targetType: this.dataForm.targetType,
        targetPeriodType: this.dataForm.targetPeriodType
      }
      apiTargetList(params).then(({data}) => {
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
    deleteHandle (id, targetName) {
      this.$confirm(`确定对 '${targetName}' 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiTargetDelete(id).then(() => {
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
.target-type {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .type-item {
    width: 100px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #999;
    border-radius: 6px;
  }

  .card {
    border: 1px solid #f3cc06;
  }

  .one-class {
    border: 1px solid #34dede;
  }

  .one-plan {
    border: 1px solid #89cd67;
  }
}

.unit {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .unit-second, .unit-set, .unit-meter {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .unit-second {
    background-color: #3dcfcf;
  }

  .unit-set {
    background-color: #d97721;
  }

  .unit-meter {
    background-color: #1bbf5d;
  }
}

.action-description {
  text-indent: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 4; //显示的行
  text-align: left;
}

</style>
