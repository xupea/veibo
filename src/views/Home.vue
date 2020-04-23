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
          :style="{
            'padding-top': to_rem(padding_top),
            'padding-bottom': to_rem(padding_bottom)
          }"
        >
          <div
            v-for="(item, index) in list_cur"
            v-bind:key="
              item.id || (item.mblog ? item.mblog.id : index) + Math.random() || item.itemid
            "
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
        </div>
        <div v-if="re_do" class="m-tips m-tips-tp cursor" @click="load_more(nextPageApi)"></div>
        <mv-nextpage :requesting="is_request"></mv-nextpage>
        <div class="temporary" ref="hei">
          <div
            v-for="(item, index) in diff_items"
            :key="item.id || (item.mblog ? item.mblog.id : index)"
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
        </div>
      </mv-loadmore>
      <friendships v-if="followerInfo"></friendships>
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
    <!-- <transition name="fade">
      <div v-if="mlogin" v-show="!t.is_upglide" class="refresh-btn lite-iconf" @click="handle_refresh"></div>
      <loginSignin v-else v-show="!t.is_upglide"></loginSignin>
    </transition>-->
    <!-- <pop-video-new v-if="pageLoaded"></pop-video-new>
    <appTips v-if="showAppTips"></appTips>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import topBar from "@/components/TopBar.vue";

import friendships from "@/components/FriendShips.vue";
import empty from "@/components/Empty.vue";
import weibo from "@/components/Weibo.vue";

export default {
  name: "Home",
  components: {
    // card,
    // loginSignin,
    topBar,
    empty,
    weibo,
    // popVideoNew,动态的
    // noData,
    // appTips,
    friendships
  },
  watch: {
    list_all: function() {
      if (this.is_loading) this.scrolling();
    },
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

                    this.$nextTick(() => {
                      const children = this.$refs.cont.children;

                      for (let i = 0; i < children.length; i++) {
                        const hei = children[i].offsetHeight;
                        const fid = this.feed_id++;
                        Object.assign(statuses[i], { hei, feed_id: fid });
                      }

                      this.list_all = statuses;

                      const clientHeight =
                        document.documentElement.clientHeight ||
                        window.innerHeight;
                      const curDataLen = this.list_cur.length;

                      this.since = this.list_cur[0].feed_id;
                      this.max = this.list_cur[curDataLen - 1].feed_id;
                      this.first_scroll =
                        0.5 * this.$refs.cont.offsetHeight - clientHeight / 2;

                      window.onscroll = this.scrolling;
                    });

                    this.no_data.flag = false;
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

    load_more: function(api, showToast) {
      if (!this.is_request) {
        this.is_request = true;
        this.re_do = false;

        this.$http
          .get(api, { timeout: 1000 * 30 })
          .then(res => {
            if (!res.data || !res.data.ok)
              throw new Error({ msg: res.data.msg });
            // if ("all" === a.cur_group.gid) this.freezeUnreadKey("status");
            const { data } = res.data;
            data.statuses = data.statuses || data.cards;

            if (data.statuses.length > 0) {
              if (data.cards && 22 === data.cards[0].card_type) {
                this.is_request = false;
                // this.$emit("mvLoadEnd");
              } else {
                this.max_id = data.max_id;
                this.since_id = data.cardlistInfo
                  ? data.cardlistInfo.since_id
                  : "";

                if (data.page) {
                  this.page = data.page;
                } else {
                  if (data.cardlistInfo) this.page = data.cardlistInfo.page;
                }

                // this.change_data(value);
                this.save_height(data);
              }
            }
          })
          .catch(error => {
            showToast &&
              this.$emit("mvToast", {
                type: "error",
                text: error.msg || "网络异常，请稍后再试~"
              });

            this.is_request = false;
            this.re_do = true;
          });
      }
    },

    save_height: function(data, direction) {
      let statuses = data.statuses || data.cards;
      const len = statuses.length;

      this.diff_items = statuses;

      this.$nextTick(() => {
        if (this.$refs.hei.children.length === len) {
          const children = this.$refs.hei.children;
          for (let i = 0; i < len; i++) {
            const hei = children[i].offsetHeight;
            const fid = this.feed_id++;
            Object.assign(statuses[i], { hei, feed_id: fid });
          }

          this.set_list_all(data, direction);
          this.diff_items = [];
        }
      });
    },

    set_list_all: function(value, type) {
      this.is_request = false;

      const { statuses } = value;

      this.list_all =
        "start" === type
          ? statuses.concat(this.list_all)
          : this.list_all.concat(statuses);
    },

    to_rem: function(pixels) {
      return "".concat(Math.ceil(pixels), "px");
    },

    get_item_H: function(direction, N) {
      // 获取第一个/最后一个元素高度
      let hei = 0;

      if (this.$refs.cont) {
        const items = this.$refs.cont.children;
        const len = items.length;
        const n = N || len;

        if (direction === "start") {
          for (let i = 0; i < n; i++) {
            hei += items[i].offsetHeight;
          }
        } else {
          for (let i = len - 1; i >= len - n; i--) {
            hei += items[i].offsetHeight;
          }
        }
      }

      return hei;
    },

    get_wb_hei: function(items) {
      let hei = 0;
      for (let i = 0; i < items.length; i++) {
        hei += items[i].hei;
      }
      return hei;
    },

    get_scroll_items: function(scrollDis, cursor) {
      let i;
      let j;
      const len = this.list_all.length;
      let idx = "";
      let arr_all_top = [];
      let arr_all_bottom = [];
      let arr = [];
      let diffArr = [];
      let n_top = 0;
      let n_bottom = 0;
      let dis_top = 0;
      let dis_bottom = 0;
      // 找到检索的起始位置
      for (i = 0; i < len; i++) {
        if (
          (cursor === "since" && this.since === this.list_all[i].feed_id) ||
          (cursor === "max" && this.max === this.list_all[i].feed_id)
        ) {
          idx = i;
          break;
        }
      }
      /* if (len - idx <= 10) {
         // 坐标位置往后仅仅剩下不足20条数据,则继续储备数据{
         this.load_more(this.feed_url + '&max_id=' + this.max_id);
         }*/
      // 检测scrollDis的距离是从since开始的多少条微博的高度
      if (cursor === "max") {
        const idx_since = idx + 1 - this.list_cur.length;
        for (i = idx_since; i < len; i++) {
          if (dis_top + this.list_all[i].hei <= scrollDis) {
            // list_cur顶部第一条开始计算,总共滚动了n_top条微博高度;
            // 向下滚时上面需要减掉的微博条数
            dis_top += this.list_all[i].hei;
            n_top++;
          } else {
            break;
          }
        }
        for (j = idx + 1; j < len; j++) {
          if (dis_bottom + this.list_all[j].hei <= scrollDis) {
            // 从max后面的一条开始计算,总共滚动了n_bottom条微博高度;
            // 向下滚时下面需要增加的微博条数
            dis_bottom += this.list_all[j].hei;
            n_bottom++;
          } else {
            /* if (dis_bottom + this.list_all[j].hei !== scrollDis) {
               n_bottom++;
               }*/
            break;
          }
        }
        // 循环结束了,dis_bottom + this.list_all[j].hei 仍然小于scrollDis,说明list_all里的微博不够 return ''
        if (
          this.list_all[j] &&
          dis_bottom + this.list_all[j].hei >= scrollDis &&
          this.list_all[idx + 1 + n_bottom]
        ) {
          // 避免直接拖动滚动条,滚动高度过高,直接截取倒数this.count条
          // arr 下面需要增加的微博列表
          // difArr 上面需要减掉的微博列表(用来计算上面paddingtop撑起高度)
          arr_all_bottom = this.list_all.slice(idx + 1, idx + 1 + n_bottom);
          arr = this.list_all.slice(
            n_bottom > this.count ? idx + 1 + n_bottom - this.count : idx + 1,
            idx + 1 + n_bottom
          );
          arr_all_top = this.list_all.slice(idx_since, idx_since + n_top);
          diffArr =
            n_top > this.list_cur.length
              ? this.list_cur
              : this.list_all.slice(idx_since, idx_since + n_top);
          /* scrollWbHei = this.get_wb_hei(arr);
             padTop = dis - scrollWbHei;*/
          return {
            /* n_top: n_top,
               n_bottom: n_bottom,
               dis_top: dis_top,
               dis_bottom: dis_bottom,*/
            add_wb_list: arr,
            wb_list_top: arr_all_top,
            wb_list_bottom: arr_all_bottom,
            diff_wb_list: diffArr
          };
        }
      }
      // 检查scrollDis的距离是从max往前的多少条微博的高度
      if (cursor === "since" && this.list_all[idx - 1]) {
        const idx_max = idx - 1 + this.list_cur.length;
        for (i = idx_max; i >= 0; i--) {
          if (dis_bottom + this.list_all[i].hei <= scrollDis) {
            // 从max那条开始算,总共滚动了n_bottom条微博高度;
            // 向上滚时下面需要减掉的微博条数
            dis_bottom += this.list_all[i].hei;
            n_bottom++;
          } else {
            break;
          }
        }
        for (j = idx - 1; j >= 0; j--) {
          if (dis_top + this.list_all[j].hei <= scrollDis) {
            // 从since的前一条开始算,总共滚动了n_top条微博高度;
            // 向上滚时下面需要减掉的微博条数
            dis_top += this.list_all[j].hei;
            n_top++;
          } else {
            /* if (dis_top + this.list_all[j].hei !== scrollDis) {
               n_top++;
               }*/
            break;
          }
        }
        // if (this.list_all[j] && dis_top + this.list_all[j].hei >= scrollDis) {
        // 避免直接拖动滚动条,滚动高度过高,直接截取this.count条
        // arr 上面需要增加的微博列表
        // diffArr 下面需要减掉的微博列表(计算下面paddingbottom需要撑起高度)
        const start = Math.max(idx - n_top, 0);
        arr_all_top = this.list_all.slice(start, idx);
        arr_all_bottom = this.list_all.slice(
          Math.max(idx_max + 1 - n_bottom, 0),
          idx_max + 1
        );
        if (idx - n_top <= 0) {
          arr = this.list_all.slice(0, this.count);
          diffArr = this.list_cur;
        } else {
          arr = this.list_all.slice(
            start,
            n_top > this.count ? start + this.count : idx
          );
          diffArr =
            n_bottom > this.list_cur.length
              ? this.list_cur
              : this.list_all.slice(
                  Math.max(idx_max + 1 - n_bottom, 0),
                  idx_max + 1
                );
        }
        return {
          /* n_top: n_top,
             n_bottom: n_bottom,
             dis_top: dis_top,
             dis_bottom: dis_bottom,*/
          add_wb_list: arr,
          wb_list_top: arr_all_top,
          wb_list_bottom: arr_all_bottom,
          diff_wb_list: diffArr
        };
        // }
      }
      return "";
    },

    scrolling: function() {
      const scrollingElement = document.scrollingElement || document.body;
      const curScrollTop = scrollingElement.scrollTop;

      if (!this.is_refresh && curScrollTop > 0) {
        if (curScrollTop >= this.lastHeight) {
          this.is_upglide = true;
        } else this.is_upglide = false;
      }

      this.lastHeight = curScrollTop;

      if (!this.is_scrolling) {
        this.is_scrolling = true;
      }

      setTimeout(() => {
        this.is_scrolling = false;
        // if (this.padding_top === 0 && curScrollTop < this.first_scroll) {
        //   return
        // }

        if (
          this.$refs.cont &&
          !(this.padding_top === 0 && curScrollTop < this.first_scroll)
        ) {
          const scrollDis =
            curScrollTop - this.first_scroll - this.last_scrolltop;
          if (scrollDis > 0 && curScrollTop - this.last_scrolltop > 0) {
            // 向下滚动
            if (Math.abs(scrollDis) >= this.get_item_H("start", 1)) {
              const scrollInfo = this.get_scroll_items(scrollDis, "max");

              if (typeof scrollInfo === "object") {
                if (
                  scrollInfo.wb_list_top.length > 0 &&
                  scrollInfo.wb_list_bottom.length > 0
                ) {
                  this.padding_top += this.get_wb_hei(scrollInfo.wb_list_top);

                  if (
                    this.padding_bottom >
                    this.get_wb_hei(scrollInfo.wb_list_bottom)
                  ) {
                    this.padding_bottom -= this.get_wb_hei(
                      scrollInfo.wb_list_bottom
                    );
                  } else {
                    this.padding_bottom = 0;
                  }

                  const newlist = this.list_cur.slice(
                    scrollInfo.diff_wb_list.length
                  );
                  this.list_cur = newlist.concat(scrollInfo.add_wb_list);
                  this.max = this.list_cur[this.list_cur.length - 1].feed_id;
                  // console.log('++++++++++' + self.max);
                  this.since = this.list_cur[0].feed_id;
                  // self.last_scrolltop += scrollInfo.dis;
                  this.last_scrolltop += this.get_wb_hei(
                    scrollInfo.wb_list_top
                  );
                  this.is_loading = false;
                }
              } else {
                console.log(scrollDis);
                console.log(this.nextPageApi);
                this.load_more(this.nextPageApi);
                this.is_loading = true;
              }
            }
          } else if (
            scrollDis < 0 &&
            curScrollTop - (this.last_scrolltop + this.first_scroll) < 0
          ) {
            console.log(this.get_item_H("end", 1))
            if (Math.abs(scrollDis) >= this.get_item_H("end", 1)) {
              const scrollUpInfo = this.get_scroll_items(
                Math.abs(scrollDis),
                "since"
              );

              if (typeof scrollUpInfo === "object") {
                if (
                  scrollUpInfo.wb_list_top.length > 0 &&
                  scrollUpInfo.wb_list_bottom.length > 0
                ) {
                  this.padding_bottom += this.get_wb_hei(
                    scrollUpInfo.wb_list_bottom
                  );

                  if (
                    this.padding_top > this.get_wb_hei(scrollUpInfo.wb_list_top)
                  ) {
                    this.padding_top -= this.get_wb_hei(
                      scrollUpInfo.wb_list_top
                    );
                  } else {
                    this.padding_top = 0;
                  }
                  const len = this.list_cur.length;
                  const newlist1 = this.list_cur.slice(
                    0,
                    len - scrollUpInfo.diff_wb_list.length
                  );
                  this.list_cur = scrollUpInfo.add_wb_list.concat(newlist1);
                  this.max = this.list_cur[this.list_cur.length - 1].feed_id;
                  this.since = this.list_cur[0].feed_id;
                  if (curScrollTop === 0) {
                    this.last_scrolltop = 0;
                  } else {
                    this.last_scrolltop -= this.get_wb_hei(
                      scrollUpInfo.wb_list_top
                    );
                  }
                }
              }
            }
          }
        }
      }, 300);
    }
  },
  destroyed: function() {
    this.is_refresh = false;
  },
  mounted: function() {
    setTimeout(() => {
      this.is_scrolling = false;
      this.is_request = false;
      this.is_loading = false;

      // const scrollingElement = document.scrollingElement || document.body;
      // scrollingElement.scrollTop =
      window.onscroll = this.scrolling;
    });
  },
  computed: {
    ...mapGetters(["config", "mlogin", "followerInfo", "curWeiboData"]),
    isRefreshRotate: function() {
      return this.is_refresh && this.is_request;
    },
    nextPageApi: function() {
      const url = new URL(window.location.origin + "/" + this.cur_group.api);

      this.cur_group.typeId
        ? url.searchParams.set(
            this.cur_group.typeId,
            this[this.cur_group.typeId]
          )
        : this.since_id
        ? url.searchParams.set("since_id", this.since_id)
        : this.page && url.searchParams.set("page", this.page);

      return url.pathname + url.search;
    }
  }
};
</script>

<style lang="less" scoped>
.main-wrap {
  margin: 5.2rem 0 1.75rem 0;
}

.pannelwrap {
  width: 100%;
  overflow: hidden;
}

.f-weibo.card9.m-panel {
  border-top-width: 0;
  margin: 0;
  border-bottom: 1px solid #e6e6e6;
}

.wb-item-wrap {
  overflow: hidden;
}
</style>
