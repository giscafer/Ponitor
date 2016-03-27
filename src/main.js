import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.config.debug = true

import App from './App.vue'
const router = new VueRouter()

// 路由
router.map({
  '/': {
    name: 'all',
    component: require('./views/list.vue')
  },
  '/apps': {
    name: 'apple',
    component: require('./views/list.vue')
  },
  '/alibaba': {
    name: 'alibaba',
    component: require('./views/list.vue')
  },
  '/jd': {
    name: 'jd',
    component: require('./views/list.vue')
  },
  '/goodlist': {
    name: 'goodlist',
    component: require('./views/goodlist.vue')
  }
})

router.start(App, '#app')

router.beforeEach(function ({ to, next }) {
  if (to.path === '/goodlist') {
     jQuery('#nv-content').hide();
     jQuery('#navbar').css({background: '#F5F5F5'});
  }else{
    jQuery('#nv-content').show();
    jQuery('#navbar').css({background: 'white'});
  }
  next()
});

