import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'


import totast from './components/common/toast'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
//安装totast插件
Vue.use(totast)

FastClick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/palceholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
