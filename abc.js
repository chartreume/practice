$(".page img").filter(function (){
   var style = $(this).attr("style")
   ,   bool = false
   ;
   if(!style){
       return bool;
   }
   var c = 1;
   style.split(";").forEach(function(item){

       array = item.split(":");
       if( /^100\%$/.test($.trim(array[1])) ){
           if(/^width$/i.test($.trim(array[0]))){
               c = c << 1;
           }
           if(/^min\-height$/i.test($.trim(array[0]))){
               c = c << 1;
           }
       }


   });
   if(c === 4){
       bool = true;
   }
   return bool;
});
