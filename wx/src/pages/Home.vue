<template>
  <Header></Header>
  <div style="padding: 0 30px;">
    <div class="help_class">我们乐于提供协助</div>
    <p class="msg_title">解决商品上架常见问题</p>
    <p class="msg_content">为商品上架提供技术支持，常见问题请戳我</p>
    <a-button class="btn-class" @click="openWindow" type="primary">商品上架流程</a-button>

    <p class="msg_title">如何发起工单</p>
    <p class="msg_content">需求工单正确的发起及审批流程</p>
    <a-button class="btn-class" type="primary">工单发起流程</a-button>

    <p class="msg_title">更多常见问题解决方案</p>
    <p class="msg_content">更多常见问题的解决方案汇总</p>
    <a-button @click="$router.push('solution')" class="btn-class" type="primary">查看更多解决方案</a-button>

    <p class="msg_title">人工客服</p>
    <p class="msg_content">九讯云人工客服7x12小时在线协助解决问</p>
    <a-button class="btn-class" @click="$router.push('message')" type="primary">转九讯云在线客服</a-button>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import Header from 'comps/Header.vue'

export default {
  components: {
    Header
  },
  setup() {
    const openWindow = () => {
      let width = window.screen.width / 2 - 175
      let height = (window.screen.height - 750) / 2
      window.open(
        `http://localhost:8333/`,
        'DescriptiveWindowName',
        `resizable,scrollbars,status,width=400,height=750,top=-${height},left=${width}`
      )
    }

    return {
      openWindow
    }
  }
}
</script>

<style lang="scss" scoped>
.help_class {
  margin: 10px auto;
  width: 192px;
  height: 28px;
  font-size: 24px;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
}
.msg_title {
  height: 18px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 18px;
  margin: 38px 4px 0 0;
}
.msg_content {
  height: 16px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  line-height: 16px;
}
.margin_lr {
  margin: 0 30px;
}
.btn-class {
  margin: 12px 22px 0 0;
  width:100%;
}
</style>
