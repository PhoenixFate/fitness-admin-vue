<template>
  <el-dialog
    :title="!dataForm.coachId ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="姓名" prop="coachName">
        <el-input v-model="dataForm.coachName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <div class="avatar" v-if="dataForm.avatar">
          <img :src="dataForm.avatar" alt="">
          <div class="delete-button" @click="deleteAvatar">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="avatar-empty" v-if="!dataForm.avatar" @click="toUploadImage">
          +
        </div>
        <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="dataForm.gender" label="1">男</el-radio>
        <el-radio v-model="dataForm.gender" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="账号名" prop="username">
        <el-input v-model="dataForm.username" placeholder="请输入账号名" v-if="!dataForm.coachId"></el-input>
        <el-input v-model="dataForm.username" v-if="dataForm.coachId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单课价格" prop="perClassPrice">
        <el-input v-model="dataForm.perClassPrice" placeholder="请输入单课价格" type="number"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="identityCard">
        <el-input v-model="dataForm.identityCard" placeholder="请输入身份证号"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="dataForm.birthday"
          type="date"
          placeholder="选择出生年月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="健身房列表">
        <div class="gym-list" v-if="dataForm.gyms">
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
import {apiCoachDetail, apiCoachSave, apiCoachUpdate} from '../../../api/coach'
import {apiUploadImage} from '../../../api/upload'
import GymDialog from '../../dialog/GymDialog'
import {apiGymList} from '../../../api/gym'

export default {
  components: {GymDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        coachId: 0,
        coachName: '',
        mobile: '',
        username: '',
        password: '',
        gender: '1',
        email: '',
        identityCard: '',
        birthday: '',
        avatar: '',
        perClassPrice: '',
        gyms: []
      },
      dataRule: {
        coachName: [
          {required: true, message: '教练姓名不能为空', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '账号名不能为空', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ],
        perClassPrice: [
          {required: true, message: '课程单价不能为空', trigger: 'blur'}
        ]
      },
      gymList: [],
      gymDialogFlag: false
    }
  },
  methods: {
    init (id) {
      this.dataForm.coachId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.coachId) {
          apiCoachDetail(this.dataForm.coachId).then(({data}) => {
            this.dataForm = data.data
            if (this.dataForm.gender) {
              this.dataForm.gender += ''
            }
          })
        }
        apiGymList({limit: 100}).then(({data}) => {
          this.gymList = data.data.list
        })
      })
    },
    closeDialog () {
      this.dataForm = {
        coachId: 0,
        coachName: '',
        mobile: '',
        username: '',
        password: '',
        gender: '1',
        email: '',
        identityCard: '',
        birthday: '',
        avatar: '',
        perClassPrice: '',
        gyms: []
      }
    },
    deleteGym (gymIndex) {
      this.dataForm.gyms.splice(gymIndex, 1)
    },
    showGymsDialog () {
      this.gymDialogFlag = true
    },
    deleteAvatar () {
      this.dataForm.avatar = null
    },
    toUploadImage () {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click()
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
          message: '该教练已经在该健身房中',
          type: 'warning'
        })
      } else {
        this.dataForm.gyms.push(temp)
      }
    },
    // 点击上传图片
    readLocalFile () {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'coach') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.avatar = res.data.data
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.coachId) {
            // 修改
            apiCoachUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiCoachSave(this.dataForm).then(() => {
              this.saveFinish()
            })
          }
        }
      })
    },
    saveFinish () {
      this.$message({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.visible = false
          this.$emit('refreshDataList')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  width: 100px;
  height: 100px;
  position: relative;

  > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .delete-button {
    position: absolute;
    right: -16px;
    top: -16px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      width: 20px;
      height: 20px;
    }
  }
}

.avatar-empty {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid #bbb;
  color: #bbb;
  font-size: 30px;
  font-weight: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 6px;
}

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
