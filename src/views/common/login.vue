<template>
  <div class="site-wrapper site-page--login">
    <div class="login-cover"></div>
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">宁纽健身管理系统</h2>
          <p class="brand-info__intro">通过管理系统、智能设备、数据分析，降低场馆运营成本，通过营销插件、微信小程序、财务报表提升用户留存及场馆营收</p>
        </div>
        <div class="brand-introduction">
          <div class="introduction-title">
            <div class="introduction-item" @mouseenter="changeIntroduction(introductionIndex)"
                 v-for="(introduction,introductionIndex) in introductionData"
                 :key="introductionIndex"
                 :class="currentIntroductionIndex===introductionIndex?'introduction-item-selected':''">
              {{ introduction.title }}
            </div>
          </div>
          <div class="introduction-content">
            <div class="introduction-left">
              <!-- 有毒！-->
              <!--<img :src="currentIntroductionData.image" alt="">-->
              <img src="~@/assets/img/login/manager.png" alt="" v-if="currentIntroductionIndex===0">
              <img src="~@/assets/img/login/member.png" alt="" v-if="currentIntroductionIndex===1">
              <img src="~@/assets/img/login/coach.png" alt="" v-if="currentIntroductionIndex===2">
            </div>
            <div class="introduction-right">
              <div class="sub-introduction" v-for="(subIntroduction,index) in currentIntroductionData.introduction"
                   :key="index">
                <h3>{{ subIntroduction.title }}</h3>
                <div class="sub-title">
                  <div v-for="(subTitle) in subIntroduction.subTitle">{{ subTitle }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="login-main">
          <div class="login-main-logo">
            <img src="~@/assets/img/login/login-logo.png" alt="">
          </div>
          <div class="login-form">
            <h3 class="login-title">管理员登录</h3>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                     status-icon>
              <el-form-item prop="userName">
                <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="dataForm.captcha" placeholder="验证码">
                    </el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="">
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getUUID} from '@/utils'
import {IntroductionData} from '../../const/login/introduction'

export default {
  data () {
    return {
      introductionData: IntroductionData,
      currentIntroductionIndex: 0,
      currentIntroductionData: {},
      dataForm: {
        userName: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        userName: [
          {required: true, message: '帐号不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ],
        captcha: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ]
      },
      captchaPath: ''
    }
  },
  created () {
    this.getCaptcha()
    this.currentIntroductionData = this.introductionData[this.currentIntroductionIndex]
  },
  methods: {
    changeIntroduction (index) {
      this.currentIntroductionIndex = index
      this.currentIntroductionData = this.introductionData[index]
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/login'),
            method: 'post',
            data: this.$http.adornData({
              'username': this.dataForm.userName,
              'password': this.dataForm.password,
              'uuid': this.dataForm.uuid,
              'captcha': this.dataForm.captcha
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$cookie.set('token', data.token)
              this.$router.replace({name: 'home'})
            } else {
              this.getCaptcha()
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 获取验证码
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  overflow: hidden;

  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url('../../assets/img/login/fitness-admin-background.png');
    background-size: cover;
  }

  .login-cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: calc(100vw - 40rem);
    height: 100%;
    background-color: rgba(35, 45, 50, .64);
    z-index: 0;
  }

  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }

  .site-content {
    min-height: 100%;
    padding: 3rem 40rem 3rem 3rem;
  }

  .brand-info {
    margin: 8vh 0 0 7vh;
    color: #fff;

    .brand-info__text {
      margin: 0 0 2rem 0;
      font-size: 4.3rem;
      font-weight: 400;
      text-transform: uppercase;
    }

    .brand-info__intro {
      margin: 1rem 0;
      font-size: 1.6rem;
      line-height: 1.58;
      opacity: .6;
    }
  }

  .brand-introduction {
    position: absolute;
    left: 8vh;
    bottom: 2vh;
    width: 68rem;
    height: 40rem;

    .introduction-title {
      height: 9rem;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 2rem;

      .introduction-item {
        height: 5.6rem;
        width: 17rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #999;
        color: #d7d7d7;
        font-size: 1.9rem;
        font-weight: 300;
      }

      .introduction-item-selected {
        background-color: rgba(255, 255, 255, 0.8);
        color: #000000;
        font-weight: normal;
      }
    }

    .introduction-content {
      height: 30rem;
      width: 78rem;
      padding: 1rem;
      display: flex;

      .introduction-left {
        width: 25rem;
        height: 25rem;
        display: flex;
        justify-content: center;
        align-items: center;

        > img {
          width: 28rem;
          height: 16rem;
        }
      }

      .introduction-right {
        width: 48rem;
        height: 26rem;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .sub-introduction {
          padding-left: 2rem;

          > h3 {
            margin: 1.2rem 0 .8rem 0;
            padding-left: .4rem;
            color: #dedede;
          }

          .sub-title {
            display: flex;
            font-size: 1.2rem;

            div {
              padding: 0.5rem;
              color: #aeaeae;
              border-right: 1px solid #999;
            }

            div:last-child {
              border: none;
            }
          }
        }
      }
    }
  }

  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    width: 40rem;
    box-sizing: border-box;
    min-height: 100%;
    background: hsla(0, 0%, 100%, .35) border-box;
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);

    .login-main-logo {
      position: absolute;
      width: 100%;
      height: 40vh;
      left: 0;
      top: 8vh;
      display: flex;
      justify-content: center;
      align-items: center;

      > img {
        width: 80%;
        height: 80%;
        margin-left: 1.6rem;
      }
    }

    .login-form {
      position: absolute;
      width: 80%;
      height: 40vh;
      left: 10%;
      bottom: 8vh;
      .login-title {
        font-size: 1.8rem;
        margin-bottom: 3rem;
      }

      .login-captcha {
        overflow: hidden;
        height: 36px;
        > img {
          width: 100%;
          cursor: pointer;
          height: 36px;
        }
      }

      .login-btn-submit {
        width: 100%;
        margin-top: 3.8rem;
      }
    }
  }

  .login-main::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    -webkit-filter: blur(2rem);
    background-image: url(../../assets/img/login/fitness-admin-background.png);
    filter: blur(2rem);
  }


}
</style>
