<template>
<div class="jumbotron">
  <div class="container" id="add">
      <h4>关注价格，在最适合的时候购买</h4>
      <input class="control-input" v-model="goodUrl" @keyup.enter="add" type="text" placeholder="输入商品URL"><a href="javascript:void(0)" @click="add">添加</a>
  </div>
</div>
<div class="container bs-docs-container">
     <div class="cate">
     <nav>
        <!-- 使用指令 v-link 进行导航 -->
            <a href="#" v-link="{path:'/', exact: true }">所有</a>
            <a href="#" v-link="{path:'/jd', exact: true }">京东</a>
            <a href="#" v-link="{path:'/tmall', exact: true }">天猫</a>
            <a href="#" v-link="{path:'/taobao', exact: true }">淘宝</a>
            <a href="#" v-link="{path:'/apps', exact: true }">Apple App</a>
     </nav>
    </div>

</div>
    <!-- 路由外链 -->
    <router-view></router-view>
</template>
<script>
  import request from 'superagent'
  import notie from 'notie'
  import nprogress from 'nprogress'
  
  export default {
    data(){
      return {
        goods:[],
        adding:false,
        goodUrl:''
      }
    },
    methods:{
      add(){
        console.log('click add')
        if (!this.adding) {
          nprogress.start();
          this.adding=true;
          request
            .post('api/good')
            .send({
              url:this.goodUrl
            })
            .end((err,res)=>{
              nprogress.done();
              this.adding=false;
              if(err){
                console.log(err);
                notie.alert(4,err.message,1.5);
              }else{
                notie.alert(2,'添加成功',1.5);
                this.goodUrl='';
                this.goods.push(res.body);
              }
            })

        }
      }
    }
  }
</script>
<style>
	 #add{
      text-align: center;
      margin-top: 1em;
      input {
        width: 30em;
        border: 1px solid #d5d5d5;
        border-right: none;
        border-radius: 2em 0 0 2em;
        padding-left: 1em;
        padding-right: 1em;
        padding-top: .2em;
        padding-bottom: .1em;
        outline: none;
      }
      
      a{
        color: #000;
        background-image: linear-gradient(#fcfcfc, #eee);
        border: 1px solid #d5d5d5;
        padding: .2em;
        padding-left: 1em;
        text-decoration: none;
        border-radius: 0 2em 2em 0;
        padding-right: 1em;
      }
    }
     .v-link-active {
        border-bottom-color: #000;
    }
    .cate {
        /*margin-top: 2em;*/
        nav {
            text-align: center;
            a {
                transition: all .2s;
                margin: 1em;
                padding-bottom: .4em;
                color: #000;
                text-decoration: none;
                border-bottom: 2px solid #fff;
                &:hover {
                    border-bottom-color: #000;
                }
            }
        }
    }
</style>