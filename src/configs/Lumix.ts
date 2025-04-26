import type { Config, DrawFun } from "../types";
import { drawLogo, drawRadiusRect, replaceZ } from "../utils";

const draw: DrawFun = async (img, config, context) => {
	const { ctx, rect1, rect2, canvas, exposureTime, focalLength } = context;
	const { watermark, logo, paddings, divider, radius } = config;
	const {
		model,
		params,
		time,
		paddings: { lr, tb },
	} = watermark;

	rect1.y = paddings.top + tb + img.height * (1 - watermark.height);
	// 绘制水印范围的背景
	ctx.fillStyle = watermark.bg || "rgba(0,0,0,0.4)";
	if (radius.show) {
		drawRadiusRect(
			ctx,
			rect1.x - lr,
			rect1.y,
			img.width,
			canvas.height - paddings.bottom - rect1.y,
			radius.size
		);
		ctx.fill();
	} else {
		ctx.fillRect(
			rect1.x - lr,
			rect1.y,
			img.width,
			canvas.height - paddings.bottom - rect1.y
		);
	}

	const centerY = rect1.y + (rect2.y - rect1.y) / 2;
	// 绘制logo
	if (logo.show) {
		ctx.save();
		const logoX = rect1.x;
		let logoY = centerY - logo.height / 2;

		drawLogo(logo, ctx, logoX, logoY - (logo.verticalOffset - 1) * logo.height);

		// 绘制logo范围
		// ctx.strokeStyle = "rgba(0, 248, 211, 1)";
		// ctx.strokeRect(
		// 	logoX,
		// 	logoY,
		// 	logo.width,
		// 	logo.height + (logo.verticalOffset - 1) * logo.height
		// );
		ctx.restore();
	}

	// 绘制分割线
	let dividerWidth = 0;
	let dividerX = 0;
	if (divider.show) {
		ctx.save();
		ctx.lineWidth = divider.width;
		ctx.strokeStyle = divider.color;
		dividerX =
			rect1.x + (logo.show ? logo.width : 0) + divider.margin * model.size;

		dividerWidth = divider.width + 2 * divider.margin * model.size;

		ctx.beginPath();
		ctx.moveTo(dividerX, centerY - (divider.scale * model.size) / 2);
		ctx.lineTo(dividerX, centerY + (divider.scale * model.size) / 2);
		ctx.stroke();
		ctx.restore();
	}

	// 绘制型号
	if (model.show) {
		ctx.save();
		ctx.font = `${model.bold ? "bold" : ""} ${model.italic ? "italic" : ""} ${
			model.size
		}px ${config.font}`;
		ctx.fillStyle = model.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		const text = model.text || img.modelText;
		const modelText = model.replaceZ ? replaceZ(text) : text;
		const metrics = ctx.measureText(text);

		const textHeight =
			metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		ctx.fillText(
			modelText,
			rect1.x + (logo.show ? logo.width : 0) + dividerWidth,
			centerY + textHeight / 2 - metrics.actualBoundingBoxDescent
		);
		ctx.restore();
	}

	// 绘制参数
	if (params.show) {
		ctx.save();
		ctx.font = `${params.italic ? "italic" : ""} ${params.size}px ${
			config.font
		}`;
		ctx.fillStyle = params.color;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";

		const paramsText =
			params.text ||
			`${focalLength}mm f/${img.exif?.FNumber.toFixed(1)} ${exposureTime}s iso${
				img.exif?.ISO
			}`;

		const paramY = rect1.y + (1 * (rect2.y - rect1.y)) / 3;
		ctx.fillText(
			params.letterUpperCase ? paramsText.toUpperCase() : paramsText,
			rect2.x,
			time.show ? paramY : centerY
		);
		ctx.restore();
	}

	// 绘制时间
	if (time.show) {
		ctx.save();
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = time.color;
		ctx.font = `${time.size}px ${config.font}`;

		const timeY = rect1.y + (2 * (rect2.y - rect1.y)) / 3;

		ctx.fillText(img.timeText, rect2.x, params.show ? timeY : centerY);
		ctx.restore();
	}
};
const config: Config = {
	name: "Lumix",
	font: "sans-serif",
	paddings: {
		top: 200, // 图片上边距
		right: 150,
		left: 150,
		bottom: 200,
	},
	watermark: {
		position: "inner",
		bgColor: "#50000000",
		height: 0.15,
		model: {
			enable: true,
			show: true,
			color: "#FFF",
			size: 120,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "#FFF",
			size: 90,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: false,
			text: "",
		},
		time: {
			enable: true,
			show: true,
			color: "#FFF",
			size: 80,
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
			lr: 100,
			tb: 0,
		},
		bg: "rgba(0, 0, 0, 0.4)",
	},
	radius: {
		enable: true,
		show: true,
		size: 30,
		uniform: true,
		lt: 30,
		rt: 30,
		lb: 30,
		rb: 30,
	},
	blur: {
		enable: true,
		size: 500,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		name: "lumix-white",
		width: 500,
		height: 500,
		circle: false,
		verticalOffset: 1,
	},
	divider: {
		enable: true,
		show: true,
		color: "#FFF",
		width: 10,
		scale: 1,
		margin: 1,
	},
	shadow: {
		show: true,
		color: "#808080",
		x: 0,
		y: 0,
		size: 50,
	},
	draw,
};

export default config;
