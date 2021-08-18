<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.coachName" placeholder="教练姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.gender" clearable placeholder="请选择性别">
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.gymId" clearable placeholder="请选择健身房">
          <el-option
            v-for="item in gymOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:coach:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="coachId"
        header-align="center"
        align="center"
        width="80"
        label="教练id">
      </el-table-column>
      <el-table-column
        prop="coachName"
        header-align="center"
        align="center"
        width="120"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        width="120"
        label="头像">
        <template slot-scope="scope">
          <div class="avatar">
            <img :src="scope.row.avatar"
                 v-if="scope.row.avatar">
            <img src="~@/assets/img/coach/coach-avatar-male.png"
                 v-if="!scope.row.avatar && scope.row.gender===1">
            <img src="~@/assets/img/coach/coach-avatar-female.png"
                 v-if="!scope.row.avatar && scope.row.gender===2">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="120"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        width="130"
        label="账号名">
      </el-table-column>
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
        width="60"
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
        prop="perClassPrice"
        header-align="center"
        align="center"
        width="90"
        label="单课价格">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="identityCard"
        header-align="center"
        align="center"
        label="身份证">
      </el-table-column>
      <el-table-column
        prop="birthday"
        header-align="center"
        align="center"
        label="生日">
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.coachId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.coachId,scope.row.coachName)">注销
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
import {apiCoachList, apiCoachDelete} from '../../../api/coach'
import AddOrUpdate from './coach-add-or-update'
import {apiGymList} from '../../../api/gym'

export default {
  data () {
    return {
      dataForm: {
        coachName: '',
        mobile: '',
        gender: '',
        gymId: ''
      },
      genderOptions: [{
        value: '1',
        label: '男'
      }, {
        value: '2',
        label: '女'
      }],
      gymOptions: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      gymList: []
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
      apiCoachList(params).then(({data}) => {
        console.log(data)
        this.dataList = data.data.list
        this.totalPage = data.data.totalCount
      }).finally(() => {
        this.dataListLoading = false
      })
      apiGymList({limit: 100}).then(({data}) => {
        console.log(data)
        let gymOptions = []
        data.data.list.forEach((gym) => {
          let gymOption = {
            value: gym.gymId,
            label: gym.gymName
          }
          gymOptions.push(gymOption)
        })
        this.gymOptions = gymOptions
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
    deleteHandle (id, coachName) {
      this.$confirm(`确定对 "${coachName}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiCoachDelete(id).then(() => {
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

.avatar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}


</style>
