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
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, canvas, rect1, rect2 } = context;

	// 绘制型号
	if (modelConfig.show) {
		const modelConfig = config.watermark.model;
		if (modelConfig.show) {
			ctx.save(); // 保存当前绘图状态
			ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
				modelConfig.bold ? "bold" : ""
			} ${modelConfig.size}px Arial`;
			ctx.fillStyle = modelConfig.color;
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			const _y = rect1.y + (rect2.y - rect1.y) / 2;
			// 截取厂商
			const company = img.modelText.split(" ")[0];
			// 计算厂商的宽度
			const companyWidth = ctx.measureText(company).width;

			ctx.fillText(company, imgPaddings.left + watermarkPaddings.lr, _y);

			ctx.font = `${modelConfig.size}px Arial`;
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

	// 绘制参数
	if (paramsConfig.show) {
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `bold ${paramsConfig.size}px Arial`;

		const paramsText = paramsConfig.letterUpperCase
			? img.paramsText.toUpperCase()
			: img.paramsText;
		ctx.fillText(
			paramsText,
			canvas.width - imgPaddings.right - watermarkPaddings.lr,
			_y
		);
	}
	const space = 0.5 * logoConfig.width * dividerConfig.margin; // 间隔
	// 绘制竖线
	const paramsWidth = ctx.measureText(img.paramsText).width;
	// 计算横坐标
	const _x =
		canvas.width -
		imgPaddings.right -
		watermarkPaddings.lr -
		paramsWidth -
		space;

	// 计算横坐标
	const logoX = _x - space - logoConfig.width;
	// 计算纵坐标
	const logoY = _y - logoConfig.height / 2;

	// 绘制LOGO
	if (logoConfig.show) {
		const logoImg = new Image();
		logoImg.src = (
			await import(`../assets/logos/${logoConfig.name}.png`)
		).default;
		logoImg.onload = () => {
			ctx.drawImage(logoImg, logoX, logoY, logoConfig.width, logoConfig.height);
		};
	}
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
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		model: {
			show: true,
			color: "#000000",
			size: 150,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			show: true,
			color: "#000000",
			size: 120,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			enable: false,
			show: false,
			color: "#000000",
			size: 140,
			format: "yyyy-MM-dd HH:mm",
		},
		paddings: {
			lr: 100,
			tb: 150,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		show: false,
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
		width: 200,
		height: 200,
		name: "leica",
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
		size: 2,
	},
	draw: doDraw,
};

export default config;
