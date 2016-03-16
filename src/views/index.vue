<style>
h2 {
  color: #393;
  text-align: center;
  font-size: 3em;
}
#container{
   .good{
    text-align: center;
    .icon{
      padding: 4em;
      padding-bottom: .6em;
      img{
        border-radius: 20%;
      }
    }
    .name{
      font-size: .8em;
    }
    .price{
      font-size: .8em;
      margin-top: .2em;
    }
  }
}
</style>

<template>
  <div class="container">
       <p v-show="goods.length === 0">loading...</p>
  <div class="pure-g" v-else>
    <div class="pure-u-1-6" v-for="good in goods">
      <div class="good">
        <div class="icon">
          <img src="{{good.image}}" alt="" class="pure-img">
        <div class="name">{{ good.name }}</div> 
        <div class="price">{{ good.marketPrice }}</div> 
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
      data(){
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