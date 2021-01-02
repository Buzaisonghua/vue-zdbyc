<template>
  <div class="container">
    <!-- logo -->
    <div class="logo" @click="() => $router.push({path: '/home'})">
      <span style="font-size: 24px; font-weight: bold; color: #fff;">内部最多报一次系统</span>
      <!-- <img src="@/assets/layout/logo.png" alt="" title="返回首页" /> -->
    </div>
    <!-- 右侧内容 -->
    <div class="header_right">
      <!-- 搜索 -->
      <UserMsg />
      <!-- 信息下拉 -->
    </div>
  </div>
</template>

<script>
import UserMsg from './components/UserMsg.vue'
export default {
  name: 'HeaderBar',
  components: {
    UserMsg
  },
  data() {
    return {
      dataSource: ['选项一', '选项二'],
      searchMode: false
    }
  },
  methods: {
    changeSearch() {
      this.searching = !this.searching
    },
    enterSearchMode() {
      this.searchMode = true
      setTimeout(() => this.$refs.input.focus(), 300)
    },
    leaveSearchMode() {
      this.searchMode = false
      setTimeout(() => this.$refs.input.blur(), 300)
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
