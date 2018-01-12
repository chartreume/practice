/*
http://www.devquanzhi.cn/html/jquery-mask.html
关于各种弹出层的方法引用，参见此页面。
*/
(function($) {
	//弹层处理
	$.extend({
		//弹层样式，依赖base.js > $.addStyle方法加载到页面
		cssText_alert : ".jquery-alert { position:absolute; background:#fff; color:#333; padding-bottom:50px; border:1px solid #425817; box-shadow:2px 2px 0 rgba(150,150,150,0.4); text-align:center; font-size:12px; overflow:hidden; }.jquery-alert-t { display:block; margin:0; padding:8px 0; text-indent:10px; text-align:left; font-size:14px; font-weight:bolder; background:#EEF4E5 url('http://img1.quanzhi.cn/images/v1/poupbtbg.png') repeat-x; }.jquery-alert-cont { margin:0; padding:15px; text-align:left; line-height:25px; min-width:300px; width:auto!important; _width:300px; zoom:1; font-family:SimSun,Arial,sans-serif; }.jquery-alert-t .icon { position:absolute; top:11px; right:10px; cursor:pointer; }.jquery-alert-btn { position:absolute; bottom:0; right:0; width:100%; text-align:right; border-top:1px solid #ddd; padding:10px 0; }.jquery-alert-btn span { margin-right:10px; }",
		/*
		*	# 创建遮罩容器 #
		*	@param	config[Object > Json][可选]
		*		zIndex[Number]	设置Z轴
		*		opacity[Number]	设置透明度
		*	@return [Object > Dom] 返回一个满屏高宽的半透明遮罩容器DOM对象
		*/
		createBackgroundDom : function(config){
			//设置遮罩容器全局zIndex级别：与selectBar.js、selecty.js共用的全局变量设置，用于弹出层的Z轴优先级控制
			var zIndex = 999999,
				opacity = (config && config.opacity) || 0.5;
			var obj = $("<div>").css({
					"position": "absolute",
					"top": "0",
					"left": "0",
					"width": "100%",
					"height": $(document).outerHeight(true),
					"background": "#000",
					"display": "none",
					"z-index": zIndex,
					"opacity": opacity
				}).addClass("jquery-mask-bg js-hold");
			//用于遮盖<select>、<object>、<iframe>等系统顶级控件
			//if($.browser.msie)//原本仅针对IE添加遮罩，用于完全遮盖，后来发现chrome某些版本也需要此设置
				/*obj.html("<iframe src='about:blank' frameborder='0' scrolling='no' width='100%' height='9999' style='opacity:0;filter:alpha(opacity=0);'></iframe>");*/
			return obj;
		},
		/*
		*	# 返回对象在页面中的绝对居中坐标：x、y轴 #
		*	@param	config[Object > Json]
				obj[Object > Dom]	被计算的对象
				type[String][可选]	计算方式
				targetObj[Object > Dom][可选]	当type == "follow"时，obj坐标值结果为：跟随targetObj边界
		*	@return	{x,y}[Object > Json]
		*/
		getXY : function(config){
			var x,y;
			//获取窗口高宽、滚动条偏移量
			var winObj = $(window),
				win = {
					T : winObj.scrollTop(),
					L : winObj.scrollLeft(),
					H : winObj.height(),
					W : winObj.width()
				};
			//获取内容对象绝对高宽
			var obj = $(config.obj),
				objH = obj.outerHeight(true),
				objW = obj.outerWidth(true);
			//相对config.targetObj对象跟随定位坐标计算
			if(config.type == "follow"){
				//获取正文内容宽度、偏移量
				var content = $("body").children("div").eq(0),
					cont = {
						W : content.outerWidth(),
						L : content.offset().left
					};
				//获取事件触发来源对象高宽、偏移量
				var btnObj = $(config.targetObj),
					btn = {
						H : btnObj.outerHeight(true),
						W : btnObj.outerWidth(true),
						L : btnObj.offset().left,
						T : btnObj.offset().top
					},
					space = config.space || 0;
				x = btn.L;
				y = btn.T;
				//垂直坐标计算（判断是否超出顶部边界）
				if((btn.T + btn.H + objH - win.T) > win.H)
					y = btn.T - objH - space;
				else y = btn.T + btn.H + space;
				if(y < 0)
					y = btn.T + btn.H + space;
				//水平坐标计算（判断是否超出右侧边界）
				if((btn.L + btn.W + objW) > (cont.W + cont.L))
					x = btn.L + btn.W - objW;
				else x = btn.L;
			}
			//绝对居中坐标计算
			else{
				//水平坐标计算
				x = win.L + win.W/2 - objW/2;
				//垂直坐标计算（判断是否超出顶部边界）
				if(objH > win.H)
					y = win.T;
				else
					y = win.T + win.H/2 - objH/2;
			}
			//返回坐标值
			return {
				x : x,
				y : y
			}
		},
		/*
		*	# $.alert | $.confirm | $.follow 方法的弹层关闭执行 #
		*	@param	obj[Object > Dom]	被关闭的弹层对象
		*	@param	callback[Function][可选]	关闭窗口的回调方法回调
		*/
		_close : function(obj,callback){
			obj.fadeOut("fast",function(){
				if(!$(this).is(".jquery-mask-bg")){
					var html = $(this).data("html"),
						callbackFn = $(this).data("callback");
					if(typeof html == "object"){
						$(html).hide().appendTo("body");
					}
					if(callbackFn || callback){
						if($.isFunction(callback))
							callbackFn = callback;
						callbackFn();
					}
				}
				$(this).remove();
			});
		},
		mask : {
			config : {
				className : {
					bgObj : "jquery-show-bg",
					contObj : "jquery-show-cont"
				}
			},
			/*
			*	$.mask.close(index,callback)
			*	# 关闭弹层 #
			*	@param	name[Number|Function][可选]	指定要关闭的弹层索引，类型为function时，转为callback处理
			*	@param	callback[Function][可选]	回调函数
			*/
			close : function(index,callback){
				var this_ = this,
					allObj = $("." + this.config.className.bgObj).add("." + this.config.className.contObj);
				if(typeof index == "number"){
					allObj = $("." + this.config.className.bgObj).eq(index).add($("." + this.config.className.contObj).eq(index));
				}
				else if($.isFunction(index)){
					callback = index;
				}
				$._close(allObj,callback);
			},
			/*
			*	$.mask.show(html,callback)
			*	# 显示弹层 #
			*	@param	html[Object > Dom|String]	指定要弹出的内容
			*	@param	callback[Function][可选]	回调函数
			*/
			show : function(html,callback){
				//创建遮罩容器
				var bgObj = $.createBackgroundDom().addClass(this.config.className.bgObj);
				if(!html){
					bgObj.appendTo("body").fadeIn("fast");
					return;
				}
				//创建内容容器
				var contObj = $("<div>").attr("id","jquery-extend-mask-inner").css({"position":"absolute","background":"#fff"}).addClass(this.config.className.contObj).hide().append(html);
				//将html缓存到contObj对象中
				if(html)
					contObj.data("html",html);
				//将callback缓存到contObj对象中
				if(callback && $.isFunction(callback))
					contObj.data("callback",callback);
				//集合弹窗容器
				var popObj = bgObj.add(contObj);
				//将弹窗容器插入到body
				popObj.appendTo("body");
				//若HTML为Dom对象则使其显示
				if(typeof html == "object")
					$(html).show();
				//计算弹窗容器坐标以及遮罩层zIndex级别
				var offset = $.getXY({
						obj:contObj
					}),
					top = offset.y,
					left = offset.x,
					zIndex = bgObj.css("z-index") - 0 + 1;
				//设置内容容器在页面中的位置
				contObj.css({
					"top" : top,
					"left" : left,
					"z-index" : zIndex
				});
				//显示遮罩与内容容器
				popObj.fadeIn("fast");
				return contObj;
			}
		}		
	});
})(jQuery);