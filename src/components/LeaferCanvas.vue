<template>
	<div id="canvasBox" @dragover.prevent @dragenter.prevent @drop="onDrop">
		<canvas class="leafer" v-show="store.curFile" ref="imgCanvas"></canvas>
		<el-empty
			description="点击添加图片~"
			v-show="!store.curFile"
			@click="store.addFile"></el-empty>

		<el-button @click="leafer && leafer.forceRender()">刷新</el-button>
		<!-- <el-button type="primary" size="default" @click="exportLeafer"
			>导出</el-button
		> -->

		<!-- <div class="download" v-show="showTools && fileList.length > 0">
			<Plus @click="selectFile(true)" />
			<Delete @click="removeImg" />
			<ArrowLeft v-if="fileList.length > 1" @click="prev" />
			<ArrowRight v-if="fileList.length > 1" @click="next" />
			<RefreshLeft @click="resetWatermark" />
			<Download @click="exportLeafer" />
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useStore } from "../stores";
import { getImageSrc } from "../utils";
import { Leafer, Rect, Text, type IRect, type IText } from "leafer-ui";
import type { Img, Logo } from "../types";
import { useExifStore } from "../stores/exif";
import Exifr from "exifr";
import { watchThrottled } from "@vueuse/core";
import { storeToRefs } from "pinia";
const exifStore = useExifStore();

const store = useStore();
const imgCanvas = ref<HTMLCanvasElement | null>(null);
const { leafer } = storeToRefs(store);

function onDrop() {}
// async function select() {
// 	const files = await selectFile();

// 	if (files.length > 0) {
// 		store.curFile = files[0];
// 		console.log('[files]',files);
// 		store.fileList.push(...files);
// 	}
// }

function importConfig() {
	store.resetStyle();
}

function changeCurFile(file: File | null) {
	if (!file) {
		store.curFile = null;
		leafer.value?.clear();
		return;
	}

	if (store.curFile !== file) {
		store.curFile = file;
	}
	// draw(file);
}

watchThrottled(
	[() => store.curFile, () => store.config],
	([newFile, _]) => {
		if (newFile) {
			changeCurFile(newFile);
		}
		draw();
	},
	{ deep: true, throttle: 50 }
);

async function draw(file: File = store.curFile as File) {
	// console.log("绘制");
	if (!store.curFile) {
		return;
	}

	console.log("【绘制】");
	const img = new Image();
	img.crossOrigin = "anonymous";
	img.src = getImageSrc(file);
	img.onload = async () => {
		const exif = exifStore.getExif(file) || (await Exifr.parse(file));

		const info: Img = {
			width: img.width,
			height: img.height,
			fileName: file.name,
			size: file.size.toString(),
			type: file.type,
			time: file.lastModified.toString(),
			export: {
				name: `WM_${file.name}`,
				ext: "jpeg",
				quality: 1,
			},
			exif: exif,
			modelText: exif?.Model || "请输入型号",
			paramsText: "",
			timeText: "",
			lensText: "",
			locationText: "",
		};
		store.img = info;

		initLeafer(info);
	};
	img.onerror = () => {
		console.log("【image加载失败】");
	};
}

async function initLeafer(context: Img) {
	if (!imgCanvas.value) throw "找不到画布";
	if (!store.curFile) throw "请先选择图片~";

	if (!store.config) {
		console.log("没有导入配置");
		return;
	}

	const {
		img,
		fill,
		watermark: { model, params, time, lens, logo, fill: watermarkFill },
	} = store.config;
	const {
		width,
		height,
		rect1,
		rect2,
		imgX,
		imgY,
		modelText,
		paramsText,
		lensText,
		timeText,
	} = store.config.caculate(context.width, context.height);

	// 更新画布
	if (!leafer.value) {
		leafer.value = new Leafer({
			view: imgCanvas.value,
			fill: fill || "#FFF",
			width: width,
			height: height,
		});
	} else {
		leafer.value?.set({
			// view: imgCanvas.value,
			fill: fill || "#FFF",
			width: width,
			height: height,
		});
	}

	// 绘制主图
	let imgEl = leafer.value?.findOne("#img");
	const url = getImageSrc(store.curFile).toString();
	const imgConfig = {
		x: imgX,
		y: imgY,
		fill: {
			type: "image",
			url: url,
			// type: "solid",
			// color: "#FF0000",
		},
		cornerRadius: img.cornerRadius,
		shadow: img.shadow,
	} as Partial<IRect>;
	if (imgEl) {
		imgEl.set(imgConfig);
		console.log("【更新主图】", store.curFile?.name, url);
	} else {
		imgEl = new Rect({
			...imgConfig,
			id: "img",
		});
		leafer.value.add(imgEl);
		console.log("【新建主图】", store.curFile?.name, url);
	}

	// 绘制的水印范围的背景
	let bgEl = leafer.value?.findOne("#bg");
	const bgConfig = {
		x: rect1.x,
		y: rect1.y,
		width: rect2.x - rect1.x,
		height: rect2.y - rect1.y,
		fill: {
			type: "solid",
			color: watermarkFill || "#FFF",
		},
	};
	if (bgEl) {
		bgEl.set(bgConfig as IRect);
	} else {
		bgEl = new Rect({
			...bgConfig,
			id: "bg",
		} as IRect);
		leafer.value.add(bgEl);
	}

	// box
	// const boxConfig = {
	// 	width: 1000,
	// 	height: 1000,
	// 	fill: "#FF4B4B33",
	// 	hoverStyle: {
	// 		// // hover 样式
	// 		fill: "#F00",
	// 	},
	// };
	// let boxEl = leafer.value?.findOne("#box");
	// if (!boxEl) {
	// 	boxEl = new Box({
	// 		...boxConfig,
	// 		id: "box",
	// 		zIndex: 1,
	// 	});
	// 	leafer.value.add(boxEl);
	// } else {
	// 	boxEl.set(boxConfig);
	// }
	// const circle = new Ellipse({
	// 	x: 60,
	// 	y: 60,
	// 	width: 500,
	// 	height: 500,
	// 	fill: "#FEB027",
	// 	draggable: true,
	// 	zIndex: 2,
	// });
	// leafer.value.add(boxEl);
	// boxEl.add(circle);

	// 绘制型号
	const centerY = rect1.y + (rect2.y - rect1.y) / 2;
	const y_1_3 = rect1.y + (rect2.y - rect1.y) / 3;
	const y_2_3 = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
	const modelConfig = {
		...model,
		x: rect1.x,
		y: lens.visible ? y_1_3 : centerY,
		text: model.text || modelText,
	} as IText;
	updateLeaferText(leafer.value as Leafer, "model", modelConfig);

	// 绘制参数
	const paramsConfig = {
		...params,
		y: time.visible ? y_1_3 : centerY,
		x: rect2.x,
		text: params.text || paramsText,
	} as IText;
	updateLeaferText(leafer.value as Leafer, "params", paramsConfig);

	// 绘制时间
	const timeConfig = {
		...time,
		x: rect2.x,
		y: params.visible ? y_2_3 : centerY,
		text: time.text || timeText,
	} as IText;
	updateLeaferText(leafer.value as Leafer, "time", timeConfig);

	// 镜头信息
	const lensConfig = {
		...lens,
		x: rect1.x,
		y: model.visible ? y_2_3 : centerY,
		text: lens.text || lensText,
	} as IText;
	updateLeaferText(leafer.value as Leafer, "lens", lensConfig);

	let logoEl = leafer.value?.findOne("#logo");
	if (logo && logo?.enable) {
		const logoConfig = {
			...logo,
			x: (rect2.x - rect1.x) / 2 - (logo.width || 0) / 2,
			y: centerY - (logo.height || 0) / 2,
			fill: {
				type: "image",
				url: getImageSrc(logo.url || logo.name),
				mode: "fit",
			},
		} as Logo;

		if (logoEl) {
			logoEl.set(logoConfig);
			console.log("更新logo");
		} else {
			logoEl = new Rect({ ...logoConfig, id: "logo" });
			leafer.value?.add(logoEl);
			console.log("新建logo");
		}
	}

	// leafer.value.forceUpdate();
	setTimeout(() => {
		imgEl.set({
			fill: {
				type: "image",
				url: url,
			},
		});
	}, 1000);
}

function updateLeaferText(leafer: Leafer, id: string = "", config: IText) {
	if (!leafer || !id) return;

	let el = leafer.findOne("#" + id);
	if (el) {
		el.set(config);
	} else {
		el = new Text({
			...config,
			id: id,
		});
		leafer.add(el);
	}
	return el;
}

// function prev() {
// 	const index = fileList.findIndex((item) => curFile === item);
// 	if (index !== -1) {
// 		// 找到上一张的坐标，支持循环
// 		// changeCurFile(
// 		// 	fileList[
// 		// 		(index - 1 + fileList.length) % fileList.length
// 		// 	]
// 		// );
// 	}
// }
// function next() {
// 	const index = fileList.findIndex((item) => curFile === item);
// 	if (index === -1) return;
// 	// changeCurFile(fileList[(index + 1) % fileList.length]);
// }

// async function exportLeafer() {
// 	try {
// 		if (!leafer.value) {
// 			ElMessage.warning("请先添加图片");
// 			return;
// 		}

// 		// 使用Leafer的导出功能
// 		const result = await leafer.value.export(
// 			img.export.name + "." + img.export.ext,
// 			{
// 				quality: img.export.ext === "jpeg" ? img.export.quality : 1,
// 				screenshot: true,
// 			}
// 		);

// 		console.log("导出结果:", result);

// 		if (result) {
// 			ElMessage.success(`导出成功`);
// 		} else {
// 			ElMessage.warning("导出操作未完成");
// 		}
// 	} catch (error) {
// 		console.error("导出失败:", error);
// 		let errorMsg = "导出失败";
// 		if (error instanceof Error) {
// 			errorMsg += ": " + error.message;
// 		}
// 		ElMessage.error(errorMsg);
// 	}
// }

onMounted(() => {
	// 清空文件
	store.curFile = null;
	store.fileList = [];
	try {
		// leafer.value?.destroy();
		leafer.value = null;
	} catch (e) {
		console.log("清理画布失败");
	}
	importConfig();
});

onUnmounted(() => {
	// 清空文件
	store.curFile = null;
	store.fileList = [];
	leafer && leafer.value?.destroy();
});
</script>

<style lang="less" scoped>
#canvasBox {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background: rgb(255, 255, 255);
	transition-duration: 0.8s;
	width: 100%;
	position: relative;
	max-height: 100vh;
	overflow: hidden;
	padding: 20px;
	// border: 5px dashed salmon;

	&:hover {
		.download {
			transform: translateY(0px);
			transition-duration: 0.5s;
		}
	}

	.leafer {
		border: 1px solid silver;
		max-width: 100%;
		max-height: 100%;
		width: fit-content !important;
		height: fit-content !important;
		box-shadow: 0px 0px 20px rgba(194, 194, 194, 0.934);
		transition: all 0.5s ease-in-out;

		&:hover {
			box-shadow: 0px 5px 20px gray;
		}
	}

	.download {
		background-color: rgba(0, 0, 0, 0.2);
		position: absolute;
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 3px;
		border-radius: 3px;
		transform: translateY(-200%);

		> * {
			color: #fff;
			width: 20px;
			height: 20px;

			&:hover {
				color: var(--el-color-primary);
			}
		}

		cursor: pointer;
	}
}

@media screen and (max-width: 768px) {
	.box {
		gap: 5px;
		flex-direction: column;
	}

	#canvasBox {
		max-height: 300px;

		canvas {
			max-height: 100%;
		}
	}

	.download {
		transform: translateY(0px);
	}
}
</style>
