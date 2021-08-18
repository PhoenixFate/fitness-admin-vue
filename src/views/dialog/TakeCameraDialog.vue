<template>
  <div class="take-camera-body">
    <BackgroundBlack></BackgroundBlack>
    <div class="take-camera">
      <div class="camera-content">
        <video id="video" width="300" height="300" controls></video>
        <div class="take-camera-button" @click="takePhoto">
          拍照
        </div>
        <canvas id="canvas" width="300" height="300" ref="canvas"></canvas>
      </div>
      <div class="bottom-button">
        <el-button type="info" @click="hiddenDialog()" style="margin-right: 100px">取消</el-button>
        <el-button type="primary" @click="sureTakePhoto()">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from '../common/BackgroundBlack'
import './element-input.scss'
import {apiUploadImageBase64} from '../../api/upload'

export default {
  components: {BackgroundBlack},
  name: 'TakeCameraDialog',
  data () {
    return {
      video: null,
      canvas: null,
      context: null,
      avatar: null,
      stream: null
    }
  },
  destroyed () {
    if (this.stream) {
      // 关闭摄像头
      this.stream.getTracks()[0].stop()
    }
  },
  mounted () {
    this.video = document.getElementById('video')
    this.canvas = document.getElementById('canvas')
    this.canvas = this.$refs.canvas
    this.context = this.canvas.getContext('2d')
    console.log(navigator.mediaDevices)
    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
      // 调用用户媒体设备, 访问摄像头
      this.getUserMedia({video: {width: 300, height: 300}}, this.success, this.error)
    } else {
      console.log('不支持访问用户媒体')
    }
  },
  methods: {
    // 访问用户媒体设备的兼容方法
    getUserMedia (constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        // 最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
      } else if (navigator.webkitGetUserMedia) {
        // webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
      } else if (navigator.mozGetUserMedia) {
        // firefox浏览器
        navigator.mozGetUserMedia(constraints, success, error)
      } else if (navigator.getUserMedia) {
        // 旧版API
        navigator.getUserMedia(constraints, success, error)
      }
    },
    takePhoto () {
      this.context.drawImage(this.video, 0, 0, 300, 300)
      console.log(this.canvas.toDataURL())
      let params = new FormData()  // 创建form对象
      params.append('base64Str', this.canvas.toDataURL())  // 通过append向form对象添加数据
      params.append('prefix', 'customer') // 添加form表单中其他数据
      apiUploadImageBase64(params).then((res) => {
        console.log(res)
        this.avatar = res.data.data
      })
    },
    success (stream) {
      // 兼容webkit核心浏览器
      // eslint-disable-next-line no-unused-vars
      let CompatibleURL = window.URL || window.webkitURL
      // 将视频流设置为video元素的源
      this.stream = stream
      // video.src = CompatibleURL.createObjectURL(stream);
      this.video.srcObject = stream
      this.video.play()
    },
    hiddenDialog () {
      this.$emit('update:takeCameraDialogFlag', false)
    },
    sureTakePhoto () {
      if (!this.avatar) {
        this.$message.error('请先点击拍照')
        return
      }
      this.customer.avatar = this.avatar
      this.$emit('sureTakePhoto')
      this.$emit('update:takeCameraDialogFlag', false)
    }
  },
  props: {
    customer: Object,
    takeCameraDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.take-camera-body {
  .take-camera {
    width: 500px;
    height: 800px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -400px;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px;
    z-index: 2010;
    border: 1px solid #000;

    .camera-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      video {
        margin: 0 auto;
      }

      .take-camera-button {
        width: 60px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        border: 1px solid #000;
        margin: 20px auto;
      }
    }

    .bottom-button {
      position: absolute;
      bottom: 30px;
      width: calc(100% - 40px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
