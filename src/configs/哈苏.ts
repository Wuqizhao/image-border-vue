import type { Config, Context, DrawFun } from "../types";
import { drawLogo, drawLine } from "../utils";

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

	// 参数区域的宽度：默认一半
	const W = (rect2.x - rect1.x) / 2;
	const start_x = rect1.x + W / 2;
	// 绘制参数
	if (paramsConfig.show) {
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `${paramsConfig.italic ? "Italic" : ""} ${paramsConfig.size}px ${
			config.font || "sans-serif"
		}`;

		const h1 = rect1.y + (rect2.y - rect1.y) / 5;
		const h2 = rect1.y + (4 * (rect2.y - rect1.y)) / 5;

		// 绘制焦段
		ctx.fillText(
			(context.focalLength || img.exif?.FocalLengthIn35mmFilm || "--") + "mm",
			start_x + W / 8,
			h1
		);
		ctx.fillText("FL", start_x + W / 8, h2);
		// 绘制光圈
		ctx.fillText("f" + (img.exif?.FNumber || "--"), start_x + (3 * W) / 8, h1);
		ctx.fillText("Aperture", start_x + (3 * W) / 8, h2);

		// 绘制快门
		ctx.fillText(
			(context.exposureTime || "--") + "s",
			start_x + (5 * W) / 8,
			h1
		);
		ctx.fillText("Shutter", start_x + (5 * W) / 8, h2);

		// 绘制ISO
		ctx.fillText(img.exif?.ISO || "--", start_x + (7 * W) / 8, h1);
		ctx.fillText("ISO", start_x + (7 * W) / 8, h2);
	}

	// 绘制LOGO
	if (logoConfig.show) {
		const logoX = rect2.x / 2 - logoConfig.width / 2;
		const logoY = imgPaddings.top / 2 - logoConfig.height / 2;
		drawLogo(logoConfig, ctx, logoX, logoY);
	}

	// 绘制分割线
	if (dividerConfig.show) {
		ctx.strokeStyle = dividerConfig.color;
		ctx.lineWidth = dividerConfig.width;

		drawLine(
			ctx,
			rect1.x + (rect2.x - rect1.x) / 2,
			rect1.y,
			rect1.x + (rect2.x - rect1.x) / 2,
			rect2.y,
			dividerConfig
		);
		drawLine(
			ctx,
			start_x + W / 4,
			rect1.y,
			start_x + W / 4,
			rect2.y,
			dividerConfig
		);

		drawLine(
			ctx,
			start_x + (3 * W) / 4,
			rect1.y,
			start_x + (3 * W) / 4,
			rect2.y,
			dividerConfig
		);
	}
};

const config: Config = {
	name: "哈苏",
	font: "sans-serif",
	paddings: {
		top: 800, // 图片上边距
		right: 200,
		left: 200,
		bottom: 0,
	},
	watermark: {
		position: "bottom",
		height: 0.08,
		bgColor: "#FFF",
		model: {
			enable: true,
			show: false,
			color: "#CCCCCC",
			size: 110,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "rgb(128,128,128)",
			size: 70,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
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
			lr: 0,
			tb: 500,
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
		width: 1200,
		height: 1200,
		name: "hasselblad-2",
		circle: false,
		verticalOffset: 1,
	},
	divider: {
		enable: true,
		show: true,
		color: "gainsboro",
		width: 5,
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
	draw: doDraw,
};

export default config;
