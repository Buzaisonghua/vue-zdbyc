<template>
  <div class="form-container">
    <div class="form-header">
      <div class="form-header-left" />
      <div class="form-header-right">
        <a-button>关闭</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { showListbyShStatus } from '@/api/task'
export default {
  mounted() {
    this.bstdTaskuuid = this.$route.query.bstdTaskuuid
    console.log(this.bstdTaskuuid)
    showListbyShStatus({ ...this.$route.query }).then(res => console.log(1))
  }
}
</script>
