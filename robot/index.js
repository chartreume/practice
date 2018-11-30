const socketPort = 8080;
const socketIP = "127.0.0.1";
const stamp = "stamp";
let socket = {
    sendMessage : function(message){
        this._getSocket().then(socket=>socket.send(message)).catch(console.error);
    },
    getMessage : function(message){
        console.log(message);
    },
    _getSocket : function(){
        return new Promise((resolve,reject) => {
            let socket = this.socket;
            if(!socket){
                let $ = this;
                let open = !1;
                socket = new WebSocket(`ws://${socketIP}:${socketPort}`);
                socket.onopen = function(){
                    let win = window;
                    open = !0;
                    (function waiting(){
                        if(socket.readyState == "0"){
                            win.requestAnimationFrame(waiting);
                        }else{
                            $.socket = socket;
                            resolve(socket);
                        }
                    }());
                };
                if()
                socket.onclose = socket.onerror = reject;
                socket.onmessage = this.getMessage;
            }else{
                resolve(socket);
            }

        })
    }
};
let messageManagement = {
    _cache: [],
    _addHistory : function(messages){
        page.renderHistory(messages);
        if(messages.length){
            this._cache = messages.concat(this._cache);
        }
    },
    getFirstMessage : function(){
        return this._cache[0]||null;
    },
    addMessage : function(message){
        let prevStamp = this._cache.length && this._cache[this._cache.length - 1][stamp];
        page.render(message,prevStamp);
    }
}
let page = {
    renderHistory : function(messages){
    },
    render : function(message,prevStamp,nextStamp){
    }
}
