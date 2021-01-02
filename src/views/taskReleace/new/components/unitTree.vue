<template>
  <a-modal
    class="tree_model"
    title="填报单位"
    centered
    :width="800"
    :mask-closable="false"
    :visible="treeScopeShow"
    @ok="treeScopeOk"
    @cancel="treeScopeCancel"
  >
    <TreeScope ref="tree_scope" />
  </a-modal>
</template>
<script>
import TreeScope from '@/components/tree/tree-scope'
export default {
  components: {
    TreeScope // 使用范围
  },
  props: {
    treeScopeShow: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    treeScopeOk() {
      const uuidarr = []
      const namearr = []
      const userarr = this.$refs['tree_scope'].tree_resultList
      const data = {}
      if (userarr.length === 0) {
        data.uuid = ''
        data.name = ''
      } else {
        userarr.forEach(item => {
          uuidarr.push(item.crorgUuid)
          namearr.push(item.crorgName)
        })
        data.uuid = uuidarr.join()
        data.name = namearr.join()
      }
      this.treeScopeCancel(data)
    },
    treeScopeCancel(data) {
      this.$emit('setUnit', data)
    }
  }
}
</script>
