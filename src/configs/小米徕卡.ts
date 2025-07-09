import { defaultConfig } from "../assets/tools";
import type { Config, DrawFun } from "../types";
import { drawLogo, replaceZ, setTextCtx } from "../utils";

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

	const texts = [];

	// 绘制型号
	if (modelConfig.show) {
		ctx.save();
		const { drawTextFunc } = setTextCtx(ctx, modelConfig);
		let _y = rect1.y + (rect2.y - rect1.y) / 2;
		if (lensConfig.show || (locationConfig?.show && timeConfig.show)) {
			_y = rect1.y + (rect2.y - rect1.y) / 3;
		}

		let modelText = modelConfig.replaceZ
			? replaceZ(img.modelText)
			: img.modelText;
		if (modelConfig?.letterUpperCase) {
			modelText = modelText.toUpperCase();
		}

		const modelX = rect1.x + watermarkPaddings.left + (modelConfig.x || 0);
		const modelY = _y + (modelConfig.y || 0);
		drawTextFunc(modelText, modelX, modelY);

		texts.push({
			_x: modelX,
			_y: modelY,
			...modelConfig,
			text: modelText,
		});
		ctx.restore();
	}
	// 在水印范围内垂直居中
	const _y = (rect2.y + rect1.y) / 2;
	// 参数的宽度
	let paramsWidth = 0;

	// 绘制参数
	if (paramsConfig.show) {
		const { drawTextFunc } = setTextCtx(ctx, paramsConfig, "right");

		let paramsText =
			paramsConfig?.text ||
			`${focalLength}mm  f/${img.exif?.FNumber}  ${exposureTime}s  ISO${img.exif.ISO}`;
		// 处理大写
		if (paramsConfig.letterUpperCase) {
			paramsText = paramsText.toUpperCase();
		}

		paramsWidth = ctx.measureText(paramsText).width;

		const modelX = rect2.x - watermarkPaddings.right + (paramsConfig?.x || 0);
		let _y =
			rect1.y +
			(rect2.y - rect1.y) / (timeConfig.show || locationConfig?.show ? 3 : 2) +
			(paramsConfig?.y || 0);

		drawTextFunc(paramsText, modelX, _y);
		texts.push({
			_x: modelX,
			_y,
			...paramsConfig,
			text: paramsText,
		});
	}

	let lensWidth = 0;
	// 绘制镜头
	if (lensConfig.show) {
		ctx.save();
		const text = img.lensText;
		const { drawTextFunc } = setTextCtx(ctx, lensConfig, "left", "top");

		let _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		if (!modelConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
			ctx.textBaseline = "middle";
		}
		lensWidth = ctx.measureText(text).width;
		drawTextFunc(
			text,
			rect1.x + watermarkPaddings.left + (lensConfig.x || 0),
			_y + (lensConfig.y || 0)
		);
		ctx.restore();
		texts.push({
			text: img.lensText,
			_x: rect1.x + watermarkPaddings.left + (lensConfig.x || 0),
			_y: _y + (lensConfig.y || 0),
			...lensConfig,
		});
	}

	// 绘制时间
	let timeWidth = 0;
	if (timeConfig.show) {
		ctx.save();

		const wPadding = paramsConfig.show
			? watermarkPaddings.left
			: watermarkPaddings.right;
		let _x = paramsConfig.show
			? rect2.x - wPadding - paramsWidth
			: rect2.x - wPadding;
		const _y =
			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);

		const { drawTextFunc } = setTextCtx(
			ctx,
			timeConfig,
			paramsConfig.show ? "left" : "right",
			paramsConfig.show ? "top" : "middle"
		);

		timeWidth = ctx.measureText(img.timeText).width;

		if (!locationConfig?.show) {
			drawTextFunc(
				img.timeText,
				_x + (timeConfig.x || 0),
				_y + (timeConfig.y || 0)
			);
		} else {
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			let _x = rect1.x + watermarkPaddings.left;
			if (lensConfig.show) {
				const SPACE = 50;
				_x += lensWidth + SPACE * dividerConfig.margin;
			}
			drawTextFunc(
				img.timeText,
				_x + (timeConfig.x || 0),
				_y + (timeConfig.y || 0)
			);
		}
		ctx.restore();
		texts.push({
			text: img.timeText,
			_x: _x + (timeConfig.x || 0),
			_y: _y + (timeConfig.y || 0),
			...timeConfig,
		});
	}

	const space = paramsConfig.size * dividerConfig.margin;

	// 计算横坐标
	const _x =
		rect2.x -
		watermarkPaddings.right -
		Math.max(paramsWidth, timeWidth) -
		space;
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
		const { drawTextFunc } = setTextCtx(ctx, locationConfig, "left", "top");

		const text = img.locationText;

		const _x = paramsConfig.show
			? rect2.x - watermarkPaddings.right - paramsWidth
			: rect2.x - watermarkPaddings.right;
		const _y =
			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);

		drawTextFunc(text, _x, _y, locationConfig.x, locationConfig.y);
		ctx.restore();
		texts.push({
			text: text,
			_x,
			_y,
			...locationConfig,
		});
	}

	const retConfig = { texts };
	console.log("retConfig", retConfig);
	return retConfig;
};

const config: Config = {
	...defaultConfig,
	name: "小米徕卡",
	font: "sans-serif",
	paddings: {
		top: 0,
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
			replaceZ: true,
			show: true,
			color: "#000000",
			size: 110,
			italic: false,
			bold: true,
			align: "left",
			verticalAlign: "middle",
			font: "sans-serif",
		},
		params: {
			enable: true,
			show: true,
			color: "#000000",
			size: 90,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
			bold: true,
			x: 0,
			y: 0,
			align: "right",
			verticalAlign: "middle",
		},
		time: {
			enable: true,
			show: false,
			color: "#808080",
			size: 60,
			format: "YYYY.MM.DD  HH:mm:ss",
			italic: false,
			bold: false,
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
			top: 120,
			bottom: 120,
			left: 120,
			right: 120,
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
		type: "color",
		size: 1000,
		gradient: {
			angle: 0,
			colors: ["pink", "white", "lightblue"],
		},
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
