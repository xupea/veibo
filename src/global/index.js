import Vue from "vue";

export default () => {
  const componentsContext = require.context("./", false, /\w+\.vue$/);

  componentsContext.keys().forEach((component) => {
    // 组件配置信息
    const componentConfig = componentsContext(component).default;
    if (/.vue$/.test(component)) {
      Vue.component("mv-" + componentConfig.name, componentConfig);
    } else {
      Vue.prototype[`$${componentConfig.name}`] = componentConfig;
    }
  });

//   const directivesContext = require.context("./", false, /\w+\.vue$/);

//   componentsContext.keys().forEach((component) => {
//     // 组件配置信息
//     const componentConfig = componentsContext(component).default;
//     if (/.vue$/.test(component)) {
//       Vue.component("mv-" + componentConfig.name, componentConfig);
//     } else {
//       Vue.prototype[`$${componentConfig.name}`] = componentConfig;
//     }
//   });
};
