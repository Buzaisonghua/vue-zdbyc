<template>
  <div class="form-container">
    <div class="form-header">
      <div class="form-header-left">
        <a-button type="primary" @click="get_add">保存</a-button>
        <a-button type="primary" @click="getAddTemplate('bsttName')">{{ !addForm.bsttFormid ? '制作模板' : '修改模板' }}</a-button>
        <!-- <a-button type="primary" @click="get_close">取消</a-button> -->
        <!-- <p v-if="addForm.bsttFormid" class="get_add_template" @click="lookTemplate">点击预览模板</p>  -->
      </div>
      <div class="form-header-right">
        <a-button @click="get_close">关闭</a-button>
      </div>
    </div>
    <div class="form-main">
      <div class="form-section">
        <div class="form-section-title">新建模板</div>
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
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="模板名称" prop="bsttName">
                <a-input ref="bsttName" v-model="formInfo.bsttName" placeholder="给模板起个名字" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="模板描述" prop="bsttDesc">
                <a-textarea
                  ref="bsttDesc"
                  v-model="formInfo.bsttDesc"
                  :max-length="2000"
                  placeholder="请输入模板详细描述"
                  :rows="4"
                  @change="changeBsttDesc"
                />
                <span class="fontnum">{{ fontnum }} / 2000</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="模板状态">
                <span class="type_title">自有</span>
              </a-form-model-item>
            </a-col>
          </a-row>
          <transition name="fade">
            <a-row>
              <a-col :span="24">
                <a-form-model-item label="共享范围">
                  <a-input v-model="formInfo.bsttShareusername" read-only @click="setPeople" />
                  <span class="suffix" @click="setPeople">
                    <svg-icon icon-class="add" class="icon-add" />
                  </span>
                </a-form-model-item>
              </a-col>
            </a-row>
          </transition>
          <!-- <p v-if="" class="get_add_template" >点击制作模板</p>
          <p v-if="addForm.bsttFormid" class="get_add_template" @click="lookTemplate">点击预览模板</p> -->
        </a-form-model>
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
      <TreeScope ref="tree_scope" />
    </a-modal>
  </div>
</template>
<script>
import { win_close, save_success } from '@/utils/common'
import { templateAddFormApi, templateAddApi, templateNameCheckApi } from '@/api/power'
import { temUrl } from '@/api/template'
const checkOnly = (rule, value, callback) => {
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
export default {
  components: {
    TreeScope: () => import('@/components/tree/tree-scope') // 使用范围
  },
  data() {
    return {
      task: false,
      showAdd: false,
      formInfo: {},
      rules: {
        bsttName: [
          {
            required: true,
            message: '给模板起个名字',
            trigger: 'change'
          },
          {
            validator: checkOnly,
            trigger: 'change'
          }
        ],
        bsttDesc: [
          {
            required: true,
            message: '请输入模板详细描述',
            trigger: 'change'
          }
        ],
        bsttShareusername: [
          {
            validator: this.checkName
          }
        ]
      },
      fontnum: 0,
      addForm: {},
      treeUserShow: false,
      uuid: '', // 选择树ID
      croatTitle: '' // 共享人名称
    }
  },
  mounted() {
    this.task = !!this.$route.query.task
  },
  methods: {
    changeBsttDesc() {
      this.fontnum = this.formInfo.bsttDesc.length
    },
    checkName(rule, value, callback) {
      if (!this.formInfo.bsttShareusername) {
        callback(new Error('请选择共享对象'))
      }
      callback()
    },
    get_add() {
      // 保存，新建模板
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (JSON.stringify(this.addForm) === '{}') {
            this.$warning({
              title: '请先制作模板！',
              centered: true,
              okText: '确定'
            })
          } else {
            this.templateAdd()
          }
        } else {
          if (!this.formInfo.bsttName) {
            this.$refs.bsttName.focus()
          } else if (!this.formInfo.bsttDesc) {
            this.$refs.bsttDesc.focus()
          } else if (this.showAdd && !this.formInfo.bsttShareusername) {
            this.setPeople()
          }
          return false
        }
      })
    },
    templateAdd() {
      const data = {
        bsttName: this.formInfo.bsttName,
        bsttDesc: this.formInfo.bsttDesc,
        bsttSharestatus: '2',
        bsttFormid: this.addForm.bsttFormid
      }
      if (this.uuid) {
        data.bsttShareuserid = this.uuid // 选择树ID
        data.bsttShareusername = this.formInfo.bsttShareusername
      }
      templateAddApi(data).then(res => {
        if (res.success) {
          if (this.task) {
            localStorage.taskTemplate = JSON.stringify({
              res
            })
          }
          console.log(res)
          save_success(() => { win_close() })
        } else {
          this.$message.error('刷新重试')
        }
      })
    },
    setPeople() {
      this.treeUserShow = true
    },
    changeBsttSharestatus(e) {
      if (e.target.value === 1) {
        this.showAdd = true
      } else {
        this.showAdd = false
      }
    },
    getAddTemplate(ele) {
      if (!this.addForm.bsttFormid) {
        // 新建模板
        this.$refs.ruleForm.validateField(ele, valid => {
          if (!valid) {
            templateAddFormApi({ bsttName: this.formInfo.bsttName }).then(res => {
              this.addForm = res
              window.open(temUrl + res.bsttFormurl)
            })
          } else {
            this.$refs[ele].focus()
            return false
          }
        })
      } else {
        window.open(temUrl + this.addForm.bsttFormurl)
      }
    },
    get_close() {
      win_close()
    },
    // 人员选择树
    treeUserOk() {
      const uuidarr = []
      const namearr = []
      const userarr = this.$refs['tree_scope'].tree_resultList
      this.treeUserShow = false
      if (userarr.length === 0) {
        this.uuid = ''
        this.croatTitle = ''
      } else {
        userarr.forEach(item => {
          uuidarr.push(item.crorgUuid)
          namearr.push(item.crorgName)
        })
        this.uuid = uuidarr.join()
        this.croatTitle = namearr.join()
        this.formInfo.bsttShareusername = this.croatTitle
      }
    },
    treeUserCancel() {
      this.treeUserShow = false
    },
    lookTemplate() {
      window.open(temUrl + this.addForm.formViewUrl)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/default-form.less';
/deep/ .ant-input[disabled] {
  background: transparent;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.type_title{
  border: 1px solid rgb(47, 84, 235);
  color: rgb(47, 84, 235);
  padding: 5px 8px;
  border-radius: 4px;
  background: rgba(47, 84, 235, .1);
}
</style>
<style>

</style>
