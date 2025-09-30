import type { Config } from "../types";
import { useStore } from "../stores";
import { convertExposureTime, formatTime, replaceZ } from "../utils";

function caculate(imgW: number, imgH: number) {
	const {
		global: { paddings: globalPaddings },
		img: { margin: imgMargin },
		watermark: { height, model, params },
	} = config;

	const w =
		imgW +
		imgMargin.left +
		imgMargin.right +
		globalPaddings.left +
		globalPaddings.right;
	const h =
		imgH +
		imgMargin.top +
		imgMargin.bottom +
		height * imgH +
		globalPaddings.top +
		globalPaddings.bottom;
	const store = useStore();

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
	console.log("exif", store.img?.exif);

	return {
		width: w,
		height: h,
		imgX: globalPaddings.left + imgMargin.left,
		imgY: globalPaddings.top + imgMargin.top,
		rect1: {
			x: imgMargin.left + globalPaddings.left,
			y: imgMargin.top + globalPaddings.top + imgH + imgMargin.bottom,
		},
		rect2: {
			x: w - imgMargin.right - globalPaddings.right,
			y: h - globalPaddings.bottom,
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
			top: 0,
			bottom: 100,
			left: 0,
			right: 0,
		},
	},
	img: {
		margin: {
			top: 100,
			bottom: 100,
			left: 100,
			right: 100,
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
			visible: true,
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
			enable: true,
			text: "",
			fontSize: 80,
			draggable: true,
			verticalAlign: "middle",
			visible: true,
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
			width: 180,
			height: 180,
			cornerRadius: [0, 0, 0, 0],
		},
	},
	caculate: caculate,
};
export default config;
