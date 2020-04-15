<template>
  <div v-show="requesting" class="m-tips m-tips-tp">
    <div class="m-loading m-loading-dark">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "nextpage",
  props: {
    requesting: { type: Boolean, default: false }
  }
};
</script>

<style lang="less" scoped>
</style>