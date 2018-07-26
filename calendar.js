+"user strict";
/*"weekStart" : "0",

*/
/*

*/
function Calendar(config){
    /*
    config : {
        clicknode : "str",
        valuenode : "str",
        wrapernode : "str",
        limitMax : "yyyy-MM||yyyy-MM-dd",
        limitMin : "yyyy-MM||yyyy-MM-dd",
        format : "yyyy-MM-dd",
        renderCallback : func,
        cancelCallback : func,
        callback : func,
        switchCallback : func,
    }
    */
    this.init(config);
};
Calendar.prototype.renderHeader = function(){
    var context = document.createElement("div")
    ,   week =  ["日","一","二","三","四","五","六"]
    ,   now = this.now
    ;
    context.innerHTML = "<span>" +now.year + "</span><strong>" + (now.month - 0 + 1) + "月" + now.date +"日&nbsp;周" + week[now.day] + "<strong>";
    context.className = "calendar-header";
    return context;
}
Calendar.prototype.render = function(){
    var calendar = document.createElement("div")
    ,   box = document.createElement("div")
    ,   footer = document.createElement("div")
    ;
    footer.className = "calendar-footer";
    footer.innerHTML = "<a href='javascript:;' class='cancel'>取消</a><a href='javascript:;' class='submit'>确定</a>";

    box.appendChild(this.renderHeader());
    box.appendChild(this.renderCalendarTable());
    box.appendChild(footer);
    box.className = "calendar-box";
    calendar.appendChild(box);
    calendar.className = "calendar-context";
    this.context = calendar;
    this.box = box;
    return calendar;
}
Calendar.prototype.renderCalendarTable = function(){
    console.log(this.select);
    if(!this.current){
        this.current = {year : this.select["year"] || this.now.year,month : this.select.month !== undefined ? this.select.month : this.now.month, date: this.select.date || this.now.date};
    }
    var current = new Date
    ,   day
    ,   maxDate
    ,   legend
    ,   week =  ["日","一","二","三","四","五","六"]
    ,   table
    ,   tableHead = "<tr>"
    ,   tableBody = ""
    ,   date = 0
    ,   limitMax = this.limitMax
    ,   limitMin = this.limitMin
    ,   blnMax = limitMax && limitMax.year && (limitMax.year < this.current.year || (limitMax.year === this.current.year && limitMax.month <= this.current.month))
    ,   blnMin = limitMin && limitMin.year && (limitMin.year === this.current.year && limitMin.month >= this.current.month || limitMin.year > this.current.year)
    ;

    current.setFullYear(this.current.year);
    current.setMonth(this.current.month);
    current.setDate(1);
    day = current.getDay();
    legend = document.createElement("div");

    legend.className = "legend";
    legend.innerHTML = "<a href='javascript:;' class='prev js-prev" + (blnMin ? " disabled" : "") + "'>&lt;</a><span class='current'>" + this.current.year + "年" + (this.current.month - 0 + 1) + "月</span>"  + "<a href='javascript:;' class='next js-next" + (blnMax ? " disabled" : "") + "'>&gt;</a>";

    if( /^(0|2|4|6|7|9|11)$/.test(this.current.month) ){
        maxDate = 31;
    }else if( /^(3|5|8|10)$/.test(this.current.month) ){
        maxDate = 30;
    }else{
        if(this.current.year % 400 === 0 || (this.current.year %100 !== 0  && this.current.year %4 === 0) ){
            maxDate = 29;
        }else{
            maxDate = 28;
        }
    }
    for(var i = 0 , len = week.length ; i < len ; i++){
        tableHead += "<th>" + week[i] + "</th>";
    }
    tableHead += "</tr>";
    while(date < maxDate){
        tableBody += "<tr>";
        for(i = 0 ; i < 7; i++){
            if(!date && i !== day || date > maxDate){
                tableBody += "<td></td>";
            }else{
                tableBody += "<td>" + (date < maxDate ? "<a href='javascript:;' class='date-item " + (this.current.year === this.select.year && this.current.month === this.select.month && this.select.date - date === 1 ? "select " : "") + ( ((blnMax && date > limitMax.date)||(blnMin && date < limitMin.date))? "disabled" :"" ) + "'>" + (++date) + "</a>" : "" ) + "</td>"
            }
        }
        tableBody += "</tr>";
    }


    var box = document.createElement("div");
    box.className = "calendar-body";
    box.appendChild(legend);
    var table = document.createElement("table");
    table.innerHTML = "<thead>" + tableHead + "</thead>" + "<tbody>" + tableBody + "</tbody>";
    box.appendChild(table);
    return box;
}
Calendar.prototype.init = function(config){
    var now = new Date()
    ,   formatSplitChar
    ,   formatArray
    ,   limit
    ,   _this = this
    ;
    this.now = {year : now.getFullYear(), month : now.getMonth(),date : now.getDate(),day : now.getDay()};
    this.clicknode = config.clicknode;
    this.valuenode = config.valuenode;
    this.wrapernode = config.wrapernode;
    this.renderCallback = config.renderCallback;
    this.cancelCallback = config.cancelCallback;
    this.callback = config.callback;
    this.switchCallback = config.switchCallback;
    this.formatStr = config.format || "yyyy-MM-dd";

    if(config.limitMax || config.limitMin){
        formatSplitChar = config.format.replace(/[a-zA-Z]+/g,"").charAt(0);
        formatArray = config.format.split(formatSplitChar);
        if(config.limitMax){
            limit = config.limitMax.split(formatSplitChar);
            this.limitMax = {};
            for(var i = 0 ,len = formatArray.length ; i < len ; i++ ){
                if( /y+/.test(formatArray[i]) ){
                    this.limitMax.year = limit[i] - 0;
                }
                if( /M+/.test(formatArray[i]) ){
                    this.limitMax.month = limit[i] - 1;
                }
                if( /\d+/.test(formatArray[i]) ){
                    this.limitMax.month = (limit[i] || 32) - 0;
                }
            }
        }
        if(config.limitMin){
            limit = config.limitMin.split(formatSplitChar);
            this.limitMin = {};
            for(var i = 0 ,len = formatArray.length ; i < len ; i++ ){
                if( /y+/.test(formatArray[i]) ){
                    this.limitMin.year = limit[i] - 0;
                }
                if( /M+/.test(formatArray[i]) ){
                    this.limitMin.month = limit[i] - 1;
                }
                if( /d+/.test(formatArray[i]) ){
                    this.limitMin.month = (limit[i] || 0) - 0;
                }
            }
        }
    }

    document.querySelector(this.clicknode).addEventListener("click",function(){

        var formatSplitChar = _this.formatStr.replace(/[a-zA-Z]+/g,"").charAt(0);
        var formatArray = _this.formatStr.split(formatSplitChar);
        var value =document.querySelector(_this.valuenode).value;
        _this.select = {};
        this.blur();
        if(value){
            limit = value.split(formatSplitChar);

            for(var i = 0 ,len = formatArray.length ; i < len ; i++ ){
                if( /y+/.test(formatArray[i]) ){
                    _this.select.year = limit[i] - 0;
                }
                if( /M+/.test(formatArray[i]) ){
                    _this.select.month = limit[i] - 1;
                }
                if( /d+/.test(formatArray[i]) ){
                    _this.select.date = (limit[i] || 32) - 0;
                }
            }
        }

        _this.show();
    },!1);
}
Calendar.prototype.show = function(){
    var wrap;
    if(this.wrapernode){
        wrap = document.querySelector(this.wrapernode)
    }else{
        wrap = document.body;
    }
    wrap.style.height = "100%";
    wrap.style.overflow = "hidden";
    wrap.appendChild(this.render());
    this.bindEvent();
    if(this.renderCallback){
        this.renderCallback.call(this);
    }
};
Calendar.prototype.hide = function(){
    this.context.parentNode.removeChild(this.context);
    if(this.callback){
        this.callback.call(this);
    }
}
Calendar.prototype.switch = function(type){
    if(type === "prevMonth"){
        if(this.limitMin && this.limitMin.year && (this.limitMin.year === this.current.year && this.limitMin.month >= this.current.month || this.limitMin.year > this.current.year)){
            return;
        }else{
            this.current.month--;

            if(this.current.month < 0){
                this.current.month += 12;
                this.current.year --;
            }
        }
    }
    if(type === "nextMonth"){
        if(this.limitMax && this.limitMax.year && (this.limitMax.year < this.current.year || (this.limitMax.year === this.current.year && this.limitMax.month <= this.current.month))){
            return;
        }
        this.current.month++;
        
        if(this.current.month >= 12){
            this.current.month -= 12;
            this.current.year++;
        }
    }
    this.box.replaceChild(this.renderCalendarTable(),this.box.querySelector(".calendar-body"));
    if(this.switchCallback){
        this.switchCallback.call(this);
    }
}
Calendar.prototype._cancel = function(){
    this.hide();
    if(this.cancelCallback){
        this.cancelCallback.call(this);
    }
}
Calendar.prototype._submit = function(){
    if(!this.select || !this.select.year || this.select.month === undefined || this.select.month < 0 || !this.select.date ){
        return;
    }
    this.hide();
    var formatStr = this.formatStr
    ,   select =
    formatStr.replace("yyyy",this.select.year)
             .replace( "MM",(this.select.month - -1 >=10 ? this.select.month - -1 : "0" + (this.select.month - -1) ) )
             .replace("M",this.select.month)
             .replace("dd",this.select.date - 0 >= 10 ? this.select.date : "0" + this.select.date)
             .replace("d",this.select.date)
    ;
    document.querySelector(this.valuenode).value = select;
    document.querySelector(this.valuenode).dispatchEvent(new Event("input",{bubbles: true,cancelable: true}))
}
Calendar.prototype.bindEvent = function(){
    var _this = this;
    this.context.addEventListener("click",function(){
        _this.hide();
    },!1);
    this.box.addEventListener("click",function(event){
        var tag = event.srcElement ||event.target
        ,   classname
        ;
        event.stopPropagation();
        if(tag.nodeType === 3){
            tag = tag.parentNode;
        }
        classname = tag.className;
        if(tag.tagName !== "A" || /disabled|select/.test(classname) ){
            return;
        }
        if(/js\-prev/.test(classname)){
            return _this.switch("prevMonth");
        }
        if(/js\-next/.test(classname)){
            return _this.switch("nextMonth");
        }
        if(/date\-item/.test(classname)){
            _this.select.date = tag.textContent.trim() - 0;
            _this.select.year = _this.current.year;
            _this.select.month = _this.current.month;
            return _this.switch("date");
        }
        if(/cancel/.test(classname)){
            return _this._cancel();
        }
        if(/submit/.test(classname)){
            return _this._submit();
        }

    });
}
