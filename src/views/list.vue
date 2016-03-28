  <template>
    <div id="allcontainer">
     <p class="loading" v-show="goods.length === 0">该分类没有商品</p>
     <div class="pure-g" v-else>
      <div class="pure-u-1-6" v-for="good in goods">
        <div class="good">
          <div class="icon">
            <img v-bind:src="good.image" alt="" class="pure-img">
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
  data () {
    return { 
    	goods:[],
        adding:false,
        goodUrl:''
     }
  }, 
    route: {
      data(transition){
        const type=transition.to.query.type;
        request
          .post('/api/good/'+type)
          .end((err, res) => {
            nprogress.done()
            if (err) {
              notie.alert(3, err.message, 1.5)
            } else {
              this.goods = res.body
            }
          })
      }
    },
  ready () {
    this.handle = setInterval(() => {
      this.count++
    }, 1000)
  },

  destroyed () {
    clearInterval(this.handle)
  }
}
</script>


<style>

#allcontainer{
   margin:0 240px 240px;
	.loading{
		margin-top: 20px;
	    color: #393;
	    text-align: center;
	    font-size: 0.8em;
    }
   .good{
      text-align: center;
    .icon{
      padding: 2em;
      padding-bottom: .6em;
      img{
        border-radius: 20px;
      }
    }
    .name{
      font-size: 0.8em;
    }
    .price{
      font-size: 0.8em;
      margin-top: .2em;
      background-color: #DCDCDC;
    }
  }
}
</style>
