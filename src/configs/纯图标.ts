import type { Config, DrawFun } from "../types";
import { drawLogo } from "../utils";

const doDraw: DrawFun = async (_, config, context) => {
	const {
		logo: logoConfig,
		paddings: { bottom },
		watermark: { paddings },
	} = config;
	const { ctx, canvas, rect1, rect2 } = context;

	const centerX = (rect1.x + rect2.x) / 2;
	if (logoConfig.show) {
		const logoX = centerX - logoConfig.width / 2;
		const logoY =
			canvas.height -
			logoConfig.height -
			paddings.bottom -
			bottom -
			(logoConfig.verticalOffset - 1) * logoConfig.height;
		drawLogo(logoConfig, ctx, logoX, logoY);
	}
};

const config: Config = {
	name: "纯图标",
	font: "sans-serif",
	paddings: {
		top: 150, // 图片上边距
		right: 150,
		left: 150,
		bottom: 150,
	},
	watermark: {
		position: "inner",
		height: 0,
		model: {
			enable: false,
			show: false,
			color: "#FF0000",
			size: 200,
			replaceZ: true,
			italic: true, // 斜体
			bold: true, // 加粗
		},
		params: {
			enable: false,
			show: false,
			color: "#808080",
			size: 14,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
			bold: false,
		},
		time: {
			enable: false,
			show: true,
			color: "#808080",
			size: 14,
			format: "YYYY-MM-DD HH:mm",
			italic: false,
			bold: false,
		},
		lens: {
			enable: false,
			show: false,
			color: "#808080",
			size: 14,
			italic: false,
			bold: false,
			text: "",
		},
		paddings: {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		},
		bgColor: "#ffffff",
	},
	radius: {
		enable: true,
		show: true,
		size: 100,
		uniform: true,
		lt: 100,
		rt: 100,
		lb: 100,
		rb: 100,
	},
	blur: {
		type: "color",
		size: 100,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		name: "hasselblad-white",
		width: 400,
		height: 400,
		verticalOffset: 1,
		circle: false,
	},
	divider: {
		enable: false,
		show: true,
		color: "#808080",
		width: 2,
		scale: 1,
		margin: 1,
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 0,
		y: 0,
		size: 50,
	},
	filter: {
		saturation: 100,
		brightness: 100,
		contrast: 100,
		grayscale: 0,
		invert: 0,
	},
	draw: doDraw,
};

export default config;
