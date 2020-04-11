import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "@/assets/marvel/css/card/cards.css";
import "@/assets/marvel/css/lib/base.css";

axios.defaults.baseURL = "http://180.76.51.7";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
