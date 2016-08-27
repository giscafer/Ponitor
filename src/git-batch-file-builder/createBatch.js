'use strict'
/**
 * create by Giscafer on 2016-08-27 22:51:09
 * https://github.com/giscafer/git-batch-file-builder
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

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
    let urlList = _.map(data, 'url');
    let content = getStartInfo() + 'git clone ' + urlList.join('\necho.\ngit clone ') + getEndInfo();
    let timestramp = new Date().getTime()+'',
        filename = timestramp + '\\git_clone_all.bat',
        fileDir = path.resolve('download', timestramp),
        filePath = path.resolve('download', filename);
    if (fs.existsSync(fileDir)) {
        console.log('已经创建过此更新目录了');
    } else {
        fs.mkdirSync(fileDir);
        console.log('更新目录已创建成功\n');
    }
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            res.send({ resultCode: -1, message: '出现错误!' });
        }
        res.send({ resultCode: 200, message: '写入文件成功！', path: 'download/' + filename });
    });
}

function getStartInfo() {
    var startInfo = "@echo off\n";
    startInfo += 'echo.\n';
    startInfo += 'echo "###################################################################"\n';
    startInfo += 'echo "##            ----------git clone all----------                 ###"\n';
    startInfo += 'echo "##           author: giscafer<giscafer@outlook.com>             ###"\n';
    startInfo += 'echo "##   github: https://github.com/giscafer/git-batch-file-builder ###"\n';
    startInfo += 'echo "###################################################################"\n\n\n';
    startInfo += 'echo.\n';
    startInfo += '::git clone list\n';
    startInfo += 'echo.\n';
    return startInfo;
}

function getEndInfo() {
    var endInfo = '\n\n';
    endInfo += 'echo.\n';
    endInfo += 'echo.\n';
    endInfo += 'echo "git clone all finished"\n';
    endInfo += 'echo.\n';
    endInfo += '@pause';
    return endInfo;
}

module.exports = { createGitBatch }
