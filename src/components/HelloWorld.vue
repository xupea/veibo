<template>
  <div class="lite-topbar main-top">
    <div class="nav-main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.lite-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  &.main-top {
    height: 5.25rem;

    .nav-main {
      top: 2.5rem;
    }
  }

  .nav-main {
    position: absolute;
    line-height: 2.75rem;

    top: 0;
    right: 0;
    left: 0;
    font-size: 1rem;
    color: #a5adb5;

    .nav-plus {
      width: 2.6875rem;
      position: relative;
    }
  }
}
</style>
