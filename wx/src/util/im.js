import api from '../api'
class IM {
  constructor () {
    this.JIM = new JMessage({ debug: false })
    // 断线事件
    let disconnectEvent = document.createEvent('HTMLEvents')
    disconnectEvent.initEvent('imDisconnect', false, false)
    this.JIM.onDisconnect(() => {
      document.dispatchEvent(disconnectEvent)
    })
    // 接收消息事件
    this.messageEvent = document.createEvent('HTMLEvents')
    this.messageEvent.initEvent('imMessage', false, false)
    // 同步离线消息事件
    this.offlineMessageEvent = document.createEvent('HTMLEvents')
    this.offlineMessageEvent.initEvent('imOfflineMessage', false, false)
    // 业务通知事件
    this.notificationEvent = document.createEvent('HTMLEvents')
    this.notificationEvent.initEvent('imNotification', false, false)
    // 已读事件
    this.readedEvent = document.createEvent('HTMLEvents')
    this.readedEvent.initEvent('imReaded', false, false)
    // 正在输入事件
    this.typingEvent = document.createEvent('HTMLEvents')
    this.typingEvent.initEvent('imTyping', false, false)
    // 其他端读取了消息
    this.otherPlatformReadedEvent = document.createEvent('HTMLEvents')
    this.otherPlatformReadedEvent.initEvent('otherPlatformReaded', false, false)
    this._globalEventListener()
  }
  // 登录
  login () {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await this._sign()
        if (this.JIM.isLogin()) {
          this.getUserInfo(account.username).then(res => {
            resolve(res)
          }, e => {
            reject(e)
          })
        } else {
          const userInfo = await this._login(account)
          resolve(userInfo)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  // 退出登录
  logout () {
    this.JIM.loginOut()
  }
  // 获取会话列表
  getConversation () {
    return new Promise(async (resolve, reject) => {
      let conversationFromApi = []
      try {
        const res = await api.getConversation()
        if (res.code === 0) {
          const data = res.data.map(d => ({
            id: d.id,
            isGroup: d.isGroup,
            targetId: d.targetId,
            appKey: d.appKey,
            nickname: d.nickname,
            avatar: d.avatar,
            isHide: d.isHide,
            offLine: d.offline || false,
            deleteMsgBeforeTs: d.deleteMsgBeforeTs,
            lastMsg: {
              type: d.lastMsgContent.extras?.type,
              unRead: false,
              content: d.lastMsgContent.extras?.content || '',
              time: d.lastMsgUpdateTime
            },
            msgCount: 0,
            staffId: d.staffId,
            orderId: d.orderId,
            staffType: d.staffType
          }))
          conversationFromApi = data
        } else {
          reject(new Error(res.userMsg))
        }
      } catch (e) {
        reject(e)
      }
      this.JIM.getConversation().onSuccess(data => {
        if (data.code === 0) {
          const conversationFromJIM = data.conversations.map(c => ({
            id: 0,
            isGroup: c.type === 4,
            targetId: c.type === 4 ? String(c.gid) : c.username,
            appKey: c.appkey,
            nickname: c.nickName,
            avatar: c.extras.avatar || '',
            isHide: false,
            offLine: false,
            deleteMsgBeforeTs: -1,
            lastMsg: {
              type: 'text', // text,voice,image,file,video
              unRead: false,
              content: '',
              time: c.mtime
            },
            msgCount: c.unread_msg_count,
            staffId: 0,
            orderId: 0,
            staffType: ''
          }))
          resolve(this._mergeConversation(conversationFromApi, conversationFromJIM))
        } else {
          reject(new Error(`获取会话列表失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`获取会话列表失败：${data.code} ${data.message}`))
      })
    })
  }
  // 合并会话
  _mergeConversation (conversationFromApi, conversationFromJIM) {
    let sameIds = []
    conversationFromApi.forEach(a => {
      let same = conversationFromJIM.find(c => c.targetId === a.targetId)
      if (same) sameIds.push(same.targetId)
      a.lastMsg.time = same?.lastMsg.time || a.lastMsg.time // 最后消息时间以极光的会话列表时间为准
      a.msgCount = same?.msgCount || 0
    })
    conversationFromJIM.forEach(j => {
      if (sameIds.indexOf(j.targetId) === -1) {
        conversationFromApi.push(j)
      }
    })
    return conversationFromApi.filter(c => !c.isHide)
  }
  // 获取用户信息
  getUserInfo (username = '', appKey = '') {
    return new Promise((resolve, reject) => {
      this.JIM.getUserInfo({ username, appkey: appKey }).onSuccess(data => {
        if (data.code === 0) {
          const res = {
            targetId: data.user_info.username,
            appKey: data.user_info.appkey,
            nickname: data.user_info.nickname,
            avatar: data.user_info.extras.avatar,
            offLine: data.user_info.extras.offline || false
          }
          resolve(res)
        } else {
          reject(new Error(`获取用户信息失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`获取用户信息失败：${data.code} ${data.message}`))
      })
    })
  }
  // 获取群信息
  getGroupInfo (gid = '') {
    return new Promise((resolve, reject) => {
      this.JIM.getGroupInfo({ gid }).onSuccess(data => {
        if (data.code === 0) {
          const res = {
            targetId: String(data.group_info.gid),
            appKey: data.group_info.appkey,
            nickname: data.group_info.desc
          }
          resolve(res)
        } else {
          reject(new Error(`获取群组信息失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`获取群组信息失败：${data.code} ${data.message}`))
      })
    })
  }
  // 获取群成员
  getGroupMembers (gid = '') {
    return new Promise((resolve, reject) => {
      this.JIM.getGroupMembers({ gid }).onSuccess(data => {
        if (data.code === 0) {
          const res = data.member_list.map(m => ({
            targetId: m.username,
            appKey: m.appkey,
            nickname: m.nickname,
            isOwner: m.flag === 1 // 是否群主
          }))
          resolve(res)
        } else {
          reject(new Error(`获取群组成员失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`获取群组成员失败：${data.code} ${data.message}`))
      })
    })
  }
  // 重置未读消息的数量
  resetUnreadCount (params = { isGroup: false, targetId: '', appKey: '' }) {
    let query = {}
    if (!params.isGroup) {
      query.username = params.targetId
      query.appkey = params.appKey
    } else {
      query.gid = params.targetId
    }
    this.JIM.resetUnreadCount(query)
  }
  // 已读消息
  submitReadedMessage (msgIds = [], targetId = '', isGroup = false, appKey = '') {
    return new Promise((resolve, reject) => {
      if (!isGroup) {
        let params = { username: targetId, msg_ids: msgIds, appkey: appKey }
        this.JIM.addSingleReceiptReport(params).onSuccess((data, msgIds) => {
          if (data.code === 0) {
            data.msgIds = msgIds
            resolve(data)
          } else {
            reject(new Error(`提交已读消息失败：${data.code} ${data.message}`))
          }
        }).onFail(data => {
          reject(new Error(`提交已读消息失败：${data.code} ${data.message}`))
        })
      } else {
        let params = { gid: targetId, msg_ids: msgIds }
        this.JIM.addGroupReceiptReport(params).onSuccess((data, msgIds) => {
          if (data.code === 0) {
            data.msgIds = msgIds
            resolve(data)
          } else {
            reject(new Error(`提交已读消息失败：${data.code} ${data.message}`))
          }
        }).onFail(data => {
          reject(new Error(`提交已读消息失败：${data.code} ${data.message}`))
        })
      }
    })
  }
  // 正在输入
  typing (targetId = '', isGroup = false, appKey = '') {
    return new Promise((resolve, reject) => {
      if (!isGroup) {
        this.JIM.transSingleMsg({
          target_username: targetId,
          cmd: '正在输入',
          target_appkey: appKey
        }).onSuccess(function (data) {
          if (data.code === 0) {
            resolve(data)
          } else {
            reject(new Error(`透传正在输入失败：${data.code} ${data.message}`))
          }
        }).onFail(function (data) {
          reject(new Error(`透传正在输入失败：${data.code} ${data.message}`))
        })
      } else {
        this.JIM.transGroupMsg({
          'gid': targetId,
          'cmd': '正在输入'
        }).onSuccess(function (data) {
          if (data.code === 0) {
            resolve(data)
          } else {
            reject(new Error(`透传正在输入失败：${data.code} ${data.message}`))
          }
        }).onFail(function (data) {
          reject(new Error(`透传正在输入失败：${data.code} ${data.message}`))
        })
      }
    })
  }
  // 撤回
  retract (msg_id = '') {
    return new Promise((resolve, reject) => {
      this.JIM.msgRetract({ msg_id }).onSuccess(data => {
        if (data.code === 0) {
          resolve(data)
        } else {
          reject(new Error(`消息撤回失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`消息撤回失败：${data.code} ${data.message}`))
      })
    })
  }
  // app推送需要给text赋值
  _APPPushText (content) {
    const textCut = text => {
      if (text && text.length > 36) {
        let t = text.substring(0, 36)
        return t + '...'
      }
      return text
    }
    const contentMap = {
      'text': textCut(content.content), // voice,image,file,video
      'notice': textCut(content.content),
      'bot': textCut(content.content),
      'rebot': textCut(content.content),
      'voice': '[语音]',
      'image': '[图片]',
      'file': '[文件]',
      'video': '[视频]',
      'order': '[订单]',
      'product': '[商品]',
      'evaluate': '[评价]',
      'location': '[位置]'
    }
    return contentMap[content.type]
  }
  // 发单聊消息
  sendToUser (content = {}, params = {}) {
    return new Promise((resolve, reject) => {
      params.content = this._APPPushText(content)
      params.extras = content
      params.extras['ios_push_tips'] = `${params.myUsername}|user_staff`
      this.JIM.sendSingleMsg(params).onSuccess((data, msg) => {
        if (data.code === 0) {
          msg.ctime_ms = data.ctime_ms
          resolve(msg)
        } else {
          reject(new Error(`消息发送失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`消息发送失败：${data.code} ${data.message}`))
      })
    })
  }
  // 发群聊消息
  sendToGroup (content = {}, params = {}) {
    return new Promise((resolve, reject) => {
      params.content = this._APPPushText(content)
      params.extras = content
      params.extras['ios_push_tips'] = `${params.target_gid}|group_chat`
      this.JIM.sendGroupMsg(params).onSuccess((data, msg) => {
        if (data.code === 0) {
          msg.ctime_ms = data.ctime_ms
          resolve(msg)
        } else {
          reject(new Error(`消息发送失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`消息发送失败：${data.code} ${data.message}`))
      })
    })
  }
  _sign () {
    return new Promise((resolve, reject) => {
      api.getJIMAuth().then(res => {
        if (res.code === 0) {
          const account = {
            username: res.data.userName,
            password: res.data.randomKey
          }
          this.JIM.init({
            'appkey': res.data.appkey,
            'random_str': res.data.randomStr,
            'signature': res.data.signature,
            'timestamp': Number(res.data.timestamp),
            'flag': 1
          }).onSuccess(data => {
            if (data.code === 0) {
              resolve(account)
            } else {
              reject(new Error(`签名错误：${data.code} ${data.message}`))
            }
          }).onFail(data => {
            reject(new Error(`签名错误：${data.code} ${data.message}`))
          })
        } else {
          reject(new Error(res.userMsg))
        }
      }, e => {
        reject(e)
      })
    })
  }
  _login ({ username = '', password = '' }) {
    return new Promise((resolve, reject) => {
      this.JIM.login({
        username,
        password,
        is_md5: true
      }).onSuccess(data => {
        if (data.code === 0) {
          this.getUserInfo(username).then(res => {
            resolve(res)
          }, e => {
            reject(e)
          })
        } else {
          reject(new Error(`登录失败：${data.code} ${data.message}`))
        }
      }).onFail(data => {
        reject(new Error(`登录失败：${data.code} ${data.message}`))
      })
    })
  }
  _globalEventListener () {
    // 消息实时接收
    this.JIM.onMsgReceive(data => {
      const messages = data.messages.map(m => ({
        targetId: m.msg_type === 3 ? m.from_username : String(m.from_gid),
        isGroup: m.msg_type === 4,
        appKey: m.from_appkey,
        msgCount: 1,
        messages: {
          targetId: m.content.target_id,
          targetName: m.content.target_name,
          targetType: m.content.target_type,
          targetAppKey: m.content.target_appkey,
          fromId: m.content.from_id,
          fromName: m.content.from_name,
          fromType: m.content.from_type,
          fromAppKey: m.content.from_appkey,
          fromPlatform: m.content.from_platform,
          msgBody: m.content.msg_body.extras,
          createTime: m.content.create_time,
          version: m.content.version,
          msgId: m.msg_id,
          msgLevel: m.msg_level,
          msgType: m.msg_type,
          msgTime: m.ctime_ms,
          needReceipt: m.need_receipt,
          unRead: false,
          status: 0
        }
      }))
      const range = (arr) => {
        let map = {}
        let dest = []
        for (let i = 0; i < arr.length; i++) {
          let ai = arr[i]
          if (!map[ai.targetId]) {
            dest.push({
              targetId: ai.targetId,
              msgCount: 1,
              messages: [ai.messages]
            })
            map[ai.targetId] = ai
          } else {
            for (let j = 0; j < dest.length; j++) {
              let dj = dest[j]
              if (dj.targetId === ai.targetId) {
                dj.msgCount += 1
                dj.messages.push(ai.messages)
                break
              }
            }
          }
        }
        return dest
      }
      this.messageEvent.data = range(messages)
      document.dispatchEvent(this.messageEvent)
    })
    // 同步离线消息
    this.JIM.onSyncConversation(data => {
      const messages = data.map(d => ({
        targetId: d.msg_type === 3 ? d.from_username : String(d.from_gid),
        isGroup: d.msg_type === 4,
        msgCount: d.unread_msg_count,
        appKey: d.from_appkey,
        messages: d.msgs.map(m => ({
          targetId: m.content.target_id,
          targetName: m.content.target_name,
          targetType: m.content.target_type,
          targetAppKey: m.content.target_appkey,
          fromId: m.content.from_id,
          fromName: m.content.from_name,
          fromType: m.content.from_type,
          fromAppKey: m.content.from_appkey,
          fromPlatform: m.content.from_platform,
          msgBody: m.content.msg_body.extras,
          createTime: m.content.create_time,
          version: m.content.version,
          msgId: m.msg_id,
          msgLevel: m.msg_level,
          msgType: m.msg_type,
          msgTime: m.ctime_ms,
          needReceipt: m.need_receipt,
          unRead: false,
          status: 0
        }))
      }))
      let unRead = data.map(d => ({
        targetId: d.msg_type === 3 ? d.from_username : String(d.from_gid),
        unRead: d.receipt_msgs.map(r => ({ msgId: r.msg_id, unRead: r.unread_count > 0 }))
      }))
      this.offlineMessageEvent.data = { messages, unRead }
      document.dispatchEvent(this.offlineMessageEvent)
    })
    // 事件通知
    this.JIM.onEventNotification(data => {
      let res = {
        event: data.event_type,
        time: data.ctime_ms,
        data: {}
      }
      if (data.event_type === 1) { // 被踢
        res.event = 'kickOut'
        res.data = data.extra
      }
      if (data.event_type === 55) { // 撤回
        res.event = 'retract'
        res.data = {
          targetId: data.type === 0 ? data.from_username : String(data.from_gid),
          appKey: data.from_appkey,
          msgIds: data.msgid_list
        }
      }
      this.notificationEvent.data = [res]
      document.dispatchEvent(this.notificationEvent)
    })
    // 同步事件通知
    this.JIM.onSyncEvent(data => {
      // 目前只做撤回通知，后续要做其他功能，在这里加
      let result = data.map(d => {
        let res = {
          event: d.event_type,
          time: d.ctime_ms,
          data: {}
        }
        if (d.event_type === 55) {
          res.event = 'retract'
          res.data = {
            targetId: d.type === 0 ? d.from_username : String(d.from_gid),
            appKey: d.from_appkey,
            msgIds: d.msgid_list
          }
        }
        return res
      })
      this.notificationEvent.data = result
      document.dispatchEvent(this.notificationEvent)
    })
    this.JIM.onMsgReceiptChange(data => {
      let unRead = {
        targetId: data.type === 3 ? data.username : String(data.gid),
        unRead: data.receipt_msgs.map(r => ({ msgId: r.msg_id, unRead: r.unread_count > 0 }))
      }
      this.readedEvent.data = [unRead]
      document.dispatchEvent(this.readedEvent)
    })
    this.JIM.onSyncMsgReceipt(data => {
      let unRead = data.map(d => ({
        targetId: d.type === 3 ? d.username : String(d.gid),
        unRead: d.receipt_msgs.map(r => ({ msgId: r.msg_id, unRead: r.unread_count > 0 }))
      }))
      this.readedEvent.data = unRead
      document.dispatchEvent(this.readedEvent)
    })
    this.JIM.onTransMsgRec(data => {
      // 目前透传只用于正在输入，所以只返回这两个参数，如果后续要用透传做其他功能，在这里加
      if (data.cmd === '正在输入') {
        let res = {
          targetId: data.type === 3 ? data.from_username : String(data.gid),
          appKey: data.from_appkey
        }
        this.typingEvent.data = res
        document.dispatchEvent(this.typingEvent)
      }
    })
    this.JIM.onMutiUnreadMsgUpdate(data => {
      let res = {
        targetId: data.type === 3 ? data.username : String(data.gid),
        appKey: data.appkey
      }
      this.otherPlatformReadedEvent.data = res
      document.dispatchEvent(this.otherPlatformReadedEvent)
    })
  }
}
export default new IM()
