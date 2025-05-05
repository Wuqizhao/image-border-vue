import type { Config, DrawFun } from "../types";
import { drawLogo } from "../utils";
const doDraw: DrawFun = async (img, config, context) => {
	const { watermark, logo: logoConfig } = config;
	const { params: paramsConfig } = watermark;
	const { ctx, canvas, exposureTime, rect1, rect2 } = context;

	const labelX = rect1.x + (2 * (rect2.x - rect1.x)) / 8;
	const paramsX = rect1.x + (5 * (rect2.x - rect1.x)) / 8;

	// // 绘制水印垂直中心线
	// ctx.strokeStyle = "#FF0000";
	// ctx.lineWidth = 5;
	// ctx.beginPath();
	// ctx.moveTo(rect1.x + (rect2.x - rect1.x) / 2, 0);
	// ctx.lineTo(rect1.x + (rect2.x - rect1.x) / 2, canvas.height);
	// ctx.stroke();
	// ctx.beginPath();
	// ctx.moveTo(labelX, 0);
	// ctx.lineTo(labelX, canvas.height);
	// ctx.stroke();
	// ctx.beginPath();
	// ctx.moveTo(paramsX, 0);
	// ctx.lineTo(paramsX, canvas.height);
	// ctx.stroke();

	const WIDTH = (rect2.x - rect1.x) / 5;

	// 绘制曝光三要素和焦段参数
	if (paramsConfig.show) {
		// 光圈
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `bolder ${paramsConfig.italic ? "Italic" : ""} ${
			paramsConfig.size
		}px ${config.font}`;
		ctx.textBaseline = "middle";

		let fNumberY = canvas.height / 2;
		ctx.textAlign = "center";
		ctx.fillText("F", labelX, fNumberY);
		ctx.textAlign = "left";
		ctx.fillText(`${img.exif?.FNumber}`, paramsX, fNumberY);

		// ISO
		let isoY = (3 * canvas.height) / 5;
		ctx.textAlign = "center";
		ctx.fillText("ISO", labelX, isoY);
		ctx.textAlign = "left";
		ctx.fillText(`${img.exif?.ISO}`, paramsX, isoY);

		// 快门速度
		let shutterSpeedY = (7 * canvas.height) / 10;
		ctx.textAlign = "center";
		ctx.fillText("S", labelX, shutterSpeedY);
		ctx.textAlign = "left";
		ctx.fillText(`${exposureTime}`, paramsX, shutterSpeedY);

		// 绘制矩形框
		ctx.strokeStyle = paramsConfig.color;
		ctx.lineWidth = 10;
		ctx.strokeRect(
			labelX - WIDTH / 2,
			fNumberY - paramsConfig.size - ctx.lineWidth,
			WIDTH,
			2 * paramsConfig.size
		);
		ctx.strokeRect(
			labelX - WIDTH / 2,
			isoY - paramsConfig.size - ctx.lineWidth,
			WIDTH,
			2 * paramsConfig.size
		);
		ctx.strokeRect(
			labelX - WIDTH / 2,
			shutterSpeedY - paramsConfig.size - ctx.lineWidth,
			WIDTH,
			2 * paramsConfig.size
		);
	}

	if (logoConfig.show) {
		const _x = rect1.x + (rect2.x - rect1.x) / 2 - logoConfig.width / 2;
		let _y = canvas.height / 3 - logoConfig.height / 2;
		if (!paramsConfig.show) {
			_y = canvas.height / 2 - logoConfig.height / 2;
		}
		_y -= (logoConfig.verticalOffset - 1) * logoConfig.height;
		drawLogo(logoConfig, ctx, _x, _y);
	}
};

const config: Config = {
	name: "印象毛玻璃",
	font: "sans-serif",
	paddings: {
		top: 500, // 图片上边距
		right: 0,
		left: 500,
		bottom: 500,
	},
	watermark: {
		position: "right",
		height: 0.4,
		model: {
			enable: false,
			show: false,
			color: "#000000",
			size: 150,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "#FFF",
			size: 130,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: true,
		},
		time: {
			enable: false,
			show: false,
			color: "#808080",
			size: 110,
			format: "YYYY-MM-DD HH:mm",
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
			lr: 0,
			tb: 0,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		show: true,
		size: 100,
		uniform: true,
		lt: 100,
		rt: 100,
		lb: 100,
		rb: 100,
	},
	blur: {
		type: "blur",
		size: 200,
	},
	logo: {
		enable: true,
		auto: true,
		show: true,
		name: "leica",
		width: 500,
		height: 500,
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
