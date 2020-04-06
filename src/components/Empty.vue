<template>
  <div class="wb-item-wrap">
    <div class="wb-item" v-for="item in [1,2,3,4,5]" :key="item">
      <div class="card m-panel card9 f-weibo">
        <div class="card-wrap">
          <header class="weibo-top m-box">
            <div class="m-avatar-box">
              <a href="javascript:;" class="m-img-box anim-load"></a>
            </div>
            <div class="m-box-dir m-box-col">
              <div class="m-text-box">
                <h4 class="m-text-cut f-r"></h4>
                <h3 class="m-text-cut empty-bg width-min inline-block anim-load"></h3>
              </div>
            </div>
          </header>
          <article class="weibo-main">
            <div class="weibo-og">
              <p class="empty-bg txt-margin anim-load"></p>
              <p class="empty-bg txt-margin anim-load"></p>
              <p class="empty-bg txt-margin anim-load"></p>
              <p class="empty-bg txt-margin anim-load"></p>
              <p class="empty-bg txt-margin anim-load"></p>
            </div>
          </article>
          <footer class="f-footer-ctrl">
            <div class="m-diy-btn">
              <i class="lite-iconf lite-iconf-report"></i>
              <h4>转发</h4>
            </div>
            <div class="m-diy-btn">
              <i class="lite-iconf lite-iconf-comments"></i>
              <h4>评论</h4>
            </div>
            <div class="m-diy-btn">
              <i class="lite-iconf lite-iconf-like"></i>
              <h4>赞</h4>
            </div>
            <aside>
              <i class="f-more">...</i>
            </aside>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Empty"
};
</script>

<style lang="less" scoped>
.anim-load {
  animation: load 0.5s ease-out;
}

.wb-item-wrap {
  overflow: hidden;

  .card9.card {
    margin: 0;
  }
}

.f-weibo {
  .f-r {
    float: right;
  }

  .m-img-box {
    background-color: #e6e6e6;
  }

  .m-text-box {
    h4 {
      font-size: 0.6875rem;
    }
  }

  .weibo-top {
    .m-text-box {
      margin: 0.15rem 0 0.15rem 0.5rem;
    }
  }

  .weibo-main {
    &.weibo-og {
      font-size: 1rem;
    }
  }
}

.f-weibo.card9 {
  border-bottom: 1px solid #e6e6e6;

  .weibo-top {
    padding: 0 0 0 0.25rem;

    .m-img-box {
      width: 2rem;
      height: 2rem;
    }

    .m-text-box {
      h3 {
        font-size: 0.875rem;
      }
    }
  }

  .m-weibo-main {
    .weibo-og {
      padding: 0.75rem 0 0 0.25rem;
    }
  }

  .m-box-col {
    min-width: 0;
  }

  > .card-wrap {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }

  &.m-panel {
    border-top-width: 0;
  }
}

.card9 {
  > .card-wrap {
    padding-top: 0.9375rem;
  }

  .weibo-top {
    padding: 0 0.75rem;

    .m-img-box {
      width: 2.5rem;
      height: 2.5rem;
    }

    .m-text-box {
      margin-left: 0.75rem;

      h3 {
        font-size: 0.9375rem;
        margin: 0;
      }

      h4 {
        color: #939393;
      }
    }
  }

  .weibo-main {
    .weibo-og {
      font-size: 1.0625rem;
      color: #333;
      padding: 0.75rem;
    }
  }

  .f-footer-ctrl.lite-iconf {
    cursor: pointer;
  }
}

.card9.card {
  margin: 0 0 0.375rem 0;
}

.lite-iconf {
  font-family: litefont;
  font-size: 1.75rem;
  color: #fff;
}

.lite-iconf-comments,
.lite-iconf-like,
.lite-iconf-liked,
.lite-iconf-report,
.lite-iconf-share {
  color: rgba(40, 47, 60, 0.8);
  font-size: 1.125rem;
}

.lite-iconf-comments:before {
  content: "\E009";
}

.lite-iconf-report:before {
  content: "\E008";
}

.lite-iconf-like:before {
  content: "\E010";
}
</style>
