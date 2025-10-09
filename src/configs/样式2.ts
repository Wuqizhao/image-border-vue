import type { Config } from "../types";
import { useStore } from "../stores";
import { commonCaculate } from "../assets/tools";
import { getImageSrc } from "../utils";
import type { IRect } from "leafer-ui";

function caculate(imgW: number, imgH: number) {
	const store = useStore();
	const {
		watermark: { height, logo },
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
		canvasPaddings.top +
		canvasPaddings.bottom;

	const rect1 = {
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
	};
	const rect2 = {
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
	};

	// logo
	const logoX = rect1.x + (rect2.x - rect1.x) / 2 - (logo?.width || 0) / 2;
	const logoY = rect1.y + (rect2.y - rect1.y) / 2 - (logo?.height || 0) / 2;

	const imgList: Partial<IRect>[] = [
		{
			...logo,
			id: "logo",
			x: logoX,
			y: logoY,
			fill: {
				type: "image",
				url: getImageSrc(logo?.url || logo?.name || "nikon"),
				mode: "fit",
			},
			draggable: true,
			editable: true,
		},
	];

	return {
		width: w,
		height: h,
		imgX: canvasPaddings.left + realImgMargin.left,
		imgY: canvasPaddings.top + realImgMargin.top,
		rect1: rect1,
		rect2: rect2,
		domList: [],
		imgList: imgList,
	};
}

const config: Config = {
	fill: "#FFF",
	global: {
		paddings: {
			top: 2,
			bottom: 2,
			left: 2,
			right: 2,
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
			format: "yyyy-MM-dd hh:mm",
			visible: false,
			text: "",
			fontSize: 80,
			fill: "#FFF",
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
