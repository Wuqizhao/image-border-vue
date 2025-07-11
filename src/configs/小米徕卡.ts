import {
	Rect,
	Text,
	type Leafer,
	type IImagePaint,
	Line,
	type IText,
} from "leafer-ui";
import { defaultConfig } from "../assets/tools";
import type { Config, Context, Img } from "../types";
import { formatFont, getImageSrc } from "../utils";

// const doDraw: DrawFun = async (img, config, context) => {
// 	const {
// 		watermark,
// 		divider: dividerConfig,
// 		logo: logoConfig,
// 		location: locationConfig,
// 	} = config;
// 	const {
// 		model: modelConfig,
// 		params: paramsConfig,
// 		time: timeConfig,
// 		lens: lensConfig,
// 		paddings: watermarkPaddings,
// 	} = watermark;
// 	const { ctx, rect1, rect2, focalLength, exposureTime } = context;

// 	const texts = [];

// 	// 绘制型号
// 	if (modelConfig.show) {
// 		ctx.save();
// 		const { drawTextFunc } = setTextCtx(ctx, modelConfig);
// 		let _y = rect1.y + (rect2.y - rect1.y) / 2;
// 		if (lensConfig.show || (locationConfig?.show && timeConfig.show)) {
// 			_y = rect1.y + (rect2.y - rect1.y) / 3;
// 		}

// 		let modelText = modelConfig.replaceZ
// 			? replaceZ(img.modelText)
// 			: img.modelText;
// 		if (modelConfig?.letterUpperCase) {
// 			modelText = modelText.toUpperCase();
// 		}

// 		const modelX = rect1.x + watermarkPaddings.left + (modelConfig.x || 0);
// 		const modelY = _y + (modelConfig.y || 0);
// 		drawTextFunc(modelText, modelX, modelY);

// 		texts.push({
// 			_x: modelX,
// 			_y: modelY,
// 			...modelConfig,
// 			text: modelText,
// 		});
// 		ctx.restore();
// 	}
// 	// 在水印范围内垂直居中
// 	const _y = (rect2.y + rect1.y) / 2;
// 	// 参数的宽度
// 	let paramsWidth = 0;

// 	// 绘制参数
// 	if (paramsConfig.show) {
// 		const { drawTextFunc } = setTextCtx(ctx, paramsConfig, "right");

// 		let paramsText =
// 			paramsConfig?.text ||
// 			`${focalLength}mm  f/${img.exif?.FNumber}  ${exposureTime}s  ISO${img.exif.ISO}`;
// 		// 处理大写
// 		if (paramsConfig.letterUpperCase) {
// 			paramsText = paramsText.toUpperCase();
// 		}

// 		paramsWidth = ctx.measureText(paramsText).width;

// 		const modelX = rect2.x - watermarkPaddings.right + (paramsConfig?.x || 0);
// 		let _y =
// 			rect1.y +
// 			(rect2.y - rect1.y) / (timeConfig.show || locationConfig?.show ? 3 : 2) +
// 			(paramsConfig?.y || 0);

// 		drawTextFunc(paramsText, modelX, _y);
// 		texts.push({
// 			_x: modelX,
// 			_y,
// 			...paramsConfig,
// 			text: paramsText,
// 		});
// 	}

// 	let lensWidth = 0;
// 	// 绘制镜头
// 	if (lensConfig.show) {
// 		ctx.save();
// 		const text = img.lensText;
// 		const { drawTextFunc } = setTextCtx(ctx, lensConfig, "left", "top");

// 		let _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
// 		if (!modelConfig.show) {
// 			_y = rect1.y + (rect2.y - rect1.y) / 2;
// 			ctx.textBaseline = "middle";
// 		}
// 		lensWidth = ctx.measureText(text).width;
// 		drawTextFunc(
// 			text,
// 			rect1.x + watermarkPaddings.left + (lensConfig.x || 0),
// 			_y + (lensConfig.y || 0)
// 		);
// 		ctx.restore();
// 		texts.push({
// 			text: img.lensText,
// 			_x: rect1.x + watermarkPaddings.left + (lensConfig.x || 0),
// 			_y: _y + (lensConfig.y || 0),
// 			...lensConfig,
// 		});
// 	}

// 	// 绘制时间
// 	let timeWidth = 0;
// 	if (timeConfig.show) {
// 		ctx.save();

// 		const wPadding = paramsConfig.show
// 			? watermarkPaddings.left
// 			: watermarkPaddings.right;
// 		let _x = paramsConfig.show
// 			? rect2.x - wPadding - paramsWidth
// 			: rect2.x - wPadding;
// 		const _y =
// 			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);

// 		const { drawTextFunc } = setTextCtx(
// 			ctx,
// 			timeConfig,
// 			paramsConfig.show ? "left" : "right",
// 			paramsConfig.show ? "top" : "middle"
// 		);

// 		timeWidth = ctx.measureText(img.timeText).width;

// 		if (!locationConfig?.show) {
// 			drawTextFunc(
// 				img.timeText,
// 				_x + (timeConfig.x || 0),
// 				_y + (timeConfig.y || 0)
// 			);
// 		} else {
// 			ctx.textAlign = "left";
// 			ctx.textBaseline = "top";
// 			let _x = rect1.x + watermarkPaddings.left;
// 			if (lensConfig.show) {
// 				const SPACE = 50;
// 				_x += lensWidth + SPACE * dividerConfig.margin;
// 			}
// 			drawTextFunc(
// 				img.timeText,
// 				_x + (timeConfig.x || 0),
// 				_y + (timeConfig.y || 0)
// 			);
// 		}
// 		ctx.restore();
// 		texts.push({
// 			text: img.timeText,
// 			_x: _x + (timeConfig.x || 0),
// 			_y: _y + (timeConfig.y || 0),
// 			...timeConfig,
// 		});
// 	}

// 	const space = paramsConfig.size * dividerConfig.margin;

// 	// 计算横坐标
// 	const _x =
// 		rect2.x -
// 		watermarkPaddings.right -
// 		Math.max(paramsWidth, timeWidth) -
// 		space;
// 	const logoX = _x - space - logoConfig.width;
// 	// 计算纵坐标
// 	const logoY =
// 		_y -
// 		logoConfig.height / 2 -
// 		(logoConfig.verticalOffset - 1) * logoConfig.height;

// 	// 绘制LOGO
// 	if (logoConfig.show) {
// 		drawLogo(logoConfig, ctx, logoX, logoY);
// 	}

// 	// 绘制分割线
// 	const centerY = rect1.y + (rect2.y - rect1.y) / 2;
// 	if (dividerConfig.show) {
// 		ctx.strokeStyle = dividerConfig.color;
// 		ctx.lineWidth = dividerConfig.width;

// 		const _h =
// 			Math.min(logoConfig.height, paramsConfig.size) * dividerConfig.scale;

// 		ctx.beginPath();
// 		ctx.moveTo(_x, centerY - _h / 2);
// 		ctx.lineTo(_x, centerY + _h / 2);
// 		ctx.stroke();
// 	}

// 	// 绘制位置
// 	if (locationConfig?.show) {
// 		ctx.save();
// 		const { drawTextFunc } = setTextCtx(ctx, locationConfig, "left", "top");

// 		const text = img.locationText;

// 		const _x = paramsConfig.show
// 			? rect2.x - watermarkPaddings.right - paramsWidth
// 			: rect2.x - watermarkPaddings.right;
// 		const _y =
// 			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);

// 		drawTextFunc(text, _x, _y, locationConfig.x, locationConfig.y);
// 		ctx.restore();
// 		texts.push({
// 			text: text,
// 			_x,
// 			_y,
// 			...locationConfig,
// 		});
// 	}

// 	const retConfig = { texts };
// 	console.log("retConfig", retConfig);
// 	return retConfig;
// };

const caculate = async (
	leafer: Leafer,
	config: Config,
	img: Img,
	context: Context
) => {
	if (!leafer) throw new Error("leafer is null");
	const { logo, watermark, divider, location } = config;
	const { model, params, paddings: watermarkPaddings, time, lens } = watermark;
	const { rect1, rect2 } = context;
	const centerY = (rect1.y + rect2.y) / 2;
	const font = formatFont(config.font);
	const SPACE = 100;

	// 计算型号
	const modelEl = leafer.findOne("#model");
	if (model.enable && model.show) {
		const _y = lens.show ? rect1.y + (rect2.y - rect1.y) / 3 : centerY;
		const modelConfig: Partial<IText> = {
			text: img.modelText,
			x: rect1.x + watermarkPaddings.left,
			y: _y,
			fill: model.color,
			textAlign: model.align || "left",
			verticalAlign: model.verticalAlign || "middle",
			fontFamily: formatFont(model.font || font),
			fontSize: model.size,
			draggable: model.draggable || false,
			italic: model.italic,
			fontWeight: model.bold ? "bold" : "normal",
			textCase: model.letterUpperCase ? "upper" : "none",
		};
		if (model.showRect) {
			modelConfig.boxStyle = {
				fill: "#32cd79",
				stroke: "red",
				cornerRadius: 6,
			};
		}

		if (modelEl) {
			modelEl.set(modelConfig);
		} else {
			const modelLabel = new Text({
				...modelConfig,
				id: "model",
			});
			leafer.add(modelLabel);
		}
	} else if (modelEl) {
		leafer.remove(modelEl);
	}

	// 计算参数
	const paramsEl = leafer.findOne("#params");
	if (params.enable && params.show) {
		const _y =
			time.show || location?.show ? rect1.y + (rect2.y - rect1.y) / 3 : centerY;
		const paramsConfig = {
			text: img.paramsText,
			x: rect2.x - watermarkPaddings.right,
			y: _y,
			fill: params.color,
			textAlign: params.align || "right",
			verticalAlign: params.verticalAlign || "middle",
			fontFamily: formatFont(params.font || font),
			fontSize: params.size,
			fontStyle: params.italic ? "italic" : "normal",
			draggable: true,
		};

		if (paramsEl) {
			paramsEl.set(paramsConfig);
		} else {
			const paramsLabel = new Text({
				...paramsConfig,
				id: "params",
			});
			leafer.add(paramsLabel);
		}
	} else {
		leafer.remove(paramsEl);
	}

	// 计算logo
	let logoEl = leafer.findOne("#logo");

	console.log("参数宽度", paramsEl?.getBounds("content", "inner"));
	if (logo.enable && logo.show) {
		const radius = logo.circle ? logo.width / 2 : 0;
		const logoConfig = {
			x:
				rect2.x -
				watermarkPaddings.right -
				(paramsEl?.boxBounds?.width || 0) -
				logo.width -
				2 * SPACE * divider.margin -
				divider.width,
			y: centerY - logo.height / 2,
			width: logo.width,
			height: logo.height,
			cornerRadius: [radius, radius, radius, radius],
			fill: {
				type: "image" as const,
				url: getImageSrc(logo.url || logo.name),
				mode: "cover" as const,
			} as IImagePaint,
			draggable: true,
		};

		if (!logoEl) {
			logoEl = new Rect({
				...logoConfig,
				id: "logo",
			});
			leafer.add(logoEl);
		} else {
			logoEl.set(logoConfig);
		}
	} else {
		leafer.remove(logoEl);
	}

	// 计算时间
	let timeEl = leafer.findOne("#time");
	if (time.enable && time.show) {
		const _x =
			rect2.x - watermarkPaddings.right - (paramsEl?.boxBounds.width || 0);
		const _y = params.show ? rect1.y + (3 * (rect2.y - rect1.y)) / 4 : centerY;

		const timeConfig = {
			text: img.timeText,
			x: _x,
			y: _y,
			fill: time.color,
			textAlign: time.align || (paramsEl ? "left" : "right"),
			verticalAlign: time.verticalAlign || "middle",
			fontFamily: formatFont(time.font || font),
			fontSize: time.size,
			fontStyle: time.italic ? "italic" : "normal",
			draggable: true,
		};

		if (!timeEl) {
			timeEl = new Text({
				...timeConfig,
				id: "time",
			});
			leafer.add(timeEl);
		} else {
			timeEl.set(timeConfig);
		}
	} else {
		leafer.remove(timeEl);
	}

	// 计算地理位置
	let locationEl = leafer.findOne("#location");
	if (location && location.enable) {
		const _x = time.show
			? rect2.x - watermarkPaddings.right
			: rect2.x - watermarkPaddings.right - (paramsEl?.width || 0);
		const _y = params.show ? rect1.y + (3 * (rect2.y - rect1.y)) / 4 : centerY;
		const locationConfig = {
			text: img.locationText,
			x: _x,
			y: _y,
			fill: location.color,
			textAlign: location.align || (time.show ? "right" : "left"),
			verticalAlign: location.verticalAlign || "middle",
			fontFamily: formatFont(location.font || font),
			visible: location.show,
			fontSize: location.size,
		};

		if (locationEl) {
			locationEl.set(locationConfig);
		} else {
			locationEl = new Text({
				...locationConfig,
				id: "location",
			});
			leafer.add(locationEl);
		}
	} else {
		leafer.remove(locationEl);
	}

	// 计算镜头
	let lensEl = leafer.findOne("#lens");
	if (lens.enable && lens.show) {
		const _y = params.show ? rect1.y + (3 * (rect2.y - rect1.y)) / 4 : centerY;
		const lensConfig = {
			text: img.lensText,
			x: rect1.x + watermarkPaddings.left,
			y: _y,
			fill: lens.color,
			textAlign: lens.align || "left",
			verticalAlign: lens.verticalAlign || "middle",
			fontFamily: formatFont(lens.font || font),
			fontSize: lens.size,
			fontStyle: lens.italic ? "italic" : "normal",
			draggable: true,
		};

		if (!lensEl) {
			lensEl = new Text({
				...lensConfig,
				id: "lens",
			});
			leafer.add(lensEl);
		} else {
			lensEl.set(lensConfig);
		}
	} else {
		leafer.remove(lensEl);
	}

	// 计算分割线
	let dividerEl = leafer.findOne("#divider");
	if (divider.enable && divider.show) {
		const _x =
			rect2.x -
			watermarkPaddings.right -
			(paramsEl?.width ?? 0) -
			divider.width -
			SPACE * divider.margin;
		const dividerConfig = {
			rotation: 90,
			width: logo.height * divider.scale,
			x: _x,
			y: centerY - logo.width / 2,
			strokeWidth: divider.width,
			stroke: divider.color,
			fill: divider.color,
		};
		dividerConfig.y = centerY - dividerConfig.width / 2;

		if (!dividerEl) {
			dividerEl = new Line({
				...dividerConfig,
				id: "divider",
			});
			leafer.add(dividerEl);
		} else {
			dividerEl.set(dividerConfig);
		}
	} else {
		leafer.remove(dividerEl);
	}

	return [modelEl, paramsEl, logoEl, timeEl, lensEl];
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
		scale: 1,
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
	caculate: caculate,
	// draw: doDraw,
};

export default config;
