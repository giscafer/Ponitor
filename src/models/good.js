'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
 
const GoodSchema = new Schema({
    userId: { type: ObjectId }, //用户ID
    goodId: { type: String }, //商品ID
    name: { type: String },
    oldPrice: { type: Number, default: 0 }, //原价格
    marketPrice: { type: Number, default: 0 }, //最新价格
    priceText:{type:String},//加单位的价格
    image: { type: String }, //图片url
    screenshot:[{type:String}],//截屏
    description: { type: String },
    url: { type: String }, //商品链接
    type: { type: String }, //商品分类
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

//创建索引
GoodSchema.index({ goodId: 1 }, { unique: true });
GoodSchema.index({ type: 1 });

const GoodModel = mongoose.model('Good', GoodSchema);
/**
 * 新增
 */
function add(info) {
    return new Promise((resolve, reject) => {
        GoodModel.findOne({ goodId: info.goodId, type: info.type }).exec().then((good) => {
            if (good) {
                reject({
                    status: 402,
                    message: '该商品已经存在！'
                });
            } else {
                GoodModel.create({
                        userId: info.userId,
                        goodId: info.goodId,
                        name: info.name,
                        oldPrice: info.price,
                        marketPrice: info.price,
                        priceText: info.priceText,
                        image: info.image,
                        description: info.description,
                        url: info.url,
                        type: info.type
                    })
                    .then(good => {
                        resolve(good);
                     })
                    .catch(err => { reject(err) });
            }
        }).catch(err => reject(err));
    });
}
/**
 * update
 */
function update(id, info){
  return new Promise((resolve, reject) => {
    GoodModel.update(info, {
      where: {
        id: id
      }
    })
    .then(good => resolve(good))
    .catch(err => reject(err));
  });
}
/**
 * 查询列表
 */
function list(query, opt) {
    return new Promise((resolve, reject) => {
        GoodModel.find(query, '', opt).then(goods => {
            resolve(goods);
        }).catch(err => { reject(err) });
    });
}

module.exports = { add,update,list };
