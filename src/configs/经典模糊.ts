import type { Config, DrawFun } from "../types";
import { drawLogo, replaceZ } from "../utils";

const doDraw: DrawFun = async (img, config, context) => {
	const { logo: logoConfig, watermark } = config;
	const {
		params: paramsConfig,
		time: timeConfig,
		model: modelConfig,
	} = watermark;
	const { ctx, canvas, rect1, rect2 } = context;

	const centerX = (rect1.x + rect2.x) / 2;
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
			? replaceZ(img.modelText)
			: img.modelText;

		// 计算宽度
		const modelWidth = ctx.measureText(_modelText).width;
		const space = 0.02 * canvas.width; // 图标和型号之间的间隔
		totalWidth = modelWidth + logoConfig.width + space;

		let _x = centerX;
		if (logoConfig.show) {
			ctx.textAlign = "left";
			_x = centerX - totalWidth / 2 + logoConfig.width + space;
		}

		let _y = rect1.y + (rect2.y - rect1.y) / 3;
		if (!paramsConfig.show && !timeConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}

		// 绘制辅助线
		// ctx.strokeStyle = "#FFF";
		// ctx.lineWidth = 3;
		// ctx.beginPath();
		// ctx.moveTo(0, _y);
		// ctx.lineTo(canvas.width, _y);
		// ctx.stroke();

		ctx.fillText(_modelText, _x, _y);
		ctx.restore();
	}

	if (logoConfig.show) {
		let logoX = centerX - logoConfig.width / 2;
		if (modelConfig.show) {
			logoX = centerX - totalWidth / 2;
		}

		let logoY = rect1.y + (rect2.y - rect1.y) / 3 - logoConfig.height / 2;
		if (!timeConfig.show && !paramsConfig.show) {
			// 时间和参数都不显示
			logoY = rect1.y + (rect2.y - rect1.y) / 2 - logoConfig.height / 2;
		} else if (!paramsConfig.show || !timeConfig.show) {
			// 不显示时间或者不显示参数
			logoY = rect1.y + (rect2.y - rect1.y) / 3 - logoConfig.height / 2;
		}

		logoY -= (logoConfig.verticalOffset - 1) * logoConfig.height;

		// 绘制logo范围辅助线
		// ctx.strokeStyle = "#F00";
		// ctx.lineWidth = 15;
		// ctx.strokeRect(logoX, logoY, logoConfig.width, logoConfig.height);

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

		let _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		if (!logoConfig.show && !timeConfig.show && !modelConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}
		ctx.fillText(img.paramsText, centerX, _y);
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
		ctx.fillText(img.timeText, centerX, _y);
	}
};

const config: Config = {
	name: "经典模糊",
	font: "sans-serif",
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
			italic: false, // 斜体
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
			bold: false,
		},
		time: {
			enable: true,
			show: false,
			color: "#FFF",
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
		size: 100,
		uniform: true,
		lt: 100,
		rt: 100,
		lb: 100,
		rb: 100,
	},
	blur: {
		type: "blur",
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
		show: true,
		color: "#000",
		x: 0,
		y: 0,
		size: 100,
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
