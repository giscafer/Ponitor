import Vue from 'vue'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.config.debug = true

import App from './App.vue'
const router = new VueRouter()

// 路由
router.map({
  '/apps': {
    name: 'apps',
    component: require('./components/A.vue')
  },
  '/tmall': {
    name: 'tmall',
    component: require('./components/B.vue')
  },
  '/taobao': {
    name: 'taobao',
    component: require('./components/Counter.vue')
  },
  '/jd': {
    name: 'jd',
    component: require('./components/JD.vue')
  }
})

router.start(App, 'body')

