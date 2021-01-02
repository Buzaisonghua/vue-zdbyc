<template functional>
  <a-menu-item :key="props.route.defaultKey">
    <template v-if="props.route.meta.icon">
      <svg-icon :icon-class="props.route.meta.icon" class="anticon out_icon" />
    </template>
    <span>{{ props.route.meta.title }}</span>
  </a-menu-item>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    route: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="less">
.out_icon {
  font-size: 20px !important;
}
</style>
