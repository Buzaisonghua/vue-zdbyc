<template>
  <a-modal
    class="tree_model"
    title="共享范围"
    centered
    :width="800"
    :mask-closable="false"
    :visible="treeUserShow"
    @ok="treeUserOk"
    @cancel="treeUserCancel"
  >
    <TreeUser ref="tree_user" />
  </a-modal>
</template>
<script>
import TreeUser from '@/components/tree/tree-user'
export default {
  components: {
    TreeUser // 使用范围
  },
  props: {
    treeUserShow: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    treeUserOk() {
      const uuidarr = []
      const namearr = []
      const userarr = this.$refs['tree_user'].tree_resultList
      const data = {}
      if (userarr.length === 0) {
        data.uuid = ''
        data.name = ''
      } else {
        userarr.forEach(item => {
          uuidarr.push(item.croatRefUuid)
          namearr.push(item.croatTitle)
        })
        data.uuid = uuidarr.join()
        data.name = namearr.join()
      }
      this.treeUserCancel(data)
    },
    treeUserCancel(data) {
      this.$emit('setUser', data)
    }
  }
}
</script>
