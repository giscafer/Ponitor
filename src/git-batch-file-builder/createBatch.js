'use strict'

const _ = require('lodash');
const fs = require('fs');

function createGitBatch(req, res, next) {
    let data = req.body.data;
    if (!data.length) return next();
    let urlList = _.map(data, 'url');
    let content=getStartInfo()+'git clone '+urlList.join('\necho.\ngit clone ')+getEndInfo();
    fs.writeFile('git_clone_all.bat', content, (err)=>{
            if (err) {
                res.send({resultCode:-1,message:'出现错误!'});
            }
             res.send({resultCode:200,message:'写入文件成功！'});
        });
    console.log(content);
}

function getStartInfo(){
    var startInfo="@echo off\n";
    startInfo+='echo.\n';
    startInfo+='echo "###################################################################"\n';
    startInfo+='echo "##            ----------git clone all----------                 ###"\n';
    startInfo+='echo "##           author: giscafer<giscafer@outlook.com>             ###"\n';
    startInfo+='echo "##   github: https://github.com/giscafer/git-batch-file-builder ###"\n';
    startInfo+='echo "###################################################################"\n\n\n';
    startInfo+='echo.\n';
    startInfo+='::git clone list\n';
    startInfo+='echo.\n';
    return startInfo;
}

function getEndInfo(){
    var endInfo='\n\n';
    endInfo+= 'echo.\n';
    endInfo+= 'echo.\n';
    endInfo+='echo "git clone all finished"\n';
    endInfo+= 'echo.\n';
    endInfo+='@pause';
    return endInfo;
}

module.exports = { createGitBatch }
