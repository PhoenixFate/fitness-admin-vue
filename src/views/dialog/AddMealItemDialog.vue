<template>
  <div id="meal-item-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="meal-item-dialog">
      <div class="dialog-title">添加用料</div>
      <div class="dialog-body">
        <div class="item-line special">
          <div>用料：</div>
          <div><input v-model="tempMealItem.healthyMealItemName" placeholder="请输入用料名称"/></div>
        </div>
        <div class="item-line">
          <div>含量：</div>
          <div><input v-model="tempMealItem.weight" type="number"/>克</div>
        </div>
        <div class="item-line">
          <div>份数：</div>
          <div><input v-model="tempMealItem.share" type="number"/>份</div>
        </div>
      </div>
      <div class="dialog-buttons">
        <div class="cancel" @click="cancel">取消</div>
        <div class="confirm" @click="addItem">添加</div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  name: 'AddMealItemDialog',
  components: {BackgroundBlack},
  data () {
    return {
      tempMealItem: {
        healthyMealItemName: '',
        weight: 0,
        share: 1
      }
    }
  },
  props: {
    mealItemDialogFlag: Boolean
  },
  methods: {
    cancel () {
      this.$emit('update:mealItemDialogFlag', false)
    },
    addItem () {
      if (!this.tempMealItem.healthyMealItemName) {
        this.$message({
          message: '是输入用料名称',
          type: 'warning'
        })
        return
      }
      if (!this.tempMealItem.weight || this.tempMealItem.weight <= 0) {
        this.$message({
          message: '是输入正确的含量',
          type: 'warning'
        })
        return
      }
      if (!this.tempMealItem.share || this.tempMealItem.share <= 0) {
        this.$message({
          message: '是输入正确的份数',
          type: 'warning'
        })
        return
      }
      this.$emit('addMealItem', this.tempMealItem)
    },
    hiddenDialog () {
      this.$emit('update:mealItemDialogFlag', false)
    }
  }
}
</script>

<style scoped lang="scss">
#meal-item-dialog-content {
  .meal-item-dialog {
    width: 400px;
    height: 460px;
    position: fixed;
    top: 50%;
    margin-top: -230px;
    left: 50%;
    margin-left: -200px;
    z-index: 2010;
    border-radius: 1rem;
    border: none;
    background-color: #fdf9d2;

    input {
      width: 60px;
    }

    .dialog-title {
      position: absolute;
      width: 7rem;
      left: 50%;
      margin-left: -3.5rem;
      top: -1.1rem;
      height: 2.5rem;
      background-color: #ffc35a;
      font-size: .9rem;
      font-weight: bold;
      border-radius: .3rem;
      text-align: center;
      line-height: 2.5rem;
      color: #fff;
    }

    .dialog-body {
      margin-top: 10%;
      height: 74%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .item-line {
        height: 5rem;
        width: 100%;
        padding: 0 15%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;

        div:nth-child(1) {
          width: 36%;
          font-size: 1.2rem;
        }

        div:nth-child(2) {
          display: flex;
          width: 70%;
          justify-content: center;
          align-items: center;

          label {
            font-size: 1rem;
            width: 90%;
          }
        }
      }

      .special {
        input {
          width: 160px;
        }
      }

      .item-line:nth-child(2), .item-line:nth-child(3) {
        div:nth-child(2) {
          label {
            width: 3rem;
          }
        }
      }
    }

    .dialog-buttons {
      position: absolute;
      bottom: 0;
      height: 5rem;
      left: 5%;
      width: 90%;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .cancel, .confirm {
        width: 5.5rem;
        height: 2rem;
        background-color: #fff;
        line-height: 2rem;
        border-radius: .4rem;
        text-align: center;
        font-size: .9rem;
      }

      .cancel {
        border: 1px solid #b8b8b8;
        color: #888;
      }

      .confirm {
        border: 1px solid #ffc35a;
        background-color: #fde6bb;
        color: #f6a501;
      }
    }
  }
}
</style>
