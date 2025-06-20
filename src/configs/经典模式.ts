import type { Config, DrawFun } from "../types";
import { drawLogo } from "../utils";

const doDraw: DrawFun = async (img, config, context) => {
	const { logo: logoConfig, watermark } = config;
	const { params: paramsConfig, time: timeConfig } = watermark;
	const { ctx, rect1, rect2 } = context;

	const centerX = (rect1.x + rect2.x) / 2;
	if (logoConfig.show) {
		const logoX = centerX - logoConfig.width / 2;
		let logoY = rect1.y + (rect2.y - rect1.y) / 4 - logoConfig.height / 2;
		if (!timeConfig.show && !paramsConfig.show) {
			// 时间和参数都不显示
			logoY = rect1.y + (rect2.y - rect1.y) / 2 - logoConfig.height / 2;
		} else if (!paramsConfig.show || !timeConfig.show) {
			// 不显示时间或者不显示参数
			logoY = rect1.y + (rect2.y - rect1.y) / 2 - logoConfig.height;
		}
		logoY -= (logoConfig.verticalOffset - 1) * logoConfig.height;
		drawLogo(logoConfig, ctx, logoX, logoY);
	}

	// 绘制参数
	if (paramsConfig.show) {
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `${paramsConfig.italic ? "Italic" : ""} ${paramsConfig.size}px ${
			config.font
		}`;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		let _y = 0;
		if (!logoConfig.show && !timeConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		} else if (!logoConfig.show) {
			ctx.textBaseline = "top";
			_y = rect1.y + (rect2.y - rect1.y) / 4;
		} else {
			_y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		}
		ctx.fillText(img.paramsText, centerX, _y);
	}

	// 绘制时间
	if (timeConfig.show) {
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;
		ctx.textBaseline = "bottom";
		ctx.textAlign = "center";
		let _y = 0;
		if (!logoConfig.show && !paramsConfig.show) {
			ctx.textBaseline = "middle";
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		} else if (!logoConfig.show || !paramsConfig.show) {
			_y = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		} else {
			_y = rect2.y;
		}
		ctx.fillText(img.timeText, centerX, _y);
	}
};

const config: Config = {
	name: "经典模式",
	font: "sans-serif",
	paddings: {
		top: 150, // 图片上边距
		right: 150,
		left: 150,
		bottom: 0,
	},
	watermark: {
		height: 0.2,
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
			enable: true,
			show: true,
			color: "#808080",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
			bold: false,
		},
		time: {
			enable: true,
			show: true,
			color: "#808080",
			size: 100,
			format: "YYYY.MM.DD HH:mm",
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
			top: 100,
			bottom: 100,
			left: 0,
			right: 0,
		},
		bgColor: "#ffffff",
	},
	radius: {
		enable: true,
		show: true,
		size: 150,
		uniform: true,
		lt: 150,
		rt: 150,
		lb: 150,
		rb: 150,
	},
	blur: {
		type: "color",
		size: 100,
	},
	logo: {
		enable: true,
		auto: true,
		show: true,
		name: "leica",
		width: 300,
		height: 300,
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
