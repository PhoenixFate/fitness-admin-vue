<template>
  <div class="mod-config">
    <el-form :inline="true" :model="queryData" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="queryData.customerName" placeholder="顾客姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.trainerId" clearable placeholder="上课教练">
          <el-option v-for="item in coaches" :key="item.coachId" :label="item.coachName" :value="item.coachId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="queryData.startAt" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="queryData.endAt" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <!-- <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="data" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="customer.name" header-align="center" align="center" label="会员姓名"></el-table-column>
      <el-table-column prop="coach.coachName" header-align="center" align="center" label="教练姓名"></el-table-column>
      <el-table-column prop="checkinTime" header-align="center" align="center" label="打卡时间"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
import {apiCoachList} from '../../../api/coach'
import {apiVipClassCheckin} from '../../../api/customer'
import pageTableMixin from './page-table-mixin'

export default {
  name: 'VipCheckin',
  mixins: [pageTableMixin],
  data () {
    return {
      queryData: {
        customerName: '',
        trainerName: null,
        startAt: null,
        endAt: null,
        trainerId: null
      },
      coaches: []
    }
  },
  methods: {
    getDataList (origin) {
      if (origin === 'button') {
        this.pageIndex = 1
      }
      console.log('query param', this.queryData)
      this.dataListLoading = true
      apiVipClassCheckin(
        this.queryData.customerName,
        this.queryData.trainderId,
        this.queryData.startAt,
        this.queryData.endAt,
        this.pageIndex,
        this.pageSize
      ).then(({data}) => {
        this.dataListLoading = false
        console.log('res data', data)
        this.data = data.data.records
      })
    },
    loadCoach () {
      apiCoachList({limit: 1000}).then(({data}) => {
        this.coaches = data.data.list
      })
    }
  },
  mounted () {
    this.loadCoach()
    this.getDataList()
  }
}
</script>

<style></style>
