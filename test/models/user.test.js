
var should=require('chai').should();
var User=require('../../src/models/user');
describe('./src/models/user.js',function(){
	describe('test User Model statics method Promise',function(){
		it('has findAsync func',function(done){
			User.findAsync({}).then(function(data){
				data.should.be.length(0);
			});
			
			done();
		});
		it('has fetchAsync func',function(done){
			User.hasOwnProperty('fetchAsync').should.be.true;
			User.getUsersByQuery({loginname:'sss'},{}).then(function(data){
				data.should.be.length(0);
			});
			done();
		});
		it('has getUsersByQueryAsync func',function(done){
			User.hasOwnProperty('getUsersByQueryAsync').should.be.true;
			done();
		});
		it('has getUserByLoginNameAsync func',function(done){
			User.hasOwnProperty('getUserByLoginNameAsync').should.be.true;
			done();
		});
	});
});