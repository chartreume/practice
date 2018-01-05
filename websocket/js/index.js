	


        	function OnConnect_cb(){
				showQueueStatusTitle();
        		showTitle("已连接");
        		
        		buttonSwitch("btnLogin");
        	}
        	function OnDisconnect_cb(){
        		showTitle("连接已断开");
        	
				buttonSwitch("btnLogin",false);
        		buttonSwitch("btnLogOut",false);
        		buttonSwitch("btnDial",false);
        		buttonSwitch("btnAgentList",false);
        		buttonSwitch("btnBusy",false);
        		buttonSwitch("btnIdle",false);
        		buttonSwitch("btnPickUp",false);
        		buttonSwitch("btnExtenPickUp",false);
        		buttonSwitch("btnGroupPickUp",false);
        		buttonSwitch("btnSpy",false);
        		buttonSwitch("btnGroupSpy",false);
				buttonSwitch("btnVersion",false);
				buttonSwitch("btnGetExtension",false);
				buttonSwitch("btnGetAgentStaffid",false);
				buttonSwitch("btnGetAgentName",false);
				buttonSwitch("btnGetSkill",false);
				buttonSwitch("btnGetNumber",false);
				buttonSwitch("btnGetBusyState",false);
				buttonSwitch("btnGetAgentState",false);
				buttonSwitch("btnGetCallState",false);
				buttonSwitch("btnGetRegState",false);
				clearInterval(web_hearbeartID);
        	}
        	function OnLoginSuccess_cb(){
        		showTitle("登录成功");
        		
        		buttonSwitch("btnLogin",false);
        		buttonSwitch("btnLogOut");
        		buttonSwitch("btnBusy");
        		buttonSwitch("btnDial");
        		buttonSwitch("btnAgentList");
        		buttonSwitch("btnPickUp");
        		buttonSwitch("btnExtenPickUp");
        		buttonSwitch("btnGroupPickUp");
        		buttonSwitch("btnSpy");
        		buttonSwitch("btnGroupSpy");
				buttonSwitch("btnVersion");
				buttonSwitch("btnGetExtension");
				buttonSwitch("btnGetAgentStaffid");
				buttonSwitch("btnGetAgentName");
				buttonSwitch("btnGetSkill");
				buttonSwitch("btnGetNumber");
				buttonSwitch("btnGetBusyState");
				buttonSwitch("btnGetAgentState");
				buttonSwitch("btnGetCallState");
				buttonSwitch("btnGetRegState");
				
				
        	}
        	
        	function OnLoginFail_cb(result){
        		showTitle(result);
        		web_extension=null;
				web_agentStaffid=null;
				web_agentName=null;
				web_skill=null;
        		buttonSwitch("btnLogin");
        	}
			function OnErrorNotice_cb(resultText){
        		alert(resultText);
        	}
        	function OnLogOutSuccess_cb(){
        		showTitle("注销登录成功");
			
        		buttonSwitch("btnLogin");
        		buttonSwitch("btnLogOut",false);
        		buttonSwitch("btnDial",false);
        		buttonSwitch("btnAgentList",false);
        		buttonSwitch("btnBusy",false);
        		buttonSwitch("btnIdle",false);
        		buttonSwitch("btnPickUp",false);
        		buttonSwitch("btnExtenPickUp",false);
        		buttonSwitch("btnGroupPickUp",false);
        		buttonSwitch("btnSpy",false);
        		buttonSwitch("btnGroupSpy",false);
				buttonSwitch("btnVersion",false);
				buttonSwitch("btnGetExtension",false);
				buttonSwitch("btnGetAgentStaffid",false);
				buttonSwitch("btnGetAgentName",false);
				buttonSwitch("btnGetSkill",false);
				buttonSwitch("btnGetNumber",false);
				buttonSwitch("btnGetBusyState",false);
				buttonSwitch("btnGetAgentState",false);
				buttonSwitch("btnGetCallState",false);
				buttonSwitch("btnGetRegState",false);
				
        	}
        	function extensionList_cb(list){
        		alert(list);
        	}
        	function OnIncommingRing_cb(phone,callid,autodial,province,city,isp,data){
        		showTitle("["+phone+"] 呼入振铃，通话编号["+callid+"]");
        	}
        	function OnIncommingAnswer_cb(phone,callid,autodial,province,city,isp,data){
        		showTitle("["+phone+"] 呼入通话，通话编号["+callid+"]");
        		
        		buttonSwitch("btnHold");
        		buttonSwitch("btnHangUp");
        		buttonSwitch("btnDial",false);
        		buttonSwitch("btnThreeWay");
        		buttonSwitch("btnTransfer");
        		buttonSwitch("btnTransferQueue");
        		buttonSwitch("btnTransferIvr");
        		buttonSwitch("btnPickUp",false);
        		buttonSwitch("btnExtenPickUp",false);
        		buttonSwitch("btnGroupPickUp",false);
        	}
        	function OnOutbound_cb(phone,callid,province,city,isp){
        		showTitle("外呼 ["+phone+"]，通话编号["+callid+"]");
         		
        		buttonSwitch("btnHold");
        		buttonSwitch("btnHangUp");
        		buttonSwitch("btnDial",false);
        		buttonSwitch("btnThreeWay");
        		buttonSwitch("btnTransfer");
        		buttonSwitch("btnTransferQueue");
        		buttonSwitch("btnTransferIvr");
        		buttonSwitch("btnPickUp",false);
        		buttonSwitch("btnExtenPickUp",false);
        		buttonSwitch("btnGroupPickUp",false);
        	}
        	function OnHangup_cb(){
        		showTitle("通话挂断");
        		
        		buttonSwitch("btnHold",false);
        		buttonSwitch("btnUnhold",false);
        		buttonSwitch("btnHangUp",false);
        		buttonSwitch("btnDial");
        		buttonSwitch("btnThreeWay",false);
        		buttonSwitch("btnTransfer",false);
        		buttonSwitch("btnTransferQueue",false);
        		buttonSwitch("btnTransferIvr",false);
        		buttonSwitch("btnPickUp");
        		buttonSwitch("btnExtenPickUp");
        		buttonSwitch("btnGroupPickUp");
        	}
        	function OnBusy_cb(reason){
        		showTitle("忙碌[" + reason + "]");
        		
        		buttonSwitch("btnBusy",false);
        		buttonSwitch("btnIdle");
        		buttonSwitch("btnDial",false);
        		buttonSwitch("btnPickUp",false);
        		buttonSwitch("btnExtenPickUp",false);
        		buttonSwitch("btnGroupPickUp",false);
        		buttonSwitch("btnSpy",false);
        		buttonSwitch("btnGroupSpy",false);
        	}
        	function OnFree_cb(){
        		showTitle("空闲");
        		
        		buttonSwitch("btnBusy");
        		buttonSwitch("btnIdle",false);
        		buttonSwitch("btnDial");
        		buttonSwitch("btnPickUp");
        		buttonSwitch("btnExtenPickUp");
        		buttonSwitch("btnGroupPickUp");
        		buttonSwitch("btnSpy");
        		buttonSwitch("btnGroupSpy");
        	}
		function OnOutboundRinging_cb(number,callid){
        		showTitle("外呼振铃 ["+number+"]，通话编号["+callid+"]");
        		
        		
        		buttonSwitch("btnHangUp");
        		buttonSwitch("btnIdle",false);
        		buttonSwitch("btnBusy",false);
        		buttonSwitch("btnHold",false);
        		buttonSwitch("btnUnhold",false);
        		buttonSwitch("btnDial",false);
        		buttonSwitch("btnThreeWay",false);
        		buttonSwitch("btnTransfer",false);
        		buttonSwitch("btnTransferQueue",false);
        		buttonSwitch("btnTransferIvr",false);
        		buttonSwitch("btnPickUp",false);
        		buttonSwitch("btnExtenPickUp",false);
        		buttonSwitch("btnGroupPickUp",false);
        		buttonSwitch("btnSpy",false);
        		buttonSwitch("btnGroupSpy",false);
        	}
		function OnStatusChanged_cb(reg,call,agent,busy,number){
			showStatusChangedTitle("分机状态 ["+reg+"]，通话状态["+call+"]，座席状态["+agent+"]，置忙原因["+busy+"]，对方号码["+number+"]");
		}
		function OnCallStatus_cb(call,number){
			showCallStatusTitle("通话状态["+call+"]，对方号码["+number+"]");
		}
		function OnQueueStatusChanged_cb(idle,agent,guest,queue){
			showQueueStatusTitle("队列:"+queue+";坐席数:"+agent+";空闲坐席数:"+idle+";队列排队数"+guest);
		}
       
        /**
         * 显示设置状态标题
        */
        function showTitle(title){
        		document.getElementById("div_state").innerHTML = '<h3 class="text-center">状态：'+title+'</h3>';
        	}
		function showStatusChangedTitle(title){
        		document.getElementById("div_statusChanged").innerHTML = "<h4>状态改变："+title+"</h4>";
        	}
		function showCallStatusTitle(title){
        		document.getElementById("div_callStatus").innerHTML = "<h4>通话状态："+title+"</h4>";
        	}
		function showQueueStatusTitle(title){
        		document.getElementById("div_queueStatus").innerHTML = "<h4>队列状态："+title+"</h4>";
        	}
        /**
        * 切换按钮可用状态
        * @param {String} id 按钮id
        * @param {String} able 是否启用(可选)，空或true时为启用,false为停用
        */
        function buttonSwitch(id,able){
        	if(able == null)
        		able = true;
        	document.getElementById(id).disabled = !able;
        	}