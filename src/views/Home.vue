<template>
  <div class="main-wrap">
    <top-bar
      v-on:update:curGroup="cur_group = $event"
      v-on:update:cur-group="cur_group = $event"
      v-on:changeGroup="switch_groups"
      v-on:updateFeed="loadmoreHandle"
      v-bind:curGroup="cur_group"
    />
    <template v-if="list_cur && list_cur.length > 0">
      <mv-loadmore ref="loadmore" :top-method="pull_refresh">
        <div
          ref="cont"
          class="pannelwrap"
          v-bind:style="{
          paddingTop: to_rem(padding_top),
          paddingBottom: to_rem(padding_bottom)
        }"
        >
          <div
            v-for="(item, index) in list_cur"
            v-bind:key="item.id || (item.mblog ? item.mblog.id : index) || item.itemid"
            class="wb-item-wrap"
          >
            <div class="wb-item">
              <weibo
                v-bind:item="item.mblog || item"
                v-bind:showTriangle="show_triangle"
                v-bind:showOgRCL="true"
                v-bind:showRpRCL="false"
              />
            </div>
          </div>
          <!-- <empty /> -->
        </div>
      </mv-loadmore>
      <!-- <friendships v-if="followerInfo"></friendships> -->
    </template>

    <template v-else>
      <div>
        <no-data v-if="net_error.flag" v-bind:msg="net_error"></no-data>
      </div>
      <div>
        <no-data v-if="!net_error.flag && no_data.flag" v-bind:msg="no_data"></no-data>
      </div>
      <div v-if="!net_error.flag && !no_data.flag">
        <empty />
        <empty />
        <empty />
        <empty />
        <empty />
      </div>
    </template>

    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import topBar from "@/components/TopBar.vue";
import mvLoadmore from "@/components/MVLoadMore.vue";
import empty from "@/components/Empty.vue";
import weibo from "@/components/Weibo.vue";

export default {
  name: "Home",
  components: {
    topBar,
    mvLoadmore,
    empty,
    weibo
  },
  watch: {
    cur_group: function(newValue, oldValue) {
      if (!oldValue && !this.list_all.length) {
        this.init_first_data();
      }
    }
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
    loadmoreHandle: function() {
      this.$refs.loadmore && this.$refs.loadmore.loadStart();
    },
    switch_groups: function() {
      this.is_refresh = false;
      this.no_data.flag = false;
      this.net_error.flag = false;
      this.re_do = false;
      this.list_all = [];
      this.list_cur = [];
      this.padding_top = 0;
      this.padding_bottom = 0;
      this.last_scrolltop = 0;

      var t = document.scrollingElement || document.body;
      t.scrollTop = 0;

      window.onscroll = null;

      // this.clear_storage();
      this.init_first_data();
    },

    init_first_data: function() {
      if (this.cur_group) {
        const { api } = this.cur_group;
        const url = api.indexOf("?") > 0 ? api : "".concat(api, "?");
        if (!this.is_request) {
          this.is_request = true;

          this.$http
            .get(url, {
              timeout: 3000
            })
            .then(res => {
              if (res.data && res.data.ok) {
                const { data } = res.data;
                if (data.cards || (data.statuses && data.statuses.length > 0)) {
                  if (data.cards && data.cards[0].card_type === 22) {
                    this.no_data.flag = true;
                  } else {
                    let statuses = data.statuses || data.cards;

                    const { cardlistInfo, page, trends, max_id } = data;

                    this.max_id = max_id;

                    this.since_id = cardlistInfo ? cardlistInfo.since_id : "";

                    if (page) {
                      this.page = page;
                    } else if (cardlistInfo) {
                      this.page = cardlistInfo.page;
                    }

                    // this.change_data(data);

                    if (trends && trends[0]) {
                      statuses = trends[0]["feeds"]
                        ? trends[0]["feeds"].concat(statuses)
                        : trends.concat(statuses);
                    }

                    this.list_cur = statuses;
                  }
                }
              } else {
                this.net_error.flag = true;
                this.net_error.msg = res.data.msg || res.net_error.msg;
              }
              this.$nextTick(() => {
                this.is_request = false;
                this.is_refresh = false;
                this.$emit("mvLoadEnd");
              });
            })
            .catch(() => {
              this.is_request = false;
              this.$emit("mvLoadEnd");
              this.net_error.flag = true;
              this.net_error.msg = "网络异常，稍后请刷新重试~";
            });
        }
      }
    },

    pull_refresh: function() {
      var t = document.scrollingElement || document.body;
      t.scrollTop = 0;
      this.padding_top = 0;
      this.padding_bottom = 0;
      this.last_scrolltop = 0;
      // this.clear_storage();
      this.init_first_data();
    },
    to_rem: function(pixels) {
      return "".concat(Math.ceil(pixels), "px");
    }
  },
  destroyed: function() {
    this.is_refresh = false;
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

.f-weibo.card9.m-panel {
  border-top-width: 0;
  margin: 0;
  border-bottom: 1px solid #e6e6e6;
}
</style>
