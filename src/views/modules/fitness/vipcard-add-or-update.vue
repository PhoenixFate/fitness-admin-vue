<template>
  <el-dialog
    :title="!dataForm.vipCardId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="会员卡名称" prop="vipCardName">
        <el-input v-model="dataForm.vipCardName" placeholder="请输入会员卡名称"></el-input>
      </el-form-item>
      <el-form-item label="会员卡类型" prop="vipCardBigType">
        <el-radio v-model="dataForm.vipCardBigType" label="DURATION_CARD">阶段卡</el-radio>
        <el-radio v-model="dataForm.vipCardBigType" label="COUNT_CARD">次数卡</el-radio>
      </el-form-item>
      <el-form-item label="阶段类型" prop="vipCardType" v-if="dataForm.vipCardBigType==='DURATION_CARD'">
        <div class="vip-card-type">
          <div class="type-item"
               :class="dataForm.vipCardType===type.type?'type-item-selected':''"
               v-for="(type,typeIndex) in vipCardTypeList" @click="selectedVipCardType(typeIndex)">
            {{ type.name }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" placeholder="请输入原价" type="number"></el-input>
      </el-form-item>
      <el-form-item label="添加的vip天数" prop="addVipDays" v-if="dataForm.vipCardBigType==='DURATION_CARD'">
        <el-input v-model="dataForm.addVipDays" placeholder="请输入该卡可以添加的vip天数" type="number"></el-input>
      </el-form-item>
      <el-form-item label="添加的vip天数-女" prop="addVipDays" v-if="dataForm.vipCardBigType==='DURATION_CARD'">
        <el-input v-model="dataForm.addVipDaysFemale" placeholder="默认跟添加vip天数保持一致，可不填" type="number"></el-input>
      </el-form-item>
      <el-form-item label="可以使用次数" prop="useCount" v-if="dataForm.vipCardBigType==='COUNT_CARD'">
        <el-input v-model="dataForm.useCount" placeholder="请输入该卡可以使用次数" type="number"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="请输入排序" type="number"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {apiVipCardDetail, apiVipCardUpdate, apiVipCardSave} from '../../../api/vipCard'
import {VipCardTypeData} from '../../../const/vipCardType'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        vipCardId: 0,
        vipCardName: '',
        vipCardBigType: 'DURATION_CARD',
        vipCardType: '',
        price: '',
        favorablePrice: '',
        addVipDays: '',
        addVipDaysFemale: ''
      },
      dataRule: {
        vipCardName: [
          {required: true, message: '会员卡名称不能为空', trigger: 'blur'}
        ],
        vipCardBigType: [
          {required: true, message: '会员卡类型不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '价格不能为空', trigger: 'blur'}
        ]
      },
      vipCardTypeList: VipCardTypeData
    }
  },
  methods: {
    init (id) {
      this.dataForm.vipCardId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.vipCardId) {
          apiVipCardDetail(id).then(({data}) => {
            this.dataForm = data.data
          })
        }
      })
    },
    selectedVipCardType (typeIndex) {
      this.dataForm.vipCardType = this.vipCardTypeList[typeIndex].type
      this.dataForm.addVipDays = this.vipCardTypeList[typeIndex].addVipDays
      this.dataForm.addVipDaysFemale = this.vipCardTypeList[typeIndex].addVipDays
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 判断数据是否正确
          if (this.dataForm.vipCardBigType === 'DURATION_CARD') {
            // 阶段卡
            // 阶段卡需要有阶段类型
            // 添加vip天数
            if (!this.dataForm.vipCardType) {
              this.$message.error('请选择阶段类型')
              return
            }
            if (!this.dataForm.addVipDays) {
              this.$message.error('请输入添加vip天数')
              return
            }
          } else {
            // 次数卡
            // 次数卡需要填写有效次数
            if (!this.dataForm.useCount) {
              this.$message.error('请填写次数卡可用次数')
              return
            }
          }

          if (this.dataForm.vipCardId) {
            // 修改
            apiVipCardUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiVipCardSave(this.dataForm).then(() => {
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
.vip-card-type {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .type-item {
    width: 80px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-content: center;
    background-color: rgba(0, 0, 0, 0.08);
  }

  .type-item-selected {
    background-color: #c3eeee;
    color: #38acc3;
  }
}
</style>
