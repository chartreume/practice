<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">

<title>My JSP 'index.jsp' starting page</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<link rel="stylesheet" href="css/bootstrap.min.css">
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap/bootstrap.min.js"></script>
<script src="js/sapoOCX.js"></script>
<script src="js/webSocket.js"></script>
<script src="js/index.js"></script>
</head>

<script type="text/javaScript">	
	// 设置运行模式为调试级别
	// 正式上线运行请删除此函数，即切换为Release模式
	sapoOcx.api.setDebugMode();
	//连接服务器
	sapoOcx.api.connect('192.168.10.18');
</script>
<body>
	<div class="container">
		<div class="row clearfix">
			<div id="div_state" class="alert alert-info">
				<h3 class="text-center">状态：未连接</h3>
			</div>
			<div id="div_statusChanged">
				<h4>状态改变:</h4>
			</div>
			<div id="div_callStatus">
				<h4>通话状态:</h4>
			</div>
			<div id="div_queueStatus">
				<h4>队列状态:</h4>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
				<form class="navbar-form" role="form">
				座席名：<input type="text" class="form-control input-sm" id="txtAgentName" style="width:100px">
				分机号：<input type="text" class="form-control input-sm" id="txtPhoneAccount" style="width:100px">
				座席组名：<input type="text" class="form-control input-sm" id="txtAgentGroup" style="width:100px" value='kefu'>
				工号：<input type="text" class="form-control input-sm" id="txtAgentNumber" style="width:100px">
				技能值：<input type="text" class="form-control input-sm" id="txtLevel" style="width:100px" value='1'></br>
				登录置忙原因：<input type="text" class="form-control input-sm" id="txtBusy" style="width:100px" value='准备'>
				部门编号：<input type="text" class="form-control input-sm" id="txtSecotrId" style="width:100px">
				部门名称：<input type="text" class="form-control input-sm" id="txtSectorName" style="width:100px" value='客服部'>
				自动话后: <select id='selPhoneAfter' class="form-control input-sm" style="width:110px">
									<option value="0">关闭</option>
									<option value="1">仅呼入</option>
									<option value="2">仅呼出</option>
									<option value="3">全部</option>
								</select>
				</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
				<form class="navbar-form" role="form">
					<button type="button" id="btnLogin" class="btn btn-default"
						disabled="disabled"
						onclick="sapoOcx.api.login(document.getElementById('txtAgentName').value.trim(),document.getElementById('txtPhoneAccount').value.trim(),document.getElementById('txtAgentGroup').value.trim(),document.getElementById('txtAgentNumber').value.trim(),document.getElementById('txtLevel').value.trim(),document.getElementById('txtBusy').value.trim(),document.getElementById('txtSecotrId').value.trim(),document.getElementById('txtSectorName').value.trim(),document.getElementById('selPhoneAfter').value.trim(),0);">登录</button>
					<button type="button" id="btnLogOut" class="btn btn-default"
						disabled="disabled" onclick="sapoOcx.api.loginOut();">注销</button>
					<button type="button" id="btnHold" class="btn btn-default"
						disabled="disabled"
						onclick="sapoOcx.api.hold();buttonSwitch('btnHold',false);buttonSwitch('btnUnhold');">保持</button>
					<button type="button" id="btnUnhold" class="btn btn-default"
						disabled="disabled"
						onclick="sapoOcx.api.unhold();buttonSwitch('btnHold');buttonSwitch('btnUnhold',false);">解除保持</button>
					<button type="button" id="btnHangUp" class="btn btn-default"
						disabled="disabled" onclick="sapoOcx.api.hangup();">挂机</button>
					<button type="button" id="btnAgentList" class="btn btn-default"
						disabled="disabled" onclick="sapoOcx.api.getExtenList('agent');">获取坐席列表</button>
					<button type="button" id="btnVersion" class="btn btn-default"
						disabled="disabled" onclick="alert('当前版本:'+sapoOcx.api.getVersion());">版本信息</button>

				</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
								<select id='selBusy' class="form-control input-sm" style="width:110px">
									<option value="">无</option>
									<option value="业务处理">业务处理</option>
									<option value="话后">话后</option>
									<option value="开会">开会</option>
								</select>
								<button type="button" id="btnBusy" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.busy(document.getElementById('selBusy').value);">置忙</button>
							<button type="button" id="btnIdle" class="btn btn-default"
								disabled="disabled" onclick="sapoOcx.api.free();">置闲</button>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
								<input type="text" class="form-control input-sm" id="txtDial">
								<button type="button" id="btnDial" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.dial(document.getElementById('txtDial').value);">外呼</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
								<input type="text" class="form-control input-sm" id="txtThreeWay">
								<button type="button" id=btnThreeWay class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.threeWay(document.getElementById('txtThreeWay').value);">三方</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
								<input type="text" class="form-control input-sm" id="txtTransfer">
								<button type="button" id="btnTransfer" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.transfer(document.getElementById('txtTransfer').value);">转接分机</button>
								<button type="button" id="btnTransferQueue" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.transferQueue(document.getElementById('txtTransfer').value);">转接组</button>
								<button type="button" id="btnTransferIvr" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.transferIvr(document.getElementById('txtTransfer').value);">转接IVR</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
								<input type="text" class="form-control input-sm" id="txtGroupPickUp">
								<button type="button" id="btnGroupPickUp" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.groupPickUp(document.getElementById('txtGroupPickUp').value);">组抢接</button>
								<button type="button" id="btnExtenPickUp" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.extenPickUp(document.getElementById('txtGroupPickUp').value);">分机抢接</button>
								<button type="button" id="btnPickUp" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.pickUp();">盲抢接</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
								<input type="text" class="form-control input-sm" id="txtSpy">
								<button type="button" id="btnSpy" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.spy(document.getElementById('txtSpy').value);">监听分机</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
								<input type="text" class="form-control input-sm" id="txtGroupSpy">
								<button type="button" id="btnGroupSpy" class="btn btn-default"
								disabled="disabled"
								onclick="sapoOcx.api.groupSpy(document.getElementById('txtSpy').txtGroupSpy);">组监听</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
							<button type="button" id="btnGetExtension" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getExtension());">获取分机</button>
							<button type="button" id="btnGetAgentStaffid" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getAgentStaffid());">获取工号</button>
							<button type="button" id="btnGetAgentName" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getAgentName());">获取姓名</button>
							<button type="button" id="btnGetSkill" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getSkill());">获取技能值</button>
							</div>
						</form>
			</div>
		</div>
		<div class="row clearfix">
			<div class="col-md-12 column">
						<form class="navbar-form" role="search">
							<div class="form-group">
							<button type="button" id="btnGetNumber" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getNumber());">获取通话号码</button>
							<button type="button" id="btnGetBusyState" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getBusyState());">获取置忙原因</button>
							<button type="button" id="btnGetAgentState" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getAgentState());">登录状态</button>
							<button type="button" id="btnGetCallState" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getCallState());">获取通话状态</button>
							<button type="button" id="btnGetRegState" class="btn btn-default"
								disabled="disabled"
								onclick="alert(sapoOcx.api.getRegState());">获取话机状态</button>
							</div>
						</form>
			</div>
		</div>
	</div>

</body>
</html>
