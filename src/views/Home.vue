<template>
  <div class="home">
    <top-bar />
  </div>
</template>

<script>
// @ is an alias to /src
import topBar from "@/components/TopBar.vue";

export default {
  name: "Home",
  components: {
    topBar
  }
};
</script>
