import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import fromNow from "./filters/fromNow";
import numFormat from "./filters/numFormat";

import sentry from "./plugins/sentry";
import axios from "./plugins/axios";
import global from "./global";

import "@/assets/marvel/css/card/cards.css";
import "@/assets/marvel/css/lib/base.css";
import "./registerServiceWorker";

Vue.config.productionTip = false;

//注册filters
Vue.use(() => {
  Vue.filter("fromNow", fromNow);
  Vue.filter("numFormat", numFormat);
});

//使用sentry监控
Vue.use(sentry);

//配置axios
Vue.use(axios);

//注册全局组件和指令
Vue.use(global);

new Vue({
  router,
  store,
  name: "App",
  render: (h) => h(App),
}).$mount("#app");
