import { ElMessage } from "element-plus";
import type { Config, DrawFun } from "../types";

const doDraw: DrawFun = async (img, config, context) => {
	const {
		watermark,
		paddings: imgPaddings,
		divider: dividerConfig,
		logo: logoConfig,
	} = config;
	const {
		model: modelConfig,
		params: paramsConfig,
		time: timeConfig,
		lens: lensConfig,
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, canvas, rect1, rect2, focalLength, exposureTime } = context;

	// 绘制型号
	if (modelConfig.show) {
		const modelConfig = config.watermark.model;
		if (modelConfig.show) {
			ctx.save(); // 保存当前绘图状态
			ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
				modelConfig.bold ? "bold" : ""
			} ${modelConfig.size}px ${config.font || "Arial"}`;
			ctx.fillStyle = modelConfig.color;
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			let _y = rect1.y + (rect2.y - rect1.y) / 2;
			if (lensConfig.show) {
				_y = rect1.y + (rect2.y - rect1.y) / 3;
			}
			// 截取厂商
			const company = img.modelText.split(" ")[0];
			// 计算厂商的宽度
			const companyWidth = ctx.measureText(company).width;

			ctx.fillText(company, imgPaddings.left + watermarkPaddings.lr, _y);

			ctx.font = `${modelConfig.size}px ${config.font || "Arial"}`;
			const modelText = modelConfig.replaceZ
				? img.modelText.replace(/z|Z/, "ℤ")
				: img.modelText;
			ctx.fillText(
				modelText.replace(company, ""),
				imgPaddings.left + watermarkPaddings.lr + companyWidth,
				_y
			);
			ctx.restore(); // 恢复之前的绘图状态
		}
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
		}px ${config.font || "Arial"}`;

		let paramsText =
			paramsConfig?.text ||
			`${focalLength}mm  f/${img.exif?.FNumber}  ${exposureTime}s  iso${img.exif.ISO}`;
		paramsConfig.letterUpperCase && (paramsText = paramsText.toUpperCase());
		paramsWidth = ctx.measureText(paramsText).width;

		let _y = rect1.y + (rect2.y - rect1.y) / (timeConfig.show ? 3 : 2);
		ctx.fillText(
			paramsText,
			canvas.width - imgPaddings.right - watermarkPaddings.lr,
			_y
		);
	}

	// 绘制时间
	let timeWidth = 0;
	if (timeConfig.show) {
		ctx.save();
		ctx.textAlign = paramsConfig.show ? "left" : "right";
		const _x = paramsConfig.show
			? canvas.width - imgPaddings.right - watermarkPaddings.lr - paramsWidth
			: canvas.width - imgPaddings.right - watermarkPaddings.lr;
		const _y =
			rect1.y + (2 * (rect2.y - rect1.y)) / (paramsConfig.show ? 3 : 4);
		ctx.textBaseline = "middle";
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;

		timeWidth = ctx.measureText(img.timeText).width;

		ctx.fillText(img.timeText, _x, _y);
		ctx.restore();
	}

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
		ctx.fillText(text, imgPaddings.left + watermarkPaddings.lr, _y);
		ctx.restore();
	}

	const space = paramsConfig.size * dividerConfig.margin;

	// 计算横坐标
	const _x =
		canvas.width -
		imgPaddings.right -
		watermarkPaddings.lr -
		Math.max(paramsWidth, timeWidth) -
		space;
	const logoX = _x - space - logoConfig.width;
	// 计算纵坐标
	const logoY = _y - logoConfig.height / 2;

	// 绘制LOGO
	if (logoConfig.show) {
		const logoImg = new Image();

		if (logoConfig.url) {
			logoImg.src = logoConfig.url;
		} else if (logoConfig.name.startsWith("http")) {
			logoImg.src = logoConfig.name;
		} else {
			logoImg.src = (
				await import(`../assets/logos/${logoConfig.name}.png`)
			).default;
		}
		logoImg.onload = () => {
			if (logoConfig.circle) {
				// 绘制圆形LOGO
				ctx.beginPath();
				ctx.arc(
					logoX + logoConfig.width / 2,
					logoY + logoConfig.height / 2,
					logoConfig.width / 2,
					0,
					Math.PI * 2
				);
				ctx.clip();
			}

			ctx.drawImage(logoImg, logoX, logoY, logoConfig.width, logoConfig.height);
		};
		logoImg.onerror = (err) => {
			console.log(err);
			ElMessage.error("LOGO加载失败:" + err);
		};
	}

	// 绘制分割线
	if (dividerConfig.show) {
		ctx.strokeStyle = dividerConfig.color;
		ctx.lineWidth = dividerConfig.width;

		const _h =
			Math.min(logoConfig.height, paramsConfig.size) * dividerConfig.scale;
		const centerY = rect1.y + (rect2.y - rect1.y) / 2;

		ctx.beginPath();
		ctx.moveTo(_x, centerY - _h / 2);
		ctx.lineTo(_x, centerY + _h / 2);
		ctx.stroke();
	}
};

const config: Config = {
	name: "小米徕卡",
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
			size: 80,
			format: "YYYY.MM.DD  HH:mm:ss",
		},
		lens: {
			enable: true,
			show: false,
			color: "#808080",
			size: 80,
			italic: false,
			bold: false,
			text: "",
		},
		paddings: {
			lr: 120,
			tb: 120,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		show: false,
		position: ["lt", "rt", "lb", "rb"],
		size: 100,
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
	draw: doDraw,
};

export default config;
