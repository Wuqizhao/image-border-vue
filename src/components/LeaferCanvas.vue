<template>
	<div id="canvasBox" @dragover.prevent @dragenter.prevent @drop="onDrop">
		<canvas class="leafer" v-show="store.curFile" ref="imgCanvas"></canvas>
		<el-empty
			description="点击添加图片~"
			v-show="!store.curFile"
			@click="store.addFile"></el-empty>

		<div class="toolbar">
			<el-button circle @click="store.addFile" title="添加图片">
				<el-icon>
					<Plus />
				</el-icon>
			</el-button>
			<el-dropdown v-show="store.fileList.length > 0">
				<el-button circle title="图片列表" v-show="store.fileList.length > 0">
					<el-icon>
						<Picture />
					</el-icon>
				</el-button>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							:disabled="store.curFile === f"
							v-for="f in store.fileList"
							:key="f.name"
							@click="store.curFile = f">
							<span> {{ f.name }}</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<el-button
				@click="store.resetStyle()"
				circle
				title="重置样式"
				v-show="store.fileList.length > 0">
				<el-icon>
					<Refresh />
				</el-icon>
			</el-button>
			<el-dropdown>
				<el-button circle title="样式预设">
					<el-icon>
						<Files />
					</el-icon>
				</el-button>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							v-for="s in getWatermarkList()"
							@click="store.resetStyle(s.name)"
							>{{ s.name }}</el-dropdown-item
						>
					</el-dropdown-menu>
				</template>
			</el-dropdown>

			<el-button circle @click="store.clearFileList" title="清空图片">
				<el-icon>
					<Delete />
				</el-icon>
			</el-button>
			<el-button
				circle
				title="绘制上一张图片"
				v-show="store.fileList.length > 1">
				<el-icon>
					<ArrowLeft />
				</el-icon>
			</el-button>
			<el-button
				circle
				@click="store.drawNextImage"
				title="绘制下一张图片"
				v-show="store.fileList.length > 1">
				<el-icon>
					<ArrowRight />
				</el-icon>
			</el-button>
			<el-button
				circle
				@click="store.exportImg"
				title="导出图片"
				v-show="store.fileList.length > 0">
				<el-icon>
					<Download />
				</el-icon>
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "../stores";
import { getImageSrc } from "../utils";
import { Leafer, Rect, Text, type IRect } from "leafer-ui";
import type { Img, Lens, Logo, Model, Params, Time } from "../types";
import { useExifStore } from "../stores/exif";
import Exifr from "exifr";
import { watchThrottled } from "@vueuse/core";
import { storeToRefs } from "pinia";
import {
	ArrowLeft,
	ArrowRight,
	Delete,
	Download,
	Files,
	Plus,
	Refresh,
	Picture,
} from "@element-plus/icons-vue";
import { getWatermarkList } from "../assets/tools";
const exifStore = useExifStore();

const store = useStore();
const imgCanvas = ref<HTMLCanvasElement | null>(null);
const { leafer } = storeToRefs(store);

function onDrop(e: DragEvent) {
	console.log("onDrop", e.dataTransfer?.files);

	if (e.dataTransfer?.files.length) {
		changeCurFile(e.dataTransfer?.files[0]);
	}
	e.preventDefault();
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

watch(
	() => store.curFile,
	(newFile, _) => {
		if (newFile) {
			changeCurFile(newFile);
		}
		draw();
	}
);

watchThrottled(
	[() => store.config],
	() => {
		console.log("watchThrottled", "重绘监听");
		// draw();
		initLeafer(store.img as Img);
	},
	{ deep: true, throttle: 1000 }
);

async function draw(file: File = store.curFile as File) {
	if (!store.curFile) {
		return;
	}

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
	const _t1 = performance.now();
	if (!imgCanvas.value) throw "找不到画布";
	if (!store.curFile) throw "请先选择图片~";

	if (!store.config) {
		console.log("没有导入配置");
		return;
	}

	console.log("store.config", store.config);
	const {
		img,
		fill,
		watermark: { logo, fill: watermarkFill },
	} = store.config;
	const { width, height, rect1, rect2, imgX, imgY, domList } =
		store.config.caculate(context.width, context.height);

	// 更新画布
	const canvasConfig = {
		width: width,
		height: height,
		fill: fill || "#FFF",
		view: imgCanvas.value,
	};
	if (!leafer.value) {
		leafer.value = new Leafer(canvasConfig);
	} else {
		leafer.value?.set(canvasConfig);
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
	} else {
		imgEl = new Rect({
			...imgConfig,
			id: "img",
		});
		leafer.value.add(imgEl);
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

	// 绘制型号
	const centerY = rect1.y + (rect2.y - rect1.y) / 2;

	domList?.map((item) => {
		updateLeaferText(leafer.value as Leafer, item.id, item);
	});

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
			draggable: true,
			editable: true,
			// 边框
			// stroke: {
			// 	type: "solid",
			// 	color: "#F00",
			// 	width: 50
			// },
		} as Logo;

		if (logoEl) {
			logoEl.set(logoConfig);
		} else {
			logoEl = new Rect({ ...logoConfig, id: "logo" });
			leafer.value?.add(logoEl);
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
	}, 800);

	console.log("【绘制耗时】", performance.now() - _t1);
}

function updateLeaferText(
	leafer: Leafer,
	id: string = "",
	config: Partial<Model | Params | Time | Lens>
) {
	if (!leafer || !id) return;

	let el = leafer.findOne("#" + id);
	if (el) {
		if (!config?.enable) {
			el.remove();
		} else {
			el.set(config);
		}
	} else {
		el = new Text({
			...config,
			id: id,
		});
		leafer.add(el);
	}
	return el;
}

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
	store.resetStyle();
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
	padding: 5px;
	// border: 3px dashed lightgreen;
	box-sizing: border-box;

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

	.toolbar {
		position: sticky;
		bottom: 10px;
		// z-index: 2;
		box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
		padding: 5px 10px;
		border-radius: 50px;
		display: flex;

		> .el-dropdown {
			margin: 0px 12px;
		}
	}
}

@media screen and (max-width: 768px) {
	.box {
		gap: 5px;
		flex-direction: column;
	}

	#canvasBox {
		max-height: 360px;

		canvas {
			max-height: 100%;
		}
	}
}
</style>
