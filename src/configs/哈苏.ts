import type { Config, Context, DrawFun } from "../types";
import { drawLogo, drawLine, replaceZ, setTextCtx } from "../utils";

const doDraw: DrawFun = async (img, config, context: Context) => {
	const {
		watermark,
		divider: dividerConfig,
		logo: logoConfig,
		paddings: imgPaddings,
	} = config;
	const { params: paramsConfig } = watermark;
	const { ctx, rect1, rect2 } = context;

	config.font = config.font.replace(/\.ttf|\.TTF|\.otf|\.OTF/, "");

	// 参数区域的宽度
	const W = (dividerConfig.margin * 3 * (rect2.x - rect1.x)) / 5;
	const start_x = rect1.x + (rect2.x - rect1.x) / 2 - W / 2;
	let leftX = 0;
	let paramsWidths = [0, 0, 0, 0];
	const SPACE = (dividerConfig.margin * (rect2.x - rect1.x)) / 10;
	// 绘制参数
	if (paramsConfig.show) {
		setTextCtx(ctx, paramsConfig, "center");

		let paramStr = [
			(context.focalLength || img.exif?.FocalLengthIn35mmFilm || "--") + "mm",
			"f" + (img.exif?.FNumber || "--"),
			(context.exposureTime || "--") + "s",
			img.exif?.ISO || "--",
		];
		// 处理大写
		if (paramsConfig.letterUpperCase) {
			paramStr = paramStr.map((item) => item.toString().toUpperCase());
		}

		if (paramsConfig?.styleIndex === 0) {
			let h1 = rect1.y + (6 * (rect2.y - rect1.y)) / 10;
			let h2 = rect1.y + (9 * (rect2.y - rect1.y)) / 10;
			if (!watermark.model.show) {
				h1 -= (rect2.y - rect1.y) / 2;
				h2 -= (rect2.y - rect1.y) / 2;
			}

			// 绘制焦段
			ctx.fillText(paramStr[0], start_x + W / 8, h1);
			ctx.fillText("FL", start_x + W / 8, h2);
			// 绘制光圈
			ctx.fillText(paramStr[1], start_x + (3 * W) / 8, h1);
			ctx.fillText("Aperture", start_x + (3 * W) / 8, h2);

			// 绘制快门
			ctx.fillText(paramStr[2], start_x + (5 * W) / 8, h1);
			ctx.fillText("Shutter", start_x + (5 * W) / 8, h2);

			// 绘制ISO
			ctx.fillText(paramStr[3], start_x + (7 * W) / 8, h1);
			ctx.fillText("ISO", start_x + (7 * W) / 8, h2);
		} else {
			// 单行文本模式
			let _h = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
			if (!watermark.model.show) {
				_h -= (rect2.y - rect1.y) / 2;
			}

			paramStr[3] = (paramsConfig.bold ? "ISO" : "iso") + paramStr[3];

			if (paramsConfig.styleIndex === 2) {
				// 单行文本2:带上参数项目名
				paramStr = [
					"FL  " + paramStr[0].replace(/MM|mm/, ""),
					"Aperture  " + paramStr[1].replace(/f|F/, ""),
					"Shutter  " + paramStr[2].replace(/s$|S$/, ""),
					"ISO  " + paramStr[3].replace(/ISO|iso/, ""),
				];
				if (!paramsConfig.bold) {
					paramStr = paramStr.map((item) => item.toString().toLowerCase());
				}
			}
			const w1 = ctx.measureText(paramStr[0]).width;
			const w2 = ctx.measureText(paramStr[1]).width;
			const w3 = ctx.measureText(paramStr[2]).width;
			const w4 = ctx.measureText(paramStr[3]).width;
			paramsWidths = [w1, w2, w3, w4];

			const totalWidth = w1 + w2 + w3 + w4 + 3 * SPACE;
			// 左侧的x坐标
			leftX = rect1.x + (rect2.x - rect1.x) / 2 - totalWidth / 2;

			ctx.textAlign = "left";
			ctx.fillText(paramStr[0], leftX, _h);
			ctx.fillText(paramStr[1], leftX + w1 + SPACE, _h);
			ctx.fillText(paramStr[2], leftX + w1 + w2 + 2 * SPACE, _h);
			ctx.fillText(paramStr[3], leftX + w1 + w2 + w3 + 3 * SPACE, _h);
		}
	}

	// 绘制LOGO
	if (logoConfig.show) {
		const logoX = rect1.x + (rect2.x - rect1.x) / 2 - logoConfig.width / 2;
		const logoY = (2 * imgPaddings.top) / 3 - logoConfig.height / 2;
		drawLogo(logoConfig, ctx, logoX, logoY);
	}

	// 绘制分割线
	if (dividerConfig.show) {
		ctx.strokeStyle = dividerConfig.color;
		ctx.lineWidth = dividerConfig.width;

		let _h1 = rect1.y + (rect2.y - rect1.y) / 2;
		let _h2 = rect2.y;
		if (!watermark.model.show) {
			_h1 -= (rect2.y - rect1.y) / 2;
			_h2 -= (rect2.y - rect1.y) / 2;
		}

		let xPositions = [
			rect1.x + (rect2.x - rect1.x) / 2,
			start_x + W / 4,
			start_x + (3 * W) / 4,
		];
		// 单行文本模式
		if (paramsConfig?.styleIndex === 1 || paramsConfig?.styleIndex === 2) {
			_h1 += (rect2.y - rect1.y) / 4 - paramsConfig.size / 2;
			_h2 = _h1 + paramsConfig.size;

			xPositions = [
				leftX + paramsWidths[0] + SPACE / 2,
				leftX + paramsWidths[0] + paramsWidths[1] + (3 * SPACE) / 2,
				leftX +
					paramsWidths[0] +
					paramsWidths[1] +
					paramsWidths[2] +
					(5 * SPACE) / 2,
			];
		}
		const dividerHeight = (_h2 - _h1) * dividerConfig.scale;
		const centerY = (_h1 + _h2) / 2;
		_h1 = centerY - dividerHeight / 2;
		_h2 = centerY + dividerHeight / 2;

		if (dividerConfig.separator) {
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = dividerConfig.color;

			xPositions.map((_, i) => {
				ctx.fillText(dividerConfig.separator || "", xPositions[i], centerY);
			});
		} else {
			drawLine(ctx, xPositions[0], _h1, xPositions[0], _h2, dividerConfig);
			drawLine(ctx, xPositions[1], _h1, xPositions[1], _h2, dividerConfig);
			drawLine(ctx, xPositions[2], _h1, xPositions[2], _h2, dividerConfig);
		}

		// 绘制分割线范围
		// ctx.strokeRect(rect1.x, _h1, rect2.x - rect1.x, _h2 - _h1);
	}

	// 绘制型号
	if (watermark.model.show) {
		setTextCtx(ctx, watermark.model, 'center');
		ctx.fillText(
			watermark.model.replaceZ ? replaceZ(img.modelText) : img.modelText,
			rect1.x + (rect2.x - rect1.x) / 2,
			rect1.y + (rect2.y - rect1.y) / 6
		);
	}
};

const config: Config = {
	name: "哈苏",
	font: "sans-serif",
	paddings: {
		top: 2000, // 图片上边距
		right: 400,
		left: 400,
		bottom: 0,
	},
	watermark: {
		position: "bottom",
		height: 0.18,
		bgColor: "#FFF",
		model: {
			enable: true,
			show: true,
			color: "#000000",
			size: 200,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "rgb(128,128,128)",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
			bold: true,
			styleIndex: 0,
			styles: ["双行文本", "单行文本", "单行文本2"],
		},
		time: {
			enable: false,
			show: false,
			color: "#808080",
			size: 60,
			format: "YYYY.MM.DD  HH:mm:ss",
		},
		lens: {
			enable: false,
			show: false,
			color: "#808080",
			size: 60,
			italic: false,
			bold: false,
			text: "",
		},
		paddings: {
			top: 500,
			bottom: 2000,
			left: 0,
			right: 0,
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
		width: 1500,
		height: 1500,
		name: "hasselblad-2",
		circle: false,
		verticalOffset: 1,
	},
	divider: {
		enable: true,
		show: true,
		color: "rgb(220,220,220)",
		width: 5,
		scale: 1,
		margin: 1,
		separator: "",
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 0,
		y: 0,
		size: 100,
	},
	location: {
		enable: false,
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
	border: {
		enable: true,
		show: false,
		width: 50,
		color: "#CCCCCC",
	},
	margin: {
		show: true,
		top: 500,
		right: 0,
		bottom: 0,
		left: 0,
	},
	draw: doDraw,
};

export default config;
