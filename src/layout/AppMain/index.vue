<template>
  <div class="wrapper">
    <router-view :default-active="$route.path" />
    <!-- </transition> -->
    <!-- <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition> -->
  </div>
</template>
<script>
export default {}
</script>

<style lang="less" scoped>
.wrapper {
  margin: 16px;
  padding: 0 16px;
  background-color: #fff;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
