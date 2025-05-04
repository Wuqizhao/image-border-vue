import type { Config, DrawFun } from "../types";
import { drawLogo, replaceZ } from "../utils";
const doDraw: DrawFun = async (img, config, context) => {
	const { watermark, logo: logoConfig } = config;
	const {
		model: modelConfig,
		params: paramsConfig,
		time: timeConfig,
		paddings: watermarkPaddings,
		lens: lensConfig,
	} = watermark;
	const { ctx, rect1, rect2 } = context;

	// 绘制Logo
	if (logoConfig.show) {
		const logoX = rect1.x + watermarkPaddings.lr;
		const _y =
			rect1.y +
			(rect2.y - rect1.y) / 2 -
			logoConfig.height / 2 -
			(logoConfig.verticalOffset - 1) * logoConfig.height;
		drawLogo(logoConfig, ctx, logoX, _y);
	}

	const SPACE = 0.2 * logoConfig.width;
	const _x =
		rect1.x +
		watermarkPaddings.lr +
		(logoConfig.show ? logoConfig.width + SPACE : 0);
	// 绘制型号
	if (modelConfig.show) {
		ctx.save();
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
			modelConfig.bold ? "bold" : ""
		} ${modelConfig.size}px ${config.font || "sans-serif"}`;
		ctx.fillStyle = modelConfig.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		let _y = 0;
		if (!paramsConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		} else {
			_y = rect1.y + (rect2.y - rect1.y) / 4;
		}
		// 截取厂商
		const company = img.modelText.split(" ")[0];
		// 计算厂商的宽度
		const companyWidth = ctx.measureText(company).width;
		ctx.fillText(company, _x, _y);
		ctx.font = `${modelConfig.size}px ${config.font}`;
		let modelText = img.modelText.replace(company, "");
		modelText = modelConfig.replaceZ ? replaceZ(modelText) : modelText;
		ctx.fillText(modelText, _x + companyWidth, _y);
		ctx.restore(); // 恢复之前的绘图状态
	}

	// 绘制曝光三要素和焦段参数
	if (paramsConfig.show) {
		ctx.save();
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `${paramsConfig.italic ? "Italic" : ""} ${paramsConfig.size}px ${
			config.font
		}`;
		ctx.textBaseline = "middle";

		let _y = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		if (!modelConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}
		ctx.fillText(
			paramsConfig.letterUpperCase
				? img.paramsText.toLocaleUpperCase()
				: img.paramsText,
			_x,
			_y
		);
		ctx.restore();
	}

	// 绘制镜头信息
	if (lensConfig.show) {
		ctx.save();
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = lensConfig.color;
		ctx.font = `${lensConfig.bold ? "bold" : ""} ${
			lensConfig.italic ? "italic" : ""
		} ${lensConfig.size}px ${config.font}`;

		let _y = rect1.y + (rect2.y - rect1.y) / 4;
		if (!timeConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}
		ctx.fillText(
			lensConfig.text || img.exif?.LensModel,
			rect2.x - watermarkPaddings.lr,
			_y
		);

		ctx.restore();
	}

	// 绘制拍摄时间
	if (timeConfig.show) {
		ctx.save();
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;
		// 在水印范围内垂直居中
		let _y = (rect2.y + rect1.y) / 2;
		if (lensConfig.show) {
			_y = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		}
		ctx.fillText(img.timeText, rect2.x - watermarkPaddings.lr, _y);
		ctx.restore();
	}
};

const config: Config = {
	name: "默认样式",
	font: "sans-serif",
	paddings: {
		top: 100, // 图片上边距
		right: 100,
		left: 100,
		bottom: 0,
	},
	watermark: {
		height: 0.13,
		model: {
			enable: true,
			show: true,
			color: "#000000",
			size: 150,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "#808080",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
		},
		time: {
			enable: true,
			show: true,
			color: "#808080",
			size: 100,
			format: "YYYY-MM-DD HH:mm",
		},
		lens: {
			enable: true,
			show: false,
			color: "#808080",
			size: 100,
			italic: false,
			bold: false,
			text: "",
		},
		paddings: {
			lr: 0,
			tb: 100,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		show: true,
		size: 80,
		uniform: true,
		lt: 80,
		rt: 80,
		lb: 80,
		rb: 80,
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
		width: 700,
		height: 700,
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
