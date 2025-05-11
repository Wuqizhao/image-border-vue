import { createRouter, createWebHistory } from "vue-router";

// 定义路由类型
const routes = [
	{
		path: "/",
		name: "watermark",
		component: () => import("../views/Watermark.vue"),
	},
	{
		path: "/grid",
		name: "grid",
		component: () => import("../views/Grid.vue"),
	},
	{
		path: "/handwritting",
		name: "handwritting",
		component: () => import("../views/Handwritting.vue"),
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/",
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
