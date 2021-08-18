<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.orderNumber" placeholder="订单编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.orderType" clearable placeholder="订单类型">
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.customerName" placeholder="顾客姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.coachName" placeholder="教练姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('generator:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="orderNumber"
        header-align="center"
        align="center"
        width="220"
        label="订单编号">
      </el-table-column>
      <el-table-column
        prop="orderType"
        header-align="center"
        align="center"
        width="120"
        label="订单类型">
        <template slot-scope="scope">
          <div class="order-type">
            <div class="type-item card" v-if="scope.row.orderType==='OPEN_VIP'">会员卡</div>
            <div class="type-item one-class" v-if="scope.row.orderType==='OPEN_CLASS_BY_TOTAL'">私教课</div>
            <div class="type-item one-plan" v-if="scope.row.orderType==='OPEN_CLASS_BY_TRAINING_PLAN'">训练套餐</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        header-align="center"
        align="center"
        width="80"
        label="总价">
        <template slot-scope="scope">
          <span class="total-price">{{ scope.row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="customer.name"
        header-align="center"
        align="center"
        label="顾客姓名">
      </el-table-column>
      <el-table-column
        prop="coach.coachName"
        header-align="center"
        align="center"
        label="教练姓名">
      </el-table-column>
      <el-table-column
        prop="payTime"
        header-align="center"
        align="center"
        width="200"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="payMoney"
        header-align="center"
        align="center"
        width="90"
        label="支付金额">
      </el-table-column>
      <el-table-column
        prop="payWay"
        header-align="center"
        align="center"
        width="90"
        label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay==='ALIPAY'">支付宝</span>
          <span v-if="scope.row.payWay==='WECHAT_PAY'">微信</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundTime"
        header-align="center"
        align="center"
        label="退款时间">
      </el-table-column>
      <el-table-column
        prop="refundMoney"
        header-align="center"
        align="center"
        label="退款金额">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        header-align="center"
        align="center"
        label="订单状态">
        <template slot-scope="scope">
          <div class="order-status">
            <div class="status-item unpaid" v-if="scope.row.orderStatus==='UNPAID'">未支付</div>
            <div class="status-item paid" v-if="scope.row.orderStatus==='PAID'">已支付</div>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.orderId)">详情</el-button>
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
import {apiOrderList} from '../../../api/order'
import AddOrUpdate from './order-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        orderNumber: '',
        orderType: '',
        customerName: '',
        coachName: ''
      },
      orderTypeOptions: [{
        value: 'OPEN_VIP',
        label: '会员卡'
      }, {
        value: 'OPEN_CLASS_BY_TOTAL',
        label: '私教课'
      }, {
        value: 'OPEN_CLASS_BY_TRAINING_PLAN',
        label: '训练套餐'
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
        'orderNumber': this.dataForm.orderNumber,
        'orderType': this.dataForm.orderType,
        'customerName': this.dataForm.customerName,
        'coachName': this.dataForm.coachName
      }
      apiOrderList(params).then(({data}) => {
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
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.order-type {
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

.total-price {
  font-weight: bold;
  color: #c36168;
}

.order-status {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .status-item {
    width: 70px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 8px;
    font-size: 13px;
  }

  .unpaid {
    background-color: #5fafcf;
    color: #fff;
  }

  .paid {
    background-color: #86bc6d;
    color: #fff;
  }
}
</style>
