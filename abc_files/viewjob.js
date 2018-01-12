$(function(){
	var h=0;
    $("body").swipe( 
         { 
             swipe:function(event, direction, distance, duration, fingerCount) { 
            	 if($('#js-viewjob').length>0)
            	 {            		 
            		 var t = $(window).scrollTop();
                     if(direction == "up"){                    
                    	 h+=150;
                    	 $('#js-viewjob').animate({'scrollTop':t+h},100);
                    	
                     }else if(direction == "down") 
                     { 
                    	 $('#js-viewjob').animate({'scrollTop':t-h},100);
                    	 h=0;
                     } 
            	 }
            	 
             } 
         } 
    ); 
});