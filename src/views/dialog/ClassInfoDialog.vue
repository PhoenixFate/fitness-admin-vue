<template>
  <div class="classInfo-dialog-body">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="classInfo-dialog">
      <div class="dialog-content">
        <div class="classInfo-item" v-for="(classInfo,classInfoIndex) in classInfoList"
             :class="classInfoIndex===currentIndex?'classInfo-item-selected':''"
             @click="selectOneClassInfo(classInfoIndex)">
          <img src="~@/assets/img/class/classInfo-default.png" alt="" v-if="!classInfo.classCoverImage">
          <img :src="classInfo.classCoverImage" alt="" v-if="classInfo.classCoverImage">
          <h3>{{ classInfo.className }}</h3>
          <p>
            <span v-for="(exercise,exerciseIndex) in classInfo.exercises">
              <span>{{ exercise.exerciseName }}</span>
              <span v-if="exerciseIndex!==(classInfo.exercises.length-1)">、</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  components: {BackgroundBlack},
  name: 'GymsDialog',
  data () {
    return {
      currentIndex: -1
    }
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:classInfoDialogFlag', false)
    },
    selectOneClassInfo (classInfoIndex) {
      this.currentIndex = classInfoIndex
      this.$emit('selectOneClassInfo', classInfoIndex)
      setTimeout(() => {
        this.$emit('update:classInfoDialogFlag', false)
      }, 500)
    }
  },
  props: {
    classInfoList: Array,
    classInfoDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.classInfo-dialog-body {
  .classInfo-dialog {
    width: 400px;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -300px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 40px #fff;
    border-radius: 20px;
    padding: 20px;
    z-index: 2010;

    .dialog-content {
      width: 100%;
      height: 100%;
      padding: 10px;
      overflow-y: scroll;

      .classInfo-item {
        width: 100%;
        height: 120px;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 8px;
        position: relative;

        > img {
          width: 140px;
          height: 100px;
          position: absolute;
          left: 10px;
          top: 10px;
          border-radius: 6px;
        }

        h3 {
          position: absolute;
          left: 170px;
          top: 20px;
          font-size: 18px;
          color: #000;
        }

        p {
          position: absolute;
          left: 174px;
          top: 66px;
          font-size: 12px;
          color: #999;
        }
      }

      .classInfo-item-selected {
        box-shadow: 0 0 16px #41f641;
      }
    }
  }
}
</style>
