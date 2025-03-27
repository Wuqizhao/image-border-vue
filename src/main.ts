import { createApp } from "vue";
import "./style.less";
import App from "./App.vue";
import { createPinia } from "pinia";
// pinia持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(ElementPlus);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.mount("#app");
