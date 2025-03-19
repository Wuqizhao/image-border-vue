import type { Config, DrawFun } from "../types";
const doDraw: DrawFun = async (img, config, context) => {
	const { watermark, paddings: imgPaddings, logo: logoConfig } = config;
	const { params: paramsConfig } = watermark;
	const { ctx, canvas, exposureTime } = context;

	// 重新修改水印大小
	// canvas.width =

	let rect1 = {
		x: canvas.width - imgPaddings.right,
		y: 0,
	};
	let rect2 = {
		x: canvas.width,
		y: canvas.height,
	};

	// 绘制水印范围
	// ctx.strokeStyle = "#FF0000";
	// ctx.lineWidth = 10;
	// ctx.strokeRect(rect1.x, rect1.y, rect2.x - rect1.x, rect2.y - rect1.y);

	// 绘制水印垂直中心线
	// ctx.strokeStyle = "#FF0000";
	// ctx.lineWidth = 5;
	// ctx.beginPath();
	// ctx.moveTo(rect1.x + (rect2.x - rect1.x) / 2, 0);
	// ctx.lineTo(rect1.x + (rect2.x - rect1.x) / 2, canvas.height);
	// ctx.stroke();

	// const SPACE = 200;
	const labelX = rect1.x + (3 * (rect2.x - rect1.x)) / 8;
	const paramsX = rect1.x + (5 * (rect2.x - rect1.x)) / 8;

	// ctx.beginPath();
	// ctx.moveTo(labelX, 0);
	// ctx.lineTo(labelX, canvas.height);
	// ctx.stroke();
	// ctx.beginPath();
	// ctx.moveTo(paramsX, 0);
	// ctx.lineTo(paramsX, canvas.height);
    // ctx.stroke();
    
	// const WIDTH = 200;

	// 绘制曝光三要素和焦段参数
	if (paramsConfig.show) {
		// 光圈
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `bolder Italic ${paramsConfig.size}px ${config.font}`;
		ctx.textBaseline = "middle";
		// ctx.textAlign = "center";

		// let _x = rect1.x + (rect2.x - rect1.x) / 2;
		let fNumberY = canvas.height / 2;
		ctx.textAlign = "center";
		ctx.fillText("F", labelX, fNumberY);
		ctx.textAlign = "left";
		ctx.fillText(`${img.exif?.FNumber}`, paramsX, fNumberY);
		// 绘制矩形框
		// ctx.strokeStyle = paramsConfig.color;
		// ctx.strokeRect(
		// 	_x - SPACE - WIDTH - SPACE,
		// 	fNumberY - SPACE - paramsConfig.size/2,
		// 	WIDTH + SPACE * 2,
		// 	SPACE * 2 + paramsConfig.size/2
		// );

		// ISO
		let isoY = (3 * canvas.height) / 5;
		// ctx.fillText(`ISO    ${img.exif?.ISO}`, _x, isoY);
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
	}

	if (logoConfig.show) {
		const logoImg = new Image();
		logoImg.src = (
			await import(`../assets/logos/${logoConfig.name}.png`)
		).default;

		logoImg.onload = () => {
			const _x = canvas.width - imgPaddings.right / 2 - logoConfig.width / 2;
			let _y = canvas.height / 3 - logoConfig.height / 2;
			if (!paramsConfig.show) {
				_y = canvas.height / 2 - logoConfig.height / 2;
			}

			ctx.drawImage(logoImg, _x, _y, logoConfig.width, logoConfig.height);
		};
	}
};

const config: Config = {
	font: "微软雅黑",
	paddings: {
		top: 300, // 图片上边距
		right: 2000,
		left: 400,
		bottom: 400,
	},
	watermark: {
		height: 0,
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
			size: 160,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			enable: false,
			show: false,
			color: "#808080",
			size: 110,
			format: "YYYY-MM-DD HH:mm",
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
	},
	blur: {
		enable: true,
		size: 1000,
	},
	logo: {
		enable: true,
		auto: true,
		show: true,
		name: "leica",
		width: 300,
		height: 300,
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
		x: 20,
		y: 20,
		size: 2,
	},
	draw: doDraw,
};

export default config;
