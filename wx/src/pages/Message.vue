<template>
  <div class="content">
    <!-- 头部 -->
    <Header :back="true" :finish="true" @finishFun="showConfirm"></Header>

    <div class="msg_list" :style="contentHeight">
      <!-- <div style="margin: 10px;">
        <div style="display: flex;">
          <img style="width:40px;height:40px;" src="../assets/images/support_staff.png" alt="" />
          <div>
            <p class="smart">智能客服</p>
            <div class="left">{{msg.content}}</div>
          </div>
        </div>
      </div> -->
      <div v-for="(msg, index) in msgList" :key="index">
        <div style="margin: 10px" v-if="msg.type">
          <div style="display: flex; flex-direction: row-reverse;">
            <img style="width:40px;height:40px;" src="../assets/images/support_staff.png" alt="" />
            <div class="right">{{msg.content}}</div>
            <div class="read" :style="{color: msg.type ? '#9C9C9C' : 'red'}">{{msg.type ? '已读' : '未读'}}</div>
            <!-- <div class="read" style="color:red;">未读</div> -->
          </div>
        </div>

        <div style="margin: 10px" v-else>
          <div style="display: flex;">
            <img style="width:40px;height:40px;" src="../assets/images/support_staff.png" alt="" />
            <div class="left">{{msg.content}}</div>
          </div>
        </div>
      </div>
      <!-- <div style="margin: 10px">
        <div style="display: flex; flex-direction: row-reverse;">
          <img style="width:40px;height:40px;" src="../assets/images/support_staff.png" alt="" />
          <div class="right">hello world啥建档立卡费劲啊啥都离开飞机啊算了阿斯顿发记录卡世纪东方阿斯顿发撒旦法师的sadGV重新发VG回答是发给梵蒂冈</div>
          <div class="read" style="color: #9C9C9C;">已读</div>
        </div>
      </div>
      <div style="margin: 10px">
        <div style="display: flex;">
          <img style="width:40px;height:40px;" src="../assets/images/support_staff.png" alt="" />
          <div class="left">hello world啥建档立卡费劲啊啥都离开飞机啊算了阿斯顿发记录卡世纪东方阿斯顿发撒旦法师的sadGV重新发VG回答是发给梵蒂冈</div>
        </div>
      </div> -->
    </div>
    <div class="input_class">
      <a-input class="msg_input" @keyup.enter="sendMsg" v-model:value="msgInput" placeholder="请输入内容" />
      <div @click="sendMsg" class="send_btn">发送</div>
      <img @click="showMoreFun" style="margin: 3px 10px; width: 28px; height: 28px;" src="../assets/images/add.png" />
    </div>
    <div v-if="showMore" style="height: 200px; background-color: #F5F5F5; display: flex;">
      <div class="more">
        <img class="more_img" src="../assets/images/img.png" />
        <p style="margin-top: -15px;">图片</p>
      </div>
      <div class="more">
        <img class="more_img" src="../assets/images/file.png" />
        <p style="margin-top: -15px;">文件</p>
      </div>
    </div>
    <Evaluate v-if="evaluate" v-model:value="evaluate" @afterClose="evaluateClose" />
     <!-- @afterClose="evaluateClose" -->
  </div>
</template>

<script lang="ts">
import { defineComponent, createVNode, defineProps, nextTick, onMounted, ref, reactive } from 'vue'
import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

import Evaluate from 'comps/Evaluate.vue'
import Header from 'comps/Header.vue'

function goToBottom () {
  const scrollTarget: any = document.querySelector(".msg_list")
  scrollTarget.scrollTop = scrollTarget.scrollHeight
}

export default defineComponent({
  components: {
    Evaluate,
    Header
  },
  setup () {
    const msgInput = ref<string>('')
    const contentHeight = ref<string>('')
    const showMore = ref<boolean>(false)
    const evaluate = ref<boolean>(false)
    const msgList = reactive<any>([])

    // 结束会话
    const showConfirm = () => {
      Modal.confirm({
        title: '温馨提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要结束本次聊天？',
        cancelText: '取消',
        okText: '确认',
        onOk() {
          msgList.push({
            content: '评价',
            type: true
          })
          evaluate.value = true
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      })
    }

    // 设置高度
    function setContentHeight (value: boolean|undefined) {
      if (value) {
        contentHeight.value = `height: calc(100vh - 96px - 200px)`
      } else {
        contentHeight.value = `height: calc(100vh - 96px)`
      }
      nextTick(() => { goToBottom() })
    }

    // 显示菜单
    function showMoreFun () {
      showMore.value = !showMore.value
      setContentHeight(showMore.value)
    }

    // 发送消息
    function sendMsg () {
      if (!msgInput.value) {
        return
      }
      msgList.push({
        content: msgInput.value,
        type: true
      })
      msgInput.value = ''
      nextTick(() => { goToBottom() })
    }

    function evaluateClose (value: boolean){
      evaluate.value = value
      console.log('evaluate***', value)
    }

    onMounted (() => {
      for (let i = 0; i < 20; i++) {
        msgList.push({
          content: 'hello world啥建档立卡费劲啊啥都离开飞机啊算了阿斯顿发记录卡世纪东方阿斯顿发撒旦法师的sadGV重新发VG回答是发给梵蒂冈--' + i,
          type: i % 2 === 0
        })
      }
      
      setContentHeight(false)
    })

    return {
      msgInput,
      contentHeight,
      showMore,
      msgList,
      evaluate,

      setContentHeight,
      showMoreFun,
      sendMsg,
      showConfirm,
      evaluateClose
    }
  }
})
</script>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    overflow: hidden;
  }
  /* .header {
    display: flex;
    height: 44px;
    line-height: 44px;
    background: #FFFFFF;
  } */
  .msg_list {
    display: block;
    /* height: calc(100vh - 96px - 200px); */
    overflow: auto;
    overscroll-behavior: contain;
    -ms-scroll-chaining: contain;
  }
  .smart {
    height: 16px;
    margin: 3px 10px;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    line-height: 16px;
  }
  .left {
    min-height: 40px;
    max-width: 60%;
    background-color: #FFFFFF;
    margin: 0 15px;
    padding: 10px;
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    border-radius: 8px;
    position: relative;
  }
  .left:before{  
    position: absolute;  
    content: "\00a0";  
    width: 0px;  
    height: 0px;  
    border-width: 4px 8px 4px 0;  
    border-style: solid;  
    border-color: transparent #fff transparent transparent;  
    top: 15px;  
    left: -8px;  
  }
  .right {
    min-height: 40px;
    max-width: 60%;
    background-color: #5894F0;
    margin: 0 15px 0 10px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    padding: 10px;
    border-radius: 8px;
    position: relative;
  }
  .right:before{  
    position: absolute;  
    content: "\00a0";  
    display: inline-block;  
    width: 0px;  
    height: 0px;  
    border-width: 4px 0px 4px 8px;  
    border-style: solid;  
    border-color: transparent transparent transparent #5894F0;  
    right: -8px;  
    top: 15px;         
  }
  .read {
    font-size: 10px;
    font-weight: 400;
    line-height: 14px;
    display: flex;
    flex-direction: column-reverse;
  }
  .input_class {
    height: 49px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px #DFDFDF solid;
  }
  .send_btn {
    width: 67px;
    height: 35px;
    background: #DFDFDF;
    border-radius: 8px;
    text-align: center;
    line-height: 35px;
    color: #FFFFFF;
  }
  .more {
    width: 58px;
    height: 58px;
    background: #FFFFFF;
    border-radius: 14px;
    text-align: center;
    line-height: 58px;
    margin: 18px 14px;
  }
  .more_img {
    margin: 3px 10px;
    width: 27px;
    height: 27px;
  }
  .msg_input {
    height: 35px;
    background: #FFFFFF;
    border-radius: 8px;
    margin: 0 10px;
  }
  /* .close {
    height: 16px;
    font-size: 12px;
    font-weight: 400;
    color: #2445F4;
    line-height: 44px;
    margin-right: 10px;
  } */
  ::v-global(.ant-modal-content) {
    border-radius: 8px;
  }
  ::v-global(.ant-btn) {
    border-radius: 8px;
  }
  /* &:deep(.ant-btn) {
    border-radius: 8px;
  } */
</style>