<template>
  <div>
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
    >
      <template slot="status" slot-scope="text">
        <span :style="{color: getStatusColor(text)}">{{ getStatus(text) }}</span>
      </template>
      <template slot="prop" slot-scope="text">
        <span>{{ getProp(text) }}</span>
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
  </div>
</template>
<script>
import { findListByStatus } from '@/api/task'
export default {
  name: 'TaskTable',
  props: {
    type: {
      type: String,
      default: () => '0'
    }
  },
  data() {
    return {
      loading: true,
      dataList: [],
      tableheight: null,
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '序号',
          width: '80px',
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: '主题',
          width: '140px',
          align: 'center',
          dataIndex: 'bstpTheme',
          ellipsis: true
        },
        {
          title: '描述',
          align: 'left',
          ellipsis: true,
          dataIndex: 'bstpDesc'
        },
        {
          title: '创建单位',
          align: 'center',
          width: '160px',
          ellipsis: true,
          dataIndex: 'bstpDeptname'
        },
        {
          title: '状态',
          width: '120px',
          align: 'center',
          ellipsis: true,
          dataIndex: 'bstpTaskState',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '截止时间',
          width: '200px',
          align: 'center',
          ellipsis: true,
          sorter: (a, b) => {
            return new Date(a.bsttCreateTime).getTime() - new Date(b.bsttCreateTime).getTime()
          },
          dataIndex: 'bstpDeadline',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '完成进度',
          width: '140px',
          align: 'center',
          ellipsis: true,
          dataIndex: 'prop1',
          scopedSlots: { customRender: 'prop' }
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 分页
      pageSize: 10, // 默认显示条数
      pageNum: 0, // 默认当前页
      total: 0, // 总条数
      pageSizeOptions: ['10', '20', '30', '40', '50'] // 多选
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
    }
  },
  mounted() {
    this.getData()
    this.tableheight = document.body.clientHeight - 300
  },
  methods: {
    getTime(text) {
      if (text) {
        return text.slice(0, 16)
      } else {
        return ''
      }
    },
    search(type, data) {
      if (type === 'reset') {
        // 重置
        this.getData()
      } else if (type === 'search') {
        // 普通搜索
        this.getData(data)
      } else if (type === 'most') {
        this.getData(data)
      }
    },
    getStatus(val) {
      switch (val) {
        case '1':
          return '未发布'
        case '2':
          return '已发布'
        case '3':
          return '已完成'
        case '9':
          return '撤回'
      }
    },
    getStatusColor(val) {
      switch (val) {
        case '1':
          return '#ffc069'
        case '2':
          return '#9254de'
        case '3':
          return '#2f54eb'
        case '9':
          return '#ff7a45'
      }
    },
    getProp(text) {
      return (Number(text) / 100).toFixed(0) + '%'
    },
    getData(search) {
      this.loading = true
      const data = {
        'strMap.listType': this.type,
        start: this.pageNum,
        limit: this.pageSize
      }
      if (Object.prototype.toString.call(search) === '[object Object]') {
        data.text = search.searchVal
        data.bstpDeadline = search.bstpDeadline
        data.bstpDepid = search.companyUuid
      } else if (search) {
        data.text = search
      }
      findListByStatus(data).then(res => {
        if (res.success) {
          this.dataList = res.data
          this.total = res.totalCount
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('刷新重试！')
        }
      })
    },
    changePage(page, PageSize) {
      this._handlePage(page, PageSize)
    },
    changePageSize(current, page) {
      this._handlePage(current, page)
    },
    _handlePage(current, size) {
      this.pageNum = (current - 1) * size
      this.pageSize = size
      this.getData()
    },
    to_details(text) {
      // case '1':
      //     return '未发布'
      //   case '2':
      //     return '已发布'
      //   case '3':
      //     return '已完成'
      //   case '9':
      //     return '撤回'
      console.log(text.bstpTaskState)
      let path
      if (text.bstpTaskState === '1') {
        path = '/form/taskDetailsUn'
      } else if (text.bstpTaskState === '2') {
        path = '/form/taskDetailsOn'
      }
      const routeData = this.$router.resolve({
        path: path,
        query: {
          bstdTaskuuid: text.bstpUuid,
          bstdFilinDeptname: text.bstpDeptname
        }
      })
      const newWin = window.open(routeData.href, '_blank')
      const loop = setInterval(() => {
        if (newWin.closed) {
          // this.$refs.taskTable.getData()
          clearInterval(loop)
        }
      }, 1000)
    }
  }
}
</script>
