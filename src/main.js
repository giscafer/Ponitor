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
  },
  '/active': {
    name: 'active',
    component: require('./views/active.vue')
  },
  '/searchpass': {
    name: 'searchpass',
    component: require('./views/searchpass.vue')
  },
  '/message': {
    name: 'message',
    component: require('./components/message.vue')
  },
  '/resetpass': {
    name: 'resetpass',
    component: require('./views/resetpass.vue')
  }
})

router.start(App, '#app')

router.beforeEach(function ({ to, next }) {
  if (to.path === '/goodlist') {
    Ponitor.hideCon();
  }else{
    Ponitor.showCon();
  }
  next();
});

