'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const GoodSchema = new Schema({
    skuId: { type: String }, //商品ID
    name: { type: String },
    oldPrice: { type: Number, default: 0 }, //原价格
    marketPrice: { type: Number, default: 0 }, //最新价格
    image: { type: String }, //图片url
    description: { type: String },
    url: { type: String }, //商品链接
    type: { type: String }, //商品分类
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

//创建索引
GoodSchema.index({ skuId: 1 }, { unique: true });
GoodSchema.index({ type: 1 });

const GoodModel = mongoose.model('Good', GoodSchema);
/**
 * 新增
 */
function add(info) {
    return new Promise((resolve, reject) => {
        GoodModel.findOne({ skuId: info.skuId, type: info.type }).then((good) => {
            if (good) {
                reject({
                    status: 402,
                    message: '该商品已经存在！'
                });
            } else {
                GoodModel.create({
                        skuId: info.skuId,
                        name: info.name,
                        oldPrice: info.price,
                        marketPrice: info.price,
                        image: info.image,
                        description: info.description,
                        url: info.url,
                        type: info.type
                    })
                    .then(good => { resolve(good) })
                    .catch(err => { reject(err) });
            }
        }).catch(err => reject(err));
    });
}

/**
 * 查询
 */
function list(query, opt) {
    return new Promise((resolve, reject) => {
        GoodModel.find(query, '', opt).then(goods => {
            resolve(goods);
        }).catch(err => { reject(err) });
    });
}

module.exports = { add, list };
