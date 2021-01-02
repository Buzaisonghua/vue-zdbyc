<template>
  <a-modal
    class="tree_model"
    title="模板选择"
    centered
    :width="1200"
    :mask-closable="false"
    :visible="showTemplate"
    @ok="templateOk"
    @cancel="templateCancel"
  >
    <TemplateListMain ref="templateMain" @setTemplateName="setTemplateName" />
  </a-modal>
</template>
<script>
export default {
  components: {
    TemplateListMain: () => import('./TemplateListMain')
  },
  props: {
    showTemplate: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    templateCancel() {
      this.$emit('setTemplate')
    },
    templateOk() {
      this.$refs.templateMain.getTemplate()
    },
    setTemplateName(data) {
      this.$emit('setTemplate', data)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal-body{
    padding: 0 24px 24px;
}
</style>
