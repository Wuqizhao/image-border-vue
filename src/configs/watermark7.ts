import type { Config, DrawFun } from "../types";

const doDraw: DrawFun = async (img, config, context) => {
	const { logo: logoConfig, watermark } = config;
	const { params: paramsConfig, time: timeConfig } = watermark;
	const { ctx, canvas, rect1, rect2 } = context;

	if (logoConfig.show) {
		const logoImg = new Image();
		logoImg.src = (
			await import(`../assets/logos/${logoConfig.name}.png`)
		).default;
		logoImg.onload = () => {
			const logoX = canvas.width / 2 - logoConfig.width / 2;
			const logoY = (rect1.y + (rect2.y - rect1.y)/4 - logoConfig.height/2) * (logoConfig.verticalOffset || 1);

			ctx.drawImage(logoImg, logoX, logoY, logoConfig.width, logoConfig.height);
		};
	}

	// 绘制参数
	if (paramsConfig.show) {
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `${paramsConfig.size}px ${config.font}`;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		const _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		ctx.fillText(img.paramsText, canvas.width / 2, _y);
	}

	// 绘制时间
	if (timeConfig.show) {
		ctx.fillStyle = timeConfig.color;
		ctx.font = `${timeConfig.size}px ${config.font}`;
		ctx.textBaseline = "bottom";
		ctx.textAlign = "center";
		const _y = rect2.y;
		ctx.fillText(img.timeText, canvas.width / 2, _y);
	}
};

const config: Config = {
	font: "微软雅黑",
	paddings: {
		top: 150, // 图片上边距
		right: 150,
		left: 150,
		bottom: 0,
	},
	watermark: {
		height: 0.2,
		model: {
			enable: false,
			show: false,
			color: "#FF0000",
			size: 200,
			replaceZ: true,
			italic: true, // 斜体
			bold: true, // 加粗
		},
		params: {
			enable: true,
			show: true,
			color: "#FF0000",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			enable: true,
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
		show: true,
		size: 150,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: true,
		auto: true,
		show: true,
		name: "leica",
		width: 300,
		height: 300,
		verticalOffset: 1,
	},
	divider: {
		enable: false,
		show: true,
		color: "#808080",
		width: 2,
		scale: 1,
		margin: 1,
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
