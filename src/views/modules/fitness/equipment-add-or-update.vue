<template>
  <el-dialog
    :title="!dataForm.equipmentId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="dataForm.equipmentName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备图片" prop="equipmentImageUrl">
        <div class="equipment-image" v-if="dataForm.equipmentImageUrl">
          <img :src="dataForm.equipmentImageUrl" alt="">
          <div class="delete-button" @click="deleteImage">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="equipment-image-empty" v-if="!dataForm.equipmentImageUrl" @click="toUploadImage">
          +
        </div>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
  </el-dialog>
</template>

<script>
import {apiEquipmentDetail, apiEquipmentSave, apiEquipmentUpdate} from '../../../api/equipment'
import {apiUploadImage} from '../../../api/upload'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        equipmentId: 0,
        equipmentName: '',
        equipmentImageUrl: '',
        sort: ''
      },
      dataRule: {
        equipmentName: [
          {required: true, message: '设备名称不能为空', trigger: 'blur'}
        ],
        equipmentImageUrl: [
          {required: true, message: '设备图片不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: false, message: '不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.euqipmentId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.euqipmentId) {
          apiEquipmentDetail(id).then(({data}) => {
            this.dataForm = data.data
          })
        }
      })
    },
    deleteImage () {
      this.dataForm.equipmentImageUrl = null
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
      params.append('prefix', 'equipment') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.equipmentImageUrl = res.data.data
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.equipmentId) {
            // 修改
            apiEquipmentUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiEquipmentSave(this.dataForm).then(() => {
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
.equipment-image {
  width: 160px;
  height: 160px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
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

.equipment-image-empty {
  width: 160px;
  height: 160px;
  border: 1px solid #b3b3b3;
  border-radius: 8px;
  font-size: 40px;
  font-weight: 300;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>
