<template>
  <div class="main-wrap">
    <top-bar v-on:update:curGroup="cur_group = $event" v-on:update:cur-group="cur_group = $event" />
    <mv-loadmore ref="loadmore" :top-method="pull_refresh">
      <div ref="cont" class="pannelwrap">
        <empty />
      </div>
    </mv-loadmore>
  </div>
</template>

<script>
// @ is an alias to /src
import topBar from "@/components/TopBar.vue";
import mvLoadmore from "@/components/MVLoadMore.vue";
import empty from "@/components/Empty.vue";

export default {
  name: "Home",
  components: {
    topBar,
    mvLoadmore,
    empty
  },
  data: function() {
    return {
      timer: null,
      is_upglide: !1,
      is_refresh: !1,
      lastHeight: 0,
      first_scroll: 0,
      is_scrolling: !1,
      is_loading: !1,
      is_request: !1,
      list_all: [],
      list_cur: [],
      since: "",
      max: "",
      padding_top: 0,
      padding_bottom: 0,
      page: "",
      since_id: "",
      max_id: "",
      count: 20,
      last_scrolltop: 0,
      diff_items: [],
      feed_id: 5e3,
      show_triangle: !0,
      no_data: {
        flag: !1,
        msg: "暂无数据"
      },
      net_error: {
        flag: !1,
        msg: "网络异常，请稍后刷新重试~"
      },
      re_do: !1,
      cur_group: null,
      showAppTips: !1,
      pageLoaded: !1
    };
  },
  methods: {
    init_first_data: function() {},

    pull_refresh: function() {
      var t = document.scrollingElement || document.body;
      t.scrollTop = 0;
      this.padding_top = 0;
      this.padding_bottom = 0;
      this.last_scrolltop = 0;
      this.clear_storage();
      this.init_first_data();
    }
  }
};
</script>

<style lang="less" scoped>
.main-wrap {
  margin: 5.2rem 0 1.75rem 0;
}

.pannelwrap {
  height: 500px;
}
</style>
