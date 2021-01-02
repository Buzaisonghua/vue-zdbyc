<template>
  <div :style="{height: tableheight + 'px', 'padding-top': '1px'}" class="config_box">
    <div class="form-container">
      <div class="form-header">
        <div class="form-header-left">
          <a-button type="primary" @click="getSumbit">保存</a-button>
        </div>
        <div class="form-header-right" />
      </div>
      <div class="form-main list_height">
        <div v-for="(item, key) in company" :key="key" class="form-section">
          <div class="company_name">单位：{{ item.bsobDeptname }}</div>
          <div class="form-section-content get_margin_left">
            <a-form-model
              ref="ruleForm"
              :colon="false"
              :label-col="{flex: '100px'}"
              :wrapper-col="{flex: 'auto'}"
            >
              <div class="form-section-title">任务发布</div>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item label="下发人">
                    <a-input v-model="item.bsobPublishUsername" read-only @click="setLuees(key, 'luess')" />
                    <span class="suffix" @click="setLuees(key, 'luess')">
                      <svg-icon icon-class="add" class="icon-add" />
                    </span>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="form-section-title">信息报送</div>
              <a-row class="get_bottom_border">
                <a-col :span="24">
                  <a-form-model-item label="上报人">
                    <a-input v-model="item.bsobFillinUsername" read-only @click="setLuees(key, 'appear')" />
                    <span class="suffix" @click="setLuees(key, 'appear')">
                      <svg-icon icon-class="add" class="icon-add" />
                    </span>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      class="tree_model"
      title="联系方式"
      centered
      :width="800"
      :mask-closable="false"
      :visible="treeUserShow"
      @ok="treeUserOk"
      @cancel="handleChkPhone"
    >
      <tree-user v-if="treeUserShow" ref="tree_user" />
    </a-modal>
  </div>
</template>
<script>
import { getUser } from '@/utils/auth'
import { orguserbindAllList, orguserbindEdit } from '@/api/configSet'
import TreeUser from '@/components/tree/tree-user'
export default {
  components: {
    TreeUser
  },
  data() {
    return {
      tableheight: 0,
      company: [],
      treeUserShow: false,
      keys: 0,
      val: ''
    }
  },
  computed: {
    users: () => JSON.parse(getUser())
  },
  mounted() {
    this.tableheight = document.body.clientHeight - 132
    orguserbindAllList({}).then(res => {
      this.company = [{}]
      // console.log(this.users)
      this.company[0].bsobDeptid = this.users.strMap.orgUuid
      this.company[0].bsobDeptname = this.users.strMap.orgName
      this.company[0].bsobPublishUserid = res.data.bsobPublishUserid || ''
      this.company[0].bsobPublishUsername = res.data.bsobPublishUsername || ''
      this.company[0].bsobFillinUserid = res.data.bsobFillinUserid || ''
      this.company[0].bsobFillinUsername = res.data.bsobFillinUsername || ''
      this.company[0].bsobUuid = res.data.bsobUuid || ''
      // if (res.hasOwnProperty('bsobDeptid')) {
      //   console.log(111)
      // }
      // this.company = res.data
    })
  },
  methods: {
    getSumbit() {
      const data = {
        ...this.company[0]
      }
      orguserbindEdit(data).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
        } else {
          this.$message.error('刷新重试！')
        }
      })
    },
    setLuees(key, val) {
      this.treeUserShow = true
      this.keys = key
      this.val = val
    },
    handleChkPhone() {
      this.treeUserShow = false
    },
    treeUserOk() {
      const uuidarr = []
      const namearr = []
      const userarr = this.$refs['tree_user'].tree_resultList
      if (userarr.length === 0) {
        return
      }
      userarr.forEach(item => {
        uuidarr.push(item.croatRefUuid)
        namearr.push(item.croatTitle)
      })
      if (this.val === 'luess') {
        this.company[this.keys].bsobPublishUserid = uuidarr.join()
        this.company[this.keys].bsobPublishUsername = namearr.join()
      } else {
        this.company[this.keys].bsobFillinUserid = uuidarr.join()
        this.company[this.keys].bsobFillinUsername = namearr.join()
      }
      this.treeUserShow = false
      // console.log(this.company[0])
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/default-form.less';
.form-container{
  height: calc(100% - 21px);
}
.list_height{
  height: calc(100% - 33px);
  overflow-y: auto;
}
.company_name{
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  font-weight: bold;
}
.get_bottom_border{
  border-bottom: 1px solid #f5f5f5;
}
.form-container .form-main .form-section .form-section-title[data-v-2cfd1db2]{
  margin-top: 12px;
}
.get_margin_left{
  margin-left: 24px;
}
</style>
