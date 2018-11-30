let WebSocket = require("nodejs-websocket");
let socketPort = 8080;
WebSocket.createServer(function(conn){
    conn.on("text",function(str){
        delConnectRequest(str,conn);
    });
    conn.on("error",function(code,reason){
        console.log(code);
        console.log(reason);
    });
    conn.on("close",function(code,reason){
        console.log(code);
        console.log(reason);
    })
}).listen(socketPort);
function delConnectRequest(str,connect){
    connect.sendText(delMessage(str));
}
function delMessage(str){
    try{
        let msg = JSON.parse(str);
        let result = {};
        if(msg && msg["type"] && msg["type"] == "nac"){
            if(msg["accountcode"]){
                result = {"state": 0, "type": "nac", "msg": "初次见面，认识一下吧~我是九猎网机器人九儿，请问您是？", "openid": "aaannnpk739KKKK", "buttons": ["绑定九猎网账号"], "textbox": true}
            }else if(msg["username"]){
                result= {"state": 1, "type": "nac", "msg": "哈喽，常彦荣，下午好，有什么需要全小猎帮忙的吗？", "openid": "aaannnpk739KKKK", "buttons": ["找候选人", "查业绩", "排行榜", "问制度"], "textbox": false}
            }
        }
        return JSON.stringify(result);
    }catch(e){
        return str;
    }

}
