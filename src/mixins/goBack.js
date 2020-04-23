export default {
  methods: {
    goBack() {
      const { history } = window;
      if (history && history.length && history.length <= 1) {
        this.$router.push({ path: "/" });
      } else this.$router.go(-1);
    },
  },
};
