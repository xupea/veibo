<template>
  <div id="app" class="m-container-max">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@font-face {
  font-family: marvelfont;
  src: url(data:font/woff;base64,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)
    format("woff");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: litefont;
  src: url(https://h5.sinaimg.cn/m/weibo-lite/fonts/iconfont.00fda3c7.eot);
  src: url(https://h5.sinaimg.cn/m/weibo-lite/fonts/iconfont.00fda3c7.eot#iefix)
      format("embedded-opentype"),
    url(https://h5.sinaimg.cn/m/weibo-lite/fonts/iconfont.78eb594e.ttf)
      format("truetype"),
    url(https://h5.sinaimg.cn/m/weibo-lite/fonts/iconfont.53475cc3.woff)
      format("woff"),
    url(https://h5.sinaimg.cn/m/weibo-lite/img/iconfont.72a9f840.svg#icomoon)
      format("svg");
  font-weight: 400;
  font-style: normal;
}

input:focus {
  outline: 0;
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

label {
  vertical-align: middle;
}

.m-search {
  display: block;
  background: #e3e4e6;
  color: #939393;
  border-radius: 0.25rem;
  box-sizing: border-box;
  position: relative;

  .m-font {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.8125rem;
  }
}

.m-box {
  display: flex;
}

.m-box-center {
  display: flex;
  justify-content: center;
}

.m-box-col {
  flex: 1;
  width: 100%;
  display: block;
  min-width: 0;
}

.m-box-center-a {
  display: flex;
  align-items: center;
}

.m-font {
  font-family: marvelfont;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}

.m-font-arrow-down::before {
  content: "\E008";
}

.m-font-arrow-left::before {
  content: "\E017";
}

.m-font-search::before {
  content: "\E015";
}

.m-font-down::before {
  content: "\E011";
}

.m-text-cut {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-text,
.m-img-icon,
.main-link,
.sub-link {
  display: inline-block;
  vertical-align: middle;
}

.card {
  margin-bottom: 0.5625rem;

  .card-wrap {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    height: 100%;
  }
}

.m-panel {
  border-top-width: 1px;
  border-right-width: 0;
  border-bottom-width: 1px;
  border-left-width: 0;
  border-color: #e6e6e6;
  border-style: solid;
  background: #fff;
}

.m-tips {
  font-size: 0.875rem;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  position: relative;

  &.m-tips-tp {
    font-size: 0.75rem;

    .m-font {
      font-size: 1.125rem;
      vertical-align: middle;
    }

    .main-link {
      margin: 0 0 0 0.6875rem;
    }
  }
}

.m-tips-tp {
  color: #7c7c7c;
  background: 0 0;
}

.m-font-down-ani {
  transition: all 0.2s ease;

  &.up {
    transform: rotate(180deg);
  }
}

.m-img-box {
  display: inline-block;
  width: 100%;
}

.m-box-dir {
  flex-direction: column;
}

.m-text-box {
  h4 {
    font-size: 0.75rem;
    color: #636363;
    line-height: 1.5;
  }

  h3 {
    font-size: 1rem;
    color: #333;
    line-height: 1.4;
  }

  > * {
    margin: 0 0 0.375rem 0;
  }
}

.m-avatar-box .m-img-box {
  border-radius: 50%;
  position: relative;
}

.txt-margin {
  margin: 0 0 1rem 0;
}

.empty-bg {
  width: 100%;
  background-color: #e6e6e6;
  height: 0.375rem;
}

.width-min {
  width: 4.375rem;
}

.inline-block {
  display: inline-block;
}

.f-footer-ctrl {
  border-top-width: 0;
  height: 1.1rem;
  padding: 1rem 0.375rem 1rem 0;
  margin: 0 0.75rem;

  .m-diy-btn {
    color: rgba(40, 47, 60, 0.8);
    height: 100%;
    float: left;

    & + .m-diy-btn {
      margin-left: 1.6875rem;
    }

    h4 {
      font-size: 0.8125rem;
      display: inline-block;
      margin-top: 0;
      margin-left: 0.25rem;
    }
  }

  aside {
    float: right;
    color: rgba(40, 47, 60, 0.8);
  }
}

.f-more {
  letter-spacing: 0.1rem;
}
</style>
