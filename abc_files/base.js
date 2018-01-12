
 	function showArrow(ld,next,pre){  //{ld :bln,next : bln ,pre :bln}

      var left  = $("#arrorLeft"),
          top = $("#arrorTop"),
          bottom = $("#arrorBottom"), 
          right = $("#arrorRight");
      if(ld){
        top.hide();
        bottom.hide();
        if(next){
          right.show()
        }else{
          right.hide()
        }
        if(pre){
          left.show();
        }else{
          left.hide();
        }
      }
      if(!ld){
        left.hide();
        right.hide();
        if(next){
          bottom.show()
        }else{
          bottom.hide()
        }
        if(pre){
          top.show();
        }else{
          top.hide();
        }
      }
    };

    $(document).on("arrowChange",function(){
      var w = $(window).width(), h = $(window).height();
      var ld = w/h > 1 ? true : false;
      next = !! $(".page.show").next(".page").length;
      pre = !! $(".page.show").prev(".page").length;
      showArrow(ld,next,pre);
    });
    (function(){
      var list = Array.prototype.slice.call($(".page"));
      var ld = false,px,py,start = false,distancex,distancey,node,pre,next,height,width;
      var drag = function(event){
       //$(".page:animated").stop(true,true);
         
        event.stopPropagation();
        //event.preventDefault();
        // if(window.openPage){
        //   return false;
        // }

        var type = event.type,
        time = 300,
        
        x,
        y;
        
        for(var i = 0, len = list.length ; i < len ; i ++){
            if(/show/.test(list[i].className)){
              node = list[i];
              pre =  i > 0 ? list[i-1] :null;
              next = i < len - 1 ? list[i + 1] :null;
            }
        }
        if($('#js-viewjob').length>0) // 职位预览弹层，阻止滑动翻页
        {
        	 return;
        }
        if(type === "touchstart" || type === "mousedown"){
          start = true;
          px = event.pageX || document.documentElement.scrollLeft + event.clientX || window.event.touches[0].pageX;
          py = event.pageY || document.documentElement.scrollTop + event.clientY || window.event.touches[0].pageY;
        }
        if(type === "touchmove" || type === "mousemove"){
          event.preventDefault();
          if(type === "mousemove" && !start){
            return;
          }
          x = event.pageX || document.documentElement.scrollLeft + event.clientX || window.event.touches[0].pageX;
          y = event.pageY || document.documentElement.scrollTop + event.clientY || window.event.touches[0].pageY;
          if(px === undefined){
            px = x;
            py = y;
          }
          
          distancey = parseInt(y) - parseInt(py);
          distancex = parseInt(x) - parseInt(px);
          height = $(window).height();
          width = $(window).width();
          
          
          
          if(!ld && distancey < -10){
            
            if(next){
              $(next).css("top",height + "px").show().css("margin-top", distancey +"px");
              //$(node).css("margin-top", distancey + "px");
              
            }else{
            }
          }
          if(ld && distancex <  -10){
            
            if(next){
              $(next).css("left",width + "px").show().css("margin-left", distancex +"px");
              //$(node).css("margin-left", distancex + "px");
            }else{

            }
          }

          if(!ld && distancey > 10){
            

            if(pre){
              $(pre).css({"top": - height + "px","z-index":"3000","margin-top":distancey + "px"}).show();
              $(node).removeAttr("style");
            }else{

            }
          }
          if(ld && distancex > 10){
            
            if(pre){
              $(pre).css({"left" : - width + "px","z-index":3000,"margin-left":distancex + "px"}).show();
              $(node).removeAttr("style");
            }
          }
        }
        
        if(type === "touchend" || type === "mouseup"){
          if((type === "mouseup" && !start) || !distancey || !distancex ){
            $(".page.show").css("margin",0);
            $(".page:not(.show)").hide().removeAttr("style");
            return;
          }
          
          if(!ld && distancey < -20){
            
            if(next){
              $(node).css("display","block").removeClass("show");//.animate({"margin-top": - height + "px"},time)
              $(next).css({"top":height + "px","z-index":3000}).addClass("show").animate({"margin-top": - height + "px"},time,function(){
                $(".page").removeAttr("style");
                $(document).triggerHandler("arrowChange");
              })
            }else{

            }
          }else if(ld && distancex <  -20){
            
            if(next){
              $(node).css("display","block").removeClass("show");//.animate({"margin-left": - width + "px"},time);
              $(next).addClass("show").css({"left":  width + "px","z-index":3000}).animate({"margin-left": - width + "px"},time,function(){
                $(".page").removeAttr("style");
                $(document).triggerHandler("arrowChange");
              })
            }else{

            }
          }else if(!ld && distancey > 20){
            if(pre){
              $(node).css("display","block").removeClass("show");
              $(pre).addClass("show").css("z-index",3000).animate({"margin-top":height + "px"},time,function(){
                $(document).triggerHandler("arrowChange");
                $(".page").removeAttr("style");
              })
            }else{

            }
          }else if(ld && distancex > 20){
            
            if(pre){
              $(node).css("display","block").removeClass("show");
              $(pre).addClass("show").css("z-index",3000).animate({"margin-left":width + "px"},time,function(){
                $(document).triggerHandler("arrowChange");
                $(".page").removeAttr("style");
              })
            }
          }else{
            $(".page.show").css("margin",0);
            $(".page:not(.show)").hide().removeAttr("style");
            $(document).triggerHandler("arrowChange");
          }
          start =distancex = distancey = undefined;
          //node = pre = next = null;
        }
      }
      $(document).on("imgready",function(){
        
        $(document).on("touchstart touchmove touchend click mousedown mousemove mouseup",drag);
      });
      $(window).on("orientationchange resize load",function(event){
        $(document).triggerHandler("arrowChange");
        var w = $(window).width(), h = $(window).height();
        ld = w/h > 1 ? true : false;
        if(ld){
          $("body").removeClass("v1");
        }else{
          $("body").addClass("v1");
        }
      })
    }());
$(function(){

  $("#cover").hide();
  $("#first").addClass("show");

  $(document).triggerHandler("arrowChange");
  $(document).triggerHandler("imgready");
  
  //设置背景图片位置
  $(".js-page-bg").each(function(i){
    var oImg = $(this).find("img");
    if(!oImg.length)return;
    var img = new Image();
    img.src = oImg.attr("src");
    img.onload = function(){
      var oActive = $(".page:not(.show)");
      oImg.parents(".page").addClass("show");
      var iS = oImg.width()/oImg.height();
      if(oImg.height()+oImg.position().top<$(window).height()){
        oImg.css({"height":"100%","top":0,"width":"auto"});
        var iL = oImg.position().left - (iS*$(window).height() - $(window).width())/2;
        oImg.css({"left":iL+"px"});
      }
      oActive.removeClass("show");
    }
  });

  //视频弹层
  $(".js-video").click(function(){
    $(".js-video-layer").html('<a class="close" href="javascript:;" onclick="$.mask.close();"></a>'+$(this).attr("vUrl"));
    $(".js-video-layer").find("iframe").attr({"width":"100%"}).css({"min-height":"45%", "max-height":"100%"}).removeAttr("height");
    $.mask.show($(".js-video-layer"));
  });
});