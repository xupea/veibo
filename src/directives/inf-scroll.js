import throttle from "lodash/throttle";

const config = {
  distance: 0.618 * window.innerHeight,
  gapTime: 300,
  visibleHeight: 0,
  firstCheck: false,
  funcExpression: "",
  scrollTarget: null,
  scrollListener: null,
  disabled: false
};

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

  return window;
};

const getVisibleHeight = element => {
  if (element === window) {
    return document.documentElement.clientHeight;
  }

  return element.clientHeight;
};

const scroll = element => {
  const curDistance =
    element.el.getBoundingClientRect().bottom - config.visibleHeight;
  if (curDistance < config.distance && !config.disabled) {
    element.vm[element.epr].call();
  }
};

export default {
  name: "inf-scroll",
  bind(el, binding, vnode) {
    const vm = vnode.context;
    const epr = binding.expression;

    const element = {
      el,
      vm,
      epr
    };

    config.gapTime = el.getAttribute("gap-time") || config.gapTime;
    config.distance = el.getAttribute("distance") || config.distance;
    config.disabled = el.getAttribute("disabled") || config.disabled;
    config.firstCheck = el.getAttribute("first-check") || config.firstCheck;

    if (!epr) throw new Error("滚到底后要做什么呢？");

    if (!{}.hasOwnProperty.call(vm, epr))
      throw new Error("找不到所指定的method");

    if (el.getAttribute("first-check")) vm[epr].call();

    let flag = false;
    const mountedHandler = () => {
      flag = true;

      vm.$nextTick(() => {
        config.scrollTarget = getScrollEventTarget(el);
        config.visibleHeight =
          getVisibleHeight(config.scrollTarget) || config.visibleHeight;
        config.scrollListener = throttle(() => scroll(element), config.gapTime);
        config.scrollTarget.addEventListener("scroll", config.scrollListener);
      });
    };

    vm.$on("hook:mounted", () => mountedHandler());
    vm.$on("hook:updated", () => flag || mountedHandler());
  },

  unbind() {
    config.scrollTarget.removeEventListener("scroll", config.scrollListener);
  }
};
