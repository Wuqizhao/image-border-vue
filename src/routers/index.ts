import { createRouter, createWebHistory } from "vue-router";

// 定义路由类型
const routes = [
	{
		path: "/",
		name: "watermark",
		component: () => import("../views/Watermark.vue"),
	},
	{
		path: "/fabric",
		name: "watermark2",
		component: () => import("../views/Fabric.vue"),
	},
	{
		path: "/grid",
		name: "grid",
		component: () => import("../views/Grid.vue"),
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
