import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
	server: {
		host: "0.0.0.0", // 允许外部访问
		proxy: {
			"/img": {
				target: "http://api.lsfd.asia",
				changeOrigin: true,
				rewrite: (path) =>
					path.replace(/^\/img/, "/public/index.php/common/proxy_img"),
			},
		},
	},
	plugins: [vue(), vueDevTools()],
	// 配置别名
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
