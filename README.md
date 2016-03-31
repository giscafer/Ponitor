# Pomitor

[ P ] rice + M [ onitor ] = Ponitor 价格监测

可添加天猫、淘宝、京东、Apple App的商品，监控商品价格发生变动时（每天定时器），推送消息（目前是发送邮件）！

技术栈：vue.js + ES6 + node.js + mongodb（持久化）

# Usage

前提：

1、确保node版本支持ES6，项目开发node版本为v5.3.0

2、将`src/config.global.default.js`文件重命名为`config.global.js`

然后：

- `npm install`

- `gulp`

or

- `npm install`

- `npm run build`

- `node app.js`


# Screenshot

![index](https://raw.githubusercontent.com/giscafer/Ponitor/master/wiki/index_preview.png)

![index](https://raw.githubusercontent.com/giscafer/Ponitor/master/wiki/goodlist_preview.png)

关注的商品价格发生变化（涨价or降价）的时候发生邮件通知，如测试截图：

![index](https://raw.githubusercontent.com/giscafer/Ponitor/master/wiki/email-sample.png)

# Other

[wiki](https://github.com/giscafer/Ponitor/wiki)


# License

MIT
