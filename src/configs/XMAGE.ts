import type { Config, DrawFun } from "../types";
import { drawLogo, replaceZ } from "../utils";

const draw: DrawFun = async (img, config, context) => {
	const { ctx, rect1, rect2 } = context;
	const { watermark, logo } = config;
	const {
		model,
		params,
		time,
		paddings: { left, right },
	} = watermark;
	const centerY = rect1.y + (rect2.y - rect1.y) / 2;

	if (model.show) {
		ctx.save();
		ctx.font = `${model.bold ? "bold" : ""} ${model.italic ? "italic" : ""} ${
			model.size
		}px ${config.font}`;
		ctx.fillStyle = model.color;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		const modelY = rect1.y + (rect2.y - rect1.y) / 3;

		const brand = img.modelText.split(" ")[0];
		const brandWidth = ctx.measureText(brand).width;
		ctx.fillText(brand, rect1.x + left, time.show ? modelY : centerY);

		ctx.font = `${model.italic ? "italic" : ""} ${model.size}px ${config.font}`;
		if (model.replaceZ) {
			img.modelText = replaceZ(img.modelText);
		}

		ctx.fillText(
			img.modelText.replace(brand, ""),
			rect1.x + left + brandWidth,
			time.show ? modelY : centerY
		);
		ctx.restore();
	}

	// 绘制logo
	if (logo.show) {
		ctx.save();
		const logoX = rect2.x - right - logo.width;
		let logoY = rect1.y + (rect2.y - rect1.y) / 3 - logo.height / 2;
		if (!params.show) {
			logoY = centerY - logo.height / 2;
		}

		drawLogo(logo, ctx, logoX, logoY - (logo.verticalOffset - 1) * logo.height);
		ctx.restore();
	}

	// 绘制参数
	if (params.show) {
		ctx.save();
		ctx.font = `${params.size}px ${config.font}`;
		ctx.fillStyle = params.color;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";

		const paramY = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
		ctx.fillText(img.paramsText, rect2.x - right, logo.show ? paramY : centerY);
		ctx.restore();
	}

	// 绘制时间
	if (time.show) {
		ctx.save();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillStyle = time.color;
		ctx.font = `${time.size}px ${config.font}`;

		const timeY = rect1.y + (2 * (rect2.y - rect1.y)) / 3;

		ctx.fillText(img.timeText, rect1.x + left, model.show ? timeY : centerY);
		ctx.restore();
	}
};
const config: Config = {
	name: "XMAGE",
	font: "sans-serif",
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		position: "bottom",
		height: 0.15,
		model: {
			enable: true,
			show: true,
			color: "#000000",
			size: 120,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			enable: true,
			show: true,
			color: "#000",
			size: 80,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
			italic: true,
			text: "Ultra Aperture XMAGE Camera",
		},
		time: {
			enable: true,
			show: false,
			color: "#808080",
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
			top: 50,
			bottom: 50,
			left: 120,
			right: 120,
		},
		bgColor: "#FFF",
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
		size: 200,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		name: "xmage-2",
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
	draw,
};

export default config;
