<template>
  <div class="form-container">
    <div class="details_list_box">
      <div class="details_list">
        <span>任务名称</span>
        <p>{{ taskName }}</p>
      </div>
      <div class="details_list">
        <span>任务倒计时时间</span>
        <p style="color: #d94141">{{ taskTime }}</p>
      </div>
      <div class="details_list">
        <span>填报单位</span>
        <p>{{ taskNnm }}个</p>
      </div>
    </div>
    <div class="table-container">
      <!-- 表格操作 -->
      <div class="table-header">
        <div class="table-header-left">
          <a-button type="primary">一键提醒</a-button>
          <a-button type="primary">批量审批</a-button>
          <a-button type="primary" @click="goDetalisOk">审批纪录</a-button>
        </div>
        <div class="table-header-right">
          <a-input v-model="searchVal" type="text" placeholder="请输入关键词" @pressEnter="do_search" />
          <a-button type="primary" @click="do_search('search')">查询</a-button>
          <a-button @click="do_search('reset')">重置</a-button>
          <a-button @click="get_close">关闭</a-button>
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
      >
        <template slot="status" slot-scope="text">
          <span :style="{color: getStatusColor(text)}">{{ getStatus(text) }}</span>
        </template>
        <template slot="bstdSpstatus" slot-scope="text">
          <span :style="{color: getBstdSpstatusColor(text)}">{{ getBstdSpstatus(text) }}</span>
        </template>
        <template slot="operation">
          <a href="javascript:;">处理</a>
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
  </div>
</template>
<script>
import { showtaskDetialsList } from '@/api/task'
import { win_close } from '@/utils/common'
// , save_success
export default {
  data() {
    return {
      bstdFilinDeptname: '', // "党委机构"
      bstdTaskuuid: '', // "60AB9029A74B4597803A7D716F95B03E"
      limit: 10,
      start: 0,
      taskName: '任务名称',
      taskTime: '任务倒计时',
      taskNnm: '任务数量',
      // 表格操作
      loading: true,
      dataList: [],
      tableheight: 0,
      searchVal: '',
      selectedRowKeys: [],
      selectedRows: [],
      // 分页
      pageSize: 10, // 默认显示条数
      pageNum: 0, // 默认当前页
      total: 0, // 总条数
      pageSizeOptions: ['10', '20', '30', '40', '50'], // 多选
      columns: [
        {
          title: '序号',
          width: '80px',
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: '填报单位',
          align: 'left',
          dataIndex: 'bstdFilinDeptname',
          ellipsis: true
        },
        {
          title: '填报状态',
          width: '120px',
          align: 'center',
          ellipsis: true,
          dataIndex: 'bstdState',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '审批状态',
          width: '120px',
          align: 'center',
          ellipsis: true,
          dataIndex: 'bstdSpstatus',
          scopedSlots: { customRender: 'bstdSpstatus' }
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          ellipsis: true,
          // dataIndex: 'bstpUuid',
          scopedSlots: { customRender: 'operation' }
        }
      ]
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
    this.bstdFilinDeptname = this.$route.query.bstdFilinDeptname
    this.bstdTaskuuid = this.$route.query.bstdTaskuuid
    this.tableheight = document.body.clientHeight - 385
    this.getData()
  },
  methods: {
    do_search() {},
    getStatus(val) {
      switch (val) {
        case '1':
          return '待上报'
        case '2':
          return '已上报'
      }
    },
    getStatusColor(val) {
      switch (val) {
        case '1':
          return '#ffc069'
        case '2':
          return '#9254de'
      }
    },
    getBstdSpstatusColor(val) {
      switch (val) {
        case '1':
          return '#2f54eb'
        case '2':
          return '#ff7a45'
      }
    },
    getBstdSpstatus(val) {
      switch (val) {
        case '1':
          return '通过'
        case '2':
          return '退回'
      }
    },
    changePage(page, PageSize) {
      this._handlePage(page, PageSize)
    },
    changePageSize(current, page) {
      this._handlePage(current, page)
    },
    getData() {
      this.loading = true
      showtaskDetialsList({
        bstdTaskuuid: this.bstdTaskuuid,
        bstdFilinDeptname: this.bstdFilinDeptname,
        limit: this.limit,
        start: this.start
      }).then(res => {
        if (res.success) {
          this.loading = false
          this.dataList = res.data.datalist
          this.total = res.data.datalist.length
          this.taskName = res.data.taskname
          setInterval(() => {
            this.getTaskTime(res.data.deadline)
          }, 1000)
          this.taskNnm = res.data.datalist.length
        } else {
          this.$message.error('刷新重试')
        }
      })
    },
    getTaskTime(time) {
      time = new Date(time).getTime()
      const now = new Date().getTime()
      if (now > time) {
        this.taskTime = '已过期'
      } else {
        const date3 = time - now
        const days = Math.floor(date3 / (24 * 3600 * 1000)) // 天数
        // 计算出小时数
        const leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000))
        // 计算相差分钟数
        const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000))
        // 计算相差秒数
        const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave3 / 1000)
        this.taskTime = days + '天 ' + hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒'
      }
      // console.log(time, now)
    },
    get_close() {
      win_close()
    },
    goDetalisOk() {
      const routeData = this.$router.resolve({
        path: '/form/taskDetailsOk',
        query: {
          bstdTaskuuid: this.bstdTaskuuid,
          'strMap.listType': '1'
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.details_list_box{
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .details_list{
        flex: 1;
        display: flex;
        align-items: center;
        flex-flow: column;
        padding: 10px 0 0;
        border-right: 1px solid #f5f5f5;
        &:last-child{
            border: 0 none;
        }
        p{
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
        }
    }
}
/deep/.ant-pagination{
    height: auto;
}
</style>
