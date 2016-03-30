var Ponitor={
	hideCon:function(){
		$('#nv-content').hide();
  		$('#navbar').css({
  			background: '#F5F5F5'
  		});
	},
	showCon:function(){
		$('#nv-content').show();
		$('#navbar').css({background: 'white'});
	},
	fadeOut:function(selector,time){
		if(!selector) return;
		if(time===undefined) time=0;
		setTimeout(function(){
			$(selector).fadeOut();
		}, time);
	}
};