let messageController = {
    _cache :[],
    onServerMessage : function(msg){
        let stamp = this.createStamp();
        Object.assign(msg,{stamp});
        this.sendToPage(msg,"server");
        if(!msg["error"]){
            this.storageMessage(msg,"server");
        }
    },
    createStamp : function(){
        return (new Date).valueOf();
    },
    onPageMessage : function(msg){
        if( typeof msg === "string" ){
            msg = { msg : msg };
        }
        let stamp = this.createStamp();
        Object.assign(msg,{stamp});
        this.sendToPage(msg,"client");
        this.sendToServer(msg);
        this.storageMessage(msg,"client");
    },
    sendToServer : function(msg){
        socket.send(JSON.stringify(msg));
    },
    messageCallback: function(){},
    sendToPage : function( msg,from ){
        this.messageCallback(msg,from)
    },
    storageMessage : function(msg,from){
    },
    bindPageMessage : function(func){
        if(Object.prototype.toString.call(func) === "[object Function]"){
            this.messageCallback = func;
        }
    }
}
socket.onMessage(function(msg){
    console.log(msg);
    messageController.onServerMessage(msg);
});
/*
    init { req: {code : code ,command : 0 ,stamp : stamp ,from: client}, res: {login : bool , usrname : username ,userphoto: imageSrc, stamp: stamp ,from:server }}
*/
