import axios from "axios";
import Vue from "vue";
// const isDev = Boolean(
//     "localhost" === window.location.hostname ||
//       "[::1]" === window.location.hostname ||
//       window.location.hostname.match(
//         /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
//       )
//   )

// const env = isDev ? "development" : "production";

// axios.defaults.withCredentials = true;
// axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// axios.defaults.headers.common["MWeibo-Pwa"] = "1";
// axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const deleteEmptyProps = (obj) => {
  for (const prop in obj) 0 === obj[prop] || obj[prop] || delete obj[prop];
};

export default () => {
  // axios.defaults.baseURL = `${window.location.protocol}//m.weibo.cn`
  axios.defaults.baseURL = "http://180.76.51.7";
  Vue.prototype.$http = axios;

  axios.interceptors.request.use(
    (config) => {
      const { data, params } = config;

      if (config.method === "get") {
        var i =
          +("standalone" in window.navigator && window.navigator.standalone) ||
          "";
        if (params) {
          params.standalone = i;
          deleteEmptyProps(params);
        } else {
          if (i) config.params = { standalone: i };
        }
      }

      if (data) {
        deleteEmptyProps(data);

        var screen = `screen:${window.screen.width}x${window.screen.height}`;

        if (data.append) {
          data.append("st", this.$store.state.config.config.st);
          data.append("_spr", screen);
        } else {
          data.st = this.$store.state.config.config.st;
          data._spr = screen;
          config.data = JSON.stringify(data);
        }
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      const { status, data } = response;

      if (status >= 400) {
        return;
      }

      if (data) {
        console.log(data)
      }

      return response;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};
