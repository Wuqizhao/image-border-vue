import {
	convertExposureTime,
	formatDate,
} from "../assets/tools";
import Exifr from "exifr";
import type { Config, Img } from "../types";

const config: Config = {
	paddings: {
		top: 100, // 图片上边距
		right: 100,
		left: 100,
		bottom: 50,
	},
	watermark: {
		model: {
			show: true,
			color: "#000000",
			size: 130,
		},
		params: {
			show: true,
			color: "#808080",
			size: 100,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			show: true,
			color: "#808080",
			size: 100,
			format: "yyyy-MM-dd HH:mm",
		},
		paddings: {
			lr: 0,
			tb: 100,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		size: 80,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: false,
		auto: false,
		show: false,
		name: "leica",
		width: 40,
		height: 40,
	},
	divider: {
		enable: false,
		show: false,
		color: "#808080",
		width: 2,
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 20,
		y: 20,
		size: 2,
	},
	draw: (file: File, img: Img, config: Config) => {
		doDraw(file, img, config);
	},
};
const doDraw = (file: File, img: Img, config: Config) => {
	if (!file) return;
	img.fileName = file.name;
	img.export.name = "WM_" + file.name;
	img.size = (file.size / 1024 / 1024).toFixed(2) + "MB";
	img.type = file.type;
	img.time = formatDate(new Date(file.lastModified));

	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = (e) => {
		const _img = new Image();
		if (e.target === null) throw new Error("图片不存在...");
		_img.src = <string>e.target.result;
		_img.onload = async () => {
			// 更新宽高
			img.width = _img.width;
			img.height = _img.height;

			// 使用exifr库读取exifs信息
			const exif = await Exifr.parse(file);
			img.exif = exif;

			// 获取比例
			const boxScale = img.width / img.height;
			// 调整canvasBox容器的比例
			const canvasBox = document.getElementById("canvasBox") as HTMLDivElement;
			const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				const scale = img.export.quality;
				const realImgWidth = img.width * scale;
				const realImgHeight = img.height * scale;

				// 修改画布大小
				canvas.width =
					realImgWidth + config.paddings.left + config.paddings.right;
				canvas.height =
					realImgHeight + config.paddings.top + config.paddings.bottom;
				canvas.height += 0.1 * canvas.height + 2 * config.watermark.paddings.tb;

				// 打印底部水印的坐标范围
				const rect1 = {
					x: 0 + config.paddings.left,
					y:
						realImgHeight +
						config.paddings.top +
						config.paddings.bottom +
						config.watermark.paddings.tb,
				};
				const rect2 = {
					x: canvas.width - config.paddings.right,
					y: canvas.height - config.watermark.paddings.tb,
				};

				if (config.blur && config.blur.enable) {
					ctx.save();
					ctx.filter = `blur(${config.blur.size}px)`;
					ctx.drawImage(_img, 0, 0, canvas.width, canvas.height);
					ctx.restore();
				} else if (config.watermark.bgColor) {
					ctx.fillStyle = config.watermark.bgColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				} else {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				canvasBox.style.height = `${900 / boxScale}px`;

				// 绘制阴影
				if (config.shadow.show) {
					ctx.save();
					// 绘制矩形阴影
					ctx.fillStyle = config.shadow.color;
					// 模糊
					ctx.filter = `blur(${config.shadow.size}px)`;

					ctx.fillRect(
						config.paddings.left + config.shadow.x - config.shadow.size,
						config.paddings.top + config.shadow.y - config.shadow.size,
						realImgWidth + config.shadow.size,
						realImgHeight + config.shadow.size
					);
					ctx.restore();
				}

				// 绘制圆角图片
				if (config.radius.enable) {
					ctx.save();
					const radius = config.radius.size;
					ctx.beginPath();
					ctx.moveTo(config.paddings.left + radius, config.paddings.top);
					ctx.lineTo(
						canvas.width - config.paddings.right - radius,
						config.paddings.top
					);
					ctx.quadraticCurveTo(
						canvas.width - config.paddings.right,
						config.paddings.top,
						canvas.width - config.paddings.right,
						config.paddings.top + radius
					);
					ctx.lineTo(
						canvas.width - config.paddings.right,
						realImgHeight + config.paddings.top - radius
					);
					ctx.quadraticCurveTo(
						canvas.width - config.paddings.right,
						realImgHeight + config.paddings.top,
						canvas.width - config.paddings.right - radius,
						realImgHeight + config.paddings.top
					);
					ctx.lineTo(
						config.paddings.left + radius,
						realImgHeight + config.paddings.top
					);
					ctx.quadraticCurveTo(
						config.paddings.left,
						realImgHeight + config.paddings.top,
						config.paddings.left,
						realImgHeight + config.paddings.top - radius
					);
					ctx.lineTo(config.paddings.left, config.paddings.top + radius);
					ctx.quadraticCurveTo(
						config.paddings.left,
						config.paddings.top,
						config.paddings.left + radius,
						config.paddings.top
					);
					ctx.closePath();
					ctx.clip();
				}

				// 绘制图片
				ctx.drawImage(
					_img,
					0 + config.paddings.left,
					0 + config.paddings.top,
					realImgWidth,
					realImgHeight
				);
				ctx.restore();

				// 绘制型号
				const modelConfig = config.watermark.model;
				if (modelConfig.show) {
					ctx.save(); // 保存当前绘图状态
					ctx.font = `bold ${modelConfig.size}px Arial`;
					ctx.fillStyle = modelConfig.color;
					ctx.textAlign = "left";
					ctx.textBaseline = "top";
					// 高度在1/3处
					const _y = rect1.y;
					// 截取厂商
					const company = exif?.Model?.split(" ")[0];
					// 计算厂商的宽度
					const companyWidth = ctx.measureText(company).width;

					ctx.fillText(
						company,
						config.paddings.left + config.watermark.paddings.lr,
						_y
					);

					ctx.font = `${modelConfig.size}px Arial`;
					ctx.fillText(
						exif.Model.replace(company, ""),
						config.paddings.left + config.watermark.paddings.lr + companyWidth,
						_y
					);
					ctx.restore(); // 恢复之前的绘图状态
				}

				// 绘制曝光三要素和焦段参数
				const paramsConfig = config.watermark.params;
				if (paramsConfig.show) {
					ctx.fillStyle = paramsConfig.color;
					ctx.font = `${paramsConfig.size}px Arial`;
					ctx.textBaseline = "middle";
					const params = `${convertExposureTime(exif?.ExposureTime)}s  f/${
						exif?.FNumber
					}  ISO ${exif?.ISO}  ${
						paramsConfig.useEquivalentFocalLength
							? exif?.FocalLengthIn35mmFormat
							: exif?.FocalLength
					}mm`;
					// 高度在2/3处
					const _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
					ctx.fillText(
						paramsConfig.letterUpperCase ? params.toLocaleUpperCase() : params,
						config.paddings.left + config.watermark.paddings.lr,
						_y
					);
				}

				// 绘制拍摄时间
				const timeConfig = config.watermark.time;
				if (timeConfig.show) {
					const shotTime = formatDate(
						new Date(exif?.DateTimeOriginal),
						timeConfig.format
					);
					ctx.textAlign = "right";
					ctx.textBaseline = "middle";
					ctx.fillStyle = timeConfig.color;
					ctx.font = `${timeConfig.size}px Arial`;

					// 在水印范围内垂直居中
					const _y = (rect2.y + rect1.y) / 2;
					ctx.fillText(
						shotTime,
						canvas.width - config.paddings.right - config.watermark.paddings.lr,
						_y
					);
				}
			}
		};
	};
};

export default config;
