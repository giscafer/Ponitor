<template>
<div id="good-list-con">
	<input type="checkbox" v-model="checked">
	<label for="checked">一次仅展开一栏</label>
	<br>
	<accordion :one-at-atime="checked">
	  <panel class="jd" header="京东" :is-open="true">
        <span v-show="jdGoods.length===0">
          该分类没有商品
        </span>
        <div v-else v-for="good in jdGoods" class="goodlist">
            <div class="card good-item" data-id="{{good._id}}">
                <div class="card-block">
                  <header class="good-item-hd">
                    <img v-bind:src="good.image" alt="good.name">
                    <span data-price="{{good.marketPrice}}">{{good.priceText}}</span>
                    <button type="button" class="btn btn-danger btn-sm" @click="delHandler(good._id,good.type)">
                      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> 删除
                    </button>
                  </header>
                  <section class="good-item-bd fix-break-word">{{good.name}}</section>
                </div>
           </div>
        </div>
     </panel>
	  <panel class="alibaba" header="淘宝 | 天猫">
	    <span v-show="alibabaGoods.length===0">
        该分类没有商品
      </span>
      <div v-else v-for="aligood in alibabaGoods" class="goodlist">
          <div class="card good-item" data-id="{{aligood._id}}">
              <div class="card-block">
                <header class="good-item-hd">
                  <img v-bind:src="aligood.image" alt="{{aligood.name}}">
                   <span data-price="{{aligood.marketPrice}}">{{aligood.priceText}}</span>
                   <button type="button" class="btn btn-danger btn-sm" @click="delHandler(aligood._id,aligood.type)">
                      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> 删除
                    </button>
                </header>
                <section class="good-item-bd fix-break-word">{{aligood.name}}</section>
              </div>
         </div>
      </div>
	  </panel>
	  <panel class="apple" header="Apple App">
	    <span v-show="appleApps.length===0">
        该分类没有商品
      </span>
      <div v-else v-for="app in appleApps" class="goodlist">
          <div class="card good-item" data-id="{{app._id}}">
              <div class="card-block">
                <header class="good-item-hd">
                  <img v-bind:src="app.image" alt="{{app.name}}">
                  <span data-price="{{app.marketPrice}}">{{app.priceText}}</span>
                  <button type="button" class="btn btn-danger btn-sm" @click="delHandler(app._id,app.type)">
                     <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> 删除
                   </button>
                </header>
                <section class="good-item-bd fix-break-word">{{app.name}}</section>
              </div>
         </div>
      </div>
	  </panel>
	</accordion>
</div>

</template>
<script>
import { accordion } from 'vue-strap';
import { panel } from 'vue-strap';
import notie from 'notie';
import _ from 'lodash';
import request  from 'superagent';
import nprogress  from 'nprogress';
  export default{
    data(){
      return{
        jdGoods:[],
        alibabaGoods:[],
        appleApps:[]
      };
    },
  	ready(){
  		if(this.$route.path==='/goodlist'){
  			jQuery('#nv-content').hide();
  			jQuery('#navbar').css({
  			  background: '#F5F5F5'
  			});
        jQuery(".panel-collapse").css('max-height', '');
  		}
  	},
    methods:{
      delHandler:function(goodId,type){
          let _self=this;
          notie.confirm('确定删除？', '确定', '取消', function() {
             _self.del(goodId,type);
          });
          
      },
      del:function(goodId,type){
        request.post('api/good/del/'+goodId)
        .end((err,res)=>{
          if(err || res.body.error){
            notie.alert(3,'删除失败！',1.5);
            return;
          }
          $('.goodlist>[data-id='+goodId+']').remove();
          let len=0;
          if(type==='jd'){
            len=this.$jdGoodsLen-=1;
          }else if(type==='apple'){
            len=this.$appleGoodsLen-=1;
          }else{
            len=this.$alibabaGoodsLen-=1;
          }
          $('#good-list-con .'+type+' .panel-title').find('span').html(len);
        });
      },
      sortGoods:function(goods){
        if(!goods.length) return;
        this.$data.jdGoods=_.filter(goods,(item,index)=>{
           return item.type==='jd';
        });
        this.$data.alibabaGoods=_.filter(goods,(item,index)=>{
           return item.type==='alibaba';
        });
        this.$data.appleApps=_.filter(goods,(item,index)=>{
           return item.type==='apple';
        });
        this.$jdGoodsLen=this.jdGoods.length;
        this.$alibabaGoodsLen=this.alibabaGoods.length;
        this.$appleGoodsLen=this.appleApps.length;
        this.labelPill('jd',this.$jdGoodsLen);
        this.labelPill('alibaba',this.$alibabaGoodsLen);
        this.labelPill('apple',this.$appleGoodsLen);
      },
      labelPill:function(type,len){
        $('#good-list-con .'+type+' .panel-title').append('<span class="label label-info label-pill count">'+len+'</span>');
      }
    },
     route: {
      data(transition){
        request
          .post('/api/goodlist')
          .end((err, res) => {
            nprogress.done();
            if (err) {
              notie.alert(3, err.message, 1.5);
              return;
            } else if(res.body.result_code===-1){
              notie.alert(3, res.body.error, 1.5);
              return;
            }
            this.sortGoods(res.body);
          });
      }
    },
    components: {
      accordion,
      panel
    }
  }
</script>

<style>

#good-list-con{
   margin:50px 240px 0 240px;
	.loading{
		margin-top: 20px;
	    color: #393;
	    text-align: center;
	    font-size: 0.8em;
    }
   .goodlist{
      overflow-y:auto;
      .name{
        font-size: 0.8em;
      }
      .good-item-hd{
        img{
          width: 80px;
          border-radius: 20px;
        }
        button{
          float:right;
        }
      }
      section{
        font-size: 0.6em;
      }
      .price{
        font-size: 0.8em;
        margin-top: .2em;
        background-color: #DCDCDC;
      }
  }
}
</style>