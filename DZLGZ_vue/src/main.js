// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// Register the necessary components with ECharts
use([
  CanvasRenderer,
  GraphChart,
  TooltipComponent,
  LegendComponent
]);
// 解决跨域问题
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true; // 全局设置withCredentials为true
// export { axios }; // 导出配置好的axios实例供其他地方使用

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
});
