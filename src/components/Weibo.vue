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
          <router-link class="m-img-box" v-bind:to="'/profile/' + item.user.id">
            <img v-bind:data-img="item.user.profile_image_url" v-if="hidImg" />
            <img v-bind:src="item.user.profile_image_url" v-else />
          </router-link>
        </div>
        <div class="m-box-dir m-box-col m-box-center">
          <div class="m-text-box" v-if="item.user">
            <router-link v-bind:to="'/profile/' + item.user.id">
              <h3 class="m-text-cut">
                {{ item.user.screen_name }}
                <span class="c-text-remark" v-if="item.user.remark">
                  {{
                  "(" + item.user.remark + ")"
                  }}
                </span>
                <weibo-icon v-bind:user="item.user"></weibo-icon>
              </h3>
            </router-link>
            <h4 class="m-text-cut">
              <span class="time">{{ item.created_at }}</span>
              <span class="from" v-if="item.source">
                {{
                " 来自 " + item.source
                }}
              </span>
              <span class="time" v-if="item.edit_count && item.edit_count > 0">已编辑</span>
            </h4>
          </div>
        </div>
      </header>
    </div>
    <article class="weibo-main">
      <div class="card-wrap">
        <div
          class="m-tips tips-pos"
          v-if="item.report_info"
          v-bind:class="{
            'm-tips-ltyellow': 'yellow' === tipsColor(item.mlevel),
            'm-tips-ltblue': 'blue' === tipsColor(item.mlevel),
          }"
          v-on:click.stop="toTips(item.report_info.url)"
        >
          <img class="tip-icon" v-if="'yellow' === tipsColor(item.mlevel)" />
          <img class="tip-icon" v-if="'blue' === tipsColor(item.mlevel)" />
          {{ item.report_info.text }}
        </div>

        <div class="weibo-og" v-on:click="getBlogLink(item, $event)">
          <div class="weibo-text" ahref v-html="item.text"></div>
          <weibo-media v-bind:item="item" v-bind:hidImg="hidImg"></weibo-media>
        </div>
      </div>
      <div
        class="weibo-rp"
        v-if="item.retweeted_status"
        v-on:click="getBlogLink(item.retweeted_status, $event)"
      >
        <div class="card-wrap" v-if="item.retweeted_status.report_info">
          <div
            class="m-tips tips-pos"
            v-bind:class="{
              'm-tips-ltyellow':
                'yellow' === tipsColor(item.retweeted_status.mlevel),
              'm-tips-ltblue':
                'blue' === tipsColor(item.retweeted_status.mlevel),
            }"
            v-on:click.stop="toTips(item.retweeted_status.report_info.url)"
          ></div>
          <div class="weibo-text" v-if="item.user">
            <span
              v-if="!item.retweeted_status.deleted &&
                            item.retweeted_status.user"
            >
              <router-link
                v-bind:to="'/profile/'+item.retweeted_status.user.id"
              >{{ '@' + item.retweeted_status.user.screen_name}}</router-link>
            </span>
          </div>
        </div>
      </div>
    </article>
    <weiboRCL v-if="showOgRCL" v-bind:item="item" v-bind:showTriangle="showTriangle"></weiboRCL>
  </div>
</template>

<script>
import weiboIcon from "@/components/WeiboIcon.vue";
import weiboMedia from "@/components/WeiboMedia.vue";
import weiboRCL from "@/components/WeiboRCL.vue";

export default {
  name: "weibo",
  props: ["item", "hidImg", "showTriangle", "showOgRCL", "showRpRCL"],
  methods: {
    getBlogLink: function(task, event) {
      var context = this;
      /** @type {string} */
      var u = window.navigator.userAgent.toLowerCase();
      /** @type {string} */
      var o = "sinaweibo://detail?mblogid=".concat(task.id);
      /** @type {string} */
      var restv1question = ""
        .concat(context.$http.defaults.baseURL, "/detail/")
        .concat(task.id);
      /** @type {string} */
      var url = u.indexOf("weibo") > -1 ? o : restv1question;
      var ele = event.target;
      if (
        ((ele &&
          ((ele.className && ele.className.indexOf("weibo-text") > -1) ||
            ele.className.indexOf("m-auto-list") > -1 ||
            ele.className.indexOf("weibo-media-wraps") > -1)) ||
          (ele.parentNode &&
            ele.parentNode.className &&
            ele.nodeName &&
            "weibo-text" === ele.parentNode.className &&
            "a" !== ele.nodeName.toLocaleLowerCase()) ||
          ("weibo-rp" === ele.parentNode.className &&
            "a" !== ele.nodeName.toLocaleLowerCase()) ||
          ("weibo-og" === ele.parentNode.className &&
            "a" !== ele.nodeName.toLocaleLowerCase())) &&
        context.$route.params.id !== task.id &&
        !task.deleted &&
        task.user
      ) {
        var container = ele;
        for (
          ;
          "weibo-og" !== container.className &&
          "weibo-rp" !== container.className;

        ) {
          container = container.parentNode;
        }
        container.classList.add("m-active");
        setTimeout(function() {
          container.classList.remove("m-active");
          if (
            /micromessenger/.test(u) ||
            u.indexOf("qq/") > -1 ||
            u.indexOf("qzone") > -1 ||
            u.indexOf("weibo") > -1
          ) {
            /** @type {string} */
            window.location.href = url;
          } else {
            context.setCurWeiboData(task);
            context.$router.push({
              name: "detail",
              params: {
                id: task.id
              }
            });
          }
        }, 100);
      }
    },
    tipsColor: function(t) {
      return 1 === t || 128 === t ? "yellow" : 1024 === t ? "blue" : void 0;
    }
  },
  components: {
    weiboIcon,
    weiboMedia,
    weiboRCL
  }
};
</script>

<style lang="less" scoped>
.card9 .f-footer-ctrl .lite-iconf {
  cursor: pointer;
}
</style>
