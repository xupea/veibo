<template>
  <div class="weibo-media-wraps">
    <component
      :is="'page-' + page_type"
      :item="item"
      :hidImg="hidImg"
      :payType="payType(payBitN)"
    ></component>
  </div>
</template>

<script>
const components = {};
const supportedTypes = [
  "article",
  "video",
  "webpage",
  "hongbao",
  "bigpic",
  "event",
  "story"
];
supportedTypes.forEach(
  type => (components["page-" + type] = () => import("./pages/" + "page-" + type))
);

export default {
  props: ["item", "hidImg", "vipType"],
  components,
  computed: {
    page_type: function() {
      let type = "webpage";
      if (this.item && this.item.type) {
        switch (this.item.type) {
          case "article":
          case "wenda":
          case "fangle":
            type = "article";
            break;
          case "video":
          case "live":
            type = "video";
            break;
          case "hongbao":
            type = "hongbao";
            break;
          case "bigPic":
            type = "bigpic";
            break;
          case "adFeedEvent":
            type = "event";
            break;
          case "story":
            type = "story";
            break;
          default:
            type = "webpage";
            break;
        }
      }
      return type;
    },
    payBitN: function() {
      let type = 0;
      if (this.vipType > 0)
        switch (this.item.type) {
          case "article":
            type = 2;
            break;
          case "wenda":
            type = 3;
            break;
          case "video":
            type = 4;
            break;
          case "live":
            type = 5;
            break;
          default:
            type = 0;
            break;
        }
      return type;
    }
  },
  methods: {
    payType: function(type) {
      const vipType = this.vipType;
      const len = parseInt(vipType, 10).toString(2).length;

      return parseInt(vipType, 10).toString(2)[len - type];
    }
  }
};
</script>
