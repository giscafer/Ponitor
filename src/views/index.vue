
<template>
  <div id="allcontainer">
       <p class="loading" v-show="goods.length === 0">loading...</p>
  <div class="pure-g" v-else>
    <div class="pure-u-1-6" v-for="good in goods">
      <div class="good">
        <div class="icon">
          <img src="{{good.image}}" alt="" class="pure-img">
        <div class="name">{{ good.name }}>>>><a href="{{good.url}}" target="_blank">详情</a></div> 
        <div class="price">{{ good.priceText }}</div> 
        </div>
        </div>
     </div>
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
    route: {
      activate(){
        nprogress.start()
        request
          .get('/api/good')
          .end((err, res) => {
            nprogress.done()
            if (err) {
              notie.alert(3, err.message, 1.5)
            } else {
              this.goods = res.body
            }
          })
      }
    }
    }
</script>
<style scope>

#allcontainer{
    margin:0 240px 240px;

   .good{
      text-align: center;
    .icon{
      padding: 4em;
      padding-bottom: .6em;
      img{
        border-radius: 20px;
      }
    }
    .name{
      font-size: 1.8em;
    }
    .price{
      font-size: 2em;
      margin-top: .2em;
      background-color: #DCDCDC;
    }
   .loading{
      color: #393;
      text-align: center;
      font-size: 3em;
    }
  }
}
</style>
