import { ref } from "vue";
import { defineStore } from "pinia";
import type { Config, Img, LocalWaterMarkItem } from "../types";
import { ElMessage } from "element-plus";

import { deepClone, selectFile } from "../utils";
import type { Leafer } from "leafer-ui";

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

		async function resetStyle() {
			const cfg = (await import("../configs/小米徕卡")).default;
			if (cfg) {
				setConfig(cfg);
				ElMessage.success("重置样式成功~");
			}
		}

		const leafer = ref<null | Leafer>(null);

		function exportImg() {
			console.log("【exportImg】", img.value?.export);
			if (!leafer.value) {
				// ElMessage.error("找不到leafer实例！");
				console.log("111");
				return;
			}
			if (img.value?.export === undefined) {
				// ElMessage.error("请先设置导出配置！");
				console.log("222");
				return;
			}
			console.log("333");
			const {
				ext = "jpeg",
				quality = 1,
				name = "leafer_export",
			} = img.value?.export;

			console.log("【aaa】", `${name.split(".")[0]}.${ext}`, {
				screenshot: true,
				quality: ext === "png" ? 1 : quality,
			});
			leafer.value?.export(`${name.split(".")[0]}.${ext}`, {
				screenshot: true,
				quality: ext === "png" ? 1 : quality,
			});
		}

		async function addFile() {
			const files = await selectFile();
			console.log('[addfile files]',files);
			if (Array.isArray(files) && files.length > 0) {
				fileList.value.push(...files);

				// 当前没有图片，设置成第一张
				if (!curFile.value) {
					curFile.value = files[0];
				}
			}

			console.log('filelist',fileList.value);
		}

		return {
			localWatermarks,
			addWatermark,
			deleteLocalWatermark,
			config,
			setConfig,
			curFile,
			fileList,
			img,
			resetStyle,
			leafer,
			exportImg,
			addFile,
		};
	},
	{
		persist: true,
	}
);
