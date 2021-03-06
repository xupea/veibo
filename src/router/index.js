import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "feed",
    meta: {
      name: 'feed'
    },
    component: Home,
  },
  {
    path: "/search",
    name: "searchall",
    component: Search,
    meta: {
      page_type: "searchall",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savePosition) {
    return savePosition || { x: 0, y: 0 };
  },
});

export default router;
