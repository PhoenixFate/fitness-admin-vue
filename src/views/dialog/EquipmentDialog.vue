<template>
  <div>
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="equipment-list">
      <div class="equipment-items clearfix">
        <div class="equipment-item"
             v-for="(equipment,index) in equipmentList"
             :key="index"
             @click="selectEquipment(index)"
             :class="currentIndex===index?'equipment-item-selected':''"
        >
          <div class="image">
            <img :src="equipment.equipmentImageUrl" alt="">
          </div>
          <div class="name">
            {{ equipment.equipmentName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'

export default {
  name: 'EquipmentDialog',
  components: {BackgroundBlack},
  data () {
    return {
      currentIndex: -1
    }
  },
  props: {
    equipmentList: Array,
    equipmentDialogFlag: Boolean
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:equipmentDialogFlag', false)
    },
    selectEquipment (index) {
      this.currentIndex = index
      this.$emit('selectEquipment', index)
      setTimeout(() => {
        this.$emit('update:equipmentDialogFlag', false)
      }, 500)
    }
  }
}
</script>

<style scoped lang="scss">
.equipment-list {
  position: fixed;
  width: 500px;
  height: 600px;
  left: 50%;
  top: 50%;
  margin-top: -300px;
  margin-left: -250px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  z-index: 2010;
  padding: 20px;
  box-shadow: 0 0 40px #fff;

  .equipment-items {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 12px 0 12px 12px;

    .equipment-item {
      width: 131px;
      margin-right: 20px;
      height: 150px;
      background-color: #fff;
      margin-bottom: 20px;
      float: left;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 4px #fff;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .image {
        width: 100px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }

      .name {
        font-size: 12px;
        text-align: center;
        line-height: 1.3;
        margin-top: 6px;
      }
    }

    .equipment-item-selected {
      box-shadow: 0 0 20px #54e766;
    }

    .equipment-item:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
