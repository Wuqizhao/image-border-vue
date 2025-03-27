import type { Config, DrawFun } from "../types";

const doDraw: DrawFun = async (img, config, context) => {
	const { watermark, divider: dividerConfig } = config;
	const { params: paramsConfig, model: modelConfig } = watermark;
	const { ctx, canvas, rect1, rect2, focalLength, exposureTime } = context;

	// 绘制型号
	if (modelConfig.show) {
		ctx.save();
		let modelY = rect1.y + (rect2.y - rect1.y) / 3;
		if (!paramsConfig.show) {
			modelY = rect1.y + (rect2.y - rect1.y) / 2;
		}

		ctx.font = `${modelConfig.bold ? "bold" : ""} ${
			modelConfig.italic ? "Italic" : ""
		} ${modelConfig.size}px ${config.font}`;
		ctx.fillStyle = modelConfig.color;
		ctx.textBaseline = "middle";

		// 截取厂商
		const company = img.modelText.split(" ")[0];
		// 计算厂商的宽度
		const companyWidth = ctx.measureText(company).width;
		ctx.font = `${modelConfig.size}px ${config.font}`;
		let modelText = img.modelText.replace(company, "") + "  |  LEICA";
		modelText = modelConfig.replaceZ
			? modelText.replace(/Z|z/, "ℤ")
			: modelText;
		ctx.font = `${modelConfig.italic ? "Italic" : ""} ${modelConfig.size}px ${
			config.font
		}`;
		// 计算型号宽度
		const modelWidth = ctx.measureText(modelText).width;
		// 总宽度
		const totalWidth = companyWidth + modelWidth;

		ctx.textAlign = "left";
		ctx.fillText(company, canvas.width / 2 - totalWidth / 2, modelY);
		ctx.textAlign = "right";
		ctx.fillText(modelText, canvas.width / 2 + totalWidth / 2, modelY);

		ctx.restore();
	}
	// 绘制参数
	if (paramsConfig.show) {
		let _y = rect1.y + (3 * (rect2.y - rect1.y)) / 4;
		if (!modelConfig.show) {
			_y = rect1.y + (rect2.y - rect1.y) / 2;
		}
		const space = 50 * dividerConfig.margin;
		let apertureWidth = 0;
		let exposureWidth = 0;
		let isoWidth = 0;
		let lensWidth = 0;
		let totalWidth = 0;

		ctx.save();
		ctx.font = `${paramsConfig.italic ? "Italic" : ""} ${paramsConfig.size}px ${
			config.font
		}`;
		ctx.fillStyle = paramsConfig.color;
		ctx.textBaseline = "middle";

		const aperture = "f/" + img.exif.FNumber;
		const apertureText = paramsConfig.letterUpperCase
			? aperture.toUpperCase()
			: aperture;
		const lens = (focalLength || img.exif.FocalLength) + "mm";
		const lensText = paramsConfig.letterUpperCase ? lens.toUpperCase() : lens;
		const exposure = (exposureTime || img.exif.ExposureTime) + "s";
		const exposureText = paramsConfig.letterUpperCase
			? exposure.toUpperCase()
			: exposure;
		const iso = "iso " + img.exif.ISO;
		const isoText = paramsConfig.letterUpperCase ? iso.toUpperCase() : iso;
		// 计算总宽度
		apertureWidth = ctx.measureText(apertureText).width;
		exposureWidth = ctx.measureText(exposureText).width;
		isoWidth = ctx.measureText(isoText).width;
		lensWidth = ctx.measureText(lensText).width;
		totalWidth =
			apertureWidth +
			lensWidth +
			exposureWidth +
			isoWidth +
			6 * space +
			3 * dividerConfig.width;

		ctx.textAlign = "left";
		// 焦距
		const lensX = canvas.width / 2 - totalWidth / 2;
		ctx.fillText(`${lensText}`, lensX, _y);
		// 光圈
		const apertureX = canvas.width / 2 - totalWidth / 2 + 2 * space + lensWidth;
		ctx.fillText(`${apertureText}`, apertureX, _y);

		ctx.textAlign = "right";
		// 曝光时间
		const exposureX =
			canvas.width / 2 +
			totalWidth / 2 -
			2 * space -
			dividerConfig.width -
			isoWidth;
		ctx.fillText(`${exposureText}`, exposureX, _y);

		// ISO
		const isoX = canvas.width / 2 + totalWidth / 2;
		ctx.fillText(`${isoText}`, isoX, _y);

		ctx.restore();

		// 绘制分割线
		if (dividerConfig.show) {
			ctx.strokeStyle = dividerConfig.color;
			ctx.lineWidth = dividerConfig.width;

			// 中间的分割线
			ctx.beginPath();
			let _x =
				canvas.width / 2 -
				totalWidth / 2 +
				lensWidth +
				3 * space +
				dividerConfig.width +
				apertureWidth;
			ctx.moveTo(_x, _y - (dividerConfig.scale * paramsConfig.size) / 2);
			ctx.lineTo(_x, _y + (dividerConfig.scale * paramsConfig.size) / 2);
			ctx.stroke();

			// 左侧分割线
			ctx.beginPath();
			_x = canvas.width / 2 - totalWidth / 2 + lensWidth + space;
			ctx.moveTo(_x, _y - (dividerConfig.scale * paramsConfig.size) / 2);
			ctx.lineTo(_x, _y + (dividerConfig.scale * paramsConfig.size) / 2);
			ctx.stroke();

			// 右侧分割线
			ctx.beginPath();
			_x = canvas.width / 2 + totalWidth / 2 - space - isoWidth;
			ctx.moveTo(_x, _y - (dividerConfig.scale * paramsConfig.size) / 2);
			ctx.lineTo(_x, _y + (dividerConfig.scale * paramsConfig.size) / 2);
			ctx.stroke();
		}
	}
};

const config: Config = {
	font: "微软雅黑",
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		height: 0.1,
		model: {
			enable: true,
			show: true,
			color: "#000000",
			size: 100,
			replaceZ: true,
			italic: false, // 斜体
			bold: true, // 加粗
		},
		params: {
			enable: true,
			show: true,
			color: "#808080",
			size: 60,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
		},
		time: {
			enable: false,
			show: true,
			color: "#808080",
			size: 100,
			format: "YYYY.MM.DD HH:mm",
		},
		paddings: {
			lr: 0,
			tb: 100,
		},
		bgColor: "#ffffff",
	},
	radius: {
		enable: true,
		show: false,
		size: 150,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: false,
		auto: true,
		show: true,
		name: "leica",
		width: 300,
		height: 300,
		verticalOffset: 1,
		circle: false,
	},
	divider: {
		enable: true,
		show: true,
		color: "#808080",
		width: 3,
		scale: 1,
		margin: 1,
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 0,
		y: 0,
		size: 20,
	},
	draw: doDraw,
};

export default config;
