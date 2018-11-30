const protocol = "ws:";
const path = "";
const port = 8080;
const host = "127.0.0.1";
/*
const protocol = "ws:";
const path = "";
const port = 8765;
const host = "192.168.1.80";
*/

let management = {
    // 发送信息到socket
    _$send : function(message){
        this._$storageSetItem(message,"client");
        this._$getSocket().then( socket => {
            try{
                socket.send( JSON.stringify(message) );
            }catch(e){
                return Promise.reject(e);
            }
        }).catch( event => {
            this._$receiveSocketStateMessage( {error : !0,originMsg: message } );
            this._$storageSetItem( message,"sendFailed" );
        })
    },
    // 接受socket 信息，处理信息
    _$receiveSocketMessage : function( message ){
        if(this[Symbol.for("onmessage")]){
            this[Symbol.for("onmessage")]("server",message);
        }
    },
    // 处理socket 错误信息
    _$receiveSocketStateMessage : function( message ){
        if(this[Symbol.for("onmessage")]){
            this[Symbol.for("onmessage")]("socketError",message);
        }
    },
    // 接受page 信息
    _$receivePageMessage : function( message ){
        if( typeof message === "string" ){
            message = { msg: message }
        }
        Object.assign( message,{stamp : (new Date).valueOf()} );
        if(this[Symbol.for("onmessage")]){
            this[Symbol.for("onmessage")]( "client",message );
        }
        this._$send( message );
    },
    // 创建或者返回socket
    _$getSocket: function(){
        let _$this = this
        ,   socket = _$this[Symbol.for("socket")]
        ;

        return new Promise ( ( resolve,reject ) => {
            try{
                if( socket ){
                    if(socket && socket.readyState === 1){ // socket 已创建并且工作中
                        resolve( socket );
                        return ;
                    }else{ // socket 错误，输出 错误信息
                        _$this._$receiveSocketStateMessage( {error: !0, socketState : socket.readyState} )
                    }
                }
                // 新建（重建）socket
                let sokcetopened = !1;
                socket = new WebSocket(`${protocol}//${host}:${port}/${path}`);
                _$this[ Symbol.for("socket") ] = socket;

                socket.onopen = function(){
                    socketopened = !0;
                    let openid = window.sessionStorage.getItem("openid");
                    if( openid ){
                        socket.send( JSON.stringify({openid: openid,type: 10}) )
                    }
                    resolve( socket );
                }
                socket.onerror = socket.onclose = function( event ){
                    if( !sokcetopened ){
                        reject( event );
                    }else{
                        _$this._$receiveSocketStateMessage( {error: !0, socketState : socket.readyState} )
                    }
                }
                socket.onmessage = function( event ){
                    try{
                        let message = { error : !1, data : JSON.parse(event.data),stamp : (new Date).valueOf() };
                        _$this._$receiveSocketMessage( message );
                        this._$storageSetItem( message,"server" );
                    }catch(e){
                        _$this._$receiveSocketStateMessage({error: !0, msg : "message parse error",type: "JSONParseError"});
                        this._$storageSetItem( event.data,"parseError" );
                    }
                }
            }catch(e){
                reject(e);
            }
        })
    },
    // 储存消息记录
    _$storageSetItem : function(message,storageType){ //storageType :enum("sendFailed","parseError","server","client")
        try{
            let win = window
            ,   storage = win.localStorage
            ,   messageHistory
            ,   errorHistory
            ;
            if( storageType === "parseError" ){
                errorHistory = storage.getItem("errorHistory");
                errorHistory = errorHistory ? JSON.parse(errorHistory) : [];
                errorHistory.unshift(message);
                storage.setItem("errorHistory",JSON.stringify(errorHistory));
            }else{
                messageHistory = storage.getItem("messageHistory");
                messageHistory = messageHistory ? JSON.parse(messageHistory) : [];

                if( storageType === "sendFailed" ){
                    let failMessageStamp = message && message["originMsg"] && message["originMsg"]["stamp"];
                    if( failMessageStamp ){
                        messageHistory.some( item =>{
                            if( item["from"] === "client" && item["stamp"] === failMessageStamp ){
                                item["failed"] = !0;
                                return !0;
                            }
                        })
                    }
                }else{
                    messageHistory.unshift( Object.assign(message,{from:storageType}) );
                }
                storage.setItem("messageHistory",JSON.stringify(messageHistory));
            }
        }catch(e){
            console.log("storage error.");
            console.error(e);
        }
    },
    // 外部处理message 接口
    set onmessage(func){
        if(Object.prototype.toString.call(func) === "[object Function]"){
            this[Symbol.for("onmessage")] = func;
        }
    },
    // 接受外部message 接口
    set receivePageMessage(message){
        this._$receivePageMessage(message);
    }
}
