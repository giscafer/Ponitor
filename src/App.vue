<template>
<header class="navbar navbar-static-top navbar-default" id="top" role="banner">
    <div class="container">
        <div class="navbar-header"></div >
        <div  id="bs-navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="../" style="color:#19986B">Ponitor</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#"  class="">登录</a></li>
                <li><a href="#"  class="">注册</a></li>
            </ul>
        </div >
    </div>
</header>
<div class="jumbotron">
  <div class="container" id="add">
      <h4>关注价格，在最适合的时候购买</h4>
      <input class="control-input" v-model="appUrl" @keyup.enter="add" type="text" placeholder="输入商品URL"><a href="javascript:void(0)" @click="add">添加</a>
  </div>
</div>
<div class="container bs-docs-container">
     <div class="cate">
     <nav>
        <!-- 使用指令 v-link 进行导航 -->
            <a href="#" v-link="{path:'/apps'}">Apple App</a>
            <a href="#" v-link="{path:'/jd'}">京东</a>
            <a href="#" v-link="{path:'/tmall'}">天猫</a>
            <a href="#" v-link="{path:'/taobao'}">淘宝</a>
            </nav>
    </div>

</div>
    <!-- 路由外链 -->
    <router-view></router-view>
</template>
<style>
@import "/normalize.css";
@import "purecss";
@import "/node_modules/nprogress/nprogress.css";
   body {
      color: #555459;
      margin: 0 auto;
      font-size: 0.8em;
      font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
  } 
    .v-link-active {
        border-bottom-color: #000;
    }
    #top{
        margin-bottom:0px;
    }
    #add{
      text-align: center;
      margin-top: 1em;
      input{
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