<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.actionName" placeholder="动作名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.actionTypeId" clearable placeholder="动作分类">
          <el-option
            v-for="item in actionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.containWeight" clearable placeholder="是否包含重量">
          <el-option
            v-for="item in weightOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.unit" clearable placeholder="训练单位">
          <el-option
            v-for="item in unitOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:action:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="actionId"
        header-align="center"
        align="center"
        width="80"
        label="动作id">
      </el-table-column>
      <el-table-column
        prop="actionName"
        header-align="center"
        align="center"
        label="动作名称">
      </el-table-column>
      <el-table-column
        prop="actionType"
        header-align="center"
        align="center"
        width="130"
        label="动作分类">
        <template slot-scope="scope">
          <img style="width:80px;height:80px;border:none; border-radius: 50%"
               :src="scope.row.actionType.actionTypeImageUrl"
               v-if="scope.row.actionType.actionTypeImageUrl">
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="使用设备">
        <template slot-scope="scope">
          <span v-for="(equipment,equipmentIndex) in scope.row.equipments">
            <span>{{ equipment.equipmentName }}</span>
            <span v-if="equipmentIndex!==(scope.row.equipments.length-1)">、</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actionDescription"
        header-align="center"
        align="left"
        label="动作描述">
        <template slot-scope="scope">
          <div class="action-description">
            {{ scope.row.actionDescription }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="containWeight"
        header-align="center"
        align="center"
        width="120"
        label="是否包含重量">
        <template slot-scope="scope">
          <div class="action-contain-weight">
            <div class="yes" v-if="scope.row.containWeight===1">是</div>
            <div class="no" v-if="scope.row.containWeight===0">否</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        width="120"
        label="训练单位">
        <template slot-scope="scope">
          <div class="unit">
            <div class="unit-second" v-if="scope.row.unit==='SECOND'">
              <span>秒</span>
            </div>
            <div class="unit-set" v-if="scope.row.unit==='SET'">
              <span>组</span>
            </div>
            <div class="unit-meter" v-if="scope.row.unit==='METER'">
              <span>米</span>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.actionId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.actionId, scope.row.actionName)">删除
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
import {apiActionList, apiActionDelete} from '../../../api/action'
import AddOrUpdate from './action-add-or-update'
import {apiActionTypeList} from '../../../api/actionType'

export default {
  data () {
    return {
      dataForm: {
        actionName: '',
        actionTypeId: '',
        containWeight: '',
        unit: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      actionTypeOptions: [],
      weightOptions: [{
        value: '0',
        label: '否'
      }, {
        value: '1',
        label: '是'
      }],
      unitOptions: [{
        value: 'SET',
        label: '组'
      }, {
        value: 'SECOND',
        label: '秒'
      }, {
        value: 'METER',
        label: '米'
      }]
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
      apiActionList(params).then(({data}) => {
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
        console.log(this.dataList)
      }).catch(() => {
        this.dataList = []
        this.totalPage = 0
      }).finally(() => {
        this.dataListLoading = false
      })
      apiActionTypeList({limit: 100}).then(({data}) => {
        this.actionTypeOptions = []
        if (data.data.list && data.data.list.length > 0) {
          data.data.list.forEach((actionType) => {
            let option = {
              value: actionType.actionTypeId,
              label: actionType.actionTypeName
            }
            this.actionTypeOptions.push(option)
          })
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
    deleteHandle (id, actionName) {
      this.$confirm(`确定对 "${actionName}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiActionDelete(id).then(() => {
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
.action-description {
  text-indent: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 4; //显示的行
}

.action-contain-weight {

  display: flex;
  justify-content: center;
  align-items: center;

  .yes, .no {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }

  .yes {
    background-color: #59b588;
  }

  .no {
    background-color: #ec9224;
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
    background-color: #a8d245;
  }

  .unit-meter {
    background-color: #dbc037;
  }
}
</style>
