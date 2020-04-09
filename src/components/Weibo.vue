<template>
  <div class="card m-panel card9 f-weibo" v-if="item.id">
    <div class="card-wrap">
      <div class="card-title f-card-title" v-if="item.title && item.title.text">
        <div class="m-ctrl-box">
          <div class="m-diy-btn m-box-col m-box-center m-box-center-a"></div>
        </div>
      </div>
      <header class="weibo-top m-box">
        <div class="m-avatar-box m-box-center" v-if="item.user">
          <div class="m-img-box" v-bind:to="'/profile/' + item.user.id">{{item.user.screen_name}}</div>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
export default {
  name: "weibo",
  props: ["item"]
};
</script>

<style lang="less" scoped>
</style>
