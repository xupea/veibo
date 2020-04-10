<template>
  <div
    v-bind:style="{transform: translate, transitionDuration: transition}"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove.stop="onDrag"
    @touchmove.stop="onDrag"
    @mouseup="stopDrag"
    @touchend="stopDrag"
    @mouseleave="stopDrag"
    @transitionEnd="transitionEnd"
  >
    <div class="m-tips m-tips-tp">
      <template v-if="showArrow">
        <div v-if="requesting" class="m-loading m-loading-dark"></div>
        <i
          v-else
          class="m-font m-font-down m-font-down-ani"
          v-bind:class="{up: dragging && dY > topDistance}"
        ></i>
      </template>
      <span class="main-link" v-if="showText">{{ status }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
const { getComputedStyle } = document.defaultView;

const getScrollEventTarget = element => {
  let currentNode = element;

  while (
    currentNode &&
    currentNode.tagName !== "HTML" &&
    currentNode.tagName !== "BODY" &&
    currentNode.nodeType === 1
  ) {
    const overflowY = getComputedStyle(currentNode).overflowY;
    if (overflowY === "scroll" || overflowY === "auto") {
      return currentNode;
    }

    currentNode = currentNode.parentNode;
  }

  return document.documentElement;
};

export default {
  name: "loadmore",
  created: function() {
    this.$nextTick(
      () => (this.topBarHeight = this.$el.children[0].clientHeight)
    );
  },

  mounted: function() {
    this.scrollTarget = getScrollEventTarget(this.$el);
  },

  props: {
    topDistance: {
      type: Number,
      default: 100
    },
    topPullText: {
      type: String,
      default: "下拉刷新"
    },
    topDropText: {
      type: String,
      default: "加载中..."
    },
    topLoadingText: {
      type: String,
      default: "释放更新"
    },
    showText: {
      type: Boolean,
      default: !0
    },
    showArrow: {
      type: Boolean,
      default: !0
    },
    topMethod: {
      type: Function
    }
  },

  data: function() {
    return {
      scrollTarget: null,
      topBarHeight: 0,
      requesting: false,
      dragging: false,
      startY: 0,
      dY: 0,
      reset: true
    };
  },

  computed: {
    transition: function() {
      return this.dragging || (0 === this.dY && this.reset) ? "0s" : "200ms";
    },
    translate: function() {
      var e = 80 * Math.atan(this.dY / 200) - this.topBarHeight;
      return "translateY(".concat(e, "px)");
    },
    status: function() {
      return this.dragging && this.dY > this.topDistance
        ? this.topLoadingText
        : this.requesting
        ? this.topDropText
        : this.topPullText;
    }
  },

  watch: {
    requesting: function(e) {
      if (!e) this.dY = 0;
    }
  },

  methods: {
    loadStart: function() {
      this.requesting = true;
      this.topMethod();
      this.dY = this.topDistance;
    },
    loadEnd: function() {
      this.requesting = false;
    },
    startDrag: function(e) {
      var t = e.changedTouches ? e.changedTouches[0] : e;
      if (this.scrollTarget.scrollTop <= 0) {
        this.startY = t.pageY;
        this.dragging = true;
        this.reset = false;
      }
    },
    onDrag: function(e) {
      var t = e.changedTouches ? e.changedTouches[0] : e;
      if (this.dragging && t.pageY - this.startY > 0 && window.scrollY <= 0) {
        e.preventDefault();
        this.dY = t.pageY - this.startY;
        if (this.requesting) {
          this.dY = this.dY + this.topDistance;
        }
      }
    },
    stopDrag: function() {
      this.dragging = false;

      if (this.dY > this.topDistance && window.scrollY <= 0) {
        this.loadStart();
      } else {
        this.dY = 0;
      }
    },
    transitionEnd: function() {
      if (this.dY !== this.topDistance || this.requesting) this.dY = 0;

      if (0 === this.dY) this.reset = !0;
    }
  }
};
</script>

<style lang="less">
</style>