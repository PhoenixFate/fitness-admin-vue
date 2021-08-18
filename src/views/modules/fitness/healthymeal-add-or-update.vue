<template>
  <el-dialog
    :title="!dataForm.healthyMealId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="140px">
      <el-form-item label="健康餐名称" prop="healthyMealName">
        <el-input v-model="dataForm.healthyMealName" placeholder="请输入健康餐名称"></el-input>
      </el-form-item>
      <el-form-item label="健康餐封面" prop="healthyMealCoverImage">
        <div class="healthy-meal-image">
          <div class="healthy-meal-image-content" v-if="dataForm.healthyMealCoverImage">
            <img :src="dataForm.healthyMealCoverImage" alt="">
            <div class="delete-button" @click="deleteImage">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="healthy-meal-image-empty" v-if="!dataForm.healthyMealCoverImage" @click="toUploadImage">+</div>
        </div>
      </el-form-item>
      <el-form-item label="热量" prop="hot">
        <el-input v-model="dataForm.hot" placeholder="请输入热量" type="number"></el-input>
      </el-form-item>
      <el-form-item label="碳水" prop="carbon">
        <el-input v-model="dataForm.carbon" placeholder="请输入碳水" type="number"></el-input>
      </el-form-item>
      <el-form-item label="脂肪" prop="fat">
        <el-input v-model="dataForm.fat" placeholder="请输入脂肪" type="number"></el-input>
      </el-form-item>
      <el-form-item label="蛋白质" prop="protein">
        <el-input v-model="dataForm.protein" placeholder="请输入蛋白质" type="number"></el-input>
      </el-form-item>
      <el-form-item label="餐食用料" prop="healthyMealItems">
        <div class="meal-items">
          <div class="standard-item-big" v-for="(item,index) in  dataForm.healthyMealItems" :key="index">
            <div class="standard-item">
              <span>{{ item.healthyMealItemName }}</span>
              <span><input v-model="item.weight" type="number"/>克</span>
              <span><input v-model="item.share" type="number"/>份</span>
            </div>
            <div class="delete" @click="deleteFoodItem(index)">
              <img src="~@/assets/img/common/delete.png" alt="">
            </div>
          </div>
          <div class="item-add" @click="showAddMealItemDialog">+</div>
        </div>
      </el-form-item>
    </el-form>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <AddMealItemDialog
      :meal-item-dialog-flag.sync="mealItemDialogFlag"
      @addMealItem="addMealItem"
      style="z-index: 4000"
      v-if="mealItemDialogFlag">
    </AddMealItemDialog>
  </el-dialog>
</template>

<script>
import {apiHealthyMealDetail, apiHealthyMealUpdate, apiHealthyMealSave} from '../../../api/healthyMeal'
import {apiUploadImage} from '../../../api/upload'
import AddMealItemDialog from '../../dialog/AddMealItemDialog'

export default {
  components: {AddMealItemDialog},
  data () {
    return {
      visible: false,
      dataForm: {
        healthyMealId: 0,
        healthyMealName: '',
        healthyMealCoverImage: '',
        hot: '',
        carbon: '',
        fat: '',
        protein: '',
        healthyMealItems: []
      },
      dataRule: {
        healthyMealName: [
          {required: true, message: '健康餐名称不能为空', trigger: 'blur'}
        ],
        healthyMealCoverImage: [
          {required: true, message: '健康餐封面不能为空', trigger: 'blur'}
        ],
        hot: [
          {required: true, message: '热量不能为空', trigger: 'blur'}
        ],
        carbon: [
          {required: true, message: '碳水不能为空', trigger: 'blur'}
        ],
        fat: [
          {required: true, message: '脂肪不能为空', trigger: 'blur'}
        ],
        protein: [
          {required: true, message: '蛋白质不能为空', trigger: 'blur'}
        ]
      },
      mealItemDialogFlag: false
    }
  },
  methods: {
    init (id) {
      this.dataForm.healthyMealId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.healthyMealId) {
          apiHealthyMealDetail(id).then(({data}) => {
            this.dataForm = data.data
          })
        }
      })
    },
    deleteImage () {
      this.dataForm.healthyMealCoverImage = null
    },
    toUploadImage () {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click()
    },
    addMealItem (tempMealItem) {
      let mealItem = {
        healthyMealItemName: tempMealItem.healthyMealItemName,
        weight: tempMealItem.weight,
        share: tempMealItem.share
      }
      this.dataForm.healthyMealItems.push(mealItem)
      this.mealItemDialogFlag = false
    },
    // 点击上传图片
    readLocalFile () {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'healthyMeal') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.dataForm.healthyMealCoverImage = res.data.data
      })
    },
    showAddMealItemDialog () {
      this.mealItemDialogFlag = true
    },
    deleteFoodItem (index) {
      this.dataForm.healthyMealItems.splice(index, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.healthyMealId) {
            // 修改
            apiHealthyMealUpdate(this.dataForm).then(() => {
              this.saveFinish()
            })
          } else {
            // 新增
            apiHealthyMealSave(this.dataForm).then(() => {
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
.healthy-meal-image {
  width: 200px;
  height: 150px;
  position: relative;

  .healthy-meal-image-content {
    width: 100%;
    height: 100%;
    border-radius: 6px;

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

  .healthy-meal-image-empty {
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

.meal-items {
  min-height: 7rem;
  padding: 10px 40px 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    width: 50px;
    outline: none;
  }

  .standard-item-big {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto .8rem;

    .delete {
      width: 12%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      img {
        height: 1rem;
        width: 1rem;
      }
    }
  }

  .standard-item {
    width: 88%;
    height: 2.5rem;
    background-color: rgba(#fdf3dc, 0.8);
    line-height: 2.5rem;
    border-radius: .4rem;
    box-shadow: 0 0 .2rem #e99910;
    padding: 0 1rem;
    font-size: .8rem;
    display: flex;
    justify-content: space-between;

    label {
      width: 2.2rem;
      font-size: 1rem;
      height: 80%;
    }

    span {
      display: flex;
      align-items: center;
    }

    span:nth-child(1) {
      width: 44%;
      justify-content: flex-start;
    }

    span:nth-child(2) {
      width: 24%;
      text-align: right;
      justify-content: flex-end;
    }

    span:nth-child(3) {
      width: 32%;
      text-align: right;
      justify-content: flex-end;
    }
  }

  .standard-item:last-child {
    margin-bottom: 0;
  }

  .item-add {
    background-color: #ffda9c;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: .1rem solid #e7c305;
    color: #fff;
    font-size: 2rem;
    line-height: 2.5rem;
    text-align: center;
  }

  .standard-empty {
    height: 9.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: .3rem;

    img {
      width: 80%;
      height: 90%;
      border-radius: 1rem;
      margin-top: .3rem;
    }

    p {
      margin: .4rem;
      color: #888;
    }
  }
}
</style>
