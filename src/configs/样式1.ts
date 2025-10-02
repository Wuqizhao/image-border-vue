import type { Config } from "../types";
import { useStore } from "../stores";
import { convertExposureTime, formatTime, replaceZ } from "../utils";

function caculate(imgW: number, imgH: number) {
	const store = useStore();
	const {
		global: { paddings: globalPaddings },
		img: { margin: imgMargin },
		watermark: { height, model, params },
	} = store.config || config;

	// 计算实际的画布内边距
	const canvasPaddings = {
		top: (globalPaddings.top * imgH) / 100,
		bottom: (globalPaddings.bottom * imgH) / 100,
		left: (globalPaddings.left * imgW) / 100,
		right: (globalPaddings.right * imgW) / 100,
	};
	// 计算实际的图片外边距
	const realImgMargin = {
		top: (imgMargin.top * imgH) / 100,
		bottom: (imgMargin.bottom * imgH) / 100,
		left: (imgMargin.left * imgW) / 100,
		right: (imgMargin.right * imgW) / 100,
	};

	const w =
		imgW +
		realImgMargin.left +
		realImgMargin.right +
		canvasPaddings.left +
		canvasPaddings.right;
	const h =
		imgH +
		realImgMargin.top +
		realImgMargin.bottom +
		height * imgH +
		canvasPaddings.top +
		canvasPaddings.bottom;

	let modelText = model.text || store.img?.exif?.Model || "未知型号";
	model.replaceZ && (modelText = replaceZ(modelText));

	// 参数
	const FNumber = store.img?.exif?.FNumber || 0.95;
	const ISO = store.img?.exif?.ISO || 100;
	const shutterSpeed = store.img?.exif?.ShutterSpeedValue || 0.08;
	const focalLength = store.img?.exif?.FocalLength || 135;
	const focalLength35mm = store.img?.exif?.FocalLengthIn35mmFormat || 135;

	const paramsText =
		params.text ||
		`${focalLength35mm || focalLength}mm f/${FNumber} ${convertExposureTime(
			shutterSpeed
		)}s ISO${ISO}` ||
		"未知参数";

	// 时间
	const timeText = formatTime(store.img?.exif?.DateTimeOriginal || Date.now());
	// 镜头
	const lensText = store.img?.exif?.LensModel || "未获取到镜头信息";

	return {
		width: w,
		height: h,
		imgX: canvasPaddings.left + realImgMargin.left,
		imgY: canvasPaddings.top + realImgMargin.top,
		rect1: {
			x: realImgMargin.left + canvasPaddings.left,
			y: realImgMargin.top + canvasPaddings.top + imgH + realImgMargin.bottom,
		},
		rect2: {
			x: w - realImgMargin.right - canvasPaddings.right,
			y: h - canvasPaddings.bottom,
		},
		modelText: modelText.toString(),
		paramsText: paramsText.toString(),
		timeText: timeText.toString(),
		lensText: lensText.toString(),
	};
}

const config: Config = {
	fill: "#FFF",
	global: {
		paddings: {
			top: 3,
			bottom: 2,
			left: 2,
			right: 2,
		},
	},
	img: {
		margin: {
			top: 0,
			bottom: 2,
			left: 0,
			right: 0,
		},
		cornerRadius: [0, 0, 0, 0],
		shadow: {
			x: 10,
			y: 10,
			blur: 10,
			color: "#d2d2d200",
		},
	},
	watermark: {
		height: 0.1,
		fill: "#FFFFFF00",
		model: {
			enable: true,
			visible: true,
			replaceZ: true,
			text: "",
			fill: "#000",
			fontSize: 120,
			textAlign: "left",
			verticalAlign: "middle",
			fontWeight: "bold",
			textDecoration: "none",
			textCase: "title",
			letterSpacing: 0,
			lineHeight: 1,
			draggable: true,
			editable: true,
		},
		params: {
			enable: true,
			visible: false,
			text: "",
			fontSize: 100,
			fill: "#888",
			textAlign: "right",
			verticalAlign: "middle",
			fontWeight: "normal",
			textDecoration: "none",
			textCase: "none",
			letterSpacing: 0,
			lineHeight: 1,
			draggable: true,
			editable: true,
		},
		time: {
			enable: true,
			visible: true,
			text: "",
			fontSize: 80,
			fill: "#888",
			textAlign: "right",
			verticalAlign: "middle",
			fontWeight: "normal",
			textDecoration: "none",
			textCase: "none",
			format: "yyyy-MM-dd hh:mm:ss",
			letterSpacing: 0,
			lineHeight: 1,
			draggable: true,
			editable: true,
		},
		lens: {
			enable: false,
			text: "",
			fontSize: 80,
			draggable: true,
			verticalAlign: "middle",
			visible: false,
			fill: "#888",
			fontWeight: "normal",
			textDecoration: "none",
			textCase: "none",
		},
		paddings: {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		},
		logo: {
			enable: true,
			auto: false,
			visible: true,
			name: "nikon",
			width: 200,
			height: 200,
			cornerRadius: [500, 500, 500, 500],
		},
	},
	caculate: caculate,
};
export default config;
