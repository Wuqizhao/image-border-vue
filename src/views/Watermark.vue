<template>
	<div class="box">
		<LeaferCanvas />

		<div class="config-box">
			<ConfigView />
			<el-backtop :right="10" :bottom="100" />
		</div>

		<!-- 批量导出 -->
		<el-dialog
			title="批量导出"
			v-model="batchExportVisible"
			style="max-width: 95%; width: fit-content; min-width: 300px">
			<el-table :data="fileList" style="width: 100%">
				<el-table-column prop="name" label="文件名"></el-table-column>
				<el-table-column prop="size" label="文件大小">
					<template #default="scope">
						{{ (scope.row.size / 1024 / 1024).toFixed(2) }}M
					</template>
				</el-table-column>
			</el-table>

			<template #footer>
				<el-button type="primary">全部导出</el-button>
			</template>
		</el-dialog>

		<!-- 保存配置 -->
		<!-- <el-dialog
			title="保存配置"
			v-model="saveConfigDialog.show"
			style="width: 500px; max-width: 90%">
			<el-form label-width="80px">
				<el-form-item label="配置名称">
					<el-input
						v-model="saveConfigDialog.name"
						placeholder="请输入配置名称"
						clearable></el-input>
				</el-form-item>
				<el-form-item label="配置描述">
					<el-input
						v-model="saveConfigDialog.config"
						placeholder="请输入配置描述"
						disabled
						type="textarea"
						:rows="20"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="primary" @click="saveConfig">保存</el-button>
			</template>
		</el-dialog> -->

		<!-- 选择模板抽屉 -->
		<el-drawer
			v-model="showConfigDrawer"
			:with-header="false"
			title="模板列表"
			:direction="isMobile() ? 'btt' : 'rtl'"
			size="50%">
			<h3
				style="
					display: flex;
					justify-content: space-between;
					align-items: center;
				">
				<b>样式模板</b>
				<el-button
					:text="true"
					@click="showConfigDrawer = false"
					style="font-size: 1.5rem"
					>&times;</el-button
				>
			</h3>
			<HorizontalScroll style="gap: 10px">
				<div
					v-for="(item, index) in watermarks"
					:key="item.name"
					style="
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						margin-top: 1rem;
						gap: 20px;
					">
					<el-image
						:width="240"
						:height="180"
						fit="cover"
						@click="curWatermarkIndex = index"
						style="
							width: 240px;
							max-height: 180px;
							border: 1px solid #ccc;
							cursor: pointer;
							box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.3);
						"
						:style="{
							border:
								index === curWatermarkIndex
									? '2px solid gray'
									: '2px solid #ccc',
						}"
						:src="item?.url">
						<template #placeholder>
							<el-icon>
								<Loading
									style="
										width: 48px;
										height: 48px;
										animation: rotate 1s linear infinite;
									"
									>加载中...
								</Loading>
							</el-icon>
						</template>
						<template #error>
							<div
								class="flex-center"
								style="width: 240px; height: 180px; color: #ccc">
								图片加载失败
							</div>
						</template>
					</el-image>

					<b
						:style="{ color: index === curWatermarkIndex ? 'salmon' : 'black' }"
						>{{ item.name }}</b
					>
					<el-button
						:text="true"
						type="danger"
						v-if="item?.is_local"
						@click="deleteWatermark(item.name, $event)"
						>删除</el-button
					>
				</div>
			</HorizontalScroll>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import ConfigView from "../components/ConfigView.vue";
import { reactive, ref, watch, provide, onMounted } from "vue";
import {
	getWatermarkList,
	getSupportedFonts,
	defaultImgValue,
} from "../assets/tools";
import { deepClone, isMobile } from "../utils";
import { ElMessage, ElNotification } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import type { Config, Img, WatermarkListItem } from "../types";
import HorizontalScroll from "../components/HorizontalScroll.vue";
import { useStore } from "../stores";
const store = useStore();

import "@leafer-in/export"; // 引入导出元素插件
import "@leafer-in/find"; // 查找插件
import "@leafer-in/editor"; // 引入编辑器插件
import LeaferCanvas from "../components/LeaferCanvas.vue";

// 画布
const showConfigDrawer = ref(false);

const img = reactive<Img>({ ...defaultImgValue });
const fileList = ref<File[]>([]);

const watermarks = ref<WatermarkListItem[]>(getWatermarkList());
const curWatermarkIndex = ref<number>(0);
const batchExportVisible = ref(false);

provide("img", img);
function deleteWatermark(name: string, event: Event) {
	// 阻止事件冒泡
	event.stopPropagation();

	if (store.deleteLocalWatermark(name)) {
		watermarks.value = getWatermarkList();
		curWatermarkIndex.value = 0;
	}
}

// 监听
watch(
	curWatermarkIndex,
	(newIndex) => {
		importConfig(newIndex);
	},
	{
		immediate: true,
	}
);

function importConfig(val: number): void {
	// 获取对应的水印
	const watermark: WatermarkListItem | undefined = watermarks.value
		.filter((item) => item.index == val)
		.shift();

	if (watermark === undefined) {
		ElMessage.error("未找到匹配的水印配置！");
		return;
	}

	const filename = watermark.is_local
		? watermark.config_name
		: watermark.config;
	let configPromise = null;
	switch (filename) {
		case "小米徕卡3":
			configPromise = import("../configs/小米徕卡3");
			break;
		default:
			configPromise = import("../configs/小米徕卡");
			break;
	}
	configPromise
		.then((res) => {
			// 内置配置
			const config_value = deepClone(res.default as Config);

			if (watermark.is_local) {
				let local_value = JSON.parse(watermark.config) as Config;
				Object.assign(config_value, local_value);
			}

			store.setConfig(config_value);
			ElMessage.success(`配置【${watermark.name}】导入成功~`);
		})
		.catch((err) => {
			ElNotification.error({
				title: "导入水印配置失败",
				message: err.message,
			});
		});
}

function loadFonts(fonts: string[]) {
	// 1. 创建<style>元素
	const style = document.createElement("style");
	style.id = "dynamic-fonts";

	// 2. 生成CSS规则
	let css = "";
	fonts.reverse().forEach((font) => {
		const fontName = font.replace(/(\.ttf|\.TTF)$/, "");
		css += `@font-face {
			font-family: '${fontName}';
			src: url('fonts/${font}');
		}\n`;
	});

	style.textContent = css;
	document.head.appendChild(style);
}

onMounted(() => {
	loadFonts(getSupportedFonts());
});
</script>

<style lang="less" scoped>
.box {
	display: flex;
	justify-content: space-between;
	gap: 20px;
	width: 100%;
	height: 100vh;
}

.config-box {
	padding: 10px 15px;
	width: 600px;
	display: flex;
	flex-direction: column;
	height: 100vh;
	box-shadow: 0px 0px 15px gainsboro;
	border-radius: 10px 0 0 10px;
	overflow: hidden;

	.tabs-container {
		flex: 1;
		overflow: hidden;

		.el-tabs {
			overflow: hidden;
			height: 100%;
			scrollbar-width: thin;
			scrollbar-color: transparent transparent;

			.el-tab-pane {
				animation: k2 0.3s ease-in-out;
			}

			:deep(.el-tabs__content) {
				overflow-y: auto;
			}

			:deep(.el-tabs__item) {
				padding: 40px 10px;
				display: flex;
				flex-direction: column;
				font-size: 16px;
				align-items: center;
				justify-content: center;
				gap: 10px;
			}

			.el-tab-pane {
				height: auto;
			}
		}
	}

	h3 {
		padding-bottom: 10px;
	}
}

.img-list {
	padding: 0px;
	gap: 5px;
	display: flex;
	align-items: center;
	flex-shrink: 1;
	width: 100%;
	position: sticky;
	bottom: 0px;
	left: 0;
	z-index: 1;
	background-color: #fff;

	.el-image {
		cursor: pointer;
		border: 2px solid transparent;
		border-radius: 10%;
		min-width: 64px;
		width: 64px;
		height: 64px;

		&::before {
			content: attr(data-index);
			color: #fff;
			position: absolute;
			font-size: 12px;
			padding: 0 5px;
			top: 8px;
			left: 0px;
			width: 20px;
			height: 20px;
		}

		&:hover {
			border: 2px solid gainsboro;
			transform: scale(1.1);
			transition-duration: 0.5s;
		}
	}

	.img-item {
		position: relative;
		vertical-align: center;
		line-height: 0;

		.delete-icon {
			position: absolute;
			top: 5px;
			right: 5px;
			color: #fff;
			cursor: pointer;
			opacity: 0.7;
			font-size: 14px;

			&:hover {
				opacity: 1;
			}
		}
	}
}

@media screen and (max-width: 768px) {
	.box {
		gap: 5px;
		flex-direction: column;
	}

	.config-box {
		width: 100%;
		background-color: #fff;
		border-radius: 10px 10px 0px 0px;
		animation: flow 1s;
		flex: 1;

		:deep(.el-tabs__nav) {
			min-width: 100%;
			justify-content: space-around;
		}

		:deep(.el-tabs__item) {
			flex-direction: row;
			padding: 0px 10px !important;

			> span {
				display: none;
			}
		}
	}
}

@keyframes rotate {
	0% {
		transform: rotateZ(360deg);
	}
}

@keyframes flow {
	from {
		transform: translateY(50%);
	}
}
</style>
