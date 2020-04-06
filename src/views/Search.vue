<template>
  <div>
    <div class="ntop-nav">
      <div class="m-box-center-a">
        <div class="nt-box-col m-box-center-a">
          <div class="nt-left" v-on:click="goBack">
            <i class="m-font m-font-arrow-left"></i>
          </div>
          <div class="m-box-col m-box-center-a nt-sbox">
            <form action="." class="nt-search">
              <i class="m-font m-font-search"></i>
              <input type="search" placeholder="大家都在搜" />
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="card m-panel card16">
      <div class="card-wrap">
        <div class="card-main"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack: function() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
.ntop-nav {
  height: 44px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);

  > .m-box-center-a {
    height: 100%;
    box-sizing: border-box;
    padding: 0 0.625rem;
  }
}

.nt-box-col {
  flex: 1;
}

.nt-left {
  padding-right: 12px;
  cursor: pointer;

  .m-font {
    color: #606060;
    font-weight: 700;
  }
}

.nt-sbox {
  height: 28px;
  border-radius: 15px;
  background-color: #e3e4e6;
}

.nt-search {
  position: relative;
  width: 100%;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;

  .m-font-search {
    padding-left: 10px;
    padding-right: 8px;
    color: #8e8e93;
  }

  input {
    background-color: transparent;
    border: 0 none;
    font-size: 0.875rem;
    color: #333;
    width: 100%;
    margin-right: 2rem;
  }
}
</style>
