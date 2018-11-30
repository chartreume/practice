const protocol = "ws:";
const path = "";
const port = 8765;

const host = "192.168.1.80";

//let key = Symbol.for("socket");

let socket = {
    send : function(message){
        console.log(message);
        this.getSocket()
            .then( socket => {
                try{
                    socket.send(message)
                }catch(e){
                    return Promise.reject(e)
                }
            })
            .catch(event=>{
                this.messageCallback({error: !0, type : 2, msg:"send message to socket error.",originMsg: message});
            })
    },
    messageCallback : function(msg){
        console.log(msg);
    },
    onMessage : function(func){
        if(Object.prototype.toString.call(func) === "[object Function]"){
            this.messageCallback = func;
        }
    },
    getSocket : function(){
        let $ = this
        ,   socket = $[Symbol.for("socket")]
        ,   state = $[Symbol.for("socketState")]
        ;
        return new Promise((resolve,reject)=>{
            try{
                if(socket && state === 200){
                    resolve(socket);
                    return;
                }else if(socket && state > 200){
                    $.messageCallback({error: !0, socketState: state});
                }else{
                    $.messageCallback({error: !0, socketState: state});
                }
                let socketopened = !1;
                socket = new WebSocket(`${protocol}//${host}:${port}`);
                $[Symbol.for("socketState")] = 0;
                socket.onopen = function(){
                    socketopened = !0;
                    $[Symbol.for("socket")] = socket;
                    $[Symbol.for("socketState")] = 200;
                    let openid = window.sessionStorage.getItem("openid");
                    if(openid){
                        socket.send(JSON.stringify({openid: openid,type: 10}))
                    }
                    resolve(socket);
                }
                socket.onclose = function(event){
                    $[Symbol.for("socketState")] = 404;
                    if( !socketopened ){
                        reject(event);
                    }else{
                        $.messageCallback({error: !0, socketState: 404});
                    }
                }
                socket.onerror = function(event){
                    console.log(event);
                    $[Symbol.for("socketState")] = 500;
                    if( !socketopened ){
                        reject(event);
                    }else{
                        $.messageCallback({error: !0, ocketState: 500});
                    }
                };
                socket.onmessage = function(event){
                    console.log(event);
                    $.messageCallback({error: !1,msg : "socket response.",data:event.data});
                }
            }catch(e){
                reject(e);
            }

        })
    }
}
