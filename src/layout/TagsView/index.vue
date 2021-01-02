<template>
  <div class="container">
    <span class="location">当前位置：</span>
    <div v-for="(item, index) in breadList" :key="index" class="tags">
      <span class="tag" @click="() => $router.push({path: item.path})">{{ item.name }}</span>
      <span v-if="index != breadList.length - 1" style="margin:0 5px">></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagsView',
  data() {
    return {
      breadList: []
    }
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.breadList = val.meta.bread
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.breadList = this.$route.meta.bread
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/_constant.less';
@import './index.less';
</style>
