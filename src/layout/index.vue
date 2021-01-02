<template>
  <a-layout class="layout">
    <!-- header -->
    <a-layout-header class="header">
      <header-bar />
    </a-layout-header>

    <!-- body -->
    <a-layout class="body">
      <!-- sider -->
      <a-layout-sider
        v-model="collapsed"
        class="sider"
        theme="light"
        :trigger="null"
        :width="contentMarginLeft"
        collapsed-width="56"
      >
        <side-bar class="app-sidebar" />
        <div class="menu-control" @click="toggleCollapsed">
          <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
          <span v-if="collapsed ? false : true">收起菜单</span>
        </div>
      </a-layout-sider>

      <!-- container -->
      <a-layout-content class="container" :style="layoutMode[modetype].content">
        <tags-view />
        <app-main />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { AppMain, HeaderBar, SideBar, TagsView } from '@/layout'
import { LAYOUT_SIDERBAR_WIDTH } from '@/store/constant'
export default {
  name: 'Layout',
  components: {
    AppMain,
    HeaderBar,
    SideBar,
    TagsView
  },
  data() {
    return {
      layoutMode: {
        // 固定头部和侧边导航
        mode3: {
          content: {
            marginLeft: LAYOUT_SIDERBAR_WIDTH
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      modetype: state => state.layout.modetype,
      collapsed: state => state.menu.collapsed,
      contentMarginLeft: state => state.menu.contentMarginLeft
    })
  },
  watch: {
    contentMarginLeft: {
      handler: function(val, oldVal) {
        this.layoutMode.mode3.content.marginLeft = val
      }
    }
  },
  methods: {
    ...mapActions({ setSidebar: 'menu/setSidebar' }),
    toggleCollapsed() {
      this.setSidebar()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/_constant.less';
@import './index.less';
</style>
