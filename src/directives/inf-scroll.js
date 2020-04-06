const config = {
    distance: .618 * window.innerHeight,
    gapTime: 300,
    visibleHeight: 0,
    firstCheck: false,
    funcExpression: "",
    scrollTarget: null,
    scrollListener: null,
    disabled: false
}

const { getComputedStyle } = document.defaultView;

const getScrollEventTarget = (element) => {

    let currentNode = element;

    while(currentNode && currentNode.tagName !== "HTML" && currentNode.tagName !== "BODY" && currentNode.nodeType === 1) {
        const overflowY = getComputedStyle(currentNode).overflowY;
        if(overflowY === "scroll" || overflowY === "auto") {
            return currentNode;
        }

        currentNode = currentNode.parentNode;
    }

    return window;
}

const getVisibleHeight = (element) => {
    if (element === window) {
        return document.documentElement.clientHeight
    }

    return element.clientHeight;
}

export default {
    name: "inf-scroll",
    bind(el, binding, vnode) {
        const vm = vnode.context;
        const expression = binding.expression;
        
        config.gapTime = e.getAttribute("gap-time") || r.gapTime;
        config.distance = e.getAttribute("distance") || r.distance;
        config.disabled = e.getAttribute("disabled") || r.disabled;
        config.firstCheck = e.getAttribute("first-check") || r.firstCheck;

        if(!expression)
            throw new Error("滚到底后要做什么呢？");

        if (!{}.hasOwnProperty.call(i.vm, i.epr))
            throw new Error("找不到所指定的method");

        e.getAttribute("first-check") || i.vm[i.epr].call();

        const mountedHandler = () => {
            vm.$nextTick(() => {

                config.scrollTarget = ;
                config.scrollListener
            })
        }

        vm.$on("hook:mounted", () => {});
        vm.$on("hook:update", () => {})
    },

    unbind() {
        config.scrollTarget.removeEventListener("scroll", config.scrollListener)
    }
}