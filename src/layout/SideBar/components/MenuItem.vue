<template functional>
  <a-sub-menu :key="props.route.name">
    <span slot="title">
      <template v-if="props.route.meta.icon">
        <svg-icon :icon-class="props.route.meta.icon" class="anticon out_icon" />
      </template>
      <span>{{ props.route.meta.title }}</span>
    </span>
    <template v-for="item in props.route.children">
      <template v-if="!item.children">
        <a-menu-item :key="item.name">
          <template v-if="item.meta.icon">
            <!-- <span class="two_icon"><svg-icon :icon-class="item.meta.icon"  /></span> -->
          </template>
          <span class="two_title">{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <SidebarMenuItem :key="item.path" :route="item" />
      </template>
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  name: 'SidebarMenuItem',
  props: {
    route: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style>
.two_icon{
  display: inline-block;
  height: 21px;
  line-height: 21px;
  font-size: 8px;
}
</style>
