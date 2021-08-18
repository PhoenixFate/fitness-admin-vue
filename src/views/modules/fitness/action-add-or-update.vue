<template>
  <el-dialog
    :title="!dataForm.actionId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="动作名称" prop="actionName">
        <el-input v-model="dataForm.actionName" placeholder="请填写动作名称"></el-input>
      </el-form-item>
      <el-form-item label="动作示范">
        <div class="action-examples">
          <div class="action-example-item" v-for="(example,exampleIndex) in dataForm.actionExamples">
            <img :src="example" alt="">
            <div class="delete-button" @click="deleteActionExample(exampleIndex)">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="action-examples-empty" @click="toUploadImage">
            +
          </div>
        </div>
      </el-form-item>
      <el-form-item label="动作分类" prop="actionType">
        <div class="action-action-type" v-if="dataForm.actionType">
          <img :src="dataForm.actionType.actionTypeImageUrl" alt="">
          <p>{{ dataForm.actionType.actionTypeName }}</p>
          <div class="delete-button" @click="deleteActionType">
            <img src="~@/assets/img/common/delete.png" alt="">
          </div>
        </div>
        <div class="action-action-type-empty" v-if="!dataForm.actionType" @click="showActionTypeDialog">
          +
        </div>
        <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
      </el-form-item>
      <el-form-item label="是否包含重量" prop="containWeight">
        <el-radio v-model="dataForm.containWeight" label="1">是</el-radio>
        <el-radio v-model="dataForm.containWeight" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="训练单位" prop="unit">
        <el-radio v-model="dataForm.unit" label="SECOND">秒</el-radio>
        <el-radio v-model="dataForm.unit" label="SET">组</el-radio>
      </el-form-item>
      <el-form-item label="动作描述" prop="actionDescription">
        <textarea v-model="dataForm.actionDescription" placeholder="请填写详情的动作描述" class="action-description"></textarea>
      </el-form-item>
      <el-form-item label="使用设备">
        <div class="action-equipment">
          <div class="action-equipment-item" v-for="(equipment,equipmentIndex) in dataForm.equipments">
            <img :src="equipment.equipmentImageUrl" alt="">
            <p>{{ equipment.equipmentName }}</p>
            <div class="delete-button" @click="deleteEquipment(equipmentIndex)">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="action-equipment-empty" @click="showEquipmentDialog">
            +
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <ActionTypeDialog
      :actionTypeList="actionTypeList"
      :actionTypeDialogFlag.sync="actionTypeDialogFlag"
      @selectActionType="selectActionType"
      style="z-index: 4000"
      v-if="actionTypeDialogFlag">
    </ActionTypeDialog>
    <EquipmentDialogFlag
      :equipment-list="equipmentList"
      :equipmentDialogFlag.sync="equipmentDialogFlag"
      @selectEquipment="selectEquipment"
      style="z-index: 4000"
      v-if="equipmentDialogFlag">
    </EquipmentDialogFlag>
  </el-dialog>
</template>

<script>
import {apiActionDetail, apiActionUpdate, apiActionSave} from '../../../api/action'
import {apiUploadImage} from '../../../api/upload'
import {apiActionTypeList} from '../../../api/actionType'
import {apiEquipmentList} from '../../../api/equipment'
import ActionTypeDialog from '../../dialog/ActionTypeDialog'
import EquipmentDialogFlag from '../../dialog/EquipmentDialog'

export default {
  components: {ActionTypeDialog, EquipmentDialogFlag},
  data () {
    return {
      visible: false,
      dataForm: {
        actionId: 0,
        actionName: '',
        actionType: '',
        actionDescription: '',
        containWeight: 0,
        unit: 'SET',
        examples: [],
        equipments: []
      },
      dataRule: {
        actionName: [
          {required: true, message: '动作名称不能为空', trigger: 'blur'}
        ],
        actionType: [
          {required: true, message: '动作分类不能为空', trigger: 'blur'}
        ],
        actionDescription: [
          {required: false, message: '不能为空', trigger: 'blur'}
        ],
        containWeight: [
          {required: true, message: '是否包含重量不能为空', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      actionTypeList: [],
      actionTypeDialogFlag: false,
      equipmentList: [],
      equipmentDialogFlag: false
    }
  },
  methods: {
    init (id) {
      this.dataForm.actionId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.actionId) {
          apiActionDetail(this.dataForm.actionId).then(({data}) => {
            console.log(data)
            this.dataForm = data.data
            this.dataForm.containWeight += ''
          })
        }
        apiActionTypeList({limit: 100}).then(({data}) => {
          this.actionTypeList = data.data.list
        })
        apiEquipmentList({limit: 100}).then(({data}) => {
          this.equipmentList = data.data.list
        })
      })
    },
    deleteActionType () {
      this.dataForm.actionType = null
    },
    deleteActionExample (exampleIndex) {
      this.dataForm.actionExamples.splice(exampleIndex, 1)
    },
    deleteEquipment (equipmentIndex) {
      this.dataForm.equipments.splice(equipmentIndex, 1)
    },
    showEquipmentDialog () {
      this.equipmentDialogFlag = true
    },
    showActionTypeDialog () {
      this.actionTypeDialogFlag = true
    },
    selectActionType (actionTypeIndex) {
      this.dataForm.actionType = this.actionTypeList[actionTypeIndex]
    },
    selectEquipment (index) {
      let temp = this.equipmentList[index]
      let flag = false
      if (this.dataForm.equipments) {
        this.dataForm.equipments.forEach((equipment) => {
          if (equipment.equipmentId === temp.equipmentId) {
            flag = true
          }
        })
      }
      if (flag) {
        this.$message({
          message: '该动作已经存在该设备',
          type: 'warning'
        })
        return
      }
      this.dataForm.equipments.push(temp)
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
      params.append('prefix', 'actionExample') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.actionExamples.push(res.data.data)
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.actionId) {
            apiActionUpdate(this.dataForm).then(() => {
            }).finally(() => {
              this.saveFinish()
            })
          } else {
            apiActionSave(this.dataForm).then(() => {
            }).finally(() => {
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
.action-action-type, .action-action-type-empty {
  width: 120px;
  height: 140px;
  box-shadow: 0 0 4px #999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 6px;
  position: relative;

  img {
    width: 90px;
    height: 90px;
  }

  p {
    font-size: 14px;
    line-height: 16px;
    margin-top: 10px;
  }
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

.action-action-type-empty {
  border: 1px solid #b3b3b3;
  box-shadow: none;
  font-size: 40px;
  font-weight: 300;
  padding-bottom: 10px;
  color: #999;
}

.action-description {
  border: 1px solid #999;
  width: 400px;
  height: 160px;
  border-radius: 4px;
  line-height: 1.3;
  padding: 10px 15px;
}

.action-examples {
  .action-example-item, .action-examples-empty {
    width: 130px;
    height: 160px;
    border-radius: 8px;
    box-shadow: 0 0 4px #999;
    float: left;
    margin-right: 20px;
    position: relative;
    margin-bottom: 20px;

    > img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }

  .action-examples-empty {
    font-size: 40px;
    color: #b3b3b3;
    border: 1px solid #b3b3b3;
    box-shadow: none;
    padding-bottom: 16px;
    font-weight: 300;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.action-equipment {
  .action-equipment-item, .action-equipment-empty {
    width: 120px;
    height: 160px;
    border-radius: 8px;
    box-shadow: 0 0 4px #999;
    float: left;
    margin-right: 20px;
    position: relative;
    margin-bottom: 20px;

    > img {
      width: 120px;
      height: 132px;
      border-radius: 8px;
    }

    p {
      text-align: center;
      line-height: 1.1;
      margin-top: 6px;
    }
  }

  .action-equipment-empty {
    font-size: 40px;
    color: #b3b3b3;
    border: 1px solid #b3b3b3;
    box-shadow: none;
    padding-bottom: 16px;
    font-weight: 300;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
