const WebSocket = require("ws");
const Chat_query = require("./ChatMsg_query.js");
const time = require("../views/js/time.js");

class WebSocketServer {
  constructor(port) {
    this.port = port;
    this.wss = null;
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });

    this.wss.on("connection", (ws) => {
      console.log(`WebSockset_Module :: connection, Current User : ${this.wss.clients.size} 명`);

      ws.on("message", (Message) => {
        try {
          const data = JSON.parse(Message);

          //console.log("WebSocket :: type : " + data.type);
          //console.log("WebSocket :: message : " + data.msg);
          //console.log("WebSocket :: uid : " + data.user_id);
          //console.log("WebSocket :: uname : " + data.user_name);
          //console.log("WebSocket :: chatroom : " + data.chat_room_id);

          if (data.type === "chatMessage") {
            Chat_query.saveMessage(Message);

            var BroadCast_Message = JSON.stringify({
              type: "BroadCast",
              msg: data.msg,
              user_id: data.user_id,
              chat_room_id: data.chat_room_id,
            });

            this.wss.clients.forEach((client) => {
              client.send(BroadCast_Message);
            });
          }
        } catch (error) {
          console.error("Error handling message :", error);
        }
      });

      ws.on("close", () => {
        console.log("Disconnected from server");
      });
    });
  }
}

module.exports = WebSocketServer;
