<template>
<div id="menu" class="jumbotron">
  <div class="container" id="add">
      <h4>关注价格，在最适合的时候购买</h4>
      <div class="input-group  col-sm-10">
        <input class="form-control" style="float:right" v-model="goodUrl" @keyup.enter="add" type="text" placeholder="输入商品URL">
        <span class="input-group-btn">
          <button class="btn btn-default" @click="add">添加</button>
        </span>
    </div>
  </div>
</div>
<div class="container bs-docs-container">
     <div class="cate">
     <nav>
        <a href="#" v-link="{ name: 'all', query: { type: 'all' }}">所有</a>
        <a href="#" v-link="{ name: 'jd', query: { type: 'jd' }}">京东</a>
        <a href="#" v-link="{ name: 'alibaba', query: { type: 'alibaba' }}">天猫|淘宝</a>
        <a href="#" v-link="{ name: 'apple', query: { type: 'apple' }}">Apple App</a>
     </nav>
    </div>
</div>
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
                notie.alert(2,err.message,2);
                return;
              }else if(res.body.error){
                notie.alert(2,res.body.error,2);
                this.clearStore(res.body.reject);
                return;
              }else{
                if(res.body && res.body.status){
                   return notie.alert(2,res.body.message,2);
                }
                notie.alert(1,'添加成功',1);
                this.goodUrl='';
                this.goods.push(res.body);
                let type=res.body.type;
                this.$router.go({ name: 'all', params: { type: type }});
              }
            })

        }
      },
      clearStore:function(type){
        if(type==='unlogin'){
          localStorage.loginname="";
          localStorage.userId="";
        }
      }
    }
  }
</script>
<style>
    #menu{
      background: linear-gradient(90deg,#1d976c 10%,#93f9b9 90%);
      h4{
        font-size:1.2em;
        color: white;
      }
    }
	 #add{
      text-align: center;
      margin-top: 1em;
      input {
        width: 45em;
        border: 1px solid #d5d5d5;
        border-right: none;
        border-radius: 2em 0 0 2em;
        padding-left: 1em;
        padding-right: 1em;
        padding-top: .2em;
        padding-bottom: .3em;
        outline: none;
      }
      button{
        border: 1px solid #d5d5d5;
        padding-left: 1em;
        text-decoration: none;
        border-radius: 0 2em 2em 0;
        padding-right: 1em;
      }
      h4{
        margin-left: 5px;
      }
    }
     .v-link-active {
        border-bottom:2px solid #44B785;
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
                &:hover {
                    border-bottom: 2px solid #000;
                }
            }
        }
    }
</style>