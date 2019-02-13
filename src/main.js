// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';

// i-view 组件
import iView from 'iview';
import 'iview/dist/styles/iview.css';

// Vuex 与 Cookie
import store from './store';
import VueCookie from 'vue-cookie';

import echarts from 'echarts';


Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
Vue.prototype.$echarts = echarts;

Vue.use(VueCookie);
Vue.use(iView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
