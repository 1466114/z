import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
Vue.config.productionTip = false;
import axios from "axios";
Vue.prototype.Axios = axios;
import * as echarts from "echarts";
Vue.prototype.echarts = echarts;
import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
