let dirfile = require('./index');
let path = require('path');

const dirpath = 'i:/aaa';
const async = false;
const deep = true;
const extname = 'sql';

let fileArr = dirfile(dirpath,async,deep,function(filePath,stat){
    var ext = path.extname(filePath).toLowerCase(),
        extArr = extname.split(',').map(item=>{
            return item.startsWith('.') ? item : '.'+item;
        }).join(',');
    return ext != '' && extArr.toLowerCase().indexOf(ext) > -1;
},function(filePath,stat){
    return filePath;
});

console.log(fileArr.length);

console.log('--------------------')

dirfile(dirpath).then(list => {
    console.log(list);
});

(async function () { 
    let list = await dirfile(dirpath);
    console.log(list);
})();