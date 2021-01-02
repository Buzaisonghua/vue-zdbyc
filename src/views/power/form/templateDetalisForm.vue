<template>
  <div class="form-container">
    <div class="form-header">
      <div v-if="task" class="form-header-left">
        <a-button
          type="primary"
          @click="setTemplate"
        >使用</a-button>
      </div>
      <div v-else class="form-header-left">
        <a-button v-if="(setBtn === '1' || setBtn === '2') && !isMy" type="primary" @click="get_sumbit">保存</a-button>
        <a-button
          v-if="(setBtn === '1' || setBtn === '2') && formInfo.bsttStatus !== '2' && !isMy"
          type="primary"
          @click="get_share"
        >{{ setBtn === '1' ? '共享' : '取消共享' }}</a-button>
        <a-button v-if="formInfo.bsttSharestatus !== '1' && !isMy" type="primary" @click="start_stop">{{
          formInfo.bsttStatus === '1' ? '禁用' : '启用'
        }}</a-button>
        <a-button v-if="!isMy" type="primary" @click="changeTemplate">修改模板</a-button>
        <a-button v-if="setBtn === '1'" type="primary" @click="get_delete">删除</a-button>
      </div>
      <div class="form-header-right">
        <a-button @click="get_close">关闭</a-button>
      </div>
    </div>
    <div class="form-main">
      <div class="form-section">
        <div class="form-section-title">模板处理</div>
        <div class="form-section-content">
          <a-form-model
            ref="ruleForm"
            :colon="false"
            :model="formInfo"
            :label-col="{flex: '100px'}"
            :wrapper-col="{flex: 'auto'}"
            :rules="rules"
          >
            <a-row>
              <a-col :span="24">
                <a-form-model-item label="模板名称" prop="bsttName">
                  <a-input ref="bsttName" v-model="formInfo.bsttName" placeholder="请输入模板名称" :disabled="isMy" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-model-item label="模板描述" prop="bsttDesc">
                  <a-textarea
                    ref="bsttDesc"
                    v-model="formInfo.bsttDesc"
                    class="text-area-height"
                    :max-length="2000"
                    auto-size
                    :disabled="isMy"
                    placeholder="请输入模板描述"
                    @change="changeBsttDesc"
                  />
                  <span class="fontnum">{{ fontnum }} / 2000</span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-model-item label="模板状态">
                  <span :class="!isMy ? 'type_title' : 'type_title_gray'">{{ templateStatus }}</span>
                </a-form-model-item>
              </a-col>
              <a-col v-if="!isMy" :span="24">
                <a-form-model-item label="共享范围">
                  <a-input v-model="formInfo.bsttShareusername" read-only @click="() => (treeUserShow = true)" />
                  <span class="suffix" @click="() => (treeUserShow = true)">
                    <svg-icon icon-class="add" class="icon-add" />
                  </span>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item :label="!isMy ? '创建单位' : '共享单位'" style="margin-right: 20px">
                  <a-input v-model="formInfo.bsttDeptname" disabled />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item :label="!isMy ? '创建时间' : '共享时间'" style="margin: 0 10px">
                  <a-input :value="!isMy ? formInfo.bsttCreateTime : formInfo.bsttSharetime" disabled />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item :label="!isMy ? '创建人' : '共享人'" style="margin-left: 20px">
                  <a-input v-model="formInfo.bsttCreatorName" disabled />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row v-if="isMy">
              <a-col :span="8">
                <a-form-model-item label="创建单位" style="margin-right: 20px">
                  <a-input v-model="formInfo.bsttDeptname" disabled />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="创建时间" style="margin: 0 10px">
                  <a-input :value="formInfo.bsttCreateTime" disabled />
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- <p v-if="!isMy" class="get_add_template" @click="changeTemplate">点击修改模板</p> -->
            <div v-if="formInfo.formData !== ''" class="form-section-title">模板详情</div>
            <a-row>
              <p class="details_form" v-html="formInfo.formData" />
            </a-row>
          </a-form-model>
        </div>
      </div>
    </div>
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
      <tree-user ref="tree_user" />
    </a-modal>
    <a-modal
      class="tree_model"
      title="共享范围"
      centered
      :width="800"
      :mask-closable="false"
      :visible="treeUserShowEdit"
      @ok="treeUserOkEdit"
      @cancel="treeUserCancelEdit"
    >
      <tree-user ref="tree_user_edit" />
    </a-modal>
  </div>
</template>
<script>
import {
  templateDetailApi,
  templateUpstatusApi,
  templateUpSharestatusApi,
  templateNameCheckApi,
  templateAddApi
} from '@/api/power'
import { win_close, save_success } from '@/utils/common'
import { getUser } from '@/utils/auth'
import { temUrl } from '@/api/template'
export default {
  components: {
    TreeUser: () => import('@/components/tree/tree-scope')
  },
  data() {
    return {
      task: '',
      bsttUuid: '',
      setBtn: '0',
      formInfo: {},
      templateStatus: '',
      treeUserShow: false,
      isMy: true,
      oldName: '',
      fontnum: 0,
      rules: {
        bsttName: [
          {
            required: true,
            message: '请输入模板名称！',
            trigger: 'change'
          },
          {
            validator: this.checkOnly,
            trigger: 'change'
          }
        ],
        bsttDesc: [
          {
            required: true,
            message: '请输入模板描述！',
            trigger: 'change'
          }
        ]
      },
      treeUserShowEdit: false
    }
  },
  computed: {
    users: () => JSON.parse(getUser())
  },
  created() {
    this.bsttUuid = this.$route.query.bsttUuid
    this.task = !!this.$route.query.task
    this.getTemplateDetails()
  },
  methods: {
    changeBsttDesc() {
      this.fontnum = this.formInfo.bsttDesc.length
    },
    checkOnly(rule, value, callback) {
      if (value === this.oldName) {
        callback()
      } else {
        templateNameCheckApi({ bsttName: value }).then(res => {
          if (res.success) {
            if (res.data.msgCode === '10000') {
              callback()
            } else {
              callback(new Error('本单位内模板名称重复，请重新输入模板名称！'))
            }
          } else {
            callback(new Error(res.actionErrors))
          }
        })
      }
    },
    treeUserOk() {
      this.treeUserShow = !this.treeUserShow
      const uuidarr = []
      const namearr = []
      const telarr = []
      const userarr = this.$refs['tree_user'].tree_resultList
      if (userarr.length === 0) {
        this.bsttShareuserid = ''
        this.bsttShareusername = ''
      } else {
        userarr.forEach(item => {
          uuidarr.push(item.crorgUuid)
          namearr.push(item.crorgName)
          telarr.push(`${item.croatTitle}(${item.croatUuid})`)
        })
        this.bsttShareuserid = uuidarr.join()
        this.bsttShareusername = namearr.join()
        this.shareBtn('1')
      }
    },
    treeUserCancel() {
      this.treeUserShow = !this.treeUserShow
    },
    setTemplate() {
      this.$confirm({
        title: '确定要使用该模板吗？',
        centered: true,
        onOk: () => {
          localStorage.taskTemplate = JSON.stringify({
            ...this.formInfo
          })
          win_close()
        }
      })
    },
    start_stop() {
      /**
       * formInfo.bsttStatus
       * 1：当前是启用状态，显示禁用按钮
       * 2：当前是禁用状态，显示启用按钮
       */
      let title
      if (this.formInfo.bsttStatus === '1') {
        title = '确定要禁用模板吗？'
      } else {
        title = '确定要启用模板吗？'
      }
      this.$confirm({
        title: title,
        centered: true,
        onOk: () => {
          const data = { bsttUuid: this.bsttUuid }
          if (this.formInfo.bsttStatus === '1') {
            data.bsttStatus = '2'
          } else {
            data.bsttStatus = '1'
          }
          templateUpstatusApi(data).then(res => {
            if (res.success) {
              this.getTemplateDetails()
              this.$message.success('操作成功')
            } else {
              this.$message.error('刷新重试')
            }
          })
        }
      })
    },
    get_share() {
      if (this.setBtn === '1') {
        this.treeUserShow = true
      } else {
        this.$confirm({
          title: '确定要取消共享模板吗？',
          centered: true,
          onOk: () => {
            this.shareBtn('2')
          }
        })
      }
    },
    changeTemplate() {
      window.open(temUrl + this.formInfo.bsttFormurl)
    },
    /**
     * type：模板当前状态
     * 1：模板处于未共享状态，则有共享按钮
     * 2：模板处于共享状态，则有取消共享按钮
     */
    shareBtn(type) {
      const data = { bsttUuid: this.bsttUuid }
      // 这里是一组模拟数据
      if (type === '1') {
        data.bsttSharestatus = '1'
        data['strMap.shareStatus'] = '1'
        data.bsttShareuserid = this.bsttShareuserid
        data.bsttShareusername = this.bsttShareusername
      } else {
        data.bsttSharestatus = '2'
        data['strMap.shareStatus'] = '2'
      }
      templateUpSharestatusApi(data).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.getTemplateDetails()
        } else {
          this.$message.error('刷新重试')
        }
      })
    },
    get_delete() {
      this.$confirm({
        title: '确定要删除模板吗？',
        centered: true,
        onOk: () => {
          templateUpstatusApi({
            bsttUuid: this.formInfo.bsttUuid,
            bsttStatus: '9'
          }).then(res => {
            if (res.success) {
              save_success(() => win_close())
            } else {
              this.$message.error('刷新重试')
            }
          })
        }
      })
    },
    get_close() {
      win_close()
    },
    getTemplateDetails() {
      templateDetailApi({ bsttUuid: this.bsttUuid })
        .then(res => {
          const isMy = res.bsttCreator === this.users.cractUuid // 判断模板的创建人id与当前登录账号的id是否相同
          this.isMy = !isMy
          this.oldName = res.bsttName
          this.formInfo = res
          this.templateStatus = this.isMy ? '共享' : '自有'
          this.fontnum = this.formInfo.bsttDesc.length
          if (isMy && !res.bsttShareusername) {
            this.setBtn = '1' // 启用禁用、删除、发布共享
          } else if (isMy && res.bsttShareusername) {
            this.setBtn = '2' // 启用禁用，取消共享
          } else {
            this.setBtn = ''
          }
        })
        .catch(e => console.log(e))
    },
    get_sumbit() {
      this.$confirm({
        title: '确定要修改模板信息吗？',
        centered: true,
        onOk: () => {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              this.getSumbitEdit()
            } else {
              // this.$refs.modelSignTemplate.focus()
              if (this.formInfo.bsttName === '') {
                this.$refs.bsttName.focus()
              } else if (this.formInfo.bsttDesc === '') {
                this.$refs.bsttDesc.focus()
              }
              return false
            }
          })
        }
      })
    },
    getSumbitEdit() {
      const data = {
        bsttUuid: this.formInfo.bsttUuid,
        bsttName: this.formInfo.bsttName,
        bsttDesc: this.formInfo.bsttDesc,
        bsttFormid: this.formInfo.bsttFormid
      }
      if (this.formInfo.bsttShareuserid === '' || !this.formInfo.bsttShareuserid) {
        data.bsttSharestatus = '2'
      } else {
        data.bsttSharestatus = '1'
        data.bsttShareuserid = this.formInfo.bsttShareuserid
        data.bsttShareusername = this.formInfo.bsttShareusername
      }
      templateAddApi(data).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.getTemplateDetails()
        } else {
          this.$message.error('刷新重试')
        }
      })
    },
    treeUserCancelEdit() {
      this.treeUserShowEdit = false
    },
    treeUserOkEdit() {
      this.treeUserShowEdit = false
      const uuidarr = []
      const namearr = []
      const telarr = []
      const userarr = this.$refs['tree_user_edit'].tree_resultList
      if (userarr.length === 0) {
        this.formInfo.bsttShareuserid = ''
        this.formInfo.bsttShareusername = ''
      } else {
        userarr.forEach(item => {
          uuidarr.push(item.crorgUnid)
          namearr.push(item.crorgName)
          telarr.push(`${item.croatTitle}(${item.croatUuid})`)
        })
        this.formInfo.bsttShareuserid = uuidarr.join()
        this.formInfo.bsttShareusername = namearr.join()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/layui.css';
@import '~@/styles/common.css';
/deep/ .ant-input[disabled] {
  background: transparent;
}
.type_title{
  border: 1px solid rgb(47, 84, 235);
  color: rgb(47, 84, 235);
  padding: 5px 8px;
  border-radius: 4px;
  background: rgba(47, 84, 235, .1);
}
.type_title_gray{
  border: 1px solid #ff7145;
  color: #ff7145;
  padding: 5px 8px;
  border-radius: 4px;
  background: rgba(255,113,69, .1);
}
.get_add_template {
  padding-left: 100px;
  padding-bottom: 16px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  &:hover {
    color: #d94141;
    text-decoration: underline;
    opacity: 0.7;
  }
  &:active {
    color: #999;
  }
}
.details_form{
  pointer-events: none;
}

</style>
