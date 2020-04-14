<template>
  <a
    v-on:click="
      $router.push({
        path: '/search?containerid=231583'
      })
    "
  >
    <aside>
      <label class="m-search">
        <i class="m-font m-font-search"></i>
        <div class="m-text-cut">{{ this.getHotword }}</div>
      </label>
    </aside>
  </a>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(["hotword"]),
    getHotword: function() {
      return this.hotword.length
        ? "大家都在搜：".concat(this.hotword)
        : "搜索微博、找人";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.m-search {
  margin: 0.56rem 0.5rem;
  color: #bdbdbd;
  border-radius: 1rem;

  .m-font {
    left: 0.5rem;
  }
}

.m-font {
  font-family: marvelfont;
  display: inline-block;
}

.m-font-search::before {
  content: "\E015";
}

.m-search div {
  border: none;
  background: #fff;
  height: 1.75rem;
  line-height: 1.75rem;
  font-size: 0.8125rem;
  padding: 0 0 0 2.1875rem;
  border-radius: 1rem;

  padding-left: 1.875rem !important;
  background-color: #ebebec !important;
  font-size: 0.875rem !important;
}

.m-text-cut {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
