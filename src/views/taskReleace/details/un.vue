<template>
  <div>未发布任务详情</div>
</template>
<script>
import { getDetailsDatas } from './getDetailsData'
export default {
  mounted() {
    this.bstdFilinDeptname = this.$route.query.bstdFilinDeptname
    this.bstdTaskuuid = this.$route.query.bstdTaskuuid
    this.getDatas()
  },
  methods: {
    getDatas() {
      getDetailsDatas({
        bstdFilinDeptname: this.bstdFilinDeptname,
        bstdTaskuuid: this.bstdTaskuuid
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
