<template>
  <i v-if="icon" class="m-icon" v-bind:class="icon"></i>
</template>
<script>
export default {
  props: ["user"],
  computed: {
    icon: function() {
      return this.user.mbrank ? "m-icon-vipl".concat(this.user.mbrank) : 0;
    }
  }
};
</script>