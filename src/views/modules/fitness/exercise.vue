<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('button')">
      <el-form-item>
        <el-input v-model="dataForm.exerciseName" placeholder="训练项名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList('button')">查询</el-button>
        <el-button v-if="isAuth('fitness:exercise:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="exerciseId"
        header-align="center"
        align="center"
        label="训练项id">
      </el-table-column>
      <el-table-column
        prop="exerciseName"
        header-align="center"
        align="center"
        label="训练项名称">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="600"
        label="动作组">
        <template slot-scope="scope">
          <div class="exercise-action-set" v-if="scope.row.actionSets">
            <div class="action-set" v-for="actionSet in scope.row.actionSets">
              <div class="action-set-left">
                <span :class="actionSetType[actionSet.actionSetType].activeClass">
                  {{ actionSetType[actionSet.actionSetType].name }}
                </span>
              </div>
              <div class="action-set-right">
                <div class="actions" :class="actionSetType[actionSet.actionSetType].activeClass">
                  <div v-for="(action,actionIndex) in actionSet.actions">
                    <span>{{ action.actionName }}</span>
                    <span v-if="actionIndex!==actionSet.actions.length-1">+</span>
                  </div>
                </div>
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.exerciseId)">修改</el-button>
          <el-button type="text" size="small" class="delete-text"
                     @click="deleteHandle(scope.row.exerciseId,scope.row.exerciseName)">删除
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
import AddOrUpdate from './exercise-add-or-update'
import {apiExerciseList, apiExerciseDelete} from '../../../api/exercise'
import {ActionSetType} from '../../../const/actionSet/actionSetType'

export default {
  data () {
    return {
      dataForm: {
        exerciseName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      actionSetType: ActionSetType
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
        'searchValue': this.dataForm.exerciseName
      }
      apiExerciseList(params).then(({data}) => {
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
    deleteHandle (id, exerciseName) {
      this.$confirm(`确定对 "${exerciseName}" 进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiExerciseDelete(id).then(() => {
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
.exercise-action-set {
  width: 100%;
  height: 100%;
  padding: 4px;

  .action-set {
    width: 90%;
    height: auto;
    display: flex;
    margin: 10px auto;

    .action-set-left {
      width: 120px;
      display: flex;
      justify-content: center;
      align-items: center;

      .type-common {
        color: #eca656;
      }

      .type-super {
        color: #f33a3a;
      }

      .type-reduce {
        color: #2dab5b;
      }
    }

    .action-set-right {
      width: 340px;
      border-radius: 6px;
      height: auto;
      display: flex;
      flex-wrap: wrap;

      .type-common {
        border: 1px solid #eca656;
      }

      .type-super {
        border: 1px solid #f33a3a;
      }

      .type-reduce {
        border: 1px solid #2dab5b
      }

      .actions {
        width: 340px;
        min-height: 40px;
        padding: 0 10px 0 20px;
        border-radius: 6px;
        height: auto;

        div {
          float: left;
          height: 40px;
          line-height: 40px;

          span:nth-child(2) {
            margin: 0 6px;
          }
        }
      }
    }
  }
}
</style>
