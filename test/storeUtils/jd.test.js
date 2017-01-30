
'use strict'

const JDURL1 = 'http://item.jd.com/10126350785.html';
const JDURL = 'http://item.jd.com/10397872923.html';

const should = require('chai').should();
// const apple = require('../../src/storeUtils/applestore.js');
// const tmall = require('../../src/storeUtils/tmallstore.js');
const jd = require('../../src/storeUtils/jdstore.js');
const request = require('superagent');

describe('test jd crawler info', function () {
    it('test jdstore.js', function (done) {
        jd.getPrice(JDURL1).then((goodInfo) => {
            // console.log(goodInfo)
            goodInfo.name.should.contains('360智能摄像机');
            goodInfo.description.should.contains('360智能摄像机');
            goodInfo.goodId.should.contains('10126350785');
            done();
        }).catch((err) => {
            console.log(err);
        });
    });
});
