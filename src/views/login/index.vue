<template>
  <div class="layout">
    <div class="container">
      <img class="login-bg" src="~@/assets/login/login_bg.png" alt="">
      <a-form :form="form" class="login-form" auto-complete="off" @submit="handleSubmit">
        <img class="login-logo" src="~@/assets/login/login_logo.png" alt="">
        <p class="login-tips">使用账号密码登录</p>
        <a-form-item>
          <a-input
            v-decorator="[
              'code',
              {rules: [{required: true, message: '请输入账户！'}], validateTrigger: 'change', initialValue: 'admin'}
            ]"
            placeholder="请输入账户"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-decorator="[
              'pwd',
              {
                rules: [{required: true, message: '请输入密码！'}],
                validateTrigger: 'change',
                initialValue: 'f3fb32386c36dd0bd9fda781dfd416cc'
              }
            ]"
            type="password"
            placeholder="请输入密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <!-- <a-checkbox
          class="login-form-remember"
          v-decorator="[
            'rememberMe',
            {
              valuePropName: 'checked',
              initialValue: true
            }
          ]"
        >
          记住密码
        </a-checkbox> -->
          <!-- <router-link class="login-form-register" :to="{name: 'register'}">注册账户</router-link> -->
          <!-- <router-link :to="{name: 'recover', params: {user: 'aaa'}}" class="login-form-forgot">忘记密码</router-link> -->
          <a-button
            type="primary"
            html-type="submit"
            class="login-form-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      state: {
        loginBtn: false
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: 'login-form'
    })
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$store
            .dispatch('user/loginin', values)
            .then(res => {
              this.$message.destroy()
              this.$router.push({ path: '/home' })
            })
            .catch(_ => {
              this.$message.destroy()
              this.$message.error('登录出错')
            })
        } else {
          this.$message.destroy()
          this.$message.error('请输入账号密码')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  min-height: 100%;
  width: 100%;
  background-color: #c2c2c2;
  overflow: hidden;
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 810px;
  height: 550px;
  margin-top: -275px;
  margin-left: -405px;
  .login-bg {
    float: left;
    width: 330px;
    height: 550px;
  }
  .login-form {
    float: right;
    width: 480px;
    height: 550px;
    padding: 0 85px;
    text-align: center;
    background-color: #fff;
    .login-logo {
      width: 244px;
      margin: 50px 0;
    }
    .login-tips {
      font-size: 14px;
      color: rgb(153, 153, 153);
      text-align-last: left;
      margin-bottom: 13px;
    }
  }
}
.login-form-register {
  color: #fff;
}
.login-form-remember {
  color: #fff;
}
.login-form-forgot {
  float: right;
  color: #fff;
}
.login-form-button {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  border: 0;
  background-color: #1aa195;
  border-radius: 5px;
}
</style>
