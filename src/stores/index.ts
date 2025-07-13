import { ref } from "vue";
import { defineStore } from "pinia";
import type { Config, Img, LocalWaterMarkItem } from "../types";
import { ElMessage } from "element-plus";

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

		const config = ref<Config>();

		function setConfig(cfg: Config) {
			const a = deepClone(cfg);
			config.value = a;
		}

		const fileList = ref<Array<File>>([]);
		const curFile = ref<null | File>(null);
		if (fileList.value.length === 0) {
			curFile.value = null;
		}

		const img = ref<null | Img>(null);

		return {
			localWatermarks,
			addWatermark,
			deleteLocalWatermark,
			config,
			setConfig,
			curFile,
			fileList,
			img,
		};
	},
	{
		persist: true,
	}
);
