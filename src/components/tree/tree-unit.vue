<template>
  <div>
    <!-- <a-modal
      class="tree-model"
      :title="tree_title"
      centered
      :mask-closable="false"
      @ok="tree_handleOk"
      @cancel="tree_handleCancel"
      :visible="tree_modelShow"
    > -->
    <a-row :gutter="8">
      <a-col :span="12">
        <div class="tree_left">
          <div class="tree_tags">
            <a-tabs>
              <a-tab-pane v-for="i in tree_tags" :key="i" :tab="`${i}`" />
            </a-tabs>
          </div>
          <div class="tree_search">
            <a-input-search v-model="tree_searchVal" placeholder="请输入机构名称" @change="tree_search" />
          </div>
          <a-tree
            class="tree"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :check-strictly="true"
            :checked-keys="[...tree_selectedKeys]"
            :block-node="true"
            :show-icon="true"
            :tree-data="tree_data"
            :load-data="tree_onLoadData"
            :replace-fields="replaceFields"
            @check="tree_treeCheck"
            @select="tree_treeSelect"
            @expand="onExpand"
          >
            <svg-icon slot="tree-gov" icon-class="tree-gov" style="font-size:16px" />
            <svg-icon slot="tree-district" icon-class="tree-district" style="font-size:16px" />
          </a-tree>
        </div>
      </a-col>
      <a-col :span="12" class="section">
        <div class="tree_right">
          <div class="tree_resultCount">
            已选择<span>{{ tree_resultList.length }}</span>项
          </div>
          <div class="tree_search">
            <a-input-search />
          </div>
          <ul class="tree_resultList">
            <li v-for="(item, i) in tree_resultList" :key="i">
              <svg-icon v-if="item.parent" slot="tree-gov" icon-class="tree-gov" style="font-size:16px" />
              <svg-icon v-else slot="tree-district" icon-class="tree-district" style="font-size:16px" />
              {{ item.crorgName }}
            </li>
          </ul>
        </div>
      </a-col>
    </a-row>
    <!-- </a-modal> -->
  </div>
</template>

<script>
import { loadCmmTreeCoreOrganization } from '@/api/tree'
import { getUser } from '@/utils/auth'
// 防抖
const debounce = (function() {
  let timer = 0
  return function(callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
export default {
  name: 'Tree',
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      tree_searchVal: '',
      tree_tags: ['单位选择'],
      tree_modelShow: true,
      tree_title: '选择树',
      crorgUuid: 'ORG_8E187D7FD5EB417394BA6009857F8E18',
      tree_data: [],
      tree_initData: [],
      tree_checkedKeys: [],
      tree_selectedKeys: [],
      tree_resultKeys: [],
      replaceFields: {
        title: 'crorgName',
        key: 'crorgUuid'
      }
    }
  },
  computed: {
    tree_resultList() {
      const arr = []
      this.tree_resultKeys.forEach(element => {
        arr.push(element.data.props)
      })
      return arr
    },
    users: () => JSON.parse(getUser())
  },
  created() {
    // let adminInfo = JSON.parse(localStorage.getItem('admin'))
    // this.crorgUuid = adminInfo.strMap.orgUuid
    this.fetchData()
  },
  methods: {
    tree_handleOk() {
      this.tree_modelShow = false
    },
    tree_handleCancel() {
      this.tree_modelShow = false
    },
    // 树搜索查询
    tree_search() {
      debounce(() => {
        loadCmmTreeCoreOrganization({ text: this.tree_searchVal }).then(res => {
          console.log(res.data)
          res.data.forEach(element => {
            if (element.parent) {
              element.isLeaf = false
              element.checkable = false
              element.slots = { icon: 'tree-gov' }
            } else {
              element.isLeaf = true
              element.checkable = true
              element.slots = { icon: 'tree-district' }
            }
          })
          this.tree_data = res.data

          const childArr = []
          // 递归设置查出数据子级的属性
          function expend(arr) {
            arr.forEach(element => {
              if (element.parent) {
                element.isLeaf = false
                element.checkable = false
                element.slots = { icon: 'tree-gov' }
                childArr.push(element.uuid)
                expend(element.children)
              } else {
                element.isLeaf = true
                element.checkable = true
                element.slots = { icon: 'tree-district' }
              }
            })
          }

          if (this.tree_searchVal === '') {
            this.tree_data = this.tree_initData
            Object.assign(this, {
              expandedKeys: [],
              autoExpandParent: false
            })
          } else {
            expend(res.data)
            Object.assign(this, {
              expandedKeys: childArr,
              autoExpandParent: true
            })
          }
        })
      }, 1000)
    },
    tree_treeCheck(tree_checkedKeys, e, a) {
      this.tree_checkedKeys = tree_checkedKeys.checked
      // this.tree_resultKeys = e.checkedNodes
    },
    tree_treeSelect(tree_selectedKeys, e) {
      this.tree_selectedKeys = tree_selectedKeys
      this.tree_resultKeys = e.selectedNodes
    },
    // 展开节点
    onExpand(expandedKeys, e) {
      // console.log(this.tree_data);
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    tree_resultSelect() {},
    tree_onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        loadCmmTreeCoreOrganization({ crorgUuid: treeNode.dataRef.crorgUuid }).then(res => {
          res.data.forEach(element => {
            if (element.parent) {
              element.isLeaf = false
              element.slots = { icon: 'tree-gov' }
            } else {
              element.isLeaf = true
              element.slots = { icon: 'tree-district' }
            }
          })
          treeNode.dataRef.children = res.data
          this.tree_data = [...this.tree_data]
          this.tree_initData = this.tree_data
          resolve()
        })
      })
    },
    fetchData() {
      loadCmmTreeCoreOrganization({ crorgUuid: this.users.crorgUuid }).then(res => {
        res.data.forEach(element => {
          if (element.parent) {
            element.isLeaf = false
            element.slots = { icon: 'tree-gov' }
          } else {
            element.isLeaf = true
            element.slots = { icon: 'tree-district' }
          }
          this.tree_data.push(element)
          this.tree_initData = this.tree_data
        })
        this.expandedKeys = []
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .tree-model {
/deep/ .ant-modal {
  width: 800px !important;
  @media (max-width: 1600px) {
    width: 600px !important;
  }
}
/deep/ .ant-modal-header {
  height: 56px;
  background-color: #f5f5f5;
  .ant-modal-title {
    color: #666;
    font-size: 16px;
    font-weight: bold;
  }
}
/deep/ .ant-modal-body {
  padding: 20px;
}
.ant-tree {
  color: #333;
  font-size: 16px;
}
.tree_left,
.tree_right {
  height: 100%;
  border: 1px solid #d9d9d9;
}
.tree_tags {
  height: 48px;
  border-bottom: 1px solid #d9d9d9;
  /deep/ .ant-tabs {
    color: #333;
  }
  /deep/ .ant-tabs-bar {
    margin: 0;
    height: 48px;
    border: 0;
  }
  /deep/ .ant-tabs-nav-container-scrolling {
    padding: 0 20px;
  }
  /deep/ .ant-tabs-tab-prev,
  /deep/ .ant-tabs-tab-next {
    width: 20px;
  }
  /deep/ .ant-tabs-tab-prev {
    border-right: 1px solid #d9d9d9;
  }
  /deep/ .ant-tabs-tab-next {
    right: 0px;
    border-left: 1px solid #d9d9d9;
  }
  /deep/ .ant-tabs-tab {
    margin: 0;
    padding: 0;
    width: 112px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    background-color: #f5f5f5;
    border-bottom: 1px solid #d9d9d9;
    &.ant-tabs-tab-active {
      font-weight: bold;
      background-color: #fff;
    }
  }
  /deep/ .ant-tabs-ink-bar {
    width: 112px;
  }
}
.tree_search {
  margin: 16px 24px;
}
.tree {
  height: 513px;
  margin: 16px 0 16px 24px;
  overflow: auto;
  @media (max-width: 1600px) {
    height: 313px !important;
  }
}
.tree_resultCount {
  padding-left: 22px;
  height: 48px;
  line-height: 48px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #d9d9d9;
  span {
    margin: 0 3px;
    color: #d94141;
    font-weight: bold;
  }
}
.tree_resultList {
  height: 513px;
  margin: 16px 24px;
  padding: 0;
  overflow: auto;
  @media (max-width: 1600px) {
    height: 313px !important;
  }
  li {
    list-style: none;
    white-space: nowrap;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    svg {
      vertical-align: -0.2em;
    }
  }
}
// }
</style>
