/**
 * crawler test
 */
 var should=require('chai').should();
 var apple=require('../../src/storeUtils/applestore.js');
 var tmall=require('../../src/storeUtils/tmallstore.js');
 var jd=require('../../src/storeUtils/jdstore.js');
 var request=require('superagent');

 describe('test shop crawler',function(){
 	describe('test crawler info',function(){
 		it('test applestore.js',function(done){
 			var url='https://itunes.apple.com/cn/app/garageband/id408709785?mt=8';
 			apple.fetchAppInfo(url).then((appInfo)=>{
 				appInfo.name.should.contains('GarageBand');
 				appInfo.description.should.contains('GarageBand');
 				done();
 			}).catch((err)=>{
 			    console.log(err);
 			});
 		});
 		it('test jdstore.js',function(done){
 			var url='http://item.jd.com/1250967.html';
 			
 			jd.getPrice(url).then((goodInfo)=>{
 				goodInfo.name.should.contains('Apple iPad Air 2');
 				goodInfo.description.should.contains('Apple iPad Air 2');
 				goodInfo.goodId.should.contains('1250967');
 				done();
 			}).catch((err)=>{
 			    console.log(err);
 			});
 		});
 		it('test tmallstore.js',function(done){
 			var itemId='42323050374';
 			tmall.fetchGoodInfo(itemId).then((goodInfo)=>{
 				goodInfo.name.should.contains('男士手表');
 				goodInfo.description.should.contains('石英');
 				goodInfo.goodId.should.contains('42323050374');
 				done();
 			}).catch((err)=>{
 			    console.log(err);
 			});
 		});
 	});
 });
