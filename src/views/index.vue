
<template>
  <div class="container">
    <h2>index</h2>
  </div>
  <good-list></good-list>
</template>

<script>

import request from 'superagent'
import notie from 'notie'
import nprogress from 'nprogress'

export default{
  data(){
      return {
        goods:[],
        adding:false,
        goodUrl:''
      }
    }, 
    route: {
      data(transition){
      	console.log(transition.to.query.type);
        const type=transition.to.query.type;
        nprogress.start()
        request
          .get('/api/good/'+type)
          .end((err, res) => {
            nprogress.done()
            if (err) {
              notie.alert(3, err.message, 1.5)
            } else {
              this.goods = res.body
              console.log(this.goods)
            }
          })
      }
    },
	components: {
	  goodList:require('../components/list.vue')
	}
}
</script>