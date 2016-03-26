/**
 * 用户表
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Promise=require('bluebird');
const UserSchema = new Schema({
    name: { type: String },
    loginname: { type: String },
    pass: { type: String },
    email: { type: String },
    phone: { type: String },
    profile_image_url: { type: String }, //头像url
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

    active: { type: Boolean, default: false }, //状态

    retrieve_time: { type: Number },
    retrieve_key: { type: String },

    accessToken: { type: String } //可用来生成二维码图片扫描授权
});

//创建索引
UserSchema.index({ loginname: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.create_at = this.update_at = Date.now();
    } else {
        this.update_at = Date.now();
    }
    next();
});
//包装静态方法
UserSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('update_at').exec(cb);
    },
    getUsersByQuery: function(query, opt, cb) {
        return this.find(query, '', opt).sort('update_at').exec(cb);
    },
    getUserById: function(id, cb) {
        return this.findOne({ _id: id },cb);
    },
    getUserByLoginName: function(loginName, cb) {
        return this.findOne({ 'loginname': loginName }).exec(cb);
    },
    getUserByMail: function(email, cb) {
        return this.findOne({ email: email }).exec(cb);
    },
    getUserByNameAndKey: function(loginname, key, cb) {
        return this.findOne({ loginname: loginname, retrieve_key: key }).exec(cb);
    },
    getCountByQuery: function(query, cb) {
        return this.count(query).exec(cb);
    }
};
var User = mongoose.model('User', UserSchema);

Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports=User;
