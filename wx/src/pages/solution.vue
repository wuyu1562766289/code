<template>
  <div style="position: relative; transform: scale3d(1, 1, 1); height: calc(100vh - 2px);">
    <Header :back="true" text="更多解决方案"></Header>
    <div class="search">
      <a-input style="border-radius: 22px; background: #F5F5F5;" @keyup.enter="searchFun" v-model:value="searchValue" placeholder="请输入采购单进行查询" />
    </div>
    <div class="page_list">
      <a-card class="card" v-for="(item, index) in pageData" :key="index" @click="jumpToDetail(item.id)">
        <p class="card-title">{{item.title}}</p>
        <p class="card-content">{{item.content}}</p>
        <p class="card-time">{{item.time}}</p>
      </a-card>
    </div>
    <div class="msg-tip">
      <p>未找到解决方案？<span style="color:#2445F4" @click="$router.push('message')">转人工客服</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import router from 'router/index.ts'

import Header from 'comps/Header.vue'

export default defineComponent({
  components: {
    Header
  },
  setup () {
    const searchValue = ref<string>('')
    const pageData = reactive<any>([{
      title: '怎么才算秒杀/抢购成功呢？',
      content: '的高房价阿士大夫建行卡来说阿斯顿发的阿斯顿发斯蒂芬阿斯顿发的撒旦法师的发阿斯顿发斯蒂芬阿斯顿发阿萨达大法师大法师打发撒旦法那噶十多个阿士大夫干的俺大哥发',
      time: '2021-04-09 10:00:00',
      id: 1
    },
    {
      title: '怎么dsfa成功呢？',
      content: '加速度快了附件阿喀琉斯砥节奉公vjcxlk;jfgasd;ISDas极度空灵放话就阿喀琉斯阿萨德发那么阿斯顿发刚俺舍不得我八十多把史蒂芬港八十多安师大八十多阿莎吧阿巴町发吧阿巴町阿把史蒂芬港八十多分八十多分把史蒂芬港八十多法改变水电费',
      time: '2021-04-09 10:00:00',
      id: 2
    },
    {
      title: '怎么dsfa成功呢？',
      content: '加速度快了附件阿喀琉斯砥节奉公vjcxlk;jfgasd;ISDas极度空灵放话就阿喀琉斯阿萨德发那么阿斯顿发刚俺舍不得我八十多把史蒂芬港八十多安师大八十多阿莎吧阿巴町发吧阿巴町阿把史蒂芬港八十多分八十多分把史蒂芬港八十多法改变水电费',
      time: '2021-04-09 10:00:00',
      id: 2
    },
    {
      title: '怎么dsfa成功呢？',
      content: '加速度快了附件阿喀琉斯砥节奉公vjcxlk;jfgasd;ISDas极度空灵放话就阿喀琉斯阿萨德发那么阿斯顿发刚俺舍不得我八十多把史蒂芬港八十多安师大八十多阿莎吧阿巴町发吧阿巴町阿把史蒂芬港八十多分八十多分把史蒂芬港八十多法改变水电费',
      time: '2021-04-09 10:00:00',
      id: 2
    },
    {
      title: '怎么dsfa成功呢？',
      content: '加速度快了附件阿喀琉斯砥节奉公vjcxlk;jfgasd;ISDas极度空灵放话就阿喀琉斯阿萨德发那么阿斯顿发刚俺舍不得我八十多把史蒂芬港八十多安师大八十多阿莎吧阿巴町发吧阿巴町阿把史蒂芬港八十多分八十多分把史蒂芬港八十多法改变水电费',
      time: '2021-04-09 10:00:00',
      id: 2
    },
    {
      title: '怎么dsfa成功呢？',
      content: '加速度快了附件阿喀琉斯砥节奉公vjcxlk;jfgasd;ISDas极度空灵放话就阿喀琉斯阿萨德发那么阿斯顿发刚俺舍不得我八十多把史蒂芬港八十多安师大八十多阿莎吧阿巴町发吧阿巴町阿把史蒂芬港八十多分八十多分把史蒂芬港八十多法改变水电费',
      time: '2021-04-09 10:00:00',
      id: 2
    }])

    const searchFun = () => {
      console.log(searchValue.value)
    }

    const jumpToDetail = (id: any) => {
      console.log(id)
      router.push({ name: 'solution-detail', params: { id }})
    }

    return {
      searchValue,
      pageData,

      searchFun,
      jumpToDetail
    }
  }
})
</script>

<style scoped>
.search {
  background: #fff;
  padding: 6px 10px;
}
::v-global(.ant-card-body) {
  padding: 14px 8px;
}
.page_list {
  display: block;
  height: calc(100vh - 138px);
  overflow: auto;
  overscroll-behavior: contain;
  -ms-scroll-chaining: contain;
}
.card {
  margin: 10px 10px 0 10px;
  border-radius: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
  margin: 0;
}
.card-content {
  margin: 14px 0 17px 0;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 18px;
}
.card-time {
  font-size: 12px;
  font-weight: 400;
  color: #9C9C9C;
  line-height: 16px;
  margin: 0;
}
.msg-tip {
  height: 49px;
  background: rgb(255, 255, 255);
  text-align: center;
  line-height: 49px;
  position: fixed;
  width: calc(100%);
  bottom: 0;
}
</style>