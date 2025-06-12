import type { Config, DrawFun } from "../types";
import { drawLogo, replaceZ } from "../utils";
const doDraw: DrawFun = async (img, config, context) => {
	const { watermark, logo: logoConfig } = config;
	const {
		model: modelConfig,
		time: timeConfig,
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, rect1, rect2 } = context;

	let _y = rect2.y;

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
		} ${modelConfig.size}px ${config.font || "sans-serif"}`;
		ctx.fillStyle = modelConfig.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		// 截取厂商
		const company = img.modelText.split(" ")[0];
		// 计算厂商的宽度
		const companyWidth = ctx.measureText(company).width;
		ctx.fillText(company, rect1.x + watermarkPaddings.left, _y);
		ctx.font = `${modelConfig.size}px ${config.font}`;
		let modelText = img.modelText.replace(company, "");
		modelText = modelConfig.replaceZ ? replaceZ(modelText) : modelText;
		ctx.fillText(
			modelText,
			rect1.x + watermarkPaddings.left + companyWidth,
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
		ctx.fillText(img.timeText, rect2.x - watermarkPaddings.right, _y);
		ctx.restore();
	}

	if (logoConfig.show) {
		const logoX = rect1.x + (rect2.x - rect1.x) / 2 - logoConfig.width / 2;
		const logoY =
			_y -
			logoConfig.height / 2 -
			(logoConfig.verticalOffset - 1) * logoConfig.height;

		drawLogo(logoConfig, ctx, logoX, logoY);
	}
};

const config: Config = {
	name: "时间+型号",
	font: "sans-serif",
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		position: "inner",
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
			top: 300,
			bottom: 300,
			left: 150,
			right: 150,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		show: false,
		size: 80,
		uniform: true,
		lt: 80,
		rt: 80,
		lb: 80,
		rb: 80,
	},
	blur: {
		type: "color",
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
