import type { Config, DrawFun } from "../types";
import { convertExposureTime, drawLogo } from "../utils";

const doDraw: DrawFun = (img, config, context) => {
	const { watermark, divider: dividerConfig, logo: logoConfig } = config;
	const {
		model: modelConfig,
		paddings: watermarkPaddings,
		params: paramsConfig,
		time: timeConfig,
	} = watermark;
	const { ctx, rect1, rect2 } = context;

	// 绘制型号
	const _x = rect1.x + watermarkPaddings.lr;
	const _y = rect1.y + (rect2.y - rect1.y) / 2;
	let modelWidth = 0;
	if (modelConfig.show) {
		ctx.save();
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
			modelConfig.bold ? "bold" : ""
		} ${modelConfig.size}px ${config.font || "Arial"}`;
		ctx.fillStyle = modelConfig.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		const text = modelConfig.replaceZ
			? img.modelText.replace(/z|Z/g, "ℤ")
			: img.modelText;
		ctx.fillText(text, _x, _y);
		modelWidth = ctx.measureText(text).width;
		ctx.restore();
	}

	// 绘制分割线
	let dividerWidth = 0;
	const centerY = rect1.y + (rect2.y - rect1.y) / 2;
	if (dividerConfig.show) {
		ctx.save();
		ctx.strokeStyle = dividerConfig.color;
		ctx.lineWidth = dividerConfig.width;

		const SPACE = 100;
		const dividerX = _x + modelWidth + dividerConfig.margin * SPACE;
		dividerWidth =
			dividerX + dividerConfig.margin * SPACE + dividerConfig.width / 2;
		const start = {
			x: dividerX,
			y: centerY - (modelConfig.size / 2) * dividerConfig.scale,
		};
		const end = {
			x: dividerX,
			y: centerY + (modelConfig.size / 2) * dividerConfig.scale,
		};
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		ctx.restore();
	}

	// 绘制Logo
	if (logoConfig.show) {
		const logoX = dividerConfig.show ? dividerWidth : _x + modelWidth;
		const logoY = centerY - logoConfig.height / 2;
		drawLogo(logoConfig, ctx, logoX, logoY);
	}

	// 绘制参数
	if (paramsConfig.show) {
		ctx.save();
		ctx.font = `${paramsConfig.italic ? "Italic" : ""} ${paramsConfig.size}px ${
			config.font || "Arial"
		}`;
		ctx.fillStyle = paramsConfig.color;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";

		const paramsX = rect2.x - watermarkPaddings.lr;
		let paramsY = centerY;
		if (timeConfig.show) {
			paramsY = rect1.y + (rect2.y - rect1.y) / 3;
		}

		let text = `${
			paramsConfig.useEquivalentFocalLength
				? img.exif.FocalLengthIn35mmFormat || img.exif.FocalLength
				: img.exif.FocalLength
		}mm f/${img.exif.FNumber} ${convertExposureTime(
			img.exif.ExposureTime
		)}s ISO${img.exif.ISO}`;
		text = paramsConfig.letterUpperCase ? text.toUpperCase() : text;
		ctx.fillText(text, paramsX, paramsY);
	}

	// 绘制时间
	if (timeConfig.show) {
		ctx.save();
		ctx.font = `${timeConfig.size}px ${config.font || "Arial"}`;
		ctx.fillStyle = timeConfig.color;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";

		const timeY = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		ctx.fillText(
			img.timeText,
			rect2.x - watermarkPaddings.lr,
			paramsConfig.show ? timeY : centerY
		);
	}
};

const config: Config = {
	name: "蔡司水印",
	font: "微软雅黑",
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		height: 0.1,
		model: {
			enable: true,
			show: true,
			color: "#000000",
			size: 120,
			replaceZ: true,
			italic: false, // 斜体
			bold: true, // 加粗
		},
		params: {
			enable: true,
			show: true,
			color: "#000",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
		},
		time: {
			enable: true,
			show: true,
			color: "#808080",
			size: 80,
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
			lr: 100,
			tb: 100,
		},
		bgColor: "#fff",
	},
	radius: {
		enable: true,
		show: false,
		size: 100,
		uniform: true,
		lt: 100,
		rt: 100,
		lb: 100,
		rb: 100,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		name: "zeiss",
		width: 200,
		height: 200,
		verticalOffset: 1,
		circle: false,
	},
	divider: {
		enable: true,
		show: true,
		color: "#808080",
		width: 3,
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
	draw: doDraw,
};

export default config;
