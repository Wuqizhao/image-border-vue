import type { Config } from "../types";
import { useStore } from "../stores";
import { convertExposureTime, formatTime, replaceZ } from "../utils";
import { commonCaculate } from "../assets/tools";

function caculate(imgW: number, imgH: number) {
	const store = useStore();
	const {
		watermark: { height, model, params, lens, time },
	} = store.config || config;

	const { canvasPaddings, realImgMargin, realWatermarkPaddings } =
		commonCaculate(store.config || config, imgW, imgH);

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
	const rect1 = {
		x: realImgMargin.left + canvasPaddings.left + realWatermarkPaddings.left,
		y:
			realImgMargin.top +
			canvasPaddings.top +
			imgH +
			realImgMargin.bottom +
			realWatermarkPaddings.top,
	};
	const rect2 = {
		x:
			w -
			realImgMargin.right -
			canvasPaddings.right -
			realWatermarkPaddings.right,
		y: h - canvasPaddings.bottom - realWatermarkPaddings.bottom,
	};
	const centerY = rect1.y + (rect2.y - rect1.y) / 2;
	const y_1_3 = rect1.y + (rect2.y - rect1.y) / 3;
	const y_2_3 = rect1.y + (2 * (rect2.y - rect1.y)) / 3;

	let modelText = model.text || store.img?.exif?.Model || "未知型号";
	model.replaceZ && (modelText = replaceZ(modelText));
	// 计算型号位置
	const modelX = rect1.x;
	const modelY = lens.visible ? y_1_3 : centerY;

	// 参数
	const FNumber = store.img?.exif?.FNumber || 0.95;
	const ISO = store.img?.exif?.ISO || 100;
	const shutterSpeed = store.img?.exif?.ExposureTime || 0.08;
	const focalLength = store.img?.exif?.FocalLength || 135;
	const focalLength35mm = store.img?.exif?.FocalLengthIn35mmFormat || 135;

	const paramsText =
		params.text ||
		`${focalLength35mm || focalLength}mm f/${FNumber} ${convertExposureTime(
			shutterSpeed
		)}s ISO${ISO}` ||
		"未知参数";
	const paramsX = rect2.x;
	const paramsY = time.visible ? y_1_3 : centerY;

	// 时间
	const timeText =
		formatTime(store.img?.exif?.DateTimeOriginal || Date.now()) || "未知时间";
	const timeX = rect2.x;
	const timeY = params.visible ? y_2_3 : centerY;

	// 镜头
	const lensText = store.img?.exif?.LensModel || "未获取到镜头信息";
	const lensX = rect1.x;
	const lensY = model.visible ? y_2_3 : centerY;

	const domList = [
		{
			...model,
			text: modelText,
			x: modelX,
			y: modelY,
			id: "model",
		},
		{
			...params,
			text: paramsText,
			x: paramsX,
			y: paramsY,
			id: "params",
		},
		{
			...time,
			text: timeText,
			x: timeX,
			y: timeY,
			id: "time",
		},
		{
			...lens,
			text: lensText,
			x: lensX,
			y: lensY,
			id: "lens",
		},
	];
	return {
		domList: domList,
		width: w,
		height: h,
		imgX: canvasPaddings.left + realImgMargin.left,
		imgY: canvasPaddings.top + realImgMargin.top,
		rect1: rect1,
		rect2: rect2,
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
			width: 200,
			height: 200,
			cornerRadius: [0, 0, 0, 0],
		},
	},
	caculate: caculate,
};
export default config;
