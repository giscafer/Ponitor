'use strict'

const redis = require('./redis');
const _ = require('lodash');
const logger = require('./logger');
/**
 * 从缓存获取内容
 */
function get(key, callback) {
    let t = new Date();
    redis.get(key, function(err, data) {
        if (err) {
            return callback(err);
        }
        if (!data) {
            return callback();
        }
        data = JSON.parse(data);
        let duration = (new Date() - t);
        logger.debug('Cache', 'get', key, (duration + 'ms').green);
        callback(null, data);
    });
}
/**
 * 缓存
 */
function set(key, value, time, callback) {
    let t = new Date();

    if (typeof time === 'function') {
        callback = time;
        time = null;
    }
    callback = callback || _.noop;
    value = JSON.stringify(value);

    if (!time) {
        redis.set(key, value, callback);
    } else {
        redis.setex(key, time, value, callback);
    }
    var duration = (new Date() - t);
    logger.debug("Cache", "set", key, (duration + 'ms').green);
}
module.exports = { get,set};
