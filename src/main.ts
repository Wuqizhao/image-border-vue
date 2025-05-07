import { createApp } from "vue";
import "./style.less";
import App from "./App.vue";
import { createPinia } from "pinia";
// pinia持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入中文语言包
import { zhCn } from "element-plus/es/locales.mjs";
import "uno.css";

import router from "./routers";

const app = createApp(App);
app.use(router);
app.use(ElementPlus, {
	locale: zhCn,
});
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.mount("#app");
