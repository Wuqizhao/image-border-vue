import type { Config } from "../types";
import { useStore } from "../stores";
import { formatTime, replaceZ } from "../utils";
import { commonCaculate } from "../assets/tools";

function caculate(imgW: number, imgH: number) {
	const store = useStore();
	const {
		watermark: { height, model, time },
	} = store.config || config;
	const { canvasPaddings, realImgMargin, realWatermarkPaddings } =
		commonCaculate(store.config || config, imgW, imgH);
	console.log(
		"realWatermarkPaddings",
		canvasPaddings,
		realImgMargin,
		realWatermarkPaddings
	);

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
		canvasPaddings.top +
		canvasPaddings.bottom;

	let modelText = model.text || store.img?.exif?.Model || "未知型号";
	model.replaceZ && (modelText = replaceZ(modelText));

	// 时间
	const timeText = formatTime(
		store.img?.exif?.DateTimeOriginal || Date.now(),
		time.format
	);

	return {
		width: w,
		height: h,
		imgX: canvasPaddings.left + realImgMargin.left,
		imgY: canvasPaddings.top + realImgMargin.top,
		rect1: {
			x:
				realImgMargin.left +
				canvasPaddings.left +
				imgW / 100 +
				realWatermarkPaddings.left,
			y:
				h -
				realImgMargin.bottom -
				canvasPaddings.bottom -
				imgH * height +
				realWatermarkPaddings.top,
		},
		rect2: {
			x:
				w -
				realImgMargin.right -
				canvasPaddings.right -
				imgW / 100 -
				realWatermarkPaddings.right,
			y:
				h -
				realImgMargin.bottom -
				canvasPaddings.bottom +
				realWatermarkPaddings.bottom,
		},
		modelText: modelText.toString(),
		// paramsText: paramsText.toString(),
		timeText: timeText.toString(),
		// lensText: lensText.toString(),
	};
}

const config: Config = {
	fill: "#FFF",
	global: {
		paddings: {
			top: 2,
			bottom: 3,
			left: 1.5,
			right: 1.5,
		},
	},
	img: {
		margin: {
			top: 0,
			bottom: 0,
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
		height: 0.2,
		fill: "#FFFFFF00",
		model: {
			enable: false,
			visible: false,
			replaceZ: true,
			text: "",
			fill: "#FFFFFF00",
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
			enable: false,
			visible: false,
			text: "",
			fill: "#FFFFFF00",
		},
		time: {
			enable: false,
			visible: false,
			text: "",
			fontSize: 80,
			fill: "#FFF",
			textAlign: "right",
			verticalAlign: "middle",
			fontWeight: "normal",
			textDecoration: "none",
			textCase: "none",
			format: "yyyy-MM-dd hh:mm",
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
			name: "sign1",
			width: 1000,
			height: 1000,
			cornerRadius: [0, 0, 0, 0],
		},
	},
	caculate: caculate,
};
export default config;
