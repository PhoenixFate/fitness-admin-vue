<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.vipCardName" placeholder="会员卡名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:vipcard:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="vipCardId"
        header-align="center"
        align="center"
        width="80"
        label="会员卡id">
      </el-table-column>
      <el-table-column
        prop="vipCardBigType"
        header-align="center"
        align="center"
        width="140"
        label="会员卡类型">
        <template slot-scope="scope">
          <div class="unit">
            <div class="unit-second" v-if="scope.row.vipCardBigType==='DURATION_CARD'">
              <span>阶段卡</span>
            </div>
            <div class="unit-set" v-if="scope.row.vipCardBigType==='COUNT_CARD'">
              <span>次卡</span>
            </div>
            <div class="unit-meter" v-if="scope.row.unit==='METER'">
              <span>米</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="vipCardType"
        header-align="center"
        align="center"
        width="140"
        label="阶段类型">
        <template slot-scope="scope">
          <div class="vip-card-type">
            <div class="type-item week" v-if="scope.row.vipCardType==='WEEK_CARD'">周卡</div>
            <div class="type-item month" v-if="scope.row.vipCardType==='MONTH_CARD'">月卡</div>
            <div class="type-item season" v-if="scope.row.vipCardType==='SEASON_CARD'">季卡</div>
            <div class="type-item half-year" v-if="scope.row.vipCardType==='HALF_YEAR_CARD'">半年卡</div>
            <div class="type-item three-season" v-if="scope.row.vipCardType==='THREE_SEASON_CARD'">三季度卡</div>
            <div class="type-item year" v-if="scope.row.vipCardType==='YEAR_CARD'">年卡</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="vipCardName"
        header-align="center"
        align="center"
        width="180"
        label="会员卡名称">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
      </el-table-column>
      <!--      <el-table-column-->
      <!--        prop="favorablePrice"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        label="优惠价">-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="addVipDays"
        header-align="center"
        align="center"
        width="180"
        label="添加vip天数">
      </el-table-column>
      <el-table-column
        prop="addVipDaysFemale"
        header-align="center"
        align="center"
        width="180"
        label="添加vip天数-女">
      </el-table-column>
      <el-table-column
        prop="useCount"
        header-align="center"
        align="center"
        label="可用次数">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.vipCardId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.vipCardId,scope.row.vipCardName)">删除
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
import {apiVipCardList, apiVipCardDelete} from '../../../api/vipCard'
import AddOrUpdate from './vipcard-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        vipCardName: ''
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
        'vipCardName': this.dataForm.vipCardName
      }
      apiVipCardList(params).then(({data}) => {
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
    deleteHandle (id, vipCardName) {
      this.$confirm(`确定对 "${vipCardName}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiVipCardDelete(id).then(() => {
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
.vip-card-type {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .type-item {
    width: 80px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
  }

  .week {
    background-color: #d9fae4;
    color: #688c75;
  }

  .month {
    background-color: #cf9f90;
    color: #80382a;
  }

  .season {
    background-color: #bcc5d0;
    color: #506783;
  }

  .half-year {
    background-color: #f5d17e;
    color: #bc9214;
  }

  .three-season {
    background-color: #f1b682;
    color: #e36c05;
  }

  .year {
    background-color: #000;
    color: #eebb76;
  }
}

.unit {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .unit-second, .unit-set {
    width: 60px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .unit-second {
    background-color: #a8d245;
  }

  .unit-set {
    background-color: #dbc037;
  }

}
</style>
