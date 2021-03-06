<template>
  <div>
    <a-modal
      class="tree_model"
      :title="tree_title"
      centered
      :mask-closable="false"
      :visible="tree_modelShow"
      @ok="tree_handleOk"
      @cancel="tree_handleCancel"
    >
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
              :block-node="true"
              :checkable="true"
              :checked-keys="[...tree_checkedAllKeys]"
              :selectable="true"
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
                {{ item.croatTitle }}
              </li>
            </ul>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { loadCmmTreeCoreOrgTree } from '@/api/tree'
// 防抖
const debounce = (function() {
  let timer = 0
  return function(callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
/**
 * isLeaf 树的子数据前的三角箭头
 * checkable 树的子数据前的复选框
 * slots 树的子数据前的图标
 */
export default {
  name: 'TreeUser',
  data() {
    return {
      tree_modelShow: true, // 树弹框
      tree_title: '选择树', // 弹框标题
      croatUuid: 'ORG_8E187D7FD5EB417394BA6009857F8E18', // 默认uuid
      expandedKeys: [], // 展开指定的树节点（搜索使用）
      autoExpandParent: true, // 是否自动展开父节点
      tree_tags: ['人员选择'], // 树的标签栏（多个自动轮播）
      tree_searchVal: '', // 树搜索内容
      tree_data: [], // 树数据
      tree_initData: [], // 树原始数据（搜索无结果重置树用）
      tree_checkedKeys: [], // 树勾选项（多选用）
      tree_checkedAllKeys: [],
      tree_selectedKeys: [], // 树选择项（单选用）
      tree_resultKeys: [], // 确定结果数据（返回调用页面使用）
      replaceFields: {
        // 树参数替换项
        title: 'croatTitle',
        key: 'croatUuid'
      }
    }
  },
  computed: {
    // 确定结果数据（展示用）
    tree_resultList() {
      const arr = []
      this.tree_resultKeys.forEach(element => {
        arr.push(element.data.props)
      })
      return arr
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    tree_handleOk() {
      this.tree_modelShow = false
    },
    tree_handleCancel() {
      this.tree_modelShow = false
    },
    // 点击复选框
    tree_treeCheck(tree_checkedKeys, e) {
      console.log(tree_checkedKeys)
      if (e.checked) {
        this.tree_checkedKeys = tree_checkedKeys
        this.tree_checkedAllKeys = Array.from(new Set(this.tree_checkedAllKeys.concat(...tree_checkedKeys)))

        const tem = this.tree_resultKeys.concat(...e.checkedNodes)
        const hash = {}
        const filterData = tem.reduce((preVal, curVal) => {
          hash[curVal.key] ? '' : (hash[curVal.key] = true && preVal.push(curVal))
          return preVal
        }, [])
        this.tree_resultKeys = filterData
        console.log(this.tree_resultKeys)
      } else {
        // error?
        this.tree_checkedAllKeys = tree_checkedKeys

        const arr = []
        for (var i = 0; i < tree_checkedKeys.length; i++) {
          for (var j = 0; j < this.tree_resultKeys.length; j++) {
            if (tree_checkedKeys[i] === this.tree_resultKeys[j].key) {
              arr.push(this.tree_resultKeys[j])
            }
          }
        }

        this.tree_resultKeys = arr
      }
    },
    // 点击文本
    tree_treeSelect(tree_selectedKeys, e) {
      // console.log(tree_selectedKeys, e)
      // this.tree_selectedKeys = tree_selectedKeys
    },
    // 展开节点
    onExpand(expandedKeys, e) {
      // console.log(this.tree_data);
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 树搜索查询
    tree_search() {
      debounce(() => {
        loadCmmTreeCoreOrgTree({ text: this.tree_searchVal }).then(res => {
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
    // 异步加载数据
    tree_onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        loadCmmTreeCoreOrgTree({ croatUuid: treeNode.dataRef.croatUuid }).then(res => {
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
          treeNode.dataRef.children = res.data
          this.tree_data = [...this.tree_data]
          this.tree_initData = this.tree_data
          resolve()
        })
      })
    },
    // 请求数据
    fetchData() {
      loadCmmTreeCoreOrgTree({ croatUuid: '' }).then(res => {
        res.data.forEach(element => {
          // this.tree_data = []
          if (element.parent) {
            element.isLeaf = false
            element.checkable = false
            element.slots = { icon: 'tree-gov' }
          } else {
            element.isLeaf = true
            element.checkable = true
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
.tree_model {
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
}
</style>
