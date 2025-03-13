import type { Config, DrawFun } from "../types";

const doDraw: DrawFun = async (_, config, context) => {
	const { logo: logoConfig, paddings: imgPaddings } = config;
	const { ctx, canvas } = context;

	if (logoConfig.show) {
		const logoImg = new Image();
		logoImg.src = (
			await import(`../assets/logos/${logoConfig.name}.png`)
		).default;
		logoImg.onload = () => {
			const logoX = canvas.width / 2 - logoConfig.width / 2;
			const logoY =
				canvas.height -
				logoConfig.height -
				(logoConfig.verticalOffset || 1) * 1.6 * imgPaddings.bottom;

			ctx.drawImage(logoImg, logoX, logoY, logoConfig.width, logoConfig.height);
		};
	}
};

const config: Config = {
	font: "微软雅黑",
	paddings: {
		top: 150, // 图片上边距
		right: 150,
		left: 150,
		bottom: 150,
	},
	watermark: {
		height: 0,
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
			enable: false,
			show: false,
			color: "#808080",
			size: 14,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			enable: false,
			show: true,
			color: "#808080",
			size: 14,
			format: "yyyy-MM-dd HH:mm",
		},
		paddings: {
			lr: 0,
			tb: 0,
		},
		bgColor: "#ffffff",
	},
	radius: {
		enable: true,
		show: true,
		size: 100,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		name: "hasselblad-white",
		width: 400,
		height: 400,
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
