<template>
  <div class="form-container">
    <div class="form-header">
      <div class="form-header-left">
        <a-button v-for="item in btnList" :key="item.text" type="primary" @click="getSumbit(item)">{{ item.text }}</a-button>
        <a-button type="primary" @click="setNewTemplate">新建模板</a-button>
      </div>
      <div class="form-header-right">
        <a-button @click="closeTem">关闭</a-button>
      </div>
    </div>
    <AddTaskForm ref="addTaskForm" @closeNew="closeNew" />
  </div>
</template>
<script>
import { win_close, save_success } from '@/utils/common'
import { findCmdsByNode } from '@/api/task'
export default {
  components: {
    AddTaskForm: () => import('./components/addTaskForm')
  },
  data() {
    return {
      btnList: []
    }
  },
  mounted() {
    findCmdsByNode().then(res => {
      if (res.success) {
        this.btnList = res.data
      } else {
        this.$message.error('刷新重试')
      }
    })
  },
  methods: {
    setNewTemplate() {
      // 新建模板跳转
      const routeData = this.$router.resolve({
        path: '/form/setNewTemplate',
        query: {
          task: 'task'
        }
      })
      const newWin = window.open(routeData.href, '_blank')
      const loop = setInterval(() => {
        if (newWin.closed) {
          const newTask = localStorage.getItem('taskTemplate')
          if (newTask) {
            // this.$refs.addTaskForm.setTemplate(newTask)
            localStorage.removeItem('taskTemplate')
          }
          clearInterval(loop)
        }
      }, 1000)
    },
    closeTem() {
      win_close()
    },
    closeNew() {
      save_success(() => { win_close() })
    },
    getSumbit(item) {
      this.$confirm({
        title: `确定要${item.text}该任务吗？`,
        centered: true,
        onOk: () => {
          this.$refs.addTaskForm.getSumbit(item)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/default-form.less';
</style>
