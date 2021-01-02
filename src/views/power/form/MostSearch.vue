<template>
  <a-modal :visible="showSearchTemplate" width="700px" title="高级查询" @ok="okSearchTemplate" @cancel="cancelSearch">
    <div class="most_search">
      <a-form :label-col="{flex: '100px'}" :wrapper-col="{flex: 'auto'}">
        <div class="input_item">
          <a-form-item label="模板名称："><a-input v-model="templateVal" /></a-form-item>
          <a-form-item label="创建单位：">
            <a-input v-model="companyVal" read-only @click="setCompany" />
            <span class="suffix" @click="setCompany">
              <svg-icon icon-class="add" class="icon-add" />
            </span>
          </a-form-item>
          <a-form-item label="关键字："><a-input v-model="searchVal" /></a-form-item>
        </div>
      </a-form>
      <a-modal
        class="tree_model"
        title="创建单位"
        centered
        :width="800"
        :mask-closable="false"
        :visible="treeUnitShow"
        @ok="treeUnitOk"
        @cancel="treeUnitCancel"
      >
        <TreeUnit ref="tree_unit" />
      </a-modal>
    </div>
  </a-modal>
</template>
<script>
import TreeUnit from '@/components/tree/tree-unit'
export default {
  components: {
    TreeUnit
  },
  props: {
    showSearchTemplate: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      templateVal: '',
      companyVal: '',
      companyUuid: '',
      searchVal: '',
      treeUnitShow: false
    }
  },
  methods: {
    setCompany() {
      this.treeUnitShow = !this.treeUnitShow
    },
    Reset() {
      this.templateVal = ''
      this.companyVal = ''
      this.companyUuid = ''
      this.searchVal = ''
    },
    treeUnitOk() {
      this.treeUnitShow = false
      const uuidarr = []
      const namearr = []
      const unitarr = this.$refs['tree_unit'].tree_resultList
      if (unitarr.length !== 0) {
        unitarr.forEach(item => {
          uuidarr.push(item.crorgUuid)
          namearr.push(item.crorgName)
        })
        this.companyVal = unitarr[0].crorgName
        this.companyUuid = unitarr[0].crorgUuid
      } else {
        this.companyVal = ''
        this.companyUuid = ''
      }
    },
    treeUnitCancel() {
      this.treeUnitShow = false
    },
    okSearchTemplate() {
      this.$emit('closeSearch', {
        templateVal: this.templateVal,
        companyVal: this.companyVal,
        companyUuid: this.companyUuid,
        searchVal: this.searchVal
      })
      this.templateVal = ''
      this.companyVal = ''
      this.companyUuid = ''
      this.searchVal = ''
    },
    cancelSearch() {
      this.$emit('closeSearch', '1')
    }
  }
}
</script>
<style lang="less" scoped>
.input_item .ant-row.ant-form-item {
  display: flex;
}
.input_item .ant-form-item-children {
  position: relative;
  .suffix {
    position: absolute;
    right: 0;
    top: -9px;
    bottom: 0;
    width: 40px;
    height: 36px;
    border-left: 1px solid #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
