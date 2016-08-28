'use strict'
/**
 * create by Giscafer on 2016-08-27 22:51:09
 * https://github.com/giscafer/git-batch-file-builder
 */
const _ = require('lodash');
const path = require('path');
const Promise=require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
/*function createGitBatch(req, res, next) {
    let data = req.body.data;
    if (!data.length) return next();
    let urlList = _.map(data, 'url');
    let content = getStartInfo() + 'git clone ' + urlList.join('\necho.\ngit clone ') + getEndInfo();
    let filename = new Date().getTime() + '';
    let filePath = path.resolve('download', filename);

    // res.setContentType("Content-type", "application/binary");
    // res.writeHead(200, {
    //     'Content-Type': 'application/binary',//octet-stream
    //     'Content-disposition': 'attachment; filename="git_clone_all.bat"'
    // });
    // res.write(content);
    // res.end();
    //不知道为什么不行/////
    res.download('./download/1472274844654/git_clone_all.bat', 'git_clone_all.bat', function(err){
      if (err) {
        console.log(err);
           console.log('错误');
      } else {
        console.log('成功');
      }
    });

}*/
function createGitBatch(req, res, next) {
    let data = req.body.data;
    if (!data.length) return next();
    let urlList = _.map(data, 'url'),
        gitcloneContent = buildGitCloneCd(data),//分支
        gitpullContent = buildGitPullCd(urlList),
        gitresetContent = buildGitResetCd(urlList),
        timestramp = new Date().getTime() + '',
        gitclone_filename = timestramp + '\\git_clone_all.bat',
        gitpull_filename = timestramp + '\\git_pull_all.bat',
        gitreset_filename = timestramp + '\\git_reset_all.bat',
        fileDir = path.resolve('download', timestramp),
        gitclonePath = path.resolve('download', gitclone_filename),
        gitpullPath = path.resolve('download', gitpull_filename),
        gitresetPath = path.resolve('download', gitreset_filename);
    if (fs.existsSync(fileDir)) {
        console.log('已经创建过此更新目录了');
    } else {
        fs.mkdirSync(fileDir);
        console.log('更新目录已创建成功\n');
    }
    let paths=[];
    paths.push('download/' + gitclone_filename);
    paths.push('download/' + gitpull_filename);
    paths.push('download/' + gitreset_filename);
    let files = [];
    files.push(fs.writeFileAsync(gitclonePath,gitcloneContent,"utf-8"));
    files.push(fs.writeFileAsync(gitpullPath,gitpullContent,"utf-8"));
    files.push(fs.writeFileAsync(gitresetPath,gitresetContent,"utf-8"));
    Promise.all(files).then(function() {
        res.send({ resultCode: 200, message: '写入文件成功！', paths: paths });
    },function(err){
        if (err) {
            res.send({ resultCode: -1, message: err });
        }
    });
}
/**
 * 创建git reset all 
 */
function buildGitResetCd(urlList) {
    let type = 'git reset';
    let arr = [];
    let content='';
    for (let item of urlList) {
        let proName=getProName(item);
        content+='echo [ git reset --hard '+proName+' ]\n';
        content+='cd '+proName+'\ngit reset --hard\ncd ..\necho.\necho.\n';
    }
    return getStartInfo(type)  + content +getEndInfo(type);
}
/**
 * 创建git pull all 
 */
function buildGitPullCd(urlList) {
    let type = 'git pull';
    let arr = [];
    let content='';
    for (let item of urlList) {
        let proName=getProName(item);
        content+='echo [ git pull '+proName+' ]\n';
        content+='cd '+proName+'\ngit pull\ncd ..\necho.\necho.\n';
    }
    return getStartInfo(type)  + content +getEndInfo(type);
}
/**
 * 创建git clone all 
 */
function buildGitCloneCd(data) {
    let type = 'git clone';
    let content='';
    for (let item of data) {
        let proName=getProName(item.url),
            url=item.url,
            branch=item.branch || 'master';

        content+='echo [ git clone -b '+branch+' of '+proName+' ]\n';
        content+='git clone -b '+branch+' '+url+'\necho.\n';
    }
    return getStartInfo(type) + content + getEndInfo(type);
}

function getStartInfo(type) {
    if (!type) type = 'git clone';
    let startInfo = "@echo off\ncd /d %~dp0\n";
    startInfo += 'echo.\n';
    startInfo += 'echo "###################################################################"\n';
    startInfo += 'echo "##            ----------' + type + ' all----------                 ###"\n';
    startInfo += 'echo "##           author: giscafer<giscafer@outlook.com>             ###"\n';
    startInfo += 'echo "##   github: https://github.com/giscafer/git-batch-file-builder ###"\n';
    startInfo += 'echo "###################################################################"\n\n\n';
    startInfo += 'echo.\n';
    startInfo += '::' + type + '  list\n';
    startInfo += 'echo.\n';
    return startInfo;
}

function getEndInfo(type) {
    if (!type) type = 'git clone';
    let endInfo = '\n\n';
    endInfo += 'echo.\n';
    endInfo += 'echo.\n';
    endInfo += 'echo "' + type + ' all finished"\n';
    endInfo += 'echo.\n';
    endInfo += '@pause';
    return endInfo;
}

function getProName(url) {
    let e = url.lastIndexOf('.git');
    let s = url.lastIndexOf('/');
    return url.substring(s + 1, e);
}
module.exports = { createGitBatch }
