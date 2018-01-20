const IP = "192.168.1.117";
const PORT = 8081;
const TESTWORKERDUR = 5 * 60 * 1000;

let log = {
    log : (where,message) => {},
    error : (where,error) => {}
};

let workerUnion; //暂存 worker数据
let socketUnion; //暂存 socket数据
let socketStruct;//缓存 用户信息 [W.agentName,W.extension,W.agentStaffid,W.skill  ,S.reg,S.callState,S.agentState,S.busyState,S.number,queue]
let wokerGroup;  //缓存 worker实例

socketStruct = new Proxy({},{
    set : (target ,key, value , receiver) => {
        if( !( value instanceof Array) || key !== "value" ){
            return;
        }
        let oldValue = Reflect.get(target, Symbol.for("$"), receiver) || []
        ;
        value.forEach((item,i) => {oldValue[i] = item});
        return Reflect.set(target, Symbol.for("$"), oldValue ,receiver);
    },
    get : (target, key, receiver) => {
        if(key !== "value"){return undefined};
        let value = Reflect.get(target, Symbol.for("$"), receiver) || [];
        if(value[0] && value[4]){
            return value;
        }else{
            return [];
        }
    }
});


workerGroup = new Proxy({},{
    set : (target, key, value, receiver) => {
        if(key !== "value"){return }
        let oldValue = Reflect.get(target, Symbol.for("$2"), receiver) || [];
        if( value instanceof Array ){
            oldValue.concat(value);
        }else {
            oldValue.push(value);
        }
        Reflect.set( target, Symbol.for("$2"), oldValue, receiver);
    },
    get : (target, key, receiver) => {
        if(key !== "value" ){return []};
        let lostWorker = []
        ,   userfulWorker = []
        ,   now = ( new Date() ).valueOf()
        ,   oldValue = Reflect.get(target, Symbol.for("$2"), receiver) || []
        ,   dur = TESTWORKERDUR
        ;

        oldValue.forEach( (item) => {
            if( !item.timer ){
                item.timer = now;
            }
            if( ( now - item.timer >= dur ) && item.isTest ){
                lostWorker.push(item);
            }else {
                userfulWorker.push(item);
            }
        } );
        if( lostWorker.length ){
            Reflect.set(target, Symbol.for("$2"), userfulWorker, receiver);
        }
        return Reflect.get(target, Symbol.for("$2"), receiver);
    }
});

let proxy = new Proxy({},{
    set : (target, key, value, receiver) => {
        if(key === "userData"){
            workerUnion = value;
        }else if(key === "serverData"){
            socketUnion = value;
        }else if(key === "sessionData"){
            socketStruct.value = value;
        }else if(key === "worker"){
            workerGroup.value = value;
        }else {
            if( key === Symbol.for("socket")){
                let stat = target[Symbol.for("socket")];
                if( stat == value ){
                    return;
                }else if( stat == 2 || value == 2){
                    target[Symbol.for("socketChange")](value);
                }
            }
            Reflect.set(target, key, value, receiver);
        }
    },
    get : (target, key, receiver) => {
        if(key === "userData"){
            return workerUnion;
        }else if(key === "serverData"){
            return socketUnion;
        }else if(key === "sessionData"){
            return socketStruct.value;
        }else if(key === "worker"){
            return workerGroup.value;
        }else{
            return Reflect.get(target, key, receiver);
        }
    }
});

proxy.VERSION = "2.17.0505";

proxy[Symbol.for("socketChange")] = (stat) => {
    if( stat == 2 ){
        proxy[Symbol.for("postMessagetoWorker")]("socket:on");
    }else{
        proxy[Symbol.for("postMessagetoWorker")]("socket:off");
    }
}
proxy[Symbol.for("init")] = () => {
    let xy = proxy
    ,   sym = Symbol.for("socket")
    ;
    if( xy[sym] !== undefined ){
        xy[sym] = 0;
    }
    (function(){
        return new Promise((resolve, reject) => {
            let websocket = new WebSocket(`ws://${IP}:${PORT}/spcc/cti`);
            xy[sym] = 1;
            websocket.onopen = (event) => { resolve(websocket) };
            websocket.onerror = (error) => { reject(error) };
            websocket.onclose = (event) => { reject(event) };
            websocket.onmessageerror = (error) => { reject(error) };
        })
    }()).then(
        ( socket ) => {
            xy[sym] = 2;
            socket.onmessage = xy[Symbol.for("receiveFromSocket")];
            xy[Symbol.for("toSocket")] = socket;
        },
        ( e ) => { e instanceof Error ? proxy.socketStatus = 4 : proxy.socketStatus = 5;}
    )
};

proxy[Symbol.for("receiveFromSocket")] = (event) => {
    let data = (event.data || "").split("\n")
    ,   object = {}
    ,   session = []
    ,   union = []
    ,   name
    ,   subname
    ,   login
    ,   ring
    ,   loginMessage
    ,   xy = proxy
    ,   sendtoworker = xy[Symbol.for("postMessagetoWorker")]
    ;

    data.forEach( (value) => { if(value != ""){ let array = value.split(":"); object[array[0]] = array[1]; }  } );

    if(object["messageType"] === "event"){
        name = "event";
        switch( object["name"] ){
            case "agent status":
                subname = "agentStatus";
                break;
            case "call status":
                subname = "callStatus";
                ({call:union[0], number: union[1]} = object);
                break;
            case "outbound ringing":
                subname = "outboundRinging";
                ring = "out";
            case "outbound answered":
                ring = ring || "out";
                subname = subname || "outboundAnswered";
            case "incomming ringing":
                ring = ring || "in";
                subname = subname || "incommingRinging";
            case "incomming answered":
                ring = ring || "in";
                subname = subname || "incommingAnswered";
                ({number:union[0],callid : union[1],province:union[2], city:union[3] , isp:union[4], autodial:union[5] ,data:union[6]} = object);
                break;
            case "hangup":
                subname = "hangup:free";
                session[7] = "";
                break;
            case "status changed":
                subname = "statusChanged";
                union[0] = object.number;
                ({reg:session[4],call:session[5],agent:session[6],busy:session[7] = "",number:session[8]} = object);
                break;
            case "queue status":
                subname = "queueStatus";
                ({idle:union[0],agent:union[1],guest:union[2],queue:union[3]} = object);
                break;
            case "busy status":
                session[7] = object.busy || "";
                if(session[7]){
                    subname = "busy";
                }else{
                    subname = "free";
                }
                break;
            default:
                break;
        }
    }else if(object["messageType"] === "heartbeat response"){
        xy.resetHeartBeat = 0;
    }else if(object["messageType"] === "command response"){
        name = "command";
        switch (object["command"]) {
            case "login":
                if(object.success == "true"){
                    login = "login";
                }else{
                    login = "error";
                    loginMessage = object.resultText;
                }
                session[7] = object["busy"] || "";
                subname = "login:" + (session[7] ? "busy" : "free");
                break;
            case "logout":
                if(object.success){
                    subname = "login";
                    login = "logout";
                    Reflect.set(socketStruct,"value",[]);
                }
                break;
            case "getExtensionList":
                if(object.success){
                    subname = "extenlist";

                    let text = object.resultText
                    ,   message = []
                    ;
                    text.split(",").forEach(function(item,i){
                        let array = item.split("|");
                        this[i] = `{exten:${array[0]},name:${array[1]},loginId:${array[2]},sector:${array[3]},group:${array[4]},state:${array[5]},busy:${array[6]}}`;
                    },message);
                    union[0] = JSON.stringify(message);
                }
            default:
                break;
        }
    }
    if( !name || !subname ){
        return;
    }
    if( union.length )xy["serverData"] = union;
    if( login ){xy["login"] = login;xy["loginMessage"] = loginMessage;};
    if( session.length )xy["sessionData"] = session;
    if( ring ) xy["ringDirct"] =  ring;


    subname.split(":").forEach(function(item){
        if( item === "busy" || item === "free" ){
            sendtoworker("event:" + item);
        }else{
            sendtoworker(name + ":" + subname);
        }
    });
    return ;
}
proxy[Symbol.for("receiveFromWorker")] = (event) => {
    let xy = proxy
    ,   data = event.data
    ,   union = data.slice(2)
    ,   session = []
    ;

    event.target.timer = (new Date()).valueOf();

    if( data[0] === "workerConnectTest" ){
        delete event.target.isTest;
        return ;
    }else if( data[0] === "command" && data[1] === "login"){
        if( xy["login"] === "login" && xy[Symbol.for("socket")] == 2 ){
            xy[Symbol.for("postMessagetoWorker")]("get:login",event.target)
            return;
        }
        if(!union[8]){union[8] = 0};
        [,,session[0],session[1],session[9],session[2],session[3]] = data;
    }else if(data[0] === "extension" && data[1] === "getlist"){
        if(!union[0])union[0] = "all";
    }
    if( union.length )xy["userData"] = union;
    if( session.length)xy["sessionData"] = session;
    let reg = /^(command\:(login|busy|free|logout))|(tel\:(out|hold|unhold|hangup))|(link\:(threeWay|transfer|transferQueue|transferIvr))|(spy\:(spy|group))|(pick\:(group|exten|pick))|(extension\:(insert|cut|getlist))$/
    ,   type = `${data[0]}:${data[1]}`
    ;
    if( reg.test(type) ){
        xy[Symbol.for("postMessageToSocket")](type);
    }else{
        xy[Symbol.for("postMessagetoWorker")](type,event.target);
    }
}
proxy[Symbol.for("postMessageToSocket")] = (type) => {
    let xy = proxy
    ,   socket = xy[Symbol.for("toSocket")]
    ,   str
    ,   union = xy["userData"]
    ;
    for(let i = 0; i < 9 ; i++){
        if(union[i] === undefined){
            union[i] = "";
        }
    }
    switch(type){
        case "command:login":
            str = `command:login\nagent:${union[0]}\nextension:${union[1]}\nqueue:${union[2]}\nstaffid:${union[3]}\nbusyString:${union[5]}\nskill:${union[4]}\nsecid:${union[6]}\nsecname:${union[7]}\nautoacw:${union[8]}\n\n`;
            break;
        case "command:logout":
            str = `${type}\n\n`;
            break;
        case "command:busy":
            str = `command:busy\nbusyString:${union[0]}\n\n`;
            break;
        case "command:free":
            str = `command:idle\n\n`;
            break;
        case "tel:out":
            //[object.outPhone,object.outCusid = "",object.outCusname = "",object.outProid = "",object.outProname = ""]
            str = `command:dial\ndialString:${union[0]}\ncusname:${union[2]}\ncusid:${union[3]}\nproname:${union[4]}\n\n`;
            break;
        case "tel:hold":
            str = `command:hold\n\n`;
            break;
        case "tel:unhold":
            str = `command:unhold\n\n`;
            break;
        case "tel:hangup":
            str = `command:hangup\n\n`;
            break;
        case "link:threeWay":
            str = `command:threeWay\ndialString:${union[0]}\n\n`;
            break;
        case "link:transfer":
            str = `command:transfer\ndialString:${union[0]}\n\n`;
            break;
        case "link:transferQueue":
            str = `command:transferQueue\nqueue:${union[0]}\n\n`;
            break;
        case "link:transferIvr":
            str = `command:transferIvr\nivr:${union[0]}\n\n`;
            break;
        case "spy:spy":
            str = `command:spy\nextension:${union[0]}\n\n`;
            break;
        case "spy:group":
            str = `command:groupSpy\ngroup:${union[0]}\n\n`;
            break;
        case "pick:pick":
            str = `command:pickup\n\n`;
            break;
        case "pick:group":
            str = `command:groupPickup\ngroup:${union[0]}\n\n`;
            break;
        case "pick:exten":
            str = `command:pickupExtension\nextension:${union[0]}\n\n`;
            break;
        case "extension:insert":
            str = `command:insert\extension:${union[0]}\n\n`;
            break;
        case "extension:cut":
            str = `command:hangupExtension\extension:${union[0]}\n\n`;
            break;
        case "extension:getlist":
            str = `command:getExtensionList\ntype:${union[0]}\nsecid:${union[1]}\nqueue:${union[2]}\n\n`;
            break;
        default:
        break;
    }
    if(str){
        console.log(str);
        socket.send(str);
    }
}
proxy[Symbol.for("postMessagetoWorker")] = (type,worker) => {
    let xy = proxy
    ,   cache = xy["sessionData"]
    ,   union = xy["serverData"]
    ,   [name,subname = ""] = type.split(":")
    ,   result = []
    ,   now = (new Date()).valueOf()
    ;
    if(name === "close" || name === "workerConnectTest"){
        result = [name,now];
    }
    if(name === "socket"){
        result = [name,subname];
    }else if(name === "get"){
        if(subname === undefined || subname === "base"){
            result = ["baseInfo",xy["VERSION"],xy[Symbol.for("socket")] == 2 ? "on" : "off",xy["login"],xy["loginMessage"]];
        }else{
            result = ["loginInfo"].concat(cache);
        }
    }else if(name === "command"){
        if(subname === "login" || subname === "logout"){
            result = ["loginStatus",xy["login"],xy["loginMessage"]];
        }else if(subname === "extenlist"){
            result = ["extenListMessage"].concat(union);
        }
    }else if(name === "event"){
        if(subname === "busy" || subname === "free" || subname === "statusChanged"){
            result = [name, subname].concat(cache);
        }else if(subname === "hangup"){
            result = [name,subname,xy["ringDirct"]];
        }else{
            result = [name, subname].concat(union);
        }
    }
    if(worker){
        worker = [worker];
    }else {
        worker = xy["worker"];
    }
    if( !result.length ){
        return;
    }
    worker.forEach((item) => {
        if(!item.timer ){
            item.timer = now;
        }
        if( now - item.timer > TESTWORKERDUR){
            item.isTest = true;
            item.timer = now;
            console.log("test");
            item.postMessage(["workerConnectTest",now]);
        }
        item.postMessage(result);
    })
};

onconnect = function(event) {
     let xy = proxy
     ,  port = event.ports[0]
     ;
     xy["worker"] = port;

     port.postMessage(["baseInfo",xy["VERSION"],xy[Symbol.for("socket")] == 2 ? "on" : "off",xy["login"],xy["loginMessage"]]);
     port.onmessage = xy[Symbol.for("receiveFromWorker")];
     port.onmessageerror = (error) => {console.log("messageerror")};


};
proxy[Symbol.for("init")]();
