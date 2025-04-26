import type { Config, DrawFun } from "../types";
import { drawLogo, replaceZ } from "../utils";

const doDraw: DrawFun = async (img, config, context) => {
	const {
		watermark,
		divider: dividerConfig,
		logo: logoConfig,
		location: locationConfig,
	} = config;
	const {
		model: modelConfig,
		params: paramsConfig,
		time: timeConfig,
		lens: lensConfig,
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, rect1, rect2, focalLength, exposureTime } = context;

	// 绘制型号
	if (modelConfig.show) {
		ctx.save(); // 保存当前绘图状态
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
			modelConfig.bold ? "bold" : ""
		} ${modelConfig.size}px ${config.font || "sans-serif"}`;
		ctx.fillStyle = modelConfig.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		let _y = rect1.y + (rect2.y - rect1.y) / 2;
		if (lensConfig.show || (locationConfig?.show && timeConfig.show)) {
			_y = rect1.y + (rect2.y - rect1.y) / 3;
		}
		// 截取厂商
		const company = img.modelText?.split(" ")[0];
		// 计算厂商的宽度
		const companyWidth = ctx.measureText(company).width;

		ctx.fillText(company, rect1.x + watermarkPaddings.lr, _y);

		ctx.font = `${modelConfig.size}px ${config.font || "sans-serif"}`;
		const modelText = modelConfig.replaceZ
			? replaceZ(img.modelText)
			: img.modelText;
		ctx.fillText(
			modelText.replace(company, ""),
			rect1.x + watermarkPaddings.lr + companyWidth,
			_y
		);
		ctx.restore(); // 恢复之前的绘图状态
	}
	// 在水印范围内垂直居中
	const _y = (rect2.y + rect1.y) / 2;
	// 参数的宽度
	let paramsWidth = 0;

	// 绘制参数
	if (paramsConfig.show) {
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `bold ${paramsConfig.italic ? "Italic" : ""} ${
			paramsConfig.size
		}px ${config.font || "sans-serif"}`;

		let paramsText =
			paramsConfig?.text ||
			`${focalLength}mm  f/${img.exif?.FNumber}  ${exposureTime}s  ISO${img.exif.ISO}`;
		paramsConfig.letterUpperCase && (paramsText = paramsText.toUpperCase());
		paramsWidth = ctx.measureText(paramsText).width;

		let _y =
			rect1.y +
			(rect2.y - rect1.y) / (timeConfig.show || locationConfig?.show ? 3 : 2);
		ctx.fillText(paramsText, rect2.x - watermarkPaddings.lr, _y);
	}

	let lensWidth = 0;
	// 绘制镜头
	if (lensConfig.show) {
		ctx.save();
		const text = lensConfig.text || img.exif?.LensModel;
		ctx.textAlign = "left";
		ctx.fillStyle = lensConfig.color;
		ctx.font = `${lensConfig.bold ? "bold" : ""} ${
			lensConfig.italic ? "italic" : ""
		} ${lensConfig.size}px ${config.font}`;
		ctx.textBaseline = "top";

		let _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		if (!modelConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
			ctx.textBaseline = "middle";
		}
		lensWidth = ctx.measureText(text).width;
		ctx.fillText(text, rect1.x + watermarkPaddings.lr, _y);
		ctx.restore();
	}

	// 绘制时间
	let timeWidth = 0;
	if (timeConfig.show) {
		ctx.save();
		ctx.textAlign = paramsConfig.show ? "left" : "right";
		let _x = paramsConfig.show
			? rect2.x - watermarkPaddings.lr - paramsWidth
			: rect2.x - watermarkPaddings.lr;
		const _y =
			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);
		ctx.textBaseline = paramsConfig.show ? "top" : "middle";
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;

		timeWidth = ctx.measureText(img.timeText).width;

		if (!locationConfig?.show) {
			ctx.fillText(img.timeText, _x, _y);
		} else {
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			let _x = rect1.x + watermarkPaddings.lr;
			if (lensConfig.show) {
				const SPACE = 50;
				_x += lensWidth + SPACE * dividerConfig.margin;
			}
			ctx.fillText(img.timeText, _x, _y);
		}
		ctx.restore();
	}

	const space = paramsConfig.size * dividerConfig.margin;

	// 计算横坐标
	const _x =
		rect2.x - watermarkPaddings.lr - Math.max(paramsWidth, timeWidth) - space;
	const logoX = _x - space - logoConfig.width;
	// 计算纵坐标
	const logoY =
		_y -
		logoConfig.height / 2 -
		(logoConfig.verticalOffset - 1) * logoConfig.height;

	// 绘制LOGO
	if (logoConfig.show) {
		drawLogo(logoConfig, ctx, logoX, logoY);
	}

	// 绘制分割线
	const centerY = rect1.y + (rect2.y - rect1.y) / 2;
	if (dividerConfig.show) {
		ctx.strokeStyle = dividerConfig.color;
		ctx.lineWidth = dividerConfig.width;

		const _h =
			Math.min(logoConfig.height, paramsConfig.size) * dividerConfig.scale;

		ctx.beginPath();
		ctx.moveTo(_x, centerY - _h / 2);
		ctx.lineTo(_x, centerY + _h / 2);
		ctx.stroke();
	}

	// 绘制位置
	if (locationConfig?.show) {
		ctx.save();
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillStyle = locationConfig.color;
		ctx.font = `${locationConfig.bold ? "bold" : ""} ${
			locationConfig.italic ? "italic" : ""
		} ${locationConfig.size}px ${config.font}`;

		const text = locationConfig.text || img.locationText;

		const _x = paramsConfig.show
			? rect2.x - watermarkPaddings.lr - paramsWidth
			: rect2.x - watermarkPaddings.lr;
		const _y =
			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);

		ctx.fillText(text, _x, _y);
		ctx.restore();
	}
};

const config: Config = {
	name: "小米徕卡",
	font: "sans-serif",
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		position: "bottom",
		height: 0.1,
		bgColor: "#FFF",
		model: {
			enable: true,
			show: true,
			color: "#000000",
			size: 110,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "#000000",
			size: 90,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
		},
		time: {
			enable: true,
			show: false,
			color: "#808080",
			size: 60,
			format: "YYYY.MM.DD  HH:mm:ss",
		},
		lens: {
			enable: true,
			show: false,
			color: "#808080",
			size: 60,
			italic: false,
			bold: false,
			text: "",
		},
		paddings: {
			lr: 120,
			tb: 120,
		},
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
		size: 1000,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		width: 180,
		height: 180,
		name: "leica",
		circle: false,
		verticalOffset: 1,
	},
	divider: {
		enable: true,
		show: true,
		color: "rgb(208, 208, 208)",
		width: 10,
		scale: 2,
		margin: 1,
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 0,
		y: 0,
		size: 100,
	},
	location: {
		enable: true,
		show: false,
		color: "#808080",
		size: 60,
		italic: false,
		bold: false,
		text: "",
	},
	labels: [],
	images: [],
	draw: doDraw,
};

export default config;
