<template>
  <div>
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="action-type-list">
      <div class="action-type-item"
           :class="currentIndex===index?'action-type-item-selected':''"
           v-for="(actionType,index) in actionTypeList"
           :key="actionType.actionTypeName"
           @click="selectActionType(index)"
      >
        <img :src="actionType.actionTypeImageUrl" alt="">
        <p>{{ actionType.actionTypeName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  name: 'ActionTypeDialog',
  components: {BackgroundBlack},
  data () {
    return {
      currentIndex: -1
    }
  },
  props: {
    actionTypeList: Array,
    actionTypeDialogFlag: Boolean
  },
  methods: {
    selectActionType (index) {
      this.currentIndex = index
      this.$emit('selectActionType', index)
      setTimeout(() => {
        this.$emit('update:actionTypeDialogFlag', false)
      }, 800)
    },
    hiddenDialog () {
      this.$emit('update:actionTypeDialogFlag', false)
    }
  }
}
</script>

<style scoped lang="scss">
.action-type-list {
  width: 500px;
  height: 530px;
  overflow-y: scroll;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -250px;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 40px #fff;
  z-index: 2010;
  border-radius: 1rem;
  padding: 35px 35px 15px 35px;
  .action-type-item {
    width: 130px;
    height: 140px;
    box-shadow: 0 0 10px #d0d0d0;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    img {
      width: 70%;
      margin-top: 4px;
    }

    p {
      text-align: center;
      margin: 4px 0 0 0;
      font-size: 15px;
    }
  }

  .action-type-item-selected {
    box-shadow: 0 0 18px #3bb34a;
  }

  .action-type-item:nth-child(3n) {
    margin-right: 0;
  }
}

</style>
