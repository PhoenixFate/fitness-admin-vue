<template>
  <el-dialog
    :title="!dataForm.actionTypeId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="160px">
      <el-form-item label="动作分类名称" prop="actionTypeName">
        <el-input v-model="dataForm.actionTypeName" placeholder="请输入动作分类名称"></el-input>
      </el-form-item>
      <el-form-item label="动作分类图标">
        <div class="action-type-image" v-if="dataForm.actionTypeImageUrl">
          <img :src="dataForm.actionTypeImageUrl" alt="">
          <div class="delete-button" @click="deleteImage">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="action-type-image-empty" v-if="!dataForm.actionTypeImageUrl" @click="toUploadImage">+</div>
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
import {apiActionTypeDetail, apiActionTypeSave, apiActionTypeUpdate} from '../../../api/actionType'
import {apiUploadImage} from '../../../api/upload'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        actionTypeId: 0,
        actionTypeName: '',
        actionTypeImageUrl: ''
      },
      dataRule: {
        actionTypeName: [
          {required: true, message: '动作分类名称不能为空', trigger: 'blur'}
        ],
        actionTypeImageUrl: [
          {required: true, message: '动作分类图标不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.actionTypeId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.actionTypeId) {
          apiActionTypeDetail(this.dataForm.actionTypeId).then(({data}) => {
            this.dataForm = data.data
          })
        }
      })
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
      params.append('prefix', 'actionType') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.actionTypeImageUrl = res.data.data
      })
    },
    deleteImage () {
      this.dataForm.actionTypeImageUrl = null
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.actionTypeId) {
            // 修改
            apiActionTypeUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiActionTypeSave(this.dataForm).then(() => {
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
.action-type-image {
  width: 180px;
  height: 180px;
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

.action-type-image-empty {
  width: 180px;
  height: 180px;
  border-radius: 6px;
  border: 1px solid #999;
  font-size: 32px;
  font-weight: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  color: #999;
}
</style>
