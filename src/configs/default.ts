import type { Config, DrawFun } from "../types";
const doDraw: DrawFun = (img, config, context) => {
	const { watermark, paddings: imgPaddings } = config;
	const {
		model: modelConfig,
		params: paramsConfig,
		time: timeConfig,
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, canvas, rect1, rect2 } = context;

	// 绘制型号
	if (modelConfig.show) {
		ctx.save();
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
			modelConfig.bold ? "bold" : ""
		} ${modelConfig.size}px Arial`;
		ctx.fillStyle = modelConfig.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		// 顶着线
		const _y = rect1.y + (rect2.y - rect1.y) / 4;
		// 截取厂商
		const company = img.modelText.split(" ")[0];
		// 计算厂商的宽度
		const companyWidth = ctx.measureText(company).width;
		ctx.fillText(company, imgPaddings.left + config.watermark.paddings.lr, _y);
		ctx.font = `${modelConfig.size}px Arial`;
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

	// 绘制曝光三要素和焦段参数
	if (paramsConfig.show) {
		ctx.save();
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `${paramsConfig.size}px Arial`;
		ctx.textBaseline = "middle";

		const _y = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		ctx.fillText(
			paramsConfig.letterUpperCase
				? img.paramsText.toLocaleUpperCase()
				: img.paramsText,
			imgPaddings.left + watermarkPaddings.lr,
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
		ctx.font = `${timeConfig.size}px Arial`;
		// 在水印范围内垂直居中
		const _y = (rect2.y + rect1.y) / 2;
		ctx.fillText(
			img.timeText,
			canvas.width - imgPaddings.right - watermarkPaddings.lr,
			_y
		);
		ctx.restore();
	}

	// 绘制范围
	// ctx.lineWidth = 5;
	// ctx.strokeRect(rect1.x, rect1.y, rect2.x - rect1.x, rect2.y - rect1.y);
	// ctx.strokeStyle = "#FF0000";
	// ctx.beginPath();
	// ctx.moveTo(rect1.x, rect1.y + (rect2.y - rect1.y)/2);
	// ctx.lineTo(rect2.x, rect1.y + (rect2.y - rect1.y)/2);
	// ctx.stroke();
};

const config: Config = {
	paddings: {
		top: 100, // 图片上边距
		right: 100,
		left: 100,
		bottom: 0,
	},
	watermark: {
		model: {
			show: true,
			color: "#000000",
			size: 150,
			replaceZ: true,
			italic: true,
			bold: true,
		},
		params: {
			show: true,
			color: "#808080",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			show: true,
			color: "#808080",
			size: 110,
			format: "yyyy-MM-dd HH:mm",
		},
		paddings: {
			lr: 0,
			tb: 100,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		size: 80,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: false,
		auto: false,
		show: false,
		name: "leica",
		width: 40,
		height: 40,
	},
	divider: {
		enable: false,
		show: false,
		color: "#808080",
		width: 2,
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 20,
		y: 20,
		size: 2,
	},
	draw: doDraw,
};

export default config;
