import IMService from './lib'
import api from '~/api'
import store from '~/store'
class IM {
  constructor () {
    // todo 这个要搬到租户配置里
    let gateway = 'imgateway.ch999.cn'
    if (window.tenant && window.tenant.xtenant >= 2000 && window.tenant.xtenant < 3000) {
      gateway = 'imgateway.iteng.com'
    }
    if (window.tenant && window.tenant.xtenant >= 1000 && window.tenant.xtenant < 2000) {
      gateway = 'imgateway.zlf.co'
    }
    this.im = new IMService({
      host: gateway,
      port: '',
      uuid: store.state.UUID,
      observer: this._globalEventListener()
    })
    this.myInfo = {}
    // 断线事件
    this.disconnectEvent = document.createEvent('HTMLEvents')
    this.disconnectEvent.initEvent('imDisconnect', false, false)
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
    // 聊天室消息
    this.roomMessageEvent = document.createEvent('HTMLEvents')
    this.roomMessageEvent.initEvent('roomMessage', false, false)
    // 聊天室消息
    this.retractEvent = document.createEvent('HTMLEvents')
    this.retractEvent.initEvent('retract', false, false)

    this._globalEventListener()
    this.sendQueue = {}
    this.waitLogin = {}
  }
  login (token) {
    return new Promise((resolve, reject) => {
      api.v3.getSign().then(res => {
        if (res.code === 0) {
          this.myInfo = res.data
          this.im.accessToken = res.data.accessToken
          this.im.start()
          this.waitLogin.resolve = resolve
          this.waitLogin.reject = reject
          this.waitLogin.resolveData = {
            targetId: res.data.username,
            targetUid: res.data.uid,
            nickname: res.data.nickname,
            avatar: res.data.avatar,
            offLine: false,
            xtenant: res.data.xtenant,
            groupId: res.data.groupId
          }
          // resolve({
          //   targetId: res.data.username,
          //   targetUid: res.data.uid,
          //   nickname: res.data.nickname,
          //   avatar: res.data.avatar,
          //   offLine: false,
          //   xtenant: res.data.xtenant,
          //   groupId: res.data.groupId
          // })
        } else {
          reject(new Error(res.userMsg))
        }
      })
    })
  }
  getConversation () {
    return new Promise(async (resolve, reject) => {
      let unreadCountStr = localStorage.getItem('im_unread_count')
      let unreadCount = unreadCountStr ? JSON.parse(unreadCountStr) : {}
      try {
        const res = await api.v3.getConversation()
        if (res.code === 0) {
          const data = res.data.map(d => ({
            id: d.id,
            isGroup: d.isGroup,
            targetId: d.targetId,
            targetUid: d.targetUid,
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
              time: d.lastMsgUpdateTime,
              fromId: d.lastMsgSender,
              status: d.lastMsgRecalled ? 3 : 0
            },
            msgCount: unreadCount[d.targetId] || 0,
            staffId: d.staffId,
            orderId: d.orderId,
            staffType: d.staffType,
            username: d.username || ''
          }))
          resolve(data)
        } else {
          reject(new Error(res.userMsg))
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  getUnreadMsg () {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.v3.getUnreadMsg()
        if (res.code === 0) {
          const data = res.data.map(d => ({
            targetId: d.targetId,
            unRead: d.msgUUID.map(msgId => ({
              msgId: msgId,
              unRead: true
            }))
          }))
          resolve(data)
        } else {
          reject(new Error(res.userMsg))
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  getUserInfo (uid) {
    return new Promise((resolve, reject) => {
      api.v3.getUserInfo(uid).then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          reject(new Error(res.userMsg))
        }
      })
    })
  }
  // 获取群信息
  getGroupOwnerInfo (groupId = '') {
    return new Promise((resolve, reject) => {
      api.v3.getGroupOwnerInfo(groupId).then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          reject(new Error(res.userMsg))
        }
      })
    })
  }
  // 重置未读消息的数量
  resetUnreadCount (params = { isGroup: false, targetId: '' }) {
    let unreadCountStr = localStorage.getItem('im_unread_count')
    let unreadCount = unreadCountStr ? JSON.parse(unreadCountStr) : {}
    unreadCount[params.targetId] = 0
    localStorage.setItem('im_unread_count', JSON.stringify(unreadCount))
  }
  // 已读消息
  submitReadedMessage (msgIds = [], receiver = '', isGroup = false) {
    const msg = {
      sender: this.myInfo.uid,
      receiver,
      content: JSON.stringify({
        cmd: 'read',
        args: msgIds.join(',')
      })
    }
    console.error(msg)
    isGroup ? this.im.sendGroupRTMessage(msg) : this.im.sendRTMessage(msg)
  }
  // 正在输入
  typing (receiver = '', isGroup = false) {
    const msg = {
      sender: this.myInfo.uid,
      receiver,
      content: JSON.stringify({
        cmd: 'input',
        args: '正在输入...'
      })
    }
    isGroup ? this.im.sendGroupRTMessage(msg) : this.im.sendRTMessage(msg)
  }
  // 通知其他端这个会话的消息数量清零
  resetOtherPlatformMsgCount (targetId) {
    const msg = {
      sender: this.myInfo.uid,
      receiver: this.myInfo.uid,
      content: JSON.stringify({
        cmd: 'resetConversationMsgCount',
        args: targetId
      })
    }
    this.im.sendRTMessage(msg)
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
  // 发消息
  sendMessage (content = {}, params = {}) {
    return new Promise((resolve, reject) => {
      this.sendQueue[params.localId] = { resolve, reject }
      const msgContent = {
        xtenant: this.myInfo.xtenant,
        version: 3,
        target_type: params.isGroup ? 'group' : 'single',
        target_id: params.targetId,
        target_uid: params.receiver,
        from_type: 'user',
        from_id: this.myInfo.username,
        from_uid: this.myInfo.uid,
        msg_type: 'text',
        msg_uuid: params.localId,
        msg_body: {
          text: this._APPPushText(content),
          extras: {
            ...content,
            ios_push_tips: params.isGroup ? `${params.targetId}|group_chat` : `${this.myInfo.username}|user_staff`
          }
        }
      }
      const msg = {
        sender: this.myInfo.uid,
        receiver: params.receiver,
        content: JSON.stringify(msgContent),
        msgLocalID: params.localId,
        timestamp: Date.now()
      }
      if (params.isGroup) {
        this.im.sendGroupMessage(msg)
      } else {
        this.im.sendPeerMessage(msg)
      }
    })
  }
  _dispatchMsg (msg, group) {
    const newMessage = JSON.parse(msg.content)
    const messages = [{
      targetId: group ? newMessage.target_id : (msg.sender === this.myInfo.uid ? newMessage.target_id : newMessage.from_id),
      isGroup: group,
      msgCount: 1,
      messages: [{
        targetId: newMessage.target_id,
        targetUid: newMessage.target_uid,
        targetName: '',
        targetType: group ? 'group' : 'single',
        fromId: newMessage.from_id,
        fromUid: newMessage.from_uid,
        fromName: '',
        fromType: newMessage.from_type,
        fromPlatform: '',
        msgBody: newMessage.msg_body.extras,
        version: newMessage.version,
        msgId: newMessage.msg_uuid,
        msgType: 'text',
        msgTime: msg.timestamp,
        needReceipt: msg.sender !== this.myInfo.uid,
        unRead: true,
        status: 0
      }]
    }]
    // 会话未读数量存本地
    let unreadCountStr = localStorage.getItem('im_unread_count')
    let unreadCount = unreadCountStr ? JSON.parse(unreadCountStr) : {}
    if (unreadCount[newMessage.from_id]) {
      unreadCount[newMessage.from_id] += 1
    } else {
      unreadCount[newMessage.from_id] = 1
    }
    localStorage.setItem('im_unread_count', JSON.stringify(unreadCount))

    this.messageEvent.data = messages
    document.dispatchEvent(this.messageEvent)
  }
  _dispatchRTMessage (msg, isGroup) {
    let content = JSON.parse(msg.content)
    if (content.cmd === 'input') {
      this.typingEvent.data = isGroup ? String(msg.receiver) : msg.sender
      document.dispatchEvent(this.typingEvent)
    }
    if (content.cmd === 'read') {
      const msgIds = content.args.split(',')
      this.readedEvent.data = [
        {
          targetId: isGroup ? String(msg.receiver) : msg.sender,
          unRead: msgIds.map(msgId => ({
            msgId,
            unRead: false
          }))
        }
      ]
      document.dispatchEvent(this.readedEvent)
    }
    if (content.cmd === 'recall') {
      this.retractEvent.data = content.args.split(',')
      document.dispatchEvent(this.retractEvent)
    }
    if (content.cmd === 'resetConversationMsgCount') {
      this.otherPlatformReadedEvent.data = { targetId: content.args }
      document.dispatchEvent(this.otherPlatformReadedEvent)
    }
  }
  _globalEventListener () {
    return {
      handlePeerMessage: msg => {
        this._dispatchMsg(msg, false)
      },
      handleGroupMessage: msg => {
        this._dispatchMsg(msg, true)
      },
      handleMessageACK: msg => {
        this.sendQueue[msg.msgLocalID].resolve(msg)
        this.sendQueue[msg.msgLocalID] = null
      },
      handleMessageFailure: msg => {
        this.sendQueue[msg.msgLocalID].reject(msg)
        this.sendQueue[msg.msgLocalID] = null
      },
      handleGroupMessageACK: msg => {
        this.sendQueue[msg.msgLocalID].resolve(msg)
        this.sendQueue[msg.msgLocalID] = null
      },
      handleGroupMessageFailure: msg => {
        this.sendQueue[msg.msgLocalID].reject(msg)
        this.sendQueue[msg.msgLocalID] = null
      },
      handleRTMessage: msg => {
        this._dispatchRTMessage(msg, false)
      },
      handleGroupRTMessage: msg => {
        this._dispatchRTMessage(msg, true)
      },
      handleSystemMessage: msg => {
        if (msg.indexOf('newclientlogin') > -1) {
          this.notificationEvent.data = { event: 'kickOut' }
          document.dispatchEvent(this.notificationEvent)
        }
      },
      onConnectState: (state) => {
        if (state === IMService.STATE_CONNECTED) {
          console.log('连接成功')
          this.waitLogin.resolve(this.waitLogin.resolveData)
        } else if (state === IMService.STATE_CONNECTING) {
          console.log('正在连接...')
        } else if (state === IMService.STATE_CONNECTFAIL) {
          this.waitLogin.reject(new Error('WSS链接失败'))
          console.log('连接失败')
        } else if (state === IMService.STATE_UNCONNECTED) {
          console.log('未连接')
        }
      },
      handleDisconnect: () => {
        document.dispatchEvent(this.disconnectEvent)
      }
    }
  }
}
export default new IM()
