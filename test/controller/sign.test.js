


var should=require('chai').should();
var User=require('../../src/controller/sign');
var app = require('../../app');
var request = require('supertest')(app);

describe('../../src/controller/sign.js',function(){
	describe('should signup user',function(){
		it('signup',function(done){
			request.post('api/signup')
			.send({
				loginname:'test'+new Date().getTime(),
				email:'test'+new Date().getTime()+'@163.com',
				pass:'giscafer',
				re_pass:'giscafer'
			})
			.expect(200, function (err, res) {
				console.log(res.body);
				res.body.result_code.should.be(0);
			});
			done();
		});
	});
});