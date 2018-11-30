const protocol = "ws:";
const path = "";
const port = 8080;
const host = "127.0.0.1";
//192.168.1.129 8765
/*
const protocol = "ws:";
const path = "";
const port = 8765;
const host = "192.168.1.80";
*/
let OPENID;
let management = {
    // 发送信息到socket
    _$send : function(message){
        this._$getSocket().then( socket => {
            try{
                socket.send( JSON.stringify(message) );
            }catch(e){
                return Promise.reject(e);
            }
        }).catch( event => {
            this._$receiveSocketStateMessage( { error : !0,originMsg: message } );
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
        Object.assign( message,{mark : (new Date).valueOf()} );
        if( this[Symbol.for("onmessage")] ){
            this[Symbol.for("onmessage")]( "client",message );
        }
        if( message["ignore"] ){
            this._$receiveSocketMessage( message );
        }else{
            this._$send( message );
        }
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
                    }else{
                        _$this._$receiveSocketStateMessage( {error: !0, socketState : socket.readyState} )
                    }
                }
                let sokcetopened = !1;
                let pended = !1;
                socket = new WebSocket(`${protocol}//${host}:${port}/${path}`);
                _$this[ Symbol.for("socket") ] = socket;

                socket.onopen = function(){
                    socketopened = !0;
                    let openid = OPENID;
                    if( openid ){
                        socket.send( JSON.stringify({openid: openid,type: 10}) )
                    } else {
                        pended = !0;
                        resolve( socket );
                    }
                }
                socket.onerror = socket.onclose = function( event ){
                    if( !sokcetopened ){
                        pended = !0;
                        reject( event );
                    }else{
                        _$this._$receiveSocketStateMessage( {error: !0, socketState : socket.readyState} )
                    }
                }
                socket.onmessage = function( event ){
                    try{
                        let data = JSON.parse( event.data );
                        if( data["openid"] ){ OPENID = data["openid"] };
                        _$this._$receiveSocketMessage( { error : !1, data : data ,mark : (new Date).valueOf() } );
                        if( !pended ){ resolve( socket ) };
                    } catch( e ) {
                        _$this._$receiveSocketStateMessage({error: !0, msg : "message parse error",type: "JSONParseError"});
                        if( !pended ){ resolve( socket ) };
                    }
                }
            }catch( e ){
                reject( e );
            }
        })
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
