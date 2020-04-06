import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

axios.defaults.baseURL = 'https://m.weibo.cn/'

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
