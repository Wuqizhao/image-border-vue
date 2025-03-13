import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0", // 允许外部访问
	},
	plugins: [vue()],
	// 配置别名
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
