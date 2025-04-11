import type { Config, DrawFun } from "../types";
import { drawLogo } from "../utils";
const doDraw: DrawFun = async (img, config, context) => {
	const { watermark, paddings: imgPaddings, logo: logoConfig } = config;
	const {
		model: modelConfig,
		time: timeConfig,
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, canvas } = context;

	let _y =
		canvas.height -
		watermarkPaddings.tb -
		imgPaddings.bottom -
		0.07 * img.height;

	// 绘制辅助线
	// ctx.beginPath();
	// ctx.moveTo(0, _y);
	// ctx.lineTo(canvas.width, _y);
	// ctx.strokeStyle = "#FF0000";
	// ctx.lineWidth = 10;
	// ctx.stroke();

	// 绘制型号
	if (modelConfig.show) {
		ctx.save();
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
			modelConfig.bold ? "bold" : ""
		} ${modelConfig.size}px ${config.font || "Arial"}`;
		ctx.fillStyle = modelConfig.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		// 截取厂商
		const company = img.modelText.split(" ")[0];
		// 计算厂商的宽度
		const companyWidth = ctx.measureText(company).width;
		ctx.fillText(company, imgPaddings.left + config.watermark.paddings.lr, _y);
		ctx.font = `${modelConfig.size}px ${config.font}`;
		let modelText = img.modelText.replace(company, "");
		modelText = modelConfig.replaceZ
			? modelText.replace(/Z|z/, "ℤ")
			: modelText;
		ctx.fillText(
			modelText,
			imgPaddings.left + watermarkPaddings.lr + companyWidth,
			_y
		);
		ctx.restore(); // 恢复之前的绘图状态
	}

	// 绘制拍摄时间
	if (timeConfig.show) {
		ctx.save();
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;
		ctx.fillText(
			img.timeText,
			canvas.width - imgPaddings.right - watermarkPaddings.lr,
			_y
		);
		ctx.restore();
	}

	if (logoConfig.show) {
		const logoX = canvas.width / 2 - logoConfig.width / 2;
		const logoY =
			_y -
			logoConfig.height / 2 -
			(logoConfig.verticalOffset - 1) * logoConfig.height;

		drawLogo(config, ctx, logoX, logoY);
	}
};

const config: Config = {
	name: "时间+型号",
	font: "微软雅黑",
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		height: 0,
		model: {
			enable: true,
			show: true,
			color: "#FFFFFF",
			size: 120,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: false,
			show: false,
			color: "#FFFFFF",
			size: 80,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
		},
		time: {
			enable: true,
			show: true,
			color: "#FFFFFF",
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
			lr: 150,
			tb: 0,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		show: false,
		position: ["lt", "rt", "lb", "rb"],
		size: 80,
	},
	blur: {
		enable: false,
		size: 1000,
	},
	logo: {
		enable: true,
		auto: true,
		show: false,
		name: "leica",
		width: 250,
		height: 250,
		circle: false,
		verticalOffset: 1,
	},
	divider: {
		enable: false,
		show: false,
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
	draw: doDraw,
};

export default config;
