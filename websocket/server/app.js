const ws = require('nodejs-websocket')
const PORT = 3000

// 2. 创建一个服务
const server = ws.createServer(connect => {

})

server.listen(PORT, () => {
  console.log('websocket服务启动成功了，监听端口：' + PORT)
})