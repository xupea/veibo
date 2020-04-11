export default {
  name: "mactive",
  bind: function(el) {
    function remove() {
      el && el.classList.remove("m-active");
    }

    function add() {
      el.classList.add("m-active");
      setTimeout(remove, 500);
    }

    function isPassiveSupported() {
      let passiveSupported = false;

      try {
        const options = Object.defineProperty({}, "passive", {
          get: function() {
            passiveSupported = true;
            return passiveSupported;
          },
        });

        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
      } catch (error) {
        passiveSupported = false;
      }

      return passiveSupported;
    }

    el.addEventListener(
      "touchstart",
      add,
      isPassiveSupported && {
        passive: true,
      }
    );

    el.addEventListener("touchend", remove);
  },
};
