<template>
  <div class="lite-topbar main-top">
    <div class="nav-top">
      <div class="nav-left unlogin-logo"></div>
      <search-bar class="nav-search" v-bind:class="{'unlogin-search': true}" />
      <div class="nav-right" v-on:click="goMsg">
        <div class="lite-iconf lite-iconf-releas"></div>
      </div>
    </div>
    <div class="nav-main">
      <div class="m-box">
        <div class="m-box-col inner-box">
          <div class="scroll-box slide-container">
            <div class="slide-wrap">
              <ul class="nav_item" ref="navtab">
                <li
                  class="item_li"
                  v-for="(tab,index) in tabs"
                  v-bind:class="{cur: isInThisTabGroup(curTab, tab.children)}"
                  v-bind:key="tab.gid"
                  v-on:click="clickTabGroup(tab, index)"
                >
                  <span>
                    {{tab.children[tab.curGroupIndex || 0].name}}
                    <em></em>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="lite-nav-sublist m-col-4" v-if="isShowAllTabGroup">
            <ul class="m-auto-list">
              <li
                class="m-auto-box"
                v-for="(tab, index) in tabs"
                v-bind:key="index"
                v-bind:class="{cur: curTab.gid === tab.children[tab.curGroupIndex || 0].gid}"
                v-on:click="clickTabGroup(tab, index)"
              >
                <span class="m-text-cut">{{tab.children[tab.curGroupIndex || 0].name}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="nav-plus m-box-center m-box-center-a" v-on:click="showAllTabGroup">
          <i class="m-font m-font-arrow-down" v-bind:class="{aniRotate: isShowAllTabGroup}"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchBar from "@/components/SearchBar.vue";
import { mapActions } from "vuex";

const tabsData = null;

function formatChannel(channel) {
  const obj = {
    type: 1,
    name: channel.name,
    gid: channel.gid,
    api: "api/container/getIndex?containerid=".concat(channel.gid, "&openApp=0")
  };

  if ("trend" === channel.type) {
    obj.api = "api/feed/trendtop?containerid=".concat(channel.gid);
  }

  if ("custom" === channel.type) {
    obj.api = channel.url;
  }

  return obj;
}

export default {
  components: {
    searchBar
  },
  data: function() {
    return {
      curTab: {},
      curTabGroup: null,
      isShowAllTabGroup: false,
      isShowTabGroup: false,
      tabs: []
    };
  },
  props: ["curGroup"],
  created: function() {
    // 获取 tabs
    this.initTab();

    // restore net work
  },
  watch: {
    curPosition: function(position) {
      const index = position[0];
      this.tabs[index].curGroupIndex = position[1];
    }
  },
  computed: {
    curPosition: function() {
      for (var t = 0; t < this.tabs.length; t++)
        for (var e = 0; e < this.tabs[t].children.length; e++)
          if (this.tabs[t].children[e].gid === this.curTab.gid) return [t, e];
      return [0, 0];
    }
  },
  methods: {
    ...mapActions(["updateHotword"]),
    initTab: function() {
      if (tabsData) {
        this.tabs = tabsData;
        this.initCurTab();
      } else {
        this.getTabGroup();
      }
    },
    goMsg: function() {
      if ("/message" === this.$route.path) {
        this.$emit("updateFeed");
      } else {
        this.$router.push({
          path: "/message"
        });
      }
    },
    getTabGroup: function() {
      this.$http.get("api/config/list").then(e => {
        if (e.data && e.data.ok > 0) {
          const { data } = e.data;
          const { hot } = data;

          if (hot && hot.hotWord) {
            this.updateHotword(hot.hotWord);
          }

          // this.$store.dispatch("updateLoggedin", false);

          if (data.channel && data.channel.length) {
            this.tabs = data.channel.map(channel => ({
              children: [formatChannel(channel)]
            }));

            this.initCurTab();
          }
        }
      });
    },
    initCurTab: function() {
      // 如果 localStorage 里面已经存在 选中的 tab

      const firstTab = this.tabs[0].children[0];

      if (this.curTab.gid && firstTab.gid !== this.curTab.gid) {
        this.changeTab(firstTab);
      } else {
        this.setCurTab(firstTab);
      }
    },
    setCurTab: function(tab) {
      // 保存 tab 到 localStorage
      // TODO
      this.curTab = tab;
      this.$emit("update:curGroup", tab);
      this.scrollToCurTab(tab);
    },
    clickTabGroup: function(tab) {
      this.curTabGroup = tab;

      this.isShowAllTabGroup = false;

      if (this.isInThisTabGroup(this.curTab, tab.children)) {
        if (tab.children.length > 1) {
          this.isShowTabGroup = !this.isShowTabGroup;
        }
        this.changeTab(tab.children[0]);
      } else {
        this.isShowTabGroup = false;
        this.changeTab(tab.children[tab.curGroupIndex || 0]);
      }
    },
    changeTab: function(tab, e) {
      const s =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;

      if (2 !== tab.type) {
        if (3 !== tab.type) {
          if (tab.gid === this.curTab.gid) {
            this.$emit("updateFeed");
          } else {
            this.setCurTab(tab);
          }

          if (e) {
            e.curGroupIndex = s;
          }

          this.$nextTick(() => this.$emit("changeGroup"));
        } else {
          window.location.url = this.url;
        }
      } else {
        this.$router.push({
          path: this.url
        });
      }
    },
    scrollToCurTab: function() {
      let idx = -1;
      this.tabs.some((tab, index) => {
        if (this.isInThisTabGroup(this.curTab, tab.children)) {
          idx = index;
        }
      });
      this.$nextTick(() => {
        const { navtab } = this.$refs;
        if (navtab && idx > -1) {
          const rect = navtab.children[idx].getBoundingClientRect();
          navtab.parentElement.scrollLeft += rect.left - window.innerWidth / 2;
        }
      });
    },
    showAllTabGroup: function() {
      this.isShowAllTabGroup = !this.isShowAllTabGroup;
      // this.isShowTabGroup = false;
    },
    isInThisTabGroup: function(tab, tabGroup) {
      tabGroup.some(item => {
        return tab.gid === item.gid;
      });
      return tabGroup.some(item => tab.gid === item.gid);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.lite-iconf-releas {
  font-family: litefont;
  font-size: 1.75rem;
  color: #fff;
}

.lite-topbar {
  .nav-left,
  .nav-main,
  .nav-right,
  .nav-search {
    position: absolute;
    line-height: 2.75rem;
  }
}

.lite-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
  background-color: #fafafa;
  color: #262626;
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 1px;
  border-left-width: 0;
  border-color: #e6e6e6;
  border-style: solid;
  font-size: 1rem;
  z-index: 995;

  &.main-top {
    height: 5.25rem;

    .nav-main {
      top: 2.5rem;

      .inner-box {
        overflow: hidden;
        width: 1px;
      }
    }
  }

  .nav-main {
    top: 0;
    right: 0;
    left: 0;
    font-size: 1rem;
    color: #a5a5a5;
  }

  .nav-left {
    left: 0.75rem;
    z-index: 1;
  }

  .nav-right {
    right: 0.9375rem;

    .lite-iconf-releas {
      right: 0;
    }

    .lite-iconf {
      position: absolute;
      color: #282f3c;
    }
  }

  .nav-search {
    left: 2.75rem;
    right: 5.375rem;
    line-height: 2.5rem;

    &.unlogin-search {
      right: 2.75rem;
    }
  }
}

.icon-logo-qq,
.unlogin-logo {
  background-repeat: no-repeat;
  background-size: 100%;
}

.unlogin-logo {
  width: 1.625rem;
  height: 2.5rem;
  background-image: url("https://h5.sinaimg.cn/m/weibo-lite/img/pwalogo.417d1674.svg");
  background-position: 0 0.75rem;
}

.scroll-box {
  scroll-behavior: smooth;
}

.slide-container {
  overflow: hidden !important;
  height: 2.75rem;

  .slide-wrap {
    position: relative;
    padding-bottom: 0.6rem;
    margin-bottom: -0.6rem;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
}

.lite-nav-sublist {
  position: absolute;
  top: 2.75rem;
  left: 0;
  right: 0;
  padding: 0 0.5rem 1.125rem;
  color: #333;
  background-color: #fafafa;
  z-index: 2;

  .m-auto-list {
    width: 100%;
  }

  .m-auto-box {
    position: relative;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.5rem;

    &.cur {
      color: #ff8200;
    }

    span {
      display: inline-block;
      width: 100%;
      height: 2.125rem;
      line-height: 2.125rem;
      padding: 0 0.25rem;
      vertical-align: middle;
      background-color: #eee;
      border-radius: 3px;
    }

    &:nth-of-type(4n + 1) {
      margin-left: -0.25rem;
    }
  }
}

.m-auto-list {
  overflow: hidden;
  font-size: 0;
}

.m-col-4 {
  .m-auto-box {
    width: 25%;
  }
}

.m-auto-box {
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
}

.nav_item {
  white-space: nowrap;

  .item_li {
    display: inline-block;
    margin: 0 0.75rem;

    span {
      position: relative;
      vertical-align: middle;
      cursor: pointer;
    }

    &.cur {
      color: #000;

      span em {
        display: block;
        position: absolute;
        bottom: -0.5rem;
        left: 50%;
        width: 0.875rem;
        margin-left: -0.4375rem;
        border-top: 2px solid #282f3c;
      }
    }
  }
}

ul {
  list-style: none;
}

.aniRotate {
  transform: rotate(180deg);
}

.nav-plus {
  width: 2.6875rem;
  position: relative;

  .m-font {
    transition: transform 0.4s ease, -webkit-transform 0.4s ease;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0.1875rem;
    left: 1px;
    z-index: 9;
    width: 0.75rem;
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
    background: -webkit-gradient(
      linear,
      right top,
      left top,
      from(#fafafa),
      color-stop(20%, #fafafa),
      to(hsla(0, 0%, 98%, 0))
    );
    background: linear-gradient(
      270deg,
      #fafafa 0,
      #fafafa 20%,
      hsla(0, 0%, 98%, 0)
    );
  }
}

.nav-main,
.nav-right {
  z-index: 100;
}

.lite-iconf-releas {
  font-size: 1.25rem;

  &:before {
    content: "\E022";
    color: #282f3c;
  }
}
</style>
