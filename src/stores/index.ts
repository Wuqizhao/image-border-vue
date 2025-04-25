import { ref } from "vue";
import { defineStore } from "pinia";
import type { Config, LocalWaterMarkItem } from "../types";
import { ElMessage } from "element-plus";

import defaultWaterMark from "../configs/小米徕卡";
import { deepClone } from "../utils";

export const useStore = defineStore(
	"store",
	() => {
		const localWatermarks = ref<LocalWaterMarkItem[]>([]);

		function addWatermark(data: LocalWaterMarkItem) {
			localWatermarks.value.push(data);
		}

		function deleteLocalWatermark(name: string) {
			// 找到对应下标
			const index = localWatermarks.value.findIndex(
				(item) => item.name === name
			);
			if (index === -1) return false;
			localWatermarks.value.splice(index, 1);
			ElMessage.success(`本地配置【${name}】删除成功`);
			return true;
		}

		const config = ref<Config>(deepClone(defaultWaterMark));

		return {
			localWatermarks,
			addWatermark,
			deleteLocalWatermark,
			config,
		};
	},
	{
		persist: true,
	}
);
