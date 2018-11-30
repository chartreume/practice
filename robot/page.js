// jQuery required
const userPhoto = "logo.png";
const chatbox = "#js-chatbox";
const markTimeInterval = 1000 * 60 * 15;
let page = {
    _$userPhoto : userPhoto,
    _$context : chatbox,
    onmessage : function( type,message ){
        let domStr = this._$createChatItem( type,message );
        let timeMarker;
        if( domStr ){
            timeMarker = this._$createTimeMarker( message && message["mark"] );
            if( timeMarker ){
                jQuery( this._$context ).append( timeMarker );
            }
            jQuery( this._$context ).append( domStr );
            this._$scrollToBottom();
        }
    },
    _$scrollToBottom : function(){
        let context = jQuery( this._$context )
        scrollTop = context.outerHeight() - context.parent().outerHeight()
        ;
        if(scrollTop > 0){
            context.parent().scrollTop( scrollTop );
        }
    },
    _$createChatItem : function( type, message ){
        if( type === "client" ){
            return this._$createClientChatItem(message);
        }else if( type === "server" ){
            return this._$createServerChatItem(message);
        }else if( type === "socketError" ){

        }
    },
    _$createServerChatItem : function(message){
        console.log(message);
        let { data = {},error,mark ,command,ignore} = message;

        let { msg,buttons,state,type,textbox,html,username } = data ;
        let result;
        if( ignore ){
            if( command === "login" ){
                result = `<div class="response-block" data-mark="${mark}"><img src="logo.png"><i></i><div class="content">请输入九猎网用户名密码：</div></div>`;
                this._$showLoginBox();
                this._$hideInputBox();
                this._$hideButtonsBox();
            }
        }else if( /^[023]$/.test( state ) ){
            switch( state - 0){
                case 0:
                    result = `<div class="response-block" data-mark="${mark}"><img src="logo.png"><i></i><div class="content"><p>用户名或密码错误[表情]<br>还没在九猎网注册过？可以用电脑访问www.9lie.com注册。</p><div class="btn-block"><b data-command="login" data-ignore="true" data-msg="绑定九猎网账号">再试一次</b></div></div></div>`;
                    buttons = ["再试一次"];
                    this._$showButtons(buttons,"login");
                    break;
                case 2:
                    result = `<div class="response-block" data-mark="${mark}"><img src="logo.png"><i></i><div class="content">这个帐号已经被冻结[表情]抱歉不能和你聊啦～</div></div>`;
                    buttons = [];
                    break;
                case 3:
                    result =`<div class="response-block" data-mark="${mark}"><img src="logo.png"><i></i><div class="content"><p>初次见面，认识一下吧～<br>我是九猎网机器人九儿，请问您是？</p><div class="btn-block"><b data-command="login" data-ignore="true" data-msg="绑定九猎网账号">绑定九猎网账号</b></div></div></div>`;
                    buttons = ["绑定九猎网账号"];
                    break;
            }
            this._$hideInputBox();
            this._$showButtonsBox();
            this._$showButtons(buttons,"login");
        } else if( msg || html ) {
            if( !msg ){
                msg = html || "";
                html = "";
            }
            if(!html){
                html = ""
            }
            result = `<div class="response-block" data-mark="${mark}"><img src="logo.png"><i></i><div class="content">${msg}</div></div>${html}`;
            if( command === "login" ){
                this._$hideInputBox();
                this._$hideButtonsBox();
                this._$showLoginBox();
            }else{
                this._$showInputBox();
                this._$showButtonsBox();
            }
            this._$showButtons(buttons);
        }
        if( !ignore ){
            this[ Symbol.for("type") ] = type;
        }
        return result;
    },
    _$showButtonsBox: function(){
        console.log(1);
        if( this[Symbol.for("showButtonsBox")] ){
            return;
        }
        this[Symbol.for("showButtonsBox")] = !0;
        jQuery("#js-foot-btn-box").removeClass('hide');
    },
    _$hideButtonsBox: function(){
        console.log(2);
        if( !this[Symbol.for("showButtonsBox")] ){
            return;
        }
        this[Symbol.for("showButtonsBox")] = !1;
        jQuery("#js-foot-btn-box").addClass('hide');
    },
    _$showLoginBox : function(){
        console.log(3);
        if( this[Symbol.for("showLoginBox")] ){
            return;
        }
        this[Symbol.for("showLoginBox")] = !0;
        jQuery("#js-login-toolbar,#js-cover").removeClass('hide');
    },
    _$hideLoginBox : function(){
        console.log(4);
        if( !this[Symbol.for("showLoginBox")] ){
            return;
        }
        this[Symbol.for("showLoginBox")] = !1;
        jQuery("#js-login-toolbar,#js-cover").addClass('hide');
    },
    _$hideInputBox: function(){
        console.log(5);
        if( !this[Symbol.for("showInputBox")] ){
            return;
        }
        this[Symbol.for("showInputBox")] = !1;
        jQuery("#js-common-toolbar").addClass('hide');
    },
    _$showInputBox: function(){
        console.log(6);
        if( this[Symbol.for("showInputBox")] ){
            return;
        }
        this[Symbol.for("showInputBox")] = !0;
        jQuery("#js-common-toolbar").removeClass('hide');
    },
    _$showButtons : function(buttons,type){
        let btns =  buttons ?  buttons.map( function(item){
            if(type === "login"){
                return `<b data-msg="${item}" data-command="login" data-ignore="true">${item}</b>`;
            }else{
                return `<b data-msg="${item}">${item}</b>`;
            }
        }) : []
        ,  btnbox = jQuery("#js-foot-btn-box").empty()
        ;
        if( btns.length ){
            btnbox.append("<div class='content'>" + btns.join("") + "</div>");
        }
    },
    _$createClientChatItem : function( message ){
        console.log(message);
        let { type,mark,msg,username } = message;
        let userPhoto = this._$userPhoto;

        if( username ){
            return `<div class="request-block" data-mark="${mark}"><img src="${userPhoto}"><i></i><div class="content">${username} ******</div></div>`
        }else if( msg ){
            return `<div class="request-block" data-mark="${mark}"><img src="${userPhoto}"><i></i><div class="content">${msg}</div></div>`
        } else {
            return ;
        }
    },
    _$createTimeMarker : function( currentStamp, referStamp){
        if( !currentStamp || ( referStamp && Math.abs(currentStamp - referStamp) < markTimeInterval ) ){
            return;
        }
        if( !referStamp ){
            let prevMarker = this[Symbol.for("prevMarker")];
            this[Symbol.for("prevMarker")] = currentStamp;
            if( prevMarker && Math.abs(currentStamp - prevMarker) < markTimeInterval ){
                return;
            }
        }
        let mark = new Date(currentStamp)
        ,   datenow = new Date
        ,   markArray = [mark.getFullYear(),mark.getMonth() - 0 + 1, mark.getDate()]
        ,   nowArray = [datenow.getFullYear(),datenow.getMonth() - 0 + 1, datenow.getDate()]
        ,   markStr = ""
        ,   hour = mark.getHours()
        ,   minute = mark.getMinutes()
        ;
        markArray.forEach( ( item,key ) => {
            if(markStr.length || item !== nowArray[key]){
                markStr += item + ( key === 0 ? "年" : ( key === 1 ? "月" : "日" ) )
            }
        });
        markStr += (markStr ? " ":"") + ( hour >= 12 ? "下午 " : "上午 " ) + ( hour > 12 ? hour - 12 : hour ) + ":" + ( minute > 9 ? minute : "0" + minute);
        return `<div class="time-mark">${markStr}</div>`
    },
    set message( msg ){
        if( typeof msg === "string" ){
            msg = {msg : msg};
        }
        if( !msg["type"] && this[Symbol.for("type")] ){
            msg["type"] = this[Symbol.for("type")];
        }
        management.receivePageMessage = msg;
    }
}
management.onmessage = function(){
    page.onmessage.apply(page,arguments);
}
jQuery(function(){
    let $ = jQuery;
    $("#js-chatbox,#js-foot-btn-box").on("click","b",function(e){
        console.log(Object.assign({}, this["dataset"]));
        page.message = Object.assign({}, this["dataset"])
    });
    $("#js-login-toolbar").on("click",function(){

    });
})
