<template>
  <div class="user_msg">
    <a-dropdown :trigger="['click']">
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        <img class="user_img" src="@/assets/layout/avatar.png" alt="">
        您好：
        <span class="user_name">{{ userName }}</span>
        <a-icon type="down" />
      </a>
      <a-menu slot="overlay" class="user_msg_list">
        <a-menu-item class="user_msg_first_top">
          <div class="user_info">
            <img src="@/assets/layout/avatar.png" class="msg_img" alt="">
            <span>{{ userName }}</span>
          </div>
          <div class="user_branch">
            所属部门：<span>{{ userBranch }}</span>
          </div>
          <div class="user_first_list">
            <span>更换皮肤</span>
            <i>|</i>
            <span>移动信息</span>
            <i>|</i>
            <span>基本设置</span>
          </div>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item @click.native="isTest">
          <div class="user_msg_second_list">
            <svg-icon icon-class="userTime" />
            上次登录时间
          </div>
          <div class="user_msg_second_list">
            <svg-icon icon-class="userIp" />
            上次登录IP
          </div>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="1">
          <div class="user_msg_close_top" @click="closeUser">退出系统</div>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>
<script>
import { logout } from '@/api/user.js'
import { getUser } from '@/utils/auth'
export default {
  data() {
    return {
      userName: '',
      userBranch: '研发部'
    }
  },
  computed: {
    users: () => JSON.parse(getUser())
  },
  mounted() {
    this.userName = this.users.cractName
  },
  methods: {
    closeUser() {
      logout()
      this.$store.dispatch('user/resetToken').then(res => {
        this.$router.push({ path: '/login' })
      })
    },
    isTest() {
      console.log(11)
    }
  }
}
</script>
<style lang="less" scoped>
.user_msg {
  height: 100%;
  margin: 0 0 0 14px;
  padding: 0 14px;
  .ant-dropdown-link.ant-dropdown-trigger {
    height: 100%;
    display: inline-block;
  }
  &:hover {
    background: #eb3230;
  }
}
.ant-dropdown-link {
  font-size: 16px;
  color: #fff;
}
.user_msg_list {
  width: 308px;
  background: #ca2802;
  margin-top: -4px;
  margin-left: 18px;
  .user_msg_first_top {
    // height: 300px;
    font-size: 16px;
    color: #fff;
    .user_info {
      padding: 14px;
      display: flex;
      align-items: center;
      .msg_img {
        width: 34px;
        margin-right: 14px;
      }
    }
    .user_branch {
      padding-left: 14px;
    }
    .user_first_list {
      padding: 5px 14px;
      height: 46px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        flex: 1;
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        border: 4px;
        &:hover {
          background: #eb3230;
        }
      }
      > i {
        margin: 0 3px;
      }
    }
  }
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    // 清除ui默认内边距
    padding: 0;
  }
  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    // 消除ui默认悬浮底色
    background: #ca2802;
  }
}
.user_msg_second_list {
  line-height: 20px;
  padding: 4px 14px;
  font-size: 16px;
  color: #fff;
  &:hover {
    background: #eb3230;
  }
}
.user_msg_close_top {
  line-height: 30px;
  font-size: 16px;
  color: #fff;
  padding: 0 14px;
  text-align: center;
  &:hover {
    background: #eb3230;
  }
}
.user_img {
  margin-right: 14px;
}
.user_name {
  margin-right: 14px;
}
</style>
