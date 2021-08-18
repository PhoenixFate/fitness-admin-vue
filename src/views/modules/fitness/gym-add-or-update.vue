<template>
  <el-dialog
    :title="!dataForm.gymId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="160px">
      <el-form-item label="健身房名称" prop="gymName">
        <el-input v-model="dataForm.gymName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="健身房店面照片" prop="gymImageUrl">
        <div class="gym-image">
          <div class="gym-image-content" v-if="dataForm.gymImageUrl">
            <img :src="dataForm.gymImageUrl" alt="">
            <div class="delete-button" @click="deletePartnerImage">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="gym-image-empty" v-if="!dataForm.gymImageUrl" @click="toUploadImage">+</div>
        </div>
      </el-form-item>
      <el-form-item label="所在城市" prop="city">
        <el-input v-model="dataForm.city" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="dataForm.address" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="合作伙伴" prop="partnerId">
        <div class="partner-card" v-if="dataForm.partner">
          <div class="partner-name">
            {{ dataForm.partner.partnerName }}
          </div>
          <div class="partner-boss">
            <img src="~@/assets/img/gym/boss.png" alt="">
            <span>{{ dataForm.partner.bossName }}</span>
          </div>
          <div class="partner-mobile">
            <img src="~@/assets/img/gym/mobile.png" alt="">
            <span>{{ dataForm.partner.bossMobile }}</span>
          </div>
          <div class="delete-button" @click="deletePartner">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="partner-empty" v-if="!dataForm.partner" @click="showPartnersDialog()">
          +
        </div>
      </el-form-item>
      <el-form-item label="所有教练">
        <div class="gym-coach" v-for="(coach,coachIndex) in dataForm.coaches">
          <img :src="coach.avatar" alt="" v-if="coach.avatar">
          <img src="~@/assets/img/coach/coach-avatar-male.png" alt="" v-if="!coach.avatar && coach.gender===1">
          <img src="~@/assets/img/coach/coach-avatar-female.png" alt="" v-if="!coach.avatar && coach.gender===2">
          <h6>{{ coach.coachName }}</h6>
          <div class="delete-button" @click="deleteCoach(coachIndex)">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="gym-coach-empty" @click="showCoachesDialog">
          +
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
    <partner-dialog
      :partnerList="partnerList"
      :partnerDialogFlag.sync="partnerDialogFlag"
      @selectOnePartner="selectOnePartner"
      style="z-index: 4000"
      v-if="partnerDialogFlag">
    </partner-dialog>
    <coach-dialog
      :coach-list="coachList"
      :coach-dialog-flag.sync="coachDialogFlag"
      @selectOneCoach="selectOneCoach"
      style="z-index: 4000"
      v-if="coachDialogFlag">
    </coach-dialog>
  </el-dialog>
</template>

<script>
import {apiGymDetail, apiGymSave, apiGymUpdate} from '../../../api/gym'
import {apiPartnerList} from '../../../api/patner'
import {apiUploadImage} from '../../../api/upload'
import PartnerDialog from '../../dialog/PartnerDialog'
import {apiCoachList} from '../../../api/coach'
import CoachDialog from '../../dialog/CoachDialog'

export default {
  components: {PartnerDialog, CoachDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        gymId: 0,
        gymName: '',
        gymImageUrl: '',
        city: '',
        address: '',
        partner: undefined,
        coaches: []
      },
      dataRule: {
        gymName: [
          {required: true, message: '健身房名称不能为空', trigger: 'blur'}
        ],
        gymImageUrl: [
          {required: false, message: '健身房店面照片不能为空', trigger: 'blur'}
        ],
        city: [
          {required: false, message: '城市不能为空', trigger: 'blur'}
        ],
        address: [
          {required: false, message: '详细地址不能为空', trigger: 'blur'}
        ]
      },
      partnerList: [],
      partnerDialogFlag: false,
      coachList: [],
      coachDialogFlag: false
    }
  },
  methods: {
    init (id) {
      this.dataForm.gymId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.gymId) {
          apiGymDetail(this.dataForm.gymId).then(({data}) => {
            this.dataForm = data.data
          })
        }
        apiPartnerList({limit: 100}).then(({data}) => {
          this.partnerList = data.data.list
        })
        apiCoachList({limit: 100}).then(({data}) => {
          this.coachList = data.data.list
        })
      })
    },
    deletePartner () {
      this.dataForm.partner = undefined
    },
    deletePartnerImage () {
      this.dataForm.gymImageUrl = ''
    },
    deleteCoach (coachIndex) {
      this.dataForm.coaches.splice(coachIndex, 1)
    },
    showPartnersDialog () {
      this.partnerDialogFlag = true
    },
    selectOnePartner (partnerIndex) {
      this.dataForm.partner = this.partnerList[partnerIndex]
    },
    toUploadImage () {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click()
    },
    // 点击上传图片
    readLocalFile () {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'gym') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.gymImageUrl = res.data.data
      })
    },
    showCoachesDialog () {
      this.coachDialogFlag = true
    },
    selectOneCoach (coachIndex) {
      console.log(coachIndex)
      console.log(this.coachList[coachIndex])
      console.log(this.dataForm)
      // 检查选择的coach是否已经在gym的coaches中
      let temp = this.coachList[coachIndex]
      let flag = false
      if (this.dataForm.coaches) {
        this.dataForm.coaches.forEach((coach) => {
          if (coach.coachId === temp.coachId) {
            flag = true
          }
        })
      }
      if (flag) {
        this.$message({
          message: '该健身房中已经存在该教练',
          type: 'warning'
        })
      } else {
        this.dataForm.coaches.push(temp)
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.gymId) {
            // 修改
            apiGymUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiGymSave(this.dataForm).then(() => {
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
.gym-image {
  width: 200px;
  height: 130px;
  position: relative;

  .gym-image-content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e5b05c;

    > img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
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

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .gym-image-empty {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #999;
    font-size: 30px;
    font-weight: 300;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 8px;
  }
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

  img {
    width: 20px;
    height: 20px;
  }
}

.partner-card {
  width: 320px;
  height: 200px;
  background-image: url("../../../assets/img/gym/partner-background.png");
  background-size: 100% 100%;
  box-shadow: 0 0 6px #999;
  border-radius: 6px;
  position: relative;

  .partner-name {
    position: absolute;
    left: 10px;
    top: 20px;
    width: 170px;
    height: 30px;
    font-size: 18px;
    line-height: 24px;
    font-weight: bold;
    color: #e4d29a;
  }

  .partner-boss, .partner-mobile {
    position: absolute;
    left: 190px;
    width: 100px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }

    span {
      color: #e5b05c;
    }
  }

  .partner-boss {
    top: 80px;
  }

  .partner-mobile {
    top: 110px;
  }
}

.partner-empty {
  width: 180px;
  height: 120px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 300;
  color: #999;
  padding-bottom: 10px;
}

.gym-coach {
  width: 100px;
  height: 120px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  > img {
    width: 70px;
    height: 70px;
    margin-top: 8px;
    border-radius: 50%;
  }

  h6 {
    font-size: 14px;
  }
}

.gym-coach-empty {
  width: 100px;
  height: 120px;
  border-radius: 6px;
  box-shadow: 0 0 4px #999;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 300;
  color: #999;
  padding-bottom: 4px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
