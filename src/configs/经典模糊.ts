import type { Config, DrawFun } from "../types";
import { drawLogo } from "../utils";

const doDraw: DrawFun = async (img, config, context) => {
	const { logo: logoConfig, watermark } = config;
	const {
		params: paramsConfig,
		time: timeConfig,
		model: modelConfig,
	} = watermark;
	const { ctx, canvas, rect1, rect2 } = context;

	let totalWidth = 0;
	if (modelConfig.show) {
		ctx.save();
		ctx.fillStyle = modelConfig.color;
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
			modelConfig.bold ? "bold" : ""
		} ${modelConfig.size}px ${config.font}`;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		let _modelText = modelConfig.replaceZ
			? img.modelText.replace(/z|Z/, "ℤ")
			: img.modelText;

		// 计算宽度
		const modelWidth = ctx.measureText(_modelText).width;
		const space = 0.02 * canvas.width; // 图标和型号之间的间隔
		totalWidth = modelWidth + logoConfig.width + space;

		let _x = canvas.width / 2;
		if (logoConfig.show) {
			ctx.textAlign = "left";
			_x = canvas.width / 2 - totalWidth / 2 + logoConfig.width + space;
		}

		let _y = rect1.y + (rect2.y - rect1.y) / 3;
		if (!paramsConfig.show && !timeConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}

		ctx.fillText(_modelText, _x, _y);
		ctx.restore();
	}

	if (logoConfig.show) {
		let logoX = canvas.width / 2 - logoConfig.width / 2;
		if (modelConfig.show) {
			logoX = canvas.width / 2 - totalWidth / 2;
		}

		let logoY = rect1.y + (rect2.y - rect1.y) / 3 - logoConfig.height / 2;
		if (!timeConfig.show && !paramsConfig.show) {
			// 时间和参数都不显示
			logoY = rect1.y + (rect2.y - rect1.y) / 2 - logoConfig.height / 2;
		} else if (!paramsConfig.show || !timeConfig.show) {
			// 不显示时间或者不显示参数
			logoY = rect1.y + (rect2.y - rect1.y) / 2 - logoConfig.height;
		}

		logoY -= (logoConfig.verticalOffset - 1) * logoConfig.height;
		drawLogo(config, ctx, logoX, logoY);
	}

	// 绘制参数
	if (paramsConfig.show) {
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `${paramsConfig.italic ? "Italic" : ""} ${paramsConfig.size}px ${
			config.font
		}`;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		let _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		if (!logoConfig.show && !timeConfig.show && !modelConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}
		ctx.fillText(img.paramsText, canvas.width / 2, _y);
	}

	// 绘制时间
	if (timeConfig.show) {
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;
		ctx.textBaseline = "bottom";
		ctx.textAlign = "center";

		let _y = rect2.y;
		if (!logoConfig.show && !paramsConfig.show && !modelConfig.show) {
			ctx.textBaseline = "middle";
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		} else if (!paramsConfig.show) {
			_y = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		}
		ctx.fillText(img.timeText, canvas.width / 2, _y);
	}
};

const config: Config = {
	name: "经典模糊",
	font: "微软雅黑",
	paddings: {
		top: 300, // 图片上边距
		right: 700,
		left: 700,
		bottom: 0,
	},
	watermark: {
		height: 0.2,
		model: {
			enable: true,
			show: false,
			color: "#FFF",
			size: 200,
			replaceZ: true,
			italic: true, // 斜体
			bold: true, // 加粗
		},
		params: {
			enable: true,
			show: true,
			color: "#FFF",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
		},
		time: {
			enable: true,
			show: false,
			color: "#FFF",
			size: 100,
			format: "YYYY.MM.DD HH:mm",
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
			lr: 0,
			tb: 100,
		},
		bgColor: "#ffffff",
	},
	radius: {
		enable: true,
		show: true,
		size: 100,
		position: ["lt", "rt", "lb", "rb"],
	},
	blur: {
		enable: true,
		size: 200,
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
		size: 20,
	},
	draw: doDraw,
};

export default config;
