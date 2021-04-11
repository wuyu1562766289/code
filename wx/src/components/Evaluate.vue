<template>
  <a-drawer
    placement="bottom"
    :wrap-style="{ position: 'absolute' }"
    :visible="visible"
    :height="520"
    :get-container="false"
    @close="onClose"
    :after-visible-change="afterVisibleChange"
  >
    <div>
      <p class="title">请对本次服务做出评价</p>
      <div class="profile-div">
        <img class="profile-picture" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="" />
      </div>
      <div class="flex-center">
        <img class="emoji-img" @click="setEmoji(i)" v-for="(img, i) in emoji" :key="img" :src="img" />
      </div>
      <div v-if="start" class="tip-text">{{startText[start-1]}}</div>
      <div class="flex-center">
        <a-textarea
          style="width:343px;"
          v-model:value="content"
          placeholder="我有话说"
          :auto-size="{ minRows: 4, maxRows: 6 }"
          showCount :maxlength="200"
        />
      </div>
      <div class="question">
        <p>本次问题是否被解决(必填)</p>
      </div>
      <div class="flex-center" style="margin:15px 0 20px 0;">
        <div class="question-btn" :class="{'question-btn-active': settleStatus === 1}" @click="settleStatus = 1" style="margin-right:16px;">
          <span class="question-btn-text" :class="{'question-btn-text-active': settleStatus === 1}">已解决</span>
        </div>
        <div class="question-btn" :class="{'question-btn-active': settleStatus === 0}" @click="settleStatus = 0">
          <span class="question-btn-text" :class="{'question-btn-text-active': settleStatus === 0}">未解决</span>
        </div>
      </div>
      <div class="flex-center">
        <a-button class="submit-btn" @click="onSubmit" type="primary">提交</a-button>
      </div>
    </div>    
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, defineProps, ref, watch, nextTick, reactive } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import img1 from 'imgs/evaluate/1.png'
import img2 from 'imgs/evaluate/2.png'
import img3 from 'imgs/evaluate/3.png'
import img4 from 'imgs/evaluate/4.png'
import img5 from 'imgs/evaluate/5.png'
import img6 from 'imgs/evaluate/6.png'
import img7 from 'imgs/evaluate/7.png'
import img8 from 'imgs/evaluate/8.png'
import img9 from 'imgs/evaluate/9.png'
import img10 from 'imgs/evaluate/10.png'
let coolEmoji: Array = [img1, img2, img3, img4, img5]
let niceEmoji: Array = [img6, img7, img8, img9, img10]
let startText: Array = ['很生气，差评', '哎，不满意', '还凑合，需要继续改进', '还不错，挺满意的', '超级赞，非常完美']

export default defineComponent({
  components: {
    InfoCircleOutlined
  },
  props: {
    value: Boolean
  },
  watch: {
    value: {
      handler (newValue, oldValue) {
        this.visible = newValue
      },
      immediate: true
    }
  },
  setup(props, ctx) {  
    const visible = ref<boolean>(false)
    const content = ref<string>('')
    const start = ref<number>(0)
    const settleStatus = ref<string>('')

    let emoji = reactive<Array>([...coolEmoji])

    const afterVisibleChange = (bool: boolean) => { ctx.emit('afterClose', bool) }

    const onClose = () => { visible.value = false }

    const onSubmit = () => {

      console.log('提交')
    }

    // 切换评价图片
    function setEmoji (index) {
      start.value = index + 1
      for (let i = 0; i < 5; i++) {
        if (i <= index) {
          emoji[i] = niceEmoji[i]
        } else {
          emoji[i] = coolEmoji[i]
        }
      }
    }

    return {
      visible,
      props,
      emoji,
      start,
      content,
      settleStatus,
      startText,

      onClose,
      afterVisibleChange,
      setEmoji,
      onSubmit
    }
  }
})
</script>
<style scoped>
.profile-div {
  margin: 26px 0 18px 0;
  text-align: center;
}
.profile-picture {
  width: 55px;
  height: 55px;
  border-radius: 100%;
}
.title {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  line-height: 19px;
}
.flex-center {
  display: flex;
  justify-content: center;
}
.emoji-img {
  width:32px;
  height:32px;
  margin: 0 7px 11px 7px;
}
.tip-text {
  text-align: center;
  color: #F1690B;
  margin-bottom: 16px;
}
.question {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  line-height: 19px;
  margin:22px 0 13px 0;
  text-align: center;
}
.question-btn {
  width: 72px;
  height: 28px;
  border-radius: 14px;
  border: 1px solid #979797;
  text-align: center;
  cursor: pointer;
}
.question-btn-active {
  border: 1px solid #2445F4;
}
.question-btn-text {
  font-size: 12px;
  font-weight: 400;
  color: #9C9C9C;
  line-height: 28px;
}
.question-btn-text-active {
  color: #2445F4;
}
.submit-btn {
  width:343px;
  border-radius: 8px;
  background-color: #2445F4;
}
::v-global(.ant-input) {
  border-radius: 8px;
}
::v-global(.ant-drawer .ant-drawer-content) {
  border-radius: 15px 15px 0 0;
}
</style>