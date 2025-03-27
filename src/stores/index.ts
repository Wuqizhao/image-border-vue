import { defineStore } from "pinia";
import type { LocalWaterMarkItem } from "../types";

export const useStore = defineStore("store", {
	state: () => {
		return {
			localWatermarks: [] as LocalWaterMarkItem[],
		};
	},
	actions: {
		addWatermark(data: LocalWaterMarkItem) {
			this.localWatermarks.push(data);
		},
	},
});
