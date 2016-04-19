<template>
	<footer class="footer ">
        <hr>
        <div class="row footer-bottom">
          <ul class="list-inline text-center">
            <li><a href="https://github.com/giscafer/" target="_blank">©2016 giscafer</a></li>
          	<li>Ponitor = [ P ] rice + M [ onitor ]&nbsp;价格监测</li>
            <li><a href="https://github.com/giscafer/Ponitor/issues/" target="_blank">意见反馈</a></li>
            <li><a href="https://github.com/giscafer/Ponitor/wiki/" target="_blank">使用教程</a></li>
            <li>用户数[{{userCount}}]</li>
            <li>商品数[{{goodCount}}]</li>
          </ul>
        </div>
      </div>
    </footer>
</template>

<script>
  import request from 'superagent'
  export default{
    data(){
      return {
        userCount:0,
        goodCount:0
      };
    },
    ready(){
      request.get('api/good/count')
        .end((err,res)=>{
          console.log(err,res)
            if(err){
              console.log(err);
            }else{
              this.$data.goodCount=res.body.data;
            }
        });
       request.get('api/user/count')
        .end((err,res)=>{
          console.log('user/counrt')
            if(err){
              console.log(err);
            }else{
              this.$data.userCount=res.body.data;
            }
        });
        
    }
  }
</script>