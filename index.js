/***
 * 读取文件夹内的文件然后返回文件列表信息
 * @author chrunlee
 * 在写一些小工具的时候，经常会用到这种需求，每次情况都大差不差,还要再写一遍，虽然不难..但是很烦!!!
 ***/
let path = require('path');
let fs = require('fs');
let async = require('async');

function getFileList(dirPath,isDeep,pushFn,infoFn){

    let result = [];

    let files = fs.readdirSync(dirPath);

    files.forEach(function(item){

        var realPath = path.join(dirPath,item);

        var stat = fs.statSync(realPath);

        if(stat.isDirectory() && isDeep){

            result = result.concat(getFileList(realPath,isDeep,pushFn,infoFn));

        }else{

            if(pushFn && pushFn(realPath,stat)){

                result.push(infoFn ? infoFn(realPath,stat) : {filePath : realPath});

            }else if(!pushFn){

                result.push(infoFn ? infoFn(realPath,stat) : {filePath : realPath});

            }
        }
    })
    return result;
}

function getListAsync(filePath,isDeep,pushFn,infoFn,cb){
    fs.stat(filePath,(err,stat)=>{

        if(stat.isDirectory() && isDeep){
            //递归执行。
            getFileListAsync(filePath,isDeep,pushFn,infoFn)
            .then(files=>{
                cb(null,files);
            })
            .catch(err=>{
                cb(err);
            })
        }else{
            var rst = [];
            if(pushFn && pushFn(filePath,stat)){
                var info = infoFn ? infoFn(filePath,stat) : {filePath : filePath};
                rst.push(info);
            }else if(!pushFn){
                rst.push(infoFn ? infoFn(filePath,stat) : {filePath : filePath});
            }
            cb(null,rst);
        }

    })
}
function getFileListAsync(dirPath,isDeep,pushFn,infoFn){
    return new Promise((resolve,reject)=>{

        fs.readdir(dirPath,(err,files)=>{
            if(err){
                reject(err);
            }else{
                async.map(files,(item,cb)=>{
                    let filePath = path.join(dirPath,item);
                    getListAsync(filePath,isDeep,pushFn,infoFn,cb);
                },function(err,values){
                    if(err){
                        reject(err);
                    }else{
                        //进行平级处理
                        var result = [];
                        values.forEach(child=>{
                            if(child instanceof Array){
                                result = result.concat(child);
                            }else{
                                result.push(child);
                            }
                        })
                        resolve(result);
                    }
                });
            }
        })

    });
       
}


module.exports = function(
    dirPath     //需要查找的文件夹目标路径
    ,isAsync    //是否同步，如过为true,则为同步获取，如果为false,则为promise 异步获取。
    ,isDeep     //是否递归查询，如果为true,则查找所有子文件夹，否则只查找当前文件夹下，默认为true
    ,pushFn     //哪一类的文件可以被查找到，提供一个filePath 和 stats 参数进行判断，需要返回true/false
    ,infoFn     //都返回文件的哪些信息，默认为filePath .
    ){
    //除了第一个参数外，其余都可以忽略，且向后移动
    if(arguments.length == 1){
        isAsync = true;
        isDeep = true;
        pushFn = null;
        infoFn = null;
    }else if(arguments.length == 2){//两个参数，为最后
        infoFn = arguments[1];
        isAsync = true;
        isDeep = true;
        pushFn = null;
    }else if(arguments.length == 3){//三个参数，后两个
        infoFn = arguments[2];
        pushFn = arguments[1];
        isAsync = true;
        isDeep = true;
    }else if(arguments.length == 4){//四个参数，后三个
        infoFn = arguments[3];
        pushFn = arguments[2];
        isDeep = arguments[1];
        isAsync = true;
    }
    return isAsync ?  getFileListAsync(dirPath,isDeep,pushFn,infoFn) : getFileList(dirPath,isDeep,pushFn,infoFn);
}