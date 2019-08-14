function json2pre( jsonstr ){
    let space = "    "
    ,    enter = "\n"
    ;
    function __is( tag ){
        return /(boolean|string|number|undefined)/.test( typeof tag ) ? "base" : ( tag === null ? "null" : ( Object.prototype.toString.call( tag ) === "[object Array]" ? "array" : (Object.prototype.toString.call( tag ) === "[object Object]" ? "object" : undefined ) ) )
    }
    function __fact( item , spx ){
        let str;

        switch( __is( item ) ){
            case "base" :
                str = `${item}`;
                break;
            case "null" :
                str = `null`;
                break;
            case "object" :
                str = __object2string( item , spx );
                break;
            case "array" :
                str = __array2string( item , spx );
                break;
        }
        return str ||'';
    }
    function __object2string( obj , sp ){
        let str = ''
        ,    array = Object.keys( obj )
        ,    len = array.length
        ,    spx
        ;
        if( !sp ) sp = '';
        spx = sp + space;

        array.forEach( ( item , index ) => {
            str += `${spx}${item} : ` + __fact( obj[ item ] , spx );
            if( index < len - 1 ){
                str += `,${enter}`
            }else{
                str += `${enter}`
            }
        });
        return `{${enter}${str}${sp}}`
    }
    function __array2string( array , sp ){
        let str = ''
        ,    len = array.length
        ,    spx
        ;
        if( !sp ) sp = '';
        spx = sp + space;
        array.forEach( ( item , index ) => {
            str += `${spx}` + __fact( item );
            if( index < len - 1 ){
                str += `,${enter}`
            }else{
                str += `${enter}`
            }
        })
        return `[${enter}${str}${sp}]`
    }
    if( typeof jsonstr === "string" ){
        jsonstr = JSON.parse( jsonstr );
    }
    return __fact( jsonstr , '' )
}
