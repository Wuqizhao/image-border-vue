import type { Config, DrawFun } from "../types";

const doDraw: DrawFun = async (_, config, context) => {
	const { logo: logoConfig, paddings: imgPaddings } = config;
	const { ctx, canvas } = context;

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
			const logoX = canvas.width / 2 - logoConfig.width / 2;
			const logoY =
				canvas.height -
				logoConfig.height -
				(logoConfig.verticalOffset || 1) * 1.6 * imgPaddings.bottom;

			if (logoConfig.circle) {
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
			italic: false,
		},
		time: {
			enable: false,
			show: true,
			color: "#808080",
			size: 14,
			format: "YYYY-MM-DD HH:mm",
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
		circle: false,
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
		x: 0,
		y: 0,
		size: 20,
	},
	draw: doDraw,
};

export default config;
