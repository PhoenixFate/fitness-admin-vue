<template>
  <div class="message-info-dialog">
    <h5>{{ message }}</h5>
    <div class="sure" @click="makeSure">确认</div>
  </div>
</template>

<script>
export default {
  name: 'GymsDialog',
  data () {
    return {
      currentIndex: -1
    }
  },
  methods: {
    makeSure () {
      this.$emit('messageSure')
    }
  },
  props: {
    messageInfoDialogFlag: Boolean,
    message: String
  }
}
</script>

<style scoped lang="scss">
.message-info-dialog {
  width: 260px;
  height: 160px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -130px;
  margin-top: -80px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  z-index: 2010;
  box-shadow: 0 0 20px #999;
  h5 {
    font-size: 16px;
  }
  .sure {
    position: absolute;
    right: 20px;
    bottom: 18px;
    width: 100px;
    height: 30px;
    background-color: #4bcec1;
    color: #fff;
    border-radius: 3px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
