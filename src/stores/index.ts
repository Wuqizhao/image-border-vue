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

		async function resetStyle(name = "小米徕卡") {
			let cfg = null;
			switch (name) {
				case "小米徕卡3":
					cfg = (await import("../configs/小米徕卡3")).default;
					break;
				case "样式1":
					cfg = (await import("../configs/样式1")).default;
					break;
				case "单图标":
					cfg = (await import("../configs/单图标")).default;
					break;
				default:
					cfg = (await import("../configs/小米徕卡")).default;
					break;
			}

			if (cfg) {
				config.value = undefined;
				setConfig(cfg);
				ElMessage.success(`【${name}】样式导入成功~`);
			}
		}

		const leafer = ref<null | Leafer>(null);

		function exportImg() {
			// console.log("【exportImg】", img.value?.export);
			if (!leafer.value) {
				ElMessage.error("导出失败：没有绘制的图片");
				return;
			}
			if (img.value?.export === undefined) {
				ElMessage.error("请先设置导出配置！");
				return;
			}

			const {
				ext = "jpeg",
				quality = 1,
				name = "leafer_export",
			} = img.value?.export;

			leafer.value?.export(`${name.split(".")[0]}.${ext}`, {
				screenshot: true,
				quality: ext === "png" ? 1 : quality,
			});
		}

		async function addFile() {
			const files = await selectFile();
			// console.log("[addfile files]", files);
			if (Array.isArray(files) && files.length > 0) {
				fileList.value.push(...files);

				// 当前没有图片，设置成第一张
				if (!curFile.value) {
					curFile.value = files[0];
				}
			}

			// console.log("filelist", fileList.value);
		}

		function clearFileList() {
			fileList.value = [];
			curFile.value = null;
		}

		function drawNextImage() {
			// console.log("drawNextImage");
			if (fileList.value.length === 0) {
				ElMessage.error("请先添加图片！");
				return;
			}
			// 获取当前的图片的index
			const curIndex = fileList.value.findIndex(
				(item) => item.name === curFile.value?.name
			);

			if (!curFile.value || curIndex === -1) {
				ElMessage.error("当前图片不在列表中，使用第一张！");
				// 切换成第一张
				curFile.value = fileList.value[0];
				return;
			}

			// 循环切换到下一张
			curFile.value = fileList.value[(curIndex + 1) % fileList.value.length];
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
			clearFileList,
			drawNextImage,
		};
	},
	{
		persist: true,
	}
);
