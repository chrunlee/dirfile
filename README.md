# dirfile
获取文件夹内所有的文件。支持递归获取、异步或同步、过滤、返回信息处理。

# install 

```
npm install dirfile
```

# use
```
var dirfile = require('dirfile');
var path = require('path');

//扫描文件夹路径
var dirPath = 'd:/folder/',
    //是否异步获取
    async = true,
    //是否递归查询子级目录
    isDeep = true;


//# 同步获取文件
dirfile(dirPath,async,isDeep,function(filePath,stat){
    return path.extname(filePath) == '.java';
},function(filePath,stat){
    return {
        name : path.basename(filePath),
        filePath : filePath
    }
})
.then(function(fileList){
    console.log(fileList);//打印文件列表信息
})
.catch(function(err){
    console.log(err);
})



//使用同步获取
async = false;

var fileList2 = dirfile(dirPath,async,isDeep,function(filePath,stat){
    return path.extname(filePath) == '.java';
},function(filePath,stat){
    return filePath;
})

console.log(fileList2);//打印输出即可

//简单调用
dirfile(dirPath)
.then(function(fileList){
    console.log(fileList);
})

```

# 参数
- isAsync : 是否异步，如果是异步，为true,则返回 `promise` 函数，通过 `then` 调用。如果为false ，则直接同步获取，直接返回获得文件列表。(默认为`true`)
- isDeep : 是否递归获取子级文件夹,true 则获取所有子级文件夹内符合条件的文件，false 则只获取当前级别下的文件。(默认为`true`)
- pushFn : 过滤函数，如果没有过滤函数，则获取所有的文件，提供参数`filePath` `stat` . 文件路径以及文件状态信息，需要返回`true/false`. 
- infoFn : 获取信息函数，如果没有该函数，则默认返回对象. `{filePath : filePath}` 。 可自定义返回值，提供参数`filePath` `stat` . 

参数为向前补充的，第一个参数为`dirPath` 保持不变，如果有两个则第二个参数为 `infoFn` ,如果有三个则`pushFn` `infoFn` ,类似这样。


# 说明
简单做了一个测试，异步要比同步快一倍左右，当然都是小文件，大文件可能差别更多。没有进行细致的测试。

# License 
MIT