<template>
  <div id="action-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="action-list">
      <div class="top-left-search">
        <input type="text" placeholder="筛选动作..." @input="searchAction" :value="actionSearchValue">
        <div class="search" @click="doSearch">
          <img src="~@/assets/img/common/search.png" alt="">
        </div>
      </div>
      <div class="action-list-content">
        <el-collapse>
          <el-collapse-item v-for="(actionType,typeIndex) in actionList"
                            :key="typeIndex">
            <template slot="title">
              <img :src="actionType.actionTypeImageUrl" alt=""
                   style="width: 30px;height: 30px;margin-right: 20px;margin-left: 20px">
              <span>{{ actionType.actionTypeName }}</span>
            </template>
            <div class="action-item" v-for="(action,actionIndex) in actionType.actions"
                 @click="selectAction(typeIndex,actionIndex)">
              <div class="action-name">
                {{ action.actionName }}
              </div>
              <div class="action-number">
                <div class="action-number-selected"
                     v-if="action.selected">
                  {{ action.index }}
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="item-empty" v-if="actionList.length===0">
          <img src="~@/assets/img/common/no-result.png" alt="">
          <p>暂无搜索结果</p>
        </div>
      </div>
      <div class="bottom-buttons">
        <div class="bottom-button common-button" @click="makeSet('COMMON_SET')">普通组</div>
        <div class="bottom-button super-button" @click="makeSet('SUPER_SET')">超级组</div>
        <div class="bottom-button reduce-button" @click="makeSet('REDUCE_SET')">递减组</div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  name: 'ActionDialog',
  components: {BackgroundBlack},
  data () {
    return {
      selectIndex: [],
      alertMessageFlag: false,
      alertMessage: '',
      isOpen: false
    }
  },
  created () {
    this.initData()
  },
  props: {
    actionDialogFlag: Boolean,
    actionList: Array,
    actionSearchValue: String
  },
  methods: {
    initData () {
      this.actionList.forEach((actions) => {
        actions.actions.forEach((action) => {
          action.selected = false
        })
      })
      this.selectIndex = []
      this.$forceUpdate()
    },
    searchAction (e) {
      console.log(e)
      this.$emit('update:actionSearchValue', e.target.value)
    },
    doSearch () {
      this.$emit('loadActionData')
    },
    hiddenDialog () {
      this.$emit('update:actionDialogFlag', false)
      this.initData()
    },
    selectAction (typeIndex, actionIndex) {
      if (this.actionList[typeIndex].actions[actionIndex].selected) {
        this.selectIndex.splice(this.actionList[typeIndex].actions[actionIndex].index - 1, 1)
        this.actionList[typeIndex].actions[actionIndex].index = -1
        this.actionList[typeIndex].actions[actionIndex].selected = false
        this.actionList.forEach((actions, tempTypeIndex) => {
          actions.actions.forEach((action, tempActionIndex) => {
            if (action.selected) {
              this.selectIndex.forEach((temp, index) => {
                if (tempTypeIndex === temp.typeIndex && tempActionIndex === temp.actionIndex) {
                  action.index = index + 1
                }
              })
            }
          })
        })
      } else {
        this.selectIndex.push({
          typeIndex: typeIndex,
          actionIndex: actionIndex
        })
        this.actionList[typeIndex].actions[actionIndex].selected = true
        this.actionList[typeIndex].actions[actionIndex].index = this.selectIndex.length
      }
      this.$forceUpdate()
    },
    makeSet (type) {
      if (this.selectIndex.length === 0) {
        this.$message({
          message: '普通组和递减组请选择某个动作，超级组请选择多组动作',
          type: 'warning'
        })
        return
      }
      if (type === 'COMMON_SET' || type === 'REDUCE_SET') {
        if (this.selectIndex.length > 1) {
          this.$message({
            message: '普通组和递减组请选择单个动作',
            type: 'warning'
          })
          return
        }
      }
      if (type === 'SUPER_SET') {
        if (this.selectIndex.length === 1) {
          this.$message({
            message: '超级组请选择多组动作',
            type: 'warning'
          })
          return
        }
      }
      this.$emit('addActionSet', type)
    }
  }
}
</script>

<style scoped lang="scss">
#action-list-dialog-content {
  .action-list {
    width: 300px;
    height: 400px;
    position: fixed;
    top: 50%;
    margin-top: -300px;
    left: 50%;
    margin-left: -250px;
    background-color: #fff;
    z-index: 2010;
    border-radius: 20px;
    padding: 40px 30px 60px 30px;
    overflow: hidden;
    border: none;

    .top-left-search {
      position: absolute;
      top: 10px;
      left: 10%;
      width: 80%;
      height: 30px;

      input {
        width: 100%;
        height: 100%;
        font-size: 12px;
        padding-right: 40px;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.08);
        color: #676767;
        padding-left: 27px;
        border: none;
        outline: none;
      }

      input::-webkit-input-placeholder { /* WebKit browsers 适配谷歌 */
        color: #676767;
      }

      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
        color: #676767;
      }

      input::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
        color: #676767;
      }

      input:-ms-input-placeholder { /* Internet Explorer 10+  适配ie*/
        color: #676767;
      }

      .search {
        position: absolute;
        right: 4px;
        top: 0;
        width: 30px;
        height: 30px;

        img {
          width: 60%;
          height: 60%;
          position: absolute;
          left: 14%;
          top: 20%;
        }
      }
    }

    .action-list-content {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      border-radius: 1.3rem;
      padding: 10px 0 10px 10px;

      .item-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        > img {
          width: 54%;
          height: 30%;
        }

        > p {
          color: #999;
          margin-top: .7rem;
        }
      }
    }

    .bottom-buttons {
      height: 40px;
      width: 80%;
      position: absolute;
      bottom: 0;
      left: 10%;
      display: flex;
      justify-content: space-between;

      .bottom-button {
        width: 70px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        border-radius: 8px;
      }

      .common-button {
        border:1px solid #eca656;
        color:  #eca656;
      }

      .super-button {
        border:1px solid #f33a3a;
        color: #f33a3a;
      }

      .reduce-button {
        border:1px solid #2dab5b;
        color: #2dab5b;
      }
    }
  }

  .action-item {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    .action-name {
      width: 150px;
      height: 100%;
      line-height: 40px;
      padding-left: 40px;
    }

    .action-number {
      width: 50px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .action-number-selected {
        width: 20px;
        height: 20px;
        background-color: #994444;
        border-radius: 50%;
        font-size: 12px;
        font-weight: bold;
        line-height: 20px;
        text-align: center;
        color: #fff;
        margin-top: 2px;
      }
    }

  }
}
</style>
