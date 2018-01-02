const fs = require("fs");
function readfile(filename,callback){
    fs.readFile(filename,function(error,data){
        if(error){
            console.log("ReadFile Error");
            console.log(error);
            return;
        }
        callback( new Uint8Array(data) );
    });
};
function writefile(filename,str,callback){
    fs.writeFile(filename,str,function(error){
        if(error){
            if(callback){
                return callback(error,str);
            }
            console.log(error);
            console.log("Write file failed.\n");
        }
    });
};
function coventBuffer(inputFlieName,outputFileName){
    if(!inputFlieName){
        throw new  Error("NULL filename passed to bufferToBase64.");
        return;
    };
    if(!outputFileName){
        outputFileName = inputFlieName.slice(0, inputFlieName.lastIndexOf("\.")) + ".btoa.txt";
    }
    readfile(inputFlieName,readfilecallback);
    function readfilecallback(uint8array){
        try{
            writefile(outputFileName, Buffer.from(uint8array).toString("base64"),writecallback);
        }catch(e){
            console.log(e);
        }
    };
    function writecallback(error,str){
        console.log(error);
        console.log(str);
    }
}
module.exports = coventBuffer;
