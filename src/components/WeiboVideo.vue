<template>
  <div ref="video" class="card-video" v-if="showVideo">
    <div
      class="mwb-video mwbv-layer"
      v-bind:class="{
        huawei: huaWei,
        safari: safariStyle,
        qq: androidQQ,
        'mwbv-play': showPlay,
        'mwbv-control-pause': !showPlay,
        'mwbv-control-play': showPlay,
        'mwbv-control-mute': vMute,
        'mwbv-control': !endPlay && dragPro,
        'mwbv-replay': endPlay,
        'mwbv-loading': loading
      }"
    >
      <video
        v-if="iosQQ"
        ref="media"
        class="mwbv-video"
        v-bind:src="src"
        webkit-playsinline
        playsinline="true"
        x-webkit-airplay="true"
        v-on:click="pushBtn"
        v-on:timeupdate="getVideoTime"
        v-on:touchmove.prevent.stop
      ></video>
      <video
        v-else
        ref="media"
        class="mwbv-video"
        v-bind:src="src"
        webkit-playsinline
        playsinline="true"
        x-webkit-airplay="true"
        raw-controls
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portrait"
        v-on:click="pushBtn"
        v-on:timeupdate="getVideoTime"
        v-on:touchmove.prevent.stop
      ></video>
      <button class="mwbv-play-button" v-on:click="pushBtn">
        <span class="mwbv-icon"></span>
      </button>
      <button class="mwbv-replay-button" v-on:click="pushBtn">
        <span class="mwbv-icon"></span>
        <span class="mwbv-text">重播</span>
      </button>
      <div class="mwbv-control-bar">
        <div class="m-box">
          <button class="mwbv-play-control" v-on:click="pushBtn">
            <span class="mwbv-icon"></span>
          </button>
          <div class="mwbv-current-time">{{ vCTime }}</div>
          <div ref="outBar" class="mwbv-progress-control m-box-col">
            <div v-if="pc" ref="bar" class="progress-bar">
              <div
                class="progress-bar-cache"
                v-bind:style="{ width: 100 * vCacheW + '%' }"
              ></div>
              <div
                class="progress-bar-inner"
                v-bind:style="{ width: 100 * vw + '%' }"
              >
                <span class="progress-handle"></span>
              </div>
            </div>
            <div
              v-else
              ref="bar"
              class="progress-bar"
              v-on:touchstart.prevent.stop
              v-on:touchmove="moveProgress"
              v-on:touchend.prevent="upProgress"
            >
              <div
                class="progress-bar-cache"
                v-bind:style="{ width: 100 * vCacheW + '%' }"
              ></div>
              <div
                class="progress-bar-inner"
                v-bind:style="{ width: 100 * vw + '%' }"
              >
                <span class="progress-handle"></span>
              </div>
            </div>
          </div>
          <div class="mwbv-remaining-time">{{ vDTime }}</div>
          <button
            class="mwbv-volume-control"
            v-bind:class="{ ios9Style: ios9Flag }"
            v-on:click="pushVolumn"
          >
            <span class="mwbv-icon"></span>
          </button>
        </div>
      </div>
      <div class="mwbv-close-content" v-on:click="vClose"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped></style>
