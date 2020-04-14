<template>
  <div>
    <div
      v-if="item.pics"
      class="weibo-media-wraps weibo-media f-media"
      v-bind:class="'media-' + type"
    >
      <ul v-if="item.pics.length > 0" class="m-auto-list">
        <li
          v-for="(pic, index) in item.pics"
          v-bind:key="index"
          v-bind:class="'m-auto-box' + cols"
        >
          <div class="m-img-box m-imghold-4-3">
            <span class="feed-mark live-mark" v-if="videoSrc">
              <i class="lite-iconf lite-iconf-live"></i>
            </span>
            <span
              class="feed-mark"
              v-else-if="isLongImg(pic) || isAniImg(pic.url)"
              >{{ isAniImg(pic.url) ? "动图" : "长图" }}</span
            >

            <img
              v-if="hidImg"
              class="f-bg-img"
              v-bind:data-img="pic.url"
              v-on:click.prevent.stop="thumbnails(pic, index, item.pics)"
            />
            <img
              v-else
              class="f-bg-img"
              v-bind:src="pic.url"
              v-on:click.prevent.stop="thumbnails(pic, index, item.pics)"
            />

            <span
              class="pay-icon"
              v-if="
                item.mblog_vip_type > 0 &&
                  ((index > 0 && payType() > 0) ||
                    (1 == item.pics.length && payType() > 0))
              "
            >
              <img
                src="https://h5.sinaimg.cn/upload/1087/691/2018/05/04/timeline_card_v.png"
              />
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="item.page_info" class="weibo-media f-media">
      <small-page
        v-bind:item="item.page_info"
        v-bind:hidImg="hidImg"
        v-bind:vipType="item.mblog_vip_type"
      ></small-page>
    </div>

    <div class="weibo-media f-media">
      <!-- <small-page v-bind:item="item.page_info" v-bind:vipType="item.mblog_vip_type"></small-page> -->
    </div>
  </div>
</template>
<script>
import smallPage from "@/components/SmallPage.vue";
export default {
  props: ["item", "hidImg"],
  components: {
    smallPage
  },
  computed: {
    videoSrc: function() {
      return "";
    },
    type: function() {
      return "b";
    },
    cols: function() {
      return !this.item.pics ||
        (1 !== this.item.pics.length &&
          2 !== this.item.pics.length &&
          4 !== this.item.pics.length)
        ? "3"
        : "2";
    },
    styles: function() {
      var t = 150,
        e = this.item.pics[0].geo.width,
        i = this.item.pics[0].geo.height;
      return {
        singleImg: {
          width: "".concat(e > t ? t / 16 : e / 16, "rem"),
          height: "".concat(e > t ? (t * i) / e / 16 : i / 16, "rem")
        }
      };
    }
  },
  methods: {
    isLongImg: function(t) {
      var e = t.geo.width,
        i = t.geo.height;
      return i > 3 * e || (i > 100 && e > 4 * i);
    },
    isAniImg: function(t) {
      var e = new URL(t);
      return /\.gif$/.test(e.pathname);
    },
    thumbnails: function(t, e, i) {
      var s = "sinaweibo://detail?mblogid=".concat(
        this.item.id,
        "&luicode=20000061"
      );
      if (this.item.mblog_vip_type > 0 && 1 === this.item.mblog_vip_type) {
        this.a.start({
          scheme: s
        });
      } else {
        var o = t.target || t.srcElement,
          a = this.formatThumbItem(o, i);
        this.$emit("mvGallery", e, a);
      }
    },
    formatThumbItem: function(t, e) {
      var i = this.closest(t, function(t) {
          return t.classList.contains("weibo-media");
        }),
        s = e.map(function(t, e) {
          var s = {
            src: t.large.url,
            w: t.large.geo.width || 500,
            h: t.large.geo.height || 500,
            msrc: t.url,
            el: i.getElementsByClassName("f-bg-img")[e]
          };
          return (
            t.videoSrc &&
              Object.assign(s, {
                videoSrc: t.videoSrc
              }),
            s
          );
        });
      return s;
    },
    closest: function(t, e) {
      return t && (e(t) ? t : this.closest(t.parentNode, e));
    },
    payType: function() {
      var t = this.item.mblog_vip_type,
        e = parseInt(t, 10).toString(2).length;
      return parseInt(t, 10).toString(2)[e - 1];
    }
  }
};
</script>
