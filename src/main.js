import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

App.mpType = 'app'

import request from '@/api/api.js';
Vue.prototype.$request = request;

const app = new Vue({
  ...App
})
app.$mount()
