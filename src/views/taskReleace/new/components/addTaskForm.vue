<template>
  <div class="form-main">
    <div class="form-section">
      <div class="form-section-title">任务下发</div>
    </div>
    <div class="form-section-content">
      <a-form-model
        ref="ruleForm"
        :model="formInfo"
        :rules="rules"
        :colon="false"
        :label-col="{flex: '100px'}"
        :wrapper-col="{flex: 'auto'}"
      >
        <a-form-model-item label="任务主题" prop="bstpTheme">
          <a-input ref="bstpTheme" v-model="formInfo.bstpTheme" placeholder="给任务起个名字" />
        </a-form-model-item>
        <a-form-model-item label="截止日期" prop="bstpDeadline">
          <a-date-picker
            ref="bstpDeadline"
            placeholder="请选择截止日期"
            @change="changePicker"
          />
        </a-form-model-item>
        <a-form-model-item label="任务描述" prop="bstpDesc">
          <a-textarea
            ref="bstpDesc"
            v-model="formInfo.bstpDesc"
            :max-length="2000"
            placeholder="请输入模板详细描述"
            :rows="4"
            @change="changeBsttDesc"
          />
          <span class="fontnum">{{ fontnum }} / 2000</span>
        </a-form-model-item>
        <a-form-model-item label="任务类型" prop="bstpType">
          <a-select v-model="formInfo.bstpType" placeholder="请选择人物类型">
            <a-select-option v-for="item in dictComboList" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="填报单位" prop="bstpFillinDeptname">
          <a-input v-model="formInfo.bstpFillinDeptname" placeholder="请选择填报单位" @click="setUnit('unit')" />
          <span class="suffix" @click="setUnit">
            <svg-icon icon-class="add" class="icon-add" />
          </span>
        </a-form-model-item>
        <a-form-model-item label="共享范围">
          <a-input v-model="formInfo.bstpShareUsername" placeholder="请选择共享范围" read-only @click="setUser('user')" />
          <span class="suffix">
            <svg-icon icon-class="add" class="icon-add" @click="setUser('user')" />
          </span>
        </a-form-model-item>
        <a-form-model-item label="选择模板">
          <a-input v-model="formInfo.bstpTemplatename" placeholder="请选择模板" read-only @click="setTemplate" />
          <span class="suffix">
            <svg-icon icon-class="add" class="icon-add" @click="setTemplate" />
          </span>
        </a-form-model-item>
      </a-form-model>
    </div>
    <UnitTree :tree-scope-show="treeScopeShow" @setUnit="setUnit" />
    <UserTree :tree-user-show="treeUserShow" @setUser="setUser" />
    <TemplateList :show-template="showTemplate" @setTemplate="setTemplate" />
  </div>
</template>
<script>
import { dictCombo, doWorkFlowModelExecute } from '@/api/task'
export default {
  components: {
    UnitTree: () => import('./unitTree'),
    UserTree: () => import('./userTree'),
    TemplateList: () => import('./TemplateList')
  },
  data() {
    return {
      treeScopeShow: false,
      treeUserShow: false,
      showTemplate: false,
      unitType: '',
      userType: '',
      bstpDeadlineOpen: false,
      formInfo: {
        bstpTheme: '', // String是任务主题
        bstpDeadline: '', // String是截止日期
        bstpDesc: '', // String是任务描述
        bstpType: '', // 任务类型
        bstpFillinDeptid: '', // 填报单位id
        bstpFillinDeptname: '', // 填报单位name
        bstpIsshare: '', // 是否共享（1共享，2不共享）
        bstpShareUserid: '', // 用户id（最多20个用，分隔）
        bstpShareUsername: '', // 共享用户name
        bstpTemplateuuid: '', // 模板id
        bstpTemplatename: '' // 模板名称
      },
      fontnum: 0,
      templateList: [],
      dictComboList: [],
      btnData: {},
      rules: {
        bstpTheme: [
          {
            required: true,
            message: '给模板起个名字',
            trigger: 'change'
          }
        ],
        bstpDeadline: [
          {
            required: true,
            message: '请选择截至时间',
            trigger: 'change'
          }
        ],
        bstpDesc: [
          {
            required: true,
            message: '请输入模板详细描述',
            trigger: 'change'
          }
        ],
        bstpType: [
          {
            required: true,
            message: '请选择任务类型',
            trigger: 'change'
          }
        ],
        bstpFillinDeptname: [
          {
            required: true,
            message: '请选择填报单位',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    // 任务列表
    dictCombo().then(res => {
      if (res.success) {
        this.dictComboList = res.data
      } else {
        this.$message.error('刷新重试')
      }
    })
  },
  methods: {
    changePicker(e) {
      this.formInfo.bstpDeadline = e.format('YYYY-MM-DD HH:mm:ss')
      // new Date().getTime / 1000
    },
    changeBsttDesc(e) {
      this.fontnum = this.formInfo.bstpDesc.length
    },
    setUnit(data) {
      this.treeScopeShow = !this.treeScopeShow
      if (data === 'unit') {
        // 选择填报单位
        this.unitType = 'unit'
      } else if (data === '') {
        this.unitType = ''
      } else if (data) {
        if (this.unitType === 'unit') {
          // 填报单位选择树点击确定后
          this.setFillinDeptname(data)
          this.$refs.ruleForm.validateField('bstpFillinDeptname', valid => { // 这里单独验证一下
            if (valid) {
              return false
            }
          })
        }
      }
    },
    setUser(data) {
      this.treeUserShow = !this.treeUserShow
      if (data === 'user') {
        this.userType = 'user'
      } else if (data) {
        if (this.userType === 'user') {
          this.formInfo.bstpShareUsername = data.name
          this.formInfo.bstpShareUserid = data.uuid
        }
      }
    },
    setTemplate(data) {
      this.showTemplate = !this.showTemplate
      if (Object.prototype.toString.call(data) === '[object Object]') {
        this.formInfo.bstpTemplateuuid = data.bsttUuid // 模板id
        this.formInfo.bstpTemplatename = data.bsttName // 模板名称
      }
    },
    setFillinDeptname(data) {
      this.formInfo.bstpFillinDeptname = data.name
      this.formInfo.bstpFillinDeptid = data.uuid
    },
    changeTemplatename(e) {
      this.formInfo.bstpTemplateuuid = this.templateList[e].bsttUuid // 模板id
      this.formInfo.bstpTemplatename = this.templateList[e].bsttName // 模板名称
    },
    // 提交验证必填项
    checkRequired() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 所有的必填都已经填写，这里开始进行下一步的操作
          this.setSumbitData({
            bstpTheme: this.formInfo.bstpTheme,
            bstpDeadline: this.formInfo.bstpDeadline,
            bstpDesc: this.formInfo.bstpDesc,
            bstpType: this.formInfo.bstpType,
            bstpFillinDeptid: this.formInfo.bstpFillinDeptid,
            bstpFillinDeptname: this.formInfo.bstpFillinDeptname
          })
        } else {
          this.checkRequiredMost()
        }
      })
    },
    checkRequiredMost() {
      if (!this.formInfo.bstpTheme) {
        this.$refs.bstpTheme.focus()
      } else if (!this.formInfo.bstpDeadline) {
        this.$refs.bstpDeadline.focus()
      } else if (!this.formInfo.bstpDesc) {
        this.$refs.bstpDesc.focus()
      } else if (!this.formInfo.bstpType) {
        this.$refs.bstpType.select()
      } else if (!this.formInfo.bstpFillinDeptname) {
        this.setUnit('unit')
      }
    },
    setSumbitData(datas) {
      const data = { ...datas }
      data.bstpIsshare = this.formInfo.bstpShareUsername ? '1' : '2'
      data.bstpShareUserid = this.formInfo.bstpShareUsername ? this.formInfo.bstpShareUserid : ''
      data.bstpShareUsername = this.formInfo.bstpShareUsername ? this.formInfo.bstpShareUsername : ''
      data.bstpTemplateuuid = this.formInfo.bstpTemplateuuid
      data.bstpTemplatename = this.formInfo.bstpTemplatename
      data['strMap.wfcmdCode'] = this.btnData.wfcmdCode
      data['strMap.wfcmdRouters'] = this.btnData.wfcmdRouters
      data['strMap.wfcmdRuleName'] = this.btnData.wfcmdRuleName
      doWorkFlowModelExecute(data).then(res => {
        if (res.success) {
          this.$emit('closeNew')
        } else {
          this.$message.error('刷新重试')
        }
      })
    },
    getSumbit(data) {
      this.btnData = data
      this.checkRequired()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/default-form.less';
.type_title{
  border: 1px solid rgb(47, 84, 235);
  color: rgb(47, 84, 235);
  padding: 5px 8px;
  border-radius: 4px;
  background: rgba(47, 84, 235, .1);
}
.ant-calendar-picker{
    width: 100%;
}
</style>
