var sapoOcx = {	
}
var webSocket = null;
sapoOcx.api={
		config: {
			serverIp : "",//CTI服务器地址
			commuPort : 8080,//CTI服务器通讯端口
			policyPort : 1209,//CTI服务器安全认证端口(不修改)
			debug: false,//调试模式
			waitFlag : 10,//加载通信组件重新加载次数
			initFinish: false,//初始化是否完成
			callBackArray : new Array(),//事件通知回调函数
			connectToServer: function(){
				if(!this.initFinish){
					this.initFinish=true;
					setTimeout("sapoOcx.api.config.connectToServer()",200);
				}else{
					this.getOcx().initConnection(this.serverIp,this.commuPort);
				}
			},
			getOcx:function(){
			return socket.api;
			}
		},
		/**
		 * 设置调试运行模式
		 */
		setDebugMode: function(){
			this.config.debug = true;
		},
		/**
		 * 设置事件通知函数
		 * @param {String} event 事件类型
		 * @param {String} funName 回调函数名
		 */
		setCallBack: function(event,funName){
			if(!this.config.initFinish){
				this.config.callBackArray.push([event,funName]);
			}else{
				this.config.getOcx().setCallBack(event,funName);
			}
		},
		/**
		 * 连接到CTI服务器
		 * @param {String} server 服务器IP地址
		 * @param {String} port 服务端口(可选)
		 */
		connect: function(server,port){
			this.config.serverIp = server;
			if(port != null && port != "")
				this.config.commuPort = port;
			this.config.connectToServer();
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
		login: function(agent,extension,queue,staffid,skill,busyString,sectorId,sectorName,autoAcw,hearbeartInterval){
			if(busyString == null)
				busyString = "";
			if(sectorId == null)
				sectorId = "";
			if(sectorName == null)
				sectorName = "";
			if(autoAcw != "0" && autoAcw != "1" && autoAcw != "2" && autoAcw != "3"){
				autoAcw = "0";
			}
			
			if(hearbeartInterval==null){
				hearbeartInterval=0;
			}
			web_hearbeartInterval=hearbeartInterval;
			web_extension=extension;
			web_agentStaffid=staffid;
			web_agentName=agent;
			web_skill=skill;
			this.config.getOcx().login(agent,extension,queue,staffid,skill,busyString,sectorId,sectorName,autoAcw)
		},
		/**
		 * 注销登录
		 */
		loginOut: function(){
			this.config.getOcx().loginOut();
		},
		/**
		 * 获取分机/坐席列表
		 * @param {String} type 获取类型
		 * all:全部分机/idle:空闲分机/agent:全部已登录坐席/agentidle:空闲坐席
		 * @param {String} secid
		 * @param {String} group
		 */
		getExtenList: function(type,secid,queue){
			if(type == null || type == "")
				type  = "all";
			if(secid == null)
				secid = "";
			if(queue == null)
				queue = "";
			this.config.getOcx().getExtenList(type,secid,queue);
		},
		/**
		 * 外拨
		 * @param {String} phone 呼叫号码
		 */
		dial: function(phone,cusid,cusname,proid,proname){
			if(cusid == null)
				cusid = "";
			if(cusname == null)
				cusname = "";
			if(proid == null)
				proid = "";
			if(proname == null)
				proname = "";
			this.config.getOcx().dial(phone,cusid,cusname,proid,proname);
		},
		/**
		 * 保持
		 */
		hold: function(){
			this.config.getOcx().hold();
		},
		/**
		 * 解除保持
		 */
		unhold: function(){
			this.config.getOcx().unhold();
		},
		/**
		 * 挂机
		 */
		hangup: function(){
			this.config.getOcx().hangup();
		},
		/**
		 * 置闲
		 */
		free: function(){
			this.config.getOcx().idle();
		},
		/**
		 * 置忙
		 * @param {String} busy 置忙原因
		 */
		busy: function(busy){
			if(busy == null)
				busy = "";
			this.config.getOcx().busy(busy);
		},
		/**
		 * 三方
		 * @param {String} phone 三方号码
		 */
		threeWay: function(phone){
			this.config.getOcx().threeWay(phone);
		},
		/**
		 * 转接
		 * @param {String} phone 转接号码
		 */
		transfer: function(phone){
			this.config.getOcx().transfer(phone);
		},
		/**
		 * 转接组
		 * @param {String} queue 组号
		 */
		transferQueue: function(queue){
			this.config.getOcx().transferQueue(queue);
		},
		/**
		 * 转接IVR节点
		 * @param {String} ivr 节点编号
		 */
		transferIvr: function(ivr){
			this.config.getOcx().transferIvr(ivr);
		},
		/**
		 * 抢接(盲抢)
		 */
		pickUp: function(){
			this.config.getOcx().pickUp();
		},
		/**
		 * 抢接分机
		 * @param {String} exten 分机号
		 */
		extenPickUp: function(exten){
			this.config.getOcx().extenPickUp(exten);
		},
		/**
		 * 组抢接
		 * @param {String} group 组号
		 */
		groupPickUp: function(group){
			this.config.getOcx().groupPickUp(group);
		},
		/**
		 * 分机监听
		 * @param {String} extension 分机号
		 */
		spy: function(extension){
			this.config.getOcx().spy(extension);
		},
		/**
		 * 组监听
		 * @param {String} group 组
		 */
		groupSpy: function(group){
			this.config.getOcx().groupSpy(group);
		},
		/**
		 * 分机强插
		 * @param {String} extension 分机号
		 */
		insertExtension: function(extension){
			this.config.getOcx().insertExtension(extension);
		},
		/**
		 * 分机强拆
		 * @param {String} extension 分机号
		 */
		cutExtension: function(extension){
			this.config.getOcx().cutExtension(extension);
		},
		/**
		 * 版本信息
		 */
		getVersion: function(){
			return web_version;
		},
		/**
		* 获取当前分机号码
		*/
		getExtension: function(){
			return web_extension;
		},
		/**
		* 获取当前座席工号
		*/
		getAgentStaffid: function(){
			return web_agentStaffid;
		},
		/**
		* 获取当前座席姓名
		*/
		getAgentName: function(){
			return web_agentName;
		},
		/**
		* 获取当前座席技能组
		*/
		getSkill: function(){
			return web_skill;
		},
		/**
		* 获取当前通话号码
		*/
		getNumber: function(){
			return web_number;
		},
		/**
		* 获取置忙原因
		*/
		getBusyState: function(){
			return web_busyStatue;
		},
		/**
		* 获取坐席注册状态
		*/
		getAgentState: function(){
			return web_agentStatue;
		},
		/**
		* 获取通话状态
		*/
		getCallState: function(){
			return web_callStatue;
		},
		/**
		* 获取话机注册状态
		*/
		getRegState: function(){
			return web_reg;
		}
}


