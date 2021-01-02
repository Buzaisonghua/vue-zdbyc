<template>
  <div id="areaTree">
    <div class="box-title">
      <a href="#">列表<i class="fa  fa-refresh" @click="freshArea" /></a>
    </div>
    <div class="tree-box">
      <div class="zTreeDemoBackground left">
        <ul id="treeDemo" class="ztree" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import 'ztree/js/jquery.ztree.core'
import 'ztree/js/jquery.ztree.excheck'
export default {
  name: 'ZTree',
  data: function() {
    return {
      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: 0
          }
        }
      },
      zNodes: [
        { id: 1, pId: 0, name: '父节点1' },
        { id: 11, pId: 1, name: '子节点1' },
        { id: 12, pId: 1, name: '子节点2' }
      ]
    }
  },
  mounted() {
    $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
  },
  methods: {
    freshArea: function() {
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ztree/css/zTreeStyle/zTreeStyle.css';
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow: hidden;
}
.box-title {
  border-radius: 3px 3px 0 0;
  background-color: #f5f5f5;
}
.box-title a {
  color: #2fa4e7;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 8px 15px;
  cursor: pointer;
}
.box-title .fa {
  float: right;
  line-height: 20px;
}
</style>
