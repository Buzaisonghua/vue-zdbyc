<template>
  <div class="table-container">
    <!-- 表格操作 -->
    <div class="table-header">
      <div class="table-header-left">
        <a-button type="primary" @click="add_task">下发任务</a-button>
      </div>
      <div class="table-header-right">
        <a-input v-model="searchVal" type="text" placeholder="请输入关键词" @pressEnter="do_search('search')" />
        <a-button type="primary" @click="do_search('search')">查询</a-button>
        <a-button @click="do_search('reset')">重置</a-button>
        <a-button type="primary" @click="closeSearch">高级查询</a-button>
      </div>
    </div>
    <TaskTable ref="taskTable" :type="type" />
    <SearchMost :show-search-most="showSearchMost" @closeSearch="closeSearch" />
  </div>
</template>

<script>
export default {
  components: {
    TaskTable: () => import('./components/TaskTable'),
    SearchMost: () => import('./components/SearchMost')
  },
  props: {
    type: {
      type: String,
      default: () => '0'
    }
  },
  data() {
    return {
      searchVal: '',
      showSearchMost: false
    }
  },
  methods: {
    closeSearch(data) {
      this.showSearchMost = !this.showSearchMost
      if (Object.prototype.toString.call(data) === '[object Object]') {
        this.$refs.taskTable.search('most', data)
      }
    },
    do_search(type) {
      if (type === 'reset') {
        this.searchVal = ''
      }
      this.$refs.taskTable.search(type, this.searchVal)
    },
    add_task() {
      // 新建模板跳转
      const routeData = this.$router.resolve({
        path: '/form/addTask'
      })
      const newWin = window.open(routeData.href, '_blank')
      const loop = setInterval(() => {
        if (newWin.closed) {
          this.$refs.taskTable.getData()
          clearInterval(loop)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/table-list.less';
</style>
