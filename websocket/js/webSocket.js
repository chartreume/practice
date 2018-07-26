/**
 * webSocket支持类，和服务器通信
 */
var socket={}
var webSocket = null;
var web_version="2.17.0505";
var web_extension=null;
var web_agentStaffid=null;
var web_agentName=null;
var web_skill=null;
var web_reg=null;
var web_callStatue=null;
var web_agentStatue=null;
var web_busyStatue=null;
var web_number=null;
var web_hearbeatCount=0;
var web_hearbeartInterval=0;
var web_hearbeartID=0;
socket.api={
		//初始创建webSocket连接
		 initConnection:function(ip,port){
			var wsUrl = 'ws://'+ip+':'+port+'/spcc/cti';
			webSocket = new WebSocket(wsUrl);
			webSocket.onopen = function(event) {
				OnConnect_cb();
				console.log("connection success！");
			}
			webSocket.onclose = function(event) {
				OnDisconnect_cb();
				web_extension=null;
				web_agentStaffid=null;
				web_agentName=null;
				web_skill=null;

				web_reg=null;
				web_callStatue=null;
				web_agentStatue=null;
				web_busyStatue=null;
				web_number=null;

				clearInterval(web_hearbeartID);

				console.log("quit success!");
			}
			//发送一个消息
			var busy = '';
			webSocket.onmessage = function(event) {
				var obj = event.data;
				var data = obj.split("\n");
				var object = {};
				data.forEach(function(value){
					if(value!=""){
						var objData = value.split(":");
						object[objData[0]] = objData[1];
					}
				});
				//console.dir(object);
				var messageType = object.messageType;
				if(messageType=='event'){
					showConsole('2',obj);
					var name = object.name;
					if(name=='agent status'){

					}
					if(name=='call status'){
						OnCallStatus_cb(object.call,object.number);
					}
					if(name=='outbound ringing'){
						OnOutboundRinging_cb(object.number,object.callid);
					}
					if(name=='outbound answered'){
						OnOutbound_cb(object.number,object.callid,object.province,object.city,object.isp);
					}
					if(name=='incomming ringing'){
						OnIncommingRing_cb(object.number,object.callid,object.autodial,object.province,object.city,object.isp,object.data);
					}
					if(name=='incomming answered'){
						OnIncommingAnswer_cb(object.number,object.callid,object.autodial,object.province,object.city,object.isp,object.data);
					}
					if(name=='hangup'){
						OnHangup_cb();
						OnFree_cb();
					}
					if(name=='status changed'){
						busy = object.busy;
						var number = '';
						if(object.number){
							number = object.number;
						}
						OnStatusChanged_cb(object.reg,object.call,object.agent,object.busy,number);
						web_reg=object.reg;
						web_callStatue=object.call;
						web_agentStatue=object.agent;
						web_busyStatue=object.busy;
						web_number=object.number;
					}
					if(name=='queue status'){
						OnQueueStatusChanged_cb(object.idle,object.agent,object.guest,object.queue)
					}
					if(name=='busy status'){
						busy = object.busy;
						if(busy==""){
							OnFree_cb();
						}else{
							OnBusy_cb(busy);
						}
					}
				}else if(messageType=='heartbeat response'){
					showConsole('3',obj);
					web_hearbeatCount=0;
				}else if(messageType=='command response'){
					showConsole('3',obj);
						var command = object.command;
						if(command=="login"){
							if(object.success=='true'){
								OnLoginSuccess_cb();
								if(web_hearbeartInterval>0){
									web_hearbeartID=setInterval("sendHearbeatMessage()",web_hearbeartInterval*1000);
								}
								if(busy==""){
									OnFree_cb();
								}else{
									OnBusy_cb(busy);
								}
							}else{
								OnLoginFail_cb(object.resultText);
							}
						}
						if(command=="logout"){
							if(object.success){
								OnLogOutSuccess_cb();
								web_extension=null;
								web_agentStaffid=null;
								web_agentName=null;
								web_skill=null;

								web_reg=null;
								web_callStatue=null;
								web_agentStatue=null;
								web_busyStatue=null;
								web_number=null;

								clearInterval(web_hearbeartID);
							}
						}
						if(command=="getExtensionList"){
							if(object.success){
								var test = object.resultText;
								var index = test.indexOf(",");
								var message = "";
								message += "[";
								if(index>0){
									var messageList = test.split(",");
									console.log(messageList.length);
									for(var i=0;i<messageList.length;i++){
										var tList = messageList[i].split("|");
										if(i==messageList.length-1){
											message+="{exten:"+tList[0]+",name:"+tList[1]+",loginId:"+tList[2]+",sector:"+tList[3]+",group:"+tList[4]+",state:"+
											tList[5]+",busy:"+tList[6]+"}";
										}else{
											message+="{exten:"+tList[0]+",name:"+tList[1]+",loginId:"+tList[2]+",sector:"+tList[3]+",group:"+tList[4]+",state:"+
											tList[5]+",busy:"+tList[6]+"},";
										}
									}
								}else{
									var testList = test.split("|");
									message+="{exten:"+testList[0]+",name:"+testList[1]+",loginId:"+testList[2]+",sector:"+testList[3]+",group:"+testList[4]+",state:"+
									testList[5]+",busy:"+testList[6]+"}";
								}
								message += "]";
								extensionList_cb(message);
							}
						}
				}
			}
			webSocket.onerror = function(event){
					console.log(event);
			}
		},
		/**
		 * 坐席登录
		 * @param {String} agent 姓名
		 * @param {String} extension 分机号
		 * @param {String} queue 技能组
		 * @param {String} staffid 工号
		 * @param {String} skill 技能值
		 * @param {String} busyString 置忙原因
		 * @param {String} sectorId 部门id
		 * @param {String} sectorName 部门名称
		 * @param {String} autoAcw 自动话后
		 */
		 login:function(agent,extension,queue,staffid,skill,busyString,sectorId,sectorName,autoAcw){
			var strSend = '';
			strSend = 'command:login\nagent:'+agent+'\nextension:'+extension
	        +'\nqueue:'+queue+'\nstaffid:'+staffid+'\nbusyString:'+busyString
	        +'\nskill:'+skill+'\nsecid:'+sectorId+'\nsecname:'+sectorName+'\nautoacw:'+autoAcw+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 座席注销
		 */
		loginOut:function(){
			var strSend = '';
			strSend = 'command:logout\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 保持
		 */
		hold: function(){
			var strSend = '';
			strSend = 'command:hold\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 解除保持
		 */
		unhold: function(){
			var strSend = '';
			strSend = 'command:unhold\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 挂机
		 */
		hangup: function(){
			var strSend = '';
			strSend = 'command:hangup\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 获取座席列表
		 * @param type
		 * @param secid
		 * @param queue
		 */
		getExtenList:function(type,secid,queue){
			var strSend = '';
			strSend = 'command:getExtensionList\ntype:'+type+'\nsecid:'+secid+'\nqueue:'+queue+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 置闲
		 */
		idle:function(){
			var strSend = '';
			strSend = 'command:idle\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 置忙
		 */
		busy:function(reason){
			var strSend = '';
			strSend = 'command:busy\nbusyString:'+reason+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 外呼
		 * @param phone
		 * @param cusid
		 * @param cusname
		 * @param proid
		 * @param proname
		 */
		dial:function(phone,cusid,cusname,proid,proname){
			var strSend = '';
			strSend = 'command:dial\ndialString:'+phone+'\ncusname:'+cusname+'\ncusid:'+proid+'\nproname:'+proname+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 三方
		 * @param phone
		 */
		threeWay:function(phone){
			var strSend = '';
			strSend = 'command:threeWay\ndialString:'+phone+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 转接分机
		 * @param phone
		 */
		transfer: function(phone){
			var strSend = '';
			strSend = 'command:transfer\ndialString:'+phone+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 转接组
		 * @param {String} queue 组号
		 */
		transferQueue: function(queue){
			var strSend = '';
			strSend = 'command:transferQueue\nqueue:'+queue+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 转接IVR节点
		 * @param {String} ivr 节点编号
		 */
		transferIvr: function(ivr){
			var strSend = '';
			strSend = 'command:transferIvr\nivr:'+ivr+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 组抢接
		 * @param {String} group 组号
		 */
		groupPickUp: function(group){
			var strSend = '';
			strSend = 'command:groupPickup\ngroup:'+group+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 抢接分机
		 * @param {String} exten 分机号
		 */
		extenPickUp: function(exten){
			var strSend = '';
			strSend = 'command:pickupExtension\nextension'+exten+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 抢接(盲抢)
		 */
		pickUp: function(){
			var strSend = '';
			strSend = 'command:pickup\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 分机监听
		 * @param {String} extension 分机号
		 */
		spy: function(extension){
			var strSend = '';
			strSend = 'command:spy\nextension:'+extension+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 组监听
		 * @param {String} group 组
		 */
		groupSpy: function(group){
			var strSend = '';
			strSend = 'command:groupSpy\ngroup:'+group+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 分机强插
		 * @param {String} extension 分机号
		 */
		insertExtension: function(extension){
			var strSend = '';
			strSend = 'command:insert\extension':'+extension'+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		},
		/**
		 * 分机强拆
		 * @param {String} extension 分机号
		 */
		cutExtension: function(extension){
			var strSend = '';
			strSend = 'command:hangupExtension\extension':'+extension'+'\n\n';
			showConsole('1',strSend);
			webSocket.send(strSend);
		}
}
function getTime(){
	var myDate = new Date();
	var time = myDate.getHours() + ":";
	time += (myDate.getMinutes() < 10 ? "0":"") + myDate.getMinutes() + ":";
	time += (myDate.getSeconds() < 10 ?"0":"") + myDate.getSeconds();
	return "[" + time + "]";
}
function sendHearbeatMessage(){
	if(web_hearbeatCount>=3){
		webSocket.close();
		/*OnDisconnect_cb();
		web_extension=null;
		web_agentStaffid=null;
		web_agentName=null;
		web_skill=null;

		web_reg=null;
		web_callStatue=null;
		web_agentStatue=null;
		web_busyStatue=null;
		web_number=null;
		web_hearbeatCount=0;*/
	}
	else{
		web_hearbeatCount=web_hearbeatCount+1;
		var strSend = '';
		strSend='command:heartbeat'+'\n\n';
		showConsole('1',strSend);
		webSocket.send(strSend);
	}
}
/**
 * 发送指令
 * @param message
 */
function showConsole(num,message){
	if(sapoOcx.api.config.debug){
		message = message.replace(/\n/g,'|');
		message = message.substring(0,message.length-2);
		if(num=='1'){
			message = getTime() + '[发送指令]:{'+message +'}';
		}else if(num=='2'){
			message = getTime() + '[事件通知]:{'+message +'}';
		}else if(num=='3'){
			message = getTime() + '[指令响应]:{'+message +'}';
		}

		console.log(message);
	}
}
