<template>
  <footer class="f-footer-ctrl">
    <div
      v-if="showRt"
      class="m-diy-btn m-box-center-a"
      v-on:click.stop.prevent="repost"
    >
      <i class="lite-iconf lite-iconf-report"></i>
      <h4>{{ 0 === item.reposts_count ? "转发" : item.reposts_count }}</h4>
    </div>
    <div class="m-diy-btn m-box-center-a" v-on:click.stop.prevent="comment">
      <i class="lite-iconf lite-iconf-comments"></i>
      <h4>{{ 0 === item.comments_count ? "评论" : item.comments_count }}</h4>
    </div>
    <div class="m-diy-btn m-box-center-a" v-on:click.stop.prevent="like">
      <i
        v-bind:class="{ 'lite-iconf-liked': liked, 'lite-iconf-like': !liked }"
      ></i>
      <h4>{{ 0 === like_counts ? "赞" : like_counts }}</h4>
    </div>
    <aside v-if="showTriangle" v-on:click="gomore">
      <i class="m-font m-font-dot-more"></i>
    </aside>
  </footer>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data: function() {
    return {
      liked: false,
      like_counts: 0
    };
  },
  props: ["item", "showTriangle"],
  created: function() {
    this.liked = this.item.liked;
    this.like_counts = this.item.attitudes_count;
  },
  watch: {
    item: function() {
      this.liked = this.item.liked;
      this.like_counts = this.item.attitudes_count;
    }
  },
  methods: {
    ...mapMutations(["setCurWeiboData"]),
    repost: function() {
      this.setCurWeiboData(this.item);
      this.$router.push({
        name: "repost",
        query: {
          id: this.item.id
        }
      });
    },
    comment: function() {
      this.item.comments_count
        ? (this.setCurWeiboData(this.item),
          this.$router.push({
            name: "detail",
            params: {
              id: this.item.id
            }
          }))
        : this.$router.push({
            name: "comment",
            query: {
              id: this.item.id
            }
          });
    },
    like: function() {
      var t = this,
        e = this.liked ? "api/attitudes/destroy" : "api/attitudes/create";
      this.$http
        .post(e, {
          id: this.item.id,
          attitude: "heart"
        })
        .then(
          function(e) {
            e.data && e.data.ok > 0
              ? (t.liked
                  ? ((t.like_counts -= 1), (t.liked = !1))
                  : ((t.like_counts += 1), (t.liked = !0)),
                (t.item.attitudes_count = t.like_counts),
                (t.item.liked = t.liked))
              : e.data.msg &&
                this.$emit("mvToast", {
                  type: "error",
                  text: e.data.msg
                });
          },
          function(t) {
            throw new Error(t);
          }
        );
    },
    showRt: function() {
      return !(this.item.visible && this.item.visible.type > 0);
    },
    gomore: function() {
      // TODO
    }
  }
};
</script>

<style lang="less" scoped>
.lite-iconf {
  font-family: litefont;
  font-size: 1.75rem;
  color: #fff;
}
.lite-iconf-report {
  color: rgba(40, 47, 60, 0.8);
  font-size: 1.125rem;
}
</style>
