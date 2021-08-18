<template>
  <el-dialog
    :title="!dataForm.partnerId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="120px">
      <el-form-item label="合作伙伴名称" prop="partnerName">
        <el-input v-model="dataForm.partnerName" placeholder="合作伙伴名称"></el-input>
      </el-form-item>
      <el-form-item label="老板名称" prop="bossName">
        <el-input v-model="dataForm.bossName" placeholder="老板名称"></el-input>
      </el-form-item>
      <el-form-item label="老板电话" prop="bossMobile">
        <el-input v-model="dataForm.bossMobile" placeholder="老板电话"></el-input>
      </el-form-item>
      <el-form-item label="健身房列表">
        <div class="gym-list">
          <div class="gym-item" v-for="(gym,gymIndex) in dataForm.gyms">
            <div class="gym-image">
              <img :src="gym.gymImageUrl" alt="" v-if="gym.gymImageUrl">
              <img src="~@/assets/img/partner/gym-default.png" alt="" v-if="!gym.gymImageUrl">
            </div>
            <div class="gym-name">
              {{ gym.gymName }}
            </div>
            <div class="delete-button" @click="deleteGym(gymIndex)">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="add-button" @click="showGymsDialog()">+</div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <gym-dialog
      :gymList="gymList"
      :gymDialogFlag.sync="gymDialogFlag"
      @selectOneGym="selectOneGym"
      style="z-index: 4000"
      v-if="gymDialogFlag">
    </gym-dialog>
  </el-dialog>
</template>

<script>
import {apiPartnerDetail, apiPartnerSave, apiPartnerUpdate} from '../../../api/patner'
import GymDialog from '../../dialog/GymDialog'
import {apiGymList} from '../../../api/gym'

export default {
  components: {GymDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        partnerId: 0,
        partnerName: '',
        bossName: '',
        bossMobile: '',
        gyms: []
      },
      dataRule: {
        partnerName: [
          {required: true, message: '合作伙伴名称不能为空', trigger: 'blur'}
        ],
        bossName: [
          {required: true, message: '老板名称不能为空', trigger: 'blur'}
        ],
        bossMobile: [
          {required: false, message: '老板电话不能为空', trigger: 'blur'}
        ]
      },
      gymList: [],
      gymDialogFlag: false
    }
  },
  created () {
    console.log(this.dataForm)
  },
  methods: {
    init (id) {
      this.dataForm.partnerId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.partnerId) {
          apiPartnerDetail(this.dataForm.partnerId).then(({data}) => {
            this.dataForm = data.data
          })
        }
        apiGymList({limit: 100}).then(({data}) => {
          this.gymList = data.data.list
        })
      })
    },
    deleteGym (gymIndex) {
      this.dataForm.gyms.splice(gymIndex, 1)
    },
    showGymsDialog () {
      this.gymDialogFlag = true
    },
    selectOneGym (gymIndex) {
      console.log(gymIndex)
      // 检查选择的gym是否已经在partner的gyms中
      let temp = this.gymList[gymIndex]
      let flag = false
      this.dataForm.gyms.forEach((gym) => {
        if (gym.gymId === temp.gymId) {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          message: '该健身房已经存在合作伙伴中',
          type: 'warning'
        })
      } else {
        this.dataForm.gyms.push(temp)
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.partnerId) {
            // 修改
            apiPartnerUpdate(this.dataForm).then(({data}) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }).catch(({data}) => {
              this.$message.error(data.msg)
            })
          } else {
            // 新增
            apiPartnerSave(this.dataForm).then(() => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }).catch(({data}) => {
              this.$message.error(data.msg)
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.gym-item {
  width: 160px;
  height: 160px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  margin-bottom: 20px;
  float: left;
  margin-right: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .gym-image {
    width: 140px;
    height: 110px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    overflow: hidden;
    margin-top: 6px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .gym-name {
    height: 20px;
    width: 100%;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    margin-top: 8px;
  }

  .delete-button {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 60%;
      height: 60%;
    }
  }
}

.add-button {
  width: 160px;
  height: 160px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  margin-bottom: 20px;
  float: left;
  margin-right: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 300;
  color: #999;
}
</style>
