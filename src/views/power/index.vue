<template>
  <div class="table-container">
    <!-- 表格操作 -->
    <div class="table-header">
      <div class="table-header-left">
        <a-button type="primary" @click="setNewTemplate">新建模板</a-button>
        <a-button type="primary" @click="signTemplate">标记模板</a-button>
        <!-- <a-button type="primary" @click="deleteTemplate">删除模板</a-button> -->
      </div>
      <div class="table-header-right">
        <a-input v-model="searchVal" type="text" placeholder="请输入关键词" @pressEnter="do_search" />
        <a-button type="primary" @click="do_search">查询</a-button>
        <a-button @click="do_search('reset')">重置</a-button>
        <a-button type="primary" @click="changeShowSearchTemplate">高级查询</a-button>
      </div>
    </div>

    <!-- 表格 -->
    <a-table
      :loading="loading"
      :row-selection="rowSelection"
      :row-key="
        (record, index) => {
          return index
        }
      "
      :columns="columns"
      :data-source="dataList"
      :pagination="false"
      :scroll="{y: tableheight}"
      @change="handleTableChange"
    >
      <template slot="status" slot-scope="text">
        <span :style="{color: getStatusColor(text)}">{{ getStatus(text) }}</span>
      </template>
      <template slot="operation" slot-scope="text">
        <a href="javascript:;" @click="to_details(text)">处理</a>
      </template>
      <template slot="time" slot-scope="text">
        <span>{{ getTime(text) }}</span>
      </template>
    </a-table>

    <!-- 分页 -->
    <div class="table-pages">
      <a-pagination
        :default-page-size="pageSize"
        :default-current="pageNum"
        :total="total"
        show-size-changer
        show-quick-jumper
        :show-less-items="true"
        :show-total="total => `共 ${total} 条，`"
        @change="changePage"
        @showSizeChange="changePageSize"
      />
    </div>

    <!-- 标记模板对话框 -->
    <a-modal v-model="showSignTemplate" title="标记模板" @ok="cancelSignTemplate">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item label="原因" class="model_sign_template" prop="modelSignTemplate">
          <a-textarea
            ref="modelSignTemplate"
            v-model="form.modelSignTemplate"
            placeholder="请输入标记为负面清单的原因"
            :rows="4"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 高级查询 -->
    <MostSearch ref="mostSearch" :show-search-template="showSearchTemplate" @closeSearch="closeSearch" />
  </div>
</template>
<script>
import { templateListApi, templateUpsignApi } from '@/api/power'
import MostSearch from './form/MostSearch'
import { getUser } from '@/utils/auth'
export default {
  components: {
    MostSearch
  },
  data() {
    return {
      templateVal: '', // 模板名称
      searchVal: '', // 搜素关键词
      companyVal: '',
      filters: [],
      // 表格
      columns: [
        {
          title: '序号',
          width: '80px',
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: '名称',
          width: '200px',
          dataIndex: 'bsttName',
          ellipsis: true
        },
        {
          title: '描述',
          align: 'left',
          ellipsis: true,
          dataIndex: 'bsttDesc'
        },
        {
          title: '创建单位',
          align: 'center',
          width: '160px',
          ellipsis: true,
          dataIndex: 'bsttDeptname'
        },
        {
          title: '状态',
          width: '100px',
          align: 'center',
          ellipsis: true,
          dataIndex: 'bsttCreator',
          scopedSlots: { customRender: 'status' },
          filters: [
            { text: '自有', value: '2' },
            { text: '共享', value: '1' }
          ],
          onFilter: (value, record) => {
            if (value === '1') {
              return this.users.uuid !== record.bsttCreator
            } else {
              return this.users.uuid === record.bsttCreator
            }
          }
        },
        {
          title: '创建时间',
          width: '200px',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'time' },
          sorter: (a, b) => {
            return new Date(a.bsttCreateTime).getTime() - new Date(b.bsttCreateTime).getTime()
          },
          dataIndex: 'bsttCreateTime'
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          ellipsis: true,
          dataIndex: 'bsttUuid',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loading: true,
      tableheight: null,
      dataList: [],
      selectedRows: [],
      selectedRowKeys: [],
      // 分页
      pageSize: 10, // 默认显示条数
      pageNum: 0, // 默认当前页
      total: 0, // 总条数
      pageSizeOptions: ['10', '20', '30', '40', '50'], // 多选
      showSignTemplate: false, // 显示标记对话框
      modelSignTemplate: '', // 标记模板原因
      form: {},
      rules: {
        modelSignTemplate: [
          {
            required: true,
            message: '请输入标记为负面清单的原因',
            trigger: 'change'
          }
        ]
      },
      showSearchTemplate: false, // 高级查询弹框
      out: {}
    }
  },
  computed: {
    // 表格选择项
    rowSelection() {
      return {
        columnWidth: '60',
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    },
    users: () => JSON.parse(getUser())
  },
  mounted() {
    this.tableheight = document.body.clientHeight - 300
    this.fetchList()
  },
  methods: {
    getTime(time) {
      return time.slice(0, 16)
    },
    changeShowSearchTemplate() {
      this.showSearchTemplate = true
    },
    getStatus(val) {
      if (this.users.uuid === val) {
        return '自有'
      } else {
        return '共享'
      }
    },
    getStatusColor(val) {
      if (this.users.uuid === val) {
        return '#2f54eb'
      } else {
        return '#ff7145'
      }
    },
    do_search(type) {
      if (type === 'reset') {
        this.searchVal = ''
        this.out = {}
        this.$refs.mostSearch.Reset()
        this.fetchList()
      } else {
        this.fetchList('list')
      }
    },
    changePage(page, PageSize) {
      this._handlePage(page, PageSize)
    },
    changePageSize(current, page) {
      this._handlePage(current, page)
    },
    fetchList(type, out) {
      const data = {
        start: this.pageNum,
        limit: this.pageSize
      }
      if (type === 'most') {
        data.bsttName = out.templateVal
        data.bsttDepid = out.companyUuid
        data.bsttDesc = out.searchVal
      } else if (type === 'list') {
        data.bsttDesc = this.searchVal
      } else if (type === 'table') {
        data.bsttSharestatus = out
        if (JSON.stringify(this.out) !== '{}') {
          for (const key in this.out) {
            data[key] = this.out[key]
          }
        }
      }
      templateListApi(data)
        .then(res => {
          if (res.success) {
            this.dataList = res.data
            this.total = res.totalCount
            this.loading = false
          } else {
            this.loading = false
            this.$message.error('刷新重试！')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    _handlePage(current, size) {
      this.pageNum = (current - 1) * size
      this.pageSize = size
      this.fetchList()
    },
    changeCompanyVal() {},
    signTemplate() {
      // 标记模板
      if (this.selectedRows.length === 0) {
        this.$warning({
          title: '请选择需要标记的模板！',
          centered: true,
          okText: '确定'
        })
      } else {
        this.showSignTemplate = true
      }
    },
    focusCompanyVal() {
      this.$warning({
        title: '功能开发中！',
        centered: true,
        okText: '确定'
      })
    },
    cancelSignTemplate() {
      // 标记模板框确认
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const arr = []
          this.selectedRows.map(item => {
            arr.push(item.bsttUuid)
          })
          const arrStr = arr.join(',')
          const data = {
            strList: arrStr,
            bsttSignState: '2',
            bsttSignReason: this.form.modelSignTemplate
          }
          templateUpsignApi(data).then(res => {
            this.$message.success('操作成功')
            this.showSignTemplate = false
            this.selectedRows = []
            this.selectedRowKeys = []
            this.fetchList()
          })
        } else {
          this.$refs.modelSignTemplate.focus()
          return false
        }
      })
    },
    setNewTemplate() {
      // 新建模板跳转
      const routeData = this.$router.resolve({
        path: '/form/setNewTemplate'
      })
      const newWin = window.open(routeData.href, '_blank')
      const loop = setInterval(() => {
        if (newWin.closed) {
          this.fetchList()
          clearInterval(loop)
        }
      }, 1000)
    },
    to_details(data) {
      // 详情按钮
      const routeData = this.$router.resolve({
        path: '/form/templateDetails',
        query: {
          bsttUuid: data
        }
      })
      const newWin = window.open(routeData.href, '_blank')
      const loop = setInterval(() => {
        if (newWin.closed) {
          this.fetchList()
          clearInterval(loop)
        }
      }, 1000)
    },
    // 高级查询相关
    closeSearch(data) {
      if (data !== '1') {
        this.fetchList('most', data)
      }
      this.showSearchTemplate = false
    },
    // 分类
    handleTableChange(pagination, filters, sorter) {
      // var allLen = filters.bsttCreator.length
      // this.filters = filters.bsttCreator
      // if (allLen === 0 || allLen === 2) {
      //   this.getSearch('')
      // } else {
      //   this.getSearch(filters.bsttCreator.join())
      // }
    }
    // deleteTemplate () {
    //   if (this.selectedRows.length === 0) {
    //     this.$warning({
    //       title: '请选择需要删除的模板！',
    //       centered: true,
    //       okText: '确定'
    //     })
    //   } else {
    //     this.deleteTemplateFun()
    //   }
    // },
    // deleteTemplateFun () {
    //   let title = ''
    //   this.selectedRows.forEach(val => {
    //     console.log(val)
    //     console.log(val.bsttSharestatus === '2')
    //     if (val.bsttCreator !== this.users.uuid || val.bsttSharestatus === '1') {
    //       title = '不可删除共享模板'
    //     }
    //   })
    //   if (title !== '') {
    //     this.$warning({
    //       title: title,
    //       centered: true,
    //       okText: '确定'
    //     })
    //   } else {
    //     alert(111)
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/table-list.less';
/deep/.table-header-right .ant-select-selection--single {
  width: 200px;
  height: 34px;
}
/deep/ .table-header-right .ant-select-selection--single .ant-select-selection__rendered {
  line-height: 34px;
}
.get_margin_right {
  margin-right: 10px;
}
.model_sign_template {
  display: flex;
}
/deep/ .model_sign_template .ant-form-item-control-wrapper {
  flex: 1;
}
</style>
