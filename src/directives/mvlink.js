export default {
  name: "mvlink",
  bind: function(el, binding, vnode) {
    function callback(e) {
      el.classList.add("m-active");
      setTimeout(() => el && el.classList.remove("m-active"), 100);

      if (
        binding.value &&
        (binding.value.scheme ||
          binding.value.actionlog ||
          binding.value.toLogin ||
          binding.value.callback ||
          e.getAttribute("callback"))
      ) {
        e.stopPropagation();

        if (binding.value.actionlog) {
          // TODO app.js
        }

        if (binding.value.toLogin) {
          console.log("todo");
        } else if (binding.value.callback) {
          binding.value.callback.call();
        } else if (e.getAttribute("callback")) {
          const callback = e.getAttribute("callback").replace(/\(\)/g, "");
          vnode.context[callback].call();
        } else if (binding.value.scheme) {
          console.log("todo");
        }
      }
    }

    el.addEventListener("click", callback);
  }
};
