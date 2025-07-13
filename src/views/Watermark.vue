<template>
	<div class="box">
		<LeaferCanvas />
		<!-- <div id="canvasBox" @dragover.prevent @dragenter.prevent @drop="onDrop">
			<canvas class="leafer" v-show="curFile" ref="imgCanvas"></canvas>
			<el-empty
				description="点击添加图片~"
				v-show="!curFile" 
				@click="selectFile"></el-empty>

			<div class="download" v-show="showTools && fileList.length > 0">
				<Plus @click="selectFile(true)" />
				<Delete @click="removeImg" />
				<ArrowLeft v-if="fileList.length > 1" @click="prev" />
				<ArrowRight v-if="fileList.length > 1" @click="next" />
				<RefreshLeft @click="resetWatermark" />
				<Download @click="exportLeafer" />
			</div>
		</div> -->

		<div class="config-box">
			<ConfigView />
			<!-- <div class="tabs-container">
				<el-tabs
					v-model="activeName"
					:tab-position="isMobile() ? 'bottom' : 'right'"
					type="border-card">
					<el-tab-pane name="info">
						<template #label>
							<el-icon>
								<Files />
							</el-icon>
							<span>文件</span>
						</template>
						<h3>文件列表</h3>
						<HorizontalScroll class="img-list" style="margin-bottom: 20px">
							<el-button
								plain
								style="height: 64px; position: sticky; left: 0px; z-index: 1"
								>添加</el-button
							>
							<div
								class="img-item"
								v-for="(item, index) in enhancedFileList"
								:key="item.name"
								v-if="fileList.length">
								<el-image
									fit="cover"
									:src="item.url"
									@click="changeCurFile(fileList[index])"
									:data-index="index + 1">
								</el-image>
								<el-icon class="delete-icon" @click="removeImg(index)">
									<delete />
								</el-icon>
							</div>
						</HorizontalScroll>

						<ImageInfo :img="img" />

						<h3>辅助工具</h3>
						<el-form-item label="悬浮工具">
							<el-switch v-model="showTools"></el-switch>
						</el-form-item>
						<el-form-item label="辅助线">
							<b style="margin-left: 20px">水平中心线：</b>
							<el-switch v-model="auxiliaryLines.horizontalCenter"></el-switch>
							<b style="margin-left: 20px">垂直中心线：</b>
							<el-switch v-model="auxiliaryLines.verticalCenter"></el-switch>

							<b style="margin-left: 20px">水印水平中心线：</b>
							<el-switch
								v-model="auxiliaryLines.watermarkHorizontalCenter"></el-switch>
						</el-form-item>
						<el-form-item label="水印范围">
							<el-switch v-model="auxiliaryLines.watermarkRange"></el-switch>
						</el-form-item>

						<div style="padding: 10px 0px">
							<router-link to="/grid">
								<el-button>九宫格分割工具</el-button>
							</router-link>
						</div>
					</el-tab-pane>
					<el-tab-pane name="template">
						<template #label>
							<el-icon>
								<Notebook />
							</el-icon>
							<span>模板</span>
						</template>
						<h3>模板</h3>
						<el-form label-width="40px">
							<el-form-item label="样式">
								<el-select
									v-model="curWatermarkIndex"
									placeholder="请选择水印样式"
									v-if="!isMobile()"
									style="margin-bottom: 10px">
									<el-option
										v-for="(item, index) in watermarks"
										:key="index"
										:value="index"
										:label="item.name">
										<div
											style="
												display: flex;
												align-items: center;
												justify-content: space-between;
											">
											<b
												>{{ item.name
												}}<small style="color: gray">{{
													item.is_local ? "[本地]" : "[内置]"
												}}</small></b
											>
											<el-button
												v-if="item.is_local"
												type="danger"
												size="small"
												plain
												@click="deleteWatermark(item.name, $event)"
												>删 除</el-button
											>
										</div>
									</el-option>
								</el-select>

								<el-button @click="showConfigDrawer = true" plain type="primary"
									>模板(已选择：{{
										watermarks[curWatermarkIndex]["name"]
									}})</el-button
								>

								<div style="padding-top: 5px; width: 100%">
									<el-button @click="showConfigDialog">保存配置</el-button>
									<el-button plain @click="resetWatermark">重置样式</el-button>
									<el-button @click="handleDraw" :disabled="!curFile" plain
										>重绘</el-button
									>
								</div>
							</el-form-item>
							<el-form-item label="字体">
								<el-select
									:filterable="!isMobile()"
									v-model="config.font"
									clearable>
									<el-option
										v-for="(item, index) in getSupportedFonts()"
										:key="index"
										:label="item"
										:value="item"
										:style="{ fontFamily: item }"></el-option>
								</el-select>
								<p class="tips">仅支持部分字体！</p>
							</el-form-item>
							<el-button @click="print(config, img)" style="margin-left: 10px"
								>打印配置</el-button
							>
						</el-form>
					</el-tab-pane>
					<el-tab-pane name="watermark" :disabled="!curFile">
						<template #label>
							<el-icon>
								<EditPen />
							</el-icon>
							<span>编辑</span>
						</template>
						<div class="float-menu">
							<HorizontalScroll>
								<div
									v-for="item in renderMenuItems"
									class="float-menu-item"
									:class="item.component === curConfigComponent ? 'active' : ''"
									:key="item.value"
									@click="curConfigComponent = item.component">
									{{ item.label }}
								</div>
							</HorizontalScroll>
						</div>
						<component :is="curConfigComponent"></component>
					</el-tab-pane>
					<el-tab-pane name="picture" :disabled="!curFile">
						<template #label>
							<el-icon>
								<Cellphone />
							</el-icon>
							<span>边距</span>
						</template>
						<h3>水印边距</h3>
						<WatermarkPadding />
						<PaddingConfig />
					</el-tab-pane>
					<el-tab-pane name="custom-labels" :disabled="!curFile">
						<template #label>
							<el-icon>
								<PriceTag />
							</el-icon>
							<span>文本</span>
						</template>
						<CustomLabels />
					</el-tab-pane>
					<el-tab-pane name="custom-images" :disabled="!curFile">
						<template #label>
							<el-icon>
								<Picture />
							</el-icon>
							<span>图片</span>
						</template>
						<CustomImages />
					</el-tab-pane>
					<el-tab-pane name="export" :disabled="!curFile">
						<template #label>
							<el-icon>
								<FolderChecked />
							</el-icon>
							<span>导出</span>
						</template>
						<h3>导出配置</h3>
						<el-form label-width="70" style="margin-top: 10px">
							<el-form-item label="文件名">
								<el-input
									v-model="img.export.name"
									:disabled="!curFile"
									placeholder="留空则由浏览器决定"
									clearable></el-input>
							</el-form-item>
							<el-form-item label="格式">
								<el-radio-group v-model="img.export.ext">
									<el-radio value="jpeg">JPEG</el-radio>
									<el-radio value="png">PNG(支持透明背景，体积更大)</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="图片质量" v-show="img.export.ext === 'jpeg'">
								<el-slider
									v-model="img.export.quality"
									:min="0.01"
									:max="1"
									:step="0.01"
									show-tooltip
									:format-tooltip="(val) => (val * 100).toFixed(0) + '%'"
									show-input></el-slider>
								<p class="tips">推荐0.97，兼顾画质和文件大小。</p>
							</el-form-item>
							<el-form-item label="">
								<el-button
									type="primary"
									plain
									@click="download(imgCanvas, img)"
									:disabled="!curFile"
									>导出当前图片</el-button
								>
								<el-button
									v-show="fileList.length > 1"
									type="success"
									plain
									@click="batchExportVisible = true"
									>批量导出</el-button
								>
							</el-form-item>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</div> -->

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
import {
	reactive,
	ref,
	watch,
	provide,
	type Component,
	shallowRef,
	markRaw,
	onMounted,
	computed,
} from "vue";
import {
	print,
	getWatermarkList,
	getSupportedFonts,
	defaultExif,
	defaultImgValue,
} from "../assets/tools";
import {
	download,
	convertExposureTime,
	getImageSrc,
	deepClone,
	isMobile,
	caculateCanvasSize,
	getLocationText,
	replaceZ,
} from "../utils";
import { ElMessage, ElNotification } from "element-plus";
import {
	Files,
	EditPen,
	FolderChecked,
	Cellphone,
	Picture,
	Notebook,
} from "@element-plus/icons-vue";
import {
	Delete,
	Loading,
	Download,
	Plus,
	ArrowLeft,
	ArrowRight,
	RefreshLeft,
	PriceTag,
} from "@element-plus/icons-vue";
import type {
	Config,
	Img,
	LocalWaterMarkItem,
	WatermarkListItem,
} from "../types";
import {
	useDebounceFn,
	watchThrottled,
	formatDate,
	computedAsync,
} from "@vueuse/core";
import Exifr from "exifr";
import HorizontalScroll from "../components/HorizontalScroll.vue";
import { useStore } from "../stores";
const store = useStore();
import LensConfig from "../components/LensConfig.vue";
import ModelConfig from "../components/ModelConfig.vue";
import ParamsConfig from "../components/ParamsConfig.vue";
import TimeConfig from "../components/TimeConfig.vue";
import DividerConfig from "../components/DividerConfig.vue";
import LogoConfig from "../components/LogoConfig.vue";
import RadiusConfig from "../components/RadiusConfig.vue";
import BlurConfig from "../components/BlurConfig.vue";
import ShadowConfig from "../components/ShadowConfig.vue";
import PaddingConfig from "../components/PaddingConfig.vue";
import ImageInfo from "../components/ImageInfo.vue";
import LocationConfig from "../components/LocationConfig.vue";
import Filter from "../components/Filter.vue";

import { useExifStore } from "../stores/exif";
const exifStore = useExifStore();
import CustomLabels from "../components/CustomLabels.vue";
import CustomImages from "../components/CustomImages.vue";
import WatermarkPadding from "../components/WatermarkPadding.vue";
import { storeToRefs } from "pinia";
import BorderConfig from "../components/BorderConfig.vue";
import MarginConfig from "../components/MarginConfig.vue";

import { Leafer, Rect, Platform } from "leafer-ui";
import "@leafer-in/export"; // 引入导出元素插件
import "@leafer-in/find"; // 查找插件
import "@leafer-in/editor"; // 引入编辑器插件
import LeaferCanvas from "../components/LeaferCanvas.vue";
// import '@leafer-in/animate' // 导入动画插件 //

const { config } = storeToRefs(store);
// const menuItems = ref([
// 	{
// 		label: "Logo",
// 		value: "logo",
// 		component: markRaw(LogoConfig),
// 		show: config.value.logo.enable,
// 	},
// 	{
// 		label: "型号",
// 		value: "model",
// 		component: markRaw(ModelConfig),
// 		show: config.value.watermark.model.enable,
// 	},
// 	{
// 		label: "参数",
// 		value: "params",
// 		component: markRaw(ParamsConfig),
// 		show: config.value.watermark.model.enable,
// 	},
// 	{
// 		label: "时间",
// 		value: "time",
// 		component: markRaw(TimeConfig),
// 		show: config.value.watermark.time.enable,
// 	},
// 	{
// 		label: "背景",
// 		value: "background",
// 		component: markRaw(BlurConfig),
// 		show: true,
// 	},
// 	{
// 		label: "图片边框",
// 		value: "border",
// 		component: markRaw(BorderConfig),
// 		show: config.value?.border?.enable,
// 	},
// 	{
// 		label: "外边距",
// 		value: "margin",
// 		component: markRaw(MarginConfig),
// 		show: false,
// 	}, // 未实现
// 	{
// 		label: "地理位置",
// 		value: "location",
// 		component: markRaw(LocationConfig),
// 		show: config.value.location?.enable,
// 	},
// 	{
// 		label: "镜头",
// 		value: "lens",
// 		component: markRaw(LensConfig),
// 		show: config.value.watermark.lens.enable,
// 	},
// 	{
// 		label: "分割线",
// 		value: "divider",
// 		component: markRaw(DividerConfig),
// 		show: config.value.divider.enable,
// 	},
// 	{
// 		label: "图片圆角",
// 		value: "radius",
// 		component: markRaw(RadiusConfig),
// 		show: true,
// 	},
// 	{
// 		label: "图片阴影",
// 		value: "shadow",
// 		component: markRaw(ShadowConfig),
// 		show: true,
// 	},
// 	{ label: "滤镜", value: "filter", component: markRaw(Filter), show: true },
// ]);
// const renderMenuItems = computed(() => {
// 	return menuItems.value.filter((item) => item?.show === true);
// });
const curConfigComponent = shallowRef<Component>(LogoConfig);

// 画布
const imgCanvas = ref<HTMLCanvasElement | null>(null);
const showConfigDrawer = ref(false);
// 辅助线配置
const auxiliaryLines = reactive({
	verticalCenter: false, // 垂直中心线
	horizontalCenter: false, // 水平中心线
	watermarkHorizontalCenter: false, // 水印水平中心线
	watermarkRange: false, // 水印范围
});

const img = reactive<Img>({ ...defaultImgValue });
const curFile = ref<File | null>(null);
const fileList = ref<File[]>([]);

const watermarks = ref<WatermarkListItem[]>(getWatermarkList());
const curWatermarkIndex = ref<number>(0);
const activeName = ref<string>("info");
const batchExportVisible = ref(false);
const saveConfigDialog = reactive({
	show: false,
	name: "",
	config: "",
});
const showTools = ref(true);

provide("img", img);
function deleteWatermark(name: string, event: Event) {
	// 阻止事件冒泡
	event.stopPropagation();

	if (store.deleteLocalWatermark(name)) {
		watermarks.value = getWatermarkList();
		curWatermarkIndex.value = 0;
	}
}

const enhancedFileList = computedAsync(async () => {
	return await Promise.all(
		fileList.value.map(async (file) => {
			return {
				...file,
				url: getImageSrc(file),
			};
		})
	);
});

function changeCurFile(file: File | null) {
	if (!file) {
		curFile.value = null;
		activeName.value = "info";
		leafer.value && leafer.value.clear();
		return;
	}
	// 更新基本信息
	img.fileName = file.name;
	img.export.name = (img.export.name || "WM_" + file.name).split(".")[0];
	img.size = (file.size / 1024 / 1024).toFixed(2) + "MB";
	img.type = file.type;
	img.time = formatDate(new Date(file.lastModified), "YYYY-MM-DD HH:mm:ss");
	curFile.value = file;
}

const resetWatermark = () => {
	importConfig(curWatermarkIndex.value);

	ElMessage.success({
		message: "已重置水印样式",
	});
};

const showConfigDialog = () => {
	// 弹出对话框
	saveConfigDialog.show = true;
	saveConfigDialog.name = "自定义配置" + new Date().getTime();
	saveConfigDialog.config = JSON.stringify(config.value, null, 4);
};

// const saveConfig = () => {
// 	if (saveConfigDialog.name.trim() === "") {
// 		ElMessage.error("请输入配置名称~");
// 		return;
// 	}

// 	try {
// 		const temp_config = JSON.parse(saveConfigDialog.config);

// 		const watermark: LocalWaterMarkItem = {
// 			name: saveConfigDialog.name,
// 			config: temp_config,
// 			config_name: config.value.name,
// 		};

// 		// 保存到pinia
// 		store.addWatermark(watermark);

// 		saveConfigDialog.show = false;
// 		ElMessage.success("保存成功~");
// 		watermarks.value = getWatermarkList();
// 	} catch (e) {
// 		ElMessage.error("保存失败:格式错误！" + e);
// 	}
// };

function removeImg(index?: number) {
	index =
		index === undefined || typeof index != "number"
			? fileList.value.findIndex((item) => item === curFile.value)
			: index;
	index === -1 && ElMessage.error("文件不存在！");
	const isCurrentFile = fileList.value[index] == curFile.value;
	// 删除指定下标的图片文件
	fileList.value = fileList.value.filter((_, i) => i !== index);

	// 全部删除了：隐藏画布
	fileList.value.length === 0 && changeCurFile(null);
	// 删除的是当前图片：切换到第一张
	isCurrentFile && changeCurFile(fileList.value[0]);
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

// watchThrottled(
// 	[() => config, () => curFile, () => auxiliaryLines],
// 	() => {
// 		handleDraw();
// 	},
// 	{ throttle: 20, deep: true }
// );

const _img = new Image();
// const handleDraw = useDebounceFn(() => {
// 	try {
// 		const file = curFile.value;
// 		if (!file) return;

// 		const { watermark, location: locationConfig } = config.value;
// 		const { model, params: paramsConfig, time: timeConfig, lens } = watermark;

// 		_img.crossOrigin = "anonymous";
// 		_img.src = getImageSrc(file);
// 		_img.onload = async () => {
// 			// 更新宽高
// 			img.width = _img.width;
// 			img.height = _img.height;

// 			const { canvasWidth, canvasHeight, rect1, rect2 } = caculateCanvasSize(
// 				config.value,
// 				img
// 			);

// 			// 读取exif信息
// 			let exif = exifStore.getExif(file) || (await Exifr.parse(file));

// 			if (exif === undefined) {
// 				ElNotification({
// 					title: "错误",
// 					message:
// 						"未读取到Exif信息，请手动更改参数或者更换图片！(比如相机或者原相机拍摄的原图)",
// 					type: "error",
// 				});
// 				exif = defaultExif;
// 			}
// 			exifStore.addExif(file, exif);

// 			img.exif = exif;
// 			img.modelText = model.text ?? img.exif?.Model ?? "--";
// 			model.replaceZ && (img.modelText = replaceZ(img.modelText));
// 			// 曝光时间
// 			const exposureTime = convertExposureTime(exif?.ExposureTime);
// 			// 焦距
// 			const focalLength =
// 				(paramsConfig.useEquivalentFocalLength
// 					? exif?.FocalLengthIn35mmFormat
// 					: exif?.FocalLength) || exif?.FocalLength;
// 			img.paramsText =
// 				paramsConfig.text ||
// 				`${exposureTime}s  f/${exif?.FNumber}  iso ${exif?.ISO}  ${focalLength}mm`;
// 			img.timeText =
// 				timeConfig.text ||
// 				formatDate(
// 					new Date(img.exif?.DateTimeOriginal as number),
// 					timeConfig.format
// 				);
// 			img.lensText = lens.text || exif?.LensModel || "--";
// 			img.locationText = locationConfig?.text || getLocationText(img.exif);

// 			// 大写
// 			// img.modelText = model.letterUpperCase
// 			// 	? img.modelText.toUpperCase()
// 			// 	: img.modelText;
// 			img.paramsText = paramsConfig.letterUpperCase
// 				? img.paramsText.toUpperCase()
// 				: img.paramsText;
// 			img.timeText = timeConfig.letterUpperCase
// 				? img.timeText.toUpperCase()
// 				: img.timeText;
// 			img.lensText = lens.letterUpperCase
// 				? img.lensText.toUpperCase()
// 				: img.lensText;
// 			img.locationText = locationConfig?.letterUpperCase
// 				? img.locationText.toUpperCase()
// 				: img.locationText;

// 			const realImgWidth = img.width;
// 			const realImgHeight = img.height;

// 			if (realImgWidth <= 800 || realImgHeight <= 800) {
// 				ElMessage.warning("图片尺寸过小，样式可能错乱！");
// 			}

// 			init({
// 				canvasWidth,
// 				canvasHeight,
// 				rect1,
// 				rect2,
// 			});
// 			// 释放图片
// 			URL.revokeObjectURL(_img.src);
// 		};
// 	} catch (e) {
// 		console.error("绘制发生错误：", e);
// 	}
// }, 20);

const leafer = ref<Leafer | null>(null);
// const init = useDebounceFn((cfg) => {
// 	const dom = document.querySelector(".leafer");
// 	if (!dom) throw new Error("找不到dom元素");

// 	const { canvasWidth, canvasHeight, rect1, rect2 } = cfg;
// 	if (!curFile.value) return;

// 	const { paddings: imgPaddings, watermark, radius } = config.value;
// 	const { paddings: watermarkPaddings } = watermark;

// 	// 初始化Leafer
// 	if (leafer.value === null) {
// 		leafer.value = new Leafer({
// 			view: dom,
// 		});
// 	}
// 	leafer.value.set({
// 		width: canvasWidth,
// 		height: canvasHeight,
// 		fill: watermark.bgColor,
// 	});

// 	Platform.image.crossOrigin = "anonymous";

// 	let imgRadius = [0, 0, 0, 0];
// 	if (radius.enable && radius.show) {
// 		if (radius.uniform) {
// 			imgRadius = [radius.size, radius.size, radius.size, radius.size];
// 		} else {
// 			imgRadius = [radius.lt, radius.rt, radius.rb, radius.lb];
// 		}
// 	}
// 	let bg = leafer.value.findOne("#bg");
// 	if (!bg) {
// 		bg = new Rect({
// 			id: "bg",
// 			x: imgPaddings.left,
// 			y: imgPaddings.top,
// 			width: img?.width,
// 			height: img?.height,
// 			cornerRadius: imgRadius,
// 			fill: {
// 				type: "image",
// 				url: getImageSrc(curFile.value),
// 			},
// 		});
// 		leafer.value.add(bg);
// 	} else {
// 		bg.set({
// 			x: imgPaddings.left,
// 			y: imgPaddings.top,
// 			width: img?.width,
// 			height: img?.height,
// 			cornerRadius: imgRadius,
// 			fill: { type: "image", url: getImageSrc(curFile.value) },
// 		});
// 	}

// 	// 绘制水印背景
// 	let watermarkBg = leafer.value.findOne("#watermarkBg");
// 	const rectConfig = {
// 		x: rect1.x,
// 		y: rect1.y - watermarkPaddings.top,
// 		width: rect2.x - rect1.x,
// 		height:
// 			rect2.y - rect1.y + watermarkPaddings.top + watermarkPaddings.bottom,
// 		fill: watermark.bg,
// 	};
// 	if (!watermarkBg) {
// 		watermarkBg = new Rect({
// 			...rectConfig,
// 			id: "watermarkBg",
// 		});
// 		leafer.value.add(watermarkBg);
// 	} else {
// 		watermarkBg.set(rectConfig);
// 	}

// 	console.log("caculate start");
// 	config.value?.caculate(leafer.value, config.value, img, cfg);
// 	console.log("caculate end");

// 	// 绘制水印范围
// 	const watermarkRangeConfig = {
// 		x: rect1.x,
// 		y: rect1.y,
// 		width: rect2.x - rect1.x,
// 		height: rect2.y - rect1.y,
// 		fill: "#FF000040",
// 		visible: auxiliaryLines.watermarkRange,
// 	};
// 	let watermarkRange = leafer.value.findOne("#watermarkRange");
// 	if (!watermarkRange) {
// 		watermarkRange = new Rect({
// 			...watermarkRangeConfig,
// 			id: "watermarkRange",
// 		});
// 		leafer.value.add(watermarkRange);
// 	} else {
// 		watermarkRange.set(watermarkRangeConfig);
// 	}
// }, 20);

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
		case "哈苏":
			configPromise = import("../configs/哈苏");
			break;
		case "小米徕卡2":
			configPromise = import("../configs/小米徕卡2");
			break;
		case "默认样式":
			configPromise = import("../configs/默认样式");
			break;
		case "纯图标":
			configPromise = import("../configs/纯图标");
			break;
		case "经典模式":
			configPromise = import("../configs/经典模式");
			break;
		case "经典模糊":
			configPromise = import("../configs/经典模糊");
			break;
		case "印象毛玻璃":
			configPromise = import("../configs/印象毛玻璃");
			break;
		case "时间+型号":
			configPromise = import("../configs/时间+型号");
			break;
		case "蔡司水印":
			configPromise = import("../configs/蔡司水印");
			break;
		case "XMAGE":
			configPromise = import("../configs/XMAGE");
			break;
		case "Lumix":
			configPromise = import("../configs/Lumix");
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

	.btns {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 10px 0px;
		height: 60px;
		background-color: #fff;
	}

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
.float-menu {
	position: sticky;
	top: 0px;
	display: flex;
	justify-content: center;
	align-content: center;
	width: 100%;
	padding-bottom: 10px;
	z-index: 2;
	background-color: #fff;

	> div {
		gap: 10px;
	}

	.float-menu-item {
		padding: 3px 10px;
		cursor: pointer;
		border: 1.5px solid gainsboro;
		border-radius: 30px;
		font-size: 12px;

		&.active {
			@color: var(--el-color-primary);
			color: @color;
			border-color: @color;
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

		.btns {
			justify-content: space-between;
		}

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
