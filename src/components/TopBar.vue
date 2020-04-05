<template>
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
    <div class="nav-plus m-box-center" v-on:click="showAllTabGroup">
      <i class="m-font m-font-arrow-down" v-bind:class="{aniRotate: isShowAllTabGroup}"></i>
    </div>
  </div>
</template>

<script>
const mockData = {
  groups: [],
  channel: [
    { gid: "102803", name: "\u70ed\u95e8" },
    {
      gid: "102803_ctg1_8999_-_ctg1_8999_home",
      name: "\u699c\u5355",
      type: "trend"
    },
    {
      gid: "102803_ctg1_600059_-_ctg1_600059",
      name: "\u6218\u75ab\u60c5",
      type: "trend"
    },
    {
      gid: "102803_ctg1_7978_-_ctg1_7978",
      name: "\u65b0\u9c9c\u4e8b",
      type: "trend"
    },
    { gid: "102803_2222", name: "\u540c\u57ce", type: "trend" },
    {
      gid: "102803_ctg1_1770_-_ctg1_1770",
      name: "\u70ed\u70b9",
      type: "trend"
    },
    {
      gid: "102803_ctg1_2088_-_ctg1_2088",
      name: "\u79d1\u6280",
      type: "trend"
    },
    {
      gid: "102803_ctg1_4288_-_ctg1_4288",
      name: "\u660e\u661f",
      type: "trend"
    },
    {
      gid: "102803_ctg1_3288_-_ctg1_3288",
      name: "\u7535\u5f71",
      type: "trend"
    },
    {
      gid: "102803_ctg1_5288_-_ctg1_5288",
      name: "\u97f3\u4e50",
      type: "trend"
    },
    {
      gid: "102803_ctg1_5088_-_ctg1_5088",
      name: "\u6570\u7801",
      type: "trend"
    },
    {
      gid: "102803_ctg1_5188_-_ctg1_5188",
      name: "\u6c7d\u8f66",
      type: "trend"
    },
    { gid: "102803_ctg1_4888_-_ctg1_4888", name: "\u6e38\u620f", type: "trend" }
  ],
  hot: {
    ok: 1,
    hotWord:
      "#\u8fd4\u4eac\u7559\u5b66\u751f\u4e24\u6b21\u51fa\u73b0\u75c7\u72b6\u672a\u62a5\u544a#",
    scheme:
      "https://weibo.cn/appurl?scheme=sinaweibo%3A%2F%2Fsearchall%3Fq%3D%23%E8%BF%94%E4%BA%AC%E7%95%99%E5%AD%A6%E7%94%9F%E4%B8%A4%E6%AC%A1%E5%87%BA%E7%8E%B0%E7%97%87%E7%8A%B6%E6%9C%AA%E6%8A%A5%E5%91%8A%23"
  }
};

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
  name: "HelloWorld",
  props: {
    msg: String
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
    initTab: function() {
      if (tabsData) {
        this.tabs = tabsData;
        this.initCurTab();
      } else {
        this.getTabGroup();
      }
    },
    getTabGroup: function() {
      if (mockData.channel && mockData.channel.length) {
        this.tabs = mockData.channel.map(channel => ({
          children: [formatChannel(channel)]
        }));
      }

      this.initCurTab();
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
      this.curTab = tab;
      // this.$emit("update:curGroup", tab);
      this.scrollToCurTab(tab);
    },
    clickTabGroup: function(tab) {
      this.curTabGroup = tab;

      this.isShowAllTabGroup = false;

      if (this.isInThisTabGroup(this.curTab, tab.children)) {
        this.changeTab(tab.children[0]);
      } else {
        this.changeTab(tab.children[tab.curGroupIndex || 0]);
      }
    },
    changeTab: function(tab, e) {
      const s =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;

      this.setCurTab(tab);

      if (e) e.curGroupIndex = s;

      this.$nextTick(() => this.$emit("changeGroup"));
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
        console.log(tab.gid, item.gid);
        return tab.gid === item.gid;
      });
      return tabGroup.some(item => tab.gid === item.gid);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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

@font-face {
  font-family: marvelfont;
  src: url(data:font/woff;base64,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)
    format("woff");
  font-weight: 400;
  font-style: normal;
}

.m-font {
  font-family: marvelfont;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}

.m-box {
  display: flex;
  font-size: 1rem;
  line-height: 2.75rem;
}

.m-box-col {
  flex: 1;
  display: block;
}

.inner-box {
  overflow: hidden;
  width: 1px;
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

  &::before {
    content: "";
    position: absolute;
    z-index: 9;
    width: 0.75rem;
    left: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      #fff 0,
      #fff 50%,
      rgba(255, 255, 255, 0) 100%
    );
  }
}

.m-box-center {
  display: flex;
  justify-content: center;

  align-items: center;
}

.m-font-arrow-down::before {
  content: "\E008";
}
</style>
