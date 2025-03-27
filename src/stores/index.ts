import { ref } from "vue";
import { defineStore } from "pinia";
import type { LocalWaterMarkItem } from "../types";

export const useStore = defineStore("store", () => {
	const localWatermarks = ref<LocalWaterMarkItem[]>([])

	function addWatermark(data: LocalWaterMarkItem) {
		localWatermarks.value.push(data);
	}

	return {
		localWatermarks,
		addWatermark
	}
}, {
	persist: true

});