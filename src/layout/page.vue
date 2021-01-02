<template>
  <a-layout class="layout">
    <!-- header -->
    <a-layout-header class="header">
      <header-bar />
    </a-layout-header>

    <!-- content -->
    <a-layout-content class="content">
      <page-main />
    </a-layout-content>
  </a-layout>
</template>

<script>
import { HeaderBar, PageMain } from '@/layout'
export default {
  components: { HeaderBar, PageMain }
}
</script>

<style lang="less" scoped>
@import '~@/styles/_constant.less';
.layout {
  min-height: 100%;
}
.header {
  padding: 0;
  position: fixed;
  width: 100%;
  height: @LAYOUT_HEADER_HEIGHT;
  line-height: @LAYOUT_HEADER_HEIGHT;
  z-index: 999;
}
.content {
  margin-top: @LAYOUT_HEADER_HEIGHT;
}
</style>
